import LogoutButton from "@/components/logout-button";
import { getSessionUser } from "@/lib/checkSession";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getSessionUser();
  if (Number(session?.company_id) !== 0) {
    redirect(`/system-admin`);
  }

  return (
    <div className="flex flex-col min-h-screen">

      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-wide">
            Super Admin Panel
          </h1>

          <div className="bg-white text-black px-3 py-1 rounded-md shadow-sm">
            <LogoutButton />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="grow bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-4">
        <small className="text-sm">
          © {new Date().getFullYear()} SimValetPark | System Admin
        </small>
      </footer>

    </div>
  );
}