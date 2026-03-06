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
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ValetBoyData } from "@/lib/types/types";
import { insertValetBoy } from "@/lib/actions/locationManager";


const AddValetBoyPopup = () => {

    const router = useRouter();

    const initialState: ValetBoyData = {
        count: 1,
        name: [],
        prk_lot_id: [],
        valet_boy_id: [],
        mobile: [],
    }

    const [data, setData] = useState<ValetBoyData>(initialState)

    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        console.log(data)

        const res = await insertValetBoy(data);

        if (!res.success) {
            alert("Failed to Insert")
        }
        setData(initialState)
        setOpen(false);
        router.refresh();
    }

    return (
        <div>
            <Button type="button" onClick={() => { setOpen(true) }}>
                <Plus /> Add Valet Boys
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
                            <DialogTitle className="text-xl text-primary">
                                Register New Valet Staff
                            </DialogTitle>
                            <DialogDescription>
                                Add new valet staff members to this location by providing their complete details below.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-6">

                            <FieldLabel className="text-lg mt-4 text-primary">

                            </FieldLabel>

                            <Field>
                                <FieldLabel className="text-primary">Number of Boys</FieldLabel>

                                <div className="flex items-center gap-3">

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        disabled={data.count <= 1}
                                        onClick={() =>
                                            setData(prev => ({
                                                ...prev,
                                                count: Math.max(1, prev.count - 1)
                                            }))
                                        }
                                    >
                                        -
                                    </Button>

                                    <Input
                                        type="number"
                                        min={1}
                                        max={99}
                                        value={data.count}
                                        onChange={(e) => {
                                            let value = Number(e.target.value)

                                            if (isNaN(value)) value = 1
                                            value = Math.max(1, Math.min(99, value))

                                            setData(prev => ({
                                                ...prev,
                                                count: value
                                            }))
                                        }}
                                        className="w-20 h-9 text-center"
                                    />

                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        disabled={data.count >= 99}
                                        onClick={() =>
                                            setData(prev => ({
                                                ...prev,
                                                count: Math.min(99, prev.count + 1)
                                            }))
                                        }
                                    >
                                        +
                                    </Button>

                                </div>
                            </Field>

                            <FieldGroup className="flex flex-col gap-4 mt-4">

                                {Array.from({ length: data.count }).map((_, index) => (
                                    <div key={index} className="border p-4 rounded-lg mt-4 space-y-3">

                                        <h3 className="font-semibold text-primary">
                                            Valet Boy {index + 1}
                                        </h3>

                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                            <Field>
                                                <FieldLabel>Name</FieldLabel>
                                                <Input
                                                    placeholder="Enter name"
                                                    value={data.name[index] || ""}
                                                    required
                                                    onChange={(e) => {
                                                        const updated = [...data.name]
                                                        updated[index] = e.target.value

                                                        setData(prev => ({
                                                            ...prev,
                                                            name: updated
                                                        }))
                                                    }}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>Parking lot</FieldLabel>
                                                <Input placeholder="Enter Parking Lot No"
                                                    value={data.prk_lot_id[index] || ""}
                                                    required
                                                    onChange={(e) => {
                                                        const updated = [...data.prk_lot_id]
                                                        updated[index] = e.target.value

                                                        setData(prev => ({
                                                            ...prev,
                                                            prk_lot_id: updated
                                                        }))
                                                    }}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>Valet Boy ID</FieldLabel>
                                                <Input placeholder="Enter assigned physical ID"
                                                    value={data.valet_boy_id[index] || ""}
                                                    required
                                                    onChange={(e) => {
                                                        const updated = [...data.valet_boy_id]
                                                        updated[index] = e.target.value

                                                        setData(prev => ({
                                                            ...prev,
                                                            valet_boy_id: updated
                                                        }))
                                                    }}
                                                />
                                            </Field>

                                            <Field>
                                                <FieldLabel>Mobile</FieldLabel>
                                                <Input placeholder="Enter mobile number"
                                                    value={data.mobile[index] || ""}
                                                    required
                                                    onChange={(e) => {
                                                        const updated = [...data.mobile]
                                                        updated[index] = e.target.value

                                                        setData(prev => ({
                                                            ...prev,
                                                            mobile: updated
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

export default AddValetBoyPopup