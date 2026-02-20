import { useCartStore } from "../../store/cartStore";
import { createOrder } from "../../services/orderService";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalPrice } =
    useCartStore();
  const navigate = useNavigate();

  async function handleCheckout() {
    try {
      const payload = {
        items: items.map((item) => ({
          foodId: item.food.id,
          quantity: item.quantity,
        })),
      };

      await createOrder(payload);
      clearCart();
      navigate("/customer/orders");
    } catch (err: any) {
      alert(err?.response?.data?.error || "Order failed");
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
              onClick={() => removeFromCart(item.food.id)}
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