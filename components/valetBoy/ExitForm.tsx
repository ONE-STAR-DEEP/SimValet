'use client'

import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { exitEntry } from '@/lib/actions/valetBoy';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const ExitForm = ({ vehicle }: { vehicle: string }) => {

    const router = useRouter();

    const [carNumber, setCarNumber] = useState(vehicle);

    const handleSubmit = async () => {

        try {
            const res = await exitEntry(carNumber);
            if(!res.success){
                alert(res.message)
            }
            router.push("/valet-boy/dashboard")
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4'>

            <h1 className='text-2xl font-bold'>Vehicle Exit form</h1>

            <FieldGroup className='space-y-2 w-full p-2 border rounded-xl'>
                <Field>
                    <Label>Vehicle Number</Label>
                    <Input
                        className='bg-white'
                        disabled
                        value={carNumber}
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

export default ExitForm