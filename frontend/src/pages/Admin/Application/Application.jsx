import { Button } from "@/components/ui/button";
import AxiosInstance from "@/utils/AxiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Application() {
    const [applications, setApplications] = useState([]);
    useEffect(() => {
        async function getApplications() {
            try {
                const response = await AxiosInstance.get("/applications");
                if (response.status == 200) {
                    setApplications(response.data.applications);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || error?.message);
            }
        }
        getApplications();
    }, []);

    return (
        <div className="relative overflow-x-auto">
            <h1 className="text-lg font-semibold mb-2">All agent applications</h1>
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
                                key={application?.id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                            >
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                >
                                    {application?.user_id?.name}
                                </th>
                                <td className="px-6 py-4">{application?.experience}</td>
                                <td className="px-6 py-4">{application?.sold}</td>
                                <td className="px-6 py-4">
                                    <a className="text-blue-500 font-semibold" href={application?.id_proof} target="_blank">Docs</a>
                                </td>
                                <td className="space-x-2">
                                    <Button
                                        onClick={async () => {
                                            if (!window.confirm("Are you sure you want to grant this application?")) return;
                                            try {
                                                const res = await AxiosInstance.patch(`/application/grant/${application?._id}`)
                                                if (res.status == 200) {
                                                    toast.success(res.data.message);
                                                    await new Promise((resolve) => setTimeout(resolve, 1000))
                                                    window.location.reload();
                                                }
                                            } catch (error) {
                                                toast.error(error?.response?.data?.message || error?.message);
                                            }
                                        }}

                                        variant="outline">Grant</Button>
                                    <Button variant="destructive"
                                        onClick={async () => {
                                            if (!window.confirm("Are you sure you want to grant this application?")) return;
                                            try {
                                                const res = await AxiosInstance.patch(`/application/decline/${application?._id}`)
                                                if (res.status == 200) {
                                                    toast.success(res.data.message);
                                                    await new Promise((resolve) => setTimeout(resolve, 1000))
                                                    window.location.reload();
                                                }
                                            } catch (error) {
                                                toast.error(error?.response?.data?.message || error?.message);
                                            }
                                        }}

                                    >Decline</Button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
