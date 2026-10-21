import "server-only"
import { auth } from "@/lib/auth/server"
export async function playerId() {
  const { data: session } = await auth.getSession()
  if (!session?.user) throw new Error("Sign in to play")
  return session.user.id
}
