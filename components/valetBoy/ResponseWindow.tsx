"use client";

import { assignValet, getPendingRequests } from '@/lib/actions/valetBoy';
import socket from '@/lib/socket/socket';
import { Request } from '@/lib/types/types';
import { Clock, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from "react";

type ResponseWindowProps = {
    companyId: number;
    response: Request | null;
    setMode: React.Dispatch<React.SetStateAction<"entry" | "exit">>;
    setResponse: React.Dispatch<React.SetStateAction<Request | null>>;
};

const ResponseWindow = ({ companyId, response, setMode, setResponse }: ResponseWindowProps) => {

    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(false)

    const setupSocket = () => {
        if (!companyId) return;

        const fetchRequests = async () => {

            try {
                setLoading(true)
                const requestData = await getPendingRequests();
                console.log("Fetched requests:", requestData);
                if (requestData.success) {
                    setRequests(requestData.data);
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        };

        const joinRoom = () => {
            console.log("Joining company:", companyId);
            socket.emit("join-company", companyId);
        };

        // Prevent duplicate listeners
        socket.off("connect");
        socket.off("car-request");

        // Join + listeners
        joinRoom();
        socket.on("connect", joinRoom);
        socket.on("car-request", fetchRequests);

        // Initial fetch
        fetchRequests();
    };

    useEffect(() => {
        setupSocket();

        return () => {
            socket.off("connect");
            socket.off("car-request");
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
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="rounded-xl border-2 border-black/20">

            <div className="p-4 flex items-center justify-between gap-2 border-b">
                <div className='flex items-center gap-2'>
                    <Clock size={20} />
                    <h3 className="font-semibold">Customer Requests</h3>
                </div>
                <RefreshCcw
                    onClick={!loading ? setupSocket : undefined}
                    className={`text-primary cursor-pointer ${loading ? "animate-spin" : ""}`}
                    size={20} />
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
                                disabled={!!response}
                                className="bg-primary text-white px-3 py-1 rounded-md text-sm 
                                        hover:bg-primary/90 
                                        disabled:opacity-50 disabled:cursor-not-allowed"
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