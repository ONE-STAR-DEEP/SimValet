'use client'

import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { exitEntry, submitEntry } from '@/lib/actions/valetBoy';
import { VehicleEntry, VehicleExit } from '@/lib/types/types';
import { CarIcon, Dot } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CameraCapture from './CameraInput';

type EntryExitFormProps = {
    mode: "entry" | "exit";
    response: boolean;
    setMode: React.Dispatch<React.SetStateAction<"entry" | "exit">>;
    setResponse: React.Dispatch<React.SetStateAction<any>>;
};

const EntryExitForm = ({
    mode,
    response,
    setMode,
    setResponse
}: EntryExitFormProps) => {
    const router = useRouter();

    const [entryData, setEntryData] = useState<VehicleEntry>({
        vehicleNumber: "",
        token: "",
        owner: "",
        mobile: "",
    });

    const [exitData, setExitData] = useState<VehicleExit>({
        vehicleNumber: "",
        status: "Assigned",
        token: "",
    });

    // const [mode, setmode] = useState("entry");

    const handleEntrySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            
            if (mode === "entry") {
                const vehicleNumber = entryData.vehicleNumber.trim().toUpperCase();
                if (!vehicleNumber) return;

                const res = await submitEntry({
                    entryData: {
                        ...entryData,
                        vehicleNumber
                    }
                });

                if (!res?.success) {
                    alert(res?.message ?? "Something went wrong");
                    return;
                }

                setEntryData({
                    vehicleNumber: "",
                    token: "",
                    owner: "",
                    mobile: "",
                });   
            }
            
            if(mode ==="exit"){
                const vehicleNumber = exitData.vehicleNumber.trim().toUpperCase();
                if (!vehicleNumber) return;

                const res =await exitEntry(vehicleNumber, exitData.token);
                 if (!res?.success) {
                    alert(res?.message ?? "Something went wrong");
                    return;
                }

                setExitData({
                    vehicleNumber: "",
                    token: "",
                    status: "",
                });   
                
            }
            router.refresh();

        } catch (error) {
            console.error("Submit entry error:", error);
        }
    };

    return (
        <form onSubmit={handleEntrySubmit} className='space-y-4'>
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
                                    onChange={(e) =>
                                        setEntryData(prev => ({
                                            ...prev,
                                            vehicleNumber: e.target.value
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
                                <Button type='submit' className='w-full'>Submit</Button>
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
                                        value={"SS00AA0000"}
                                        disabled
                                        onChange={(e) =>
                                            setEntryData(prev => ({
                                                ...prev,
                                                vehicleNumber: e.target.value
                                            }))}
                                    ></Input>
                                </div>
                            </Field>

                            {exitData.status === "Assigned" &&
                                <Button type='button' onClick={() => setExitData(prev => ({
                                    ...prev,
                                    status: "Drive way"
                                }))}>Update Status: Drive Way
                                </Button>}

                            {exitData.status === "Drive way" &&
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
                                                onChange={(e) =>
                                                    setExitData(prev => ({
                                                        ...prev,
                                                        token: e.target.value
                                                    }))
                                                }
                                            />

                                        </div>
                                    </Field>

                                    <Button type='button' onClick={() => {
                                        setMode("entry")
                                        setExitData(prev => ({
                                            ...prev,
                                            status: "Verified & Dropped"
                                        }))
                                    }}>
                                        Verify Token
                                    </Button>
                                    <Button type='button' variant={'outline'} className='border border-primary' onClick={() => {
                                        setMode("entry")
                                        setExitData(prev => ({
                                            ...prev,
                                            status: "Verified & Dropped"
                                        }))
                                    }}>
                                        Drop Vehicle
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
                                        value={exitData.vehicleNumber}
                                        placeholder='SS00AA0000'
                                        onChange={(e) =>
                                            setExitData(prev => ({
                                                ...prev,
                                                vehicleNumber: e.target.value
                                            }))}
                                    ></Input>
                                    <CameraCapture<VehicleExit> data={entryData} setData={setExitData} />
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
                                        placeholder="token number"
                                        onChange={(e) =>
                                            setExitData(prev => ({
                                                ...prev,
                                                token: e.target.value
                                            }))
                                        }
                                    />

                                </div>
                            </Field>

                            <Field >
                                <div className='w-full flex flex-row gap-2 justify-center'>
                                    <Button type='submit' className='w-full'>Verify Token & Deliver</Button>
                                </div>
                            </Field>
                        </FieldGroup>
                    </>
                }
            </div>
        </form >
    )
}

export default EntryExitForm