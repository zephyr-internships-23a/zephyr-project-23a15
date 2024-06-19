import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "@/components/Navbar/Navbar";
import AxiosInstance from "@/utils/AxiosInstance";
export default function PaymentSuccess() {
    const [error, setError] = useState("");
    useEffect(() => {
        async function updatePayment() {
            try {
                await AxiosInstance.post("/confirm-payment");
            } catch (error) {
                console.log(error);
                toast.error(error?.response?.data?.message || error.message);
                setError(error?.response?.data?.message || error.message);
            }
        }
        updatePayment();
    }, []);
    return (
        <div className="container">
            {error ? (
                <>
                    <Navbar />
                    <h1 className="text-center mt-5 text-red-500 font-semibold">
                        {error}
                    </h1>
                </>
            ) : (
                <div className=" h-screen ">
                    <Navbar />
                    <h1 className="text-3xl text-emerald-600 mt-20 font-semibold text-center">
                        Payment was Successfull
                    </h1>
                    <div className="flex justify-center mt-5">
                        <Link className="underline text-sky-400" to="/profile">
                            Go to Applications
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
