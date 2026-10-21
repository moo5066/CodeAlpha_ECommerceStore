"use client";
import { useRequireAdmin } from "@/hooks/useRequireAdmin";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  const { isAdmin, loading } = useRequireAdmin();
  const { token } = useAuth();

  if (loading || !isAdmin) return <p>Loading...</p>;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">New product</h1>
      <ProductForm
        submitLabel="Create product"
        onSubmit={(data) => api("/products", { method: "POST", token, body: data })}
      />
    </div>
  );
}