"use client";

import fetchFiles from "@/services/file-fetcher-worker/main";
import { useEffect, useMemo } from "react";

export default function FileFetcher() {
  const fileFetcherWorker = useMemo(() => {
    if (typeof Worker === "undefined") return;
    return new Worker(
      new URL(
        "@/services/file-fetcher-worker/fileFetcherWorker.ts",
        import.meta.url
      )
    );
  }, []);

  useEffect(() => {
    if (!fileFetcherWorker) return;
    fetchFiles();
  }, [fileFetcherWorker]);

  return null;
}
