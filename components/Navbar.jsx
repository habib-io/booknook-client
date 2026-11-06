"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
    BookNook
  </Link>
);

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const user = session?.user;
  const [dark, setDark] = useState(false);

  useEffect(() => {
    let saved = null;
    try {
      saved = localStorage.getItem("booknook-theme");
    } catch (e) {}
    if (saved === "dark") {
      setDark(true);
      document.documentElement.setAttribute("data-theme", "booknook-dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "booknook-dark" : "booknook");
    try {
      localStorage.setItem("booknook-theme", next ? "dark" : "light");
    } catch (e) {}
  };

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const links = (
    <>
      <li><Link href="/">Home</Link></li>
      <li><Link href="/books">All Books</Link></li>
      {user && (
        <>
          <li><Link href="/add-book">Add Book</Link></li>
          <li><Link href="/my-books">My Books</Link></li>
          <li><Link href="/my-borrows">My Borrows</Link></li>
        </>
      )}
    </>
  );

  return (
    <div className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <div className="navbar mx-auto max-w-7xl px-4">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content z-10 mt-3 w-52 rounded-box bg-base-100 p-2 shadow">
              {links}
            </ul>
          </div>
          <Logo />
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 font-medium">{links}</ul>
        </div>

        <div className="navbar-end gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark and light theme"
            className="btn btn-ghost btn-circle"
          >
            {dark ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          {isPending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : user ? (
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={user.image || "https://i.ibb.co/ZRyTjtC/avatar.png"}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <ul tabIndex={0} className="menu dropdown-content z-10 mt-3 w-56 rounded-box bg-base-100 p-2 shadow">
                <li className="menu-title text-base-content">{user.name}</li>
                <li><Link href="/profile">My Profile</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            </div>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline btn-primary btn-sm">Login</Link>
              <Link href="/register" className="btn btn-primary btn-sm">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}