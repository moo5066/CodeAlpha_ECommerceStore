import Link from "next/link";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/products/${product._id}`}
      className="group rounded-lg border bg-white p-4 transition hover:shadow-md"
    >
      <img
        src={product.image}
        alt={product.name}
        className="mb-3 h-48 w-full rounded object-cover"
      />
      <h3 className="font-semibold group-hover:underline">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
    </Link>
  );
}