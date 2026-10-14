"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

type Product = {
  id?: string | number;
  slug?: string;
  nameBn?: string;
  categoryNameBn?: string;
  category?: string;
  categoryIcon?: string;
  image?: string;
  unit?: string;
  today?: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  description?: string;
  change?: {
    dir?: string;
    pct?: number;
  };
};

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const id = String(params.id ?? "");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/signup");
      return;
    }

    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য পাওয়া যায়নি।");
        }

        const payload: unknown = await response.json();

        if (
          typeof payload === "object" &&
          payload !== null &&
          "data" in payload
        ) {
          const data = payload.data;

          if (
            typeof data === "object" &&
            data !== null &&
            "product" in data
          ) {
            const item = data.product;

            if (active && item && typeof item === "object") {
              setProduct(item as Product);
            }
          } else if (
            data &&
            typeof data === "object" &&
            ("nameBn" in data || "today" in data)
          ) {
            if (active) setProduct(data as Product);
          }
        }
      } catch (err: unknown) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "একটি সমস্যা হয়েছে।"
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [id, session, isPending, router]);

  if (isPending || loading) {
    return (
      <main className="p-10 text-center text-green-700">
        পণ্যের তথ্য লোড হচ্ছে...
      </main>
    );
  }

  if (!session) return null;

  if (error || !product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-12 text-center">
        <p className="mb-4 text-red-600">
          {error || "পণ্যের তথ্য পাওয়া যায়নি।"}
        </p>
        <Link href="/" className="text-green-700 underline">
          হোম পেজে ফিরে যাও
        </Link>
      </main>
    );
  }

  const today = Number(product.today ?? 0);
  const yesterday = Number(product.yesterday ?? 0);
  const direction =
    product.change?.dir ||
    (today > yesterday
      ? "up"
      : today < yesterday
        ? "down"
        : "same");

  const image = product.image || "";
  const isImageUrl = /^https?:\/\//i.test(image);

  return (
    <main className="min-h-screen bg-[#f2f7f1] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/"
          className="mb-6 inline-block font-medium text-green-700 hover:underline"
        >
          ← হোম পেজে ফিরে যাও
        </Link>

        <div className="grid gap-8 rounded-2xl bg-white p-5 shadow-sm sm:p-8 md:grid-cols-2">
          <div className="flex min-h-64 items-center justify-center rounded-xl bg-green-50 p-5">
            {isImageUrl ? (
              <Image
  src={image}
  alt={product.nameBn || "পণ্য"}
  width={300}
  height={320}
  unoptimized
  className="max-h-80 w-full object-contain"
/>
            ) : (
              <span className="text-7xl">{image || "🛒"}</span>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-500">
              {product.categoryIcon}{" "}
              {product.categoryNameBn || product.category || "অন্যান্য"}
            </p>

            <h1 className="mb-5 text-3xl font-bold text-gray-800">
              {product.nameBn || "পণ্যের বিস্তারিত"}
            </h1>

            <p className="mb-2 text-3xl font-bold text-green-700">
              ৳{today.toLocaleString("bn-BD")}
              <span className="ml-2 text-base font-normal text-gray-500">
                / {product.unit || "একক"}
              </span>
            </p>

            <p className="mb-5 text-gray-500">
              গতকালের দাম: ৳{yesterday.toLocaleString("bn-BD")}
            </p>

            {direction === "up" ? (
              <p className="mb-5 inline-block rounded-lg bg-red-50 px-3 py-2 text-red-600">
                ▲ দাম বেড়েছে {Number(product.change?.pct ?? 0)}%
              </p>
            ) : direction === "down" ? (
              <p className="mb-5 inline-block rounded-lg bg-green-50 px-3 py-2 text-green-700">
                ▼ দাম কমেছে {Number(product.change?.pct ?? 0)}%
              </p>
            ) : (
              <p className="mb-5 inline-block rounded-lg bg-gray-100 px-3 py-2 text-gray-600">
                দাম অপরিবর্তিত
              </p>
            )}

            <div className="border-t border-gray-100 pt-5">
              <h2 className="mb-2 text-lg font-bold text-gray-800">
                পণ্যের বিবরণ
              </h2>
              <p className="leading-7 text-gray-600">
                {product.description || "এই পণ্যের অতিরিক্ত বিবরণ দেওয়া নেই।"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}