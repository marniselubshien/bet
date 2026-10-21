import Link from "next/link"
import {ArrowLeft, ArrowDownLeft, ArrowUpRight, History, ChevronRight, Receipt} from "lucide-react"
import {auth} from "@/lib/auth/server"
import {db} from "@/db"
import {profiles,payments} from "@/db/schema"
import {eq,and,desc} from "drizzle-orm"
import styles from "./payments.module.css"
export async function PaymentPage({kind,history=false}: {kind:"deposit"|"withdrawal";history?:boolean}) {
 const {data:session}=await auth.getSession()
 const deposit=kind==="deposit"
 const base=deposit ? "deposit" : "withdraw"
 const title=history ? `${deposit ? "Deposit" : "Withdrawal"} history` : deposit ? "Deposit" : "Withdraw"
 const profile=session?.user ? await db.query.profiles.findFirst({where:eq(profiles.id,session.user.id)}) : null
 const records=history && session?.user ? await db.select({id:payments.id,amount:payments.amount,status:payments.status,createdAt:payments.createdAt}).from(payments).where(and(eq(payments.userId,session.user.id),eq(payments.type,kind))).orderBy(desc(payments.createdAt)).limit(100) : []
 return <div className={styles.page}>
 <header className={styles.header}><Link href={history ? `/casino/wallet/${base}` : '/casino/wallet'} aria-label="Back to wallet"><ArrowLeft size={20}/></Link><h1>{title}</h1>{!history ? <Link href={`/casino/wallet/${deposit ? 'deposit-history' : 'withdrawal-history'}`} aria-label={`${title} history`}><History size={19}/></Link> : <span/>}</header>
 {!session?.user ? <div className={styles.empty}><h2>Sign in to continue</h2><p>Your wallet and payment history are private.</p><Link className={styles.primary} href="/auth/sign-in">Sign in</Link></div> : <>
 {!history && <><section className={styles.balance}><span>Available balance <small>INR</small></span><strong>₹{Number(profile?.balance||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2})}</strong><p>Funds in your game wallet</p></section><section className={styles.section}><h2>{deposit ? 'Add money' : 'Transfer to your account'}</h2><p>{deposit ? 'Choose a payment method when deposits are available.' : 'Withdraw available funds once payouts are enabled.'}</p><div className={styles.method}>{deposit ? <ArrowDownLeft size={21}/> : <ArrowUpRight size={21}/>}<div><strong>Bank / UPI</strong><span>Payment setup pending</span></div><span className={styles.badge}>Unavailable</span></div><div className={styles.notice}>Payments are not enabled yet. No money will be charged or transferred from this page.</div><button disabled className={styles.primary}>{deposit ? 'Deposits unavailable' : 'Withdrawals unavailable'}</button></section><Link className={styles.historyLink} href={`/casino/wallet/${deposit ? 'deposit-history' : 'withdrawal-history'}`}><History size={18}/><span>View {deposit ? 'deposit' : 'withdrawal'} history</span><ChevronRight size={16}/></Link></>}
 {history && <><p className={styles.subtitle}>Your latest {deposit ? 'deposits' : 'withdrawals'}, newest first.</p>{records.length ? <div className={styles.records}>{records.map(r=><article key={r.id}><div className={styles.recordTop}><strong>₹{Number(r.amount).toLocaleString('en-IN',{minimumFractionDigits:2})}</strong><span className={`${styles.status} ${r.status==='completed' ? styles.success : r.status==='failed' ? styles.failed : ''}`}>{r.status}</span></div><time>{r.createdAt?.toLocaleString('en-IN',{dateStyle:'medium',timeStyle:'short',timeZone:'Asia/Kolkata'})} IST</time><div className={styles.reference}>Reference <span>{r.id}</span></div></article>)}</div> : <div className={styles.empty}><Receipt size={30}/><h2>No {deposit ? 'deposits' : 'withdrawals'} yet</h2><p>Your transactions and their status will appear here.</p><Link href="/casino/wallet">Back to wallet</Link></div>}</>}
 <p className={styles.help}>Need a hand? <Link href="/casino/support">Contact support</Link></p>
 </>}
 </div>
}
