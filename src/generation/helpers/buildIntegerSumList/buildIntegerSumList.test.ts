import { tester } from "@/tests";
import buildIntegerSumList from "./buildIntegerSumList";

const testFunc = tester('buildIntegerSumList', buildIntegerSumList);

testFunc({
  name: 'generates all combinations of 2 numbers that sum to 2',
  input: [2, 2],
  outputResolver: (output) => {
    expect(output).toEqual([
      [2, 0],
      [1, 1],
    ]);
  },
});

testFunc({
  name: 'generates all combinations of 3 numbers that sum to 4',
  input: [4, 3],
  outputResolver: (output) => {
    expect(output).toEqual([
      [4, 0, 0],
      [3, 1, 0],
      [2, 2, 0],
      [2, 1, 1],
    ]);
  },
});