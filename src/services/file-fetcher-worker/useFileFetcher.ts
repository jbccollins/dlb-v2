"use client";

import { MAX_POTENTIAL_STAT_BOOST, MIN_POTENTIAL_STAT_BOOST } from "@/lib/constants";
import { dumpAllToGlobalThis } from "@/services/idb/helpers";
import { useEffect, useRef, useState } from "react";
import { EMessageType, WorkerInput, WorkerOutput } from "./definitions";

const NUM_WORKERS = 3;

const FILE_VERSION_NUMBER_KEY = 'fileVersionNumber';
const FILE_VERSION_NUMBER = '1';

export const checkFileVersion = () => {
  const fileVersion = localStorage.getItem(FILE_VERSION_NUMBER_KEY);
  return fileVersion === FILE_VERSION_NUMBER;
};

export const setFileVersion = () => {
  localStorage.setItem(FILE_VERSION_NUMBER_KEY, FILE_VERSION_NUMBER);
}

export const clearFileVersion = () => {
  localStorage.removeItem(FILE_VERSION_NUMBER_KEY);
}

export default function useFileFetcher(forceFetch: boolean) {
  console.log('forceFetch:', forceFetch);
  const [complete, setComplete] = useState(false);
  const [processedFilesCount, setProcessedFilesCount] = useState(0);
  const [erroredFilesCount, setErroredFilesCount] = useState(0);
  const processedFiles = useRef<Map<number, boolean>>(new Map());
  const erroredFiles = useRef<Map<number, boolean>>(new Map());

  const onComplete = () => {
    setFileVersion();
    setComplete(true);
    dumpAllToGlobalThis();
  }


  useEffect(() => {
    const fetchFiles = async () => {
      const shouldSkipFetching = checkFileVersion() && !forceFetch;
      if (shouldSkipFetching) {
        console.log('File version is 1, skipping file fetching.');
        onComplete();
        return;
      }

      setComplete(false);
      setProcessedFilesCount(0);
      setErroredFilesCount(0);
      processedFiles.current.clear();
      erroredFiles.current.clear();

      const pendingNumbers: number[] = [];
      const workers: Worker[] = [];

      for (let i = MIN_POTENTIAL_STAT_BOOST; i <= MAX_POTENTIAL_STAT_BOOST; i++) {
        pendingNumbers.push(i);
      }

      console.log('Pending numbers:', pendingNumbers);

      const createWorker = () => {
        const worker = new Worker(
          new URL('@/services/file-fetcher-worker/fileFetcherWorker.ts', import.meta.url)
        );
        worker.onmessage = (event: MessageEvent<WorkerOutput>) => {
          const { type, number, error } = event.data;
          if (type === EMessageType.Progress) {
            if (!processedFiles.current.has(number)) {
              processedFiles.current.set(number, true);
              setProcessedFilesCount(processedFiles.current.size);
            }
            if (pendingNumbers.length > 0) {
              sendWorkerMessage(worker, pendingNumbers);
            } else {
              worker.terminate();
              if (processedFiles.current.size === MAX_POTENTIAL_STAT_BOOST - MIN_POTENTIAL_STAT_BOOST + 1) {
                onComplete();
              }
            }
          } else if (type === EMessageType.Error) {
            if (!erroredFiles.current.has(number)) {
              erroredFiles.current.set(number, true);
              setErroredFilesCount(erroredFiles.current.size);
            }
            console.error(`Error processing number ${number}:`, error);
          }
        };
        return worker;
      };

      const sendWorkerMessage = (worker: Worker, pendingNumbers: number[]) => {
        if (pendingNumbers.length > 0) {
          const nextNumber = pendingNumbers.pop() as number;
          const nextWorkerMessage: WorkerInput = { number: nextNumber };
          worker.postMessage(nextWorkerMessage);
        }
      };

      for (let i = 0; i < NUM_WORKERS; i++) {
        const worker = createWorker();
        workers.push(worker);
        sendWorkerMessage(worker, pendingNumbers);
      }
    };

    fetchFiles();
  }, [forceFetch]);

  return {
    complete,
    numFilesProcessed: processedFilesCount,
    numFilesErrored: erroredFilesCount
  };
}