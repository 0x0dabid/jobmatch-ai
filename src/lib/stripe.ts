// Stripe integration for JobMatch AI
// Lazy initialization so it doesn't crash at build time without keys

import Stripe from "stripe";

let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(key, {
      apiVersion: "2026-03-25.dahlia",
    });
  }
  return _stripe;
}

export const PLANS: Record<
  string,
  {
    name: string;
    price: number;
    priceId?: string;
    analysesPerMonth: number;
    features: string[];
  }
> = {
  free: {
    name: "Free",
    price: 0,
    analysesPerMonth: 3,
    features: [
      "3 AI analyses per month",
      "Fit score & gap analysis",
      "Tailored resume",
      "Cover letter",
      "Interview prep",
    ],
  },
  pro: {
    name: "Pro",
    price: 19,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || "",
    analysesPerMonth: Infinity,
    features: [
      "Unlimited AI analyses",
      "Everything in Free",
      "Priority processing",
      "Job search integration",
      "Application tracking",
    ],
  },
  premium: {
    name: "Premium",
    price: 39,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM || "",
    analysesPerMonth: Infinity,
    features: [
      "Everything in Pro",
      "Interview coaching AI",
      "Salary negotiation AI",
      "Career path recommendations",
      "Priority support",
    ],
  },
};

export type PlanKey = keyof typeof PLANS;
