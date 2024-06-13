import Navbar from "@/components/Navbar/Navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AxiosInstance from "@/utils/AxiosInstance";
import { MapPinIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

function SmartSearch() {
    const [data, setData] = useState([])
    const [err, setErr] = useState('');
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') 

    const fetchProperty = async (value) => {
        try {
            const res = await AxiosInstance.get(`/search?search=${value}`)
            if (res.status === 200) setData(res.data?.properties);
            if (res.data?.properties.length === 0) {
                setErr('No properties found')
            } else {
                setErr('')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleSearch = async (e,) => {
        e.preventDefault();
        const value = e.target[0].value;
        if (!value) return
        const url = new URL(window.location.href);
        url.searchParams.set('search', value);
        window.history.replaceState(null, null, url)
        fetchProperty(value);
    }
    useEffect(() => {
        if (!search) return;
        fetchProperty(search);
    }, [search])
    return (
        <section className="container">
            <Navbar />
            <form onSubmit={handleSearch} className="flex mt-10 gap-5 items-center">
                <input placeholder="Search property ..." className="w-full border p-1 rounded-md py-2" />
                <Button>Search</Button>
            </form>
            <h1 className="text-center my-10">{err}</h1>
            <div className="flex flex-col gap-2">

                {
                    data?.map((d) => (
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
                    ))
                }
            </div>
        </section>
    )
}

export default SmartSearch