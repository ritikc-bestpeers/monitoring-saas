"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import api from "@/lib/axios";

const AcceptInvite = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!name || !password || !confirmPassword) {
        toast.error("All fields are required!")
        return;
    }

    if(password !== confirmPassword) {
        toast.error("Password and confirm password didn't matched!")
        return;
    }
    
    setLoading(true);
    try {
      await api.post("/auth/accept-invite", { token, password, name });
      toast.success("Password set successfully! You can now log in.");
      router.push("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-xl font-bold mb-4">Set Your Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <input
          type="password"
          placeholder="Enter confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Set Password"}
        </button>
      </form>
    </div>
  );
};

export default AcceptInvite;
