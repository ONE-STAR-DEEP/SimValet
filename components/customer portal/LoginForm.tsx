"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { FormEvent, useState } from "react"
import { matchOTP, sendOtp } from "@/lib/actions/valetBoy"
import Image from "next/image"
import { customerLogin } from "@/lib/actions/customer"
import { useRouter } from "next/navigation"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const [loading, setLoading] = useState(false);
    const [vehicle, setVehicle] = useState("");
    const [token, setToken] = useState("");
    const [msg, setMsg] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {

            const res = await customerLogin(vehicle, token);

            if (!res?.success) {
                setMsg(res?.message!)
                return;
            }
            router.push(`/customer-portal/${res.id}/myVehicle`)
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleSubmit}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <a
                            href="#"
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <Image
                                src="/assets/images/logo3.png"
                                height={150}
                                width={150}
                                alt="Logo"
                            />
                            <span className="sr-only">SimValetPark</span>
                        </a>
                        <h1 className="text-xl font-bold">Welcome to SimValetPark</h1>
                        <FieldDescription>
                            Login to access your vehicle details
                        </FieldDescription>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="vehicleNumber">Vehicle Number</FieldLabel>
                        <Input
                            id="vehicleNumber"
                            type="text"
                            placeholder="SS00AA0000"
                            value={vehicle}
                            required
                            onChange={(e) => { setVehicle(e.target.value.toUpperCase()) }}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="tokenNumber">Token Number</FieldLabel>

                        <div className="flex items-center border rounded-md bg-white">

                            <span className="px-3 text-sm text-muted-foreground border-r">
                                SVPT
                            </span>

                            <Input
                                className="border-0 focus-visible:ring-0"
                                id="tokenNumber"
                                type="text"
                                inputMode="numeric"
                                placeholder="number"
                                value={token}
                                required
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setToken(value);
                                }}
                            />

                        </div>
                    </Field>

                    {msg && <p className="text-danger fw-semibold">{msg}</p>}

                    <Field>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Loading Details..." : "Submit"}
                        </Button>
                    </Field>

                </FieldGroup>
            </form>
            <FieldDescription className="px-6 text-center">
                Customer Portal
            </FieldDescription>
        </div>
    )
}
