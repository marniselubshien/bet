import Link from "next/link";
export default function AccessDenied() {
  return (
    <main className="mx-auto max-w-lg p-12">
      <h1 className="text-2xl font-bold">Administrator access required</h1>
      <p className="mt-4">
        Your account does not have permission to use this portal. Ask an
        existing administrator to grant access to your user ID.
      </p>
      <Link className="mt-4 inline-block underline" href="/auth/sign-in">
        Sign in with another account
      </Link>
    </main>
  )
}
