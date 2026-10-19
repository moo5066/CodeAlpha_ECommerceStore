"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold">
          CodeAlpha Ecommerce
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href="/cart">Cart ({count})</Link>
          {user ? (
            <>
              <Link href="/orders">Orders</Link>
              <button onClick={logout} className="text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}