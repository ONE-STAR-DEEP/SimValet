import SplashWrapper from "@/components/SplashScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SimValetPark Valet",
  manifest: "/valet.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#101828" },
    { media: "(prefers-color-scheme: dark)", color: "#101828" }
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <SplashWrapper>
      {children}
    </SplashWrapper>
  </>;
}