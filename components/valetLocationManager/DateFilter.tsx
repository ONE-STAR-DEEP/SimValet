"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const DateFilter = () => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const fromParam = searchParams.get("from")
    const toParam = searchParams.get("to")

    const [from, setFrom] = React.useState<Date | undefined>(
        fromParam ? new Date(fromParam) : undefined
    )

    const [to, setTo] = React.useState<Date | undefined>(
        toParam ? new Date(toParam) : undefined
    )

    const handleClear = () => {
        setFrom(undefined)
        setTo(undefined)

        const params = new URLSearchParams(searchParams.toString())
        params.delete("from")
        params.delete("to")

        router.push(`?${params.toString()}`, { scroll: false })
    }

    //  Debounce URL update
    React.useEffect(() => {
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())

            params.set("page", "1")

            if (from) {
                params.set("from", format(from, "yyyy-MM-dd"))
            } else {
                params.delete("from")
            }

            if (to) {
                params.set("to", format(to, "yyyy-MM-dd"))
            } else {
                params.delete("to")
            }

            router.push(`?${params.toString()}`, { scroll: false })
        }, 400)

        return () => clearTimeout(timer)
    }, [from, to])

    return (
        <div className="flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-end">

            {/* Date Filters */}
            <div className="flex flex-wrap items-center gap-2 justify-end w-full lg:w-auto">

                {/* FROM */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-auto min-w-28 sm:w-40 justify-start text-left font-normal",
                                !from && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {from ? format(from, "dd MMM yyyy") : "From"}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={from}
                            onSelect={setFrom}
                            captionLayout="dropdown"
                            fromYear={2020}
                            toYear={2040}
                        />
                    </PopoverContent>
                </Popover>

                <span className="text-muted-foreground text-sm hidden sm:block">to</span>

                {/* TO */}
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-auto min-w-28 sm:w-40 justify-start text-left font-normal",
                                !to && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {to ? format(to, "dd MMM yyyy") : "To"}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={to}
                            onSelect={setTo}
                            captionLayout="dropdown"
                            fromYear={2020}
                            toYear={2040}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            {/* Clear Button */}
            <Button
                type="button"
                onClick={handleClear}
                className="w-auto sm:w-28 bg-gray-200 flex gap-2 items-center justify-center py-2 px-4 rounded-2xl text-sm text-muted-foreground"
            >
                Clear
            </Button>

        </div>
    )
}

export default DateFilter