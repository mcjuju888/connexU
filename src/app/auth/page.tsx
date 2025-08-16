"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  // if already signed in, go to dashboard
  useEffect(() => {
    if (session) {
      router.replace("/dashboard");
    }
  }, [session, router]);

  async function sendLink() {
    setStatus("Sending magic link...");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setStatus(error ? `Error: ${error.message}` : "Check your email for the sign-in link.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setStatus("Signed out.");
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-3">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <input
        className="border px-3 py-2 w-full rounded"
        placeholder="you@school.edu"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={sendLink}
        className="px-3 py-2 rounded bg-black text-white w-full"
      >
        Send magic link
      </button>
      <button
        onClick={signOut}
        className="px-3 py-2 rounded border w-full"
      >
        Sign out
      </button>
      <p>{status}</p>
    </main>
  );
}
