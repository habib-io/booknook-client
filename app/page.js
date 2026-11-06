"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import BookCard from "@/components/BookCard";
import Spinner from "@/components/Spinner";
import { apiFetch } from "@/lib/api";

const slides = [
  {
    image: "/hero1.jpg",
    tag: "Your neighbourhood library",
    title: "Your Small Corner of Stories",
    text: "Discover books shared by readers like you and borrow your next favourite read.",
  },
  {
    image: "/hero2.jpg",
    tag: "Share what you love",
    title: "Share a Book, Spread the Joy",
    text: "Add your own books to BookNook so other readers can enjoy them too.",
  },
  {
    image: "/hero3.jpg",
    tag: "Simple and quick",
    title: "Borrow Today, Return Tomorrow",
    text: "Borrow a book for a few days and return it whenever you are done.",
  },
];

const steps = [
  { n: "1", title: "Find a Book", text: "Browse all books and open the details of the one you like." },
  { n: "2", title: "Borrow It", text: "Confirm your borrow and keep the book for a few days." },
  { n: "3", title: "Return It", text: "Return the book from My Borrows so others can read it." },
];

const categories = [
  { name: "Fiction", text: "Stories that take you somewhere new.", icon: "📖" },
  { name: "Science", text: "Facts, ideas and curious discoveries.", icon: "🔬" },
  { name: "History", text: "Learn how the world became what it is.", icon: "🏛️" },
  { name: "Kids", text: "Fun reads for young readers.", icon: "🧸" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function SectionTitle({ title, sub }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      <div className="mx-auto mt-3 h-1 w-16 rounded bg-secondary"></div>
      {sub && <p className="mx-auto mt-3 max-w-xl text-sm opacity-70">{sub}</p>}
    </div>
  );
}

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
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
        >
          {slides.map((s) => (
            <SwiperSlide key={s.title}>
              <div
                className="relative flex h-[520px] items-center bg-neutral bg-cover bg-center"
                style={{ backgroundImage: `url(${s.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/25"></div>
                <div className="relative mx-auto w-full max-w-7xl px-6 text-white">
                  <div className="max-w-xl">
                    <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">
                      {s.tag}
                    </span>
                    <h2 className="text-4xl font-bold leading-tight md:text-6xl">{s.title}</h2>
                    <p className="mt-5 text-lg text-white/85">{s.text}</p>
                    <Link href="/books" className="btn btn-primary btn-lg mt-8 border-none">
                      Browse Books
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="h-[520px] bg-neutral"></div>
      )}

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-4 py-16"
      >
        <SectionTitle title="New Arrivals" sub="The latest books added by our readers." />
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
          <Link href="/books" className="btn btn-primary btn-wide">See All Books</Link>
        </div>
      </motion.section>

      <section className="bg-base-200 py-16">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-7xl px-4"
        >
          <SectionTitle title="How Borrowing Works" sub="Three simple steps from shelf to your hands." />
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-content">
                  {s.n}
                </div>
                <h3 className="text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm opacity-80">{s.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-4 py-16"
      >
        <SectionTitle title="Top Categories" sub="Pick a shelf and start exploring." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.name}
              href="/books"
              className="rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-sm transition hover:-translate-y-1 hover:border-secondary hover:shadow-lg"
            >
              <div className="mb-3 text-4xl">{c.icon}</div>
              <h3 className="text-xl font-semibold text-primary">{c.name}</h3>
              <p className="mt-2 text-sm opacity-80">{c.text}</p>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}