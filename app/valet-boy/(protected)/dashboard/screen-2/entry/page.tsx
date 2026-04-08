import EntryComponent from "@/components/valetBoyScreen-2/EntryComponent";

type Props = {
  searchParams: Promise<{
    plate?: string;
  }>;
};

async function EntryPage({ searchParams }: Props) {
  const { plate } = await searchParams;

  return (
    <div className="h-full">
      <EntryComponent vehicleNumber={plate || ""}/>
    </div>
  );
}

export default EntryPage