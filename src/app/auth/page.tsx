"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus(`Signed in as ${data.session.user.email}`);
    });
  }, []);

  async function sendLink() {
    setStatus("Sending magic link...");
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: "http://localhost:3000" }});
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
      <button onClick={sendLink} className="px-3 py-2 rounded bg-black text-white">Send magic link</button>
      <button onClick={signOut} className="px-3 py-2 rounded border">Sign out</button>
      <p>{status}</p>
    </main>
  );
}
