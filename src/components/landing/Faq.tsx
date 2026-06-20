import { ChevronDown } from "lucide-react";
import { faqs } from "../../data/content";
import { AnimatedSection } from "../ui/AnimatedSection";

export function Faq() {
  return (
    <AnimatedSection className="grid gap-10 lg:grid-cols-[0.7fr_1fr]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-700">FAQ</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl">
          Quick answers before you order.
        </h2>
      </div>
      <div className="divide-y divide-slate-200 rounded-[2rem] bg-white px-5 ring-1 ring-slate-100">
        {faqs.map((faq) => (
          <details className="group py-5" key={faq.question}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-black text-slate-950">
              {faq.question}
              <ChevronDown className="h-5 w-5 shrink-0 transition group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{faq.answer}</p>
          </details>
        ))}
      </div>
    </AnimatedSection>
  );
}