import SplashWrapper from "@/components/SplashScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  manifest: "/valet.webmanifest",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>
    <SplashWrapper>
      {children}
    </SplashWrapper>
  </>;
}