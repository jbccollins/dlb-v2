// Usage: 
// How many unique ways are there to hit the max potential stat boost
// using six stats?
// const combinations = buildIntegerSumList(MAX_POTENTIAL_STAT_BOOST, 6);
// Given a target number and a count, generate all combinations of count numbers that sum to the target number.
export default function buildIntegerSumList(target: number, count: number): number[][] {
  const results: number[][] = [];
  const uniqueCombinations = new Set<string>();

  function backtrack(start: number, remaining: number, path: number[]): void {
    if (path.length === count) {
      if (remaining === 0) {
        const sortedPath = [...path].sort((a, b) => b - a); // Sort each combination in descending order
        const key = sortedPath.join(',');
        if (!uniqueCombinations.has(key)) {
          uniqueCombinations.add(key);
          results.push(sortedPath);
        }
      }
      return;
    }

    for (let i = start; i <= target; i++) {
      path.push(i);
      backtrack(i, remaining - i, path);
      path.pop();
    }
  }

  backtrack(0, target, []);

  // Sort the results array by comparing the sub-arrays in descending order
  results.sort((a, b) => {
    for (let i = 0; i < count; i++) {
      if (a[i] !== b[i]) return b[i] - a[i];
    }
    return 0;
  });

  return results;
}