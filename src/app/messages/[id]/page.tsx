"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function ConversationPage() {
  const { id } = useParams(); // conversation_id
  const { session, isLoading } = useSessionContext();
  const supabase = useSupabaseClient();

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (isLoading || !session) return;

    // ✅ fetch messages for this conversation
    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("id, content, sender_id, created_at")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    })();

    // ✅ subscribe for realtime updates
    const channel = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, isLoading, session, supabase]);

  async function sendMessage() {
    if (!newMessage.trim() || !session) return;
    await supabase.from("messages").insert({
      conversation_id: id,
      sender_id: session.user.id,
      content: newMessage.trim(),
    });
    setNewMessage("");
  }

  if (isLoading) return <p className="p-6">Loading…</p>;
  if (!session) return <p className="p-6">Redirecting…</p>;

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Conversation</h1>
      <div className="border p-4 h-64 overflow-y-auto bg-gray-50 rounded">
        {messages.map((m) => (
          <p key={m.id} className={m.sender_id === session.user.id ? "text-blue-600" : "text-black"}>
            {m.content}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded p-2"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} className="px-4 py-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </div>
    </main>
  );
}
