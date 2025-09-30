"use client";

import Modal from "@/components/Modal";
import api from "@/lib/axios";
import { Edit, Eye, PauseCircle, PlayCircle, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Dashboard() {
  const router = useRouter();
  const [monitoringStats, setMonitoringStats] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    url: "",
    frequencySec: 60,
  });

  const onChangeFormInput = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const loadMonitoringData = async () => {
    try {
      let { data } = await api.get("/monitoring");

      setMonitoringStats(data.data.monitors);
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

      setOpen(false);
      loadMonitoringData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleMonitorDelete = async (id) => {
    try {
      await api.delete(`/monitoring/${id}`);

      toast.success("Monitoring deleted successfully!");
      loadMonitoringData();
    } catch (error) {
      console.log(error);
      toast.error(error?.message || error);
    }
  };


  const handleChangeStatus = async (monitorId, status) => {
    try {
      await api.put(`/monitoring/status/${monitorId}/${status}`);

      toast.success("Monitoring deleted successfully!");
      loadMonitoringData();
    } catch (error) {
      console.log(error);
      toast.error(error?.message || error);
    }
  }

  return (
    <>
      <section className="">
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Monitors</h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:scale-105 transition"
              onClick={() => setOpen(true)}
            >
              New Monitor
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">URL</th>
                  <th className="pb-3">Site Status</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Freq. Sec.</th>
                  <th className="pb-3">Created At</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {monitoringStats.map((monitor) => (
                  <tr key={monitor._id} className="border-t border-slate-100">
                    <td className="py-3 font-medium">{monitor.name}</td>
                    <td className="py-3 text-slate-500 truncate max-w-[12rem]">
                      {monitor.url}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${
                          monitor.siteStatus === "up"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            monitor.siteStatus === "up"
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        {monitor.siteStatus.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3">
                      {monitor.status === "active" ? (
                        <button
                          onClick={() =>
                            handleChangeStatus(monitor._id, "pause")
                          }
                          className="p-2 rounded-md hover:bg-gray-100 text-gray-600 cursor-pointer"
                        >
                          <PauseCircle size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleChangeStatus(monitor._id, "start")
                          }
                          className="p-2 rounded-md hover:bg-green-50 text-green-600 cursor-pointer"
                        >
                          <PlayCircle size={18} />
                        </button>
                      )}
                    </td>
                    <td className="py-3">{monitor.frequencySec + " sec"}</td>
                    <td className="py-3">
                      {new Date(monitor.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 flex items-center gap-3">
                      {/* View */}
                      <button
                        onClick={() =>
                          router.push(
                            `/alpha/monitoring-results/${monitor._id}`
                          )
                        }
                        className="p-2 rounded-md hover:bg-blue-50 text-blue-600 cursor-pointer"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(monitor)}
                        className="p-2 rounded-md hover:bg-yellow-50 text-yellow-600  cursor-pointer"
                      >
                        <Edit size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleMonitorDelete(monitor._id)}
                        className="p-2 rounded-md hover:bg-red-50 text-red-600  cursor-pointer"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-slate-500">
            Tip: Click a monitor to view detailed history.
          </div>
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
