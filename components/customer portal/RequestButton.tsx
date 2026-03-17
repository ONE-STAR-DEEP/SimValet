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

        socket.emit("join-vehicle", vehicleNumber.trim().toUpperCase());

    }, [vehicleNumber]);

    // Listen for updates → refresh page
    useEffect(() => {
        const handleUpdate = () => {
            console.log("Refreshing page...");
            router.refresh();
        };

        socket.off("update-customer"); 
        socket.on("update-customer", handleUpdate);

        return () => {
            socket.off("update-customer", handleUpdate);
        };
    }, []);

    const handleClick = async () => {

        try {
            const res = await handleRequest(id);
            if (!res.success) {
                alert("Failed to request. Try again in a few minutes");
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