import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import RegisterSW from "@/components/RegisterSW";
import StandaloneDetector from "@/components/StandaloneDectator";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",

  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#101828" },
    { media: "(prefers-color-scheme: dark)", color: "#101828" }
  ],
};

export const metadata: Metadata = {
  title: {
    default: "SimValetPark",
    template: "%s | SimValetPark",
  },

  description:
    "SimValetPark is a smart valet parking management system that allows customers to request their vehicles instantly while valets receive real-time notifications.",

  keywords: [
    "SimValetPark",
    "valet parking",
    "smart parking system",
    "valet management",
    "car parking app",
    "parking automation",
  ],

  applicationName: "SimValetPark",

  authors: [
    {
      name: "SimValetPark",
    },
  ],

  creator: "SimValetPark",

  openGraph: {
    title: "SimValetPark",
    description:
      "Smart valet parking system for seamless vehicle requests and valet coordination.",
    url: "https://your-domain.com",
    siteName: "SimValetPark",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: "/assets/images/logo.png",
    shortcut: "/assets/images/logo.png",
    apple: "/assets/images/logo.png",
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