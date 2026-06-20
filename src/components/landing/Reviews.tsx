import { Star } from "lucide-react";
import { reviews } from "../../data/content";
import { AnimatedSection } from "../ui/AnimatedSection";

export function Reviews() {
  return (
    <AnimatedSection id="reviews">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-700">Customer Reviews</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl">
          Realistic love from everyday pet homes.
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review) => (
          <figure className="border-t border-slate-200 pt-5" key={review.name}>
            <div className="flex gap-1 text-amber-400" aria-label="5 star rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star className="h-4 w-4 fill-current" key={star} />
              ))}
            </div>
            <blockquote className="mt-5 text-sm leading-7 text-slate-700">"{review.review}"</blockquote>
            <figcaption className="mt-5">
              <p className="font-black text-slate-950">{review.name}</p>
              <p className="text-sm font-semibold text-teal-700">{review.city}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    </AnimatedSection>
  );
}