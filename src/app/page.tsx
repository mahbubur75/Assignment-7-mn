import Banner from "@/components/Banner";
import Products from "@/components/Products";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#f2f7f1]">
      {/* Banner and Products will be added separately */}
      <Banner />
      <Products />
    </main>
  );
}