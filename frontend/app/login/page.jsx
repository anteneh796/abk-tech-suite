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

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()

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
              <Input id="email" type="email" placeholder="admin@abk.com" {...register("email")} />
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  Enter Dashboard
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Restricted Access:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-medium">System Admin:</span> admin@abk.com
              </p>
              <p className="text-[10px] mt-2 opacity-75">(Use the authorized password to proceed)</p>
            </div>
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
          <blockquote className="text-lg font-medium mb-4">
            "ABK Technologies transformed our hospital's equipment maintenance. Their response time and expertise are
            unmatched."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20" />
            <div>
              <p className="font-medium">Dr. Alemayehu Bekele</p>
              <p className="text-sm text-muted-foreground">Director, University of Gondar Hospital</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
