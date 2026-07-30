import Link from "next/link";

const FEATURES = [
  {
    title: "AI Voice Agents",
    desc: "Deploy intelligent voice agents powered by Grok Voice AI. Handle customer calls with natural, human-like conversations that understand context and intent.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
  },
  {
    title: "Real-time Processing",
    desc: "Sub-300ms response times with server-side VAD (Voice Activity Detection). Natural turn-taking without awkward pauses or interruptions.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Smart Call Routing",
    desc: "Intelligent routing across inbound and outbound calls. Automatic escalation to live agents when the AI identifies complex scenarios.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
  {
    title: "Seamless Integration",
    desc: "Built on Voximplant's enterprise-grade telephony platform. Deploy in minutes with automated CI/CD — no complex infrastructure required.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.3M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495" />
      </svg>
    ),
  },
];

const STEPS = [
  { step: "01", title: "Connect", desc: "Link your Voximplant account and configure your phone number. No additional hardware needed." },
  { step: "02", title: "Configure", desc: "Set up your AI agent's personality, instructions, and call handling rules through a simple configuration." },
  { step: "03", title: "Deploy", desc: "Deploy with one command. Your voice agent is live and ready to handle calls in minutes." },
];

export default function HomePage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
              AI-Powered Voice Agents
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                for Your Business
              </span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-text-muted sm:text-xl">
              VoxHub combines Grok Voice AI with enterprise telephony to create intelligent,
              natural-sounding voice agents. Deploy in minutes, scale instantly.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                href="/solutions"
                className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
              >
                Explore Solutions
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-text transition-colors hover:bg-surface-alt"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* ─── Features ─── */}
      <section aria-labelledby="features-heading" className="bg-surface-alt py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="features-heading" className="text-center text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Why VoxHub
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-text-muted">
            Everything you need to deploy AI voice agents at scale.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="group rounded-2xl border border-border bg-surface p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary dark:bg-primary/15">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-text">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section aria-labelledby="how-heading" className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="how-heading" className="text-center text-3xl font-bold tracking-tight text-text sm:text-4xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-text-muted">
            Get your AI voice agent live in three simple steps.
          </p>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.step} className="relative pl-12 sm:pl-0 sm:text-center">
                <span className="absolute left-0 top-0 text-4xl font-bold text-primary/20 sm:static sm:block sm:text-5xl">
                  {s.step}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-text sm:mt-4">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SEO Content ─── */}
      <section aria-labelledby="seo-heading" className="bg-surface-alt py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 id="seo-heading" className="text-center text-3xl font-bold tracking-tight text-text sm:text-4xl">
            The Future of Customer Calls Is AI-Powered
          </h2>
          <div className="mt-10 space-y-6 text-base leading-7 text-text-muted">
            <p>
              Traditional call centers struggle with high costs, limited availability, and inconsistent
              customer experiences. VoxHub changes this by combining <strong>Grok Voice AI</strong> with
              the <strong>Voximplant telephony platform</strong> to deliver voice agents that sound
              natural, understand context, and handle complex conversations.
            </p>
            <p>
              Our platform supports both <strong>inbound</strong> and <strong>outbound</strong> calling
              scenarios. Route incoming customer calls to an AI agent that can answer questions, take
              orders, or escalate to a human operator when needed. For outbound campaigns, deploy voice
              agents that can make calls, qualify leads, and follow up — all autonomously.
            </p>
            <p>
              Built on enterprise infrastructure, VoxHub ensures <strong>low latency</strong>,
              <strong> high reliability</strong>, and <strong> end-to-end security</strong>.
              Server-side VAD (Voice Activity Detection) enables natural turn-taking, while our
              modular architecture allows custom tool integration and seamless handoff to live agents.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section aria-labelledby="cta-heading" className="py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 id="cta-heading" className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
            Ready to Transform Your Call Center?
          </h2>
          <p className="mt-4 text-lg text-text-muted">
            Deploy intelligent voice agents in minutes. No complex infrastructure — just results.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <a
              href="https://voximplant.com"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-hover"
            >
              Get Started with Voximplant
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
