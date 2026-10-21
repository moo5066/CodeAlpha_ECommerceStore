"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-zinc-950 text-sm text-white">C</span>
          <span className="hidden sm:inline">CodeAlpha Ecommerce</span>
        </Link>
        <div className="flex items-center gap-2 text-sm font-semibold sm:gap-5">
          <Link href="/" className="hidden text-zinc-500 hover:text-zinc-950 sm:inline">Shop</Link>
          <Link href="/cart" className="rounded-full px-3 py-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950">Cart <span className="text-zinc-950">({count})</span></Link>
          {user ? (
            <>
              <Link href="/orders" className="hidden text-zinc-500 hover:text-zinc-950 sm:inline">Orders</Link>
              <button onClick={logout} className="rounded-full border border-zinc-200 px-3 py-2 text-zinc-600 hover:border-zinc-950 hover:text-zinc-950">Log out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden text-zinc-500 hover:text-zinc-950 sm:inline">Log in</Link>
              <Link href="/register" className="rounded-full bg-zinc-950 px-4 py-2 text-white hover:bg-zinc-700">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
