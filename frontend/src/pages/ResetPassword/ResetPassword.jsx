import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
const schema = yup.object().shape({
  password: yup.string().min(6).max(30).required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
import { api_base_url } from "../../CONSTANTS";
export default function ResetPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = useState(false);
  let [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async (data) => {
    try {
      setLoading(true);
      const response = await axios.post(`${api_base_url}/resetpassword`, {
        password: data.password,
        token: token,
        confirmPassword: data.confirmPassword,
      });
      if (response.status == 200) {
        toast.success(response.data.message);
        reset();
        await new Promise((resolve) => setTimeout(resolve, 800));
        window.location.href = "/login";
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.data?.message);
    } finally {
      setLoading(false);
    }
  }, []);
  if (!token) {
    return (
      <>
        <section className="grid-bg flex justify-center items-center ">
          <div className="text-red-500 bg-white p-5 rounded-md shadow-md">
            <h1>Missing token cannot reset password!</h1>
          </div>
        </section>
      </>
    );
  }
  return (
    <section className="grid-bg flex justify-center items-center ">
      <Card className=" glass-morph mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-slate-800 text-md">
            Reset your password
          </CardTitle>
          <CardDescription>
            Make sure to a strong password combination of letters but easier to
            remember!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-slate-900 text-sm font-semibold"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                className="text-gray-600"
                {...register("password")}
              />
              {errors?.password && (
                <p className="text-red-500">{errors?.password?.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-slate-900 text-sm font-semibold"
              >
                Confirm Password
              </Label>

              <Input
                id="confirm-password"
                type="password"
                className="text-gray-600"
                {...register("confirmPassword")}
              />
              {errors?.confirmPassword && (
                <p className="text-red-500">
                  {errors?.confirmPassword?.message}
                </p>
              )}
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
                Reset
              </Button>
            )}
          </form>
          <div className="mt-2">
            <Link className="text-blue-500 font-semibold pt-3" to="/login">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
