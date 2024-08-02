import { EArmorStatId } from "./IdEnums";

export enum EStatModType {
  Major = 'Major',
  Minor = 'Minor',
  Artifice = 'Artifice',
}
export interface StatMod {
  name: string;
  value: number;
  cost: number;
  type: EStatModType;
}

export const ArmorStatToStatModsMapping: Record<EArmorStatId, [StatMod, StatMod, StatMod]> = {
  [EArmorStatId.Mobility]: [
    { name: 'Mobility', value: 10, cost: 3, type: EStatModType.Major },
    { name: 'Minor Mobility', value: 5, cost: 1, type: EStatModType.Minor },
    { name: 'Mobility-Forged', value: 3, cost: 0, type: EStatModType.Artifice },
  ],
  [EArmorStatId.Resilience]: [
    { name: 'Resilience', value: 10, cost: 4, type: EStatModType.Major },
    { name: 'Minor Resilience', value: 5, cost: 2, type: EStatModType.Minor },
    { name: 'Resilience-Forged', value: 3, cost: 0, type: EStatModType.Artifice },
  ],
  [EArmorStatId.Recovery]: [
    { name: 'Recovery', value: 10, cost: 4, type: EStatModType.Major },
    { name: 'Minor Recovery', value: 5, cost: 2, type: EStatModType.Minor },
    { name: 'Recovery-Forged', value: 3, cost: 0, type: EStatModType.Artifice },
  ],
  [EArmorStatId.Discipline]: [
    { name: 'Discipline', value: 10, cost: 3, type: EStatModType.Major },
    { name: 'Minor Discipline', value: 5, cost: 1, type: EStatModType.Minor },
    { name: 'Discipline-Forged', value: 3, cost: 0, type: EStatModType.Artifice },
  ],
  [EArmorStatId.Intellect]: [
    { name: 'Intellect', value: 10, cost: 4, type: EStatModType.Major },
    { name: 'Minor Intellect', value: 5, cost: 2, type: EStatModType.Minor },
    { name: 'Intellect-Forged', value: 3, cost: 0, type: EStatModType.Artifice },
  ],
  [EArmorStatId.Strength]: [
    { name: 'Strength', value: 10, cost: 3, type: EStatModType.Major },
    { name: 'Minor Strength', value: 5, cost: 1, type: EStatModType.Minor },
    { name: 'Strength-Forged', value: 3, cost: 0, type: EStatModType.Artifice },
  ],
}