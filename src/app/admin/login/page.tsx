"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormField, { inputClass } from "@/components/auth/FormField";
import { useAuth } from "@/lib/auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success || !result.user) {
      setError(result.error ?? "Invalid admin credentials.");
      return;
    }
    if (result.user.role !== "ADMIN") {
      setError("This account does not have admin access.");
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-ivory px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs tracking-luxe uppercase text-gold mb-3 text-center">
          Veloura
        </p>
        <h1 className="font-display text-3xl mb-2 text-center">Admin Sign In</h1>
        <p className="text-sm text-stone mb-8 text-center">
          Restricted access — store management only.
        </p>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <FormField label="Email">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="username"
            />
          </FormField>
          <FormField label="Password">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </FormField>

          {error ? <p className="text-xs text-red-700">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-ink text-ivory text-xs tracking-luxe uppercase py-4 hover:bg-charcoal transition-colors duration-300 disabled:opacity-60"
          >
            {submitting ? "Signing In…" : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-stone text-center mt-8 border border-line px-4 py-3">
          Demo credentials — admin@veloura.com / veloura2026
        </p>
      </div>
    </main>
  );
}
