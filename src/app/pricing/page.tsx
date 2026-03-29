"use client";

import { useState } from "react";

const plans = [
  {
    key: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try it out",
    features: [
      "3 AI analyses per month",
      "Job fit score & gap analysis",
      "Tailored resume",
      "Cover letter",
      "Interview prep questions",
    ],
    cta: "Current Plan",
    disabled: true,
    popular: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For active job seekers",
    features: [
      "Unlimited AI analyses",
      "Everything in Free",
      "Priority processing",
      "Job search integration",
      "Application tracking",
      "Resume version history",
    ],
    cta: "Upgrade to Pro",
    disabled: false,
    popular: true,
  },
  {
    key: "premium",
    name: "Premium",
    price: "$39",
    period: "/month",
    description: "For serious career moves",
    features: [
      "Everything in Pro",
      "Interview coaching AI",
      "Salary negotiation AI",
      "Career path recommendations",
      "LinkedIn profile optimizer",
      "Priority support",
      "Cancel anytime",
    ],
    cta: "Upgrade to Premium",
    disabled: false,
    popular: false,
  },
];

export default function Pricing() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (planKey: string) => {
    setLoading(planKey);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Failed to start checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-bold">
            Job<span className="text-indigo-400">Match</span> AI
          </a>
          <a
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          Simple Pricing
        </h1>
        <p className="text-center text-zinc-400 text-lg mb-16">
          Start free. Upgrade when you need more.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative bg-[var(--surface)] border rounded-2xl p-8 flex flex-col ${
                plan.popular
                  ? "border-indigo-500/50 shadow-lg shadow-indigo-500/10"
                  : "border-[var(--border)]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-sm text-zinc-500">{plan.description}</p>
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-zinc-500">{plan.period}</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="text-indigo-400 mt-0.5 shrink-0">&#10003;</span>
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !plan.disabled && handleUpgrade(plan.key)}
                disabled={plan.disabled || loading === plan.key}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : plan.disabled
                      ? "bg-white/5 text-zinc-500 cursor-default"
                      : "bg-white/5 border border-white/10 hover:bg-white/10 text-white"
                }`}
              >
                {loading === plan.key ? "Redirecting..." : plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-zinc-500 text-sm mt-12">
          All plans include access to our AI analysis engine. Cancel anytime.
          <br />
          Questions? Email support@jobmatch-ai.com
        </p>
      </div>
    </main>
  );
}
