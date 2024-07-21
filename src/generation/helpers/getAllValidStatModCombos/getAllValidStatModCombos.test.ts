import { getDefaultArmorStatMapping } from "@/definitions/ArmorStat";
import { EArmorStatId } from "@/definitions/IdEnums";
import { getDefaultStatModCombo, paretoOptimalModCombinations } from "@/generation/definitions";
import { tester } from "@/tests";
import { produce } from "immer";
import { getAllValidStatModCombos } from "./getAllValidStatModCombos";

const testFunc = tester('getAllValidStatModCombos', getAllValidStatModCombos);

const defaultInput: Parameters<typeof getAllValidStatModCombos> = [
  {
    distances: getDefaultArmorStatMapping(),
    distanceToModCombinationsMapping: paretoOptimalModCombinations,
  },
];

const defaultOutput: ReturnType<typeof getAllValidStatModCombos> = [getDefaultStatModCombo()];

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
      draft[0].distances = {
        [EArmorStatId.Mobility]: 20,
        [EArmorStatId.Resilience]: 20,
        [EArmorStatId.Recovery]: 20,
        [EArmorStatId.Discipline]: 20,
        [EArmorStatId.Intellect]: 20,
        [EArmorStatId.Strength]: 20
      }
    }),
  outputResolver: (output) => {
    expect(output).toBeNull();
  },
});


testFunc({
  name: 'returns valid stat mod combos for possible distances',
  input: produce(defaultInput, (draft) => {
    draft[0].distances = {
      [EArmorStatId.Mobility]: 10,
      [EArmorStatId.Resilience]: 10,
      [EArmorStatId.Recovery]: 10,
      [EArmorStatId.Discipline]: 10,
      [EArmorStatId.Intellect]: 10,
      [EArmorStatId.Strength]: 10
    }
  }),
  outputResolver: (output) => {
    // All six permutations of 5 major mods and 4 artifice mods
    expect(output?.length).toEqual(6);
  },
});