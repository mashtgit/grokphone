"use client";

import { useAuth } from "@/lib/auth";
import { ProfileCard } from "./ProfileCard";
import Link from "next/link";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <section className="flex min-h-[60dvh] items-center justify-center py-12 sm:py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary" />
      </section>
    );
  }

  if (!user) {
    return (
      <section className="flex min-h-[60dvh] items-center justify-center py-12 sm:py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text">Sign in required</h1>
          <p className="mt-2 text-text-muted">Please log in to view your dashboard.</p>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            Log in
          </Link>
        </div>
      </section>
    );
  }

  const joined = new Date(user.created_at).toLocaleDateString();

  return (
    <section aria-labelledby="dashboard-heading" className="py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 id="dashboard-heading" className="text-3xl font-bold tracking-tight text-text sm:text-4xl">
          Dashboard
        </h1>
        <p className="mt-2 text-text-muted">
          Welcome back, {user.name}. Manage your account and voice agent settings.
        </p>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Profile card — 2 columns wide */}
          <div className="lg:col-span-2">
            <ProfileCard user={user} />
          </div>

          {/* Quick stats — 1 column */}
          <aside className="space-y-6">
            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                Account
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Status</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Plan</span>
                  <span className="font-medium text-text">Starter</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Joined</span>
                  <span className="text-text">{joined}</span>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
                Quick Links
              </h2>
              <nav className="mt-4 space-y-2" aria-label="Dashboard quick links">
                <a
                  href="https://voximplant.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
                >
                  Voximplant Console
                </a>
                <a
                  href="https://console.x.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg px-3 py-2 text-sm text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
                >
                  xAI Console
                </a>
              </nav>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
