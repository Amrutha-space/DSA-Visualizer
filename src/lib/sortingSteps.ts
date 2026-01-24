export type Step =
  | { type: "compare"; i: number; j: number }
  | { type: "swap"; i: number; j: number }
  | { type: "pivot"; index: number }
  | { type: "sorted"; index: number };

export const bubbleSortSteps = (arr: number[]): Step[] => {
  const steps: Step[] = [];
  const a = [...arr];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ type: "compare", i: j, j: j + 1 });

      if (a[j] > a[j + 1]) {
        steps.push({ type: "swap", i: j, j: j + 1 });
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
    steps.push({ type: "sorted", index: n - i - 1 });
  }
  steps.push({ type: "sorted", index: 0 });

  return steps;
};
