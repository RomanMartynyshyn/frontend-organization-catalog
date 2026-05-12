export function SiteFooter() {
  return (
    <footer className="border-border bg-card text-muted mt-auto border-t text-sm">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <p>Kharkiv IT · {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
