type GroupByCallback<T> = (item: T) => string | number;

export function groupBy<T>(array: T[], callback: GroupByCallback<T>): Record<string, T[]> {
  return array.reduce((result, item) => {
    const key = callback(item);
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
    return result;
  }, {} as Record<string, T[]>);
}