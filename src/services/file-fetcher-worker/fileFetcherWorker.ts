"use client";

import { EMessageType, WorkerInput, WorkerOutput } from './definitions';
import { fetchAndDecompress } from './helpers';

self.onmessage = async (event: MessageEvent<WorkerInput>) => {
  //  console.log('Worker received message:', event.data);
  const { number } = event.data;

  try {
    // console.log(`Fetching and decompressing for number: ${number}`);
    await fetchAndDecompress(number);
    const workerOutput: WorkerOutput = { type: EMessageType.Progress, number };
    self.postMessage(workerOutput);
  } catch (error) {
    const workerOutput: WorkerOutput = { type: EMessageType.Progress, number, error: (error as Error).toString() };
    self.postMessage(workerOutput);
  }
};