"use client";

import { ArrowDown, ArrowUp } from "lucide-react";

type Activity = {
  vehicle_number: string;
  time: string;
  type: "ENTRY" | "EXIT";
};

function formatTime(time: string) {
  const now = new Date();
  const t = new Date(time);
  const diff = Math.floor((now.getTime() - t.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

  return t.toLocaleDateString();
}

export default function ActivityList({ data }: { data: Activity[] }) {
  return (
    <div className="rounded-xl border p-4 bg-background">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Recent Activities</h2>
        <p className="text-sm text-muted-foreground">
          Latest entries and exits
        </p>
      </div>

      {/* List */}
      <div className="flex flex-col divide-y">
        {data.map((item, index) => {
          const isEntry = item.type === "ENTRY";

          return (
            <div
              key={index}
              className="flex items-center justify-between py-4"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                {/* Icon */}
                <div
                  className={`p-3 rounded-xl ${
                    isEntry
                      ? "bg-green-100 text-green-600"
                      : "bg-orange-100 text-orange-600"
                  }`}
                >
                  {isEntry ? <ArrowUp size={18} /> : <ArrowDown size={18} />}
                </div>

                {/* Info */}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">
                      {item.vehicle_number}
                    </span>

                    <span className="text-xs border px-2 py-0.5 rounded-md text-muted-foreground">
                      {item.type}
                    </span>
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {formatTime(item.time)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}