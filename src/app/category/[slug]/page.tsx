"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

type Product = {
  id: number | string;
  slug?: string;
  nameBn?: string;
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  image?: string;
  unit?: string;
  today?: number;
  yesterday?: number;
  change?: {
    dir?: string;
    pct?: number;
  };
};

const categoryNames: Record<string, string> = {
  chal: "চাল",
  dal: "ডাল",
  tel: "তেল",
  sobji: "সবজি",
  mach: "মাছ",
  mangsho: "মাংস",
  dim: "ডিম-দুধ",
  moshla: "মসলা",
};

function toNumber(value: unknown): number {
  if (typeof value === "number") return value;

  if (typeof value === "string") {
    const englishDigits = value
      .replace(/[০-৯]/g, (digit) =>
        String("০১২৩৪৫৬৭৮৯".indexOf(digit))
      )
      .replace(/,/g, "");

    return Number(englishDigits) || 0;
  }

  return 0;
}

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const slug = String(params.slug ?? "").toLowerCase();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/signup");
      return;
    }

    let active = true;

    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("পণ্য লোড করা যায়নি।");
        }

        const payload: unknown = await response.json();

        let items: unknown = payload;

        if (
          typeof payload === "object" &&
          payload !== null &&
          "data" in payload
        ) {
          items = (payload as { data: unknown }).data;
        }

        if (
          typeof items === "object" &&
          items !== null &&
          !Array.isArray(items) &&
          "products" in items
        ) {
          items = (items as { products: unknown }).products;
        }

        if (!Array.isArray(items)) {
          throw new Error("পণ্যের তালিকা পাওয়া যায়নি।");
        }

        if (active) {
          setProducts(items as Product[]);
        }
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "একটি সমস্যা হয়েছে।"
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [session, isPending, router]);

  const categoryProducts = useMemo(() => {
    const filtered = products.filter(
      (product) =>
        String(product.category ?? "").toLowerCase() === slug
    );

    if (sort === "low") {
      return [...filtered].sort(
        (a, b) => toNumber(a.today) - toNumber(b.today)
      );
    }

    if (sort === "high") {
      return [...filtered].sort(
        (a, b) => toNumber(b.today) - toNumber(a.today)
      );
    }

    return filtered;
  }, [products, slug, sort]);

  if (isPending || loading) {
    return (
      <main className="min-h-screen bg-[#f2f7f1] px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 h-8 w-48 animate-pulse rounded bg-green-100" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-56 animate-pulse rounded-2xl bg-white shadow-sm"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!session) return null;

  if (!(slug in categoryNames)) {
    return (
      <main className="px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">
          ক্যাটাগরি পাওয়া যায়নি
        </h1>

        <Link href="/" className="text-green-700 underline">
          হোম পেজে ফিরে যাও
        </Link>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 py-16 text-center">
        <p className="mb-4 text-red-600">{error}</p>

        <button
          onClick={() => router.refresh()}
          className="rounded-lg bg-green-700 px-5 py-2 text-white"
        >
          আবার চেষ্টা করো
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f2f7f1] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-5 inline-block text-green-700 hover:underline"
        >
          ← হোম পেজে ফিরে যাও
        </Link>

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
              {categoryNames[slug]} পণ্য
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              মোট পণ্য: {categoryProducts.length}টি
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label
              htmlFor="product-sort"
              className="text-sm font-medium text-gray-700"
            >
              দাম অনুযায়ী:
            </label>

            <select
              id="product-sort"
              value={sort}
              onChange={(event) =>
  setSort((event.target as HTMLSelectElement).value)
}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-green-600"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low">কম থেকে বেশি</option>
              <option value="high">বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="rounded-2xl bg-white px-5 py-16 text-center">
            <p className="mb-4 text-lg text-gray-600">
              এই ক্যাটাগরিতে কোনো পণ্য পাওয়া যায়নি।
            </p>

            <Link href="/" className="text-green-700 underline">
              সব পণ্য দেখো
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categoryProducts.map((product) => {
              const image = product.image || "";
              const isImageUrl = /^https?:\/\//i.test(image);
              const today = toNumber(product.today);
              const yesterday = toNumber(product.yesterday);

              const direction =
                product.change?.dir ||
                (today > yesterday
                  ? "up"
                  : today < yesterday
                    ? "down"
                    : "same");

              return (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  className="group rounded-2xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="mb-4 flex h-36 items-center justify-center rounded-xl bg-green-50">
                    {isImageUrl ? (
                      <Image
                        src={image}
                        alt={product.nameBn || "পণ্য"}
                        width={140}
                        height={140}
                        unoptimized
                        className="h-28 w-28 object-contain"
                      />
                    ) : (
                      <span className="text-6xl">
                        {image || product.categoryIcon || "🛒"}
                      </span>
                    )}
                  </div>

                  <p className="mb-2 text-sm text-gray-500">
                    {product.categoryIcon}{" "}
                    {product.categoryNameBn ||
                      categoryNames[slug]}
                  </p>

                  <h2 className="mb-3 text-lg font-bold text-gray-800 group-hover:text-green-700">
                    {product.nameBn || "পণ্যের নাম"}
                  </h2>

                  <p className="text-2xl font-bold text-green-700">
                    ৳{today.toLocaleString("bn-BD")}
                    <span className="ml-1 text-sm font-normal text-gray-500">
                      / {product.unit || "একক"}
                    </span>
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    গতকাল: ৳{yesterday.toLocaleString("bn-BD")}
                  </p>

                  <div className="mt-3">
                    {direction === "up" ? (
                      <span className="inline-block rounded-lg bg-red-50 px-3 py-1 text-sm text-red-600">
                        ▲ দাম বেড়েছে{" "}
                        {Number(product.change?.pct ?? 0)}%
                      </span>
                    ) : direction === "down" ? (
                      <span className="inline-block rounded-lg bg-green-50 px-3 py-1 text-sm text-green-700">
                        ▼ দাম কমেছে{" "}
                        {Number(product.change?.pct ?? 0)}%
                      </span>
                    ) : (
                      <span className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600">
                        দাম অপরিবর্তিত
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}