import Image from "next/image";
import Link from "next/link";
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
});

export function ContactHeader() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/70">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-6">
                <Link href="/">
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

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link
                        href="/company"
                        className="hidden text-sm font-medium text-foreground transition-colors hover:text-primary sm:inline-block"
                    >
                        Sign In
                    </Link>
                    {/* <Link
                        href="/contact-us"
                        className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
                    >
                        Contact Us
                        <ArrowRight className="h-4 w-4" />
                    </Link> */}
                </div>
            </nav>
        </header>
    )
}
