"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number | string;
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
  markets?: Market[];
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
        setProduct(null);

        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("পণ্যের তথ্য পাওয়া যায়নি।");
        }

        const payload: unknown = await response.json();

        let item: unknown = payload;

        if (
          typeof payload === "object" &&
          payload !== null &&
          "data" in payload
        ) {
          const data = (payload as { data: unknown }).data;

          if (
            typeof data === "object" &&
            data !== null &&
            "product" in data
          ) {
            item = (data as { product: unknown }).product;
          } else {
            item = data;
          }
        }

        if (
          typeof item !== "object" ||
          item === null ||
          !("id" in item)
        ) {
          throw new Error("পণ্যের তথ্য সঠিকভাবে পাওয়া যায়নি।");
        }

        if (active) {
          setProduct(item as Product);
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
          {error || "পণ্যের তথ্য পাওয়া যায়নি।"}
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
              <span className="text-7xl">
                {image || "🛒"}
              </span>
            )}
          </div>

          <div>
            <p className="mb-2 text-sm text-gray-500">
              {product.categoryIcon}{" "}
              {product.categoryNameBn ||
                product.category ||
                "অন্যান্য"}
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
              গতকালের দাম: ৳
              {yesterday.toLocaleString("bn-BD")}
            </p>

            {direction === "up" ? (
              <p className="mb-5 inline-block rounded-lg bg-red-50 px-3 py-2 text-red-600">
                ▲ দাম বেড়েছে{" "}
                {Number(product.change?.pct ?? 0)}%
              </p>
            ) : direction === "down" ? (
              <p className="mb-5 inline-block rounded-lg bg-green-50 px-3 py-2 text-green-700">
                ▼ দাম কমেছে{" "}
                {Number(product.change?.pct ?? 0)}%
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
                {product.description ||
                  `${product.nameBn || "এই পণ্য"}-এর বর্তমান বাজারদর ৳${today.toLocaleString("bn-BD")} প্রতি ${product.unit || "একক"}।`}
              </p>
            </div>
          </div>
        </div>

        {product.markets && product.markets.length > 0 && (
          <section className="mt-8 rounded-2xl bg-white p-5 shadow-sm sm:p-8">
            <h2 className="mb-5 text-xl font-bold text-gray-800">
              বিভিন্ন বাজারের দাম
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full min-w-120 text-left">
                <thead>
                  <tr className="border-b bg-green-50 text-gray-700">
                    <th className="p-3">বাজার</th>
                    <th className="p-3">বিভাগ</th>
                    <th className="p-3">সর্বনিম্ন</th>
                    <th className="p-3">সর্বোচ্চ</th>
                  </tr>
                </thead>

                <tbody>
                  {product.markets.map((market, index) => (
                    <tr
                      key={`${market.market}-${index}`}
                      className="border-b border-gray-100"
                    >
                      <td className="p-3 text-gray-800">
                        {market.market}
                      </td>
                      <td className="p-3 text-gray-600">
                        {market.division}
                      </td>
                      <td className="p-3 font-medium text-green-700">
                        ৳{Number(market.min).toLocaleString("bn-BD")}
                      </td>
                      <td className="p-3 font-medium text-gray-800">
                        ৳{Number(market.max).toLocaleString("bn-BD")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}