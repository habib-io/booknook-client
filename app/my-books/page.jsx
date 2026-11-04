"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import Spinner from "@/components/Spinner";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";

function MyBooks() {
  const { data: session } = authClient.useSession();
  const email = session?.user?.email;

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = () =>
    apiFetch(`/books?email=${encodeURIComponent(email)}`)
      .then(setBooks)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));

  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  useEffect(() => {
    if (email) load();
  }, [email]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    setBusy(true);
    try {
      let image = editing.image;
      const file = form.image.files[0];
      if (file) image = await uploadImage(file);
      await apiFetch(`/books/${editing._id}`, {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({
          title: form.title.value,
          author: form.author.value,
          category: form.category.value,
          description: form.description.value,
          totalCopies: form.totalCopies.value,
          image,
        }),
      });
      toast.success("Book updated successfully!");
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await apiFetch(`/books/${deleting._id}`, { method: "DELETE", auth: true });
      setBooks(books.filter((b) => b._id !== deleting._id));
      toast.success("Book deleted successfully!");
      setDeleting(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-center text-3xl font-bold">My Books</h1>

      {books.length === 0 ? (
        <div className="text-center">
          <p className="mb-4 opacity-80">You have not added any books yet.</p>
          <Link href="/add-book" className="btn btn-primary">Add Book</Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Category</th>
                <th>Copies</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>
                    <img src={book.image} alt={book.title} className="h-16 w-12 rounded object-cover" />
                  </td>
                  <td className="font-semibold">{book.title}</td>
                  <td>{book.category}</td>
                  <td>{book.copies} / {book.totalCopies}</td>
                  <td>
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setEditing(book)} className="btn btn-sm btn-primary">Edit</button>
                      <button onClick={() => setDeleting(book)} className="btn btn-sm btn-error">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="modal modal-open">
          <div className="modal-box max-w-xl">
            <h3 className="mb-4 text-xl font-bold">Edit Book</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input name="title" defaultValue={editing.title} required placeholder="Book title" className="input input-bordered w-full" />
              <input name="author" defaultValue={editing.author} required placeholder="Author name" className="input input-bordered w-full" />
              <div className="grid gap-3 md:grid-cols-2">
                <select name="category" defaultValue={editing.category} className="select select-bordered w-full">
                  <option>Fiction</option>
                  <option>Science</option>
                  <option>History</option>
                  <option>Kids</option>
                  <option>Others</option>
                </select>
                <input name="totalCopies" type="number" min="1" defaultValue={editing.totalCopies} required className="input input-bordered w-full" />
              </div>
              <div>
                <label className="mb-1 block text-sm opacity-80">Change image (optional)</label>
                <input name="image" type="file" accept="image/*" className="file-input file-input-bordered w-full" />
              </div>
              <textarea name="description" defaultValue={editing.description} required rows="3" className="textarea textarea-bordered w-full"></textarea>
              <div className="modal-action">
                <button type="button" onClick={() => setEditing(null)} className="btn">Cancel</button>
                <button type="submit" disabled={busy} className="btn btn-primary">
                  {busy ? <span className="loading loading-spinner"></span> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleting && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-xl font-bold">Delete this book?</h3>
            <p className="py-4">
              Are you sure you want to delete <b>{deleting.title}</b>? This cannot be undone.
            </p>
            <div className="modal-action">
              <button onClick={() => setDeleting(null)} className="btn">Cancel</button>
              <button onClick={handleDelete} disabled={busy} className="btn btn-error">
                {busy ? <span className="loading loading-spinner"></span> : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyBooksPage() {
  return (
    <PrivateRoute>
      <MyBooks />
    </PrivateRoute>
  );
}