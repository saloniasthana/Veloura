"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import FormField, { inputClass } from "@/components/auth/FormField";
import { useAuth } from "@/lib/auth-context";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const nextErrors: typeof errors = {};
    if (!EMAIL_RE.test(email)) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Password is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (!result.success) {
      setFormError(result.error ?? "Something went wrong.");
      return;
    }
    router.push(searchParams.get("redirect") || "/account");
  }

  return (
    <AuthShell
      eyebrow="Members"
      title="Welcome Back"
      subtitle="Sign in to view your orders, wishlist, and saved details."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormField label="Email" error={errors.email}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
        </FormField>

        <FormField label="Password" error={errors.password}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            autoComplete="current-password"
          />
        </FormField>

        {formError ? (
          <p className="text-xs text-red-700">{formError}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-ivory text-xs tracking-luxe uppercase py-4 hover:bg-charcoal transition-colors duration-300 disabled:opacity-60"
        >
          {submitting ? "Signing In…" : "Sign In"}
        </button>
      </form>

      <p className="text-sm text-center text-charcoal mt-8">
        New to Veloura?{" "}
        <Link href="/account/register" className="text-ink underline underline-offset-2">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
