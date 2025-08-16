"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function MessagesPage() {
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const [conversations, setConversations] = useState<any[]>([]);

  useEffect(() => {
    if (isLoading) return;
    if (!session) {
      router.replace("/auth");
      return;
    }

    (async () => {
      // ✅ fetch conversations where the user is a member
      const { data, error } = await supabase
        .from("conversations")
        .select("id, title, is_group, created_at, conversation_members!inner(user_id)")
        .eq("conversation_members.user_id", session.user.id);

      if (!error && data) setConversations(data);
    })();
  }, [isLoading, session, supabase, router]);

  if (isLoading) return <p className="p-6">Loading…</p>;
  if (!session) return <p className="p-6">Redirecting…</p>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Messages</h1>
      {conversations.length === 0 && <p>No conversations yet.</p>}
      <div className="space-y-3">
        {conversations.map((c) => (
          <a
            key={c.id}
            href={`/messages/${c.id}`}
            className="block border p-4 rounded hover:bg-gray-100"
          >
            {c.is_group ? c.title : "Direct Chat"}
          </a>
        ))}
      </div>
    </main>
  );
}
