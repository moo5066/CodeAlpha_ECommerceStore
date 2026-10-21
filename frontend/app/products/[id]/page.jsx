"use client";
import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

function ProductPageContent() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api(`/products/${id}`)
      .then((data) => setProduct(data.product))
      .catch((err) => setError(err.message));
  }, [id]);

  const handleAdd = async () => {
    setError("");
    setMessage("");
    if (!token) {
      router.push("/login");
      return;
    }
    try {
      await addItem(product._id, quantity);
      setMessage("Added to cart");
    } catch (err) {
      setError(err.message);
    }
  };

  if (error && !product) return <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>;
  if (!product) return <div className="py-16 text-center text-zinc-500">Loading product...</div>;

  const outOfStock = product.stock === 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      <div className="overflow-hidden rounded-3xl bg-white p-2 shadow-sm"><img src={product.image} alt={product.name} className="aspect-square w-full rounded-2xl object-cover" /></div>

      <div className="space-y-5 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
        <p className="eyebrow">{product.category}</p><h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
        <p className="text-2xl font-bold">${Number(product.price).toFixed(2)}</p><div className="h-px bg-zinc-100" />
        <p className="leading-7 text-zinc-600">{product.description}</p>
        <p className="text-sm">
          {outOfStock ? (
            <span className="text-red-600">Out of stock</span>
          ) : (
            <span className="text-green-700">{product.stock} in stock</span>
          )}
        </p>

        {!outOfStock && (
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={product.stock}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(Math.max(1, Number(e.target.value) || 1), product.stock))
              }
              className="field w-20 py-2"
            />
            <button onClick={handleAdd} className="primary-button flex-1">
              Add to cart
            </button>
          </div>
        )}

        {message && <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{message}</p>}
        {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      </div>
    </div>
  );
}

export default function ProductPage() {
  return <Suspense fallback={<div className="py-16 text-center text-zinc-500">Loading product...</div>}><ProductPageContent /></Suspense>;
}
