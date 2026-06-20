import { Check, Home, Scissors, Sparkle } from "lucide-react";
import { AnimatedSection } from "../ui/AnimatedSection";

const steps = [
  { title: "Brush your pet", text: "Use gentle strokes along your pet's coat.", icon: Scissors },
  { title: "Collect loose fur", text: "Fine bristles lift loose hair before it reaches your floor.", icon: Sparkle },
  { title: "Clean brush easily", text: "Press, remove the fur layer, and rinse when needed.", icon: Check },
  { title: "Enjoy a cleaner home", text: "More fresh corners, cushions, and cuddle spots.", icon: Home },
];

export function HowItWorks() {
  return (
    <AnimatedSection className="max-w-none bg-slate-950 px-0 py-0 text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-200">How It Works</p>
          <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-6xl">
            Four simple steps after your morning chai.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div className="relative border-t border-white/15 pt-6" key={step.title}>
                <span className="text-sm font-black text-teal-200">0{index + 1}</span>
                <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-black">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{step.text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}