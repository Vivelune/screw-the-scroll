"use client";

import { useState } from "react";

export default function AddApplicationForm({ onAdd }: { onAdd: () => void }) {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!company || !role) return;

    setLoading(true);
    await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ company, role, jobUrl, location }),
    });
    setLoading(false);
    setCompany("");
    setRole("");
    setJobUrl("");
    setLocation("");
    onAdd();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg mb-6">
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        placeholder="Company"
        className="border rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
      />
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
        className="border rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
      />
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="Location"
        className="border rounded px-3 py-2 text-sm flex-1 min-w-[120px]"
      />
      <input
        value={jobUrl}
        onChange={(e) => setJobUrl(e.target.value)}
        placeholder="Job URL"
        className="border rounded px-3 py-2 text-sm flex-1 min-w-[150px]"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white rounded px-4 py-2 text-sm"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </form>
  );
}