"use client";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/auth");
  }

  if (!session) {
    router.replace("/auth");
    return <p className="p-6">Redirecting...</p>;
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Welcome, {session.user.email} 🎉</p>
      <button
        onClick={handleSignOut}
        className="px-3 py-2 rounded bg-red-500 text-white"
      >
        Sign out
      </button>
    </main>
  );
}
