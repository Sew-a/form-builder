"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { useFormStore } from "@/store/useFormStore";
import { CreateFormDialog } from "@/components/builder/CreateFormDialog";
import { ROUTES } from "@/lib/routes";

export default function DashboardPage() {
  const router = useRouter();
  const { user, setAuthModalOpen } = useAuthStore();
  const { forms, formsLoading, loadForms, createForm, deleteForm } =
    useFormStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadForms();
  }, [user, loadForms]);

  const handleCreate = async (title: string) => {
    const form = await createForm(title);
    router.push(ROUTES.builder(form.id));
  };

  const handleDelete = async (formId: string) => {
    await deleteForm(formId);
    setDeleteConfirmId(null);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-logo font-bold text-dark-50">
              Your Forms
            </h1>
            <p className="mt-1 text-sm text-dark-300">
              {user
                ? `${forms.length} form${forms.length !== 1 ? "s" : ""} total`
                : "Sign in to manage your forms"}
            </p>
          </div>
          {user && (
            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-600 transition-all hover:shadow-md active:scale-95"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Form
            </button>
          )}
        </div>

        {!user ? (
          <div className="rounded-2xl border border-dark-600 bg-dark-800 p-12 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-dark-700 text-dark-300">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-dark-200 text-lg">
              Sign in to view and manage your forms.
            </p>
            <button
              onClick={() => setAuthModalOpen(true, "signin")}
              className="rounded-lg bg-accent-500 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-accent-600 transition-all hover:shadow-md active:scale-95"
            >
              Sign In
            </button>
          </div>
        ) : formsLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-dark-600 bg-dark-800 p-6 animate-pulse"
              >
                <div className="h-5 w-3/4 bg-dark-600 rounded mb-4"></div>
                <div className="h-3 w-1/2 bg-dark-700 rounded mb-6"></div>
                <div className="h-3 w-1/3 bg-dark-700 rounded"></div>
              </div>
            ))}
          </div>
        ) : forms.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-dark-500 bg-dark-800 p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-500/10 text-accent-400">
              <svg
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <p className="text-dark-200 text-lg">
              No forms yet. Create your first one!
            </p>
            <button
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-accent-600 transition-all hover:shadow-md active:scale-95"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your First Form
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <div
                key={form.id}
                className="group relative rounded-2xl border border-dark-600 bg-dark-800 p-6 shadow-sm transition-all hover:shadow-lg hover:border-accent-500/30 cursor-pointer"
                onClick={() => router.push(ROUTES.builder(form.id))}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-dark-50 line-clamp-1 group-hover:text-accent-400 transition-colors">
                    {form.title}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteConfirmId(
                        deleteConfirmId === form.id ? null : form.id,
                      );
                    }}
                    className="rounded-lg p-1.5 text-dark-400 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Delete form"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                {deleteConfirmId === form.id && (
                  <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/20 p-3 animate-slideDown">
                    <p className="text-xs text-red-400 mb-2">
                      Delete this form?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(form.id);
                        }}
                        className="rounded px-3 py-1 text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-all"
                      >
                        Delete
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(null);
                        }}
                        className="rounded px-3 py-1 text-xs font-medium text-dark-200 hover:bg-dark-700 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <p className="text-sm text-dark-300 mb-4 line-clamp-2">
                  {form.description || "No description"}
                </p>

                <div className="flex items-center justify-between text-xs text-dark-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <svg
                        className="h-3.5 w-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      {form.fields.length} field
                      {form.fields.length !== 1 ? "s" : ""}
                    </span>
                    <span>&middot;</span>
                    <span>{formatDate(form.updatedAt)}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${form.settings.isPublished ? "bg-green-500/10 text-green-400" : "bg-dark-600 text-dark-300"}`}
                  >
                    {form.settings.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <CreateFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleCreate}
        />
      </div>
    </MainLayout>
  );
}
