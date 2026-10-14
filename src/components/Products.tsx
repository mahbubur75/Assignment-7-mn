"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";

const API_URL =
  "https://openapi.programming-hero.com/api/bazardor/products";

type Market = {
  market?: string;
  division?: string;
  min?: number;
  max?: number;
};

type Product = {
  id: string | number;
  slug?: string;
  nameBn?: string;
  category?: string;
  categoryNameBn?: string;
  categoryIcon?: string;
  unit?: string;
  image?: string;
  today?: number;
  yesterday?: number;
  lastWeek?: number;
  lastMonth?: number;
  change?: {
    dir?: "up" | "down" | "same" | string;
    pct?: number;
  };
  markets?: Market[];
};

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const today = Number(product.today ?? 0);
  const yesterday = Number(product.yesterday ?? 0);

  const direction =
    product.change?.dir ||
    (today > yesterday
      ? "up"
      : today < yesterday
        ? "down"
        : "same");

  const changePercent = Number(product.change?.pct ?? 0);
  const image = product.image || "🛒";
  const isImageUrl = /^https?:\/\//i.test(image);

  const productPath = `/product/${product.id}`;

  function handleProductClick(
    event: React.MouseEvent<HTMLAnchorElement>
  ) {
    // Session check শেষ না হওয়া পর্যন্ত এগোবে না
    if (isPending) {
      event.preventDefault();
      return;
    }

    // লগইন না থাকলে Sign Up পেজে পাঠাবে
    if (!session) {
      event.preventDefault();
      router.push("/signup");
    }

    // লগইন থাকলে Link স্বাভাবিকভাবে Details পেজে যাবে
  }

  return (
    <Link
      href={productPath}
      onClick={handleProductClick}
      aria-disabled={isPending}
      className="block rounded-xl border border-green-100 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="mb-2 flex h-20 items-center justify-center overflow-hidden rounded-lg bg-green-50">
        {isImageUrl ? (
          <Image
            src={image}
            alt={product.nameBn || "পণ্য"}
            width={300}
            height={200}
            unoptimized
            className="h-full w-full object-contain"
          />
        ) : (
          <span className="text-5xl">{image}</span>
        )}
      </div>

      <p className="mb-1 text-sm text-gray-500">
        {product.categoryIcon}{" "}
        {product.categoryNameBn || product.category || "অন্যান্য"}
      </p>

      <h3 className="mb-3 min-h-12 font-bold text-gray-800">
        {product.nameBn || "পণ্যের নাম নেই"}
      </h3>

      <p className="text-xl font-bold text-green-700">
        ৳{today.toLocaleString("bn-BD")}
        <span className="ml-1 text-sm font-normal text-gray-500">
          / {product.unit || "একক"}
        </span>
      </p>

      <p className="mt-1 text-sm text-gray-500">
        গতকাল: ৳{yesterday.toLocaleString("bn-BD")}
      </p>

      {direction === "up" ? (
        <p className="mt-3 inline-block rounded-md bg-red-50 px-2 py-1 text-sm text-red-600">
          ▲ দাম বেড়েছে {changePercent}%
        </p>
      ) : direction === "down" ? (
        <p className="mt-3 inline-block rounded-md bg-green-50 px-2 py-1 text-sm text-green-700">
          ▼ দাম কমেছে {changePercent}%
        </p>
      ) : (
        <p className="mt-3 inline-block rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-500">
          দাম অপরিবর্তিত
        </p>
      )}
    </Link>
  );
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("API থেকে তথ্য আনা যায়নি।");
        }

        const payload: unknown = await response.json();

        let list: Product[] = [];

        if (Array.isArray(payload)) {
          list = payload as Product[];
        } else if (
          typeof payload === "object" &&
          payload !== null &&
          "data" in payload
        ) {
          const data = payload.data;

          if (Array.isArray(data)) {
            list = data as Product[];
          } else if (
            typeof data === "object" &&
            data !== null &&
            "products" in data &&
            Array.isArray(data.products)
          ) {
            list = data.products as Product[];
          }
        }

        if (list.length === 0) {
          throw new Error(
            "পণ্যের তালিকা পাওয়া যায়নি। API response পরীক্ষা করতে হবে।"
          );
        }

        if (active) {
          setProducts(list);
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
        if (active) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [retry]);

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 text-center text-green-700">
        পণ্যের তথ্য লোড হচ্ছে...
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-6xl px-4 py-12 text-center">
        <p className="mb-4 text-red-600">{error}</p>

        <button
          onClick={() => setRetry((value) => value + 1)}
          className="rounded-lg bg-green-700 px-5 py-2 text-white"
        >
          আবার চেষ্টা করো
        </button>
      </section>
    );
  }

  const rising = products
    .filter((p) => p.change?.dir === "up")
    .slice(0, 6);

  const falling = products
    .filter((p) => p.change?.dir === "down")
    .slice(0, 6);

  function renderCards(items: Product[]) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
        {items.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          <span className="mr-2 text-red-600">▲</span>
          আজ দাম বেড়েছে
        </h2>

        {rising.length > 0 ? (
          renderCards(rising)
        ) : (
          <p className="rounded-lg bg-white p-5 text-gray-500">
            দাম বৃদ্ধির তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          <span className="mr-2 text-green-600">▼</span>
          আজ দাম কমেছে
        </h2>

        {falling.length > 0 ? (
          renderCards(falling)
        ) : (
          <p className="rounded-lg bg-white p-5 text-gray-500">
            দাম কমার তথ্য পাওয়া যায়নি।
          </p>
        )}
      </section>

      <section id="সব-পণ্য">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">
          সব পণ্য
        </h2>

        {renderCards(products)}
      </section>
    </div>
  );
}