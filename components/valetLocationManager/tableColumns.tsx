"use client"

import { ValetBoyDetails } from "@/lib/types/types"
import { ColumnDef } from "@tanstack/react-table"
import { DeleteValetPopup } from "./DeleteValetPopup"

const centerClass = "text-center"

export const columns: ColumnDef<ValetBoyDetails>[] = [
    {
        id: "serial",
        header: () => <div className={centerClass}>S No</div>,
        cell: ({ row }) => (
            <div className={centerClass}>{row.index + 1}</div>
        ),
    },
    {
        accessorKey: "id",
        header: () => <div className={centerClass}>Boy ID</div>,
        cell: ({ row }) => (
            <div className={centerClass}>{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "valet_boy_name",
        header: () => <div className={centerClass}>Name</div>,
        cell: ({ row }) => (
            <div className={centerClass}>{row.getValue("valet_boy_name")}</div>
        ),
    },
    {
        accessorKey: "mobile",
        header: () => <div className={centerClass}>Mobile</div>,
        cell: ({ row }) => (
            <div className={centerClass}>{row.getValue("mobile")}</div>
        ),
    },
    {
        accessorKey: "prk_lot_id",
        header: () => <div className={centerClass}>Prk Lot</div>,
        cell: ({ row }) => (
            <div className={centerClass}>{row.getValue("prk_lot_id")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: () => <div className={centerClass}>Status</div>,
        cell: ({ row }) => (
            <div className={centerClass}>{row.getValue("status")}</div>
        ),
    },
    {
        id: "actions",
        header: () => <div className={centerClass}>Actions</div>,
        cell: ({ row }) => {
            const valet = row.original

            return (
                <div className="flex justify-center">
                    <DeleteValetPopup valetId={valet.id} name={valet.valet_boy_name} />
                </div>
            )
        },
    },
]