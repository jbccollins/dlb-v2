import generateAllDistanceModCombinations from "@/generation/generateAllDistanceModCombinations/generateAllDistanceModCombinations";
import generateIntegerSumLists from "@/generation/generateIntegerSumLists/generateIntegerSumLists";
import generateModCombinations from "@/generation/generateModCombinations/generateModCombinations";

async function main() {
  await generateIntegerSumLists();
  await generateModCombinations();
  await generateAllDistanceModCombinations();
  // buildAllDistanceModCombinations()
}

main();