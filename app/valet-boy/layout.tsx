import SplashWrapper from "@/components/SplashScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/valet.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <SplashWrapper>
      {children}
    </SplashWrapper>
  </>;
}