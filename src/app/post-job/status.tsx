"use client";

import { useActionState } from "react";

export function PostJobStatus({
  action,
  children,
}: {
  action: (
    previousState: { ok: boolean; message: string },
    formData: FormData,
  ) => Promise<{ ok: boolean; message: string }>;
  children: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, { ok: false, message: "" });

  return (
    <form action={formAction} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      {children}
      {state.message ? (
        <p
          className={`mt-4 rounded-lg px-4 py-3 text-sm font-semibold ${
            state.ok ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
