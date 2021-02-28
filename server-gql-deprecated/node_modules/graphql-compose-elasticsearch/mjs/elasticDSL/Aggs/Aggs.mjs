import { getAggBlockITC } from './AggBlock';
export function getAggsITC(opts) {
  return [getAggBlockITC(opts)];
}
export function prepareAggsInResolve(aggs, fieldMap) {
  if (Array.isArray(aggs)) {
    return convertAggsBlocks(aggs);
  }

  return aggs;
}
export function convertAggsBlocks(blockList) {
  const result = {};
  blockList.forEach(block => {
    if (block.key && block.value) {
      result[block.key] = convertAggsRules(block.value);
    }
  });
  return result;
}
export function convertAggsRules(rules) {
  const result = {};
  Object.keys(rules).forEach(key => {
    if (key === 'aggs' && rules.aggs) {
      result.aggs = convertAggsBlocks(rules.aggs);
    } else {
      result[key] = rules[key];
    }
  });
  return result;
}