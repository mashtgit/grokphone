import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Explore VoxHub solutions: AI voice agents for customer support, outbound calling, and intelligent call routing.",
};

const SOLUTIONS = [
  {
    title: "Inbound Customer Support",
    desc: "Handle incoming calls with an AI agent that answers questions, processes requests, and escalates to human operators when needed. Reduce wait times and provide 24/7 support.",
    benefits: ["24/7 availability", "Instant response", "Smart escalation", "Multilingual support"],
  },
  {
    title: "Outbound Calling",
    desc: "Deploy voice agents for appointment reminders, follow-ups, surveys, and lead qualification. Scale your outbound campaigns without hiring additional staff.",
    benefits: ["High scalability", "Consistent messaging", "Automated follow-ups", "Performance analytics"],
  },
  {
    title: "Hybrid Call Centers",
    desc: "Combine AI agents with human operators for optimal efficiency. AI handles routine calls while complex issues are seamlessly transferred to live agents.",
    benefits: ["Reduced costs", "Improved CSAT", "Agent productivity", "Flexible routing"],
  },
];

export default function SolutionsPage() {
  return (
    <section aria-labelledby="solutions-heading" className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 id="solutions-heading" className="text-4xl font-bold tracking-tight text-text sm:text-5xl">
            Solutions
          </h1>
          <p className="mt-4 text-lg text-text-muted">
            From customer support to outbound campaigns — VoxHub adapts to your use case.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {SOLUTIONS.map((s) => (
            <article
              key={s.title}
              className="flex flex-col rounded-2xl border border-border bg-surface p-8"
            >
              <h2 className="text-xl font-semibold text-text">{s.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-6 text-text-muted">{s.desc}</p>
              <ul className="mt-6 space-y-2">
                {s.benefits.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-text-muted">
                    <svg
                      className="h-4 w-4 shrink-0 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
