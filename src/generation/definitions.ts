import * as integerSumListsJSON from '@/generation/generated/integerSumLists.json';
import * as paretoOptimalModCombinationsJSON from '@/generation/generated/paretoOptimalModCombinations.json';
import * as zeroWastedStatsModCombinationsJSON from '@/generation/generated/zeroWastedStatsModCombinations.json';

export const paretoOptimalModCombinations = paretoOptimalModCombinationsJSON as unknown as DistanceToModCombinationsMapping;
export const zeroWastedStatsModCombinations = zeroWastedStatsModCombinationsJSON as unknown as DistanceToModCombinationsMapping;
export const integerSumLists = integerSumListsJSON as unknown as DistanceToIntegerSumListsMappping;

// https://stackoverflow.com/a/39495173
export type Enumerate<
  N extends number,
  Acc extends number[] = []
> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>;

export type IntRange<F extends number, T extends number> = Exclude<
  Enumerate<T>,
  Enumerate<F>
>;


/*
  "4-10-0-0-0-0": [
    [[numArtifice, numMajorNum, numMinor], [numArtifice, numMajorNum, numMinor], ...],
  ]
*/
export type AllDistancesToAllModCombinationsMapping = Record<string, number[][]>;

export type GenericRequiredModCombo = {
  numArtificeMods: number;
  numMajorMods: number;
  numMinorMods: number;
  exactStatPoints: number;
};

export type SixGRMC = [GenericRequiredModCombo, GenericRequiredModCombo, GenericRequiredModCombo, GenericRequiredModCombo, GenericRequiredModCombo, GenericRequiredModCombo];

export const getDefaultGenericRequiredModCombo = (): GenericRequiredModCombo => ({
  numArtificeMods: 0,
  numMajorMods: 0,
  numMinorMods: 0,
  exactStatPoints: 0,
});

export const getDefaultGenericRequiredModCombos = (): SixGRMC => ([
  getDefaultGenericRequiredModCombo(),
  getDefaultGenericRequiredModCombo(),
  getDefaultGenericRequiredModCombo(),
  getDefaultGenericRequiredModCombo(),
  getDefaultGenericRequiredModCombo(),
  getDefaultGenericRequiredModCombo(),
])

export type DistanceToModCombinationsMapping = {
  [K in keyof Record<IntRange<1, 65>, never>]: GenericRequiredModCombo[];
};

export type DistanceToIntegerSumListsMappping = {
  [K in keyof Record<IntRange<1, 65>, never>]: number[][];
};

export type DistanceToCondesedStatModCombosMapping = {
  [K in keyof Record<IntRange<1, 65>, never>]: number[][][][];
};

export type StatList = [number, number, number, number, number, number];