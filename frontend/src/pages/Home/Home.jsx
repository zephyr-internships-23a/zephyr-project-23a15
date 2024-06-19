import Banner from "@/components/Banner/Banner";
import Navbar from "@/components/Navbar/Navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPinIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY } from "@/constants/reactQuery";
import AxiosInstance from "@/utils/AxiosInstance";
import { Link } from "react-router-dom";

export default function Home() {
  const { data } = useQuery({
    queryKey: [REACT_QUERY.PROPERTY],
    queryFn: async () => {
      const res = await AxiosInstance.get("/property");
      return res.data;
    },
  });
  console.log(data);
  return (
    <section className="container space-y-5">
      <Navbar />
      <div className="">
        <Banner />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {data?.properties?.map((d) => (
          <Link key={d._id} to={`/property/${d._id}`} >
            <Card className="w-full max-h-[400px] ">
              <CardHeader>
                <CardTitle className="text-lg text-slate-500">
                  {d.title}
                </CardTitle>
                <CardDescription className='truncate'>{d.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={d.images[0]}
                  className="h-52 object-cover
                 w-full"
                />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex text-xs font-semibold text-slate-400 items-center">
                  <MapPinIcon size={15} />
                  {d.location}
                </div>
                <div className="text-xs text-slate-400 font-semibold ">
                  by {d.user_id.name}
                </div>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </section >
  );
}
