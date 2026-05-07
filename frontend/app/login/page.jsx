"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useAuth } from "@/components/providers/auth-provider"
import { Zap, Eye, EyeOff, ArrowRight, Loader2, Settings, Wrench } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useEffect } from "react"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
  
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const result = await login(data.email, data.password)
      if (result.success) {
        toast.success(`Welcome back, ${result.user.name}!`)
        // Redirect based on role
        if (result.user.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/")
        }
      } else {
        toast.error(result.error || "Invalid email or password")
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <Settings className="w-10 h-10 text-[#0060A9] animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Wrench className="w-6 h-6 text-[#3A3A3A] rotate-45" />
              </div>
              <div className="absolute top-0 left-0">
                <Zap className="w-3 h-3 text-[#FFB200] fill-[#FFB200]" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-none">ABK</span>
              <span className="text-xs text-muted-foreground leading-none">Machine - Maintenance</span>
            </div>
          </Link>

          <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
          <p className="text-muted-foreground mb-8">Access the hidden administrative portal.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@company.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-[#0060A9] hover:bg-[#004e8a]" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Secure Login
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ABK Technologies. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block flex-1 relative bg-card">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/solar-panels-renewable-energy-installation.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <blockquote className="text-lg font-medium mb-4 italic">
            "{settings?.login_quote_text || "ABK Technologies transformed our hospital's equipment maintenance. Their response time and expertise are unmatched."}"
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0060A9]/20 flex items-center justify-center font-bold text-[#0060A9]">
              {settings?.login_quote_author?.[0] || "A"}
            </div>
            <div>
              <p className="font-medium">{settings?.login_quote_author || "Dr. Alemayehu Bekele"}</p>
              <p className="text-sm text-muted-foreground">{settings?.login_quote_role || "Director, University of Gondar Hospital"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
