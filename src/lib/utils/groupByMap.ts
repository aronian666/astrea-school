export function groupByMap<Type, KeyType>(array: Type[], fallback: (element: Type) => KeyType): Map<KeyType, Type[]> {
  return array.reduce((map, element) => {
    const key = fallback(element);
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key)!.push(element);
    return map;
  }, new Map<KeyType, Type[]>());
}
