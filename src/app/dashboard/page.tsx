export default function DashboardPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Your Forms</h1>
      <p className="text-slate-600">
        TODO: fetch forms from <code>/api/forms</code> and list them here, with a
        &quot;New form&quot; button that creates a form and redirects to
        <code> /builder/[formId]</code>.
      </p>
    </main>
  );
}
