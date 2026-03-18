import { columns } from '@/components/valetLocationManager/tableColumns'
import { DataTable } from '@/components/system-admin/dataTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { fetchValetBoyData, getLocationDetails } from '@/lib/actions/locationManager'
import AddValetBoyPopup from '@/components/valetLocationManager/AddValetBoyPopup'
import { fetchLocationInfo } from '@/lib/actions/valetBoy'
import SearchComponent from '@/components/SearchComponent'
import Link from 'next/link'

const ValetLocationManager = async ({
  searchParams
}: {
  searchParams: Promise<{ search?: string }>
}) => {

  const params = await searchParams

  const valetBoyData = await fetchValetBoyData(params.search);
  const locationData = await getLocationDetails();

  const count = valetBoyData.data?.length || 0;

  return (
    <div>
      <div className="flex flex-col gap-3">

        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {locationData?.data?.location_name} – Operations
          </h1>
          <p className="text-muted-foreground">
            Manage valet staff, monitor activity, and control daily operations for this location.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="rounded-xl border p-4 bg-background shadow-sm">
            <p className="text-sm text-muted-foreground">Total Valet Staff</p>
            <h2 className="text-2xl font-semibold">
              {count}
            </h2>
          </div>

          {/* <div className="rounded-xl border p-4 bg-background shadow-sm">
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
          </div> */}

          <div className="rounded-xl border p-4 bg-background shadow-sm">
            <p className="text-sm text-muted-foreground">Location Status</p>
            <h2 className="text-2xl font-semibold">
              {locationData?.data?.is_active ? "Active" : "Inactive"}
            </h2>
          </div>

          <Link className="rounded-xl border p-4 bg-background shadow-sm hover:cursor-pointer" href="/company/valetLocationManager/dashboard/LocationActivities">

            <p className="text-md text-primary">View All Activities</p>

          </Link>
        </div>
      </div>

      <header className="flex flex-col space-y-2 md:flex-row md:items-center justify-between mt-4">
        <div className="flex items-center justify-center gap-2">
          <SearchComponent placeholder='Search Name or Mobile...' />
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