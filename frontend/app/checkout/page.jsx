"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const { user, loading } = useRequireAuth();
  const { token } = useAuth();
  const { items, total, refresh } = useCart();
  const router = useRouter();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  if (loading || !user) return <p>Loading...</p>;

  if (items.length === 0 && !placing) {
    return (
      <div className="space-y-4 text-center">
        <p>Your cart is empty.</p>
        <Link href="/" className="underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setError("");
    setPlacing(true);
    try {
      const data = await api("/orders", { method: "POST", token });
      router.push(`/orders/${data.order._id}`);
      await refresh();
    } catch (err) {
      setError(err.message);
      setPlacing(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      <ul className="divide-y rounded-lg border bg-white">
        {items.map(({ product, quantity }) => (
          <li key={product._id} className="flex justify-between p-4 text-sm">
            <span>
              {product.name} × {quantity}
            </span>
            <span>${(product.price * quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="w-full rounded bg-black py-3 text-white disabled:opacity-50"
      >
        {placing ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
}