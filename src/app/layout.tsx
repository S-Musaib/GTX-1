import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTX-1 | AI Image Generator",
  description: "Your personal AI assistant with AI image generation capabilities - Create stunning images from text prompts or sketches",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0d0d0d] text-white font-sans">
        {children}
      </body>
    </html>
  );
}
