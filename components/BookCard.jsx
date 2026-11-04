import Link from "next/link";

export default function BookCard({ book }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <img src={book.image} alt={book.title} className="h-64 w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 text-xl font-bold">{book.title}</h3>
        <p className="mt-1 text-sm opacity-80">by {book.author}</p>
        <span className="badge badge-primary badge-outline mt-3">{book.category}</span>
        <div className="mt-auto pt-4">
          <Link href={`/books/${book._id}`} className="btn btn-primary w-full">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}