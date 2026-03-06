"use client"

import { CompanyFormData, ValetBoyData, ValetBoyDetails } from "@/lib/types/types"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<ValetBoyDetails>[] = [
    {
        id: "serial",
        header: "S No",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "id",
        header: "Boy ID",
    },
    {
        accessorKey: "valet_boy_name",
        header: "Name",
    },
    {
        accessorKey: "mobile",
        header: "Mobile",
    },
    {
        accessorKey: "prk_lot_id",
        header: "Prk Lot",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
]