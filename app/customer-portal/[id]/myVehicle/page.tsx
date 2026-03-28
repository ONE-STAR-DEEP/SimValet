import PayButton from '@/components/customer portal/PayButton';
import RequestButton from '@/components/customer portal/RequestButton';
import { Button } from '@/components/ui/button';
import { vehicleData } from '@/lib/actions/customer';
import { Car, Clock, IndianRupee, MapPin, Phone, Ticket, User } from 'lucide-react';

type VehicleProps = {
  params: Promise<{ id: number }>
};

const Vehicle = async ({ params }: VehicleProps) => {
  const { id } = await params;

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
              {payableAmount}
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