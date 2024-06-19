import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { delay } from "@/lib/utils";
import AxiosInstance from "@/utils/AxiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Agents() {
    const [applications, setApplications] = useState([]);
    useEffect(() => {
        async function getApplications() {
            try {
                const response = await AxiosInstance.get("/agents");
                if (response.status == 200) {
                    setApplications(response.data.agents);
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
            const res = await AxiosInstance.get(`/admin/agent/search?search=${search}`);
            if (res.status == 200) {
                setApplications(res.data.users);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    }
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) {
            return
        }
        try {
            const res = await AxiosInstance.delete(`/agent/${id}`)
            if (res.status == 200) {
                toast.success(res.data.message);
                await delay(1000)
                window.location.reload();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message);
        }
    }

    return (
        <div>
            <h1 className="text-lg mb-2 font-semibold">All agents</h1>
            <form onSubmit={handleSearchUser} className="flex gap-2 my-3">
                <Input placeholder='Search agent id or name' />
                <Button>Search</Button>
            </form>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Agent name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Experience
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Properties Sold
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Id Proof
                        </th>
                        <th scope="col" className="px-6 py-3 space-x-2">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {applications.map((application) => {
                        return (
                            <tr
                                key={application?._id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    {application?.name}
                                </th>
                                <td className="px-6 py-4">{application?.application?.experience}</td>
                                <td className="px-6 py-4">{application?.application?.sold}</td>
                                <td className="px-6 py-4">
                                    <a className="text-blue-500 font-semibold" href={application?.application?.id_proof} target="_blank">Docs</a>
                                </td>
                                <td className="space-x-2">

                                    <Button onClick={() => handleDelete(application?._id)} variant="destructive"

                                    >Remove</Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    )
}