import Link from "next/link";

export default function BookCard({ book }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex h-80 items-center justify-center bg-gradient-to-b from-base-200 to-base-300 p-6">
        <img
          src={book.image}
          alt={book.title}
          className="h-full w-auto max-w-full rounded-md object-contain shadow-xl transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="badge badge-secondary badge-outline">{book.category}</span>
        <h3 className="mt-3 line-clamp-1 text-xl font-bold">{book.title}</h3>
        <p className="mt-1 text-sm opacity-70">by {book.author}</p>
        <div className="mt-auto pt-5">
          <Link href={`/books/${book._id}`} className="btn btn-primary w-full">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}