'use client'

import { useRef, useState } from "react";
import { CameraIcon, Loader } from "lucide-react";
import { VehicleEntry, VehicleExit } from "@/lib/types/types";
import imageCompression from "browser-image-compression";


type Props<T> = {
    data: T;
    setData: React.Dispatch<React.SetStateAction<T>>;
};

export default function CameraCapture<T>({ data, setData }: Props<T>) {

    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false)

    const openCamera = () => {
        inputRef.current?.click();
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoading(true)

        const file = e.target.files?.[0];

        if (!file) {
            alert("Failed to Capture Image");
            return
        };

        const compressedFile = await imageCompression(file!, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1600,
        });

        try {
            const formData = new FormData();
            formData.append("upload", compressedFile);
            formData.append("regions", "in");

            const res = await fetch("https://api.platerecognizer.com/v1/plate-reader/", {
                method: "POST",
                headers: {
                    Authorization: `Token ${process.env.NEXT_PUBLIC_SNAPSHOT_API_KEY!}`,
                },
                body: formData,
            });

            const result: any = await res.json();

            if (result.results?.length > 0) {
                const plate = result.results[0].plate;

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
        </div>
    );
}