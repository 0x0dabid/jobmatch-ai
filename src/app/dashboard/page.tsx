"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getUsage,
  incrementUsage,
  canAnalyze,
  getRemainingFree,
  getDaysUntilReset,
} from "@/lib/usage";

type AnalysisResult = {
  fitScore: number;
  strengths: string[];
  gaps: string[];
  tailoredResume: string;
  coverLetter: string;
  interviewQuestions: { q: string; a: string }[];
  salaryRange: { min: number; max: number; currency: string };
  tips: string[];
};

type Job = {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  applyUrl: string;
  postedAt: string;
  salary: string | null;
  logo: string;
};

export default function Dashboard() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "score" | "resume" | "cover" | "interview" | "tips"
  >("score");

  // Usage tracking
  const [remaining, setRemaining] = useState<number>(3);
  const [daysUntilReset, setDaysUntilReset] = useState<number>(30);
  const [showPaywall, setShowPaywall] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Job search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searching, setSearching] = useState(false);
  const [showJobSearch, setShowJobSearch] = useState(false);

  useEffect(() => {
    // Check if user just upgraded
    const params = new URLSearchParams(window.location.search);
    if (params.get("upgraded") === "true") {
      setIsPro(true);
      window.history.replaceState({}, "", "/dashboard");
    }

    // Load usage
    setRemaining(getRemainingFree(false));
    setDaysUntilReset(getDaysUntilReset());
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setError("Please provide both a job description and your resume.");
      return;
    }

    if (!canAnalyze(isPro)) {
      setShowPaywall(true);
      return;
    }

    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, resumeText }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      setResult(data);
      setActiveTab("score");

      // Track usage
      if (!isPro) {
        incrementUsage();
        setRemaining(getRemainingFree(false));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [jobDescription, resumeText, isPro]);

  const handleJobSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    setError("");

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        location: searchLocation,
      });
      const res = await fetch(`/api/jobs/search?${params}`);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Search failed");
      }

      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Job search failed");
    } finally {
      setSearching(false);
    }
  }, [searchQuery, searchLocation]);

  const useJobForAnalysis = (job: Job) => {
    setJobDescription(
      `${job.title} at ${job.company}\n\nLocation: ${job.location}\n${job.salary ? `Salary: ${job.salary}\n` : ""}\n${job.description}`
    );
    setShowJobSearch(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreRing = (score: number) => {
    if (score >= 75) return "border-green-400";
    if (score >= 50) return "border-yellow-400";
    return "border-red-400";
  };

  const tabs = [
    { id: "score" as const, label: "Fit Score" },
    { id: "resume" as const, label: "Tailored Resume" },
    { id: "cover" as const, label: "Cover Letter" },
    { id: "interview" as const, label: "Interview Prep" },
    { id: "tips" as const, label: "Tips" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-[var(--border)] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-xl font-bold">
            Job<span className="text-indigo-400">Match</span> AI
          </a>
          <div className="flex items-center gap-4">
            {!isPro && (
              <span className="text-xs text-zinc-500">
                {remaining}/3 free analyses left (resets in {daysUntilReset}d)
              </span>
            )}
            {isPro && (
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs rounded-full font-medium">
                PRO
              </span>
            )}
            <a
              href="/pricing"
              className="text-sm text-zinc-400 hover:text-indigo-400 transition-colors"
            >
              {isPro ? "Manage Plan" : "Upgrade"}
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 max-w-md w-full text-center">
              <div className="text-4xl mb-4">&#128274;</div>
              <h3 className="text-xl font-bold mb-2">
                Monthly Limit Reached
              </h3>
              <p className="text-zinc-400 text-sm mb-6">
                You&apos;ve used all 3 free analyses this month. Upgrade to Pro
                for unlimited access.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="/pricing"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition-all"
                >
                  Upgrade to Pro — $19/mo
                </a>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="px-6 py-3 bg-white/5 rounded-xl text-sm text-zinc-400 hover:text-white transition-all"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job Search Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Analyze a Job Match</h2>
          <button
            onClick={() => setShowJobSearch(!showJobSearch)}
            className="px-4 py-2 bg-white/5 border border-[var(--border)] rounded-lg text-sm hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <span>&#128269;</span>
            {showJobSearch ? "Hide Job Search" : "Search Jobs"}
          </button>
        </div>

        {/* Job Search Panel */}
        {showJobSearch && (
          <div className="mb-8 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 animate-fade-in">
            <h3 className="text-sm font-medium text-zinc-300 mb-3">
              Search for jobs and click one to auto-fill the analysis
            </h3>
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJobSearch()}
                placeholder="Job title or keywords..."
                className="flex-1 bg-[#0a0a0a] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50"
              />
              <input
                type="text"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleJobSearch()}
                placeholder="Location (optional)"
                className="w-48 bg-[#0a0a0a] border border-[var(--border)] rounded-lg px-4 py-2.5 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50"
              />
              <button
                onClick={handleJobSearch}
                disabled={searching}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 rounded-lg text-sm font-medium transition-all"
              >
                {searching ? "Searching..." : "Search"}
              </button>
            </div>

            {jobs.length > 0 && (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => useJobForAnalysis(job)}
                    className="p-4 bg-[#0a0a0a] border border-[var(--border)] rounded-lg cursor-pointer hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{job.title}</h4>
                        <p className="text-xs text-zinc-500">
                          {job.company} &middot; {job.location}
                        </p>
                        {job.salary && (
                          <p className="text-xs text-green-400 mt-1">
                            {job.salary}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-indigo-400 shrink-0">
                        Click to analyze
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Job Description
            </label>
            <p className="text-xs text-zinc-500 mb-3">
              Paste the full job listing or search for jobs above
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here...&#10;&#10;Or use the Search Jobs button above to find and auto-fill"
              className="w-full h-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Your Resume
            </label>
            <p className="text-xs text-zinc-500 mb-3">
              Paste your resume text
            </p>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here..."
              className="w-full h-72 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="px-12 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed rounded-xl text-lg font-semibold transition-all hover:scale-105 disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Analyzing with AI...
              </span>
            ) : (
              `Analyze Match${!isPro ? ` (${remaining} free left)` : ""}`
            )}
          </button>
          {!isPro && remaining > 0 && (
            <p className="text-xs text-zinc-500">
              {remaining} of 3 free analyses remaining
            </p>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="animate-fade-in">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white"
                      : "bg-[var(--surface)] text-zinc-400 hover:text-zinc-300 border border-[var(--border)]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
              {activeTab === "score" && (
                <div>
                  <div className="flex flex-col items-center mb-10">
                    <div
                      className={`w-40 h-40 rounded-full border-4 ${getScoreRing(result.fitScore)} flex items-center justify-center mb-4`}
                    >
                      <span
                        className={`text-5xl font-bold ${getScoreColor(result.fitScore)}`}
                      >
                        {result.fitScore}
                      </span>
                    </div>
                    <p className="text-zinc-400 text-sm">
                      out of 100 compatibility score
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-green-400 mb-4">
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {result.strengths.map((s, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-zinc-300"
                          >
                            <span className="text-green-400 mt-0.5">+</span>
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-red-400 mb-4">
                        Gaps to Address
                      </h3>
                      <ul className="space-y-2">
                        {result.gaps.map((g, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-zinc-300"
                          >
                            <span className="text-red-400 mt-0.5">-</span>
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {result.salaryRange && (
                    <div className="mt-8 p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-xl">
                      <h4 className="text-sm font-medium text-indigo-400 mb-1">
                        Estimated Salary Range
                      </h4>
                      <p className="text-xl font-bold">
                        {result.salaryRange.currency}
                        {result.salaryRange.min.toLocaleString()} -{" "}
                        {result.salaryRange.currency}
                        {result.salaryRange.max.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "resume" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Tailored Resume
                  </h3>
                  <p className="text-sm text-zinc-500 mb-6">
                    Your resume optimized for this specific job posting
                  </p>
                  <pre className="whitespace-pre-wrap text-sm text-zinc-300 bg-[#0a0a0a] p-6 rounded-xl border border-[var(--border)] font-sans leading-relaxed">
                    {result.tailoredResume}
                  </pre>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(result.tailoredResume)
                    }
                    className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}

              {activeTab === "cover" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cover Letter</h3>
                  <p className="text-sm text-zinc-500 mb-6">
                    Customized cover letter for this position
                  </p>
                  <pre className="whitespace-pre-wrap text-sm text-zinc-300 bg-[#0a0a0a] p-6 rounded-xl border border-[var(--border)] font-sans leading-relaxed">
                    {result.coverLetter}
                  </pre>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(result.coverLetter)
                    }
                    className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}

              {activeTab === "interview" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Interview Prep
                  </h3>
                  <p className="text-sm text-zinc-500 mb-6">
                    Likely interview questions with suggested answers
                  </p>
                  <div className="space-y-6">
                    {result.interviewQuestions.map((item, i) => (
                      <div
                        key={i}
                        className="border border-[var(--border)] rounded-xl p-5"
                      >
                        <p className="font-medium text-indigo-400 mb-3">
                          Q{i + 1}: {item.q}
                        </p>
                        <p className="text-sm text-zinc-400 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "tips" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Actionable Tips
                  </h3>
                  <p className="text-sm text-zinc-500 mb-6">
                    Specific strategies to improve your chances for this role
                  </p>
                  <div className="space-y-3">
                    {result.tips.map((tip, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-[#0a0a0a] rounded-xl border border-[var(--border)]"
                      >
                        <span className="text-indigo-400 font-bold text-lg shrink-0">
                          {i + 1}
                        </span>
                        <p className="text-sm text-zinc-300">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
