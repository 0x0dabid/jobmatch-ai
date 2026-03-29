// Stripe integration for JobMatch AI
// Environment variables: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, NEXT_PUBLIC_STRIPE_PRICE_PRO, NEXT_PUBLIC_STRIPE_PRICE_PREMIUM

import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia",
});

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
