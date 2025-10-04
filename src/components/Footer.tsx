export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-black/70">
          Built for NASA Space Apps. Uses publicly available NASA Earth data.
        </p>
        <div className="flex items-center gap-4 text-sm">
          <a className="hover:underline" href="https://www.spaceappschallenge.org/" target="_blank" rel="noreferrer">#SpaceApps</a>
          <a className="hover:underline" href="#">Twitter</a>
          <a className="hover:underline" href="#">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
