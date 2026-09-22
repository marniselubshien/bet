import Link from "next/link";
import { auth } from "@/lib/auth/server";

export default async function LandingPage() {
  const { data: session } = await auth.getSession();
  const isLoggedIn = !!session?.user;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950 text-zinc-50">
      <header className="flex h-20 items-center justify-between border-b border-white/5 bg-zinc-900/50 px-6 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="text-2xl font-black tracking-tighter">
            STAKE<span className="text-blue-500">CLONE</span>
          </div>
        </div>
        <nav className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link
              href="/casino"
              className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
            >
              Go to Casino
            </Link>
          ) : (
            <>
              <Link
                href="/auth/sign-in"
                className="text-sm font-semibold text-zinc-400 transition-colors hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
        <h1 className="mb-6 max-w-4xl text-5xl font-black tracking-tight sm:text-7xl">
          The Ultimate <br className="hidden sm:block" />
          <span className="text-blue-500">Crypto Casino</span> Experience
        </h1>
        <p className="mb-10 max-w-2xl text-lg text-zinc-400">
          Play premium original games, scale infinitely with our advanced architecture, and enjoy lightning-fast payouts.
        </p>
        
        {isLoggedIn ? (
          <Link
            href="/casino"
            className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-105 hover:bg-blue-500"
          >
            Enter Casino Lobby
          </Link>
        ) : (
          <Link
            href="/auth/sign-up"
            className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-105 hover:bg-blue-500"
          >
            Play Now
          </Link>
        )}

        {/* Featured Games Grid Preview */}
        <div className="mt-24 grid w-full max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5">
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white/10 transition-transform group-hover:scale-110">DICE</div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-xl font-bold">Original Dice</h3>
            </div>
          </div>
          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5">
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white/10 transition-transform group-hover:scale-110">CRASH</div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-xl font-bold">Crash</h3>
            </div>
          </div>
          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-900 border border-white/5">
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-white/10 transition-transform group-hover:scale-110">PLINKO</div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="text-xl font-bold">Plinko</h3>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
