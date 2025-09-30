"use client";

import Modal from "@/components/Modal";
import api from "@/lib/axios";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Edit,
  Eye,
  RefreshCw,
  Timer,
  Trash,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import MonitoringRefresh from "./MonitoringRefresh";
import Pagination from "@/components/Pagination";

export default function MonitoringResult() {
  const { id } = useParams();

  const router = useRouter();
  const [monitoringResults, setMonitoringResults] = useState([]);
  const [monitoringStats, setMonitoringStats] = useState({
    uptime: 0,
    avgResponseTime: 0,
    totalChecks: 0,
    failures: 0,
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    url: "",
    frequencySec: 60,
  });

  const [paginationData, setPaginationData] = useState({page: 1, totalPages: 0});
  const [page, setPage] = useState(1);

  const onChangeFormInput = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    loadMonitoringData();
  }, [id, page]);

  function calculateStats(results) {
    if (results.length === 0) return;
    const total = results.length;
    const upCount = results.filter((r) => r.status === "up").length;
    const downCount = total - upCount;
    const avgResponseTime =
      results.reduce((sum, r) => sum + (r.responseTime || 0), 0) / total;

    return {
      uptime: ((upCount / total) * 100).toFixed(2),
      avgResponseTime: Math.round(avgResponseTime),
      totalChecks: total,
      failures: downCount,
    };
  }

  const loadMonitoringData = async () => {
    try {
      let { data } = await api.get(`/monitoring-results/${id}?page=${page}&limit=15`);

      console.log(data);

      const stats = calculateStats(data.data.results);

      setMonitoringResults(data.data.results);
      setPaginationData({
        page: data.data.pagination.page,
        totalPages: data.data.pagination.totalPages
      })
      if(stats) {
        setMonitoringStats(stats);
      }
    } catch (error) {
      alert(error?.message || error);
    }
  };

  const handleMonitorSubmit = async (e) => {
    try {
      e.preventDefault();

      console.log("submitted: ", form);

      let payload = {
        name: form.name,
        url: form.url,
        frequencySec: form.frequencySec,
      };
      let { data } = await api.post("/monitoring", payload);

      console.log(data);

      setOpen(false);
      loadMonitoringData();
    } catch (err) {
      console.log(err);
    }
  };

  const cards = [
    {
      title: "Uptime",
      value: `20%`,
      icon: <CheckCircle className="text-emerald-600" size={20} />,
      bg: "bg-emerald-50",
    },
    {
      title: "Avg Response",
      value: `200 ms`,
      icon: <Timer className="text-blue-600" size={20} />,
      bg: "bg-blue-50",
    },
    {
      title: "Total Checks",
      value: 100,
      icon: <Activity className="text-indigo-600" size={20} />,
      bg: "bg-indigo-50",
    },
    {
      title: "Failures",
      value: 0,
      icon: <AlertTriangle className="text-red-600" size={20} />,
      bg: "bg-red-50",
    },
  ];

  return (
    <>
      <section className="mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div
            className={`p-4 rounded-xl shadow-sm border flex items-center gap-3 bg-emerald-50`}
          >
            <div className="p-2 rounded-lg bg-white">
              <CheckCircle className="text-emerald-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Uptime</div>
              <div className="text-lg font-semibold">
                {monitoringStats?.uptime}%
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl shadow-sm border flex items-center gap-3 bg-blue-50`}
          >
            <div className="p-2 rounded-lg bg-white">
              <Timer className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Avg Response</div>
              <div className="text-lg font-semibold">
                {monitoringStats?.avgResponseTime}ms
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl shadow-sm border flex items-center gap-3 bg-indigo-50`}
          >
            <div className="p-2 rounded-lg bg-white">
              <Activity className="text-indigo-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Total Checks</div>
              <div className="text-lg font-semibold">
                {monitoringStats?.totalChecks}
              </div>
            </div>
          </div>

          <div
            className={`p-4 rounded-xl shadow-sm border flex items-center gap-3 bg-indigo-50`}
          >
            <div className="p-2 rounded-lg bg-white">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div>
              <div className="text-sm text-slate-500">Failures</div>
              <div className="text-lg font-semibold">
                {monitoringStats?.failures}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Monitoring Results</h2>
            <MonitoringRefresh loadMonitoringData={loadMonitoringData} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr>
                  <th className="border border-slate-200 p-2">Sr. No.</th>
                  <th className="border border-slate-200 p-2">Checked At</th>
                  <th className="border border-slate-200 p-2">Status</th>
                  <th className="border border-slate-200 p-2">Response Time</th>
                  <th className="border border-slate-200 p-2">Status Code</th>
                  <th className="border border-slate-200 p-2">Error</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {monitoringResults.map((result, idx) => (
                  <tr key={result._id} className="border-t border-slate-100">
                    <td className="p-2">{idx + 1 + ((page-1)*15)}</td>
                    <td className="p-2">
                      {new Date(result.checkedAt).toLocaleString()}
                    </td>
                    <td
                      className={`p-2 font-medium ${
                        result.status === "up"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {result.status.toUpperCase()}
                    </td>
                    <td className="p-2">
                      {result.responseTime ? `${result.responseTime} ms` : "—"}
                    </td>
                    <td className="p-2">{result.statusCode ?? "—"}</td>
                    <td className="p-2 text-slate-500">
                      {result.error ? result.error : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination setPage={setPage} totalPages={paginationData.totalPages} page={page}  />
        </div>
      </section>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Create New Monitor"
      >
        <form className="space-y-4" onSubmit={handleMonitorSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="Enter monitor name"
              className="p-3 border w-full rounded focus:ring-2 focus:ring-green-400"
              value={form.name}
              onChange={(e) => onChangeFormInput("name", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Monitoring URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              className="p-3 border w-full rounded focus:ring-2 focus:ring-green-400"
              value={form.url}
              onChange={(e) => onChangeFormInput("url", e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Frequency (seconds)
            </label>
            <input
              type="number"
              min="1"
              max={86400}
              className="p-3 border w-full rounded focus:ring-2 focus:ring-green-400"
              value={form.frequencySec}
              onChange={(e) =>
                onChangeFormInput("frequencySec", e.target.value)
              }
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 rounded border hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded cursor-pointer hover:scale-105 transition"
            >
              Submit
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
