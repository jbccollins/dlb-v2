import withArmorProcessingUUID from "@/store/withArmorProcessingUUID";
import { atom } from "jotai";

const time = atom<number>(0);

export default time;

export const time_W = withArmorProcessingUUID(time);