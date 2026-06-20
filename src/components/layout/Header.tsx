import { Menu, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { BrandMark } from "../ui/BrandMark";
import { Button } from "../ui/Button";

type HeaderProps = {
  onAdmin: () => void;
};

const navItems = [
  ["Products", "#products"],
  ["Benefits", "#benefits"],
  ["Reviews", "#reviews"],
  ["Order", "#order"],
];

export function Header({ onAdmin }: HeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-white/40 bg-white/80 px-4 py-3 shadow-sm shadow-slate-900/5 backdrop-blur-2xl">
        <a href="#top" aria-label="FurEase India home">
          <BrandMark />
        </a>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-slate-700 md:flex">
          {navItems.map(([label, href]) => (
            <a key={href} className="transition hover:text-teal-700" href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            onClick={onAdmin}
            type="button"
          >
            <ShieldCheck className="h-4 w-4" /> Admin
          </button>
          <a href="#order">
            <Button className="px-5 py-2.5">Order Now</Button>
          </a>
        </div>

        <button
          aria-label="Open menu"
          className="rounded-full p-2 text-slate-800 md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-3xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-950/10 md:hidden">
          <div className="grid gap-2">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-teal-50"
                href={href}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
            <button
              className="rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-teal-50"
              onClick={() => {
                setOpen(false);
                onAdmin();
              }}
              type="button"
            >
              Admin Login
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}