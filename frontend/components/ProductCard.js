import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product._id}`}
      className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-200/60"
    >
      <img
        src={product.image}
        alt={product.name}
        className="mb-4 aspect-[4/3] w-full rounded-xl bg-zinc-100 object-cover transition duration-500 group-hover:scale-[1.02]"
      />
      <div className="px-1 pb-1">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug group-hover:text-indigo-600">{product.name}</h3>
          <p className="shrink-0 font-bold">${Number(product.price).toFixed(2)}</p>
        </div>
        <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">{product.category}</p>
      </div>
    </Link>
  );
}
