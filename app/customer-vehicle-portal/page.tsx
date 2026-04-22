
import RequestButton from '@/components/customer portal/RequestButton';
import { customerLogin, vehicleData } from '@/lib/actions/customer';
import { Car, Clock, IndianRupee, MapPin, Phone, Ticket, User } from 'lucide-react';
import jwt from "jsonwebtoken";
import Image from 'next/image';
import { Montserrat } from 'next/font/google'
import { Button } from '@/components/ui/button';
import PayButton from '@/components/customer portal/PayButton';

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

type Payload = {
  vehicle: string;
  token: string;
};

type PageProps = {
  searchParams: Promise<{
    token: string;
  }>;
};

const Vehicle = async ({ searchParams }: PageProps) => {
  const params = await searchParams;
  const token = params.token;

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET!
  ) as Payload;

  const res = await customerLogin(decoded.vehicle, decoded.token);

  if (!res.success && res.message === "No active log") {

    return (
      <div className='w-full h-full'>
        <div className='flex flex-col h-full items-center justify-evenly py-20 text-center space-y-5'>
          <div className="flex items-center">
            <Image
              src="/assets/images/logo3.png"
              alt="logo"
              height={60}
              width={60}
            />
            <p className={`${montserrat.className} font-bold text-2xl`}>
              SimValet<span className='text-primary'>Park</span>
            </p>
          </div>
          <div className="h-50 w-50 rounded-full flex items-center justify-center border bg-linear-to-br from-teal-600 to-[#005f85]">
            <Image
              src="/assets/images/protection.png"
              alt='delivered'
              height={120}
              width={120}
              className='max-w-40 max-h-40 invert'
            />
          </div>
          <div>
            <h3 className="text-3xl font-bold">Vehicle Delivered</h3>
            <p className="text-muted-foreground text-lg">This vehicle has been delivered successfully</p>
          </div>
          {/* <div className="space-y-6 text-left w-[90%] rounded-xl border p-6 ">
                    <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">VEHICLE NUMBER</p>
                        <p className="text-lg font-semibold text-foreground">kl54od0978</p>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-muted-foreground mb-2">DELIVERY TIME</p>
                        <div className="flex gap-3">
                            <div>
                                <p className="text-lg font-semibold text-foreground">2:45 PM</p>
                                <p className="text-sm text-muted-foreground">April 20, 2024</p>
                            </div>
                        </div>
                    </div>
                </div> */}
        </div>
      </div>
    )
  }

  const id = res.id;

  const data = await vehicleData(id);

  if (!data.success || !data.data) return;

  const { entry_time, charge_rate } = data.data;

  const currentTime = new Date();

  const entryTime = new Date(
    new Date(entry_time).toLocaleString("en-US", {
      timeZone: "Asia/Kolkata",
    })
  );

  const diffMs = Math.max(
    0,
    currentTime.getTime() - entryTime.getTime()
  );

  const diffHours = Math.max(
    1,
    Math.ceil(diffMs / (1000 * 60 * 60))
  );

  const payableAmount = diffHours * charge_rate!;

  const finalAmount = data.data.min_charges! > payableAmount ? data.data.min_charges : payableAmount;

  return (
    <div className='flex flex-col space-y-4'>

      <div className="border border-primary/20 rounded-xl p-5 bg-white shadow-sm">
        <div className="flex items-center justify-between">

          {/* Vehicle Section */}
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-lg">
              <Car size={26} />
            </div>

            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Vehicle</span>
              <span className="text-lg font-semibold tracking-wide">
                {data?.data?.vehicle_number}
              </span>
            </div>
          </div>

          {/* Status Section */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <div className="mt-1">
              <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-700">
                {data?.data?.status ?? "Drive way"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-primary/20 rounded-xl p-5 bg-white shadow-sm">
        <div className="flex flex-col space-y-4">

          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h3 className="font-bold text-lg">Entry Details</h3>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <User className='text-muted-foreground' size={20}></User>
              <p className='text-muted-foreground text-sm'>
                Entry by</p>
            </div>
            <p className='text-primary text-lg text-md'>{data.data?.valet_boy_name}</p>
          </div>

          <div className='space-y-2'>
            <div className='flex gap-2'>
              <Clock className='text-muted-foreground' size={20} />
              <p className='text-muted-foreground text-sm'>
                Entry time</p>
            </div>
            <p className="text-primary  text-md">
              {new Date(data.data?.entry_time!).toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
                dateStyle: "medium",
                timeStyle: "short"
              })}
            </p>
          </div>

          <div className='space-y-2'>
            <div className='flex gap-2'>
              <MapPin className='text-muted-foreground' size={20} />
              <p className='text-muted-foreground text-sm'>
                Location
              </p>
            </div>
            <p className='text-primary  text-md'>{data.data?.location_name}</p>
          </div>

        </div>
      </div>

      <div className="border border-primary/20 rounded-xl p-5 bg-white shadow-sm">
        <div className="flex flex-col space-y-4">

          <div className="flex items-center gap-2">
            <div className="w-1 h-6 bg-primary rounded-full"></div>
            <h3 className="font-bold text-lg">Additional Information</h3>
          </div>

          {/* <div className='space-y-2'>
            <div className='flex items-center gap-2'>
              <User className='text-muted-foreground' size={20}></User>
              <p className='text-muted-foreground text-sm'>
                Assigned Valet
              </p>
            </div>
            <p className='text-primary text-lg text-md'>Valet Name</p>
          </div> */}

          <div className='space-y-2'>
            <div className='flex gap-2'>
              <User className='text-muted-foreground' size={20} />
              <p className='text-muted-foreground text-sm'>
                Owner Name
              </p>
            </div>
            <p className="text-primary text-md">
              {data.data?.owner_name || "Not Given"}
            </p>
          </div>

          <div className='space-y-2'>
            <div className='flex gap-2'>
              <Phone className='text-muted-foreground' size={20} />
              <p className='text-muted-foreground text-sm'>
                Owner Mobile
              </p>
            </div>
            <p className='text-primary text-md'>
              {data.data?.owner_mobile || "Not Given"}
            </p>
          </div>

          <div className='space-y-2'>
            <div className='flex gap-2'>
              <IndianRupee className='text-muted-foreground' size={20} />
              <p className='text-muted-foreground text-sm'>
                Parking cost
              </p>
            </div>
            <p className='text-primary text-md'>
              {finalAmount} (for {diffHours} {diffHours > 1 ? "hours" : "hour"})
            </p>
          </div>

          <div className='space-y-2'>
            <div className='flex gap-2'>
              <Ticket className='text-muted-foreground' size={20} />
              <p className='text-muted-foreground text-sm'>
                Token Number
              </p>
            </div>
            <p className='text-primary text-md'>
              SVPT{data.data?.token}
            </p>
          </div>

        </div>
      </div>

      {data?.data && (
        <RequestButton
          vehicleNumber={data.data.vehicle_number}
          id={data.data.id}
        />
      )}

      {data.data.payment_status === "PAID" ?
        <Button>Amount Paid</Button> :
        <PayButton invoiceId={String(data.data?.id)} />
      }

    </div>
  )
}

export default Vehicle