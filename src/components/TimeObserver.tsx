"use client";
import timeAtom from "@/store/atoms/time";
import { useAtomValue } from "jotai";
import { useEffect, useRef, useState } from "react";

export default function TimeObserver() {
  const time = useAtomValue(timeAtom);
  const prevTimeRef = useRef(time); // Initialize the ref with the current time
  const [display, setDisplay] = useState(""); // State to hold the display string

  useEffect(() => {
    // Update the display string with the previous and current time
    setDisplay(`Previous time: ${prevTimeRef.current}, New time: ${time}`);
    // Update the ref to the current time for the next render
    prevTimeRef.current = time;
  }, [time]); // This effect runs every time 'time' changes

  return <div>{display}</div>; // Render the display string
}
