"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Application,
  ApplicationStage,
  STAGES,
  STAGE_LABELS,
} from "@/lib/types";
import ApplicationCard from "@/components/ApplicationCard";
import AddApplicationForm from "@/components/AddApplicationForm";

export default function Home() {
  const { isLoaded, isSignedIn } = useAuth();

  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    const res = await fetch("/api/applications");

    if (res.ok) {
      const data = await res.json();
      setApplications(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchApplications();
    } else if (isLoaded && !isSignedIn) {
      setLoading(false);
    }
  }, [isLoaded, isSignedIn, fetchApplications]);

  async function handleStageChange(
    id: string,
    stage: ApplicationStage
  ) {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, stage } : a
      )
    );

    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ stage }),
    });
  }

  async function handleDelete(id: string) {
    setApplications((prev) =>
      prev.filter((a) => a.id !== id)
    );

    await fetch(`/api/applications/${id}`, {
      method: "DELETE",
    });
  }

  // Clerk is still loading
  if (!isLoaded) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <p className="text-center text-gray-400 mt-20">
          Loading...
        </p>
      </main>
    );
  }

  // User is not signed in
  if (!isSignedIn) {
    return (
      <main className="p-6 max-w-7xl mx-auto">
        <p className="text-center text-gray-500 mt-20">
          Sign in to see your application tracker.
        </p>
      </main>
    );
  }

  // User is signed in
  return (
    <main className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Job Application Tracker
      </h1>

      <AddApplicationForm onAdd={fetchApplications} />

      {loading ? (
        <p className="text-gray-400">
          Loading...
        </p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageApps = applications.filter(
              (a) => a.stage === stage
            );

            return (
              <div
                key={stage}
                className="bg-gray-100 rounded-lg p-3 min-w-[260px] flex-shrink-0"
              >
                <h2 className="font-semibold text-sm mb-3 flex justify-between">
                  {STAGE_LABELS[stage]}

                  <span className="text-gray-400">
                    {stageApps.length}
                  </span>
                </h2>

                {stageApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onStageChange={handleStageChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}