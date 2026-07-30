import type { User } from "@/lib/auth";

export function ProfileCard({ user }: { user: User }) {
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
      <div className="flex items-center gap-4">
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="h-16 w-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xl font-bold text-white">
            {initials}
          </div>
        )}
        <div>
          <h2 className="text-xl font-semibold text-text">{user.name}</h2>
          <p className="text-sm text-text-muted">{user.email}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Name
          </label>
          <p className="mt-1 text-sm text-text">{user.name}</p>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Email
          </label>
          <p className="mt-1 text-sm text-text">{user.email}</p>
        </div>
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
            User ID
          </label>
          <p className="mt-1 truncate font-mono text-xs text-text-muted">{user.id}</p>
        </div>
        {user.created_at && (
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Member since
            </label>
            <p className="mt-1 text-sm text-text">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-surface-alt p-4 text-sm text-text-muted">
        Profile management and voice agent configuration coming soon.
      </div>
    </section>
  );
}
