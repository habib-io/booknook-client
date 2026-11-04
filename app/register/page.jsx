"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passError, setPassError] = useState("");

  useEffect(() => {
    document.title = "BookNook | Register";
  }, []);

  const validate = (password) => {
    if (!/[A-Z]/.test(password)) return "Password must have an uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must have a lowercase letter";
    if (password.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const image = form.photo.value;
    const password = form.password.value;

    const err = validate(password);
    setPassError(err);
    if (err) return;

    setLoading(true);
    const { error } = await authClient.signUp.email({ name, email, password, image });
         if (error) {
      setLoading(false);
      console.log("SIGNUP ERROR:", error);
      toast.error(error.message || error.statusText || "Registration failed");
      return;
    }
    await authClient.signOut();
    setLoading(false);
    toast.success("Registration successful! Please login.");
    router.push("/login");
  };

  const handleGoogle = async () => {
    await authClient.signIn.social({ provider: "google", callbackURL: "/" });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold">Create your account</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input name="name" type="text" required placeholder="Your full name" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Photo URL</label>
            <input name="photo" type="url" required placeholder="https://..." className="input input-bordered w-full" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input name="password" type="password" required placeholder="Create a password" className="input input-bordered w-full" />
            {passError && <p className="mt-1 text-sm text-error">{passError}</p>}
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? <span className="loading loading-spinner"></span> : "Register"}
          </button>
        </form>
        <div className="divider">OR</div>
        <button onClick={handleGoogle} className="btn btn-outline w-full">
          Continue with Google
        </button>
        <p className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}