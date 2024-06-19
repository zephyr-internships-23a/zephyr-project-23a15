import Banner from "@/components/Banner/Banner";
import Navbar from "@/components/Navbar/Navbar";
import { Button } from "@/components/ui/button";
import { delay } from "@/lib/utils";
import { useStoreContext } from "@/store/StoreProvider";
import AxiosInstance from "@/utils/AxiosInstance";
import moment from "moment";
import { useEffect, useState } from "react"
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditPropertyModal from "../Edit/Edit";
export default function PropertyDetails() {
    const { user } = useStoreContext()
    const [property, setProperty] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        async function fetchProperty() {
            try {
                const response = await AxiosInstance.get(`/property/${id}`);
                setProperty(response.data.property);
            }
            catch (error) {
                console.log(error);
            }
        }
        fetchProperty();
    }, [id])
    async function createChatRoom() {
        try {
            const chatResponse = await AxiosInstance.post('/chat', {
                user_one: user.id,
                user_two: property?.user_id?._id
            })
            if (chatResponse.status == 200) {
                navigate(`/chats?chatId=${chatResponse.data.chatId}`)
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.message);
        }
    }
    async function handleDelete() {
        try {
            if (!window.confirm('Are you sure?')) return;
            const res = await AxiosInstance.delete(`/property/${id}`);
            if (res.status == 200) {
                toast.success(res.data.message);
                await delay(1000);
                window.location.href = '/profile'
            }
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || error?.message);
        }
    }
    return (
        <section className="container">
            <Navbar />
            <Banner images={property?.images} />
            <div className="mt-6 flex items-center justify-between">
                <div>
                    <h1 className="capitalize">{property?.title}</h1>
                    <p className="text-sm  text-slate-500">Posted on <span className="font-semibold">{moment(property?.createdAt).format("MMMM Do YYYY")}</span></p>
                </div>
                <div>
                    {
                        property?.user_id?.name
                    }
                </div>
            </div>
            <div className="mt-3 text-slate-500 capitalize text-sm font-sans">
                {
                    property?.description
                }
            </div>
            <div className="flex items-start justify-between mt-5">

                <div className="text-sm text-slate-500 ">
                    Buy now at <span className="font-semibold">₹{property?.price}</span>
                </div>

                {
                    user?.id == property?.user_id?._id ?

                        <div className="space-x-2">

                            <Button onClick={handleDelete} variant='destructive'>
                                Delete
                            </Button>
                            <EditPropertyModal
                                age={property?.age}
                                description={property?.description}
                                images={property?.images}
                                location={property?.location}
                                price={property?.price}
                                title={property?.title}
                                id={property?._id}
                            />
                        </div>

                        :
                        <>
                            {
                                property?.booked ? <></> :
                                    <div className="space-x-2">
                                        <Link to='/checkout' state={{
                                            price: property?.price,
                                            title: property?.title,
                                            property_id: property?._id,
                                            user_id: user.id,
                                            agent_id: property?.user_id?._id
                                        }}>
                                            <Button>
                                                Buy now
                                            </Button>
                                        </Link>
                                        <Button
                                            onClick={createChatRoom}
                                            variant='outline'>
                                            Chat with agent
                                        </Button>
                                    </div>
                            }

                        </>
                }
            </div>

        </section>
    )
}
