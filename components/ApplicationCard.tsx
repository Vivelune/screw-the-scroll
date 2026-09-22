"use client";

import { Application, ApplicationStage, STAGES, STAGE_LABELS } from "@/lib/types";

export default function ApplicationCard({
  app,
  onStageChange,
  onDelete,
}: {
  app: Application;
  onStageChange: (id: string, stage: ApplicationStage) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-3 mb-3 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-semibold text-sm">{app.company}</p>
          <p className="text-gray-600 text-sm">{app.role}</p>
          {app.location && <p className="text-gray-400 text-xs mt-1">{app.location}</p>}
        </div>
        <button
          onClick={() => onDelete(app.id)}
          className="text-gray-300 hover:text-red-500 text-xs"
        >
          ✕
        </button>
      </div>

      {app.jobUrl && (
        <a
          href={app.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-xs underline block mt-2"
        >
          View posting
        </a>
      )}

      <select
        value={app.stage}
        onChange={(e) => onStageChange(app.id, e.target.value as ApplicationStage)}
        className="mt-2 text-xs border rounded px-2 py-1 w-full"
      >
        {STAGES.map((s) => (
          <option key={s} value={s}>
            {STAGE_LABELS[s]}
          </option>
        ))}
      </select>
    </div>
  );
}