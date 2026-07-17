"use client";

import { useActionState } from "react";
import { bookHotelAction, type FormState } from "@/lib/actions/hotel";

export function HotelBookingForm({
  roomId,
  pricePerNight,
  capacity,
}: {
  roomId: string;
  pricePerNight: number;
  capacity: number;
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    bookHotelAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="roomId" value={roomId} />

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor="checkIn">
            Check-in
          </label>
          <input className="input" id="checkIn" name="checkIn" type="date" required />
        </div>
        <div>
          <label className="label" htmlFor="checkOut">
            Check-out
          </label>
          <input className="input" id="checkOut" name="checkOut" type="date" required />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="guests">
          Guests (max {capacity})
        </label>
        <input
          className="input"
          id="guests"
          name="guests"
          type="number"
          min={1}
          max={capacity}
          defaultValue={1}
          required
        />
      </div>

      <fieldset className="border border-black/10 dark:border-white/10 rounded-lg p-4 space-y-3">
        <legend className="text-sm font-medium px-1">Mock payment details</legend>
        <div>
          <label className="label" htmlFor="card">
            Card number
          </label>
          <input
            className="input"
            id="card"
            placeholder="4242 4242 4242 4242"
            required
            pattern="[0-9 ]{12,19}"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="expiry">
              Expiry
            </label>
            <input className="input" id="expiry" placeholder="MM/YY" required />
          </div>
          <div>
            <label className="label" htmlFor="cvc">
              CVC
            </label>
            <input className="input" id="cvc" placeholder="123" required />
          </div>
        </div>
        <p className="text-xs text-neutral-500">
          Demo project — no real payment is processed. Price is ${pricePerNight.toFixed(0)}/night.
        </p>
      </fieldset>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <button className="btn-primary w-full" type="submit" disabled={pending}>
        {pending ? "Processing..." : "Confirm & Pay"}
      </button>
    </form>
  );
}
