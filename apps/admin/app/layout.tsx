import { Geist, Geist_Mono, Inter } from "next/font/google"
import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { Users, Gamepad2, Receipt, HelpCircle, LayoutDashboard } from "lucide-react";

const inter = Inter({subsets:['latin'],variable:'--font-sans'})
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}>
      <body>
        <ThemeProvider>
          <div className="flex min-h-screen bg-background text-foreground font-sans">
            <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-border">
              <div className="flex h-16 items-center px-6 border-b border-border">
                <Link href="/" className="text-xl font-black text-white">Stake <span className="text-primary">Admin</span></Link>
              </div>
              <nav className="p-4 space-y-2">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white rounded-md"><LayoutDashboard className="h-4 w-4"/> Dashboard</Link>
                <Link href="/users" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white rounded-md"><Users className="h-4 w-4"/> Users</Link>
                <Link href="/games" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white rounded-md"><Gamepad2 className="h-4 w-4"/> Games</Link>
                <Link href="/payments" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white rounded-md"><Receipt className="h-4 w-4"/> Payments</Link>
                <Link href="/support" className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-sidebar-foreground hover:bg-sidebar-accent hover:text-white rounded-md"><HelpCircle className="h-4 w-4"/> Support</Link>
              </nav>
            </aside>
            <main className="flex-1 pl-64 min-h-screen">
              <header className="h-16 border-b border-border bg-background flex items-center px-8">
                <h2 className="font-bold">Admin Portal</h2>
              </header>
              <div className="p-8">
                {children}
              </div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
