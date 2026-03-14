import { Clock } from 'lucide-react'
import React from 'react'

const ResponseWindow = () => {

    const requests = [
        {
            id: 1,
            car_number: "MH12AB1234",
            customer_name: "Rahul",
            time: "10 sec ago"
        },
        {
            id: 2,
            car_number: "MH14XY4567",
            customer_name: "Amit",
            time: "30 sec ago"
        }
    ]

    return (

            <div className="rounded-xl border-2 border-black/20">

                {/* Header */}
                <div className="p-4 flex gap-2 items-center border-b">
                    <Clock size={20} />
                    <h3 className="font-semibold">Customer Requests</h3>
                </div>

                {/* Requests */}
                <div className="flex flex-col">

                    {requests?.map((req) => (
                        <div
                            key={req.id}
                            className="p-4 flex items-center justify-between border-b hover:bg-muted/40 transition"
                        >
                            <div className="flex flex-col">
                                <span className="font-semibold text-primary">
                                    {req.car_number}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    Customer: {req.customer_name}
                                </span>

                                <span className="text-xs text-muted-foreground">
                                    Requested {req.time}
                                </span>
                            </div>

                            <button className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90">
                                Accept
                            </button>
                        </div>
                    ))}
                </div>
            </div>
    )
}

export default ResponseWindow