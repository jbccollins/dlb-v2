import { describe, test } from '@jest/globals';

// Define the genericTestWrapper with explicit type parameters for the test function's argument and return types
function genericTestWrapper<Args extends any[], R>(
  description: string,
  testFunction: (...args: Args) => R,
  testCase: {
    name: string;
    input: Args;
    outputResolver: (output: R) => void;
  }
) {
  describe(description, () => {
    test(testCase.name, () => {
      const result = testFunction(...testCase.input);
      testCase.outputResolver(result);
    });
  });
}

// Define the tester function that curries genericTestWrapper
export function tester<Args extends any[], R>(description: string, testFunction: (...args: Args) => R) {
  return (testCase: {
    name: string;
    input: Args;
    outputResolver: (output: R) => void;
  }) => genericTestWrapper(description, testFunction, testCase);
}