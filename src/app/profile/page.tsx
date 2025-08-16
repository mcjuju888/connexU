"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabaseClient, useSessionContext } from "@supabase/auth-helpers-react";

export default function ProfilePage() {
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [program, setProgram] = useState("");
  const [year, setYear] = useState<number | undefined>(undefined);
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (isLoading) return;              // ✅ wait for session to resolve
    if (!session) { router.replace("/auth"); return; }

    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, program, year, bio")
        .eq("user_id", session.user.id)
        .single();
      if (data) {
        setFullName(data.full_name ?? "");
        setProgram(data.program ?? "");
        setYear(data.year ?? undefined);
        setBio(data.bio ?? "");
      }
    })();
  }, [isLoading, session, supabase, router]);

  async function saveProfile() {
    if (!session) return;
    const { error } = await supabase.from("profiles").upsert(
      {
        user_id: session.user.id,
        full_name: fullName,
        program,
        year,
        bio,
      },
      { onConflict: "user_id" }  // 👈 tell Supabase how to decide update vs insert
    );
    setStatus(error ? `Error: ${error.message}` : "Profile saved ✅");
  }

  if (isLoading) return <p className="p-6">Loading…</p>;

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Edit Profile</h1>
      <input className="border w-full p-2 rounded" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} />
      <input className="border w-full p-2 rounded" placeholder="Program" value={program} onChange={e=>setProgram(e.target.value)} />
      <input className="border w-full p-2 rounded" type="number" placeholder="Year" value={year ?? ""} onChange={e=>setYear(Number(e.target.value))} />
      <textarea className="border w-full p-2 rounded" placeholder="Bio" value={bio} onChange={e=>setBio(e.target.value)} />
      <button onClick={saveProfile} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
      {status && <p>{status}</p>}
    </main>
  );
}
