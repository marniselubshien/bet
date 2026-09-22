"use client";

import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export function ClientLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 rounded-md bg-white/5 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
    >
      <LogOut className="h-4 w-4" />
      Sign Out
    </button>
  );
}
