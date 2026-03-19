"use client"

import { LocationData, LocationDetails } from "@/lib/types/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "../ui/button"
import { DeleteLocationPopup } from "./DeleteLocationPopup"

const centerClass = "text-center"

export const columns: ColumnDef<LocationDetails>[] = [
    {
        id: "serial",
        header: "S No",
        cell: ({ row }) => row.index + 1,
    },
    {
        accessorKey: "location_name",
        header: ({ column }) => {
            return (
                <Button
                    className=""
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Location
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "location_address",
        header: "Address",
    },
    {
        accessorKey: "contact_person_name",
        header: "Manager",
    },
    {
        accessorKey: "contact_person_mobile",
        header: "Mobile",
    },
    {
            id: "actions",
            header: () => <div className={centerClass}>Actions</div>,
            cell: ({ row }) => {
                const location = row.original
    
                return (
                    <div className="flex justify-center">
                        <DeleteLocationPopup locationId={location.id} name={location.location_name} />
                    </div>
                )
            },
        },
]