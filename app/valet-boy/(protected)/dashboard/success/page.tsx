import Image from "next/image";
import { Montserrat } from 'next/font/google'
import QRComponent from "@/components/valetBoyScreen-2/QR";
import ActionButtons from "@/components/valetBoyScreen-2/ActionButtons";
import { Check } from "lucide-react";


const montserrat = Montserrat({
    subsets: ["latin"],
    display: "swap",
});

type Props = {
    searchParams: Promise<{
        token?: string;
    }>;
};


const SuccessPage = async ({ searchParams }: Props) => {
    const { token } = await searchParams;

    return (
        <div className={`h-full`}>
            <div className="h-full bg-white border-2 border-gray-300 rounded-lg py-10 px-4">

                <div className="print-area h-full">

                    <div className='h-full flex flex-col justify-evenly items-center text-center'>
                        <div className="flex flex-col items-center space-y-2">
                            <p className="font-bold text-green-600 text-2xl flex items-center"><Check size={30} className="bg-green-100 mr-2 border border-green-500 rounded-lg" /> SUCCESS</p>
                            <h3 className="font-semibold print:hidden print:h-0">Vehicle Entry Recipt</h3>
                        </div>

                        <div className="border-2 border-black px-2 py-4 w-full space-y-2">
                            <header className={`${montserrat.className} flex items-center justify-center`}>
                                <Image
                                    src="/assets/images/logo3.png"
                                    alt="logo"
                                    height={60}
                                    width={60}
                                />
                                <div className="flex flex-col items-center">
                                    <p className="font-bold text-3xl">
                                        SimValet<span className='text-primary'>Park</span>
                                    </p>
                                    <div className="flex items-center justify-center">
                                        <div className="left-taper-line" />
                                        <span className="px-1 text-xs font-semibold">Smart Parking. Zero Waiting.</span>
                                        <div className="right-taper-line" />
                                    </div>
                                </div>
                            </header>

                            <section className="flex flex-col items-center">
                                <h3 className="font-bold text-lg">Welcome to SimValetPark</h3>
                                <p className="text-xs">Smart and Secure Parking</p>
                            </section>

                            <section className="flex flex-col items-center">
                                <div className="border-b border-dashed border-gray-400 w-[60%]"></div>
                                {/* <QRComponent /> */}
                                <p className="text-xs text-nowrap tracking-tighter">Scan for a Seamless Car Retrieval Experience</p>
                                <div className="border-b border-dashed border-gray-400 w-[60%] my-2"></div>
                                <p className={`${montserrat.className} text-xs`}>TOKEN</p>
                                <p className="font-bold text-2xl">{`SVPT${token}`}</p>
                                <p className="">Thank you for Parking with Us</p>
                                <div className="flex items-center justify-center">
                                    <div className="left-taper-line scale-150" />
                                    <p className={`${montserrat.className} text-xs px-2`}>A Product of The Thaver Tech</p>
                                    <div className="right-taper-line scale-150" />
                                </div>
                            </section>
                        </div>

                        <ActionButtons />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SuccessPage