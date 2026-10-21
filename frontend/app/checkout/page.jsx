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

  if (loading || !user) return <div className="py-16 text-center text-zinc-500">Loading checkout...</div>;

  if (items.length === 0 && !placing) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center"><p>Your cart is empty.</p><Link href="/" className="underline">
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
    <div className="mx-auto max-w-2xl space-y-6">
      <div><p className="eyebrow">Almost there</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Review your order</h1><p className="mt-2 text-zinc-500">Everything look right? Place your order when you&apos;re ready.</p></div>

      <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {items.map(({ product, quantity }) => (
          <li key={product._id} className="flex justify-between p-4 text-sm">
            <span>
              {product.name} × {quantity}
            </span>
            <span>${(Number(product.price) * quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between rounded-2xl bg-zinc-100 p-5 text-lg font-bold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>

      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="primary-button w-full disabled:opacity-50"
      >
        {placing ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
}
