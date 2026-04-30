import Link from 'next/link'
import { ArrowRight, Shield, Users, BarChart3, Lock, User } from 'lucide-react'
import Image from 'next/image'
import { Montserrat } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 md:px-6">
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

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/company"
              className="hidden text-sm font-medium text-foreground transition-colors hover:text-primary sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="https://www.thavertech.com/contact"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
              Smart Parking · Zero Waiting
            </div>

            {/* Main Heading */}
            <h1 className="mb-6 max-w-3xl text-3xl font-bold leading-tight text-foreground md:text-4xl lg:text-5xl">
              The Operating System for Modern Valet Parking
            </h1>

            {/* Subheading */}
            <p className="mb-12 max-w-2xl text-md text-muted-foreground md:text-lg">
              Control multiple locations, enable real-time valet workflows, and deliver a zero-wait experience to every customer.</p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/company"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                Company Sign In
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/valet-boy"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary bg-transparent px-8 py-3 font-semibold text-primary transition-colors hover:bg-secondary"
              >
                Valet Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid gap-4 sm:gap-8">
              <p className="text-sm font-medium text-muted-foreground">Trusted by enterprise teams</p>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">Multi-Location Management</div>
                  {/* <div className="text-sm text-muted-foreground">Active Users</div> */}
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">Real-Time Vehicle Tracking</div>
                  {/* <div className="text-sm text-muted-foreground">Uptime</div> */}
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">Zero Waiting Experience</div>
                  {/* <div className="text-sm text-muted-foreground">Locations</div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Indtoduction section*/}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32">

          <div className="mb-16 text-center">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl">
              What is SimValet and why does it exist?
            </h2>

            <p className="mx-auto max-w-3xl text-lg text-muted-foreground leading-relaxed">
              SimValet is a modern, fully digital valet parking system designed to eliminate waiting time and streamline operations across high-traffic locations.
            </p>
          </div>

          {/* Content Blocks */}
          <div className="mx-auto grid max-w-5xl gap-6 text-muted-foreground md:grid-cols-2">

            {/* Problem */}
            <div className='rounded-lg bg-secondary p-8'>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                The Problem
              </h3>
              <p className="leading-relaxed">
                Traditional valet systems rely on paper tickets and manual coordination,
                leading to delays, lost tickets, vehicle confusion, and a poor customer experience
                at exit points.
              </p>
            </div>

            {/* Solution */}
            <div className='rounded-lg bg-secondary p-8'>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                The Solution
              </h3>
              <p className="leading-relaxed">
                SimValet replaces outdated processes with a real-time, connected platform
                that ensures faster, smoother, and more reliable vehicle handling.
              </p>
            </div>

            {/* System */}
            <div className='rounded-lg bg-secondary p-8'>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                One Connected System
              </h3>
              <p className="leading-relaxed">
                The platform brings together companies, valet operators, and customers into one seamless workflow—enabling efficient management, real-time coordination, and instant vehicle access.
              </p>
            </div>

            {/* Features */}
            <div className='rounded-lg bg-secondary p-8'>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Smart & Real-Time
              </h3>
              <p className="leading-relaxed">
                Powered by Automatic Number plate recognization (ANPR), QR-based requests, and instant notifications, SimValet delivers a zero-wait, transparent, and premium valet experience.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* Features Section */}
      <section className="bg-primary border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-white text-3xl font-bold md:text-4xl">
              Purpose-Built for Valet Operations
            </h2>
            <p className=" text-white text-lg">
              Everything your team needs to manage vehicles and operations efficiently
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <div className="rounded-lg border border-border bg-card p-6">
              <Shield className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold text-foreground">Role-Based Access</h3>
              <p className="text-sm text-muted-foreground">
                System admin, company admin, location manager, and valet roles with tailored permissions
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-lg border border-border bg-card p-6">
              <Users className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold text-foreground">Team Management</h3>
              <p className="text-sm text-muted-foreground">
                Manage multiple locations and coordinate teams across your entire organization
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-lg border border-border bg-card p-6">
              <BarChart3 className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold text-foreground">Real-Time Insights</h3>
              <p className="text-sm text-muted-foreground">
                Track vehicles, monitor operations, and get actionable insights instantly
              </p>
            </div>

            {/* Feature 4 */}
            <div className="rounded-lg border border-border bg-card p-6">
              <User className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold text-foreground">Customer Experience</h3>
              <p className="text-sm text-muted-foreground">
                Provide real-time vehicle tracking and instant request access for customers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role Tiers Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Hierarchical Access Control
            </h2>
            <p className="text-lg text-muted-foreground">
              Four role levels designed for your organizational structure
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">

            {/* Company Admin */}
            <div className="rounded-lg bg-secondary p-8">
              <h3 className="mb-3 text-lg font-bold text-secondary-foreground">Company Admin</h3>
              <p className="mb-4 text-sm text-secondary-foreground/80">
                Manage company operations, locations, and staff
              </p>
              <ul className="space-y-2 text-sm text-secondary-foreground/80">
                <li>✓ Manage locations</li>
                <li>✓ Staff administration</li>
                <li>✓ Company analytics</li>
              </ul>
            </div>

            {/* Location Manager */}
            <div className="rounded-lg bg-secondary p-8">
              <h3 className="mb-3 text-lg font-bold text-secondary-foreground">Location Manager</h3>
              <p className="mb-4 text-sm text-secondary-foreground/80">
                Oversee daily operations at a specific location
              </p>
              <ul className="space-y-2 text-sm text-secondary-foreground/80">
                <li>✓ View location data</li>
                <li>✓ Manage local team</li>
                <li>✓ Track vehicles</li>
              </ul>
            </div>

            {/* Valet */}
            <div className="rounded-lg bg-secondary p-8">
              <h3 className="mb-3 text-lg font-bold text-secondary-foreground">Valet</h3>
              <p className="mb-4 text-sm text-secondary-foreground/80">
                Register and manage vehicle information
              </p>
              <ul className="space-y-2 text-sm text-secondary-foreground/80">
                <li>✓ Register Entry</li>
                <li>✓ Verified Exit</li>
                <li>✓ View own Insights</li>
              </ul>
            </div>

            {/* System Admin */}
            <div className="rounded-lg bg-secondary p-8">
              <h3 className="mb-3 text-lg font-bold text-secondary-foreground">Customer</h3>

              <p className="mb-4 text-sm text-secondary-foreground/80">
                Request and track vehicles in real time
              </p>

              <ul className="space-y-2 text-sm text-secondary-foreground/80">
                <li>✓ Request Vehicle</li>
                <li>✓ Live Tracking</li>
                <li>✓ Secure Vehicle Handover</li>
              </ul>
            </div>


          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32">

          {/* Heading */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              From the customer’s point of view
            </p>
          </div>

          {/* Steps */}
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">

            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold text-foreground">01. Arrive & Handover</h3>
              <p className="text-sm text-muted-foreground">
                Customer arrives and hands over the vehicle to the valet
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold text-foreground">02. Digital Entry</h3>
              <p className="text-sm text-muted-foreground">
                Valet scans number plate and creates a digital record
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold text-foreground">03. Get QR Ticket</h3>
              <p className="text-sm text-muted-foreground">
                Customer receives a QR-based digital ticket instantly
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold text-foreground">04. Request Vehicle</h3>
              <p className="text-sm text-muted-foreground">
                Scan QR and request the car through a web page — no app needed
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold text-foreground">05. Valet Responds</h3>
              <p className="text-sm text-muted-foreground">
                Valet receives the request instantly and brings the vehicle
              </p>
            </div>

            <div className="rounded-lg border p-6">
              <h3 className="mb-2 font-semibold text-foreground">06. Zero Wait Exit</h3>
              <p className="text-sm text-muted-foreground">
                Car is ready at the exit by the time customer arrives
              </p>
            </div>

          </div>

          {/* Bottom Line */}
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-foreground">
              No waiting. Just a seamless valet experience.
            </p>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center md:px-6 md:py-32">
          <h2 className="mb-6 text-3xl font-bold text-primary-foreground md:text-4xl">
            Ready to Transform Your Operations?
          </h2>
          <p className="mb-12 text-lg text-primary-foreground/90">
            Join teams already managing vehicles smarter and faster
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href="https://www.thavertech.com/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-8 py-3 font-semibold text-primary transition-all hover:shadow-lg hover:shadow-black/20"
            >
              Contact Us
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/company"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary-foreground/30 bg-transparent px-8 py-3 font-semibold text-primary-foreground transition-all hover:border-primary-foreground/60"
            >
              Sign In to Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">


          <div className="grid gap-8 md:grid-cols-3 items-center text-center">

            {/* Logo */}
            <div className="flex items-center justify-center">
              <Image
                src="/assets/images/logo3.png"
                alt="logo"
                height={70}
                width={70}
              />
              <p className={`${montserrat.className} font-bold text-2xl`}>
                Sim<span className='text-primary'>Valet</span>
              </p>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-2 text-lg">
              <p className="text-muted-foreground">A product by&nbsp; 
                <Link
                  href="https://www.thavertech.com/"
                  target="_blank"
                  className="font-semibold text-primary hover:underline"
                >
                   Thaver Tech
                </Link>
              </p>
            </div>

            <p>&copy; {new Date().getFullYear()} SimValet. All rights reserved.</p>

          </div>


        </div>
      </footer>
    </div>
  )
}
