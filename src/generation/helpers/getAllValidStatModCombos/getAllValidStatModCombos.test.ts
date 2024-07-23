import { getDefaultGenericRequiredModCombos, paretoOptimalModCombinations } from "@/generation/definitions";
import { tester } from "@/tests";
import { produce } from "immer";
import { getAllValidStatModCombos } from "./getAllValidStatModCombos";

const testFunc = tester('getAllValidStatModCombos', getAllValidStatModCombos);

const defaultInput: Parameters<typeof getAllValidStatModCombos> = [
  {
    distances: [0, 0, 0, 0, 0, 0],
    distanceToModCombinationsMapping: paretoOptimalModCombinations,
  },
];

const defaultOutput: ReturnType<typeof getAllValidStatModCombos> = [getDefaultGenericRequiredModCombos()];

testFunc({
  name: 'returns empty array for default input',
  input: defaultInput,
  outputResolver: (output) => {
    expect(output).toEqual(defaultOutput);
  },
});

testFunc({
  name: 'returns null for impossible distances',
  input:
    produce(defaultInput, (draft) => {
      draft[0].distances = [20, 20, 20, 20, 20, 20];
    }),
  outputResolver: (output) => {
    expect(output).toBeNull();
  },
});


testFunc({
  name: 'returns valid stat mod combos for possible distances',
  input: produce(defaultInput, (draft) => {
    draft[0].distances = [10, 10, 10, 10, 10, 10];
  }),
  outputResolver: (output) => {
    // All six permutations of 5 major mods and 4 artifice mods
    expect(output?.length).toEqual(6);
  },
});