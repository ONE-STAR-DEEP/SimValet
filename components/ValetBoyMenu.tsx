"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { clearSessionCookie } from "@/lib/logout"
import { Menu } from "lucide-react"
import Link from "next/link"

const ValetBoyMenu = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8">
                    <Menu className="scale-125" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Dashboards</DropdownMenuLabel>
                    <Link href="/valet-boy/dashboard">
                        <DropdownMenuItem>
                            Dashboard 1
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/valet-boy-2/dashboard">
                        <DropdownMenuItem>
                            Dashboard 2
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={clearSessionCookie}>
                        Log out
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default ValetBoyMenu