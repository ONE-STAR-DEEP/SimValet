// useCameraCapture.ts
'use client'

import imageCompression from "browser-image-compression";

export const useCameraCapture = () => {

  const captureAndProcess = async (file: File) => {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1600,
    });

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

    const result = await res.json();

    if (result.results?.length > 0) {
      return result.results[0].plate.toUpperCase();
    }

    return null;
  };

  return { captureAndProcess };
};