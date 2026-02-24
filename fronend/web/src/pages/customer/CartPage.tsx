import { useCartStore } from "../../store/cartStore";
import { createOrder } from "../../services/orderService";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";

export default function CartPage() {
  const { token } = useAuth();
  const {
    items,
    removeCart,
    decrementFromCart,
    addToCart,
    clearCart,
    totalPrice,
  } = useCartStore();

  const navigate = useNavigate();

 async function handleCheckout() {
  if (!token) {
    alert("You must be logged in");
    return;
  }

  if (items.length === 0) {
    alert("Your cart is empty");
    return;
  }

  try {
    const payload = {
      items: items.map((item) => ({
        foodId: item.foodId,
        quantity: item.quantity,
      })),
    };

    // 1️⃣ Create order
    const orderResponse = await createOrder(payload, token);

    if (!orderResponse || !orderResponse.id) {
      throw new Error("Failed to create order");
    }

    // 2️⃣ Clear cart in backend ONLY if order succeeded
    const clearRes = await fetch("http://172.24.111.254:5003/cart/clear", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!clearRes.ok) {
      console.warn("Order created but failed to clear cart in backend");
    }

    // 3️⃣ Clear cart locally
    clearCart();

    navigate("/orders");
  } catch (err: any) {
    console.error(err);
    alert(err?.message || "Order failed");
  }
}
  if (items.length === 0)
    return <p className="p-4">Your cart is empty.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      {items.map((item) => (
        <div
          key={item.food.id}
          className="flex justify-between border-b py-3"
        >
          <div>
            {item.food.name} x {item.quantity}
          </div>

          <div>
            ${(item.food.price * item.quantity).toFixed(2)}

            <button
              onClick={() =>
                decrementFromCart(item.food.id, token!)
              }
              className="ml-3 text-gray-500"
            >
              −
            </button>

            <button
              onClick={() =>
                addToCart(item.food.id, token!)
              }
              className="ml-2 text-green-600"
            >
              +
            </button>

            <button
              onClick={() =>
                removeCart(item.food.id, token!)
              }
              className="ml-4 text-red-500"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="mt-6 text-right font-bold">
        Total: ${totalPrice().toFixed(2)}
      </div>

      <button
        onClick={handleCheckout}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg"
      >
        Place Order
      </button>
    </div>
  );
}