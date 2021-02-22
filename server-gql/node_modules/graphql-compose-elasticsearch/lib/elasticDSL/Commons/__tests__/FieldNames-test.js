"use strict";

var _graphqlCompose = require("graphql-compose");

var FieldNames = _interopRequireWildcard(require("../FieldNames"));

var _utils = require("../../../utils");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

beforeEach(() => {
  _graphqlCompose.schemaComposer.clear();
});
const fieldMap = {
  _all: {
    text1: {},
    text2: {},
    keyword1: {},
    int1: {},
    float1: {},
    double1: {},
    date1: {},
    boolean1: {},
    geo1: {},
    nested1: {},
    ip1: {}
  },
  text: {
    text1: {},
    text2: {}
  },
  keyword: {
    keyword1: {}
  },
  integer: {
    int1: {}
  },
  float: {
    float1: {}
  },
  double: {
    double1: {}
  },
  date: {
    date1: {}
  },
  boolean: {
    boolean1: {}
  },
  geo_point: {
    geo1: {}
  },
  nested: {
    nested1: {}
  },
  ip: {
    ip1: {}
  }
};
const opts = {
  fieldMap
};
describe('FieldNames', () => {
  it('getStringFields()', () => {
    const type = FieldNames.getStringFields((0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, opts));
    expect(type).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticStringFields');
    expect(type.getFields()).toMatchObject({
      keyword1: {
        value: 'keyword1'
      },
      text1: {
        value: 'text1'
      },
      text2: {
        value: 'text2'
      }
    });
  });
  it('getNumericFields()', () => {
    const type = FieldNames.getNumericFields((0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, opts));
    expect(type).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticNumericFields');
    expect(type.getFields()).toMatchObject({
      double1: {
        value: 'double1'
      },
      float1: {
        value: 'float1'
      },
      int1: {
        value: 'int1'
      }
    });
  });
  it('getDateFields()', () => {
    const type = FieldNames.getDateFields((0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, opts));
    expect(type).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticDateFields');
    expect(type.getFields()).toMatchObject({
      date1: {
        value: 'date1'
      }
    });
  });
  it('getBooleanFields()', () => {
    const type = FieldNames.getBooleanFields((0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, opts));
    expect(type).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticBooleanFields');
    expect(type.getFields()).toMatchObject({
      boolean1: {
        value: 'boolean1'
      }
    });
  });
  it('getGeoPointFields()', () => {
    const type = FieldNames.getGeoPointFields((0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, opts));
    expect(type).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticGeoPointFields');
    expect(type.getFields()).toMatchObject({
      geo1: {
        value: 'geo1'
      }
    });
  });
  it('getNestedFields()', () => {
    const type = FieldNames.getNestedFields((0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, opts));
    expect(type).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticNestedFields');
    expect(type.getFields()).toMatchObject({
      nested1: {
        value: 'nested1'
      }
    });
  });
  it('getIpFields()', () => {
    const type = FieldNames.getIpFields((0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, opts));
    expect(type).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticIpFields');
    expect(type.getFields()).toMatchObject({
      ip1: {
        value: 'ip1'
      }
    });
  });
  it('getAllFields()', () => {
    const type = FieldNames.getAllFields((0, _utils.prepareCommonOpts)(_graphqlCompose.schemaComposer, opts));
    expect(type).toBeInstanceOf(_graphqlCompose.EnumTypeComposer);
    expect(type.getDescription()).toBe('Avaliable fields from mapping.');
    expect(type.getTypeName()).toBe('ElasticAllFields');
    expect(type.getFields()).toMatchObject({
      boolean1: {
        value: 'boolean1'
      },
      date1: {
        value: 'date1'
      },
      double1: {
        value: 'double1'
      },
      float1: {
        value: 'float1'
      },
      geo1: {
        value: 'geo1'
      },
      int1: {
        value: 'int1'
      },
      ip1: {
        value: 'ip1'
      },
      keyword1: {
        value: 'keyword1'
      },
      nested1: {
        value: 'nested1'
      },
      text1: {
        value: 'text1'
      },
      text2: {
        value: 'text2'
      }
    });
  });
  it('should return string if mapping not provided', () => {
    expect(FieldNames.getStringFields({})).toEqual('String');
    expect(FieldNames.getNumericFields({})).toEqual('String');
    expect(FieldNames.getDateFields({})).toEqual('String');
    expect(FieldNames.getBooleanFields({})).toEqual('String');
    expect(FieldNames.getGeoPointFields({})).toEqual('String');
    expect(FieldNames.getNestedFields({})).toEqual('String');
    expect(FieldNames.getIpFields({})).toEqual('String');
    expect(FieldNames.getAllFields({})).toEqual('String');
  });
});