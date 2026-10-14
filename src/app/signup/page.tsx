"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function SignupPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignup(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    const formData = new FormData(
      e.currentTarget as HTMLFormElement
    );

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (name.length < 2) {
      setError("নাম কমপক্ষে ২ অক্ষরের হতে হবে।");
      return;
    }

    if (!email) {
      setError("ইমেইল লিখো।");
      return;
    }

    if (password.length < 8) {
      setError("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    try {
      setLoading(true);

      const result = await signUp.email({
        name,
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.message || "সাইন আপ করা যায়নি।"
        );
        return;
      }

      router.push("/signin");
    } catch {
      setError("সাইন আপ করতে সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
      <form
        onSubmit={handleSignup}
        className="card w-full max-w-md bg-base-100 shadow-xl"
      >
        <div className="card-body gap-4">
          <Link
            href="/"
            className="link link-success text-sm no-underline"
          >
            ← হোম পেজে ফিরে যাও
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-success">
              অ্যাকাউন্ট তৈরি করো
            </h1>
            <p className="mt-2 text-base-content/70">
              Bazar Dor-এ যোগ দিতে সাইন আপ করো
            </p>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">তোমার নাম</legend>
            <input
              type="text"
              name="name"
              required
              minLength={2}
              placeholder="পুরো নাম লিখো"
              className="input input-bordered w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">ইমেইল</legend>
            <input
              type="email"
              name="email"
              required
              placeholder="তোমার ইমেইল লিখো"
              className="input input-bordered w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">পাসওয়ার্ড</legend>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              placeholder="কমপক্ষে ৮ অক্ষর"
              className="input input-bordered w-full"
            />
          </fieldset>

          {error && (
            <div role="alert" className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success mt-2 w-full text-white"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                অপেক্ষা করো...
              </>
            ) : (
              "সাইন আপ"
            )}
          </button>

          <p className="text-center text-sm">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="link link-success font-semibold"
            >
              সাইন ইন করো
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}