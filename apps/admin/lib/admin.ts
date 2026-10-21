import "server-only"
import { auth } from "@/lib/auth/server"
import { requireAdmin } from "@workspace/casino/platform"
import { redirect } from "next/navigation"
export async function adminId() {
  const { data: session } = await auth.getSession()
  if (!session?.user) redirect("/auth/sign-in")
  try {
    await requireAdmin(session.user.id)
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Administrator access required"
    )
      redirect("/access-denied")
    throw error
  }
  return session.user.id
}
