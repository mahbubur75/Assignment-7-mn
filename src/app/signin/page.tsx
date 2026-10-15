"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function SigninPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<
    "google" | "github" | null
  >(null);
  const [error, setError] = useState("");

  async function handleSignin(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const email = String(
      formData.get("email") ?? ""
    ).trim();

    const password = String(
      formData.get("password") ?? ""
    );

    if (!email) {
      setError("ইমেইল লিখো।");
      return;
    }

    if (!password) {
      setError("পাসওয়ার্ড লিখো।");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।"
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("সাইন ইন করা যায়নি। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  async function handleSocialSignin(
    provider: "google" | "github"
  ) {
    setError("");

    try {
      setSocialLoading(provider);

      const result = await signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result.error) {
        setError(
          result.error.message ||
            `${provider === "google" ? "Google" : "GitHub"} দিয়ে সাইন ইন করা যায়নি।`
        );
        setSocialLoading(null);
      }
    } catch {
      setError("সোশ্যাল সাইন ইন করা যায়নি। আবার চেষ্টা করো।");
      setSocialLoading(null);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10">
      <form
        onSubmit={handleSignin}
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
              সাইন ইন
            </h1>

            <p className="mt-2 text-base-content/70">
              Bazar Dor-এ প্রবেশ করতে সাইন ইন করো
            </p>
          </div>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              ইমেইল
            </legend>

            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="তোমার ইমেইল লিখো"
              className="input input-bordered w-full"
            />
          </fieldset>

          <fieldset className="fieldset">
            <legend className="fieldset-legend">
              পাসওয়ার্ড
            </legend>

            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="তোমার পাসওয়ার্ড লিখো"
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
            disabled={loading || socialLoading !== null}
            className="btn btn-success mt-2 w-full text-white"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                অপেক্ষা করো...
              </>
            ) : (
              "সাইন ইন"
            )}
          </button>

          <div className="divider text-sm">অথবা</div>

          <button
            type="button"
            onClick={() => handleSocialSignin("google")}
            disabled={loading || socialLoading !== null}
            className="btn btn-outline w-full"
          >
            {socialLoading === "google" ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Google-এ সংযোগ হচ্ছে...
              </>
            ) : (
              <>
                <span className="font-bold text-base">G</span>
                Google দিয়ে সাইন ইন
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSocialSignin("github")}
            disabled={loading || socialLoading !== null}
            className="btn btn-outline w-full"
          >
            {socialLoading === "github" ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                GitHub-এ সংযোগ হচ্ছে...
              </>
            ) : (
              <>
                <span className="font-bold text-base">GH</span>
                GitHub দিয়ে সাইন ইন
              </>
            )}
          </button>

          <p className="text-center text-sm">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="link link-success font-semibold"
            >
              সাইন আপ করো
            </Link>
          </p>
        </div>
      </form>
    </main>
  );
}