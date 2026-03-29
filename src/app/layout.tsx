import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JobMatch AI - Land Your Dream Job with AI",
  description:
    "AI-powered job matching, resume optimization, cover letter generation, and interview prep. Get hired faster.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white antialiased">{children}</body>
    </html>
  );
}
