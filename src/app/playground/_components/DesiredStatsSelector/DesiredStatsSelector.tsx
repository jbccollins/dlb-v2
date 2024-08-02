"use client";

import { ArmorItem } from "@/definitions/ArmorItem";
import { EArmorSlotId } from "@/definitions/ArmorSlot";
import { ArmorStatIdList } from "@/definitions/ArmorStat";
import { EArmorStatId } from "@/definitions/IdEnums";
import fakeArmorItemsJSON from "@/generation/generated/fakeArmorItems.json";
import processArmor from "@/services/armor-processing/armorProcessing";
import { produce } from "immer";
import { useState } from "react";
console.log(fakeArmorItemsJSON);
const fakeArmorItems = fakeArmorItemsJSON as ArmorItem[];

const groupedArmorItems: Record<EArmorSlotId, ArmorItem[]> = fakeArmorItems
  .slice(0, 140)
  .reduce(
    (acc, armorItem) => {
      if (!acc[armorItem.armorSlot]) {
        acc[armorItem.armorSlot] = [];
      }
      acc[armorItem.armorSlot].push(armorItem);
      return acc;
    },
    {} as Record<EArmorSlotId, ArmorItem[]>
  );

interface Mark {
  value: number;
  label: string;
}

const marks: Mark[] = [
  {
    value: 0,
    label: "0",
  },
  {
    value: 10,
    label: "1",
  },
  {
    value: 20,
    label: "2",
  },
  {
    value: 30,
    label: "3",
  },
  {
    value: 40,
    label: "4",
  },
  {
    value: 50,
    label: "5",
  },
  {
    value: 60,
    label: "6",
  },
  {
    value: 70,
    label: "7",
  },
  {
    value: 80,
    label: "8",
  },
  {
    value: 90,
    label: "9",
  },
  {
    value: 100,
    label: "10",
  },
];

const DesiredStatsSelector = () => {
  const [selectedValues, setSelectedValues] = useState<
    Record<EArmorStatId, number>
  >({
    [EArmorStatId.Mobility]: 0,
    [EArmorStatId.Resilience]: 0,
    [EArmorStatId.Recovery]: 0,
    [EArmorStatId.Discipline]: 0,
    [EArmorStatId.Intellect]: 0,
    [EArmorStatId.Strength]: 0,
  });

  const numCombinations =
    groupedArmorItems[EArmorSlotId.Head].length *
    groupedArmorItems[EArmorSlotId.Arms].length *
    groupedArmorItems[EArmorSlotId.Chest].length *
    groupedArmorItems[EArmorSlotId.Legs].length;

  const handleChange = (armorStatId: EArmorStatId) => {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newSelectedValues = produce(selectedValues, (draft) => {
        draft[armorStatId] = parseInt(event.target.value, 10);
      });
      setSelectedValues(newSelectedValues);
      let processed = false;

      groupedArmorItems[EArmorSlotId.Head].forEach((head) => {
        groupedArmorItems[EArmorSlotId.Arms].forEach((arms) => {
          groupedArmorItems[EArmorSlotId.Chest].forEach((chest) => {
            groupedArmorItems[EArmorSlotId.Legs].forEach((legs) => {
              if (processed) {
                return;
              }
              processArmor({
                armorItems: [head, arms, chest, legs],
                desiredStats: [
                  newSelectedValues[EArmorStatId.Mobility],
                  newSelectedValues[EArmorStatId.Resilience],
                  newSelectedValues[EArmorStatId.Recovery],
                  newSelectedValues[EArmorStatId.Discipline],
                  newSelectedValues[EArmorStatId.Intellect],
                  newSelectedValues[EArmorStatId.Strength],
                ],
              });
              // processed = true;
            });
          });
        });
      });
    };
  };

  return (
    <div>
      <h1>Desired Stats Selector</h1>
      <p>Number of combinations: {numCombinations}</p>
      {ArmorStatIdList.map((armorStatId) => (
        <div key={armorStatId} style={{ margin: "10px" }}>
          <label htmlFor={`select-${armorStatId}`} className="block w-15">
            {armorStatId.substring(0, 3)}
          </label>
          <select
            id={`select-${armorStatId}`}
            value={selectedValues[armorStatId] || 0}
            onChange={handleChange(armorStatId)}
            className="border border-gray-300 p-2 rounded"
          >
            {marks.map((mark) => (
              <option key={mark.value} value={mark.value}>
                {mark.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default DesiredStatsSelector;
