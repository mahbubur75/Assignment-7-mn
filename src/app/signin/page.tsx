import React from "react";

const SignINPage = () => {
return (
<div className="min-h-screen bg-[#f7faf7] px-4 pt-12">
<div className="mx-auto flex w-full max-w-md flex-col items-center">

    {/* Sign In Heading */}
    <h2 className="mb-3 text-center text-3xl font-bold text-green-700">
      সাইন ইন
    </h2>

    {/* Description */}
    <p className="mb-8 text-center text-sm text-gray-500">
      বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে প্রবেশ করুন।
    </p>

    {/* Sign In Card */}
    <form className="w-full">
      <fieldset className="fieldset w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

        <label className="label mb-1 text-gray-700">
          ইমেইল
        </label>

        <input
          type="email"
          name="email"
          className="input w-full rounded-xl border-gray-300 bg-white"
          placeholder="you@example.com"
          required
        />

        <label className="label mb-1 mt-3 text-gray-700">
          পাসওয়ার্ড
        </label>

        <input
          type="password"
          name="password"
          className="input w-full rounded-xl border-gray-300 bg-white"
          placeholder="কমপক্ষে ৮ অক্ষর"
          required
        />

        <button
          type="submit"
          className="btn mt-5 w-full rounded-xl border-0 bg-green-700 text-white hover:bg-green-800"
        >
          সাইন ইন
        </button>

      </fieldset>
    </form>

  </div>
</div>

);
};

export default SignINPage;