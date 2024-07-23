"use client";

import pako from "pako";
import { useEffect } from "react";

import {
  MAX_POTENTIAL_STAT_BOOST,
  MIN_POTENTIAL_STAT_BOOST,
} from "@/lib/constants";
import { IDBPDatabase, openDB } from "idb";

async function getValueFromDB(key: string) {
  const db = await openDB("FilesDB", 1); // Ensure the version matches the one used during DB initialization
  const tx = db.transaction("files", "readonly");
  const store = tx.objectStore("files");
  const value = await store.get(key);
  await tx.done;
  return value;
}

export default function FileFetcher() {
  useEffect(() => {
    const initDB = async () => {
      const db = await openDB("FilesDB", 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains("files")) {
            db.createObjectStore("files", { keyPath: "id" });
          }
        },
      });
      return db;
    };

    const fetchAndDecompress = async (
      number: number,
      db: IDBPDatabase<unknown>
    ) => {
      try {
        const url = `https://raw.githubusercontent.com/jbccollins/destiny-2-compressed-mod-combinations/main/${number}.json.gz`;
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok.");

        const blob = await response.blob();
        const arrayBuffer = await blob.arrayBuffer();
        const decompressed = pako.inflate(new Uint8Array(arrayBuffer), {
          to: "string",
        });
        const data = JSON.parse(decompressed);
        console.log(
          `Number of keys in file ${number}:`,
          Object.keys(data).length
        );

        // Store each key-value pair in the database
        const tx = db.transaction("files", "readwrite");
        for (const key of Object.keys(data)) {
          await tx.store.put({ id: `${number}-${key}`, value: data[key] });
        }
        await tx.done;
      } catch (error) {
        console.error(`Error processing file ${number}:`, error);
      }
    };

    const processSequentially = async (fetch: boolean) => {
      if (!fetch) return;
      const db = await initDB();
      for (
        let number = MIN_POTENTIAL_STAT_BOOST;
        number <= MAX_POTENTIAL_STAT_BOOST;
        number++
      ) {
        await fetchAndDecompress(number, db);
      }
    };

    processSequentially(false);
    // Usage example
    const key = "11-3-3-3-2-0-0";
    getValueFromDB(key)
      .then((value) => {
        console.log("Value:", value);
      })
      .catch((error) => {
        console.error("Error fetching from IDB:", error);
      });
  }, []);

  return null;
}
