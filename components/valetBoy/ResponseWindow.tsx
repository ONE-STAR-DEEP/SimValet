"use client";

import { assignValet, getPendingRequests } from '@/lib/actions/valetBoy';
import socket from '@/lib/socket/socket';
import { Request } from '@/lib/types/types';
import { Clock } from 'lucide-react';
import { useEffect, useState } from "react";

type ResponseWindowProps = {
    companyId: number;
    setMode: React.Dispatch<React.SetStateAction<"entry" | "exit">>;
    setResponse: React.Dispatch<React.SetStateAction<Request | null>>;
};

const ResponseWindow = ({ companyId, setMode, setResponse }: ResponseWindowProps) => {

    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!companyId) return;

        const fetchRequests = async () => {
            const requestData = await getPendingRequests();
            if (requestData.success) {
                setRequests(requestData.data);
            }
        };

        const joinRoom = () => {
            console.log("Joining company:", companyId);
            socket.emit("join-company", companyId);
        };

        // Join immediately (first load)
        joinRoom();

        // Rejoin after every reconnect
        socket.on("connect", joinRoom);

        // Initial fetch
        fetchRequests();

        const handleCarRequest = () => {
            fetchRequests();
        };

        socket.on("car-request", handleCarRequest);

        return () => {
            socket.off("car-request", handleCarRequest);
            socket.off("connect", joinRoom); // cleanup
        };

    }, [companyId]);

    const acceptRequest = async (req: Request) => {
        setLoading(true)
        try {
            const res = await assignValet(req.id, req.vehicle_number)
            if (res.success) {
                setMode("exit")
                setResponse(req)

                socket.emit("car-request", {
                    companyId,
                    type: "REMOVE",
                    vehicle_number: req.vehicle_number
                });

                socket.emit("update-customer", {
                    success: true,
                    vehicle_number: req.vehicle_number,
                    companyId
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (

        <div className="rounded-xl border-2 border-black/20">

            <div className="p-4 flex gap-2 items-center border-b">
                <Clock size={20} />
                <h3 className="font-semibold">Customer Requests</h3>
            </div>

            <div className="flex flex-col">

                {requests.length === 0 ? (

                    <div className="p-6 text-center text-sm text-muted-foreground">
                        No pending requests
                    </div>

                ) : (

                    requests.map((req) => (
                        <div
                            key={req.id}
                            className="p-4 flex items-center justify-between border-b hover:bg-muted/40 transition"
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold text-primary">
                                    {req.vehicle_number}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    Customer Name: {req.customer_name || "Not Provided"}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    Requested {new Date(req.request_time).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true
                                    })}
                                </span>
                            </div>

                            <button type='button'
                                className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90"
                                onClick={() => acceptRequest(req)}
                            >
                                Accept
                            </button>
                        </div>
                    ))

                )}

            </div>
        </div>
    )
}

export default ResponseWindow