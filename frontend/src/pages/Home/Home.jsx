import Banner from "@/components/Banner/Banner";
import Navbar from "@/components/Navbar/Navbar";
import dummy from '../../data/dummy.json'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MapPinIcon } from 'lucide-react'

export default function Home() {
  return (
    <section className="container space-y-5">
      <Navbar />
      <div className="">
        <Banner />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
        {
          dummy.map(d =>
            <Card key={d.id} className="w-full max-h-[400px] ">
              <CardHeader>
                <CardTitle className='text-lg text-slate-500'>{d.title}</CardTitle>
                <CardDescription>{d.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img src={d.image_url} className="h-52 object-cover
                 w-full" />
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex text-xs font-semibold text-slate-400 items-center">
                  <MapPinIcon size={15} />
                  {d.location}
                </div>
                <div className="text-xs text-slate-400 font-semibold ">
                  by {d.posted_by}
                </div>
              </CardFooter>
            </Card>
          )
        }
      </div>
    </section>
  );
}
