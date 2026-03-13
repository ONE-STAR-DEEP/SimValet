'use client'

import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitEntry } from '@/lib/actions/valetBoy';
import { VehicleEntry } from '@/lib/types/types';
import { CarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CameraCapture from './CameraInput';

const EntryForm = () => {

    const router = useRouter();

    const [data, setData] = useState<VehicleEntry>({
        vehicleNumber: "",
        owner: "",
        mobile: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const vehicleNumber = data.vehicleNumber.trim().toUpperCase();
        if (!vehicleNumber) return;

        const res = await submitEntry({
            data: {
                ...data,
                vehicleNumber
            }
        });

        if (!res?.success) {
            alert(res?.message ?? "Something went wrong");
            return;
        }

        setData({
            vehicleNumber: "",
            owner: "",
            mobile: "",
        });

        router.refresh();
    } catch (error) {
        console.error("Submit entry error:", error);
    }
};

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='h-full p-4 rounded-xl space-y-4 border border-primary/20'>

                <div className='flex gap-2'>
                    <CarIcon />
                    <p className='text-lg font-bold'>Vehicle Entry</p>
                </div>

                <FieldGroup className='space-y-0 w-full p-2 '>
                    <Field>
                        <Label>
                            Vehicle Number
                        </Label>
                        <Input
                            className='bg-white'
                            value={data.vehicleNumber}
                            placeholder='SS00AA0000'
                            onChange={(e) =>
                                setData(prev => ({
                                    ...prev,
                                    vehicleNumber: e.target.value
                                }))}
                        ></Input>
                        <CameraCapture/>
                    </Field>

                    <Field>
                        <Label>Vehicle Owner</Label>
                        <Input
                            className='bg-white'
                            value={data.owner}
                            placeholder='Owner Name'
                            onChange={(e) =>
                                setData(prev => ({
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
                            value={data.mobile}
                            placeholder='Owner Mobile'
                            onChange={(e) =>
                                setData(prev => ({
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
            </div>
        </form>
    )
}

export default EntryForm