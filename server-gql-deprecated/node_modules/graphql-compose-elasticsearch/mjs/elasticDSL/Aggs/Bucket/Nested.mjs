import { InputTypeComposer } from 'graphql-compose';
import { getTypeName, desc } from '../../../utils';
export function getNestedITC(opts) {
  const name = getTypeName('AggsNested', opts);
  const description = desc(`
    A special single bucket aggregation that enables aggregating nested documents.
    [Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-bucket-nested-aggregation.html)
  `);
  return opts.getOrCreateITC(name, () => ({
    name,
    description,
    fields: {
      path: 'String'
    }
  }));
}