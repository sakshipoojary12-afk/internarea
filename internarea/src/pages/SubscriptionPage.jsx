import axios from "axios";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const plans = [
  { name: "subscription.free", price: 0, key: "FREE" },
  { name: "subscription.bronze", price: 100, key: "BRONZE" },
  { name: "subscription.silver", price: 300, key: "SILVER" },
  { name: "subscription.gold", price: 1000, key: "GOLD" },
];

export default function SubscriptionPage() {
  const { t } = useTranslation();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("Razorpay script loaded");
    };

    script.onerror = () => {
      console.log("Razorpay script failed to load");
    };

    document.body.appendChild(script);
  }, []);

  const handlePayment = async (plan) => {
    if (plan.price === 0) {
      alert(t("subscription.freeActivated"));
      return;
    }

    try {
      const { data: order } = await axios.post(
        "https://internarea-xyno.onrender.com/api/payment/create-order",
        {
          amount: plan.price,
        }
      );

      const options = {
        key: "rzp_test_T523Li4flKnPpB",
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,

        handler: async function (response) {
          const verifyRes = await axios.post(
            "https://internarea-xyno.onrender.com//api/payment/verify",
            response
          );

          console.log("Verify response:", verifyRes.data);
          alert(t("subscription.paymentSuccess"));
        },
      };

      // ✅ safety check
      if (!window.Razorpay) {
        alert(t("subscription.razorpayFailed"));
        return;
      }

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      alert(t("subscription.paymentFailed"));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>{t("subscription.choosePlan")}</h2>

      {plans.map((plan) => (
        <div key={plan.key} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{t(plan.name)}</h3>
          <p>₹{plan.price}</p>

          <button onClick={() => handlePayment(plan)}>
            {plan.price === 0
  ? t("subscription.activateFree")
  : t("subscription.buyNow")}
          </button>
        </div>
      ))}
    </div>
  );
}