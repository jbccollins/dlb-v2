"use client";

import { EMessageType, WorkerInput, WorkerOutput } from './definitions';
import processArmor from './processArmor';

self.onmessage = async (event: MessageEvent<WorkerInput>) => {
  const { desiredStats } = event.data;

  try {
    const result = await processArmor({ desiredStats });
    const workerOutput: WorkerOutput = { result, messageType: EMessageType.Progress };
    self.postMessage(workerOutput);
  } catch (error) {
    const workerOutput: WorkerOutput = { messageType: EMessageType.Error, result: null };
    self.postMessage(workerOutput);
  }
};