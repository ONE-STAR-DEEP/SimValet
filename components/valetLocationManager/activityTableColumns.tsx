"use client"

import { CompanyFormData, ValetActivity, ValetBoyData, ValetBoyDetails } from "@/lib/types/types"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ValetActivity>[] = [
  {
    id: "serial",
    header: () => <div className="text-center">S No</div>,
    cell: ({ row }) => (
      <div className="text-center">{row.index + 1}</div>
    ),
  },
  {
    accessorKey: "vehicle_number",
    header: () => <div className="text-center">Vehicle Number</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "entry_time",
    header: () => <div className="text-center">Entry Time</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "exit_time",
    header: () => <div className="text-center">Exit Time</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string ?? "-"}</div>
    ),
  },
  {
    accessorKey: "total_duration",
    header: () => <div className="text-center">Parking Duration</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string  ?? "-"}</div>
    ),
  },
  {
    accessorKey: "entry_by_valet",
    header: () => <div className="text-center">Entry Valet</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string}</div>
    ),
  },
  {
    accessorKey: "exit_by_valet",
    header: () => <div className="text-center">Exit Valet</div>,
    cell: ({ getValue }) => (
      <div className="text-center">{getValue() as string  ?? "-"}</div>
    ),
  },
];