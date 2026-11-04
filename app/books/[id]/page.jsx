"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import Spinner from "@/components/Spinner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";

function BookDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch(`/books/${id}`, { auth: true })
      .then((data) => {
        setBook(data);
        document.title = `BookNook | ${data.title}`;
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBorrow = async () => {
    setSubmitting(true);
    try {
      await apiFetch("/borrows", {
        method: "POST",
        auth: true,
        body: JSON.stringify({ bookId: book._id }),
      });
      toast.success("Book borrowed successfully!");
      setBook({ ...book, copies: book.copies - 1 });
      setOpen(false);
      router.push("/my-borrows");
    } catch (err) {
      toast.error(err.message);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner />;
  if (!book) {
    return <p className="py-20 text-center">This book could not be found.</p>;
  }

  const available = book.copies > 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="grid gap-8 overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg md:grid-cols-2">
        <img src={book.image} alt={book.title} className="h-96 w-full rounded-xl object-cover" />
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">{book.title}</h1>
          <p className="mt-2 text-lg opacity-80">by {book.author}</p>
          <span className="badge badge-primary badge-outline mt-3">{book.category}</span>
          <p className="mt-4 leading-relaxed">{book.description}</p>
          <div className="mt-4 space-y-1 text-sm opacity-80">
            <p>Added by: {book.userName} ({book.userEmail})</p>
            <p>Copies available: {book.copies} / {book.totalCopies}</p>
          </div>
          <div className="mt-auto pt-6">
            <button
              onClick={() => setOpen(true)}
              disabled={!available}
              className="btn btn-primary w-full"
            >
              {available ? "Borrow This Book" : "Not Available"}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="mb-4 text-xl font-bold">Borrow: {book.title}</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium">Your Name</label>
                <input value={user?.name || ""} readOnly className="input input-bordered w-full bg-base-200" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Your Email</label>
                <input value={user?.email || ""} readOnly className="input input-bordered w-full bg-base-200" />
              </div>
            </div>
            <div className="modal-action">
              <button onClick={() => setOpen(false)} className="btn">Cancel</button>
              <button onClick={handleBorrow} disabled={submitting} className="btn btn-primary">
                {submitting ? <span className="loading loading-spinner"></span> : "Confirm Borrow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookDetailsPage() {
  return (
    <PrivateRoute>
      <BookDetails />
    </PrivateRoute>
  );
}