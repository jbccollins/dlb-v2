import generateAllDistanceModCombinations from "@/generation/generateAllDistanceModCombinations/generateAllDistanceModCombinations";
import generateFakeArmorItems from "@/generation/generateFakeArmorItems/generateFakeArmorItems";

async function main() {
  await generateAllDistanceModCombinations();
  await generateFakeArmorItems();
}

main();