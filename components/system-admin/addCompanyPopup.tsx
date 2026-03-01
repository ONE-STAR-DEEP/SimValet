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
import { Label } from "@/components/ui/label"

import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { FormEvent, useState } from "react";
import { insertCompany } from "@/lib/actions/systemAdmin";
import { useRouter } from "next/navigation";


const AddCompanyPopup = () => {

    const router = useRouter();

    const [data, setData] = useState({
        companyName: "",
        email: "",
        gstNo: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        contactPerson: "",
        personMobile: "",
        personDesignation: ""
    })

    const [open, setOpen] = useState(false)

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        const res = await insertCompany(data);

        if(!res.success){
            alert("Failed to Insert")
        }

        setOpen(false);
        router.refresh();
    
    }

    return (
        <div>
            <Button type="button" onClick={() => { setOpen(true) }}>
                <Plus /> Add Company
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
                            <DialogTitle className="text-xl">Add Company</DialogTitle>
                            <DialogDescription>
                                Enter the details below to register a new valet company in the system.
                            </DialogDescription>
                        </DialogHeader>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto px-6">

                            <FieldLabel className="text-lg mt-4 text-primary">
                                Company Details
                            </FieldLabel>
                            <FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                                <Field>
                                    <Label htmlFor="CompanyName">Company Name</Label>
                                    <Input id="companyName" name="CompanyName" placeholder="Company" required
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                companyName: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="Email">Company Email</Label>
                                    <Input id="email" name="email" placeholder="Company" required
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                email: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="gstno">GST No</Label>
                                    <Input id="gstno" name="gstno" placeholder="22AAAAA0000A1Z5" required
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                gstNo: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="address">Address</Label>
                                    <Input id="address" name="address" placeholder="Office Address"
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                address: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" name="city" placeholder="City"
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                city: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" name="state" placeholder="State"
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                state: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="country">Country</Label>
                                    <Input id="country" name="country" placeholder="Country"
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                country: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="pincode">Pincode</Label>
                                    <Input id="pincode" name="pincode" placeholder="000000"
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                pincode: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
                            </FieldGroup>

                            <FieldLabel className="text-lg mt-4 text-primary">
                                Contact Person Details
                            </FieldLabel>

                            <FieldGroup className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">

                                <Field>
                                    <Label htmlFor="contactPerson">Contact Person</Label>
                                    <Input id="contactPerson" name="contactPerson" placeholder="Full Name" required
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                contactPerson: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="personMobile">Person Mobile</Label>
                                    <Input id="personMobile" name="personMobile" placeholder="Mobile" required
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                personMobile: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
                                <Field>
                                    <Label htmlFor="personDesignation">Person Designation</Label>
                                    <Input id="personDesignation" name="personDesignation" placeholder="Designation" required
                                        onChange={(e) =>
                                            setData(prev => ({
                                                ...prev,
                                                personDesignation: e.target.value
                                            }))
                                        }
                                    />
                                </Field>
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

export default AddCompanyPopup