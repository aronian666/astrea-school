type Variant = {
  [key: string]: string;
};

type Combination = {
  variant: Variant;
  value: number;
  quantity: number;
};

export function combination(input: { [key: string]: string[] }): Combination[] {
  const keys = Object.keys(input);
  const combinations: Combination[] = [];

  function combine(prefix: Variant, index: number) {
    if (index === keys.length) {
      combinations.push({ variant: { ...prefix }, value: 0, quantity: 0 });
      return;
    }

    const key = keys[index];
    const values = input[key];

    for (const value of values) {
      prefix[key] = value;
      combine(prefix, index + 1);
    }
  }

  combine({}, 0);

  return combinations;
}
