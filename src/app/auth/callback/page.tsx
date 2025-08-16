"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Supabase sets the session when the user clicks the magic link
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/dashboard");
      } else {
        router.replace("/auth");
      }
    });
  }, [router]);

  return <p className="p-6">Finishing sign in...</p>;
}
