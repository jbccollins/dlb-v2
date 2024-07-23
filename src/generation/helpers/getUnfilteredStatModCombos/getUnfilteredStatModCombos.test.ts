
import { paretoOptimalModCombinations, zeroWastedStatsModCombinations } from "@/generation/definitions";
import { NUM_ARMOR_STATS } from "@/lib/constants";
import { tester } from "@/tests";
import { produce } from "immer";
import getUnfilteredStatModCombos from "./getUnfilteredStatModCombos";


const testFunc = tester('getUnfilteredStatModCombos', getUnfilteredStatModCombos);
const defaultInput: Parameters<typeof getUnfilteredStatModCombos> = [
  {
    distances: [0, 0, 0, 0, 0, 0],
    distanceToModCombinationsMapping: paretoOptimalModCombinations,
  },
];

const defaultOutput: ReturnType<typeof getUnfilteredStatModCombos> = [[], [], [], [], [], []]

testFunc({
  name: 'returns empty arrays for default input',
  input: defaultInput,
  outputResolver: (output) => {
    expect(output).toEqual(defaultOutput);
  },
});

// Adjusting defaultInput for a target stat shortfall of 5 in mobility
const inputWithMobilityShortfall = produce(defaultInput, (draft) => {
  draft[0].distances[0] = 5;
});

const outputWithMobilityShortfall = produce(defaultOutput, (draft) => {
  draft[0] = [
    {
      exactStatPoints: 5,
      numArtificeMods: 0,
      numMajorMods: 0,
      numMinorMods: 1,
    },
    {
      exactStatPoints: 6,
      numArtificeMods: 2,
      numMajorMods: 0,
      numMinorMods: 0,
    },
  ];
});

testFunc({
  name: 'handles a target stat shortfall of 5 mobility',
  input: inputWithMobilityShortfall,
  outputResolver: (output) => {
    for (let i = 0; i < NUM_ARMOR_STATS; i++) {
      expect(output![i]).toEqual(outputWithMobilityShortfall[i]);
    }
  },
});

// Adjusting defaultInput for a target stat shortfall of 5 in mobility
const inputWithUnachievableZeroWastedStats = produce(defaultInput, (draft) => {
  draft[0].distances[0] = 58;
  draft[0].distanceToModCombinationsMapping = zeroWastedStatsModCombinations
});

testFunc({
  name: 'handles the case where it is impossible to achieve the target stats',
  input: inputWithUnachievableZeroWastedStats,
  outputResolver: (output) => {
    expect(output).toBeNull();
  },
});