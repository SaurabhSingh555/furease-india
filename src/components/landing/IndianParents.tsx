import { BadgeIndianRupee, MessageCircle, PackageCheck, ShieldCheck, Timer } from "lucide-react";
import { AnimatedSection } from "../ui/AnimatedSection";

const reasons = [
  ["COD available", "Pay only when your FurEase order arrives at your doorstep.", BadgeIndianRupee],
  ["Quick ordering", "No account creation, no app download, no long checkout.", Timer],
  ["No complicated payment", "Perfect for families that prefer simple cash payment.", ShieldCheck],
  ["Daily grooming friendly", "Suitable for regular brushing for dogs and cats.", PackageCheck],
];

export function IndianParents() {
  return (
    <AnimatedSection className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.28em] text-teal-700">Made For India</p>
        <h2 className="mt-3 text-4xl font-black tracking-[-0.05em] text-slate-950 sm:text-6xl">
          Why Indian pet parents love it.
        </h2>
        <p className="mt-5 text-lg leading-8 text-slate-600">
          FurEase India is built around practical grooming, budget-friendly pricing, and a COD flow that feels familiar.
        </p>
        <div className="mt-7 inline-flex max-w-xl items-start gap-3 rounded-[2rem] bg-emerald-50 p-5 text-emerald-950 ring-1 ring-emerald-100">
          <MessageCircle className="mt-1 h-5 w-5 shrink-0" />
          <p className="text-sm font-semibold leading-6">
            WhatsApp-style confirmation: add your active mobile number so our team can confirm address and delivery updates quickly.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {reasons.map(([title, text, Icon]) => (
          <div className="flex gap-4 rounded-3xl bg-white p-5 ring-1 ring-slate-100" key={title as string}>
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-800">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-950">{title as string}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">{text as string}</p>
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}