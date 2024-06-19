import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AxiosInstance from "@/utils/AxiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Transaction() {
    const [applications, setApplications] = useState([]);
    useEffect(() => {
        async function getApplications() {
            try {
                const response = await AxiosInstance.get("/transactions");
                if (response.status == 200) {
                    setApplications(response.data.transactions);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || error?.message);
            }
        }
        getApplications();
    }, []);
    const handleSearchUser = async (e) => {
        e.preventDefault();
        const search = e.target[0].value;
        try {
            const res = await AxiosInstance.get(`/admin/transaction/search?search=${search}`);
            if (res.status == 200) {
                setApplications(res.data.users);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    }
    return (
        <div>
            <h1 className="text-lg mb-2 font-semibold">All agents</h1>
            <form onSubmit={handleSearchUser} className="flex gap-2 my-3">
                <Input placeholder='Search by id' />
                <Button>Search</Button>
            </form>
            <table className="table-auto w-full rounded-lg shadow-md mt-10">
                <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm font-medium">
                        <th className="px-6 py-3">ID</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Title</th>
                        <th className="px-6 py-3">Location</th>
                        <th className="px-6 py-3">Payment Id</th>
                        <th className="px-6 py-3">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        applications?.map((transaction, index) => (
                            <tr key={transaction?._id}>
                                <td className="px-6 py-4 border-b text-center border-gray-200">{index + 1}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center">₹{transaction?.price}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center">{transaction?.property_id?.title}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center">{transaction?.property_id?.location}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center">{transaction?.payment_id}</td>
                                <td className="px-6 py-4 border-b border-gray-200 text-center">
                                    <Link to={`/property/${transaction?.property?._id}`} className="text-indigo-500 hover:text-indigo-700 text-centerF">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}
