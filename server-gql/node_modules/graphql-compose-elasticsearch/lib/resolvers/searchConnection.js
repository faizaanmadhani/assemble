"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSearchConnectionResolver;
exports.base64 = base64;
exports.unbase64 = unbase64;
exports.cursorToData = cursorToData;
exports.dataToCursor = dataToCursor;

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createSearchConnectionResolver(opts, searchResolver) {
  const resolver = searchResolver.clone({
    name: `searchConnection`
  });
  resolver.addArgs({
    first: 'Int',
    after: 'String',
    last: 'Int',
    before: 'String'
  }).removeArg(['limit', 'skip']).reorderArgs(['q', 'query', 'sort', 'aggs', 'first', 'after', 'last', 'before']);
  const searchTC = searchResolver.getOTC();

  if (!searchTC) {
    throw new Error('Cannot get ObjectTypeComposer from resolver. Maybe resolver return Scalar?!');
  }

  const typeName = searchTC.getTypeName();
  resolver.setType(searchTC.clone(`${typeName}Connection`).addFields({
    pageInfo: getPageInfoTC(opts),
    edges: [opts.schemaComposer.createObjectTC({
      name: `${typeName}Edge`,
      fields: {
        node: searchTC.get('hits'),
        cursor: 'String!'
      }
    })]
  }).removeField('hits').reorderFields(['count', 'pageInfo', 'edges', 'aggregations']));

  resolver.resolve = async rp => {
    const {
      args = {},
      projection = {}
    } = rp;

    if (!args.sort || !Array.isArray(args.sort) || args.sort.length === 0) {
      throw new Error('Argument `sort` is required for the Relay Connection. According to ' + 'the fields in `sort` will be constructed `cursor`s for every edge. ' + 'Values of fields which used in `sort` should be unique in compound.');
    }

    const first = parseInt(args.first, 10) || 0;

    if (first < 0) {
      throw new Error('Argument `first` should be non-negative number.');
    }

    const last = parseInt(args.last, 10) || 0;

    if (last < 0) {
      throw new Error('Argument `last` should be non-negative number.');
    }

    const {
      before,
      after
    } = args;
    delete args.before;
    delete args.after;

    if (before !== undefined) {
      throw new Error('Elastic does not support before cursor.');
    }

    if (after) {
      if (!args.body) args.body = {};
      const tmp = cursorToData(after);

      if (Array.isArray(tmp)) {
        args.body.search_after = tmp;
      }
    }

    const limit = last || first || 20;
    const skip = last > 0 ? first - last : 0;
    delete args.last;
    delete args.first;
    args.limit = limit + 1; // +1 document, to check next page presence

    args.skip = skip;

    if (projection.edges) {
      projection.hits = projection.edges.node;
      delete projection.edges;
    }

    const res = await searchResolver.resolve(rp);
    let list = res.hits || [];
    const hasExtraRecords = list.length > limit;
    if (hasExtraRecords) list = list.slice(0, limit);
    const cursorMap = new Map();
    const edges = list.map(node => {
      const cursor = dataToCursor(node.sort);

      if (cursorMap.has(cursor)) {
        throw new Error(`Argument \`sort {${args.sort.join(', ')}}\` must be more complex! ` + 'Values from record which are used in `sort` will be used for `cursor` fields. ' + 'According to connection spec `cursor` must be unique for every node.' + 'Detected that two nodes have ' + `the same cursors '${cursor}' with data '${unbase64(cursor)}'. ` + 'You must add more `sort` fields, which provide unique data ' + 'for all cursors in the result set.');
      }

      cursorMap.set(cursor, node);
      return {
        node,
        cursor
      };
    });

    const result = _objectSpread({}, res, {
      pageInfo: {
        hasNextPage: limit > 0 && hasExtraRecords,
        hasPreviousPage: false,
        // Elastic does not support before cursor
        startCursor: edges.length > 0 ? edges[0].cursor : null,
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null
      },
      edges
    });

    return result;
  };

  return resolver;
}

function getPageInfoTC(opts) {
  const name = (0, _utils.getTypeName)('PageInfo', opts);

  if (opts.schemaComposer.has(name)) {
    return opts.schemaComposer.getOTC(name);
  }

  return opts.schemaComposer.createObjectTC(`
    # Information about pagination in a connection.
    type ${name} {
      # When paginating forwards, are there more items?
      hasNextPage: Boolean!

      # When paginating backwards, are there more items?
      hasPreviousPage: Boolean!

      # When paginating backwards, the cursor to continue.
      startCursor: String

      # When paginating forwards, the cursor to continue.
      endCursor: String
    }
  `);
}

function base64(i) {
  return Buffer.from(i, 'ascii').toString('base64');
}

function unbase64(i) {
  return Buffer.from(i, 'base64').toString('ascii');
}

function cursorToData(cursor) {
  if (typeof cursor === 'string') {
    try {
      return JSON.parse(unbase64(cursor)) || null;
    } catch (err) {
      return null;
    }
  }

  return null;
}

function dataToCursor(data) {
  if (!data) return '';
  return base64(JSON.stringify(data));
}