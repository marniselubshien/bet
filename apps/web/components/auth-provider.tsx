"use client";

import React from "react";
import { NeonAuthUIProvider } from "@neondatabase/auth-ui";
import { authClient } from "@/lib/auth/client";
import "@neondatabase/auth-ui/css";

export function AuthUIProvider({ children }: { children: React.ReactNode }) {
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      redirectTo="/casino"
    >
      {children}
    </NeonAuthUIProvider>
  );
}
