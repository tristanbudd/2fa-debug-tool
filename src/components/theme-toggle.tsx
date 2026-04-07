"use client"

/**
 * @file theme-toggle.tsx
 * @description Client-side light/dark mode toggle. Persists user preference in localStorage.
 */
import { useEffect } from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

type ThemeMode = "light" | "dark"

const THEME_STORAGE_KEY = "2fa-debug-tool-theme"

function getInitialTheme(): ThemeMode {
  if (typeof window === "undefined") {
    return "light"
  }

  const stored = window.localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === "light" || stored === "dark") {
    return stored
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

export function ThemeToggle() {
  useEffect(() => {
    const initialTheme = getInitialTheme()
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
    window.localStorage.setItem(THEME_STORAGE_KEY, initialTheme)
  }, [])

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark")
    const nextTheme: ThemeMode = isDark ? "light" : "dark"

    document.documentElement.classList.toggle("dark", nextTheme === "dark")
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label="Toggle light or dark mode"
      onClick={toggleTheme}
    >
      <Sun className="size-4 dark:hidden" aria-hidden />
      <Moon className="hidden size-4 dark:block" aria-hidden />
      Theme
    </Button>
  )
}
