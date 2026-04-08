"use client"

import { FormEvent, useState } from "react"
import { Field } from "../ui/field"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import { submitEntry } from "@/lib/actions/valetBoy"
import { useRouter } from "next/navigation"
import { Ban, ImageOff } from "lucide-react"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ApiResponse = {
    success: boolean;
    message: string;
};

const EntryComponent = ({ vehicleNumber }: { vehicleNumber: string }) => {

    const [data, setData] = useState({
        vehicleNumber: vehicleNumber,
        token: "",
        owner: "",
        mobile: "",
    })
    const [loading, setLoading] = useState(false)
    const [trigger, setTrigger] = useState(false)
    const [msg, setMsg] = useState("")

    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (loading) return;
        setLoading(true)
        const vehicleNumber = data.vehicleNumber.trim().toUpperCase();
        if (!vehicleNumber) return;

        const res: ApiResponse = await submitEntry({
            entryData: {
                ...data,
                vehicleNumber
            }
        });

        if (!res?.success) {
            setMsg(res.message)
            setTrigger(true)
            setLoading(false)
            return;
        }

        router.push(`/valet-boy/dashboard/screen-2/success?token=${data.token}`)

        setData({
            vehicleNumber: "",
            token: "",
            owner: "",
            mobile: "",
        });

        setLoading(false)
    }
    return (
        <div className="h-full border-2 border-gray-300 rounded-lg py-10 px-4">
            <div className='h-full flex flex-col'>
                <h3 className="text-xl font-semibold">Entry Vehicle</h3>

                <form onSubmit={handleSubmit}>
                    <Field className="mt-8">
                        <Label>Vehicle Number</Label>
                        <div className='flex gap-2'>
                            <Input
                                className='bg-white border border-gray-600 h-8'
                                value={data.vehicleNumber}
                                onChange={(e) =>
                                    setData(prev => ({
                                        ...prev,
                                        vehicleNumber: e.target.value
                                    }))
                                }
                            ></Input>
                        </div>
                    </Field>

                    <Field className="mt-4">
                        <Label>Token</Label>

                        <div className="flex items-center border-2 border-gray-400 rounded-md bg-white">

                            <span className="px-3 text-sm text-muted-foreground border-r">
                                SVPT
                            </span>

                            <Input
                                className="border-0 focus-visible:ring-0"
                                value={data.token}
                                placeholder="token number"
                                onChange={(e) =>
                                    setData(prev => ({
                                        ...prev,
                                        token: e.target.value
                                    }))
                                }
                            />

                        </div>
                    </Field>

                    <Accordion type="single" collapsible>
                        <AccordionItem value="account" className="mt-4 border-none">

                            <AccordionTrigger className="text-sm font-semibold">
                                Additional Information
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="flex flex-col gap-5 text-sm p-2">

                                    <Field className="mt-">
                                        <Label>Owner Name</Label>
                                        <div className='flex gap-2'>
                                            <Input
                                                className="bg-white border border-gray-600 h-8"
                                                value={data.owner}
                                                placeholder="Owner Name"
                                                onChange={(e) => {
                                                    setData((prev) => ({
                                                        ...prev,
                                                        owner: e.target.value
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </Field>

                                    <Field className="">
                                        <Label>Mobile Number</Label>
                                        <div className='flex gap-2'>
                                            <Input
                                                className="bg-white border border-gray-600 h-8"
                                                value={data.mobile}
                                                placeholder="Mobile Number"
                                                maxLength={15}
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                onChange={(e) => {
                                                    const value = e.target.value.replace(/\D/g, ""); // remove non-digits

                                                    setData((prev) => ({
                                                        ...prev,
                                                        mobile: value
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </Field>

                                </div>
                            </AccordionContent>

                        </AccordionItem>
                    </Accordion>

                    <Button type="submit" className="w-full mt-4">Park</Button>
                </form>
            </div>

            <AlertDialog open={trigger} onOpenChange={setTrigger}>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Ban />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Entry Failed...!</AlertDialogTitle>
                        <AlertDialogDescription>
                            {msg}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className='ml-auto w-30' variant={"destructive"}>Try Again</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}

export default EntryComponent