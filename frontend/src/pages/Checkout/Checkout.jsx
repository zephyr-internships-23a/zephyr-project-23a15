
import { useEffect, useState } from "react";
import {
    PaymentElement,
    LinkAuthenticationElement, 
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
export default function Checkout({amount}) { 
    const stripe = useStripe();
    const elements = useElements();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false); 
    console.log(email)
    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }
    }, [stripe]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            redirect: "always",
            confirmParams: {
                return_url: "http://localhost:5173/payment-success",
            },
        });

        // This point will only be reached if there is an immediate error when
        // confirming the payment. Otherwise, your customer will be redirected to
        // your `return_url`. For some payment methods like iDEAL, your customer will
        // be redirected to an intermediate site first to authorize the payment, then
        // redirected to the `return_url`.
        console.log(error);
        if (error?.type === "card_error" || error?.type === "validation_error") {
            setMessage(error.message);
        } else {
            setMessage("An unexpected error occurred.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "tabs",
    };

    return (
        <div className="flex  justify-center items-center h-screen text-gray-400">
            <form
                id="payment-form"
                className="sm:w-[40%] w-full"
                onSubmit={handleSubmit}
            >
                <LinkAuthenticationElement
                    id="link-authentication-element"
                    onChange={(e) => setEmail(e.value.email)}
                />
                <PaymentElement id="payment-element" options={paymentElementOptions} />
                <button
                    className="bg-slate-900 mt-5 px-7 py-2 rounded-md text-slate-400 font-semibold"
                    disabled={isLoading || !stripe || !elements}
                    id="submit"
                >
                    <span id="button-text" className="btn btn-success">
                        {isLoading ? (
                            <div className="spinner" id="spinner"></div>
                        ) : (
                            `Pay ₹${amount}`
                        )}
                    </span>
                </button>
                {/* Show any error or success messages */}
                {message && <div id="payment-message">{message}</div>}
            </form>
        </div>
    );
}
