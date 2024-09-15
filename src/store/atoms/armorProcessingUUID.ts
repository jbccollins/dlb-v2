import { atom } from "jotai";
import { v4 as uuidv4 } from "uuid";

const armorProcessingUUID = atom(uuidv4());

export default armorProcessingUUID;