"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";

export default function MatchesPage() {
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    if (isLoading) return; // ✅ wait until session is resolved
    if (!session) {
      router.replace("/auth");
      return;
    }

    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, program, year, bio")
        .neq("user_id", session.user.id); // 👈 exclude self
      if (!error && data) setMatches(data);
    })();
  }, [isLoading, session, supabase, router]);

  if (isLoading) return <p className="p-6">Loading…</p>;
  if (!session) return <p className="p-6">Redirecting…</p>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Your Matches</h1>
      {matches.length === 0 && <p>No other users yet 😅</p>}

      <div className="space-y-3">
        {matches.map((m, i) => (
          <div key={i} className="border p-4 rounded">
            <h2 className="font-semibold">{m.full_name}</h2>
            <p>{m.program} — Year {m.year}</p>
            <p className="text-gray-600">{m.bio}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
