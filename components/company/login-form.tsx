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
import Image from "next/image"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "../ui/label"
import { matchCompanyOTP, sendCompanyOtp } from "@/lib/actions/company"
import { matchManagerOTP, sendManagerOtp } from "@/lib/actions/locationManager"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [showInput, setShowInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [param, setParam] = useState("");
    const [msg, setMsg] = useState("");
    const [success, setSuccess] = useState("");
    const [loginType, setLoginType] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const isEmail = /\S+@\S+\.\S+/.test(identifier);

            const payload = {
                email: isEmail ? identifier : undefined,
                mobile: !isEmail ? identifier : undefined,
            };

            let res;
            if (loginType === "Company") {
                res = await sendCompanyOtp({ ...payload });
            }
            else if (loginType === "locationManager") {
                res = await sendManagerOtp({ ...payload });
                console.log(res)
            }
            else {
                setMsg("Select Login Type")
            }

            if (res?.success) {
                setShowInput(true);
                setParam(res.identifier);
                setSuccess(res.message)
                setMsg("");
            } else {
                setMsg(res?.message!)
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (showInput) {
            handleOTPSubmit(e);
        } else {
            handleSubmit(e);
        }
    };

    const handleOTPSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let res;
            if (loginType === "Company") {
                res = await matchCompanyOTP(param, otp);
            }
            else if (loginType === "locationManager") {
                res = await matchManagerOTP(param, otp);
            }
            else {
                setMsg("Select Login Type")
            }

            if (!res?.success) {
                setMsg(res?.message!)
                setSuccess("");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleFormSubmit}>
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
                            <span className="sr-only">SimValet</span>
                        </a>
                        <h1 className="text-xl font-bold">Welcome to SimValet</h1>
                        <FieldDescription>
                            Login to access the System Control Dashboard
                        </FieldDescription>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="email">Email/Mobile</FieldLabel>
                        <Input
                            id="identifier"
                            type="text"
                            placeholder="m@example.com"
                            value={identifier}
                            required
                            onChange={(e) => { setIdentifier(e.target.value) }}
                        />
                    </Field>

                    <Field>
                        <Label>Login Type</Label>
                        <Select value={loginType} onValueChange={(value) => setLoginType(value)}>
                            <SelectTrigger className="w-45">
                                <SelectValue placeholder="Select login type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Login Type</SelectLabel>
                                    <SelectItem value="Company">Company</SelectItem>
                                    <SelectItem value="locationManager">
                                        Location Manager
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>

                    {showInput &&
                        <Field>
                            <FieldLabel htmlFor="email">OTP</FieldLabel>
                            <Input
                                id="otp"
                                type="password"
                                placeholder="******"
                                value={otp}
                                required
                                maxLength={6}
                                onChange={(e) => { setOtp(e.target.value) }}
                            />
                        </Field>
                    }
                    {msg && <p className="text-danger fw-semibold">{msg}</p>}
                    {success && <p className="text-success fw-semibold">{success}</p>}
                    {
                        showInput ?

                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Logging in..." : "Submit OTP"}
                                </Button>
                            </Field>
                            :
                            <Field>
                                <Button type="submit" disabled={loading}>
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </Button>
                            </Field>
                    }

                </FieldGroup>
            </form>
            <FieldDescription className="px-6 text-center">
                Designed for Company Admins.
            </FieldDescription>
        </div>
    )
}
