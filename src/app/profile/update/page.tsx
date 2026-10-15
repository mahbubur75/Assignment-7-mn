"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function UpdateInformationPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  if (isPending || !session) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-green-50">
        <p className="text-green-800">Loading...</p>
      </main>
    );
  }

  return (
    <ProfileForm
      initialName={session.user.name || ""}
      initialEmail={session.user.email || ""}
    />
  );
}

function ProfileForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [nameLoading, setNameLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Update Name
  async function updateName(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    setNameLoading(true);

    try {
      const result = await authClient.updateUser({
        name: name.trim(),
      });

      if (result.error) {
        toast.error(
          result.error.message || "Name change failed!"
        );
        return;
      }

      toast.success("Name change successful!");
      router.refresh();
    } catch {
      toast.error("Name change failed!");
    } finally {
      setNameLoading(false);
    }
  }

  // Update Email
  async function updateEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newEmail = email.trim();

    if (!newEmail) {
      toast.error("Please enter your email.");
      return;
    }

    if (newEmail.toLowerCase() === initialEmail.toLowerCase()) {
      toast.error("Please enter a different email address.");
      return;
    }

    setEmailLoading(true);

    try {
      const result = await authClient.changeEmail({
        newEmail,
        callbackURL: "/profile/update",
      });

      if (result.error) {
        toast.error(
          result.error.message || "Email change failed!"
        );
        return;
      }

      toast.success(
        "Email change request successful! Check your email if verification is required."
      );
    } catch {
      toast.error("Email change failed!");
    } finally {
      setEmailLoading(false);
    }
  }

  // Update Password
  async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      toast.error("Please enter both passwords.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters.");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different.");
      return;
    }

    setPasswordLoading(true);

    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        toast.error(
          result.error.message || "Password change failed!"
        );
        return;
      }

      setCurrentPassword("");
      setNewPassword("");

      toast.success("Password change successful!");
    } catch {
      toast.error("Password change failed!");
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-green-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-green-900">
            আমার প্রোফাইল
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Update your name, email and password.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-green-100 bg-white p-5 shadow-sm sm:p-8">
          {/* NAME FORM */}
          <form onSubmit={updateName} className="space-y-3">
            <label
              htmlFor="profile-name"
              className="block font-semibold text-gray-700"
            >
              Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <button
              type="submit"
              disabled={nameLoading}
              className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {nameLoading ? "Updating..." : "Update Name"}
            </button>
          </form>

          <hr className="border-gray-200" />

          {/* EMAIL FORM */}
          <form onSubmit={updateEmail} className="space-y-3">
            <label
              htmlFor="profile-email"
              className="block font-semibold text-gray-700"
            >
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your new email"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <p className="text-xs text-gray-500">
              Email verification may be required.
            </p>

            <button
              type="submit"
              disabled={emailLoading}
              className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {emailLoading ? "Updating..." : "Update Email"}
            </button>
          </form>

          <hr className="border-gray-200" />

          {/* PASSWORD FORM */}
          <form onSubmit={updatePassword} className="space-y-3">
            <h2 className="font-semibold text-gray-700">
              Change Password
            </h2>

            <label
              htmlFor="current-password"
              className="block text-sm text-gray-600"
            >
              Current Password
            </label>

            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <label
              htmlFor="new-password"
              className="block text-sm text-gray-600"
            >
              New Password
            </label>

            <input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password (minimum 8 characters)"
              required
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <button
              type="submit"
              disabled={passwordLoading}
              className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800 disabled:opacity-60"
            >
              {passwordLoading
                ? "Updating..."
                : "Change Password"}
            </button>
          </form>

          <div className="border-t border-gray-200 pt-4">
            <Link
              href="/"
              className="inline-block rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}