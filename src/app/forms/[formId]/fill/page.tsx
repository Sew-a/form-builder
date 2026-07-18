export default function FillFormPage({ params }: { params: { formId: string } }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Fill out form: {params.formId}</h1>
      <p className="text-slate-600">
        TODO: fetch <code>/api/forms/{'{id}'}/public</code>, render fields based on
        their <code>type</code>, and POST answers to{' '}
        <code>/api/forms/{'{id}'}/responses</code>.
      </p>
    </main>
  );
}
