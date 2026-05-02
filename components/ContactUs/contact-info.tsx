import { MapPin, Phone, Smartphone, Mail, Globe } from "lucide-react"

const contactDetails = [
  {
    icon: MapPin,
    label: "Address",
    value: "BH12A09, Business Hub, Sector - 81\nFaridabad - 121007 (Delhi NCR), India",
    href: "https://maps.google.com/?q=BH12A09,+Business+Hub,+Sector+81,+Faridabad,+121007,+India",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91-129-409 6069",
    href: "tel:+911294096069",
  },
  {
    icon: Mail,
    label: "Email",
    value: "park@simvalet.com",
    href: "mailto:park@simvalet.com",
  },
  {
    icon: Globe,
    label: "Website",
    value: "www.simvalet.com",
    href: "https://www.simvalet.com",
  },
]

export function ContactInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground lg:text-3xl">
          Contact Information
        </h2>
        <p className="mt-2 text-muted-foreground">
          {"We'd love to hear from you. Reach out to us through any of the following channels."}
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        {contactDetails.map((detail) => (
          <a
            key={detail.label}
            href={detail.href}
            target={detail.label === "Website" ? "_blank" : undefined}
            rel={detail.label === "Website" ? "noopener noreferrer" : undefined}
            className="flex flex-col items-center gap-4 rounded-lg  bg-card p-4 transition-colors hover:bg-accent group"
          >
            <div className="flex h-15 w-15 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <detail.icon className="h-8 w-8" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-muted-foreground">
                {detail.label}
              </p>
              <p className="mt-1 whitespace-pre-line text-foreground">
                {detail.value}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
