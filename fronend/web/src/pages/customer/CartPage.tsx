import { useState } from "react";
import { useCartStore } from "../../store/cartStore";
import { createOrder } from "../../services/orderService";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../store/authStore";

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

      // 1. Create order
      const orderResponse = await createOrder(payload, token);

      if (!orderResponse?.id) throw new Error("Order creation failed");

      // 2. Clear backend cart (using your specific endpoint)
      await fetch("http://172.24.111.254:5003/cart/clear", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // 3. Update local state
      clearCart();
      navigate("/orders");
    } catch (err: any) {
      alert(err?.message || "Something went wrong during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center">
        <div className="text-6xl mb-6">🛒</div>
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-8">Add some delicious meals to get started!</p>
        <Link to="/" className="bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all">
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.food.id} className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4 items-center">
                {/* <img 
                  src={item.food.image} 
                  alt={item.food.name} 
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl"
                /> */}
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-900 md:text-lg">{item.food.name}</h3>
                    <button 
                      onClick={() => removeCart(item.food.id, token!)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button 
                        onClick={() => decrementFromCart(item.food.id, token!)}
                        className="px-3 py-1 hover:bg-gray-100 text-gray-600 font-bold"
                      >
                        −
                      </button>
                      <span className="px-3 font-bold text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => addToCart(item.food.id, token!)}
                        className="px-3 py-1 hover:bg-gray-100 text-orange-600 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-gray-900">${(item.food.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-3 pb-6 border-b border-gray-100">
                <div className="flex justify-between text-gray-500">
                  <span>Subtotal</span>
                  <span>${totalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Delivery Fee</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between py-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-orange-600">${totalPrice().toFixed(2)}</span>
              </div>

              <button
                disabled={isProcessing}
                onClick={handleCheckout}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                  ${isProcessing 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-orange-600 hover:bg-orange-700 shadow-orange-200 active:scale-[0.98]"}
                `}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Place Order"
                )}
              </button>
              
              <p className="text-center text-xs text-gray-400 mt-4 px-4">
                By placing an order, you agree to our terms of service and delivery conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}