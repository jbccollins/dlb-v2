import { ArmorItem } from "@/definitions/ArmorItem";
import { EArmorSlotId } from "@/definitions/ArmorSlot";
import { StatList, sumStatList } from "@/definitions/ArmorStat";
import { v4 as uuid } from "uuid";

const PLUGS: Plug[] = [[1, 1, 11], [1, 1, 12], [1, 1, 13], [1, 1, 14], [1, 1, 15], [1, 5, 8], [1, 5, 9], [1, 5, 11], [1, 6, 8], [1, 6, 9], [1, 7, 8], [1, 8, 5], [1, 8, 6], [1, 8, 7], [1, 9, 5], [1, 9, 6], [1, 11, 1], [1, 11, 5], [1, 12, 1], [1, 13, 1], [1, 14, 1], [1, 15, 1], [5, 1, 8], [5, 1, 9], [5, 1, 11], [5, 8, 1], [5, 9, 1], [5, 11, 1], [6, 1, 8], [6, 1, 9], [6, 8, 1], [6, 9, 1], [7, 1, 8], [7, 8, 1], [8, 1, 5], [8, 1, 6], [8, 1, 7], [8, 5, 1], [8, 6, 1], [8, 7, 1], [9, 1, 5], [9, 1, 6], [9, 5, 1], [9, 6, 1], [11, 1, 1], [11, 1, 5], [11, 5, 1], [12, 1, 1], [13, 1, 1], [14, 1, 1], [15, 1, 1]]

type Plug = [number, number, number];

function getRandomPlug() {
  const index = Math.floor(Math.random() * PLUGS.length);
  return PLUGS[index];
}
function sumPlugs(plug1: Plug, plug2: Plug): Plug {
  return plug1.map((value, index) => value + plug2[index]) as Plug;
}

interface BuildFakeArmorItemParams {
  armorSlot: EArmorSlotId;
}

export default function buildFakeArmorItem(params: BuildFakeArmorItemParams): ArmorItem {
  const { armorSlot } = params;
  const mmrPlugs = [getRandomPlug(), getRandomPlug()];
  const disPlugs = [getRandomPlug(), getRandomPlug()];

  const id = uuid();

  const statList: StatList = [...sumPlugs(mmrPlugs[0], mmrPlugs[1]), ...sumPlugs(disPlugs[0], disPlugs[1])];
  // 25% chance to be artifice if the armor total is >= 56
  const isArtifice = Math.random() < 0.25 && sumStatList(statList) >= 56;
  // Pick a random armor slot
  return { statList, isArtifice, armorSlot, id };

}