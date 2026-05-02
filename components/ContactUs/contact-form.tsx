"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle } from "lucide-react"
import { submitContactForm } from "@/lib/actions/contactUs"
import { ContactFormData } from "@/lib/types/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [formStart] = useState(Date.now());

  const [data, setData] = useState<ContactFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    website: "",
    idea: "",
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isLoading) return;
    setIsLoading(true)

    try {
      const timeTaken = Date.now() - formStart;
      const tooFast = timeTaken < 1500;

      if (data.website.length > 0 || data.idea.length > 0 || tooFast) return
      const res = await submitContactForm(data, formStart);

      if (!res.success) { return }
      setData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        website: "",
        idea: "", 
      })
      setOpen(true)
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <div className=" bg-card p-6 lg:p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground lg:text-3xl">
          Send us a Message
        </h2>
        <p className="mt-2 text-muted-foreground">
          Fill out the form below and we&apos;ll respond as soon as possible.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  firstName: e.target.value
                }))
              }}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  lastName: e.target.value
                }))
              }}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                email: e.target.value
              }))
            }}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                phone: e.target.value
              }))
            }}
            placeholder="+91-XXXXX-XXXXX"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            name="subject"
            placeholder="How can we help you?"
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                subject: e.target.value
              }))
            }}
            required
          />
        </div>

        <div className="absolute left-[-9999px]">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                website: e.target.value
              }))
            }}
          />
        </div>

        <div className="absolute left-[-9999px]">
          <input
            type="text"
            name="idea"
            tabIndex={-1}
            autoComplete="off"
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                idea: e.target.value
              }))
            }}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us more about your inquiry..."
            rows={5}
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                message: e.target.value
              }))
            }}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            "Sending..."
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription>

            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center bg-card p-8 text-center lg:p-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="mt-6 text-xl font-semibold text-foreground">
              Thank you for reaching out!
            </h3>
            <p className="mt-2 text-muted-foreground">
              {"We've received your message and will get back to you shortly."}
            </p>
            <Button
              onClick={() => setOpen(false)}
              variant="outline"
              className="mt-6"
            >
              Send another message
            </Button>
          </div>

        </DialogContent>

      </Dialog>

    </div>
  )
}
