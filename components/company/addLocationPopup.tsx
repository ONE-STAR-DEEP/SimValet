"use client";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LocationData } from "@/lib/types/types";
import { insertLocation } from "@/lib/actions/company";


const AddLocationPopup = ({ remainingLocationCount }: { remainingLocationCount: number }) => {

    const router = useRouter();

    const initialState: LocationData = {
        locationCount: remainingLocationCount,
        locationName: [],
        locationAddress: [],
        contactPerson: [],
        personMobile: [],
        charges: [],
        minCharges: [],
    };

    const [data, setData] = useState<LocationData>(initialState);

    useEffect(() => {
        setData({
            locationCount: remainingLocationCount,
            locationName: [],
            locationAddress: [],
            contactPerson: [],
            personMobile: [],
            charges: [],
            minCharges: [],
        });
    }, [remainingLocationCount]);

    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const res = await insertLocation(data);

        if (!res.success) {
            alert("Failed to Insert")
        }

        router.refresh();
        setOpen(false);

    }

    if (remainingLocationCount === 0) {
        return (
            <Button disabled>
                Max Locations Reached
            </Button>
        )
    }
    return (
        <div>
            <Button type="button" onClick={() => { setOpen(true) }}>
                <Plus /> Add Location
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent
                    className="
                        w-full
                            max-w-[95vw]
                            sm:max-w-md
                            lg:max-w-[60vw]
                            lg:h-[70vh]
                            h-[80vh] 
                            flex flex-col
                            p-0
                            overflow-y-auto
                            "
                >
                    <form onSubmit={handleSubmit}>
                        <DialogHeader className="p-6 pb-2">
                            <DialogTitle className="text-xl text-primary">Register New Locations</DialogTitle>
                            <DialogDescription>
                                Select the location count and provide complete information for each valet service location to be added to the system.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-6">

                            <FieldLabel className="text-lg mt-4 text-primary">

                            </FieldLabel>

                            <Field>
                                <FieldLabel className="text-primary">Number of Locations</FieldLabel>

                                <div className="flex items-center gap-3">

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        disabled={data.locationCount <= 1}
                                        onClick={() =>
                                            setData(prev => {
                                                const newCount = Math.max(1, prev.locationCount - 1)

                                                return {
                                                    ...prev,
                                                    locationCount: newCount,
                                                    locationName: prev.locationName.slice(0, newCount),
                                                    locationAddress: prev.locationAddress.slice(0, newCount),
                                                    contactPerson: prev.contactPerson.slice(0, newCount),
                                                    personMobile: prev.personMobile.slice(0, newCount),
                                                }
                                            })
                                        }
                                    >
                                        -
                                    </Button>

                                    <Input
                                        type="number"
                                        min={1}
                                        max={remainingLocationCount}
                                        value={data.locationCount}
                                        onChange={(e) => {
                                            let value = Number(e.target.value)

                                            if (isNaN(value)) value = 1
                                            value = Math.max(1, Math.min(remainingLocationCount, value))

                                            setData(prev => ({
                                                ...prev,
                                                locationCount: value,
                                                locationName: prev.locationName.slice(0, value),
                                                locationAddress: prev.locationAddress.slice(0, value),
                                                contactPerson: prev.contactPerson.slice(0, value),
                                                personMobile: prev.personMobile.slice(0, value),
                                            }))
                                        }}

                                        className="w-20 h-9 text-center"
                                    />

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        disabled={data.locationCount >= remainingLocationCount}
                                        onClick={() =>
                                            setData(prev => {
                                                const newCount = Math.min(remainingLocationCount, prev.locationCount + 1)

                                                return {
                                                    ...prev,
                                                    locationCount: newCount,
                                                    locationName: [...prev.locationName, ""],
                                                    locationAddress: [...prev.locationAddress, ""],
                                                    contactPerson: [...prev.contactPerson, ""],
                                                    personMobile: [...prev.personMobile, ""],
                                                }
                                            })
                                        }
                                    >
                                        +
                                    </Button>

                                </div>
                            </Field>

                            <FieldGroup className="flex flex-col gap-4 mt-4">

                                {Array.from({ length: data.locationCount }).map((_, index) => (
                                    <div key={index} className="border p-4 rounded-lg mt-4 space-y-3">

                                        <h3 className="font-semibold text-primary">
                                            Location {index + 1}
                                        </h3>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel>Location Name</FieldLabel>
                                                <Input
                                                    placeholder="Enter location name"
                                                    value={data.locationName[index] || ""}
                                                    required
                                                    onChange={(e) => {
                                                        const updated = [...data.locationName]
                                                        updated[index] = e.target.value

                                                        setData(prev => ({
                                                            ...prev,
                                                            locationName: updated
                                                        }))
                                                    }}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>Location Address</FieldLabel>
                                                <Input placeholder="Enter address"
                                                    value={data.locationAddress[index] || ""}
                                                    required
                                                    onChange={(e) => {
                                                        const updated = [...data.locationAddress]
                                                        updated[index] = e.target.value

                                                        setData(prev => ({
                                                            ...prev,
                                                            locationAddress: updated
                                                        }))
                                                    }}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>Contact Person</FieldLabel>
                                                <Input placeholder="Enter contact person name"
                                                    value={data.contactPerson[index] || ""}
                                                    required
                                                    onChange={(e) => {
                                                        const updated = [...data.contactPerson]
                                                        updated[index] = e.target.value

                                                        setData(prev => ({
                                                            ...prev,
                                                            contactPerson: updated
                                                        }))
                                                    }}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>Person Mobile</FieldLabel>
                                                <Input placeholder="Enter mobile number"
                                                    value={data.personMobile[index] || ""}
                                                    required
                                                    onChange={(e) => {
                                                        const updated = [...data.personMobile]
                                                        updated[index] = e.target.value

                                                        setData(prev => ({
                                                            ...prev,
                                                            personMobile: updated
                                                        }))
                                                    }}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>Parking Charges (per hour)</FieldLabel>
                                                <Input placeholder="Enter mobile number"
                                                    value={data.charges[index] || 0}
                                                    required
                                                    onChange={(e) => {
                                                        const updated = [...data.charges]
                                                        updated[index] = Number(e.target.value)

                                                        setData(prev => ({
                                                            ...prev,
                                                            charges: updated
                                                        }))
                                                    }}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>Minimum Charges</FieldLabel>
                                                <Input placeholder="Enter mobile number"
                                                    value={data.minCharges[index] || 0}
                                                    required
                                                    onChange={(e) => {
                                                        const updated = [...data.minCharges]
                                                        updated[index] = Number(e.target.value)

                                                        setData(prev => ({
                                                            ...prev,
                                                            minCharges: updated
                                                        }))
                                                    }}
                                                />
                                            </Field>

                                        </div>
                                    </div>
                                ))}

                            </FieldGroup>
                        </div>

                        {/* Clean Footer */}
                        <div className="p-6 pt-4 flex justify-end gap-3">
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default AddLocationPopup