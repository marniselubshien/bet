import { DM_Sans } from "next/font/google"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("dark antialiased",  "font-sans", dmSans.variable)}
    >
      <body className="min-h-screen bg-[#07080E] text-white antialiased">
        <ThemeProvider forcedTheme="dark" defaultTheme="dark">{children}</ThemeProvider>
      </body>
    </html>
  )
}
