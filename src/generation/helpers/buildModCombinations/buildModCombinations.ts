import { GenericRequiredModCombo, IntRange } from '@/generation/definitions';
import { ARTIFICE_MOD_BONUS_VALUE, MAJOR_MOD_BONUS_VALUE, MAX_POTENTIAL_STAT_BOOST, MIN_POTENTIAL_STAT_BOOST, MINOR_MOD_BONUS_VALUE, NUM_ARMOR_PIECES } from '@/lib/constants';

function generateModCombinations(): GenericRequiredModCombo[] {
  const result: GenericRequiredModCombo[] = [];

  for (
    let numArtificeMods = 0;
    numArtificeMods <= NUM_ARMOR_PIECES;
    numArtificeMods++
  ) {
    for (
      let numMajorMods = 0;
      numMajorMods <= NUM_ARMOR_PIECES;
      numMajorMods++
    ) {
      for (
        let numMinorMods = 0;
        numMinorMods <= NUM_ARMOR_PIECES;
        numMinorMods++
      ) {
        if (numMajorMods + numMinorMods <= NUM_ARMOR_PIECES) {
          const exactStatPoints =
            numArtificeMods * ARTIFICE_MOD_BONUS_VALUE +
            numMajorMods * MAJOR_MOD_BONUS_VALUE +
            numMinorMods * MINOR_MOD_BONUS_VALUE;
          result.push({
            numArtificeMods,
            numMajorMods,
            numMinorMods,
            exactStatPoints,
          });
        }
      }
    }
  }

  return result;
}

const allModCombinations = generateModCombinations();

// If we have a combination that has more optimal sub-combinations, we can discard it
function hasMoreOptimalSubCombo(
  combo: GenericRequiredModCombo,
  targetValue: number
): boolean {
  if (combo.numMajorMods === 0) {
    return false;
  }
  // swap out a single major mod for a single minor mod
  const numMajorMods = combo.numMajorMods - 1;
  const numMinorMods = combo.numMinorMods + 1;
  const numArtificeMods = combo.numArtificeMods;

  const exactStatPoints =
    numArtificeMods * ARTIFICE_MOD_BONUS_VALUE +
    numMajorMods * MAJOR_MOD_BONUS_VALUE +
    numMinorMods * MINOR_MOD_BONUS_VALUE;

  return exactStatPoints >= targetValue;
}

function isMoreOptimal(
  a: GenericRequiredModCombo,
  b: GenericRequiredModCombo
): boolean {
  const isStrictlyMoreOptimal =
    a.numArtificeMods <= b.numArtificeMods &&
    a.numMajorMods <= b.numMajorMods &&
    a.numMinorMods <= b.numMinorMods;

  return isStrictlyMoreOptimal;
}

// TODO Change this to accept a combinations param and return the optimal combinations
// This way we can filter the zero wasted stats combinations to not be so wasteful

function findOptimalCombinations(
  combinations: GenericRequiredModCombo[],
  targetValue: number
): GenericRequiredModCombo[] {
  // Filter combinations to only those that meet the target value
  const validCombinations = combinations.filter(
    (c) => c.exactStatPoints >= targetValue
  );

  const optimalCombinations: GenericRequiredModCombo[] = [];

  // Iterate over all valid combinations
  for (let i = 0; i < validCombinations.length; i++) {
    let isDominated = false;

    // Check if the current combination is dominated by any other combination
    for (let j = 0; j < validCombinations.length; j++) {
      if (
        i !== j &&
        isMoreOptimal(validCombinations[j], validCombinations[i])
      ) {
        isDominated = true;
        break;
      }
    }

    // If the current combination is not dominated by any other combination, add it to the optimal combinations
    if (
      !isDominated &&
      !hasMoreOptimalSubCombo(validCombinations[i], targetValue)
    ) {
      optimalCombinations.push(validCombinations[i]);

      // Remove any combination in optimalCombinations that is dominated by the new combination
      for (let j = 0; j < optimalCombinations.length - 1; j++) {
        if (isMoreOptimal(validCombinations[i], optimalCombinations[j])) {
          console.log('Removing dominated combination');
          optimalCombinations.splice(j, 1);
          j--;
        }
      }
    }
  }

  return optimalCombinations;
}

type RequiredModMapping = Record<IntRange<1, 65>, GenericRequiredModCombo[]>;

const buildParetoOptimalRequiredModMapping = (): RequiredModMapping => {
  const mapping: Partial<RequiredModMapping> = {};

  for (let i = MIN_POTENTIAL_STAT_BOOST; i <= MAX_POTENTIAL_STAT_BOOST; i++) {
    const key = i as keyof RequiredModMapping;
    mapping[key] = findOptimalCombinations(allModCombinations, i);
  }

  return mapping as RequiredModMapping;
};

const buildZeroWastedStatsRequiredModMapping = (): RequiredModMapping => {
  const mapping: Partial<RequiredModMapping> = {};

  for (let i = MIN_POTENTIAL_STAT_BOOST; i <= MAX_POTENTIAL_STAT_BOOST; i++) {
    const targetValue = i;
    const combos = allModCombinations.filter(
      (x) => (x.exactStatPoints - targetValue) % 10 === 0
    );
    const key = i as keyof RequiredModMapping;
    mapping[key] = findOptimalCombinations(combos, targetValue);
  }

  return mapping as RequiredModMapping;
};


export default function buildModCombinations() {
  return {
    paretoOptimalRequiredModMapping: buildParetoOptimalRequiredModMapping(),
    zeroWastedStatsRequiredModMapping: buildZeroWastedStatsRequiredModMapping(),
  };
}