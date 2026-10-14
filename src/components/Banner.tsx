import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-6 pb-5 sm:pt-7">
      <div className="flex min-h-55 flex-col items-center justify-between gap-5 rounded-2xl border border-green-100 bg-[#f8fcf7] px-5 py-6 shadow-sm sm:min-h-58.75 sm:flex-row sm:px-8 sm:py-7 md:px-10">
        {/* Left Side: Text */}
        <div className="w-full flex-1">
          <p className="mb-3 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800 sm:text-sm">
            মঙ্গলবার, ৬ অক্টোবর, ২০২৬
          </p>

          <h1 className="mb-3 text-2xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-3xl md:text-4xl">
            আজকের বাজারের দাম এক নজরে
          </h1>

          <p className="mb-5 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            চাল,ডাল,তেল,সবজি,মাছ,মাংস,ডিম ও মসলার দাম-বাজারভিত্তিক বিস্তারিত,গড়,
            সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>

          <Link
            href="/#সব-পণ্য"
            className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 sm:text-base"
          >
            সব পণ্য দেখুন
          </Link>
        </div>

        {/* Right Side: Hero Image */}
        <div className="relative flex w-full shrink-0 items-center justify-center sm:w-[30%] md:w-[32%]">
          <Image
            src="/bazar-hero.png"
            alt="বাজারের তাজা পণ্যের ঝুড়ি"
            width={300}
            height={220}
            priority
            className="h-auto max-h-47.5 w-full max-w-62.5 object-contain sm:max-h-50 sm:max-w-70"
          />
        </div>
      </div>
    </section>
  );
}