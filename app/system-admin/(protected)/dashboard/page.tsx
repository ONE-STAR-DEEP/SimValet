import AddCompanyPopup from "@/components/system-admin/addCompanyPopup"
import { DataTable } from "@/components/system-admin/dataTable"
import { columns } from "@/components/system-admin/tableColumn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchCompanies } from "@/lib/actions/systemAdmin"


const page = async () => {

    const companyData = await fetchCompanies()

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
                    <Input
                        type="text"
                        placeholder="Search company by name"
                        className=""
                    />
                    <Button
                        type="button"
                    >Search
                    </Button>
                </div>
                <AddCompanyPopup />
            </header>

            <main className="mt-4">
                <DataTable columns={columns} data={Array.isArray(companyData.data) ? companyData.data : []} />
            </main>

        </div>
    )
}

export default page