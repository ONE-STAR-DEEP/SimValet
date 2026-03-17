import { fetchEntryExitInfo, fetchLocationInfo } from '@/lib/actions/valetBoy';
import { CarFront, Clock } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from '@/components/ui/button';
import ValetModule from '@/components/valetBoy/ValetModule';
import { getSessionUser } from '@/lib/checkSession';

const Dashboard = async () => {

  const Details = await fetchLocationInfo();
  const todaysActivity = await fetchEntryExitInfo();
  
  const session = await getSessionUser();
  const companyId= session.company_id;

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

      <ValetModule companyId={companyId}/>
      {/* <EntryExitForm /> */}

    </div>
  )
}

export default Dashboard