"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import Spinner from "@/components/Spinner";
import { apiFetch } from "@/lib/api";

const fmt = (d) =>
  new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

function MyBorrows() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  useEffect(() => {
    document.title = "BookNook | My Borrows";
    apiFetch("/borrows", { auth: true })
      .then(setBorrows)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleReturn = async (id) => {
    setReturningId(id);
    try {
      await apiFetch(`/borrows/${id}`, { method: "DELETE", auth: true });
      setBorrows(borrows.filter((b) => b._id !== id));
      toast.success("Book returned successfully!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setReturningId(null);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">My Borrows</h1>

      {borrows.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 opacity-80">You have not borrowed any books yet.</p>
          <Link href="/books" className="btn btn-primary">Browse Books</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {borrows.map((b) => (
                <tr key={b._id}>
                  <td>
                    <img src={b.bookImage} alt={b.bookTitle} className="h-16 w-12 rounded object-cover" />
                  </td>
                  <td className="font-semibold">{b.bookTitle}</td>
                  <td>{fmt(b.borrowDate)}</td>
                  <td>{fmt(b.returnDate)}</td>
                  <td className="text-center">
                    <button
                      onClick={() => handleReturn(b._id)}
                      disabled={returningId === b._id}
                      className="btn btn-sm btn-primary"
                    >
                      {returningId === b._id ? <span className="loading loading-spinner loading-xs"></span> : "Return Book"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function MyBorrowsPage() {
  return (
    <PrivateRoute>
      <MyBorrows />
    </PrivateRoute>
  );
}