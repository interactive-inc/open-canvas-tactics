import type { ReactNode } from "react"
import { useEffect } from "react"
import { useAppSelector } from "@/store"
import { Header } from "./header"
import { StatusBar } from "./status-bar"

interface AppLayoutProps {
  children: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useAppSelector((state) => state.ui.theme)

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="flex-1 overflow-auto" aria-label="メインコンテンツ">
        {children}
      </main>
      <StatusBar />
    </div>
  )
}
