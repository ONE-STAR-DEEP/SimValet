'use client'

import { CarIcon } from 'lucide-react'
import { Field } from '../ui/field'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

const VehicleInput = () => {

    const [input, setInput] = useState("")
    const router = useRouter();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const button = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
        const action = button.value

        try {

            if(input.length === 0){
                return;
            }
            const formatedInput = input.toUpperCase();
            if (action === "entry") {
                router.push(`/valet-boy/${formatedInput}/entry`)
                console.log("Vehicle Entry:", input)
            }

            if (action === "exit") {
                router.push(`/valet-boy/${formatedInput}/exit`)
                console.log("Vehicle Exit:", input)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='h-full p-4 rounded-xl space-y-4 border border-primary/20'>

                <div className='flex gap-2'>
                    <CarIcon />
                    <p className='text-lg font-bold'>Application Actions</p>
                </div>

                <Field className='px-2 space-y-2'>

                    <Label>Licence Plate Number</Label>

                    <Input
                        className='h-10 rounded-2xl bg-white'
                        placeholder='SS 00 AA 0000'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        required
                    />

                    <div className="flex gap-2">
                        <Button
                            className='h-10 rounded-2xl flex-1'
                            type="submit"
                            value="entry"
                        >
                            <CarIcon /> Vehicle Entry
                        </Button>

                        <Button
                            variant="outline"
                            className='h-10 rounded-2xl flex-1'
                            type="submit"
                            value="exit"
                        >
                            <CarIcon /> Vehicle Exit
                        </Button>

                    </div>

                </Field>
            </div>
        </form>
    )
}

export default VehicleInput