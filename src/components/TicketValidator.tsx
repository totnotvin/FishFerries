"use client";

import { useActionState } from "react";
import { validateTicketAction, type ValidateState } from "@/lib/actions/ferry";
import { CheckCircleIcon } from "@/components/icons";

export function TicketValidator() {
  const [state, formAction, pending] = useActionState<ValidateState, FormData>(
    validateTicketAction,
    undefined
  );

  return (
    <div className="card">
      <h2 className="text-lg font-semibold mb-3">Validate a ferry ticket</h2>
      <form action={formAction} className="flex gap-2">
        <input className="input" name="ticketId" placeholder="Paste ticket ID" required />
        <button className="btn-primary" type="submit" disabled={pending}>
          {pending ? "Checking..." : "Validate"}
        </button>
      </form>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2 mt-3">{state.error}</p>
      )}

      {state?.ticket && (
        <div className="mt-3 rounded-lg bg-palm-500/10 text-palm-600 p-3 text-sm space-y-1">
          <p className="font-medium flex items-center gap-1.5">
            <CheckCircleIcon className="w-4 h-4" /> Valid ticket — hotel booking confirmed
          </p>
          <p>Passenger: {state.ticket.passengerName}</p>
          <p>Route: {state.ticket.route}</p>
          <p>Departure: {state.ticket.departureTime}</p>
          <p>Passengers: {state.ticket.passengers}</p>
        </div>
      )}
    </div>
  );
}
