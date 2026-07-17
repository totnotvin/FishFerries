"use client";

import { useActionState } from "react";
import { validateOnSiteTicketAction, type FormState } from "@/lib/actions/park";

export function OnSiteValidator() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    validateOnSiteTicketAction,
    undefined
  );

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">On-site ticket validation</h2>
      <form action={formAction} className="flex gap-2">
        <input className="input" name="bookingId" placeholder="Paste booking ID" required />
        <button className="btn-primary" type="submit" disabled={pending}>
          {pending ? "Checking..." : "Validate"}
        </button>
      </form>
      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-3">{state.error}</p>
      )}
      {state && !state.error && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2 mt-3">
          ✅ Valid booking — admit guest
        </p>
      )}
    </div>
  );
}
