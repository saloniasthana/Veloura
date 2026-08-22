"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/auth/AuthShell";
import FormField, { inputClass } from "@/components/auth/FormField";
import { useAuth } from "@/lib/auth-context";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    const nextErrors: Errors = {};
    if (name.trim().length < 2) nextErrors.name = "Enter your full name.";
    if (!EMAIL_RE.test(email)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";
    if (confirmPassword !== password)
      nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const result = await register(name, email, password);
    setSubmitting(false);

    if (!result.success) {
      setFormError(result.error ?? "Something went wrong.");
      return;
    }
    router.push("/account");
  }

  return (
    <AuthShell
      eyebrow="Members"
      title="Create Your Account"
      subtitle="Join Veloura for early access, order tracking, and a saved wishlist."
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <FormField label="Full Name" error={errors.name}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            autoComplete="name"
          />
        </FormField>

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
            autoComplete="new-password"
          />
        </FormField>

        <FormField label="Confirm Password" error={errors.confirmPassword}>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClass}
            autoComplete="new-password"
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
          {submitting ? "Creating Account…" : "Create Account"}
        </button>
      </form>

      <p className="text-sm text-center text-charcoal mt-8">
        Already a member?{" "}
        <Link href="/account/login" className="text-ink underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
