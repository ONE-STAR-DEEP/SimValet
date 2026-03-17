"use client";

import { assignValet, getPendingRequests } from '@/lib/actions/valetBoy';
import socket from '@/lib/socket/socket';
import { Request } from '@/lib/types/types';
import { Clock } from 'lucide-react';
import { useEffect, useState } from "react";

type ResponseWindowProps = {
    setMode: React.Dispatch<React.SetStateAction<"entry" | "exit">>;
    setResponse: React.Dispatch<React.SetStateAction<Request | null>>;
};

const ResponseWindow = ({ setMode, setResponse }: ResponseWindowProps) => {

    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        const fetchRequests = async () => {

            const requestData = await getPendingRequests();
            if (requestData.success) {
                setRequests(requestData.data);
            }
        }
        fetchRequests();

        socket.on("car-request", (data: {
            success: boolean
        }) => {
            if (data.success) {
                fetchRequests();
            }
        });

        return () => {
            socket.off("car-request");
        };
    }, []);

    const acceptRequest = async (req: Request) => {
        setLoading(true)
        try {
            const res = await assignValet(req.id, req.vehicle_number)
            if (res.success) {
                setMode("exit")
                setResponse(req)
                socket.emit("car-request", { success: true });
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
                                        hour12: false
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