"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function OrdersPage() {
  const { user, loading } = useRequireAuth();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    api("/orders", { token })
      .then((data) => setOrders(data.orders))
      .catch((err) => setError(err.message))
      .finally(() => setFetching(false));
  }, [token]);

  if (loading || !user) return <p>Loading...</p>;
  if (fetching) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  if (orders.length === 0) {
    return <p>You have no orders yet.</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Orders</h1>
      <ul className="divide-y rounded-lg border bg-white">
        {orders.map((order) => (
          <li key={order._id} className="flex items-center justify-between p-4">
            <div>
              <Link href={`/orders/${order._id}`} className="font-medium underline">
                Order #{order._id.slice(-6)}
              </Link>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold">${order.total.toFixed(2)}</p>
              <p className="text-sm capitalize text-gray-500">{order.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}