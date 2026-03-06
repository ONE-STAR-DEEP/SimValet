import EntryForm from "@/components/valetBoy/EntryForm";

const EntryPage = async ({
    params,
}: {
    params: Promise<{ vehicle: string }>;
}) => {
    
const { vehicle } = await params;

    return (
        <div>
            <EntryForm vehicle={vehicle} />
        </div>
    )
}

export default EntryPage