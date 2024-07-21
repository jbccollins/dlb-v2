"use client";
import timeAtom from "@/store/atoms/time";
import { useAtom } from "jotai";

export default function Time() {
  const [time, setTime] = useAtom(timeAtom);
  return (
    <div>
      <button onClick={() => setTime(() => time - 1)}>Decrement</button>
      {time}
      <button onClick={() => setTime(() => time + 1)}>Increment</button>
    </div>
  );
}
