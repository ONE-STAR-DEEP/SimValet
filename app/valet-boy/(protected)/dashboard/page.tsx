import { fetchEntryExitInfo, fetchLocationInfo } from '@/lib/actions/valetBoy';
import { CarFront, CarIcon, Clock } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import EntryForm from '@/components/valetBoy/EntryForm';

const Dashboard = async () => {

  const Details = await fetchLocationInfo();
  const todaysActivity = await fetchEntryExitInfo();

  const requests = [
    {
      id: 1,
      car_number: "MH12AB1234",
      customer_name: "Rahul",
      time: "10 sec ago"
    },
    {
      id: 2,
      car_number: "MH14XY4567",
      customer_name: "Amit",
      time: "30 sec ago"
    }
  ]

  return (
    <div className="w-full flex flex-col gap-2">


      <div className="w-full border border-primary/20 rounded-xl  px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="account" className="border-none">

            <AccordionTrigger className="text-sm font-semibold">
              Account Information
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-3 text-sm pb-2">

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valet Name</span>
                  <span className="font-semibold text-primary">
                    {/* {valetDetails?.name} */} {Details?.data?.valet_boy_name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valet ID</span>
                  <span className="font-semibold text-primary">
                    {/* {valetDetails?.id} */} {Details?.data?.valet_boy_id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold text-primary text-right">
                    {Details?.data?.location_name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location ID</span>
                  <span className="font-semibold text-primary">
                    {/* {Details?.data?.id} */} {Details?.data?.id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parking Lot ID</span>
                  <span className="font-semibold text-primary">
                    {/* {Details?.data?.id} */} {Details?.data?.prk_lot_id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location Manager</span>
                  <span className="font-semibold text-primary text-right">
                    {Details?.data?.contact_person_name}
                  </span>
                </div>
              </div>
            </AccordionContent>

          </AccordionItem>
        </Accordion>
      </div>


      <div className="w-full border border-primary/20 rounded-xl  px-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="account" className="border-none">

            <AccordionTrigger className="text-sm font-semibold">
              Today's Insight
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-3 text-sm pb-2">

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <CarFront size={16} />
                    Total Entries
                  </span>

                  <span className="font-bold text-primary">
                    {todaysActivity.entryCount}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <CarFront size={16} />
                    Total Exits
                  </span>

                  <span className="font-bold text-primary">
                    {todaysActivity.exitCount}
                  </span>
                </div>

                <Button className="mt-2 w-full">View All Activity</Button>

              </div>
            </AccordionContent>

          </AccordionItem>
        </Accordion>
      </div>

      <EntryForm />

      <div className="rounded-xl border-2 border-black/20">

        {/* Header */}
        <div className="p-4 flex gap-2 items-center border-b">
          <Clock size={20} />
          <h3 className="font-semibold">Customer Requests</h3>
        </div>

        {/* Requests */}
        <div className="flex flex-col">

          {requests?.map((req) => (
            <div
              key={req.id}
              className="p-4 flex items-center justify-between border-b hover:bg-muted/40 transition"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-primary">
                  {req.car_number}
                </span>

                <span className="text-xs text-muted-foreground">
                  Customer: {req.customer_name}
                </span>

                <span className="text-xs text-muted-foreground">
                  Requested {req.time}
                </span>
              </div>

              <button className="bg-primary text-white px-3 py-1 rounded-md text-sm hover:bg-primary/90">
                Accept
              </button>
            </div>
          ))}

        </div>
      </div>

    </div>
  )
}

export default Dashboard