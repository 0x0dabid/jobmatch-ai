"use client";

import { useState } from "react";

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

export default function Dashboard() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<
    "score" | "resume" | "cover" | "interview" | "tips"
  >("score");

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setError("Please provide both a job description and your resume.");
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
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
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
          <div className="text-sm text-zinc-500">Free Analysis</div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Job Description */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Job Description
            </label>
            <p className="text-xs text-zinc-500 mb-3">
              Paste the full job listing or description
            </p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here...&#10;&#10;Example:&#10;Senior Software Engineer - TechCorp&#10;We are looking for a Senior Software Engineer with 5+ years of experience in React, Node.js, and cloud infrastructure..."
              className="w-full h-80 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>

          {/* Resume */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Your Resume
            </label>
            <p className="text-xs text-zinc-500 mb-3">
              Paste your resume text (PDF upload coming soon)
            </p>
            <textarea
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste your resume text here...&#10;&#10;Example:&#10;John Doe&#10;Software Developer&#10;&#10;Experience:&#10;- Frontend Developer at StartupCo (2021-2024)&#10;  Built React apps, led team of 3..."
              className="w-full h-80 bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 resize-none"
            />
          </div>
        </div>

        {/* Analyze Button */}
        <div className="flex justify-center mb-8">
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
              "Analyze Match — Free"
            )}
          </button>
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
            {/* Tabs */}
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

            {/* Tab Content */}
            <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8">
              {/* Score Tab */}
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

              {/* Resume Tab */}
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
                    onClick={() => {
                      navigator.clipboard.writeText(result.tailoredResume);
                    }}
                    className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}

              {/* Cover Letter Tab */}
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
                    onClick={() => {
                      navigator.clipboard.writeText(result.coverLetter);
                    }}
                    className="mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10 transition-all"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              )}

              {/* Interview Tab */}
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

              {/* Tips Tab */}
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
