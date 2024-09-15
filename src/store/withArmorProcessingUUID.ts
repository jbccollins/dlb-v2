import { atom, SetStateAction, WritableAtom } from "jotai";
import { v4 as uuidv4 } from "uuid";
import armorProcessingUUID from "./atoms/armorProcessingUUID";

// Function to wrap the base atom with UUID functionality
export default function withArmorProcessingUUID<T>(baseAtom: WritableAtom<T, [SetStateAction<T>], void>) {
  const higherOrderAtom: WritableAtom<T, [SetStateAction<T>], void> = atom(
    (get) => get(baseAtom),
    (get, set, update: SetStateAction<T>) => {
      set(baseAtom, update);
      set(armorProcessingUUID, uuidv4());
    }
  );

  return higherOrderAtom;
}