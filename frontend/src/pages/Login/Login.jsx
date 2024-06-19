import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import axios from "axios";
import { useState } from "react";
import { useStoreContext } from "@/store/StoreProvider";
import { useQueryClient } from "@tanstack/react-query";
import { REACT_QUERY } from "@/constants/reactQuery";
const BASE_URI = import.meta.env.VITE_APP_BASE_API;
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});
export default function Login() {
  const [loading, setLoading] = useState(false);
  const { setUser } = useStoreContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URI}/login`, data);
      if (response.status == 200) {
        toast.success(response.data.message);
        localStorage.setItem("id", response.data?.user?.id);
        localStorage.setItem("email", response.data?.user?.email);
        localStorage.setItem("token", response.data?.user?.token);
        localStorage.setItem("account_type", response.data?.user?.account_type);

        setUser({
          id: response.data?.user?.id,
          is_auth: true,
          token: response.data?.user?.token,
          account_type: response.data?.user?.account_type,
        });
        queryClient.invalidateQueries({
          queryKey: [REACT_QUERY.PROFILE],
        });
        if (response.data?.user?.account_type == "admin") {
          return (window.location.href = "/admin/application");
        }
        window.location.reload();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.data?.message);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (
        error?.response?.data?.email_verified == false &&
        error?.response?.data?.user_found == true
      ) {
        navigate("/greet-email?email=" + data.email);
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className=" auth-bg min-h-screen flex justify-center items-center"
    >
      <Card className=" glass-morph mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                type="email"
                className="text-gray-600"
                {...register("email")}
              />
              <span className="text-red-500 text-sm">
                {errors?.email?.message}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                {...register("password")}
                className="text-gray-600"
                type="password"
              />
              <span className="text-red-500 text-sm">
                {errors?.password?.message}
              </span>
            </div>
            {loading ? (
              <button
                disabled
                type="button"
                className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-pink-500 hover:bg-pink-400 transition ease-in-out duration-150 cursor-not-allowed"
              >
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </button>
            ) : (
              <Button className="w-full" type="submit">
                Login
              </Button>
            )}
          </div>
          <div className="flex mt-5 items-center gap-3">
            <h1>Don&apos;t have an account?</h1>
            <Link className="text-blue-500 font-semibold" to="/signup">
              Signup
            </Link>
          </div>
          <div className=" mt-2">
            <Link className="text-blue-500 font-semibold" to="/forgot-password">
              Forgot password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
