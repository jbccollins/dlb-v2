"use client";

import useFileFetcher, {
  clearFileVersion,
} from "@/services/file-fetcher-worker/useFileFetcher";
import { useEffect, useRef, useState } from "react";

export default function FileFetcher() {
  const [forceRefreshCount, setForceRefreshCount] = useState(0);
  const prevForceRefreshCountRef = useRef(0);
  const forceRefresh = forceRefreshCount > prevForceRefreshCountRef.current;
  console.log("forceRefresh", forceRefresh);

  const { complete, numFilesProcessed, numFilesErrored } =
    useFileFetcher(forceRefresh);

  useEffect(() => {
    if (prevForceRefreshCountRef.current !== forceRefreshCount) {
      // Update the previous count ref
      prevForceRefreshCountRef.current = forceRefreshCount;
    }
  }, [forceRefreshCount]);

  const handleForceRefresh = () => {
    // Clear the file version here
    clearFileVersion();
    // Increment forceRefreshCount to trigger re-fetch
    setForceRefreshCount((prev) => prev + 1);
  };

  return (
    <div>
      <h2>File Fetcher</h2>
      <p>Complete: {complete ? "Yes" : "No"}</p>
      <p>Files Processed: {numFilesProcessed}</p>
      <p>Files Errored: {numFilesErrored}</p>
      <p>Current Force Refresh Count: {forceRefreshCount}</p>
      <p>Previous Force Refresh Count: {prevForceRefreshCountRef.current}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        disabled={!complete}
        onClick={handleForceRefresh}
      >
        Force Refresh
      </button>
    </div>
  );
}
