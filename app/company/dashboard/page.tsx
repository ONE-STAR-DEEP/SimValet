import AddLocationPopup from "@/components/company/addLocationPopup"
import { DataTable } from "@/components/system-admin/dataTable"
import { columns } from "@/components/company/TableColumn"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchLocations } from "@/lib/actions/company"


const Dashboard = async () => {

    const locationData = await fetchLocations()

    return (
        <div>
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold">Valet Locations</h1>
                <p className="text-muted-foreground">
                    Manage all registered valet service locations under your company account.
                </p>

                <div className="flex gap-6 mt-4 text-sm text-muted-foreground">
                    <span>• Total Locations: {Array.isArray(locationData?.data) ? locationData.data.length : 0}</span>
                    <span>• Active: {}</span>
                    <span>• Inactive: {}</span>
                </div>
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
                <AddLocationPopup />
            </header>

            <main className="mt-4">
                <DataTable columns={columns} data={Array.isArray(locationData.data) ? locationData.data : []} />
            </main>

        </div>
    )
}

export default Dashboard