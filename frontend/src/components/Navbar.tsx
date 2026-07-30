"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/solutions", label: "Solutions" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold tracking-tight text-text"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
            V
          </span>
          VoxHub
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex" aria-label="Main navigation">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? "bg-primary-light text-primary dark:bg-primary/15"
                    : "text-text-muted hover:bg-surface-alt hover:text-text"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {loading ? null : user ? (
            <div className="ml-4 flex items-center gap-3 border-l border-border pl-4">
              <Link
                href="/dashboard"
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                  pathname === "/dashboard"
                    ? "bg-primary-light text-primary dark:bg-primary/15"
                    : "text-text-muted hover:bg-surface-alt hover:text-text"
                }`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-4 flex items-center gap-2 border-l border-border pl-4">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-text-muted hover:bg-surface-alt hover:text-text sm:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="border-t border-border bg-surface px-4 pb-4 pt-2 sm:hidden"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                  active
                    ? "bg-primary-light text-primary dark:bg-primary/15"
                    : "text-text-muted hover:bg-surface-alt hover:text-text"
                }`}
              >
                {label}
              </Link>
            );
          })}

          {loading ? null : user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors duration-150 ${
                  pathname === "/dashboard"
                    ? "bg-primary-light text-primary dark:bg-primary/15"
                    : "text-text-muted hover:bg-surface-alt hover:text-text"
                }`}
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => { logout(); setOpen(false); }}
                className="block w-full rounded-lg px-4 py-3 text-left text-sm font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="block rounded-lg px-4 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
              >
                Log in
              </Link>
              <Link
                href="/register"
                onClick={() => setOpen(false)}
                className="block rounded-lg bg-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
