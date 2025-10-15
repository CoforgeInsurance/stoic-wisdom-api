import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stoic Wisdom - Ancient Philosophy for Modern Life",
  description: "Explore the timeless wisdom of Marcus Aurelius, Seneca, and Epictetus. Discover Stoic philosophy quotes, teachings, and practical applications for modern living.",
  keywords: "stoicism, philosophy, Marcus Aurelius, Seneca, Epictetus, ancient wisdom, mindfulness, virtue",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Lato:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased paper-texture">
        {children}
      </body>
    </html>
  );
}
