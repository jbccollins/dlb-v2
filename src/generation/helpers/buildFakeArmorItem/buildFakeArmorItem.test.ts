import { EArmorSlotId } from "@/definitions/ArmorSlot";
import { tester } from "@/tests";
import buildFakeArmorItem from "./buildFakeArmorItem";

// Set the random seed
beforeAll(() => {
  jest.spyOn(global.Math, 'random').mockImplementation(() => 0.5);
});


const testFunc = tester('buildFakeArmorItem', buildFakeArmorItem);


const defaultOutput: ReturnType<typeof buildFakeArmorItem> = {
  statList: [10, 16, 2, 10, 16, 2],
  isArtifice: false,
  armorSlot: EArmorSlotId.Arms
};

testFunc({
  name: 'returns empty array for default input',
  input: [],
  outputResolver: (output) => {
    expect(output).toEqual(defaultOutput);
  },
});

// Restore the original random function after tests
afterAll(() => {
  jest.spyOn(global.Math, 'random').mockRestore();
});