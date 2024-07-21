import generateIntegerSumLists from "@/generation/generateIntegerSumLists/generateIntegerSumLists";
import generateModCombinations from "@/generation/generateModCombinations/generateModCombinations";


async function main() {
  await generateIntegerSumLists();
  await generateModCombinations();
}

main();