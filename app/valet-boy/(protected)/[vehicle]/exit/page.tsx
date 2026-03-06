import ExitForm from '@/components/valetBoy/ExitForm';

const ExitPage = async ({
    params,
}: {
    params: Promise<{ vehicle: string }>;
}) => {
    
const { vehicle } = await params;

    return (
        <div>
            <ExitForm vehicle={vehicle}/>
        </div>
    )
}

export default ExitPage