import { EArmorSlotId } from "@/definitions/ArmorSlot";
import { tester } from "@/tests";
import buildFakeArmorItem from "./buildFakeArmorItem";

// Set the random seed
beforeAll(() => {
  jest.spyOn(global.Math, 'random').mockImplementation(() => 0.5);
});

const testFunc = tester('buildFakeArmorItem', buildFakeArmorItem);

const defaultOutput: Omit<ReturnType<typeof buildFakeArmorItem>, "id"> = {
  statList: [10, 16, 2, 10, 16, 2],
  isArtifice: false,
  armorSlot: EArmorSlotId.Arms,
};

testFunc({
  name: 'returns empty array for default input',
  input: [{ armorSlot: EArmorSlotId.Arms }],
  outputResolver: (output) => {
    // Random seed doesn't affect uuid() so the id is always random.
    const { id, ...rest } = output;
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
    expect(rest).toEqual(defaultOutput);
  },
});

// Restore the original random function after tests
afterAll(() => {
  jest.spyOn(global.Math, 'random').mockRestore();
});