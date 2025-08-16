"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function DashboardPage() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!session) {
      router.replace("/auth");
      return;
    }

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, program, year")
        .eq("user_id", session.user.id)
        .single();
      setProfile(data);
    })();
  }, [session, supabase, router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/auth");
  }

  if (!session) return <p className="p-6">Redirecting...</p>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {profile ? (
        <p>
          Welcome, {profile.full_name} ({profile.program}, Year {profile.year})
        </p>
      ) : (
        <p>Welcome, {session.user.email} 🎉</p>
      )}

      <a
        href="/profile"
        className="inline-block px-3 py-2 rounded bg-blue-600 text-white"
      >
        Edit Profile
      </a>

      <a href="/messages" className="inline-block px-3 py-2 rounded bg-green-600 text-white">
            Go to Messages
      </a>

      <a
        href="/matches"
        className="inline-block px-3 py-2 rounded bg-green-600 text-white"
      >
          Find Matches
      </a>

      <button
        onClick={handleSignOut}
        className="px-3 py-2 rounded bg-red-500 text-white"
      >
    
      

        Sign out
      </button>
    </main>
  );
}
