"use server"
import { adminCommand } from "@workspace/casino/platform"
import { adminId } from "@/lib/admin"
import { revalidatePath } from "next/cache"
export async function updateGame(form: FormData) {
  await adminCommand(await adminId(), {
    kind: "game",
    name: String(form.get("name") || ""),
    description: String(form.get("description") || ""),
    image: String(form.get("image") || ""),
    categoryId: String(form.get("categoryId") || ""),
    sortOrder: Number(form.get("sortOrder")),
    slug: String(form.get("slug")),
    status: String(form.get("status")),
    visible: form.get("visible") === "on",
    min: Number(form.get("min")),
    max: Number(form.get("max")),
    payout: Number(form.get("payout")),
    reason: String(form.get("reason") || ""),
  })
  revalidatePath("/games")
}
export async function updatePlatform(form: FormData) {
  await adminCommand(await adminId(), {
    kind: "platform",
    paused: form.get("paused") === "true",
    reason: String(form.get("reason") || ""),
  })
  revalidatePath("/games")
}
export async function restrictPlayer(form: FormData) {
  await adminCommand(await adminId(), {
    kind: "restrict",
    target: String(form.get("userId") || ""),
    slug: String(form.get("slug") || ""),
    reason: String(form.get("reason") || ""),
  })
  revalidatePath("/users")
}
export async function removeRestriction(form: FormData) {
  await adminCommand(await adminId(), {
    kind: "unrestrict",
    id: String(form.get("id")),
    reason: String(form.get("reason") || ""),
  })
  revalidatePath("/users")
}

export async function updatePriorities(form: FormData) {
  const priorities = form.getAll("slug").map(value => {
    const slug = String(value)
    const raw = form.get(`priority:${slug}`)
    if (typeof raw !== "string" || !raw.trim()) throw new Error("Every game needs a priority")
    return { slug, priority: Number(raw) }
  })
  await adminCommand(await adminId(), {kind: "priorities", priorities, reason: "Updated game display priorities"})
  revalidatePath("/games")
}
