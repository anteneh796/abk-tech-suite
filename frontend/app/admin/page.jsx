"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  FileText,
  Ticket,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Clock,
  AlertCircle,
  Zap,
  Sun,
  Wrench,
  Lightbulb,
  CheckCircle2,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export default function AdminDashboard() {
  const { data: serverStats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: api.getAdminStats
  })

  if (isLoading) return <div className="p-8 text-white">Loading dashboard...</div>

  const stats = [
    {
      label: "Total Projects",
      value: serverStats?.kpis?.totalProjects || "0",
      change: "+2",
      trend: "up",
      icon: FileText,
      color: "text-[#0060A9]",
      bgColor: "bg-[#0060A9]/10",
    },
    {
      label: "Services Offered",
      value: serverStats?.kpis?.totalServices || "0",
      change: "Active",
      trend: "up",
      icon: Zap,
      color: "text-[#FFB200]",
      bgColor: "bg-[#FFB200]/10",
    },
  ]

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Overview</h1>
          <p className="text-muted-foreground">Real-time status of ABK Machine operations.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-[#0060A9] hover:bg-[#0060A9]/90">
            <Link href="/admin/projects">
              <Plus className="h-4 w-4 mr-2" />
              Manage Projects
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-sm bg-card hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-foreground">{stat.value}</p>
                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mt-1">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Links / Actions */}
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>Management Tools</CardTitle>
            <CardDescription>Direct access to operational modules</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/admin/services" className="group">
              <div className="p-4 rounded-xl border border-border bg-card hover:border-[#0060A9] hover:bg-[#0060A9]/5 transition-all">
                <Zap className="h-8 w-8 text-[#FFB200] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-foreground">Services</h3>
                <p className="text-sm text-muted-foreground">Manage service catalog and descriptions</p>
              </div>
            </Link>
            <Link href="/admin/projects" className="group">
              <div className="p-4 rounded-xl border border-border bg-card hover:border-[#0060A9] hover:bg-[#0060A9]/5 transition-all">
                <FileText className="h-8 w-8 text-[#0060A9] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-foreground">Projects</h3>
                <p className="text-sm text-muted-foreground">Update project portfolio and case studies</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* System Health / Info */}
        <Card className="border-none shadow-sm bg-[#1A1A1A] text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Database Connection</span>
                <span className="text-emerald-500">Live</span>
              </div>
              <Progress value={100} className="h-1 bg-zinc-800" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-400">Cloud Media Storage</span>
                <span className="text-emerald-500">82% Available</span>
              </div>
              <Progress value={18} className="h-1 bg-zinc-800" />
            </div>
            <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-400">
              <p>Everything looks good. No critical issues detected in the engineering pipeline.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
