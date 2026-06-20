import { motion } from "framer-motion";
import { ArrowDown, BadgeCheck, Truck, WalletCards } from "lucide-react";
import { heroImage, trustBadges } from "../../data/content";
import { Button } from "../ui/Button";

export function Hero() {
  return (
    <section id="top" className="relative isolate min-h-screen overflow-hidden bg-slate-950 text-white">
      <motion.img
        alt="Pet parent grooming a dog at home"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        src={heroImage}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.92),rgba(15,23,42,0.58),rgba(15,23,42,0.18))]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-[#fff8ed] to-transparent" />

      <div className="mx-auto flex min-h-screen max-w-7xl items-center px-5 pb-24 pt-32 sm:px-8 lg:pb-16">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-5 text-lg font-black uppercase tracking-[0.34em] text-teal-200 sm:text-xl">
            FurEase India
          </p>
          <h1 className="max-w-3xl text-5xl font-black leading-[0.92] tracking-[-0.07em] text-white sm:text-7xl lg:text-8xl">
            Grooming that keeps fur off your sofa.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 sm:text-xl">
            Easy daily grooming for Indian dog and cat parents. Clean home, happy pet, simple Cash on Delivery ordering.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#order">
              <Button className="w-full bg-teal-400 px-7 py-4 text-slate-950 shadow-teal-950/30 hover:bg-teal-300 sm:w-auto">
                Order Now <ArrowDown className="h-4 w-4" />
              </Button>
            </a>
            <a href="#products">
              <Button className="w-full border border-white/20 bg-white/10 px-7 py-4 text-white backdrop-blur hover:bg-white/20 sm:w-auto">
                View Product
              </Button>
            </a>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-white/90">
            {trustBadges.map((badge, index) => (
              <motion.span
                className="inline-flex items-center gap-2"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.45, delay: 0.45 + index * 0.08 }}
                key={badge}
              >
                {index === 0 ? <WalletCards className="h-4 w-4 text-teal-200" /> : null}
                {index === 1 ? <Truck className="h-4 w-4 text-teal-200" /> : null}
                {index > 1 ? <BadgeCheck className="h-4 w-4 text-teal-200" /> : null}
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}