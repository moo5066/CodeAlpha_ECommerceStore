"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function AdminProductsPage() {
  const { isAdmin, loading } = useRequireAdmin();
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    api("/products?limit=50")
      .then((data) => setProducts(data.products))
      .catch((err) => setError(err.message));
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      await api(`/products/${id}`, { method: "DELETE", token });
      setProducts((list) => list.filter((p) => p._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading || !isAdmin) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          aria-label="Add product"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-2xl text-white"
        >
          +
        </Link>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <ul className="divide-y rounded-lg border bg-white">
        {products.map((p) => (
          <li key={p._id} className="flex items-center gap-4 p-4">
            <img src={p.image} alt={p.name} className="h-14 w-14 rounded object-cover" />
            <div className="flex-1">
              <p className="font-medium">{p.name}</p>
              <p className="text-sm text-gray-500">
                {p.category} · ${p.price.toFixed(2)} · {p.stock} in stock
              </p>
            </div>
            <Link href={`/admin/products/${p._id}/edit`} className="text-sm underline">
              Edit
            </Link>
            <button onClick={() => handleDelete(p._id)} className="text-sm text-red-600">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}