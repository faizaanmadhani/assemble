"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createSearchPaginationResolver;

var _utils = require("../utils");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function createSearchPaginationResolver(opts, searchResolver) {
  const resolver = searchResolver.clone({
    name: `searchPagination`
  });
  resolver.addArgs({
    page: 'Int',
    perPage: {
      type: 'Int',
      defaultValue: 20
    }
  }).removeArg(['limit', 'skip']).reorderArgs(['q', 'query', 'sort', 'aggs', 'page', 'perPage']);
  const searchTC = searchResolver.getOTC();

  if (!searchTC) {
    throw new Error('Cannot get ObjectTypeComposer from resolver. Maybe resolver return Scalar?!');
  }

  const typeName = searchTC.getTypeName();
  resolver.setType(searchTC.clone(`${typeName}Pagination`).addFields({
    pageInfo: getPageInfoTC(opts),
    items: [searchTC.get('hits')]
  }).removeField('hits').reorderFields(['items', 'count', 'pageInfo', 'aggregations']));

  resolver.resolve = async rp => {
    const {
      args = {},
      projection = {}
    } = rp;
    const page = args.page || 1;

    if (page <= 0) {
      throw new Error('Argument `page` should be positive number.');
    }

    const perPage = args.perPage || 20;

    if (perPage <= 0) {
      throw new Error('Argument `perPage` should be positive number.');
    }

    delete args.page;
    delete args.perPage;
    args.limit = perPage;
    args.skip = (page - 1) * perPage;

    if (projection.items) {
      projection.hits = projection.items;
      delete projection.items;
    }

    const res = await searchResolver.resolve(rp);
    const items = res.hits || [];
    const itemCount = res.count || 0;

    const result = _objectSpread({}, res, {
      pageInfo: {
        hasNextPage: itemCount > page * perPage,
        hasPreviousPage: page > 1,
        currentPage: page,
        perPage,
        pageCount: Math.ceil(itemCount / perPage),
        itemCount
      },
      items
    });

    return result;
  };

  return resolver;
}

function getPageInfoTC(opts) {
  const name = (0, _utils.getTypeName)('PaginationInfo', opts);

  if (opts.schemaComposer.has(name)) {
    return opts.schemaComposer.getOTC(name);
  }

  return opts.schemaComposer.createObjectTC(`
    # Information about pagination.
    type ${name} {
      # Current page number
      currentPage: Int!

      # Number of items per page
      perPage: Int!

      # Total number of pages
      pageCount: Int

      # Total number of items
      itemCount: Int

      # When paginating forwards, are there more items?
      hasNextPage: Boolean

      # When paginating backwards, are there more items?
      hasPreviousPage: Boolean
    }
  `);
}