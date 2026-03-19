import AddLocationPopup from "@/components/company/addLocationPopup"
import { DataTable } from "@/components/system-admin/dataTable"
import { columns } from "@/components/company/TableColumn"
import { fetchCompanyData, fetchLocations } from "@/lib/actions/company"
import SearchComponent from "@/components/SearchComponent"
import { CompanyInfo } from "@/components/company/InformationSection"


const Dashboard = async ({
    searchParams
}: {
    searchParams: Promise<{ search?: string }>
}) => {

    const params = await searchParams

    const [locationData, companyData] = await Promise.all([
        fetchLocations(params.search),
        fetchCompanyData()
    ]);

    const remaining = companyData.data.no_of_locations - companyData.data.locationCount;

    return (
        <div className="flex flex-col space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Valet Locations</h1>
                <p className="text-muted-foreground">
                    Manage all registered valet service locations under your company account.
                </p>
            </div>

            <CompanyInfo data={companyData.data} />



            <main className="mt-4 space-y-4">
                <h1 className="text-2xl font-black">Location Records</h1>
                <section className="flex flex-col space-y-2 md:flex-row md:items-center justify-between mt-4">
                    <div className="flex items-center justify-center gap-2">
                        <SearchComponent placeholder="Search Location by Name..." />
                    </div>
                    <AddLocationPopup
                        remainingLocationCount={remaining}
                    />
                </section>

                <DataTable columns={columns} data={Array.isArray(locationData?.data) ? locationData.data : []} />
            </main>

        </div>
    )
}

export default Dashboard