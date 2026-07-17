import Link from "next/link";
import { loginAction, quickLoginAction } from "@/lib/actions/auth";
import { AuthForm } from "@/components/AuthForm";
import { IslandHero } from "@/components/IslandHero";

const DEMO_ROLES = [
  { role: "VISITOR", label: "Visitor" },
  { role: "HOTEL_STAFF", label: "Hotel Staff" },
  { role: "FERRY_STAFF", label: "Ferry Staff" },
  { role: "PARK_STAFF", label: "Theme Park Staff" },
  { role: "ADMIN", label: "Admin" },
];

export default function LoginPage() {
  return (
    <div className="flex-1 grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center bg-sand-100 dark:bg-lagoon-800/40 px-12 py-16 border-r border-lagoon-900/10 dark:border-white/10">
        <IslandHero className="w-full h-auto rounded-2xl mb-8" />
        <h2 className="font-display text-2xl font-medium text-lagoon-900 dark:text-sand-50 max-w-sm">
          One account, every part of the trip.
        </h2>
        <p className="text-sm text-lagoon-900/60 dark:text-sand-100/60 mt-2 max-w-sm">
          Hotel stays, ferry crossings, and theme park tickets — booked and
          managed from the same place.
        </p>
      </div>

      <div className="mx-auto w-full max-w-md px-4 py-16 flex flex-col justify-center">
        <div className="card">
          <h1 className="font-display text-2xl font-medium mb-1 text-lagoon-900 dark:text-sand-50">
            Welcome back
          </h1>
          <p className="text-sm text-neutral-500 mb-6">Log in to Picnic Island Booking.</p>
          <AuthForm action={loginAction} mode="login" />
          <p className="text-sm text-neutral-500 mt-6">
            New here?{" "}
            <Link className="text-coral-600 font-medium hover:underline" href="/register">
              Create an account
            </Link>
          </p>
        </div>

        <div className="card mt-6">
          <h2 className="text-sm font-semibold mb-3 text-neutral-600 dark:text-neutral-300">
            Demo quick login (seeded accounts)
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {DEMO_ROLES.map((r) => (
              <form key={r.role} action={quickLoginAction}>
                <input type="hidden" name="role" value={r.role} />
                <button className="btn-secondary w-full text-xs" type="submit">
                  {r.label}
                </button>
              </form>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
