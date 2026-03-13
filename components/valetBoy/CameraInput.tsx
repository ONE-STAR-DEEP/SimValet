'use client'

import { useRef, useState } from "react";
import { CameraIcon, Loader } from "lucide-react";
import { VehicleEntry } from "@/lib/types/types";


type Props = {
    data: VehicleEntry;
    setData: React.Dispatch<React.SetStateAction<VehicleEntry>>;
};

export default function CameraCapture({ data, setData }: Props) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState("")

    const openCamera = () => {
        inputRef.current?.click();
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)
        setMsg("Waiting")
        const file = e.target.files?.[0];
        if (!file) {
            alert("Failed to Capture Image");
            return
        };
        setMsg("Image Captured")

        try {
            const formData = new FormData();
            formData.append("upload", file);
            formData.append("regions", "in");
            setMsg("Sending Image")
            const res = await fetch("https://api.platerecognizer.com/v1/plate-reader/", {
                method: "POST",
                headers: {
                    Authorization: `Token ${process.env.NEXT_PUBLIC_SNAPSHOT_API_KEY!}`,
                },
                body: formData,
            });

            setMsg("Responce Received")


            const result: any = await res.json();

            if (result.results?.length > 0) {
                const plate = result.results[0].plate;

                setMsg(plate)

                setData(prev => ({
                    ...prev,
                    vehicleNumber: plate.toUpperCase()
                }));

            } else {
                alert("No number plate detected");
            }

        } catch (err) {
            console.error("Plate recognition error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Camera Icon */}
            {loading ?
                <button
                    type="button"
                    className="p-2 border border-primary/20 bg-white rounded-lg w-fit">
                    <Loader className="text-primary" size={16} />
                </button>
                :
                <button
                    type="button"
                    onClick={openCamera}
                    className="p-2 border border-primary/20 bg-white rounded-lg w-fit"
                >
                    <CameraIcon className="" size={16} />
                </button>
            }

            {/* Hidden camera input */}
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleChange}
                style={{ display: "none" }}
            />

            <p>{msg}</p>
        </div>
    );
}