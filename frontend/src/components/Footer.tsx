export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} VoxHub. All rights reserved.
          </p>
          <nav className="flex gap-6" aria-label="Footer navigation">
            <a
              href="https://voximplant.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              Powered by Voximplant
            </a>
            <a
              href="https://x.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              Grok Voice AI
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
