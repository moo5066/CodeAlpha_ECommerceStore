"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      router.push("/");
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="eyebrow">Welcome back</p><h1 className="mt-2 text-3xl font-bold">Log in</h1><p className="mt-2 text-sm text-zinc-500">Pick up where you left off.</p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="sr-only" htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="field w-full"
        />
        <label className="sr-only" htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          placeholder="Password"
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
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-sm text-zinc-500">
        No account? <Link href="/register" className="underline">Register</Link>
      </p>
    </div>
  );
}
