import AddCompanyPopup from "@/components/system-admin/addCompanyPopup"
import { DataTable } from "@/components/system-admin/dataTable"
import { columns } from "@/components/system-admin/tableColumn"
import { fetchCompanies } from "@/lib/actions/systemAdmin"
import SearchComponent from "@/components/SearchComponent"


const page = async ({
    searchParams
}: {
    searchParams: Promise<{ search?: string }>
}) => {

    const params = await searchParams

    const companyData = await fetchCompanies(params.search)

    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold">Company Management</h1>
                <p className="text-muted-foreground">
                    View and manage registered companies.
                </p>
            </div>
            <header className="flex flex-col space-y-2 md:flex-row md:items-center justify-between mt-4">
                <div className="flex items-center justify-center gap-2">
                    <SearchComponent placeholder="Search Company by Name"/>
                </div>
                <AddCompanyPopup />
            </header>

            <main className="mt-4">
                <DataTable columns={columns} data={Array.isArray(companyData?.data) ? companyData.data : []} />
            </main>

        </div>
    )
}

export default page