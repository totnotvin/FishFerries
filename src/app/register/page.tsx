import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { AuthForm } from "@/components/AuthForm";
import { IslandHero } from "@/components/IslandHero";

export default function RegisterPage() {
  return (
    <div className="flex-1 grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-center bg-sand-100 dark:bg-lagoon-800/40 px-12 py-16 border-r border-lagoon-900/10 dark:border-white/10">
        <IslandHero className="w-full h-auto rounded-2xl mb-8" />
        <h2 className="font-display text-2xl font-medium text-lagoon-900 dark:text-sand-50 max-w-sm">
          Three generations of picnics. One new theme park.
        </h2>
        <p className="text-sm text-lagoon-900/60 dark:text-sand-100/60 mt-2 max-w-sm">
          Create an account to book your stay, your ferry crossing, and your
          first day at the park.
        </p>
      </div>

      <div className="mx-auto w-full max-w-md px-4 py-16 flex flex-col justify-center">
        <div className="card">
          <h1 className="font-display text-2xl font-medium mb-1 text-lagoon-900 dark:text-sand-50">
            Create your account
          </h1>
          <p className="text-sm text-neutral-500 mb-6">
            Book hotels, ferry rides, and theme park tickets for Picnic Island.
          </p>
          <AuthForm action={registerAction} mode="register" />
          <p className="text-sm text-neutral-500 mt-6">
            Already have an account?{" "}
            <Link className="text-coral-600 font-medium hover:underline" href="/login">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
