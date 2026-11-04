"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import { authClient } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import { uploadImage } from "@/lib/imgbb";

function AddBookForm() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const file = form.image.files[0];
    if (!file) {
      toast.error("Please choose a book image");
      return;
    }
    setLoading(true);
    try {
      const image = await uploadImage(file);
      await apiFetch("/books", {
        method: "POST",
        auth: true,
        body: JSON.stringify({
          title: form.title.value,
          author: form.author.value,
          category: form.category.value,
          image,
          description: form.description.value,
          totalCopies: form.totalCopies.value,
        }),
      });
      toast.success("Book added successfully!");
      router.push("/my-books");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">Add a New Book</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Book Title</label>
            <input name="title" required placeholder="Enter book title" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Author Name</label>
            <input name="author" required placeholder="Enter author name" className="input input-bordered w-full" />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Category</label>
              <select name="category" required defaultValue="" className="select select-bordered w-full">
                <option value="" disabled>Select category</option>
                <option>Fiction</option>
                <option>Science</option>
                <option>History</option>
                <option>Kids</option>
                <option>Others</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Total Copies</label>
              <input name="totalCopies" type="number" min="1" required defaultValue="1" className="input input-bordered w-full" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Book Image</label>
            <input name="image" type="file" accept="image/*" required className="file-input file-input-bordered w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Short Description</label>
            <textarea name="description" required rows="4" placeholder="Write a short description about the book" className="textarea textarea-bordered w-full"></textarea>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Your Name</label>
              <input value={user?.name || ""} readOnly className="input input-bordered w-full bg-base-200" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Your Email</label>
              <input value={user?.email || ""} readOnly className="input input-bordered w-full bg-base-200" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <span className="loading loading-spinner"></span> : "Add Book"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AddBookPage() {
  return (
    <PrivateRoute>
      <AddBookForm />
    </PrivateRoute>
  );
}