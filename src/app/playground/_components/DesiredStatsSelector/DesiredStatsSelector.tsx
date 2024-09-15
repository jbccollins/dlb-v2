"use client";

import { ArmorStatIdList, EArmorStatIndex } from "@/definitions/ArmorStat";
import { numCombinations } from "@/services/armor-processing/armor";
import { desiredStats_W } from "@/store/atoms/desiredStats";
import { produce } from "immer";
import { useAtom } from "jotai";
import { marks } from "./definitions";

const DesiredStatsSelector = () => {
  const [desiredStats, setDesiredStats] = useAtom(desiredStats_W);

  const handleChange = (index: EArmorStatIndex) => {
    return (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newDesiredStats = produce(desiredStats, (draft) => {
        draft[index] = parseInt(event.target.value, 10);
      });
      setDesiredStats(newDesiredStats);

      // console.log("Processing Started");
      // const currentTime = new Date().getTime();

      // const newTime = new Date().getTime();
      // console.log("Processing Done");
      // console.log("Time taken: ", newTime - currentTime);
    };
  };

  return (
    <div>
      <h1>Desired Stats Selector</h1>
      <p>Number of combinations: {numCombinations}</p>
      {ArmorStatIdList.map((armorStatId, index) => (
        <div key={armorStatId} style={{ margin: "10px" }}>
          <label htmlFor={`select-armorstat-${index}`} className="block w-15">
            {armorStatId.substring(0, 3)}
          </label>
          <select
            id={`select-armorstat-${index}`}
            value={desiredStats[index] || 0}
            onChange={handleChange(index)}
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
