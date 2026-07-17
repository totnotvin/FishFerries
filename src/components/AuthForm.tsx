"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/actions/auth";

export function AuthForm({
  action,
  mode,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  mode: "login" | "register";
}) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="space-y-4">
      {mode === "register" && (
        <div>
          <label className="label" htmlFor="name">
            Full name
          </label>
          <input className="input" id="name" name="name" type="text" required minLength={2} />
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input className="input" id="email" name="email" type="email" required />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          required
          minLength={mode === "register" ? 6 : 1}
        />
      </div>
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
      )}
      <button className="btn-primary w-full" type="submit" disabled={pending}>
        {pending ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
      </button>
    </form>
  );
}
