"use client";

import Modal from "@/components/Modal";
import api from "@/lib/axios";
import { Edit, Eye, LogIn, SendIcon, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);

  const onChangeFormInput = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/users");
      setUsers(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Add or Update user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? "put" : "post";
      const url = editingId ? `/admin/users/${editingId}` : "/admin/users";

      const { data } = await api[method](url, form);

      setForm({ name: "", email: "" });
      setEditingId(null);
      fetchUsers();
      setOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const { data } = await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  // 🔹 Set edit mode
  const handleEdit = (user) => {
    setForm({ name: user.name, email: user.email });
    setEditingId(user._id);
    setOpen(true);
  };

  const handleGhostLogin = async (userId) => {
    try {
      const { data } = await api.post(`/admin/users/ghost-login/${userId}`);

      // Save the new token as if you're that user
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert(`Now logged in as ${data.user.email}`);
      window.location.href = "/alpha/dashboard"; // redirect
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const handleUserInvite = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/admin/users/user-invite`, {
        email: form.email,
      });

      toast.success("Invite sent to user");
      setInviteOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <>
      <section className="">
        <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Monitors</h2>
            <div className="flex items-center gap-3">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:scale-105 transition"
                onClick={() => setOpen(true)}
              >
                New Monitor
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:scale-105 transition"
                onClick={() => setInviteOpen(true)}
              >
                Invite User
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 text-left">
                <tr>
                  <th className="pb-3">Sr. No.</th>
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {users.map((user, idx) => (
                  <tr key={user._id} className="border-t border-slate-100">
                    <td className="py-3 font-medium">{idx + 1}</td>
                    <td className="py-3 font-medium">{user.name}</td>
                    <td className="py-3 text-slate-500 truncate max-w-[12rem]">
                      {user.email}
                    </td>
                    <td className="py-3 flex items-center gap-1">
                      {/* View */}
                      <button
                        onClick={() =>
                          router.push(`/alpha/monitoring-results/${user._id}`)
                        }
                        className="p-2 rounded-md hover:bg-blue-50 text-blue-600 cursor-pointer"
                      >
                        <Eye size={18} />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-2 rounded-md hover:bg-yellow-50 text-yellow-600  cursor-pointer"
                      >
                        <Edit size={18} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2 rounded-md hover:bg-red-50 text-red-600  cursor-pointer"
                      >
                        <Trash size={18} />
                      </button>
                      <button
                        title="Ghost login"
                        onClick={() => handleGhostLogin(user._id)}
                        className="p-2 rounded-md hover:bg-red-50 text-red-600  cursor-pointer"
                      >
                        <LogIn size={18} />
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
        <form className="space-y-4" onSubmit={handleSubmit}>
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
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="https://example.com"
              className="p-3 border w-full rounded focus:ring-2 focus:ring-green-400"
              value={form.email}
              onChange={(e) => onChangeFormInput("email", e.target.value)}
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
      <Modal
        isOpen={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Send Invite"
      >
        <form className="space-y-4" onSubmit={handleUserInvite}>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="example@domain.com"
              className="p-3 border w-full rounded focus:ring-2 focus:ring-green-400"
              value={form.email}
              onChange={(e) => onChangeFormInput("email", e.target.value)}
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
              Send Invite
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Users;
