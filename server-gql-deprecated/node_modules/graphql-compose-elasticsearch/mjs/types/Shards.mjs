import { ObjectTypeComposer } from 'graphql-compose';
import { getTypeName } from '../utils';
export default function getShardsTC(opts) {
  const name = getTypeName('MetaShards', opts);
  return opts.getOrCreateOTC(name, () => ({
    name,
    fields: {
      total: 'Int',
      successful: 'Int',
      failed: 'Int'
    }
  }));
}