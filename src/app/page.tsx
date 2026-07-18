export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-bold">Collaborative Form Builder</h1>
      <p className="text-slate-600">
        Scaffold is running: Next.js is being served through the custom Express
        server, alongside the API and Socket.io.
      </p>
      <div className="flex gap-3">
        <a
          href="/dashboard"
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Go to dashboard
        </a>
        <a
          href="/api/health"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-100"
        >
          Check API health
        </a>
      </div>
    </main>
  );
}
