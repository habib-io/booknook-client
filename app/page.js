"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import BookCard from "@/components/BookCard";
import Spinner from "@/components/Spinner";
import { apiFetch } from "@/lib/api";

const slides = [
  {
    title: "Your Small Corner of Stories",
    text: "Discover books shared by readers like you and borrow your next favourite read.",
    bg: "from-indigo-600 to-purple-600",
  },
  {
    title: "Share a Book, Spread the Joy",
    text: "Add your own books to BookNook so other readers can enjoy them too.",
    bg: "from-emerald-600 to-teal-600",
  },
  {
    title: "Borrow Today, Return Tomorrow",
    text: "Borrow a book for a few days and return it whenever you are done.",
    bg: "from-orange-500 to-rose-500",
  },
];

const steps = [
  { n: "1", title: "Find a Book", text: "Browse all books and open the details of the one you like." },
  { n: "2", title: "Borrow It", text: "Confirm your borrow and keep the book for a few days." },
  { n: "3", title: "Return It", text: "Return the book from My Borrows so others can read it." },
];

const categories = [
  { name: "Fiction", text: "Stories that take you somewhere new." },
  { name: "Science", text: "Facts, ideas and curious discoveries." },
  { name: "History", text: "Learn how the world became what it is." },
  { name: "Kids", text: "Fun reads for young readers." },
];

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Home";
    setMounted(true);
    apiFetch("/books?limit=6")
      .then(setBooks)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {mounted ? (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
        >
          {slides.map((s) => (
            <SwiperSlide key={s.title}>
              <div className={`flex h-[420px] items-center justify-center bg-gradient-to-r ${s.bg} px-6 text-center text-white`}>
                <div className="max-w-2xl">
                  <h2 className="text-4xl font-bold md:text-5xl">{s.title}</h2>
                  <p className="mt-4 text-lg opacity-90">{s.text}</p>
                  <Link href="/books" className="btn mt-6 border-none bg-white text-gray-900 hover:bg-gray-100">
                    Browse Books
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-[420px] bg-base-200"></div>
      )}

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-8 text-center text-3xl font-bold">New Arrivals</h2>
        {loading ? (
          <Spinner />
        ) : books.length === 0 ? (
          <p className="text-center opacity-80">No books have been added yet.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link href="/books" className="btn btn-primary">See All Books</Link>
        </div>
      </section>

      <section className="bg-base-200 py-14">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-center text-3xl font-bold">How Borrowing Works</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl bg-base-100 p-6 text-center shadow">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-content">
                  {s.n}
                </div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm opacity-80">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <h2 className="mb-8 text-center text-3xl font-bold">Top Categories</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href="/books"
              className="rounded-2xl border border-base-300 bg-base-100 p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-xl font-semibold text-primary">{c.name}</h3>
              <p className="mt-2 text-sm opacity-80">{c.text}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}