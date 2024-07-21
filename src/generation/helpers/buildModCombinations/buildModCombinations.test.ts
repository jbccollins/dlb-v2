import { tester } from "@/tests";
import buildModCobmiantions from "./buildModCombinations";

const testFunc = tester('buildModCobmiantions', buildModCobmiantions);

testFunc({
  name: 'generates all pareto optimal combinations for the distance of 2',
  input: [],
  outputResolver: (output) => {
    expect(output.paretoOptimalRequiredModMapping[2]).toEqual([
      {
        numArtificeMods: 0,
        numMajorMods: 0,
        numMinorMods: 1,
        exactStatPoints: 5,
      },
      {
        numArtificeMods: 1,
        numMajorMods: 0,
        numMinorMods: 0,
        exactStatPoints: 3,
      },
    ])
  },
});

testFunc({
  name: 'generates all pareto optimal combinations for the distance of 19',
  input: [],
  outputResolver: (output) => {
    expect(output.paretoOptimalRequiredModMapping[19]).toEqual([
      {
        numArtificeMods: 0,
        numMajorMods: 0,
        numMinorMods: 4,
        exactStatPoints: 20,
      },
      {
        numArtificeMods: 0,
        numMajorMods: 1,
        numMinorMods: 2,
        exactStatPoints: 20,
      },
      {
        numArtificeMods: 0,
        numMajorMods: 2,
        numMinorMods: 0,
        exactStatPoints: 20,
      },
      {
        numArtificeMods: 2,
        numMajorMods: 0,
        numMinorMods: 3,
        exactStatPoints: 21,
      },
      {
        numArtificeMods: 2,
        numMajorMods: 1,
        numMinorMods: 1,
        exactStatPoints: 21,
      },
      {
        numArtificeMods: 3,
        numMajorMods: 0,
        numMinorMods: 2,
        exactStatPoints: 19,
      },
      {
        numArtificeMods: 3,
        numMajorMods: 1,
        numMinorMods: 0,
        exactStatPoints: 19,
      },
      {
        numArtificeMods: 5,
        numMajorMods: 0,
        numMinorMods: 1,
        exactStatPoints: 20,
      },
    ])
  },
});

testFunc({
  name: 'generates all zero wasted stat combinations for the distance of 2',
  input: [],
  outputResolver: (output) => {
    expect(output.zeroWastedStatsRequiredModMapping[2]).toEqual([{ "numArtificeMods": 4, "numMajorMods": 0, "numMinorMods": 0, "exactStatPoints": 12 }])
  },
});