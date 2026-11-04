"use client";
import { useEffect, useState } from "react";
import BookCard from "@/components/BookCard";
import Spinner from "@/components/Spinner";
import { apiFetch } from "@/lib/api";

export default function AllBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.title = "BookNook | All Books";
    apiFetch("/books")
      .then(setBooks)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">All Books</h1>
      {error && <p className="text-center text-error">{error}</p>}
      {!error && books.length === 0 && (
        <p className="text-center opacity-80">No books have been added yet.</p>
      )}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
}