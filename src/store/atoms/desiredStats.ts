import { StatList } from "@/definitions/ArmorStat";
import withArmorProcessingUUID from "@/store//withArmorProcessingUUID";
import { atom } from "jotai";

const desiredStats = atom<StatList>([
  0, 0, 0, 0, 0, 0
])

// _W suffix denotes that this atom is wrapped with UUID functionality
export const desiredStats_W = withArmorProcessingUUID(desiredStats);

export default desiredStats;