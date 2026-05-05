"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/components/providers/auth-provider"
import { LoadingSkeleton } from "@/components/ui/loading-skeleton"

export function ProtectedRoute({ children, allowedRoles = [] }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Always allow the public root to be visible even when a user is logged in
    if (pathname === "/") {
      return
    }

    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role when accessing restricted pages
      if (user.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/portal")
      }
    }
  }, [user, isLoading, router, allowedRoles, pathname])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <LoadingSkeleton className="h-8 w-3/4 mx-auto" />
          <LoadingSkeleton className="h-4 w-1/2 mx-auto" />
          <LoadingSkeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return null
  }

  return children
}
