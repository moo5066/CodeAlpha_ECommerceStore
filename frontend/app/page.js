"use client";
import { useEffect, useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadedKey, setLoadedKey] = useState("");
  const [error, setError] = useState("");
  const categories = ["All", "Electronics", "Clothing", "Books", "Home"];

  useEffect(() => {
    let active = true;
    const requestKey = `${category}:${page}`;
    const params = new URLSearchParams({ category: category === "All" ? "" : category, page: String(page), limit: "8" });
    api(`/products?${params}`)
      .then((data) => {
        if (!active) return;
        setProducts(data.products || []);
        setTotalPages(Math.max(1, data.totalPages || 1));
        setError("");
        setLoadedKey(requestKey);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
        setLoadedKey(requestKey);
      });
    return () => { active = false; };
  }, [category, page]);

  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);
  const loading = loadedKey !== `${category}:${page}`;

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="eyebrow">CodeAlpha Ecommerce</p>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Shop our products</h1>
        <p className="max-w-xl text-zinc-500">Simple, useful things for every part of your day.</p>
      </section>
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="text-xl font-semibold">Browse all products</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => <button key={item} onClick={() => { setCategory(item); setPage(1); }} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${category === item ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-950"}`}>{item}</button>)}
        </div>
        {loading && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 8 }, (_, index) => <div key={index} className="h-72 animate-pulse rounded-2xl bg-zinc-200" />)}</div>}
        {error && <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!loading && !error && products.length === 0 && <p className="rounded-2xl border border-dashed p-10 text-center text-zinc-500">No products found in this category.</p>}
        {!loading && !error && products.length > 0 && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product._id} product={product} />)}</div>}
        {!loading && !error && totalPages > 1 && <nav className="flex justify-center gap-2 pt-2" aria-label="Product pages">{pageNumbers.map((number) => <button key={number} onClick={() => setPage(number)} className={`h-10 min-w-10 rounded-lg border px-3 text-sm font-semibold ${page === number ? "border-zinc-950 bg-zinc-950 text-white" : "border-zinc-200 bg-white hover:border-zinc-950"}`}>{number}</button>)}</nav>}
      </section>
    </div>
  );
}
