"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      router.push("/");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="eyebrow">Start your collection</p><h1 className="mt-2 text-3xl font-bold">Create an account</h1><p className="mt-2 text-sm text-zinc-500">Save your cart and keep track of every order.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="sr-only" htmlFor="register-name">Full name</label>
        <input
          id="register-name"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          required
          className="field w-full"
        />
        <label className="sr-only" htmlFor="register-email">Email address</label>
        <input
          id="register-email"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="field w-full"
        />
        <label className="sr-only" htmlFor="register-password">Password</label>
        <input
          id="register-password"
          name="password"
          type="password"
          placeholder="Password (min 6 characters)"
          value={form.password}
          onChange={handleChange}
          required
          className="field w-full"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="primary-button w-full disabled:opacity-50"
        >
          {submitting ? "Creating account..." : "Register"}
        </button>
      </form>
      <p className="mt-6 text-sm text-zinc-500">
        Already registered? <Link href="/login" className="underline">Login</Link>
      </p>
    </div>
  );
}
