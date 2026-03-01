import Link from 'next/link'
import { ArrowRight, Shield, Users, BarChart3, Lock } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
          <div className="text-2xl font-bold text-primary">VManager</div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/signin"
              className="hidden text-sm font-medium text-foreground transition-colors hover:text-primary sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Get Started
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
              <Lock className="h-3 w-3" />
              Enterprise-grade security
            </div>

            {/* Main Heading */}
            <h1 className="mb-6 max-w-3xl text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Intelligent Valet Management at Scale
            </h1>

            {/* Subheading */}
            <p className="mb-12 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Streamline vehicle registration, manage multiple locations, and coordinate your valet teams with role-based access control designed for enterprise operations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 font-semibold text-primary-foreground transition-all hover:shadow-lg hover:shadow-primary/30"
              >
                Sign In as admin
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/signin"
                className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-primary bg-transparent px-8 py-3 font-semibold text-primary transition-colors hover:bg-secondary"
              >
                Sign In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid gap-4 sm:gap-8">
              <p className="text-sm font-medium text-muted-foreground">Trusted by enterprise teams</p>
              <div className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">1000+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Locations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-32">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Purpose-Built for Valet Operations
            </h2>
            <p className="text-lg text-muted-foreground">
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
              <Lock className="mb-4 h-8 w-8 text-primary" />
              <h3 className="mb-2 font-semibold text-foreground">Enterprise Security</h3>
              <p className="text-sm text-muted-foreground">
                Bank-level encryption and compliance standards for your sensitive data
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
            {/* System Admin */}
            <div className="rounded-lg bg-secondary p-8">
              <h3 className="mb-3 text-lg font-bold text-secondary-foreground">System Admin</h3>
              <p className="mb-4 text-sm text-secondary-foreground/80">
                Full platform control, user management, and system configuration
              </p>
              <ul className="space-y-2 text-sm text-secondary-foreground/80">
                <li>✓ Manage all organizations</li>
                <li>✓ System-wide analytics</li>
                <li>✓ User permissions</li>
              </ul>
            </div>

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
                <li>✓ Register vehicles</li>
                <li>✓ Update details</li>
                <li>✓ View own records</li>
              </ul>
            </div>
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
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-8 py-3 font-semibold text-primary transition-all hover:shadow-lg hover:shadow-black/20"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/signin"
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
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 text-lg font-bold text-primary">VManager</div>
              <p className="text-sm text-muted-foreground">
                Enterprise valet management platform
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Features</Link></li>
                <li><Link href="#" className="hover:text-primary">Pricing</Link></li>
                <li><Link href="#" className="hover:text-primary">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">About</Link></li>
                <li><Link href="#" className="hover:text-primary">Blog</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Privacy</Link></li>
                <li><Link href="#" className="hover:text-primary">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 VManager. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
