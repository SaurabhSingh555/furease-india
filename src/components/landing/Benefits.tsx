import { Brush, Cat, CheckCircle2, Dog, Home, ShieldCheck, Sparkles } from "lucide-react";
import { benefits } from "../../data/content";
import { AnimatedSection } from "../ui/AnimatedSection";

const icons = [Brush, Sparkles, ShieldCheck, CheckCircle2, Home, Dog, Cat];

export function Benefits() {
  return (
    <AnimatedSection id="benefits" className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-700">Daily Fur Control</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl">
          Less loose fur. More cuddle time.
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          FurEase helps Indian pet parents keep grooming simple between salon visits, especially during shedding season.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {benefits.map((benefit, index) => {
          const Icon = icons[index] ?? CheckCircle2;
          return (
            <div className="flex items-center gap-4 rounded-3xl bg-white/70 p-4 ring-1 ring-slate-100" key={benefit}>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-800">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-bold text-slate-800">{benefit}</p>
            </div>
          );
        })}
      </div>
    </AnimatedSection>
  );
}