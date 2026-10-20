"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/products").then((data) => setProducts(data.products || [])).catch((err) => setError(err.message)).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ["All", ...new Set(products.map((product) => product.category).filter(Boolean))], [products]);
  const filtered = products.filter((product) => (category === "All" || product.category === category) && product.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden rounded-[2rem] bg-zinc-950 px-6 py-14 text-white sm:px-12 sm:py-20">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-indigo-600/50 blur-3xl" />
        <div className="relative max-w-2xl">
          <p className="eyebrow mb-4 text-indigo-300">The everyday edit</p>
          <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-6xl">Good things, picked for your life.</h1>
          <p className="mt-5 max-w-lg text-base leading-7 text-zinc-300 sm:text-lg">A considered collection of essentials, made easy to discover and even easier to bring home.</p>
          <Link href="#collection" className="mt-8 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-zinc-950 hover:bg-indigo-100">Explore the collection <span className="ml-2">↓</span></Link>
        </div>
      </section>

      <section id="collection" className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="eyebrow">Shop the edit</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Fresh finds</h2></div>
          <input aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products..." className="field w-full sm:w-64" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${category === item ? "bg-zinc-950 text-white" : "bg-white text-zinc-500 hover:bg-zinc-100"}`}>{item}</button>)}
        </div>
        {loading && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"><div className="h-72 animate-pulse rounded-2xl bg-zinc-200" /><div className="h-72 animate-pulse rounded-2xl bg-zinc-200" /><div className="h-72 animate-pulse rounded-2xl bg-zinc-200" /></div>}
        {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!loading && !error && filtered.length === 0 && <p className="rounded-2xl border border-dashed p-10 text-center text-zinc-500">No products match that search yet.</p>}
        {!loading && <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{filtered.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
      </section>
    </div>
  );
}
