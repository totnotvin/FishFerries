"use client";

import { useActionState } from "react";
import { bookFerryAction, type FormState } from "@/lib/actions/ferry";

type Schedule = {
  id: string;
  origin: string;
  destination: string;
  departureTime: Date;
  capacity: number;
};

type HotelBooking = {
  id: string;
  checkIn: Date;
  checkOut: Date;
  room: { type: string; hotel: { name: string } };
};

export function FerryBookingForm({
  schedules,
  hotelBookings,
}: {
  schedules: Schedule[];
  hotelBookings: HotelBooking[];
}) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    bookFerryAction,
    undefined
  );

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="label" htmlFor="hotelBookingId">
          Linked hotel booking
        </label>
        <select className="input" id="hotelBookingId" name="hotelBookingId" required>
          {hotelBookings.map((b) => (
            <option key={b.id} value={b.id}>
              {b.room.hotel.name} · {b.room.type} ({b.checkIn.toDateString()} –{" "}
              {b.checkOut.toDateString()})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="scheduleId">
          Sailing
        </label>
        <select className="input" id="scheduleId" name="scheduleId" required>
          {schedules.map((s) => (
            <option key={s.id} value={s.id}>
              {s.origin} → {s.destination} · {new Date(s.departureTime).toLocaleString()}
            </option>
          ))}
        </select>
        {schedules.length === 0 && (
          <p className="text-xs text-red-600 mt-1">No sailings scheduled yet.</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="passengers">
          Passengers
        </label>
        <input
          className="input"
          id="passengers"
          name="passengers"
          type="number"
          min={1}
          max={20}
          defaultValue={1}
          required
        />
      </div>

      <fieldset className="border border-black/10 dark:border-white/10 rounded-lg p-4 space-y-3">
        <legend className="text-sm font-medium px-1">Mock payment details</legend>
        <input className="input" placeholder="Card number: 4242 4242 4242 4242" required />
        <p className="text-xs text-neutral-500">Demo project — no real payment is processed.</p>
      </fieldset>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <button
        className="btn-primary w-full"
        type="submit"
        disabled={pending || schedules.length === 0}
      >
        {pending ? "Processing..." : "Confirm & Pay"}
      </button>
    </form>
  );
}
