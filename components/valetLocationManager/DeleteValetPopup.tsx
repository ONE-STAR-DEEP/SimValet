"use client";

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { deleteValetById } from "@/lib/actions/locationManager";
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation";
import { useState } from "react"

export function DeleteValetPopup({ valetId, name }: { valetId: number; name: string }) {

    const [input, setInput] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false)
    const router = useRouter()

    const isValid = input.trim().toLowerCase() === name.trim().toLowerCase();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (loading) return;
        setLoading(true);

        if (!isValid) {
            setMsg(`Type "${name}" to confirm`);
            setLoading(false);
            return;
        }

        const res = await deleteValetById(valetId);

        if (!res.success) {
            alert(res.message)
            setLoading(false)
            return
        }

        router.refresh();
        setOpen(false)
        setInput("");
        setMsg("")
        setLoading(false);
    }

    return (
        <Dialog open={open}
            onOpenChange={(val) => {
                setOpen(val);
                if (!val) {
                    setInput("");
                    setMsg("");
                    setLoading(false);
                }
            }}>
            <DialogTrigger asChild>
                <Trash className="text-primary hover:cursor-pointer" size={20} />
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Remove Valet</DialogTitle>
                        <DialogDescription>
                            This action will permanently remove valet{" "}
                            <span className="text-primary">{name}</span>
                        </DialogDescription>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Type Valet Name</Label>
                            <Input
                                id="name-1"
                                value={input}
                                onChange={(e) => {
                                    setInput(e.target.value);
                                    setMsg("");
                                }}
                                placeholder={name}
                                required
                            />
                        </Field>

                        {msg && (
                            <Field className="text-primary">
                                {msg}
                            </Field>
                        )}
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" type="button">
                                Cancel
                            </Button>
                        </DialogClose>

                        <Button type="submit" disabled={loading || !isValid}>
                            {loading ? "Deleting..." : "Confirm"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}