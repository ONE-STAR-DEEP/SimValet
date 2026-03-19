import ActivityList from '@/components/valetBoy/activityRecords'
import LoadMore from '@/components/valetBoy/LoadMore'
import { fetchValeActivities } from '@/lib/actions/valetBoy'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

const page = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; limit?: string }>
}) => {
    const params = await searchParams

    const pageNumber = Number(params.page || 1)
    const limit = Number(params.limit || 10)

    const offset = (pageNumber - 1) * limit

    const activityData = await fetchValeActivities({
        limit,
        offset,
    })

    return (
        <div className='flex flex-col space-y-4'>
            <Link
                href="/valet-boy/dashboard"
                className='w-28 bg-white flex items-center justify-center border rounded-lg px-1 border-primary/50 text-primary hover:bg-primary hover:text-white'
            >
                <ChevronLeft size={20} />
                <p>Back</p>
            </Link>

            <ActivityList data={activityData.data} />

            <LoadMore currentPage={pageNumber} />
        </div>
    )
}

export default page