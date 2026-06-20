import type { Product } from "../types";

export const heroImage =
  "https://images.pexels.com/photos/8498543/pexels-photo-8498543.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600";

export const fallbackProduct: Product = {
  id: "fallback-furease-brush",
  product_name: "FurEase Self-Cleaning Grooming Brush",
  description:
    "A gentle everyday brush for dogs and cats that lifts loose fur, keeps your sofa cleaner, and rinses clean in seconds.",
  price: 499,
  original_price: 999,
  image_url: "/images/furease-brush.png",
  category: "Grooming",
  stock: 120,
  is_active: true,
  created_at: null,
  updated_at: null,
};

export const trustBadges = ["Cash on Delivery", "Quick Delivery", "Easy Order", "Pet Safe"];

export const benefits = [
  "Removes loose fur easily",
  "Helps reduce shedding",
  "Gentle on pets",
  "Easy to clean",
  "Comfortable grip",
  "Suitable for dogs and cats",
  "Keeps home cleaner",
];

export const reviews = [
  {
    name: "Priya S.",
    city: "Bengaluru",
    review: "My indie dog sheds a lot during season change. This brush removes fur quickly and he does not run away from it.",
  },
  {
    name: "Rohan M.",
    city: "Pune",
    review: "Ordered COD for my Persian cat. The brush is gentle and the cleaning button makes it super convenient.",
  },
  {
    name: "Anjali K.",
    city: "Delhi",
    review: "Our sofa looks cleaner now. Simple product, good grip, and the ordering process was very easy.",
  },
  {
    name: "Neha P.",
    city: "Ahmedabad",
    review: "Budget friendly and actually useful for daily grooming. I ordered one more for my sister's labrador.",
  },
];

export const faqs = [
  {
    question: "Is Cash on Delivery available?",
    answer: "Yes. FurEase India accepts Cash on Delivery orders directly from this landing page.",
  },
  {
    question: "Is it safe for dogs and cats?",
    answer: "Yes. The brush is designed to be gentle for regular grooming on most dog and cat coats.",
  },
  {
    question: "How many days delivery takes?",
    answer: "Most orders are delivered in 3 to 7 working days depending on your pincode.",
  },
  {
    question: "Can I order more than one quantity?",
    answer: "Yes. Select the quantity on the product or order form before placing the COD order.",
  },
  {
    question: "How can I track my order?",
    answer: "Our team confirms details on your WhatsApp/mobile number and shares shipping updates after dispatch.",
  },
  {
    question: "What if I entered wrong details?",
    answer: "Reply to the confirmation message as soon as possible so the team can correct your details before shipping.",
  },
];