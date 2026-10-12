import React from "react";
import Link from "next/link";
import { AuthUIProvider } from "@/components/auth-provider";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#060810] font-sans antialiased p-4 sm:p-6">
      <div className="w-full max-w-[400px] flex flex-col">
        {/* Logo */}
        <header className="flex items-center justify-center pb-5">
          <Link href="/casino" className="flex items-center gap-1 select-none">
            <span className="text-2xl font-black italic tracking-tighter text-[#8B5CF6] leading-none">
              7X
            </span>
            <div className="flex flex-col ml-0.5 justify-center">
              <span className="text-[17px] font-black tracking-wide text-white leading-none">
                PASA
              </span>
              <span className="text-[6px] font-extrabold tracking-widest text-[#3E4D68] uppercase leading-none mt-0.5">
                PLAY 7X WIN 7X
              </span>
            </div>
          </Link>
        </header>

        {/* Card */}
        <div 
          className="w-full shadow-2xl"
          style={{
            padding: "32px 28px",
            background: "linear-gradient(180deg, #0F1424 0%, #0A0D18 100%)",
            border: "1px solid #1C253B",
            borderRadius: "20px",
            boxSizing: "border-box",
            boxShadow: "0 20px 50px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
            // @ts-ignore
            "--neon-background": "#0A0D18",
            "--neon-foreground": "#E8EAF0",
            "--neon-card": "#0A0D18",
            "--neon-card-foreground": "#E8EAF0",
            "--neon-primary": "#7C3AED",
            "--neon-primary-foreground": "#FFFFFF",
            "--neon-muted": "#070A12",
            "--neon-muted-foreground": "#6B7A90",
            "--neon-accent": "#1C253B",
            "--neon-accent-foreground": "#E8EAF0",
            "--neon-border": "#1C253B",
            "--neon-input": "#070A12",
            "--neon-ring": "#7C3AED",
            "--neon-radius": "10px",
          } as React.CSSProperties}
        >
          {/* Scoped CSS for Clean, Natural Form Elements */}
          <style dangerouslySetInnerHTML={{ __html: `
            .neon-auth-ui {
              color-scheme: dark !important;
              width: 100% !important;
            }
            .neon-auth-ui [data-slot="card"] {
              background: transparent !important;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              gap: 1.25rem !important;
            }
            /* Clean Card Header */
            .neon-auth-ui [data-slot="card-header"] {
              display: flex !important;
              flex-direction: column !important;
              gap: 0.375rem !important;
              padding: 0 !important;
              margin-bottom: 1.5rem !important;
              text-align: left !important;
            }
            .neon-auth-ui [data-slot="card-title"] {
              font-size: 1.25rem !important;
              font-weight: 700 !important;
              color: #FFFFFF !important;
              letter-spacing: -0.02em !important;
            }
            .neon-auth-ui [data-slot="card-description"] {
              font-size: 0.8125rem !important;
              color: #64748B !important;
            }
            .neon-auth-ui [data-slot="card-content"] {
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
            }
            .neon-auth-ui [data-slot="form-item"] {
              margin-bottom: 1.25rem !important;
              display: flex !important;
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            .neon-auth-ui label,
            .neon-auth-ui label[data-slot="form-label"] {
              color: #8E9BAE !important;
              font-size: 0.75rem !important;
              font-weight: 700 !important;
              text-transform: uppercase !important;
              letter-spacing: 0.05em !important;
              margin-bottom: 0.125rem !important;
              display: block !important;
            }
            .neon-auth-ui input,
            .neon-auth-ui input[data-slot="form-control"] {
              background-color: #070A12 !important;
              border: 1px solid #1A2236 !important;
              color: #E8EAF0 !important;
              border-radius: 0.625rem !important;
              height: 2.75rem !important;
              font-size: 0.875rem !important;
              padding: 0 0.875rem !important;
              outline: none !important;
              box-shadow: inset 0 1px 2px rgba(0,0,0,0.5) !important;
              width: 100% !important;
              box-sizing: border-box !important;
              transition: border-color 0.15s ease, box-shadow 0.15s ease !important;
            }
            .neon-auth-ui input:hover,
            .neon-auth-ui input[data-slot="form-control"]:hover {
              border-color: #283452 !important;
            }
            .neon-auth-ui input:focus,
            .neon-auth-ui input[data-slot="form-control"]:focus {
              border-color: #7C3AED !important;
              outline: none !important;
              box-shadow: 0 0 0 1px #7C3AED, 0 0 16px rgba(124,58,237,0.2) !important;
            }
            .neon-auth-ui input:-webkit-autofill,
            .neon-auth-ui input:-webkit-autofill:hover, 
            .neon-auth-ui input:-webkit-autofill:focus, 
            .neon-auth-ui input:-webkit-autofill:active {
              -webkit-box-shadow: 0 0 0 1000px #070A12 inset !important;
              -webkit-text-fill-color: #FFFFFF !important;
              caret-color: #FFFFFF !important;
              border-color: #1A2236 !important;
              border-radius: 0.625rem !important;
              transition: background-color 5000s ease-in-out 0s !important;
            }
            .neon-auth-ui input::placeholder {
              color: #475569 !important;
            }
            /* Primary Submit Button with Soft Gradient & Top Rim */
            .neon-auth-ui button[type="submit"] {
              background: linear-gradient(180deg, #7C3AED 0%, #5F27CD 100%) !important;
              color: #FFFFFF !important;
              font-weight: 600 !important;
              font-size: 0.9375rem !important;
              height: 2.75rem !important;
              border-radius: 0.625rem !important;
              border: none !important;
              border-top: 1px solid rgba(255, 255, 255, 0.25) !important;
              box-shadow: 0 2px 10px rgba(124, 58, 237, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.2) !important;
              cursor: pointer !important;
              width: 100% !important;
              margin-top: 0.5rem !important;
              transition: opacity 0.15s ease, transform 0.1s ease !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            .neon-auth-ui button[type="submit"]:hover {
              opacity: 0.92 !important;
            }
            .neon-auth-ui button[type="submit"]:active {
              transform: scale(0.98) !important;
            }
            /* Social Provider Button (Google) with Soft Dark Gradient */
            .neon-auth-ui [data-slot="provider-button"],
            .neon-auth-ui [data-slot="card-content"] button:not([type="submit"]) {
              background: linear-gradient(180deg, #151A2B 0%, #0D111D 100%) !important;
              border: 1px solid #20283E !important;
              color: #C0C8D8 !important;
              border-radius: 0.625rem !important;
              height: 2.75rem !important;
              font-size: 0.875rem !important;
              font-weight: 500 !important;
              cursor: pointer !important;
              width: 100% !important;
              box-shadow: 0 1px 3px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06) !important;
              box-sizing: border-box !important;
              transition: all 0.15s ease !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              gap: 0.5rem !important;
            }
            .neon-auth-ui [data-slot="provider-button"]:hover,
            .neon-auth-ui [data-slot="card-content"] button:not([type="submit"]):hover {
              background: linear-gradient(180deg, #1A2136 0%, #101524 100%) !important;
              border-color: #2D3A58 !important;
              color: #FFFFFF !important;
            }
            /* Separator */
            .neon-auth-ui [data-slot="separator"],
            .neon-auth-ui hr {
              border-color: #1A2236 !important;
              background-color: #1E2335 !important;
              margin: 1.5rem 0 !important;
            }
            .neon-auth-ui [data-slot="continue-with"] {
              background-color: #111420 !important;
              color: #64748B !important;
              font-size: 0.75rem !important;
              padding: 0 0.75rem !important;
            }
            /* Footer & Switch Link */
            .neon-auth-ui [data-slot="card-footer"] {
              padding-top: 1.5rem !important;
              margin-top: 0.5rem !important;
              border-top: 1px solid #1A1F2E !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              font-size: 0.8125rem !important;
              color: #64748B !important;
            }
            .neon-auth-ui [data-slot="card-footer"] button,
            .neon-auth-ui [data-slot="card-footer"] a,
            .neon-auth-ui [data-slot="footer-link"] {
              border: none !important;
              background: transparent !important;
              outline: none !important;
              box-shadow: none !important;
              height: auto !important;
              padding: 0 0 0 0.35rem !important;
              color: #8B5CF6 !important;
              font-weight: 600 !important;
              font-size: 0.8125rem !important;
              display: inline !important;
              text-decoration: none !important;
              cursor: pointer !important;
            }
            .neon-auth-ui [data-slot="card-footer"] button:hover,
            .neon-auth-ui [data-slot="card-footer"] a:hover,
            .neon-auth-ui [data-slot="footer-link"]:hover {
              text-decoration: underline !important;
              color: #A78BFA !important;
              background: transparent !important;
            }
            /* Forgot Password */
            .neon-auth-ui [data-slot="forgot-password-link"],
            .neon-auth-ui a[href*="forgot-password"] {
              color: #8B5CF6 !important;
              font-size: 0.75rem !important;
              font-weight: 500 !important;
              text-decoration: none !important;
              border: none !important;
              background: transparent !important;
            }
            .neon-auth-ui [data-slot="forgot-password-link"]:hover,
            .neon-auth-ui a[href*="forgot-password"]:hover {
              color: #A78BFA !important;
              text-decoration: underline !important;
            }
          `}} />

          <AuthUIProvider>
            {children}
          </AuthUIProvider>
        </div>

        {/* Back Link */}
        <div className="mt-4 text-center">
          <Link 
            href="/casino" 
            className="text-xs text-[#64748B] hover:text-white transition-colors"
          >
            ← Back to Casino Lobby
          </Link>
        </div>
      </div>
    </div>
  );
}
