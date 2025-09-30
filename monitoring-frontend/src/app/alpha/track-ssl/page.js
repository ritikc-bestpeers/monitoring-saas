"use client";

import Modal from "@/components/Modal";
import api from "@/lib/axios";
import { Edit, Eye, PauseCircle, PlayCircle, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const TrackSSL = () => {
  //   const domains = [
  //     {
  //       hostname: "docfliq.com",
  //       sslExpiry: Date.now(),
  //       daysRemaining: 45,
  //     },
  //     {
  //       hostname: "docfliq.com",
  //       sslExpiry: Date.now(),
  //       daysRemaining: 45,
  //     },
  //     {
  //       hostname: "docfliq.com",
  //       sslExpiry: Date.now(),
  //       daysRemaining: 45,
  //     },
  //     {
  //       hostname: "docfliq.com",
  //       sslExpiry: Date.now(),
  //       daysRemaining: 45,
  //     },
  //     {
  //       hostname: "docfliq.com",
  //       sslExpiry: Date.now(),
  //       daysRemaining: 45,
  //     },
  //     {
  //       hostname: "docfliq.com",
  //       sslExpiry: Date.now(),
  //       daysRemaining: 45,
  //     },
  //   ];

  const [domains, setDomains] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    domain: "",
  });

  useEffect(() => {
    loadMonitoringData();
  }, []);

  const loadMonitoringData = async () => {
    try {
      let { data } = await api.get("/track-ssl");
      console.log(data);

      setDomains(data.data.monitors);
    } catch (error) {
      alert(error?.message || error);
    }
  };

  const onChangeFormInput = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDomainSubmit = async (e) => {
    e.preventDefault();

    try {
      let payload = {
        domain: form.domain
      };
      let { data } = await api.post("/track-ssl", payload);

      setOpen(false);
      loadMonitoringData();
    } catch (error) {
      console.log(error);
    }
  };


   const handleDomainDelete = async (id) => {
    try {
      await api.delete(`/track-ssl/${id}`);

      toast.success("Monitoring deleted successfully!");
      loadMonitoringData();
    } catch (error) {
      console.log(error);
      toast.error(error?.message || error);
    }
  };
  return (
    <>
      <section className="">
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Domains</h2>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:scale-105 transition"
              onClick={() => setOpen(true)}
            >
              Track New Domain
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr>
                  <th className="pb-3">Hostname</th>
                  <th className="pb-3">Valid From</th>
                  <th className="pb-3">Valid Too</th>
                  <th className="pb-3">Days Remaining</th>
                  <th className="pb-3">Issuer</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {domains.map((domain, idx) => (
                  <tr key={idx} className="border-t border-slate-100">
                    <td className="py-3 font-medium">{domain.domain}</td>
                    <td className="py-3 text-slate-500 truncate max-w-[12rem]">
                      {domain.validFrom}
                    </td>
                    <td className="py-3 text-slate-500 truncate max-w-[12rem]">
                      {domain.validTo}
                    </td>
                    <td className="py-3">
                      <span
                        className={`inline-flex items-center gap-2 px-2 py-1 rounded-full ${
                          domain.daysRemaining > 7
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-red-50 text-red-600"
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            domain.daysRemaining > 7
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        {domain.daysRemaining} days
                      </span>
                    </td>
                    <td className="py-3 font-medium">
                      {domain?.issuer || "GoDaddy.com, Inc."}
                    </td>
                    <td className="py-3 flex items-center gap-3">
                      {/* View */}
                      <button
                        // onClick={() =>
                        //   router.push(
                        //     `/alpha/monitoring-results/${domain._id}`
                        //   )
                        // }
                        className="p-2 rounded-md hover:bg-blue-50 text-blue-600 cursor-pointer"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit */}
                      <button
                        // onClick={() => handleEdit(monitor)}
                        className="p-2 rounded-md hover:bg-yellow-50 text-yellow-600  cursor-pointer"
                      >
                        <Edit size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDomainDelete(domain._id)}
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
        <form className="space-y-4" onSubmit={handleDomainSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Monitoring URL
            </label>
            <input
              type="url"
              placeholder="https://example.com"
              className="p-3 border w-full rounded focus:ring-2 focus:ring-green-400"
              value={form.domain}
              onChange={(e) => onChangeFormInput("domain", e.target.value)}
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
};

export default TrackSSL;
