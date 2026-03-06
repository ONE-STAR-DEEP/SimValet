'use client'

import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { submitEntry } from '@/lib/actions/valetBoy';
import { VehicleEntry } from '@/lib/types/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const EntryForm = ({ vehicle }: { vehicle: string }) => {

    const router = useRouter();

    const [data, setData] = useState<VehicleEntry>({
        vehicleNumber: vehicle,
        owner: "",
        mobile: "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const res = await submitEntry({ data });
            if (!res.success) {
                alert("Failed");
                return;
            }
            router.push("/valet-boy");
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>

            <h1 className='text-2xl font-bold'>Vehicle Entry form</h1>

            <FieldGroup className='space-y-2 w-full p-2 border rounded-xl'>
                <Field>
                    <Label>Vehicle Number</Label>
                    <Input
                        className='bg-white'
                        disabled
                        value={data.vehicleNumber}
                    ></Input>
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
                        <Button variant={'outline'} type='button' onClick={() => { router.back() }}>Cancle</Button>
                        <Button type='submit'>Submit</Button>
                    </div>
                </Field>
            </FieldGroup>
        </form>
    )
}

export default EntryForm