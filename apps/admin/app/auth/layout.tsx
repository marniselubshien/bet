import { AuthUIProvider } from "@/components/auth-provider"
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AuthUIProvider>{children}</AuthUIProvider>
}
