import { Link } from "react-router-dom";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600">
          Payment Cancelled
        </h1>

        <p className="mt-3 text-gray-600">
          Your payment was cancelled. You can try again.
        </p>

        <Link
          to="/cart"
          className="mt-6 inline-block bg-black text-white px-6 py-3 rounded-lg"
        >
          Back to Cart
        </Link>
      </div>
    </div>
  );
}