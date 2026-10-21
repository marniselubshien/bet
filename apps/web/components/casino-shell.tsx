"use client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  Home,
  Gift,
  User,
  Headphones,
  Wallet,
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  History,
  X,
} from "lucide-react"
import { authClient } from "@/lib/auth/client"
import styles from "./casino-shell.module.css"
interface CasinoShellProps {
  session: { user?: { name?: string | null; email?: string | null } } | null
  profile: { balance?: string | number | null; name?: string | null } | null | undefined
  children: React.ReactNode
}
export function CasinoShell({ session, profile, children }: CasinoShellProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const hideHeader = /^\/casino\/(account|wallet)(\/|$)/.test(pathname) || /^\/casino\/(deposit|withdraw|deposit-history|withdrawal-history)(\/|$)/.test(pathname)
  const signedIn = !!session?.user
  const [open, setOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const [error, setError] = useState("")
  const menu = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const name = profile?.name || session?.user?.name || "My account"
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node)) setOpen(false)
    }
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener("pointerdown", outside)
    document.addEventListener("keydown", escape)
    return () => {
      document.removeEventListener("pointerdown", outside)
      document.removeEventListener("keydown", escape)
    }
  }, [open])
  async function logout() {
    setSigningOut(true)
    setError("")
    try {
      const result = await authClient.signOut()
      if (result?.error)
        throw new Error("Unable to sign out. Please try again.")
      setOpen(false)
      router.refresh()
      router.push("/auth/sign-in")
    } catch {
      setError("Unable to sign out. Please try again.")
    } finally {
      setSigningOut(false)
    }
  }
  const links = [
    { href: "/casino", label: "Games", icon: Home },
    { href: signedIn ? "/casino/wallet" : "/auth/sign-in", label: "Wallet", icon: Wallet },
    { href: signedIn ? "/casino/account" : "/auth/sign-in", label: "Account", icon: User },
  ]

  return (
    <div className={styles.shell}>
      {!hideHeader && <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link
            href="/casino"
            className={styles.logo}
            aria-label="7X PASA home"
          >
            <span>7X</span>PASA
            <span className={styles.logoDot} />
          </Link>
          <nav className={styles.desktopNav} aria-label="Main navigation">
            {links
              .filter((l) => l.label !== "Account" && l.label !== "Sign in")
              .map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                >
                  {l.label}
                </Link>
              ))}
          </nav>
          <div className={styles.actions}>
            <Link href="/casino?search=1" className={styles.searchButton} aria-label="Search games"><Search size={20}/></Link>
            {signedIn ? (
              <>
                <Link href="/casino/wallet" className={styles.wallet} aria-label={`Open wallet, balance INR ${Number(profile?.balance || 0).toFixed(2)}`}>
                  <span>
                    <small>INR balance</small><strong>₹
                    {Number(profile?.balance || 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </strong></span>
                  <Wallet size={18} aria-hidden="true" />
                </Link>
                <div ref={menu} className={styles.account}>
                  <button
                    ref={trigger}
                    className={styles.profile}
                    onClick={() => setOpen(!open)}
                    aria-expanded={open}
                    aria-controls="account-dropdown"
                    aria-label="Account menu"
                  >
                    <User size={18} />
                    <ChevronDown size={13} />
                  </button>
                  {open && (
                    <div id="account-dropdown" className={styles.dropdown}>
                      <div className={styles.identity}>
                        <strong>{name}</strong>
                        <span>{session?.user?.email}</span>
                        <button
                          aria-label="Close account menu"
                          onClick={() => {
                            setOpen(false)
                            trigger.current?.focus()
                          }}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      {[
                        {
                          href: "/casino/account",
                          label: "My account",
                          icon: User,
                        },
                        {
                          href: "/casino/wallet",
                          label: "Wallet",
                          icon: Wallet,
                        },
                        {
                          href: "/casino/game-history",
                          label: "Game history",
                          icon: History,
                        },
                        {
                          href: "/casino/settings",
                          label: "Settings",
                          icon: Settings,
                        },
                      ].map(({ href, label, icon: Icon }) => (
                        <Link
                          key={label}
                          href={href}
                          onClick={() => setOpen(false)}
                        >
                          <Icon size={17} />
                          {label}
                        </Link>
                      ))}
                      <button
                        className={styles.logout}
                        onClick={logout}
                        disabled={signingOut}
                      >
                        <LogOut size={17} />
                        {signingOut ? "Signing out…" : "Sign out"}
                      </button>
                      {error && <p role="alert">{error}</p>}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/sign-in" className={styles.signIn}>
                  Sign in
                </Link>
                <Link href="/auth/sign-up" className={styles.join}>
                  Join now
                </Link>
              </>
            )}

          </div>
        </div>
      </header>}
      <main
        className={`${styles.main} ${pathname.startsWith("/casino/games/") && pathname !== "/casino/games/mines" ? styles.compactGame : ""}`}
      >
        {searchParams.get("error") === "account_not_linked" && <div className={styles.authNotice} role="alert">This email already has an account. <Link href="/auth/sign-in">Sign in with your password</Link> to continue.</div>}
        {children}
      </main>
      <nav className={styles.bottomNav} aria-label="Bottom navigation">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/casino"
              ? pathname === "/casino" || pathname.startsWith("/casino/games/")
              : pathname.startsWith(href)
          return (
            <Link
              key={label}
              href={href}
              aria-current={active ? "page" : undefined}
            >
              <span>
                <Icon size={21} />
              </span>
              {label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
