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
    <form action={formAction} className="rounded-brand-lg border-2 border-ocean/10 bg-white p-7 sm:p-8">
      {children}
      {state.message ? (
        <p
          role="status"
          aria-live="polite"
          className={`mt-5 rounded-xl px-4 py-3.5 font-semibold ${
            state.ok
              ? "bg-turq-soft text-teal-deep"
              : "bg-coral-soft text-coral"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
