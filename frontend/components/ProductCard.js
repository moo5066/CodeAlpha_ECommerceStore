"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = ["Electronics", "Clothing", "Books", "Home"];

export default function ProductForm({ initial, submitLabel, onSubmit }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    description: initial?.description ?? "",
    price: initial?.price ?? "",
    stock: initial?.stock ?? "",
    category: initial?.category ?? CATEGORIES[0],
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial?.image ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!initial && !file) {
      setError("Add a product image");
      return;
    }

    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (file) data.append("image", file);

    setSubmitting(true);
    try {
      await onSubmit(data);
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  const inputClass = "w-full rounded border px-3 py-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-sm font-medium">Product image</span>
        <div className="flex h-56 w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed bg-white hover:border-black">
          {preview ? (
            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-5xl text-gray-400">+</span>
          )}
        </div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFile}
          className="hidden"
        />
      </label>

      <input
        name="name"
        placeholder="Product name"
        value={form.name}
        onChange={handleChange}
        required
        className={inputClass}
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        required
        rows={4}
        className={inputClass}
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className={inputClass}
        />
        <input
          name="stock"
          type="number"
          min="0"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>
      <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
        {CATEGORIES.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
      >
        {submitting ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}