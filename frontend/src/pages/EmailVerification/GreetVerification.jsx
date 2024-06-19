import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
const TIMER_TIME = 40;
const BASE_URI = import.meta.env.VITE_APP_BASE_API;
export default function GreetVerification() {
  const [loading, setLoading] = useState(false);
  const [isActiveResendBtn, setIsActiveResendBtn] = useState(false);
  let [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  useEffect(() => {
    async function sendVerification() {
      if (!email) {
        return toast.error("No email found!");
      }
      try {
        setLoading(true);
        const response = await axios.post(`${BASE_URI}/sendverification`, {
          email: email,
        });
        if (response.status == 200) {
          toast.success(response.data.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error?.data?.message);
      } finally {
        setLoading(false);
      }
    }
    if (!isActiveResendBtn) {
      sendVerification();
    }
  }, [isActiveResendBtn]);

  return loading ? (
    <section className="grid-bg">
      <main className="container  min-h-screen flex justify-center items-center flex-col">
        <div className="border p-4 rounded-md shadow bg-white">
          <h1 className="self-start font-semibold text-3xl">
            Hey, we are trying to send the verification email!
          </h1>
          <div className="mt-4">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      </main>
    </section>
  ) : (
    <ShowGreetMessage
      isActiveResendBtn={isActiveResendBtn}
      setIsActiveResendBtn={setIsActiveResendBtn}
    />
  );
}

function ShowGreetMessage({ isActiveResendBtn, setIsActiveResendBtn }) {
  const [prevInterval, setPrevInterval] = useState(null);
  const [timer, setTimer] = useState(TIMER_TIME);
  useEffect(() => {
    if (!isActiveResendBtn) {
      setPrevInterval(
        setInterval(() => {
          setTimer((time) => {
            if (time - 1 == 0) {
              setIsActiveResendBtn(true);
            }
            return time - 1;
          });
        }, 1000)
      );
    } else {
      clearInterval(prevInterval);
      setTimer(TIMER_TIME);
    }
  }, [isActiveResendBtn]);
  async function handleResend() {
    setIsActiveResendBtn(!isActiveResendBtn);
  }
  return (
    <section className="grid-bg">
      <main className="container  min-h-screen flex justify-center items-center flex-col">
        <div className="border p-4 rounded-md shadow bg-white">
          <h1 className="self-start font-semibold text-3xl">
            Hi there, welcome
          </h1>
          <p className="mt-3">
            We&apos;ve sent you a verification link to your email address.
            Please verify the email address in order to login using your email.
          </p>
          <p className="mt-5 space-x-3 ">
            <span>Go to login</span>
            <Link to={"/login"}>
              <Button>Login</Button>
            </Link>
          </p>
          <p className="mt-5 space-x-3">
            <span>Resend verification link</span>
            {isActiveResendBtn ? (
              <Button
                onClick={handleResend}
                className="bg-emerald-400 hover:bg-emerald-700"
              >
                Resend
              </Button>
            ) : (
              <Button disabled className="bg-emerald-400 hover:bg-emerald-700">
                {timer}
              </Button>
            )}
          </p>
        </div>
      </main>
    </section>
  );
}
