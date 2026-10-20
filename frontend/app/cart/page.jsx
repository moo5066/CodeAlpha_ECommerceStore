"use client";
import { useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { user, loading } = useRequireAuth();
  const { items, total, updateItem, removeItem } = useCart();
  const [error, setError] = useState("");

  if (loading || !user) return <p>Loading...</p>;

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
      <div className="space-y-4 text-center">
        <p>Your cart is empty.</p>
        <Link href="/" className="underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {error && <p className="text-red-600">{error}</p>}

      <ul className="divide-y rounded-lg border bg-white">
        {items.map(({ product, quantity }) => (
          <li key={product._id} className="flex items-center gap-4 p-4">
            <img src={product.image} alt={product.name} className="h-16 w-16 rounded object-cover" />
            <div className="flex-1">
              <p className="font-medium">{product.name}</p>
              <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
            </div>
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) => {
                const next = Math.min(Math.max(1, Number(e.target.value) || 1), product.stock);
                run(() => updateItem(product._id, next));
              }}
              className="w-20 rounded border px-2 py-1"
            />
            <p className="w-24 text-right font-semibold">
              ${(product.price * quantity).toFixed(2)}
            </p>
            <button
              onClick={() => run(() => removeItem(product._id))}
              className="text-sm text-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
        <Link href="/checkout" className="rounded bg-black px-5 py-2 text-white">
          Checkout
        </Link>
      </div>
    </div>
  );
}