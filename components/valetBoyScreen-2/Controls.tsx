"use client"

import Image from 'next/image'
import { useRef, useState } from 'react';
import { useCameraCapture } from './useCameraCapture';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

import { Ban, ImageOff, Trash2Icon } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { checkVehicle } from '@/lib/actions/valetBoy';

const Controls = () => {

    const [loader, setLoader] = useState(false)
    const [trigger, setTrigger] = useState(false)
    const [msg, setMsg] = useState("");
    const [heading, setHeading] = useState("");

    const router = useRouter();

    const inputRef = useRef<HTMLInputElement>(null);
    const [currentType, setCurrentType] = useState<"entry" | "exit" | null>(null);
    const { captureAndProcess } = useCameraCapture();

    const handleClick = (type: "entry" | "exit") => {
        setCurrentType(type);
        inputRef.current?.click();
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoader(true);
        const file = e.target.files?.[0];
        if (!file) {

            return;
        }
        const plate = await captureAndProcess(file);

        if (plate) {

            setLoader(false)
            if (currentType === "entry") {
                router.push(`/valet-boy/dashboard/screen-2/entry?plate=${plate}`);
            } else if (currentType === "exit") {

                const res = await checkVehicle(plate.toUpperCase())

                if (!res.success) {
                    setLoader(false)
                    setMsg(res.message);
                    setHeading("Verification Failed")
                    setTrigger(true)
                    e.target.value = "";
                    return;
                }
                router.push(`/valet-boy/dashboard/screen-2/exit?plate=${plate}`);
            }

        } else {
            setLoader(false)
            setHeading("Capture Failed")
            setMsg("Vehicle number not detected. Please retake the photo clearly.")
            setTrigger(true)
        }

        e.target.value = "";
    };

    return (
        <div className='h-full flex flex-col justify-between'>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleChange}
                className="hidden"
            />

            <div className='w-full space-y-10'>
                <Image
                    src="/assets/images/1.png"
                    alt="enter"
                    height={1000}
                    width={1000}
                    className="
                            rounded-lg
                            border
                            p-0
                            transition-all duration-200
                            shadow-md
                            active:shadow-2xl
                            active:scale-95
                            active:brightness-75
                        "
                    onClick={() => handleClick("entry")}
                />
                <Image
                    src="/assets/images/2.png"
                    alt='enter'
                    height={1000}
                    width={1000}
                    className="
                            rounded-lg
                            border
                            transition-all duration-200
                            shadow-md
                            active:shadow-2xl
                            active:scale-95
                            active:brightness-75
                        "
                    onClick={() => handleClick("exit")}
                />

                <div className="h-20 overflow-hidden 
                                    rounded-lg 
                                    transition-all 
                                    duration-200
                                    shadow-md
                                    active:shadow-2xl
                                    active:scale-95
                                    active:brightness-75">
                    <Image
                        src="/assets/images/3.png"
                        alt="enter"
                        height={1000}
                        width={1000}
                        className="
                            w-full h-full
                            object-cover
                            object-center
                            "
                    />
                </div>

            </div>

            <AlertDialog open={trigger} onOpenChange={setTrigger}>

                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            {heading === "Capture Failed" ? <ImageOff /> : <Ban />}
                        </AlertDialogMedia>
                        <AlertDialogTitle>{heading}...!</AlertDialogTitle>
                        <AlertDialogDescription>
                            {msg}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex'>
                        <AlertDialogAction
                            onClick={() => {
                                if (currentType) {
                                    router.push(`/valet-boy/dashboard/screen-2/${currentType}`);
                                }
                            }}
                        >
                            Enter Manually
                        </AlertDialogAction>
                        <AlertDialogCancel variant={"destructive"}>Try Again</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {
                loader &&
                <Loader />
            }

        </div>
    )
}

export default Controls