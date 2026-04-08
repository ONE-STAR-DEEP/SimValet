"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ActionButtons = () => {

    const router = useRouter()

    return (
        <div className="flex gap-2 w-full items-center justify-center print:hidden">
            <Button
                className="w-[45%]
                            transition-all duration-200
                            shadow-md
                            active:shadow-lg
                            active:scale-95
                            active:brightness-75
            "
                onClick={() => { router.push("/valet-boy/dashboard/") }}>Home</Button>
            {/* <Button
                className="w-[45%]
                            transition-all duration-200
                            shadow-md
                            active:shadow-lg
                            active:scale-95
                            active:brightness-75
                            "
                onClick={() => window.print()}
            >Print Ticket</Button> */}
        </div>
    )
}

export default ActionButtons