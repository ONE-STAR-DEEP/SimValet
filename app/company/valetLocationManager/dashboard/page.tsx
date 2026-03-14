import { columns } from '@/components/valetLocationManager/tableColumns'
import { DataTable } from '@/components/system-admin/dataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchValetBoyData } from '@/lib/actions/locationManager'
import AddValetBoyPopup from '@/components/valetLocationManager/AddValetBoyPopup'
import { fetchLocationInfo } from '@/lib/actions/valetBoy'
import SearchComponent from '@/components/SearchComponent'

export const locationData = {
  success: true,
  data: {
    id: "loc_001",
    name: "DLF Mall of India - Gate 3",
    address: "Sector 18, Noida, Uttar Pradesh 201301",
    contact: "+91 9876543210",
    shiftTiming: "9:00 AM - 11:00 PM",
    isActive: true,

    totalValetStaff: 8,
    onDuty: 5,
    offDuty: 3,

    valetStaff: [
      {
        id: "val_001",
        name: "Rohit Sharma",
        phone: "+91 9000000001",
        status: "on-duty",
        assignedShift: "Morning"
      },
      {
        id: "val_002",
        name: "Amit Kumar",
        phone: "+91 9000000002",
        status: "on-duty",
        assignedShift: "Morning"
      },
      {
        id: "val_003",
        name: "Vikas Yadav",
        phone: "+91 9000000003",
        status: "off-duty",
        assignedShift: "Evening"
      },
      {
        id: "val_004",
        name: "Sahil Khan",
        phone: "+91 9000000004",
        status: "on-duty",
        assignedShift: "Evening"
      },
      {
        id: "val_005",
        name: "Deepak Singh",
        phone: "+91 9000000005",
        status: "off-duty",
        assignedShift: "Night"
      }
    ]
  }
}

const ValetLocationManager = async ({
    searchParams
}: {
    searchParams: Promise<{ search?: string }>
}) => {

    const params = await searchParams

  const valetBoyData = await fetchValetBoyData(params.search);

  return (
    <div>
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {locationData?.data?.name} – Operations
          </h1>
          <p className="text-muted-foreground">
            Manage valet staff, monitor activity, and control daily operations for this location.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="rounded-xl border p-4 bg-background shadow-sm">
            <p className="text-sm text-muted-foreground">Total Valet Staff</p>
            <h2 className="text-2xl font-semibold">
              {locationData?.data?.totalValetStaff || 0}
            </h2>
          </div>

          <div className="rounded-xl border p-4 bg-background shadow-sm">
            <p className="text-sm text-muted-foreground">On Duty</p>
            <h2 className="text-2xl font-semibold text-green-600">
              {locationData?.data?.onDuty || 0}
            </h2>
          </div>

          <div className="rounded-xl border p-4 bg-background shadow-sm">
            <p className="text-sm text-muted-foreground">Off Duty</p>
            <h2 className="text-2xl font-semibold text-red-500">
              {locationData?.data?.offDuty || 0}
            </h2>
          </div>

          <div className="rounded-xl border p-4 bg-background shadow-sm">
            <p className="text-sm text-muted-foreground">Location Status</p>
            <h2 className="text-2xl font-semibold">
              {locationData?.data?.isActive ? "Active" : "Inactive"}
            </h2>
          </div>
        </div>
      </div>
      
      <header className="flex flex-col space-y-2 md:flex-row md:items-center justify-between mt-4">
        <div className="flex items-center justify-center gap-2">
          <SearchComponent placeholder='Search Name or Mobile...'/>
        </div>
        <AddValetBoyPopup />
      </header>

      <main className="mt-4">
        <DataTable columns={columns} data={Array.isArray(valetBoyData.data) ? valetBoyData.data : []} />
      </main>

    </div>
  )
}

export default ValetLocationManager