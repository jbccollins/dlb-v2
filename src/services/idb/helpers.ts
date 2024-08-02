import { openDB } from "idb";
import { StatModGroup } from "./definitions";

const DB_NAME = "FilesDB";
const DB_VERSION = 1;
const STORE_NAME = "files";

export async function getValueFromDB(key: string): Promise<StatModGroup[]> {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const value = await store.get(key);
    await tx.done;
    return value.value;
  } catch (error) {
    console.error(`Error getting value from db for key ${key}:`, error);
    throw error;
  }
}

export async function setValueInDB(key: string, value: StatModGroup[]) {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.put(value, key);
  await tx.done;
}

export async function initDB() {
  const db = await openDB("FilesDB", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files", { keyPath: "id" });
      }
    },
  });
  return db;
};

type ExtendedGlobalThis = typeof globalThis & {
  filesDBDump: Record<string, StatModGroup[]>;
}

export const getGlobalThisFilesDBDump = () => {
  const _globalThis = globalThis as ExtendedGlobalThis;
  return _globalThis.filesDBDump;
}

let hasDumped = false;

export async function dumpAllToGlobalThis() {
  if (hasDumped) return;
  hasDumped = true;
  console.log("dump");

  const _globalThis = globalThis as ExtendedGlobalThis;
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const allKeys = await store.getAllKeys();
    const allValues = await store.getAll();

    _globalThis.filesDBDump = {} as Record<string, StatModGroup[]>;

    allKeys.forEach((key, index) => {
      _globalThis.filesDBDump[key as string] = allValues[index].value as StatModGroup[];
    });

    await tx.done;
  } catch (error) {
    console.error("Error dumping all keys/values to globalThis:", error);
    throw error;
  }
}