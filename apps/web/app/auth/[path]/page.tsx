import { AuthView } from "@neondatabase/auth-ui";
import { authViewPaths } from "@neondatabase/auth-ui/server";
import { AlertCircle } from "lucide-react";

export const dynamicParams = true;

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
  searchParams,
}: {
  params: Promise<{ path: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { path } = await params;
  const { error } = await searchParams;

  return (
    <div className="w-full">
      {/* Account Not Linked Error Alert */}
      {error === "account_not_linked" && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-4 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-300">Account exists with password</p>
            <p className="text-[11px] text-amber-200/80 mt-0.5">
              This email was registered with a password. Please sign in with your email and password below.
            </p>
          </div>
        </div>
      )}

      {/* Neon Auth UI View */}
      <AuthView path={path} />
    </div>
  );
}
