import Link from "next/link";
import { getCurrentUser, ROLE_LABELS } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

export async function Nav() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-black/10 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur sticky top-0 z-20">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-teal-700">
          <span className="text-xl">🏝️</span>
          <span>Picnic Island</span>
        </Link>

        <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {(!user || user.role === "VISITOR") && (
            <>
              <Link href="/hotels" className="hover:text-teal-700">
                Hotels
              </Link>
              <Link href="/ferry" className="hover:text-teal-700">
                Ferry
              </Link>
              <Link href="/park" className="hover:text-teal-700">
                Theme Park
              </Link>
              <Link href="/map" className="hover:text-teal-700">
                Map
              </Link>
              {user && (
                <Link href="/bookings" className="hover:text-teal-700">
                  My Bookings
                </Link>
              )}
            </>
          )}
          {user?.role === "HOTEL_STAFF" && (
            <Link href="/staff/hotel" className="hover:text-teal-700">
              Hotel Dashboard
            </Link>
          )}
          {user?.role === "FERRY_STAFF" && (
            <Link href="/staff/ferry" className="hover:text-teal-700">
              Ferry Dashboard
            </Link>
          )}
          {user?.role === "PARK_STAFF" && (
            <Link href="/staff/park" className="hover:text-teal-700">
              Park Dashboard
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin" className="hover:text-teal-700">
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
