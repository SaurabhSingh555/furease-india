import { Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Product } from "../../types";
import { currency, getDiscount } from "../../lib/format";
import { AnimatedSection } from "../ui/AnimatedSection";
import { Button } from "../ui/Button";

type ProductShowcaseProps = {
  products: Product[];
  loading: boolean;
  error?: string | null;
  onOrder: (product: Product, quantity: number) => void;
};

export function ProductShowcase({ products, loading, error, onOrder }: ProductShowcaseProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const setQuantity = (productId: string, next: number) => {
    setQuantities((current) => ({ ...current, [productId]: Math.max(1, next) }));
  };

  return (
    <AnimatedSection id="products" className="relative">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-700">Shop FurEase</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl">
          Pet grooming essentials that feel premium, not complicated.
        </h2>
        <p className="mt-4 text-lg leading-8 text-slate-600">
          Active products are loaded from Supabase. Add or disable products in admin and this section updates automatically.
        </p>
      </div>

      {error ? (
        <div className="mb-6 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-900">
          {error} Showing a clean fallback product so customers can still understand the offer.
        </div>
      ) : null}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div className="h-96 animate-pulse rounded-[2rem] bg-slate-100" key={item} />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const quantity = quantities[product.id] ?? 1;
            const discount = getDiscount(product.price, product.original_price);

            return (
              <article
                className="group overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl shadow-slate-950/[0.04] transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-950/[0.08]"
                key={product.id}
              >
                <div className="relative aspect-square bg-gradient-to-br from-teal-50 via-amber-50 to-rose-50 p-6">
                  {discount > 0 ? (
                    <div className="absolute left-5 top-5 rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">
                      {discount}% OFF
                    </div>
                  ) : null}
                  <img
                    alt={product.product_name}
                    className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                    src={product.image_url || "/images/furease-brush.png"}
                  />
                </div>
                <div className="p-6">
                  <div className="mb-3 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-teal-700">
                    <Sparkles className="h-4 w-4" /> {product.category || "Pet Grooming"}
                  </div>
                  <h3 className="text-2xl font-black tracking-[-0.04em] text-slate-950">
                    {product.product_name}
                  </h3>
                  <p className="mt-3 min-h-20 text-sm leading-6 text-slate-600">{product.description}</p>
                  <div className="mt-5 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-3xl font-black text-slate-950">{currency.format(product.price)}</p>
                      {product.original_price ? (
                        <p className="text-sm font-semibold text-slate-400 line-through">
                          {currency.format(product.original_price)}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                      <button
                        aria-label="Decrease quantity"
                        className="rounded-full p-2 text-slate-600 hover:bg-white"
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        type="button"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-8 text-center text-sm font-black">{quantity}</span>
                      <button
                        aria-label="Increase quantity"
                        className="rounded-full p-2 text-slate-600 hover:bg-white"
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        type="button"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <Button className="mt-6 w-full" onClick={() => onOrder(product, quantity)}>
                    <ShoppingBag className="h-4 w-4" /> Order Now
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AnimatedSection>
  );
}