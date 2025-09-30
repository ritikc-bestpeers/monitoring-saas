"use client";
import { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function MonitoringRefresh({ loadMonitoringData }) {
  const [monitoringRefresh, setMonitoringRefresh] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    if (monitoringRefresh) {
      // Start interval
      const id = setInterval(() => {
        loadMonitoringData();
      }, 10000); // every 10 sec
      setIntervalId(id);

      // Cleanup on toggle off
      return () => clearInterval(id);
    } else {
      // Clear interval if turning off
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  }, [monitoringRefresh]);

  return (
    <div
      title="Refresh"
      onClick={() => setMonitoringRefresh((prev) => !prev)}
    >
      <RefreshCw
        className={`cursor-pointer transition-transform ${
          monitoringRefresh ? "animate-spin text-green-500" : "text-gray-400"
        }`}
      />
    </div>
  );
}
