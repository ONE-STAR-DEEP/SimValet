"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Company = {
  id: number;
  name: string;
  gst: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin: string;
  contact_person_name: string;
  contact_person_mobile: string;
  contact_person_designation: string;
  email: string;
  is_active: number;
  no_of_locations: number;
  locationCount: number;
};

export function CompanyInfo({ data }: { data: Company }) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="w-full border rounded-2xl p-4 shadow-sm bg-background">

      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl text-primary font-semibold">{data.name}</h2>
          <p className="text-sm text-muted-foreground">
            {data.city}, {data.state}
          </p>
        </div>

        <span
          className={`text-xs px-3 py-1 rounded-full ${
            data.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {data.is_active ? "Active" : "Inactive"}
        </span>
      </div>

      {/* 🖥️ Desktop View */}
      <div className="hidden md:grid grid-cols-2 gap-4 text-sm">

        <Info label="GST" value={data.gst} />
        <Info label="Email" value={data.email} />

        <Info label="Locations Allowed" value={data.no_of_locations} />
        <Info label="Used Locations" value={data.locationCount} />

        <Info label="Address" value={`${data.address}, ${data.pin}`} />
        <Info label="Country" value={data.country} />

        <Info label="Contact Person" value={data.contact_person_name} />
        <Info label="Mobile" value={data.contact_person_mobile} />

        <Info label="Designation" value={data.contact_person_designation} />

      </div>

      {/* 📱 Mobile View */}
      <div className="md:hidden text-sm space-y-2">

        <Info label="GST" value={data.gst} />
        <Info label="Contact" value={data.contact_person_mobile} />

        {showMore && (
          <div className="space-y-2 mt-2">
            <Info label="Email" value={data.email} />
            <Info label="Address" value={`${data.address}, ${data.pin}`} />
            <Info label="Designation" value={data.contact_person_designation} />
            <Info label="Locations" value={`${data.locationCount}/${data.no_of_locations}`} />
          </div>
        )}

        <Button
          variant="ghost"
          className="px-0 text-primary"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show Less" : "Show More"}
        </Button>
      </div>
    </div>
  );
}

/* 🔹 Reusable Info Row */
function Info({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}