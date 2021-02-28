import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, desc } from '../../../utils';
export function getTypeITC(opts) {
  const name = getTypeName('QueryType', opts);
  const description = desc(`
    Filters documents matching the provided document / mapping type.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-type-query.html)
  `);
  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      value: 'String'
    }
  }));
}