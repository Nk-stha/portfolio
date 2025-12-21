import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import { Analytics } from "@vercel/analytics/next";
import NextTopLoader from 'nextjs-toploader';
import { JsonLd } from '@/components/seo/JsonLd';

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nikeshshrestha405.com.np';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Rohan Shrestha | Full Stack Engineer & DevOps Expert",
    template: "%s | Rohan Shrestha",
  },
  description: "Rohan Shrestha (Nikesh Shrestha) - Full Stack Engineer & DevOps Engineer specializing in scalable web applications, AWS cloud infrastructure, CI/CD pipelines, React, Next.js, Node.js, and system design. 10+ years of experience delivering high-performance solutions.",
  keywords: [
    "Rohan Shrestha",
    "Nikesh Shrestha",
    "Full Stack Engineer",
    "Full Stack Developer",
    "DevOps Engineer",
    "Next.js Developer",
    "React Developer",
    "Frontend Engineer",
    "Backend Engineer",
    "Cloud Engineer",
    "AWS Engineer",
    "Node.js Developer",
    "System Design",
    "CI/CD Pipeline",
    "Terraform",
    "Ansible",
    "GitLab",
    "ArgoCD",
    "MongoDB",
    "PostgreSQL",
    "Scalability",
    "Observability",
    "Grafana",
    "Web Performance",
    "Remote Developer",
    "Freelance Developer",
  ],
  authors: [{ name: "Rohan Shrestha" }, { name: "Nikesh Shrestha" }],
  creator: "Rohan Shrestha",
  publisher: "Rohan Shrestha",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Rohan Shrestha Portfolio",
    title: "Rohan Shrestha | Full Stack Engineer & DevOps Expert",
    description: "Full Stack Engineer & DevOps Engineer specializing in scalable applications, AWS, React, Next.js, and cloud infrastructure. Available for remote opportunities worldwide.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Rohan Shrestha - Full Stack & DevOps Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rohan Shrestha | Full Stack Engineer & DevOps Expert",
    description: "Full Stack Engineer & DevOps Engineer specializing in scalable applications, AWS, React, Next.js, and cloud infrastructure.",
    images: [`${BASE_URL}/og-image.png`],
    creator: "@rohanshrestha", // Replace with actual Twitter handle if available
  },
  alternates: {
    canonical: BASE_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    // yandex: 'yandex-verification-code',
    // bing: 'bing-verification-code',
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
        <NextTopLoader color="#FF5722" showSpinner={false} />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Rohan Shrestha",
            alternateName: "Nikesh Shrestha",
            url: BASE_URL,
            image: `${BASE_URL}/animatedprofile.png`,
            jobTitle: "Full Stack Engineer & DevOps Engineer",
            worksFor: {
              "@type": "Organization",
              name: "Freelance",
            },
            sameAs: [
              // Add your social media profiles here
              // "https://linkedin.com/in/yourprofile",
              // "https://github.com/yourprofile",
              // "https://twitter.com/yourprofile",
            ],
            knowsAbout: [
              "Full Stack Development",
              "DevOps Engineering",
              "React",
              "Next.js",
              "Node.js",
              "AWS",
              "CI/CD",
              "Terraform",
              "Ansible",
              "System Design",
              "Scalability",
              "Cloud Infrastructure",
            ],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Rohan Shrestha Portfolio",
            url: BASE_URL,
            description:
              "Portfolio of Rohan Shrestha, Full Stack Engineer and DevOps Engineer",
            author: {
              "@type": "Person",
              name: "Rohan Shrestha",
            },
          }}
        />
        <Analytics />
        {children}
      </body>
    </html>
  );
}
