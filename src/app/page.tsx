export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-transparent to-purple-950/30" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-6xl mx-auto px-6 pt-32 pb-20">
          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium">
              AI-Powered Job Search
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-center text-5xl md:text-7xl font-bold leading-tight mb-6 animate-slide-up">
            Stop Applying Blind.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Let AI Match You.
            </span>
          </h1>

          <p className="text-center text-xl text-zinc-400 max-w-2xl mx-auto mb-12 animate-slide-up">
            Paste any job listing. Upload your resume. Get an instant AI analysis
            — fit score, gap analysis, tailored resume, cover letter, and
            interview prep. All in 30 seconds.
          </p>

          {/* CTA */}
          <div className="flex justify-center gap-4 animate-slide-up">
            <a
              href="/dashboard"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-lg font-semibold transition-all hover:scale-105 glow"
            >
              Start Free Analysis
            </a>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-lg font-medium transition-all"
            >
              See How It Works
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 text-center">
            <div>
              <div className="text-3xl font-bold text-indigo-400">30s</div>
              <div className="text-sm text-zinc-500">Full Analysis</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400">5</div>
              <div className="text-sm text-zinc-500">AI Reports</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-400">Free</div>
              <div className="text-sm text-zinc-500">To Start</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          How It Works
        </h2>
        <p className="text-center text-zinc-400 mb-16 text-lg">
          Three steps. Thirty seconds. Your dream job.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 hover:border-indigo-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 text-xl font-bold mb-6">
              1
            </div>
            <h3 className="text-xl font-semibold mb-3">Paste Job Listing</h3>
            <p className="text-zinc-400">
              Drop a job URL or paste the full description. Our AI will extract
              the key requirements, skills, and qualifications.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 hover:border-purple-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-xl font-bold mb-6">
              2
            </div>
            <h3 className="text-xl font-semibold mb-3">Upload Resume</h3>
            <p className="text-zinc-400">
              Upload your resume as a PDF or paste the text. AI extracts your
              skills, experience, and qualifications automatically.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-8 hover:border-pink-500/30 transition-all">
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 text-xl font-bold mb-6">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Get AI Analysis</h3>
            <p className="text-zinc-400">
              Instant fit score, gap analysis, tailored resume, cover letter,
              and interview questions — all customized for that specific job.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          What You Get
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              icon: "🎯",
              title: "Job Fit Score",
              desc: "0-100 score showing how well you match this specific role. Know your chances before you apply.",
            },
            {
              icon: "📋",
              title: "Gap Analysis",
              desc: "Exactly what skills or experience you're missing, with suggestions on how to address each gap.",
            },
            {
              icon: "📄",
              title: "Tailored Resume",
              desc: "Your resume rewritten and optimized with the exact keywords and phrasing this job requires.",
            },
            {
              icon: "✉️",
              title: "Cover Letter",
              desc: "A compelling cover letter that connects your experience directly to this role's requirements.",
            },
            {
              icon: "🎤",
              title: "Interview Prep",
              desc: "Likely interview questions for this role plus suggested answers based on your background.",
            },
            {
              icon: "💰",
              title: "Salary Insights",
              desc: "Estimated salary range and negotiation tips based on the role, location, and your experience.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 flex gap-4 hover:border-indigo-500/20 transition-all"
            >
              <div className="text-3xl shrink-0">{f.icon}</div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{f.title}</h3>
                <p className="text-zinc-400 text-sm">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/50 border border-indigo-500/20 rounded-3xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-zinc-400 text-lg mb-8">
            Free to start. No credit card required. Results in 30 seconds.
          </p>
          <a
            href="/dashboard"
            className="inline-block px-10 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-lg font-semibold transition-all hover:scale-105"
          >
            Analyze Your First Job — Free
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 text-center text-zinc-500 text-sm">
        <p>JobMatch AI — Built with AI, for job seekers.</p>
      </footer>
    </main>
  );
}
