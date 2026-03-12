"use client"

import { useEffect, useState } from "react"

export default function SplashWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setTimeout(() => setLoading(false), 3000)
    }, [])

    if (loading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-white text-primary px-6">

                {/* Logo Section */}
                <div className="text-center mb-8">
                    <div className="rounded-full w-40 h-40 flex items-center justify-center mb-1 mx-auto">
                        <img src="/assets/images/logo3.png" className="w-36" />
                    </div>

                    <p className="font-semibold text-xl tracking-wide">
                        SimValetPark
                    </p>
                </div>

                {/* Tagline */}
                <div className="text-center mb-10">
                    <p className="text-gray-600 text-sm tracking-wide">
                        Smart Parking · Zero Waiting
                    </p>
                </div>

                {/* Company Credit */}
                <div className="absolute bottom-8 text-center">
                    <p className="text-xs text-gray-400 tracking-wide">
                        A Thaver Tech Product
                    </p>
                </div>

            </div>
        )
    }

    return children
}