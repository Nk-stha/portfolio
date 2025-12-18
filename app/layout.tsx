import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { Analytics } from "@vercel/analytics/next";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Rohan Shrestha - Full Stack Engineer Portfolio",
  description: "Passionate Full Stack Engineer dedicated to building high-quality, scalable web applications. 10+ years of experience in React, Node.js, and cloud infrastructure.",
  keywords: ["Full Stack Developer", "React", "Next.js", "Node.js", "Portfolio", "Web Development"],
  authors: [{ name: "Rohan Shrestha" }],
  openGraph: {
    title: "Rohan Shrestha - Full Stack Engineer Portfolio",
    description: "Passionate Full Stack Engineer with 10+ years of experience",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body className={`${sora.variable} antialiased`}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
