import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { createOrder } from "../../services/orderService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/authStore";
import { initializePayment } from "../../services/PaymentService";

export default function CartPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    items,
    removeCart,
    decrementFromCart,
    addToCart,
    clearCart,
    totalPrice,
  } = useCartStore();

  console.log("Items", items);

  const handleCheckout = async () => {
    if (!token) {
      alert("Please log in to complete your order.");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        items: items.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
        })),
      };

      const order = await createOrder(payload, token);

      if (!order?.id) throw new Error("Order creation failed");

      const payment = await initializePayment(order.id, token);

      if (!payment?.checkout_url) {
        throw new Error("Payment initialization failed");
      }

      await fetch("http://172.24.111.254:5003/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      clearCart();

      window.location.href = payment.checkout_url;
    } catch (err: any) {
      alert(err?.message || "Checkout failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-8xl mb-4 animate-bounce">🛒</div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
            Your cart is empty
          </h2>
          <p className="text-lg text-gray-600">
            Looks like you haven't added any delicious meals yet!
          </p>
          <Link
            to="/"
            className="inline-block bg-orange-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg shadow-orange-200/50 hover:bg-orange-700 hover:shadow-orange-300/60 transition-all duration-300 active:scale-95"
          >
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 md:mb-10 tracking-tight">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10">
          {/* Items */}
          <div className="lg:col-span-8 space-y-5 md:space-y-6">
            {items.map((item) => (
              <div
                key={item.food.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-md transition-shadow duration-300 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-5 md:p-6">
                  {/* Image – uncomment when available */}
                  <div className="w-full sm:w-28 md:w-32 flex-shrink-0 aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-amber-50">
                    {item.food.imageUrl ? (
                      <img
                        src={item.food.imageUrl}
                        alt={item.food.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-orange-400/40 text-4xl">
                        🍔
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-4">
                    <div className="flex justify-between items-start gap-4">
                      <h3 className="font-semibold text-lg md:text-xl text-gray-900 line-clamp-2">
                        {item.food.name}
                      </h3>

                      <button
                        onClick={() => removeCart(item.food.id, token!)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                        aria-label="Remove item"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-white shadow-sm">
                        <button
                          onClick={() => decrementFromCart(item.food.id, token!)}
                          disabled={item.quantity <= 1}
                          className="px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          −
                        </button>
                        <span className="px-5 py-2.5 font-semibold text-gray-900 min-w-[3rem] text-center border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item.food.id, token!)}
                          className="px-4 py-2.5 text-orange-600 font-medium hover:bg-orange-50 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-xl font-bold text-gray-900 whitespace-nowrap">
                        ${(item.food.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100/80 p-6 md:p-8 sticky top-6 lg:top-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium">${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-semibold">Free</span>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl font-semibold text-gray-900">Total</span>
                    <span className="text-3xl font-extrabold text-orange-600">
                      ${totalPrice().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleCheckout}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3
                  ${
                    isProcessing
                      ? "bg-gray-400 cursor-not-allowed text-white"
                      : "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200/60 hover:shadow-orange-300/70 active:scale-[0.98]"
                  }
                `}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order →"
                )}
              </button>

              <p className="text-center text-sm text-gray-500 leading-relaxed">
                By placing this order, you agree to our{" "}
                <Link to="/terms" className="text-orange-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and delivery policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}