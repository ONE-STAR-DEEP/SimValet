import { ContactHeader } from "@/components/ContactUs/contact-header"
import { ContactInfo } from "@/components/ContactUs/contact-info"
import { ContactForm } from "@/components/ContactUs/contact-form"
import { ContactMap } from "@/components/ContactUs/contact-map"
import Image from "next/image"
import { Montserrat } from 'next/font/google'
import Link from "next/link"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export default function ContactPage() {
  return (
    <main className="min-h-screen relative">

      {/* Top 50% background */}
      <div className="fixed top-0 left-0 w-full h-[50vh] bg-primary -z-10 "></div>

      <ContactHeader />

      <div className="container flex flex-col space-y-20 items-center bg-white mt-20 mx-auto px-4 lg:px-20 py-12 lg:py-16">

        <ContactInfo />

        <div className="grid lg:grid-cols-2 ">
          <ContactForm />
          <ContactMap />
        </div>
        {/* <div className="space-y-8">
          <Image
            src="/assets/images/business-hub.jpeg"
            alt="logo"
            height={600}
            width={600}
          />
        </div> */}
      </div>
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 items-center text-center">

            {/* Logo */}
            <Link href="/" className="scale-75 md:scale-100">
              <div className="flex items-center">
                <Image
                  src="/assets/images/logo3.png"
                  alt="logo"
                  height={60}
                  width={60}
                />
                <p className={`${montserrat.className} font-bold text-2xl`}>
                  Sim<span className='text-primary'>Valet</span>
                </p>
              </div>
            </Link>

            {/* Company */}
            <div className="flex flex-col gap-2 text-lg scale-75 md:scale-100">
              <p className="text-muted-foreground">A product by&nbsp;
                <span
                  className="font-semibold text-primary"
                >
                  SimValet Pvt. Ltd.
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2 text-lg col-span-2 md:col-span-1 scale-75 md:scale-100">
              <p>&copy; {new Date().getFullYear()} SimValet Pvt. Ltd.</p>
              <p> All rights reserved.</p>
            </div>

          </div>
        </div>
      </footer>
    </main>
  )
}
