"use client";

import { useEffect, useState, useCallback } from "react";

type JobListing = {
  id: string;
  source: string;
  title: string;
  company: string;
  location: string | null;
  country: string | null;
  url: string;
  remote: boolean;
  visaSponsor: boolean;
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [visaOnly, setVisaOnly] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/jobs?visaOnly=${visaOnly}`);
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }, [visaOnly]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function handleSync() {
    setSyncing(true);
    await fetch("/api/jobs/sync", { method: "POST" });
    await fetchJobs();
    setSyncing(false);
  }

  async function handleAddToTracker(jobId: string) {
    await fetch(`/api/jobs/${jobId}/apply`, { method: "POST" });
    alert("Added to your Wishlist column!");
  }

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Job Feed</h1>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-black text-white rounded px-4 py-2 text-sm"
        >
          {syncing ? "Syncing..." : "Sync new jobs"}
        </button>
      </div>

      <label className="flex items-center gap-2 mb-4 text-sm">
        <input
          type="checkbox"
          checked={visaOnly}
          onChange={(e) => setVisaOnly(e.target.checked)}
        />
        Visa-sponsor tagged only
      </label>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4 flex justify-between items-start">
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-gray-600 text-sm">{job.company}</p>
                <p className="text-gray-400 text-xs mt-1">
                  {job.location || job.country} · {job.source}
                  {job.visaSponsor && " · 🟢 Visa tag"}
                </p>
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 text-xs underline">
                  View posting
                </a>
              </div>
              <button
                onClick={() => handleAddToTracker(job.id)}
                className="bg-gray-100 hover:bg-gray-200 rounded px-3 py-1 text-xs flex-shrink-0"
              >
                + Add to tracker
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}