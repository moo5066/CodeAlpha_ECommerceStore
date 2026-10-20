"use client";
import { useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { user, loading } = useRequireAuth();
  const { items, total, updateItem, removeItem } = useCart();
  const [error, setError] = useState("");

  if (loading || !user) return <div className="py-16 text-center text-zinc-500">Loading your cart...</div>;

  const run = async (fn) => {
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-indigo-50 text-2xl">🛍</div>
        <h1 className="text-2xl font-bold">Your cart is waiting</h1><p className="mt-2 text-zinc-500">Add something you love and it will show up here.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div><p className="eyebrow">Ready when you are</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Your cart</h1></div>
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white shadow-sm">
        {items.map(({ product, quantity }) => (
          <li key={product._id} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap sm:p-5">
            <img src={product.image} alt={product.name} className="h-20 w-20 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
            </div>
            <input aria-label={`Quantity for ${product.name}`}
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => {
                const next = Math.min(Math.max(1, Number(e.target.value) || 1), product.stock);
                run(() => updateItem(product._id, next));
              }}
              className="field w-20 py-2"
            />
            <p className="w-24 text-right font-semibold">
              ${(product.price * quantity).toFixed(2)}
            </p>
            <button
              onClick={() => run(() => removeItem(product._id))}
              className="text-sm font-semibold text-zinc-400 hover:text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl bg-zinc-950 p-5 text-white sm:flex-row sm:items-center">
        <p className="text-lg font-bold">Total <span className="ml-2 text-indigo-300">${total.toFixed(2)}</span></p>
        <Link href="/checkout" className="rounded-full bg-white px-5 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-indigo-100">
          Checkout
        </Link>
      </div>
    </div>
  );
}
