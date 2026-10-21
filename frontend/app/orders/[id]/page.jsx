"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

function OrderDetailPageContent() {
  const { id } = useParams(); const { user, loading } = useRequireAuth(); const { token } = useAuth();
  const [order, setOrder] = useState(null); const [error, setError] = useState("");
  useEffect(() => { if (!token) return; api(`/orders/${id}`, { token }).then((data) => setOrder(data.order)).catch((err) => setError(err.message)); }, [id, token]);
  if (error) return <p className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>;
  if (loading || !user || !order) return <div className="py-16 text-center text-zinc-500">Loading order...</div>;
  return <div className="mx-auto max-w-2xl space-y-6"><div className="flex items-center justify-between"><div><p className="eyebrow">Order details</p><h1 className="mt-2 text-3xl font-bold">#{order._id.slice(-6)}</h1></div><span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold capitalize text-zinc-700">{order.status}</span></div><p className="text-sm text-zinc-500">Placed {new Date(order.createdAt).toLocaleString()}</p><ul className="divide-y divide-zinc-100 rounded-2xl border border-zinc-200 bg-white shadow-sm">{order.items.map((item, index) => <li key={`${item.product}-${index}`} className="flex justify-between p-5 text-sm"><span>{item.name} × {item.quantity}</span><span className="font-semibold">${(Number(item.price) * item.quantity).toFixed(2)}</span></li>)}</ul><div className="flex justify-between rounded-2xl bg-zinc-950 p-5 text-lg font-bold text-white"><span>Total</span><span>${Number(order.total).toFixed(2)}</span></div><Link href="/orders" className="inline-block text-sm font-semibold underline">← Back to orders</Link></div>;
}

export default function OrderDetailPage() {
  return <Suspense fallback={<div className="py-16 text-center text-zinc-500">Loading order...</div>}><OrderDetailPageContent /></Suspense>;
}
