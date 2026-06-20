import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/layout/Header";
import { Benefits } from "../components/landing/Benefits";
import { Faq } from "../components/landing/Faq";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { IndianParents } from "../components/landing/IndianParents";
import { OrderForm } from "../components/landing/OrderForm";
import { ProductShowcase } from "../components/landing/ProductShowcase";
import { Reviews } from "../components/landing/Reviews";
import { fallbackProduct } from "../data/content";
import { supabase } from "../lib/supabase";
import type { Product } from "../types";
import { BrandMark } from "../components/ui/BrandMark";

type LandingPageProps = {
  onAdmin: () => void;
};

export function LandingPage({ onAdmin }: LandingPageProps) {
  const [products, setProducts] = useState<Product[]>([fallbackProduct]);
  const [selectedProduct, setSelectedProduct] = useState<Product>(fallbackProduct);
  const [quantity, setQuantity] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoadingProducts(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setProductError(
          error.message.includes("relation")
            ? "Products table is not ready. Run the SQL setup script in Supabase."
            : error.message,
        );
        setProducts([fallbackProduct]);
        setSelectedProduct(fallbackProduct);
      } else if (data && data.length > 0) {
        const nextProducts = data as Product[];
        setProductError(null);
        setProducts(nextProducts);
        setSelectedProduct(nextProducts[0]);
      } else {
        setProductError(null);
        setProducts([fallbackProduct]);
        setSelectedProduct(fallbackProduct);
      }

      setLoadingProducts(false);
    }

    loadProducts();
    return () => {
      active = false;
    };
  }, []);

  const safeProducts = useMemo(() => (products.length ? products : [fallbackProduct]), [products]);

  const handleProductOrder = (product: Product, nextQuantity: number) => {
    setSelectedProduct(product);
    setQuantity(Math.max(1, nextQuantity));
    document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#fff8ed] text-slate-900">
      <Header onAdmin={onAdmin} />
      <Hero />
      <main>
        <ProductShowcase error={productError} loading={loadingProducts} onOrder={handleProductOrder} products={safeProducts} />
        <Benefits />
        <HowItWorks />
        <IndianParents />
        <Reviews />
        <Faq />
        <OrderForm
          initialQuantity={quantity}
          onProductChange={setSelectedProduct}
          onQuantityChange={(next) => setQuantity(Math.max(1, next))}
          products={safeProducts}
          selectedProduct={selectedProduct}
        />
      </main>
      <Footer onAdmin={onAdmin} />
      <a
        className="fixed inset-x-4 bottom-4 z-50 rounded-full bg-slate-950 px-5 py-4 text-center text-sm font-black text-white shadow-2xl shadow-slate-950/30 md:hidden"
        href="#order"
      >
        Order Now - Cash on Delivery
      </a>
    </div>
  );
}

function Footer({ onAdmin }: { onAdmin: () => void }) {
  return (
    <footer className="bg-slate-950 px-5 pb-24 pt-12 text-white md:pb-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <BrandMark light />
        <div className="flex flex-wrap gap-4 text-sm font-semibold text-white/70">
          <a className="hover:text-white" href="#products">Products</a>
          <a className="hover:text-white" href="#order">COD Order</a>
          <button className="hover:text-white" onClick={onAdmin} type="button">Admin Login</button>
        </div>
      </div>
    </footer>
  );
}