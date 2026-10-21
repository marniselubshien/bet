"use client"
import { useRef } from "react"
// Retain the same key after an uncertain response so Retry cannot place a second wager.
export function useBetRequest() {
  const pending = useRef<{ signature: string; id: string } | null>(null)
  return {
    requestId(input: unknown) {
      const signature = JSON.stringify(input)
      if (!pending.current || pending.current.signature !== signature)
        pending.current = { signature, id: crypto.randomUUID() }
      return pending.current.id
    },
    complete() {
      pending.current = null
    },
  }
}
