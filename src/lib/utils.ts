import { ArmorStatIdList, ArmorStatMapping } from "@/definitions/ArmorStat";
import { EArmorStatId } from "@/definitions/IdEnums";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stringify(obj: unknown, debug = false) {
  return debug ? JSON.stringify(obj, null, 2) : JSON.stringify(obj)
}

// Hacky way to ensure that a list contains all the values in an enum
// Useful for when we care about order and don't want to use Object.values() on the enum
// Won't result in a compile time error but will throw a really obvious
// runtime error.
// TODO: Get rid of this and figure out a better way. Maybe the satisfies
// operator can be useful here? idk.
export function ValidateEnumList<T extends string | symbol | number>(
  expectedList: T[],
  list: T[]
): T[] {
  if (expectedList.length !== list.length) {
    throw new Error(
      `Lists do not have the same length. Expected: ${expectedList}. Got: ${list}`
    );
  }

  const match = expectedList.every((element) => list.includes(element));

  if (!match) {
    throw new Error(
      `Lists have different values. Expected: ${expectedList}. Got: ${list}`
    );
  }

  return list;
}

// Round a number up to the nearest 10
export function roundUp10(x: number) {
  return Math.ceil(x / 10) * 10;
}

// Convert an ordered list of stats into a mapping
export const getArmorStatMappingFromStatList = (
  statList: number[]
): ArmorStatMapping => {
  if (statList.length !== ArmorStatIdList.length) {
    throw new Error(
      `[getArmorStatMappingFromStatList] Stat list has length ${statList.length} but expected length ${ArmorStatIdList.length}`
    );
  }
  const res: ArmorStatMapping = {
    [EArmorStatId.Mobility]: 0,
    [EArmorStatId.Resilience]: 0,
    [EArmorStatId.Recovery]: 0,
    [EArmorStatId.Discipline]: 0,
    [EArmorStatId.Intellect]: 0,
    [EArmorStatId.Strength]: 0,
  };
  ArmorStatIdList.forEach((armorStatId, i) => {
    res[armorStatId] = statList[i];
  });
  return res;
};