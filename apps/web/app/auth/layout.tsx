import Link from "next/link";
import { AuthUIProvider } from "@/components/auth-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#0F212E] text-white">
      <div className="mb-6 text-center">
        <Link href="/casino" className="inline-block">
          <span className="text-4xl font-black text-white italic font-serif tracking-tight hover:opacity-90 transition-opacity">
            Stake
          </span>
        </Link>
        <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">
          Official Neon Auth Portal
        </p>
      </div>

      <div className="w-full max-w-md overflow-hidden rounded-xl shadow-2xl bg-[#1A2C38] border border-[#2F4553] p-6">
        <AuthUIProvider>
          {children}
        </AuthUIProvider>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400">
        <Link href="/casino" className="hover:text-white transition-colors underline underline-offset-4">
          Return to Casino
        </Link>
      </div>
    </div>
  );
}
