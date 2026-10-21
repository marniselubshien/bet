"use server"
import { adminCommand } from "@workspace/casino/platform"
import { adminId } from "@/lib/admin"
import { revalidatePath } from "next/cache"
export async function refundRound(form: FormData) {
  await adminCommand(await adminId(), {
    kind: "refund",
    id: String(form.get("id")),
    reason: String(form.get("reason") || ""),
  })
  revalidatePath("/rounds")
}
