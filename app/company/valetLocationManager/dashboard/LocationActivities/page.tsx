import { DataTable } from '@/components/system-admin/dataTable';
import { Button } from '@/components/ui/button';
import { columns } from '@/components/valetLocationManager/activityTableColumns';
import DateFilter from '@/components/valetLocationManager/DateFilter';
import Pagination from '@/components/valetLocationManager/PaginationComponent';
import { getActivityData } from '@/lib/actions/locationManager'
import { ArrowDownIcon, ArrowUpIcon, ChevronLeft, Clock, TrendingUp } from 'lucide-react'
import Link from 'next/link';

type Props = {
  searchParams: Promise<{
    page?: string
    limit?: string
    from?: string
    to?: string
  }>
}

const LocationActivities = async ({ searchParams }: Props) => {
  const params = await searchParams

  const page = Number(params.page || 1)
  const limit = Number(params.limit || 20)
  const from = params.from
  const to = params.to

  const activityData = await getActivityData({
    page,
    limit,
    startDate: from,
    endDate: to,
  })
  const entry_percentage = Number(activityData.data?.stats.entry_percent_change);
  const exit_percentage = Number(activityData.data?.stats.exit_percent_change);


  return (
    <div className='flex flex-col space-y-6'>

      <Link href="/company/valetLocationManager/dashboard" className='w-28 bg-white flex items-center justify-center border rounded-lg px-1 border-primary text-primary hover:bg-primary hover:text-white'>
        <ChevronLeft size={20} />
        <p>
          Back
        </p>
      </Link>

      <section>
        <h1 className='text-2xl lg:text-4xl font-bold'>Location Activities</h1>
        <p className='text-muted-foreground text-md'>Monitor entries and exits in real-time</p>
      </section>

      <section className='grid grid-cols-1 lg:grid-cols-4 gap-4'>

        <div className='border px-4 py-6 space-y-4 rounded-xl shadow-lg'>
          <div className='flex items-center justify-between'>
            <div className='bg-linear-to-br from-emerald-500 to-teal-500 rounded-xl'>
              <ArrowUpIcon className='m-4 text-white' />
            </div>
            <p className={`text-sm px-4 rounded-md ${entry_percentage > 0 ? `text-emerald-600 bg-emerald-200` : `text-red-600 bg-red-200`}`}>{entry_percentage > 0 ? `+${entry_percentage}` : `${entry_percentage}`}%</p>
          </div>
          <div>
            <h6 className='text-muted-foreground text-md'>Total Entries Today</h6>
            <p className='font-black text-xl'>{activityData.data?.stats.today_entries ?? 0}</p>
          </div>
        </div>

        <div className='border px-4 py-6 space-y-4 rounded-xl shadow-lg'>
          <div className='flex items-center justify-between'>
            <div className='bg-linear-to-br from-orange-500 to-red-500 rounded-xl'>
              <ArrowDownIcon className='m-4 text-white' />
            </div>
            <p className={`text-sm px-4 rounded-md ${exit_percentage > 0 ? `text-emerald-600 bg-emerald-200` : `text-red-600 bg-red-200`}`}>{exit_percentage > 0 ? `+${exit_percentage}` : `${exit_percentage}`}%</p>

          </div>
          <div>
            <h6 className='text-muted-foreground text-md'>Total Exits Today</h6>
            <p className='font-black text-xl'>{activityData.data?.stats.today_exits ?? 0}</p>
          </div>
        </div>

        <div className='border px-4 py-6 space-y-4 rounded-xl shadow-lg'>
          <div className='flex items-center justify-between'>
            <div className='bg-linear-to-br from-blue-500 to-cyan-500 rounded-xl'>
              <TrendingUp className='m-4 text-white' />
            </div>
            {/* <p className='text-sm bg-emerald-200 px-4 rounded-md text-emerald-600'>+12%</p> */}
          </div>
          <div>
            <h6 className='text-muted-foreground text-md'>Total Active Vehicles</h6>
            <p className='font-black text-xl'>{activityData.data?.stats.active_vehicles ?? 0}</p>
          </div>
        </div>

        <div className='border px-4 py-6 space-y-4 rounded-xl shadow-lg'>
          <div className='flex items-center justify-between'>
            <div className='bg-linear-to-br from-purple-500 to-pink-500 rounded-xl'>
              <Clock className='m-4 text-white' />
            </div>
            {/* <p className='text-sm bg-emerald-200 px-4 rounded-md text-emerald-600'>+12%</p> */}
          </div>
          <div>
            <h6 className='text-muted-foreground text-md'>Avg Time Duration</h6>
            <p className='font-black text-xl'>{activityData.data?.stats.avg_duration_today ?? 0}</p>
          </div>
        </div>

      </section>

      <section className='flex flex-col space-y-4 mt-8'>
        <h2 className='text-2xl font-black'>Activity Record</h2>

        <div className='flex items-center gap-2'>
          <span className='bg-gray-200 py-2 px-4 rounded-2xl text-sm text-muted-foreground'>
            Total  records: {activityData.data?.pagination.total || 0}
          </span>

          <DateFilter />

        </div>
        {
          activityData.data?.activities?.length ? (
            <DataTable columns={columns} data={activityData.data.activities} />
          ) : (
            <div className="flex items-center justify-center h-40 border rounded-lg">
              <p className="text-muted-foreground">No activity found</p>
            </div>
          )
        }
        <Pagination totalPages={activityData.data?.pagination.totalPages ?? 0} />
      </section >

    </div >
  )
}

export default LocationActivities