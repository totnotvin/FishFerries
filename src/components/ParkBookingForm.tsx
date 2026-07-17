"use client";

import { useActionState } from "react";
import { bookParkEventAction, type FormState } from "@/lib/actions/park";

export function ParkBookingForm({
  eventId,
  price,
  remaining,
}: {
  eventId: string;
  price: number;
  remaining: number;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    bookParkEventAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="eventId" value={eventId} />

      <div>
        <label className="label" htmlFor="ticketCount">
          Tickets (max {remaining} available)
        </label>
        <input
          className="input"
          id="ticketCount"
          name="ticketCount"
          type="number"
          min={1}
          max={remaining}
          defaultValue={1}
          required
        />
      </div>

      {price > 0 && (
        <fieldset className="border border-black/10 dark:border-white/10 rounded-lg p-4 space-y-3">
          <legend className="text-sm font-medium px-1">Mock payment details</legend>
          <input className="input" placeholder="Card number: 4242 4242 4242 4242" required />
          <p className="text-xs text-neutral-500">
            Demo project — no real payment is processed. ${price.toFixed(0)} per ticket.
          </p>
        </fieldset>
      )}

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <button className="btn-primary w-full" type="submit" disabled={pending || remaining <= 0}>
        {pending ? "Processing..." : "Confirm booking"}
      </button>
    </form>
  );
}
