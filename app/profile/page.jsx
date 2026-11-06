"use client";
import { useEffect } from "react";
import PrivateRoute from "@/components/PrivateRoute";
import { authClient } from "@/lib/auth-client";

function ProfileContent() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  useEffect(() => {
    document.title = "BookNook | My Profile";
  }, []);

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-8 text-center shadow-lg">
        <img
          src={user?.image || "https://i.ibb.co/ZRyTjtC/avatar.png"}
          alt={user?.name}
          referrerPolicy="no-referrer"
          className="mx-auto h-28 w-28 rounded-full object-cover"
        />
        <h1 className="mt-4 text-2xl font-bold">{user?.name}</h1>
        <p className="mt-1 opacity-80">{user?.email}</p>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <ProfileContent />
    </PrivateRoute>
  );
}