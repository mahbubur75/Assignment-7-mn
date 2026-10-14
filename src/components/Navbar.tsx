"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

const categories = [
  { name: "চাল", slug: "chal", emoji: "🍚" },
  { name: "ডাল", slug: "dal", emoji: "🫘" },
  { name: "তেল", slug: "tel", emoji: "🫙" },
  { name: "সবজি", slug: "sobji", emoji: "🥬" },
  { name: "মাছ", slug: "mach", emoji: "🐟" },
  { name: "মাংস", slug: "mangsho", emoji: "🍗" },
  { name: "ডিম-দুধ", slug: "dim-dudh", emoji: "🥚" },
  { name: "মসলা", slug: "mosla", emoji: "🌶️" },
];

const tickerItems = [
  { emoji: "🍚", name: "চাল", price: "৬৮ টাকা/কেজি", change: "▲ ২.১%", up: true },
  { emoji: "🫘", name: "ডাল", price: "১১০ টাকা/কেজি", change: "▼ ১.২%", up: false },
  { emoji: "🫙", name: "তেল", price: "১৭৫ টাকা/লিটার", change: "▲ ০.৮%", up: true },
  { emoji: "🥬", name: "সবজি", price: "৪০ টাকা/কেজি", change: "▼ ২.৫%", up: false },
  { emoji: "🐟", name: "মাছ", price: "২৮০ টাকা/কেজি", change: "▲ ১.৪%", up: true },
  { emoji: "🍗", name: "মাংস", price: "৩৫০ টাকা/কেজি", change: "▲ ১.১%", up: true },
  { emoji: "🥚", name: "ডিম", price: "৫৫ টাকা/হালি", change: "▼ ০.৬%", up: false },
  { emoji: "🌶️", name: "মসলা", price: "৮০ টাকা/কেজি", change: "▼ ০.৪%", up: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session, isPending } = useSession();

  const banglaDate = new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  async function handleSignOut() {
    try {
      await signOut();
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-green-100 bg-white text-gray-800">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex min-h-20 items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-700 p-1">
              <Image
                src="/logo-icon.png"
                alt="বাজার দর"
                width={40}
                height={40}
                priority
                className="h-full w-full object-contain"
              />
            </span>

            <span>
              <span className="block text-lg font-extrabold leading-6 text-green-800">
                বাজার দর
              </span>
              <span className="block text-xs text-gray-500">
                {banglaDate}
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            {isPending ? (
              <span className="text-xs text-gray-500 sm:text-sm">
                অপেক্ষা করো...
              </span>
            ) : session ? (
              <>
                <span className="hidden max-w-32 truncate text-sm font-medium text-green-800 sm:inline">
                  {session.user.name}
                </span>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-lg border border-red-600 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 sm:px-4 sm:text-sm"
                >
                  সাইন আউট
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-lg border border-green-700 px-3 py-2 text-xs font-semibold text-green-800 hover:bg-green-50 sm:px-4 sm:text-sm"
                >
                  সাইন ইন
                </Link>

                <Link
                  href="/signup"
                  className="rounded-lg bg-green-700 px-3 py-2 text-xs font-semibold text-white hover:bg-green-800 sm:px-4 sm:text-sm"
                >
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 py-2">
          <nav
            aria-label="পণ্যের ক্যাটাগরি"
            className="grid w-fit max-w-full grid-cols-8 gap-0"
          >
            {categories.map((category) => {
              const href = `/category/${category.slug}`;
              const active = pathname === href;

              return (
                <Link
                  key={category.slug}
                  href={href}
                  title={category.name}
                  className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-0 py-2 text-center transition sm:flex-row sm:gap-1 sm:px-0.5 ${
                    active
                      ? "bg-green-100 text-green-800"
                      : "text-gray-600 hover:bg-green-50 hover:text-green-800"
                  }`}
                >
                  <span
                    className="text-sm sm:text-base"
                    aria-hidden="true"
                  >
                    {category.emoji}
                  </span>

                  <span className="whitespace-nowrap text-[10px] font-medium sm:text-xs">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="overflow-hidden border-t border-green-100 bg-green-50 py-2">
        <div className="animate-marquee flex w-max items-center">
          {[...tickerItems, ...tickerItems].map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="flex shrink-0 items-center gap-2 border-r border-green-200 px-5 text-xs sm:text-sm"
            >
              <span>{item.emoji}</span>
              <span className="font-semibold text-gray-700">
                {item.name}
              </span>
              <span className="whitespace-nowrap text-gray-600">
                {item.price}
              </span>
              <span
                className={`whitespace-nowrap font-bold ${
                  item.up ? "text-red-600" : "text-green-700"
                }`}
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}