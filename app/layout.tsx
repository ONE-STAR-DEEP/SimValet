import type { Metadata } from "next";
import { JetBrains_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";
import StandaloneDetector from "@/components/StandaloneDectator";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SimValet",
    template: "%s | SimValet",
  },

  description:
    "SimValet is a smart valet parking management system that allows customers to request their vehicles instantly while valets receive real-time notifications.",

  keywords: [
    "SimValet",
    "valet parking",
    "smart parking system",
    "valet management",
    "car parking app",
    "parking automation",
  ],

  applicationName: "SimValet",

  authors: [
    {
      name: "SimValet",
    },
  ],

  creator: "SimValet",

  openGraph: {
    title: "SimValet",
    description:
      "Smart valet parking system for seamless vehicle requests and valet coordination.",
    url: "https://your-domain.com",
    siteName: "SimValet",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/assets/images/favicon.png",
    shortcut: "/assets/images/favicon.png",
    apple: "/assets/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" className={jetbrainsMono.className}>
      <body className="antialiased">
        <RegisterSW />
        <StandaloneDetector />
        {children}
      </body>
    </html>
  );
}