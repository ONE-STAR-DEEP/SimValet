'use client'

import { useRef, useState } from "react";
import { Camera } from "lucide-react";

export default function CameraCapture() {

  const inputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<File | null>(null);

  const openCamera = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
  };

  return (
    <div className="flex flex-col gap-4">

      {/* Camera Icon */}
      <button
        type="button"
        onClick={openCamera}
        className="p-3 bg-gray-200 rounded-full w-fit"
      >
        <Camera size={20} />
      </button>

      {/* Hidden camera input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {image && (
        <img
          src={URL.createObjectURL(image)}
          className="w-40 rounded"
        />
      )}

    </div>
  );
}