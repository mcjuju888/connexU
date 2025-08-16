import "./globals.css";
import SupabaseProvider from "@/components/providers/supabase-provider";

export const metadata = {
  title: "ConnexU",
  description: "Student study-buddy matcher",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SupabaseProvider>{children}</SupabaseProvider>
      </body>
    </html>
  );
}
