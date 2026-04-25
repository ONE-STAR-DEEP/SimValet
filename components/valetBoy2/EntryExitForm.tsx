'use client'

import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { exitEntry, submitEntry, updateStatus } from '@/lib/actions/valetBoy';
import { Request, VehicleEntry, VehicleExit } from '@/lib/types/types';
import { CarIcon, Check, Dot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CameraCapture from './CameraInput';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import socket from '@/lib/socket/socket';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog"
import QRComponent from '../valetBoyScreen-2/QR';
import Image from 'next/image';
import { Montserrat } from 'next/font/google';
import QrScanner from './QRScanner';

const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
});

type EntryExitFormProps = {
    mode: "entry" | "exit";
    response?: Request | null;
    setMode: React.Dispatch<React.SetStateAction<"entry" | "exit">>;
    setResponse: React.Dispatch<React.SetStateAction<Request | null>>;
};

const EntryExitForm = ({
    mode,
    response,
    setMode,
    setResponse
}: EntryExitFormProps) => {
    const router = useRouter();

    async function generateToken() {
        const length = Math.floor(Math.random() * 5) + 1; // 1 to 5 digits
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        return Math.floor(min + Math.random() * (max - min + 1));
    }

    const [entryData, setEntryData] = useState<VehicleEntry>({
        vehicleNumber: "",
        token: "",
        owner: "",
        mobile: "",
    });

    const [exitData, setExitData] = useState<VehicleExit>({
        vehicleNumber: response?.vehicle_number || "",
        status: "Assigned",
        token: "",
        mode: ""
    });

    const [entryLoading, setEntryLoading] = useState(false);
    const [exitLoading, setExitLoading] = useState(false)
    const [payment, setPayment] = useState(true);
    const [open, setOpen] = useState(false)
    const [exitSuccess, setExitSuccess] = useState(false)

    useEffect(() => {
        if (!response?.vehicle_number) return;

        setExitData({
            vehicleNumber: response.vehicle_number,
            status: "Assigned",
            token: "",
            mode: ""
        });
    }, [response]);

    useEffect(() => {
        const initSocket = async () => {

            console.log("Joining valet room:", response?.activity_id);
            socket.emit("join-valet", response?.activity_id);

            socket.on("payment-update", (data) => {
                console.log("Payment received:", data);
                alert("Payment received for this vehicle. You can now verify and deliver the car.");
                setPayment(false)
            });
        };

        initSocket();

        return () => {
            socket.off("payment-update");
        };
    }, [response?.activity_id]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {

            if (mode === "entry") {
                if (entryLoading) return;
                setEntryLoading(true)
                const vehicleNumber = entryData.vehicleNumber.trim().toUpperCase();
                if (!vehicleNumber) return;

                let finalToken = entryData.token;

                if (entryData.token.length === 0) {
                    finalToken = String(await generateToken());
                    setEntryData((prev) => ({
                        ...prev,
                        token: finalToken
                    }))
                }

                const res = await submitEntry({
                    entryData: {
                        ...entryData,
                        vehicleNumber,
                        token: finalToken
                    }
                });

                if (!res?.success) {
                    alert(res?.message ?? "Something went wrong");
                    return;
                }
                // router.push(`/valet-boy/dashboard/success?token=${entryData.token}`)
                setOpen(true)
                return;
            }

            if (mode === "exit") {
                if (exitLoading) return;
                if (!exitData.mode) {
                    alert("Select payment mode")
                    return
                }
                setExitLoading(true)
                const vehicleNumber = exitData.vehicleNumber.trim().toUpperCase();
                if (!vehicleNumber) return;

                const res = await exitEntry(vehicleNumber, exitData.token, exitData.mode);
                if (!res?.success) {
                    alert(res?.message ?? "Something went wrong");
                    return;
                }

                socket.emit("update-customer", {
                    success: true,
                    vehicle_number: vehicleNumber,
                });

                setExitData({
                    vehicleNumber: "",
                    token: "",
                    status: "Assigned",
                    mode: ""
                });

                setResponse(null)
                setExitLoading(false)
                setExitSuccess(true);
            }
            router.refresh();

        } catch (error) {
            console.error("Submit entry error:", error);
        } finally {
            setEntryLoading(false);
            setExitLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (exitLoading) return;
        setExitLoading(true)
        try {
            if (exitData.status === "Assigned") {
                const vehicleNumber = exitData.vehicleNumber.trim().toUpperCase();
                if (!vehicleNumber) return;
                const res = await updateStatus(vehicleNumber, "Drive-Way")
                if (res.success) {
                    socket.emit("update-customer", {
                        success: true,
                        vehicle_number: vehicleNumber,
                    });
                    setExitData((prev) => ({
                        ...prev,
                        status: "Drive-Way"
                    }));
                }
            }
        } catch (error) {

        } finally {
            setExitLoading(false)
        }
    }

    const handleVerify = async () => {
        if (exitLoading) return;
        if (payment && !exitData.mode) {
            alert("Select payment mode")
            return
        }
        setExitLoading(true)
        try {
            if (exitData.status === "Drive-Way") {
                const vehicleNumber = exitData.vehicleNumber.trim().toUpperCase();
                if (!vehicleNumber) return;

                const res = await exitEntry(vehicleNumber, exitData.token, exitData.mode);
                if (!res?.success) {
                    alert(res?.message ?? "Something went wrong");
                    return;
                }

                socket.emit("update-customer", {
                    success: true,
                    vehicle_number: vehicleNumber,
                });

                setExitData({
                    vehicleNumber: "",
                    token: "",
                    status: "Assigned",
                    mode: ""
                });
                setResponse(null);
                setExitSuccess(true)
            }

        } catch (error) {

        } finally {
            setExitLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='h-full rounded-xl border border-primary/20 overflow-hidden'>
                    <div className='w-full flex'>
                        <div onClick={() => setMode("entry")}
                            className={`w-full px-3 py-4 flex gap-2 ${mode === "entry" ? "text-primary bg-white" : "text-gray-500 border-b border-r "}`}>
                            <CarIcon />
                            <p className='text-md font-bold'>Vehicle Entry</p>
                        </div>
                        <div onClick={() => setMode("exit")} className={`w-full px-3 py-4 flex gap-2 ${mode === "exit" ? "text-primary bg-white" : "text-gray-500 border-b border-l "}`}>
                            <CarIcon className='scale-x-[-1]' />
                            <p className='text-md font-bold'>Vehicle Exit</p>
                        </div>
                    </div>

                    {
                        mode === "entry" &&
                        <FieldGroup className='space-y-0 w-full px-4 py-6 bg-white '>
                            <Field>
                                <Label>
                                    Vehicle Number
                                </Label>
                                <div className='flex gap-2'>
                                    <Input
                                        className='bg-white'
                                        value={entryData.vehicleNumber}
                                        placeholder='SS00AA0000'
                                        minLength={5}
                                        required
                                        onChange={(e) =>
                                            setEntryData(prev => ({
                                                ...prev,
                                                vehicleNumber: e.target.value.toUpperCase()
                                            }))}
                                    ></Input>
                                    <CameraCapture<VehicleEntry> data={entryData} setData={setEntryData} />
                                </div>
                            </Field>

                            <Field>
                                <Label>Token</Label>

                                <div className="flex items-center border rounded-md bg-white">

                                    <span className="px-3 text-sm text-muted-foreground border-r">
                                        SVPT
                                    </span>

                                    <Input
                                        className="border-0 focus-visible:ring-0"
                                        value={entryData.token}
                                        placeholder="token number"
                                        maxLength={5}
                                        onChange={(e) =>
                                            setEntryData(prev => ({
                                                ...prev,
                                                token: e.target.value
                                            }))
                                        }
                                    />

                                </div>
                            </Field>

                            <Field>
                                <Label>Vehicle Owner</Label>
                                <Input
                                    className='bg-white'
                                    value={entryData.owner}
                                    placeholder='Owner Name'
                                    onChange={(e) =>
                                        setEntryData(prev => ({
                                            ...prev,
                                            owner: e.target.value
                                        }))
                                    }
                                ></Input>
                            </Field>

                            <Field>
                                <Label>Owner Mobile</Label>
                                <Input
                                    className='bg-white'
                                    value={entryData.mobile}
                                    placeholder='Owner Mobile'
                                    onChange={(e) =>
                                        setEntryData(prev => ({
                                            ...prev,
                                            mobile: e.target.value
                                        }))
                                    }
                                ></Input>
                            </Field>

                            <Field >
                                <div className='w-full flex flex-row gap-2 justify-center'>
                                    <Button type='submit' className='w-full' disabled={entryLoading}>
                                        {entryLoading ? "Loading..." : "Submit"}
                                    </Button>
                                </div>
                            </Field>
                        </FieldGroup>
                    }

                    {
                        mode === "exit" && response &&
                        <>
                            <FieldGroup className='space-y-0 w-full px-4 py-6 bg-white '>
                                {exitData.status &&
                                    <div className="flex w-fit rounded-full px-0 items-center border-2 gap-2">
                                        <Dot />
                                        <Label className="text-sm mr-2">Status: <p className='text-green-700'>{exitData.status}</p></Label>
                                    </div>
                                }
                                <Field>
                                    <Label>Vehicle Number</Label>
                                    <div className='flex gap-2'>
                                        <Input
                                            className='bg-white'
                                            value={exitData.vehicleNumber}
                                            disabled
                                        ></Input>
                                    </div>
                                </Field>

                                {exitData.status === "Assigned" &&
                                    <Button type='button' onClick={handleUpdate} disabled={exitLoading}>
                                        {exitLoading ? "Loading..." : "Update Status: Drive Way"}
                                    </Button>}

                                {exitData.status === "Drive-Way" &&
                                    <>
                                        <Field>
                                            <Label>Token</Label>

                                            <div className="flex items-center border rounded-md bg-white">

                                                <span className="px-3 text-sm text-muted-foreground border-r">
                                                    SVPT
                                                </span>

                                                <Input
                                                    className="border-0 focus-visible:ring-0"
                                                    value={exitData.token}
                                                    placeholder="token number"
                                                    maxLength={5}
                                                    onChange={(e) =>
                                                        setExitData(prev => ({
                                                            ...prev,
                                                            token: e.target.value
                                                        }))
                                                    }
                                                />

                                            </div>
                                        </Field>

                                        {payment &&
                                            <Field className='w-full'>
                                                <Select
                                                    required
                                                    value={exitData.mode}
                                                    onValueChange={(value) => {
                                                        setExitData((prev) => ({
                                                            ...prev,
                                                            mode: value,
                                                        }));
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Mode of Payment" />
                                                    </SelectTrigger>
                                                    <SelectContent className='w-full'>
                                                        <SelectGroup className='w-full'>
                                                            <SelectLabel>Modes</SelectLabel>
                                                            <SelectItem value="exempted">Exempted</SelectItem>
                                                            <SelectItem value="upi">UPI</SelectItem>
                                                            <SelectItem value="cash">Cash</SelectItem>
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </Field>}

                                        <Button type='button' onClick={handleVerify} disabled={exitLoading}>
                                            {exitLoading ? "Verifying" : "Verify Token & Deliver"}
                                        </Button>

                                        <Button type='button' variant={'outline'} className='border border-primary'
                                            disabled={exitLoading}
                                            onClick={async () => {
                                                setExitLoading(true)
                                                try {
                                                    const vehicleNumber = exitData.vehicleNumber.trim().toUpperCase();
                                                    if (!vehicleNumber) return;
                                                    const res = await updateStatus(vehicleNumber, "Dropped");
                                                    if (!res.success) {
                                                        alert("Failed")
                                                        return
                                                    }

                                                    socket.emit("update-customer", {
                                                        success: true,
                                                        vehicle_number: vehicleNumber,
                                                    });

                                                    setExitData({
                                                        vehicleNumber: "",
                                                        status: "Assigned",
                                                        token: "",
                                                        mode: ""
                                                    })
                                                    setResponse(null)
                                                } catch (error) {

                                                } finally {
                                                    setExitLoading(false)
                                                }

                                            }}>
                                            {exitLoading ? "Loading..." : "Drop Vehicle"}
                                        </Button>
                                    </>
                                }
                            </FieldGroup>
                        </>
                    }

                    {
                        mode === "exit" && !response &&
                        <>
                            <FieldGroup className='space-y-0 w-full px-4 py-6 bg-white '>
                                <Field>
                                    <Label>
                                        Vehicle Number
                                    </Label>
                                    <div className='flex gap-2'>
                                        <Input
                                            className='bg-white'
                                            required
                                            value={exitData.vehicleNumber}
                                            placeholder='SS00AA0000'
                                            onChange={(e) =>
                                                setExitData(prev => ({
                                                    ...prev,
                                                    vehicleNumber: e.target.value.toUpperCase()
                                                }))}
                                        ></Input>
                                        <CameraCapture<VehicleExit> data={exitData} setData={setExitData} />
                                    </div>
                                </Field>

                                <Field>
                                    <Label>Token</Label>
                                    <div className="flex items-center border rounded-md bg-white">
                                        <span className="px-3 text-sm text-muted-foreground border-r">
                                            SVPT
                                        </span>

                                        <Input
                                            className="border-0 focus-visible:ring-0"
                                            value={exitData.token}
                                            maxLength={5}
                                            placeholder="token number"
                                            onChange={(e) => {
                                                const value = e.target.value.replace(/\D/g, "");
                                                setExitData(prev => ({
                                                    ...prev,
                                                    token: value
                                                }))
                                            }
                                            }
                                        />
                                    </div>
                                </Field>

                                <Field className='w-full'>
                                    <Select
                                        required
                                        value={exitData.mode}
                                        onValueChange={(value) => {
                                            setExitData((prev) => ({
                                                ...prev,
                                                mode: value,
                                            }));
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Mode of Payment" />
                                        </SelectTrigger>
                                        <SelectContent className='w-full'>
                                            <SelectGroup className='w-full'>
                                                <SelectLabel>Modes</SelectLabel>
                                                <SelectItem value="exempted">Exempted</SelectItem>
                                                <SelectItem value="upi">UPI</SelectItem>
                                                <SelectItem value="cash">Cash</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field >
                                    <div className='w-full flex flex-row gap-2 justify-center'>
                                        <Button type='submit' className='w-full'>Verify Token & Deliver</Button>
                                    </div>
                                </Field>

                                <QrScanner setExitData={setExitData} setMode={setMode} />
                            </FieldGroup>
                        </>
                    }
                </div>
            </form >

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-sm gap-0 space-y-0 py-10">

                    <DialogTitle className='h-0'></DialogTitle>

                    <div className='h-full flex flex-col justify-evenly items-center text-center'>
                        {/* <div className="flex flex-col items-center space-y-2">
                            <p className="font-bold text-green-600 text-2xl flex items-center"><Check size={30} className="bg-green-100 mr-2 border border-green-500 rounded-lg" /> SUCCESS</p>
                            <h3 className="font-semibold print:hidden print:h-0">Vehicle Entry Recipt</h3>
                        </div> */}

                        <div className="border-2 border-black px-2 py-4 w-full space-y-2">
                            <header className={`${montserrat.className} flex items-center justify-center`}>
                                <Image
                                    src="/assets/images/logo3.png"
                                    alt="logo"
                                    height={60}
                                    width={60}
                                />
                                <div className="flex flex-col items-center">
                                    <p className="font-bold text-3xl">
                                        SimValet<span className='text-primary'>Park</span>
                                    </p>
                                    <div className="flex items-center justify-center">
                                        <div className="left-taper-line" />
                                        <span className="px-1 text-xs font-semibold">Smart Parking. Zero Waiting.</span>
                                        <div className="right-taper-line" />
                                    </div>
                                </div>
                            </header>

                            <section className="flex flex-col items-center">
                                <h3 className="font-bold text-lg">Welcome to SimValetPark</h3>
                                <p className="text-xs">Smart and Secure Parking</p>
                            </section>

                            <section className="flex flex-col items-center">
                                <div className="border-b border-dashed border-gray-400 w-[60%]"></div>
                                <QRComponent vehicle={entryData.vehicleNumber} token={entryData.token} />
                                <p className="text-xs text-nowrap tracking-tighter">Scan for a Seamless Car Retrieval Experience</p>
                                <div className="border-b border-dashed border-gray-400 w-[60%] my-2"></div>
                                <p className={`${montserrat.className} text-xs`}>TOKEN</p>
                                <p className="font-bold text-2xl">{`SVPT${entryData.token}`}</p>
                                <p className="">Thank you for Parking with Us</p>
                                <div className="flex items-center justify-center">
                                    <div className="left-taper-line scale-150" />
                                    <p className={`${montserrat.className} text-xs px-2`}>A Product of The Thaver Tech</p>
                                    <div className="right-taper-line scale-150" />
                                </div>
                            </section>
                        </div>

                    </div>

                    <DialogFooter className="p-2 mt-4 pt-0 border-t">

                        <Button onClick={() => {
                            setEntryData({
                                vehicleNumber: "",
                                token: "",
                                owner: "",
                                mobile: ""
                            });
                            setOpen(false)
                        }}>Confirm</Button>

                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={exitSuccess} onOpenChange={setExitSuccess}>
                <DialogContent className="sm:max-w-sm gap-0 space-y-0 h-[50vh] p-6 flex flex-col justify-between bg-linear-to-b from-green-50 to-white">

                    {/* Hidden title for accessibility */}
                    <DialogTitle className="sr-only">Delivery Success</DialogTitle>

                    {/* Main Content */}
                    <div className="flex flex-col items-center justify-center flex-1 gap-6">
                        {/* Success Icon */}
                        <div className="relative w-20 h-20">
                            <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
                            <div className="absolute inset-0 flex items-center justify-center bg-primary rounded-full">
                                <svg
                                    className="w-10 h-10 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={3}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Success Message */}
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Delivery Successful!
                            </h2>
                            <p className="text-gray-600">
                                Vehicle has been safely delivered
                            </p>
                        </div>

                        {/* Details */}
                        {/* <div className="w-full bg-white rounded-lg border border-green-200 p-4 space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Vehicle</span>
                                <span className="font-semibold text-gray-900">2024 BMW X5</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Location</span>
                                <span className="font-semibold text-gray-900">Main Entrance</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Time</span>
                                <span className="font-semibold text-gray-900">2:45 PM</span>
                            </div>
                        </div> */}
                    </div>

                    {/* Footer */}
                    <DialogFooter className="p-0 border-t border-gray-200 pt-4">
                        <Button
                            onClick={() => setExitSuccess(false)}
                            className="w-full bg-primary hover:bg-primary/70 text-white"
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EntryExitForm