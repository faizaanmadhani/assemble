import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, desc } from '../../../utils';
export function getIdsITC(opts) {
  const name = getTypeName('QueryIds', opts);
  const description = desc(`
    Filters documents that only have the provided ids.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-ids-query.html)
  `);
  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      type: 'String!',
      values: '[String]!'
    }
  }));
}