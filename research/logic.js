export const and3 = values => values.includes(false) ? false : values.includes(null) ? null : true;
export const or3 = values => values.includes(true) ? true : values.includes(null) ? null : false;
export function evaluate(rule, context) {
  return or3(rule.any_of.map(group => and3(group.all_of.map(c =>
    context[c.field] === undefined || context[c.field] === null ? null : context[c.field] === c.value))));
}
// Retained as a pure, non-UI research function. Never used to rank patient applicability in this release.
export function classify(record, context) {
  if (record.record_type === 'navigation_only') return 'related';
  const applies = evaluate(record.applicability, context), excludes = evaluate(record.exclusions, context);
  if (applies === false || excludes === true) return 'related';
  return applies === true && excludes === false ? 'matches' : 'possible';
}
