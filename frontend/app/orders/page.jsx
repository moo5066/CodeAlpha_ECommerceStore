"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function OrdersPage() {
  const { user, loading } = useRequireAuth(); const { token } = useAuth();
  const [orders, setOrders] = useState([]); const [fetching, setFetching] = useState(true); const [error, setError] = useState("");
  useEffect(() => { if (!token) return; api("/orders", { token }).then((data) => setOrders(data.orders)).catch((err) => setError(err.message)).finally(() => setFetching(false)); }, [token]);
  if (loading || !user || fetching) return <div className="py-16 text-center text-zinc-500">Loading your orders...</div>;
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>;
  if (!orders.length) return <div className="mx-auto max-w-lg rounded-3xl border border-dashed p-12 text-center"><h1 className="text-2xl font-bold">No orders yet</h1><p className="mt-2 text-zinc-500">Your next great find is waiting.</p><Link href="/" className="mt-6 inline-block rounded-full bg-zinc-950 px-5 py-3 text-sm font-bold text-white">Start shopping</Link></div>;
  return <div className="space-y-6"><div><p className="eyebrow">Your account</p><h1 className="mt-2 text-3xl font-bold tracking-tight">Your orders</h1></div><ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white shadow-sm">{orders.map((order) => <li key={order._id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"><div><Link href={`/orders/${order._id}`} className="font-semibold hover:underline">Order #{order._id.slice(-6)}</Link><p className="mt-1 text-sm text-zinc-500">{new Date(order.createdAt).toLocaleDateString()}</p></div><div className="flex items-center justify-between gap-6 sm:text-right"><div><p className="font-bold">${Number(order.total).toFixed(2)}</p><p className="text-sm capitalize text-zinc-500">{order.status}</p></div><Link href={`/orders/${order._id}`} className="text-sm font-semibold underline">View →</Link></div></li>)}</ul></div>;
}
