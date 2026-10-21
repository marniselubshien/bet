import Link from "next/link"
import { Wallet, Headphones, FileText, ChevronRight, User } from "lucide-react"
import { auth } from "@/lib/auth/server"
import { db } from "@/db"
import { profiles } from "@/db/schema"
import { eq } from "drizzle-orm"
import { ClientLogoutButton } from "@/components/client-logout-button"
export const dynamic = "force-dynamic"
export default async function AccountPage() {
 const {data:session}=await auth.getSession()
 if(!session?.user) return <div className="space-y-4 py-6"><User className="text-slate-400" size={28}/><h1 className="text-xl font-semibold">Your account</h1><p className="text-sm leading-6 text-slate-400">Sign in to view your profile and manage your wallet.</p><Link href="/auth/sign-in" className="inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white">Sign in</Link></div>
 const profile=await db.query.profiles.findFirst({where:eq(profiles.id,session.user.id)})
 const name=profile?.name || session.user.name || "Player"
 return <div className="space-y-6 py-2">
 <h1 className="text-xl font-semibold tracking-tight">Account</h1>
 <section className="flex items-center gap-3 border-b border-slate-700/50 pb-5"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-700/60 text-lg font-semibold text-slate-200">{name.slice(0,1).toUpperCase()}</div><div className="min-w-0"><h2 className="truncate text-base font-semibold">{name}</h2><p className="mt-1 break-all text-xs text-slate-400">{session.user.email}</p></div></section>
 <section className="rounded-xl border border-slate-700/60 bg-[#202632] p-4"><span className="text-xs text-slate-400">Available balance</span><div className="mt-2 flex items-center justify-between gap-3"><strong className="text-2xl font-semibold tabular-nums">₹{Number(profile?.balance || 0).toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><Link href="/casino/wallet" className="flex items-center gap-2 text-xs font-medium text-slate-200">Open wallet<ChevronRight size={15}/></Link></div></section>
 <section><h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Manage</h2>{[{href:"/casino/wallet",label:"Wallet",description:"View your wallet and payment options",icon:Wallet},{href:"/casino/support",label:"Support",description:"Get help with your account or games",icon:Headphones}].map(({href,label,description,icon:Icon})=><Link key={href} href={href} className="flex items-center gap-3 border-b border-slate-700/40 py-4"><Icon size={19} className="shrink-0 text-slate-400"/><div className="flex-1"><span className="text-sm font-medium">{label}</span><p className="mt-1 text-xs text-slate-500">{description}</p></div><ChevronRight size={16} className="text-slate-500"/></Link>)}</section>
 <details className="border-b border-slate-700/40 pb-4"><summary className="flex cursor-pointer items-center gap-3 py-2 text-sm font-medium"><FileText size={19} className="text-slate-400"/>Policies & information</summary><p className="mt-3 text-xs leading-6 text-slate-400">For terms, privacy information, or questions about your account data, please contact <Link href="/casino/support" className="underline">support</Link>. Policy documents have not yet been published here.</p></details>
 <ClientLogoutButton/>
 </div>
}
