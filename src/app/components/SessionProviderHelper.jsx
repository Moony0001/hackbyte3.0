"use client"
import { SessionProvider } from "next-auth/react";

export default function SessionProviderHelper({ children }) {
    return (
        <SessionProvider>{children}</SessionProvider>
    )
}