import { StatList } from "@/definitions/ArmorStat";
import { StatMod } from "@/definitions/Mod";

export enum EMessageType {
  Progress,
  Error,
}

export interface WorkerInput {
  desiredStats: StatList;
}

export interface WorkerOutput {
  result: Record<string, StatMod[]> | null;
  messageType: EMessageType;
}