"use client";

import { initDB } from '@/services/idb/helpers';
import { WorkerInput, WorkerOutput } from './definitions';

self.onmessage = async (event: MessageEvent<WorkerInput>) => {
  const { armorItems, desiredStats } = event.data;
  const db = await initDB();

  try {
    console.log(`Fetching and decompressing for number: ${number}`);
    await fetchAndDecompress(number, db);
    const workerOutput: WorkerOutput = { type: EMessageType.Progress, number };
    self.postMessage(workerOutput);
  } catch (error) {
    const workerOutput: WorkerOutput = { type: EMessageType.Progress, number, error: (error as Error).toString() };
    self.postMessage(workerOutput);
  }
};