import { adminId } from "@/lib/admin"
import Link from "next/link"
import {
  Users,
  Gamepad2,
  Receipt,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react"
export const dynamic = "force-dynamic"
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await adminId()
  return (
    <div className="flex min-h-screen bg-background font-sans text-foreground">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/" className="text-xl font-black text-white">
            Stake <span className="text-primary">Admin</span>
          </Link>
        </div>
        <nav className="space-y-2 p-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </Link>
          <Link
            href="/users"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
          >
            <Users className="h-4 w-4" /> Users
          </Link>
          <Link
            href="/games"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
          >
            <Gamepad2 className="h-4 w-4" /> Games
          </Link>
          <Link
            href="/rounds"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
          >
            <Receipt className="h-4 w-4" /> Rounds
          </Link>
          <Link
            href="/payments"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
          >
            <Receipt className="h-4 w-4" /> Payments
          </Link>
          <Link
            href="/support"
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
          >
            <HelpCircle className="h-4 w-4" /> Support
          </Link>
        </nav>
      </aside>
      <main className="min-h-screen flex-1 pl-64">
        <header className="flex h-16 items-center border-b border-border bg-background px-8">
          <h2 className="font-bold">Admin Portal</h2>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
