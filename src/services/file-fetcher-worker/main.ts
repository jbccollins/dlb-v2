"use client";

import { MAX_POTENTIAL_STAT_BOOST, MIN_POTENTIAL_STAT_BOOST } from "@/lib/constants";
import { EMessageType, WorkerInput, WorkerOutput } from "./definitions";

const NUM_WORKERS = 3;
const workers: Worker[] = [];
const pendingNumbers: number[] = [];
const completedNumbers: Set<number> = new Set();

const FILE_VERSION_NUMBER_KEY = 'fileVersionNumber';
const FILE_VERSION_NUMBER = '1';

const checkFileVersion = () => {
  const fileVersion = localStorage.getItem(FILE_VERSION_NUMBER_KEY);
  return fileVersion === FILE_VERSION_NUMBER;
};

const setFileVersion = () => {
  localStorage.setItem(FILE_VERSION_NUMBER_KEY, FILE_VERSION_NUMBER);
}

const createWorker = () => {
  const worker = new Worker(
    new URL(
      "@/services/file-fetcher-worker/fileFetcherWorker.ts",
      import.meta.url
    )
  );
  worker.onmessage = (event: MessageEvent<WorkerOutput>) => {
    const { type, number, error } = event.data;
    if (type === EMessageType.Progress) {
      completedNumbers.add(number);
      if (pendingNumbers.length > 0) {
        const nextNumber = pendingNumbers.pop() as number;
        const nextWorkerMessage: WorkerInput = { number: nextNumber };
        worker.postMessage(nextWorkerMessage);
      } else {
        worker.terminate();
      }
    } else if (type === EMessageType.Error) {
      console.error(`Error processing number ${number}:`, error);
    }
  };
  return worker;
};

export default async function fetchFiles() {
  const shouldSkipFetching = checkFileVersion();
  if (shouldSkipFetching) {
    console.log('File version is 1, skipping file fetching.');
    return;
  }

  for (let i = MIN_POTENTIAL_STAT_BOOST; i <= MAX_POTENTIAL_STAT_BOOST; i++) {
    pendingNumbers.push(i);
  }

  console.log('Pending numbers:', pendingNumbers);

  for (let i = 0; i < NUM_WORKERS; i++) {
    const worker = createWorker();
    workers.push(worker);
    if (pendingNumbers.length > 0) {
      const nextNumber = pendingNumbers.pop();
      worker.postMessage({ number: nextNumber });
    }
  }

  setFileVersion();
};