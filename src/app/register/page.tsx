import Link from "next/link";
import { registerAction } from "@/lib/actions/auth";
import { AuthForm } from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md w-full px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-semibold mb-1">Create your account</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Book hotels, ferry rides, and theme park tickets for Picnic Island.
        </p>
        <AuthForm action={registerAction} mode="register" />
        <p className="text-sm text-neutral-500 mt-6">
          Already have an account?{" "}
          <Link className="text-teal-700 font-medium hover:underline" href="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
