export default function BuilderPage({ params }: { params: { formId: string } }) {
  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Builder: {params.formId}</h1>
      <p className="text-slate-600">
        TODO: field palette (left) + drag-and-drop canvas (center, dnd-kit) +
        property panel (right). Wire up <code>useSocket</code> here to join the
        form&apos;s room and sync field changes in real time.
      </p>
    </main>
  );
}
