"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Simple client-side cookie set (Validation happens in Layout/Middleware effectively)
    // Ideally this should use a Server Action, but for simplicity/speed as requested:
    // We set the cookie, and then the layout will verify if it matches the server env.
    // Wait, client can't know the server env.
    // So we need a simple server action or just a route to verify.
    // Let's use a simple API route for verification or just server action.
    // Actually, Server Action is easier in Next.js 14+.

    try {
      const response = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        // Cookie is set by the API route on success
        router.push("/admin");
      } else {
        setError("Invalid access key");
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] p-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl bg-[#0a0a0a] p-8 border border-[#1a1a1a] shadow-xl">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
            Admin Access
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Enter your secret key to continue
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="key" className="sr-only">
              Access Key
            </label>
            <input
              id="key"
              name="key"
              type="password"
              required
              className="relative block w-full rounded-lg border border-[#333] bg-[#111] p-3 text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
              placeholder="Enter access key..."
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="group relative flex w-full justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-[#0a0a0a] transition-all"
          >
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
