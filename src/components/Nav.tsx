import Link from "next/link";
import { getCurrentUser, ROLE_LABELS } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

function Mark() {
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 text-coral-500" aria-hidden>
      <path
        d="M3 17c4-8 14-8 18 0-3.5-1.5-6.5-.5-9 1.5s-5.5 3-9-1.5Z"
        fill="currentColor"
      />
      <path
        d="M11 17c-.3-4 .3-7.5 2-10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M13 6.5c-2-.6-3.4-2-3.6-3.5 1.7.2 3.6 1.2 4.4 3"
        fill="currentColor"
      />
    </svg>
  );
}

export async function Nav() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-lagoon-900/10 dark:border-white/10 bg-sand-50/85 dark:bg-lagoon-900/85 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display font-medium text-lagoon-800 dark:text-sand-50">
          <Mark />
          <span>Picnic Island</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-lagoon-900/70 dark:text-sand-100/70">
          {(!user || user.role === "VISITOR") && (
            <>
              <Link href="/hotels" className="hover:text-coral-600 dark:hover:text-coral-400">
                Hotels
              </Link>
              <Link href="/ferry" className="hover:text-coral-600 dark:hover:text-coral-400">
                Ferry
              </Link>
              <Link href="/park" className="hover:text-coral-600 dark:hover:text-coral-400">
                Theme Park
              </Link>
              <Link href="/map" className="hover:text-coral-600 dark:hover:text-coral-400">
                Map
              </Link>
              {user && (
                <Link href="/bookings" className="hover:text-coral-600 dark:hover:text-coral-400">
                  My Bookings
                </Link>
              )}
            </>
          )}
          {user?.role === "HOTEL_STAFF" && (
            <Link href="/staff/hotel" className="hover:text-coral-600 dark:hover:text-coral-400">
              Hotel Dashboard
            </Link>
          )}
          {user?.role === "FERRY_STAFF" && (
            <Link href="/staff/ferry" className="hover:text-coral-600 dark:hover:text-coral-400">
              Ferry Dashboard
            </Link>
          )}
          {user?.role === "PARK_STAFF" && (
            <Link href="/staff/park" className="hover:text-coral-600 dark:hover:text-coral-400">
              Park Dashboard
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-coral-600 dark:hover:text-coral-400">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="hidden sm:inline text-xs text-neutral-500">
                {user.name} · {ROLE_LABELS[user.role]}
              </span>
              <form action={logoutAction}>
                <button className="btn-secondary text-xs" type="submit">
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary text-xs">
                Log in
              </Link>
              <Link href="/register" className="btn-primary text-xs">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
