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
const BASE_URI = import.meta.env.VITE_APP_BASE_API;
const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required().min(6).max(32),
  name: yup.string().required(),
});
export default function Signup() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
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
      const response = await axios.post(`${BASE_URI}/signup`, data);
      if (response.status == 201) {
        toast.success(response.data.message);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        navigate(`/greet-email?email=${data.email}`);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="auth-bg flex min-h-screen  justify-center items-center"
    >
      <Card className="mx-auto w-96 max-w-md glass-morph">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Signup</CardTitle>
          <CardDescription>Enter your details to Signup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                {...register("name")}
                id="name"
                placeholder="john doe"
                type="text"
                className="text-gray-600"
              />
              <span className="text-red-500 text-sm">
                {errors?.name?.message}
              </span>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="m@example.com"
                type="email"
                {...register("email")}
                className="text-gray-600"
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
                type="password"
                className="text-gray-600"
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
                Signup
              </Button>
            )}

            <div className="flex items-center gap-3">
              <h1>Already have an account?</h1>
              <Link className="text-blue-500 font-semibold" to="/login">
                Login
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
