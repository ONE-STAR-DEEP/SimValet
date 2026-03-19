"use client"

import { Company } from "@/lib/types/types"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "../ui/button"
import { Ellipsis } from "lucide-react"

export const columns: ColumnDef<Company>[] = [
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
        cell: ({ row }) => row.original.email || "-"
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
        header: "City",
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
    {
        accessorKey: "no_of_locations",
        header: "Allocations",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const company = row.original
            console.log(company)
            return (
                <div className="flex gap-2 justify-center">
                    <Ellipsis className="text-primary"/>
                    {/* <Button size="sm">Edit</Button>
                    <Button size="sm" variant="destructive">Delete</Button> */}
                </div>
            )
        }
    }
]