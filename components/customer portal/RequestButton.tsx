'use client';

import { handleRequest } from '@/lib/socket/request';
import { Button } from '../ui/button'
import { useEffect, useState } from 'react';
import socket from '@/lib/socket/socket';
import { useRouter } from 'next/navigation';

const RequestButton = ({ vehicleNumber, id }: { vehicleNumber: string; id: number }) => {

    const [change, setChange] = useState(false)
    const router = useRouter();

    useEffect(() => {
        if (!vehicleNumber) return;

        const vehicle = vehicleNumber.trim().toUpperCase();

        const joinVehicle = () => {
            console.log("Joining vehicle:", vehicle);
            socket.emit("join-vehicle", vehicle);
        };

        const handleUpdate = () => {
            console.log("Refreshing page...");
            router.refresh();
        };

        // Join on first load
        if (socket.connected) {
            joinVehicle();
        }

        // Rejoin after reconnect (CRITICAL for iOS)
        socket.on("connect", joinVehicle);

        // Listen for updates
        socket.on("update-customer", handleUpdate);

        return () => {
            socket.off("connect", joinVehicle);
            socket.off("update-customer", handleUpdate);
        };

    }, [vehicleNumber, router]);

    const handleClick = async () => {

        try {
            const res = await handleRequest(id);
            if (!res.success) {
                alert(res?.message);
                return;
            }
            setChange(true)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='w-full'>
            {change ?
                <Button className="w-full" type="button">Car Requested</Button>
                :
                <Button className="w-full" type="button" onClick={handleClick}>Get My Car</Button>
            }
        </div>
    )
}

export default RequestButton