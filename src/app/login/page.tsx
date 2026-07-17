import Link from "next/link";
import { loginAction, quickLoginAction } from "@/lib/actions/auth";
import { AuthForm } from "@/components/AuthForm";

const DEMO_ROLES = [
  { role: "VISITOR", label: "Visitor" },
  { role: "HOTEL_STAFF", label: "Hotel Staff" },
  { role: "FERRY_STAFF", label: "Ferry Staff" },
  { role: "PARK_STAFF", label: "Theme Park Staff" },
  { role: "ADMIN", label: "Admin" },
];

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md w-full px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-1">Welcome back</h1>
        <p className="text-sm text-neutral-500 mb-6">Log in to Picnic Island Booking.</p>
        <AuthForm action={loginAction} mode="login" />
        <p className="text-sm text-neutral-500 mt-6">
          New here?{" "}
          <Link className="text-teal-700 font-medium hover:underline" href="/register">
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
  );
}
