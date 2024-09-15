"use client";
import { time_W } from "@/store/atoms/time";
import { useAtom } from "jotai";

export default function Time() {
  const [time, setTime] = useAtom(time_W);
  return (
    <div>
      <button onClick={() => setTime(() => time - 1)}>Decrement</button>
      {time}
      <button onClick={() => setTime(() => time + 1)}>Increment</button>
    </div>
  );
}
