import Image from "next/image";
export const dynamic = "force-dynamic";

export default async function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex flex-col min-h-screen">

            {/* Top Navbar */}
            <nav className="sticky top-0 z-50 bg-gray-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-start">
                    <div className="flex items-center">
                        <Image
                            src="/assets/images/logo.png"
                            alt="logo"
                            width={40}
                            height={40}
                        />
                        <h1 className="text-lg font-semibold tracking-wide">
                            Customer Panel
                        </h1>
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
                    © {new Date().getFullYear()} SimValetPark
                </small>
            </footer>


        </div>
    );
}