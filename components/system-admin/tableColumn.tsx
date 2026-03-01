"use client"

import { CompanyFormData } from "@/lib/types/types"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<CompanyFormData>[] = [
    {
        id: "serial",
        header: "S No",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "name",
        header: "Company",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "gst",
        header: "GST No",
    },
    {
        accessorKey: "address",
        header: "Address",
    },
    {
        accessorKey: "city",
        header: "Address",
    },
    {
        accessorKey: "state",
        header: "State",
    },
    {
        accessorKey: "country",
        header: "Country",
    },
    {
        accessorKey: "pin",
        header: "Pincode",
    },
    {
        accessorKey: "contact_person_name",
        header: "Person",
    },
    {
        accessorKey: "contact_person_mobile",
        header: "Mobile",
    },
    {
        accessorKey: "contact_person_designation",
        header: "Designation",
    },
]