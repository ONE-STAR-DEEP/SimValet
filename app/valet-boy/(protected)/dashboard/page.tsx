import { fetchLocationInfo } from '@/lib/actions/valetBoy';
import { CarIcon, Clock } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import VehicleInput from '@/components/valetBoy/vehicleInput';

const Dashboard = async () => {

  const locationDetails = await fetchLocationInfo();

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full border border-primary/20 rounded-xl  px-4">

        <Accordion type="single" collapsible defaultValue="account">
          <AccordionItem value="account" className="border-none">

            <AccordionTrigger className="text-sm font-semibold">
              Account Information
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex flex-col gap-3 text-sm pb-2">

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valet Name</span>
                  <span className="font-semibold text-primary">
                    {/* {valetDetails?.name} */} Valet Name
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valet ID</span>
                  <span className="font-semibold text-primary">
                    {/* {valetDetails?.id} */} VID12345
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold text-primary text-right">
                    {locationDetails?.data?.location_name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location ID</span>
                  <span className="font-semibold text-primary">
                    {/* {locationDetails?.data?.id} */} LID12345
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location Manager</span>
                  <span className="font-semibold text-primary text-right">
                    {locationDetails?.data?.contact_person_name}
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

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valet Name</span>
                  <span className="font-semibold text-primary">
                    {/* {valetDetails?.name} */} Valet Name
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Valet ID</span>
                  <span className="font-semibold text-primary">
                    {/* {valetDetails?.id} */} VID12345
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <span className="font-semibold text-primary text-right">
                    {locationDetails?.data?.location_name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location ID</span>
                  <span className="font-semibold text-primary">
                    {/* {locationDetails?.data?.id} */} LID12345
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Location Manager</span>
                  <span className="font-semibold text-primary text-right">
                    {locationDetails?.data?.contact_person_name}
                  </span>
                </div>

              </div>
            </AccordionContent>

          </AccordionItem>
        </Accordion>
      </div>

      <VehicleInput />

      <div className='rounded-xl border-2 border-black/20'>
        <div className='p-4 flex gap-2 items-center border-b justify-start'>
          <Clock size={20}/>
          <h3 className=''>Recent Activities</h3>
        </div>
      </div>
    </div>
  )
}

export default Dashboard