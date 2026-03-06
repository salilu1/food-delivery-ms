import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const txRef = params.get("tx_ref");

    if (!txRef) return;

    fetch(`http://localhost:4004/payments/verify/${txRef}`)
      .then((r) => r.json())
      .then(() => {
        setTimeout(() => navigate("/orders"), 2000);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600">
        Payment Successful 🎉
      </h1>
      <p className="mt-4 text-gray-600">Verifying your payment...</p>
    </div>
  );
}