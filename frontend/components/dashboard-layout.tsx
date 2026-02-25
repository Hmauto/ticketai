"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { useState } from "react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="flex h-screen bg-background">
          {/* Sidebar */}
          <aside className="hidden w-64 flex-col md:flex">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-auto p-6">
              {children}
            </main>
          </div>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
