import ExitComponent from "@/components/valetBoyScreen-2/ExitComponent";

type Props = {
  searchParams: Promise<{
    plate?: string;
  }>;
};

const ExitPage = async ({ searchParams }: Props) => {
  const { plate } = await searchParams;

  return (
    <div className="h-full">
      <ExitComponent vehicleNumber={plate || ""}/>
    </div>
  )
}

export default ExitPage