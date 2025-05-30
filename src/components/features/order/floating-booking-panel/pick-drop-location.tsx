import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PickDropLocationCard = () => {
  return (
    <Card className="xl:flex-0 grid gap-4 rounded-[20px] border border-gray-20 bg-white px-[30px] py-5 shadow-custom-gray lg:w-[360px]">
      <CardHeader className="flex flex-row items-center justify-center space-y-0 p-0">
        <CardTitle className="text-xl">Pick-up/Drop-off location</CardTitle>
      </CardHeader>
      <CardContent className="px-5 py-3"></CardContent>
    </Card>
  );
};

export default PickDropLocationCard;
