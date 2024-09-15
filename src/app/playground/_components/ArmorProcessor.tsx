"use client";

import armorProcessingUUIDAtom from "@/store/atoms/armorProcessingUUID";
import timeAtom from "@/store/atoms/time";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";

export default function ArmorProcessor() {
  const [isBrowserReady, setIsBrowserReady] = useState(false);
  const armorProcessingUUID = useAtomValue(armorProcessingUUIDAtom);
  const time = useAtomValue(timeAtom);

  useEffect(() => {
    setIsBrowserReady(true);
  }, []);

  if (!isBrowserReady) {
    return null;
  }

  return (
    <div>
      <h1>Armor Processor</h1>
      <p>Armor processing UUID: {armorProcessingUUID}</p>
      <p>Time: {time}</p>
    </div>
  );
}
