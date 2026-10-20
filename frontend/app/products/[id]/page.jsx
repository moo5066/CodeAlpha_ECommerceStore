"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
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

  if (error && !product) return <p className="text-red-600">{error}</p>;
  if (!product) return <p>Loading...</p>;

  const outOfStock = product.stock === 0;

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <img src={product.image} alt={product.name} className="w-full rounded-lg object-cover" />

      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
        <p className="text-gray-700">{product.description}</p>
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
              className="w-20 rounded border px-2 py-2"
            />
            <button onClick={handleAdd} className="rounded bg-black px-6 py-2 text-white">
              Add to cart
            </button>
          </div>
        )}

        {message && <p className="text-green-700">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
      </div>
    </div>
  );
}