import { supabase } from "@/lib/supabase";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Welcome to ConnexU 🎓</h1>
      <p className="mt-2">Please <a href="/auth" className="text-blue-600 underline">sign in</a> to continue.</p>
    </main>
  );
}

