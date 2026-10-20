"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user, loading } = useRequireAuth();
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    api(`/orders/${id}`, { token })
      .then((data) => setOrder(data.order))
      .catch((err) => setError(err.message));
  }, [id, token]);

  if (loading || !user) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!order) return <p>Loading...</p>;

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Order #{order._id.slice(-6)}</h1>
        <span className="rounded-full bg-gray-200 px-3 py-1 text-sm capitalize">
          {order.status}
        </span>
      </div>
      <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>

      <ul className="divide-y rounded-lg border bg-white">
        {order.items.map((item) => (
          <li key={item.product} className="flex justify-between p-4 text-sm">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>${order.total.toFixed(2)}</span>
      </div>

      <Link href="/orders" className="text-sm underline">
        Back to orders
      </Link>
    </div>
  );
}