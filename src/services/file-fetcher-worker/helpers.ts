import { initDB } from '@/services/idb/helpers';
import { inflate } from "pako";

export const fetchAndDecompress = async (
  number: number,
) => {

  try {
    const db = await initDB();
    const url = `https://raw.githubusercontent.com/jbccollins/destiny-2-compressed-mod-combinations/main/${number}.json.gz`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response was not ok.");

    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    const decompressed = inflate(new Uint8Array(arrayBuffer), {
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
      await tx.store.put({ id: `${key}`, value: data[key] });
    }
    await tx.done;
  } catch (error) {
    console.error(`Error processing file ${number}:`, error);
  }
};