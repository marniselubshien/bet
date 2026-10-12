import { auth } from "@/lib/auth/server";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CasinoShell } from "@/components/casino-shell";

export const dynamic = "force-dynamic";

export default async function CasinoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session } = await auth.getSession();

  let profile = null;
  if (session?.user) {
    profile = await db.query.profiles.findFirst({
      where: eq(profiles.id, session.user.id),
    });
    
    if (!profile) {
      const [newProfile] = await db.insert(profiles).values({
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        balance: "1000.00",
      }).returning();
      profile = newProfile;
    }
  }

  return (
    <CasinoShell session={session} profile={profile}>
      {children}
    </CasinoShell>
  );
}
