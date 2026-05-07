"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FileText,
  Zap,
  Plus,
  Activity,
  PieChart as PieIcon,
  ShieldCheck,
  TrendingUp,
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
  AreaChart,
  Area
} from "recharts"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

const COLORS = ['#0060A9', '#FFB200', '#00C49F', '#FF8042', '#8884d8'];

export default function AdminDashboard() {
  const { data: serverStats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: api.getAdminStats
  })

  if (isLoading) return <DashboardSkeleton />;

  const stats = [
    {
      label: "Total Projects",
      value: serverStats?.kpis?.totalProjects || "0",
      change: "+2 this month",
      icon: FileText,
      color: "text-[#0060A9]",
      bgColor: "bg-[#0060A9]/10",
    },
    {
      label: "Services",
      value: serverStats?.kpis?.totalServices || "0",
      change: "Active",
      icon: Zap,
      color: "text-[#FFB200]",
      bgColor: "bg-[#FFB200]/10",
    },
    {
      label: "Uptime",
      value: "99.9%",
      change: "Stable",
      icon: ShieldCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
        label: "Efficiency",
        value: "94%",
        change: "High",
        icon: TrendingUp,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    }
  ]

  // Mock data for charts (would ideally come from backend)
  const lineData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  const pieData = [
    { name: 'Industrial', value: 400 },
    { name: 'Renewable', value: 300 },
    { name: 'Innovation', value: 300 },
    { name: 'Medical', value: 200 },
  ];

  return (
    <div className="space-y-8 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground">Monitor engineering operations and site analytics.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild className="bg-[#0060A9] hover:bg-[#0060A9]/90 shadow-lg shadow-[#0060A9]/20">
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-none shadow-sm bg-card hover:shadow-md transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <Badge variant="secondary" className="bg-muted/50 text-[10px] uppercase tracking-wider">
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                   <Activity className="h-5 w-5 text-[#0060A9]" />
                   Operational Activity
                </CardTitle>
                <CardDescription>Monthly project engagement and site visits</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={lineData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0060A9" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#0060A9" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748B'}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#0060A9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <PieIcon className="h-5 w-5 text-[#FFB200]" />
               Project Distribution
            </CardTitle>
            <CardDescription>By engineering category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
               {pieData.map((item, i) => (
                 <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                 </div>
               ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health / Info */}
      <Card className="border-none shadow-sm bg-zinc-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0060A9]/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Vitality
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400">Database Connection</span>
              <span className="text-emerald-500">Optimized</span>
            </div>
            <Progress value={100} className="h-1 bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400">Media Pipeline (Cloudinary)</span>
              <span className="text-emerald-500">Ready</span>
            </div>
            <Progress value={92} className="h-1 bg-zinc-800" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-zinc-400">API Latency</span>
              <span className="text-emerald-500">24ms</span>
            </div>
            <Progress value={15} className="h-1 bg-zinc-800" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8 p-1">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-none shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-12 w-12 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Skeleton className="lg:col-span-2 h-[400px] rounded-xl" />
        <Skeleton className="h-[400px] rounded-xl" />
      </div>
    </div>
  )
}

