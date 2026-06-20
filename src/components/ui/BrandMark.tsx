import { PawPrint } from "lucide-react";

export function BrandMark({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-500 text-white shadow-lg shadow-teal-900/20">
        <PawPrint className="h-5 w-5" />
      </div>
      <div>
        <p className={`text-lg font-black tracking-tight ${light ? "text-white" : "text-slate-950"}`}>
          FurEase India
        </p>
        <p className={`text-[11px] font-semibold uppercase tracking-[0.28em] ${light ? "text-white/70" : "text-teal-700"}`}>
          COD Pet Care
        </p>
      </div>
    </div>
  );
}