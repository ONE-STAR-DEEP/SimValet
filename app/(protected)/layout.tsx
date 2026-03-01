import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
// import Sidebar from "@/components/Sidebar";
// import Header from "@/components/Header";

export default function InternalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {/* <Sidebar /> */}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* <Header /> */}

        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}