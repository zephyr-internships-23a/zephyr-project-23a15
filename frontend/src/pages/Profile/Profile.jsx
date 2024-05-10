import Navbar from "@/components/Navbar/Navbar";
import { Button } from "@/components/ui/button";
import { useStoreContext } from "@/store/StoreProvider";
import { Link } from "react-router-dom";
import { Edit2Icon } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { MapPinIcon } from 'lucide-react'
export default function Profile() {
    const { user_data } = useStoreContext();
    return (
        <section className="container relative min-h-screen">
            <Navbar />
            <main className="mt-10">
                <div className="flex justify-center gap-4 md:gap-10">
                    <img
                        className="h-20 w-20 object-cover  rounded-full"
                        src={user_data?.avatar} />
                    <div className="space-y-2">
                        <h1 className="text-gray-500 font-semibold">{user_data?.name}</h1>
                        <p className="text-gray-500 border px-2 pb-1 rounded-md">{user_data?.email}</p>
                        <span className="bg-gray-200 px-3 pb-1 text-gray-500 inline-block rounded-md">{user_data?.account_type}</span>
                        <p className="text-slate-500 text-sm font-semibold">{user_data?.phone}</p>

                        <p className="text-slate-500 flex gap-2 text-sm font-semibold capitalize">
                            <MapPinIcon />
                            {user_data?.address}</p>
                    </div>
                    <Link to='/edit/profile'>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Button variant="outline">
                                        <Edit2Icon />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit profile</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>


                    </Link>
                </div>
                {/* if it is an user account show previous contacted agents */}

                {/* if it is an agent acount show list of all properties uploaded by him */}

            </main>
            <div className="float-right absolute bottom-2 right-2 ">
                <Link to='/become/agent'>
                    <Button variant="outline">Become an agent?</Button>
                </Link>
            </div>
        </section>
    )
}
