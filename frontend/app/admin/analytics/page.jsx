"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, Ticket, BarChart3, PieChartIcon } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts"

const revenueData = [
  { month: "Jan", revenue: 7800000, projects: 18 },
  { month: "Feb", revenue: 8200000, projects: 20 },
  { month: "Mar", revenue: 9100000, projects: 22 },
  { month: "Apr", revenue: 8700000, projects: 19 },
  { month: "May", revenue: 9500000, projects: 24 },
  { month: "Jun", revenue: 10200000, projects: 25 },
  { month: "Jul", revenue: 8200000, projects: 21 },
  { month: "Aug", revenue: 9100000, projects: 23 },
  { month: "Sep", revenue: 8700000, projects: 20 },
  { month: "Oct", revenue: 10500000, projects: 26 },
  { month: "Nov", revenue: 11200000, projects: 28 },
  { month: "Dec", revenue: 12400000, projects: 30 },
]

const serviceRevenue = [
  { name: "Solar Energy", value: 45, revenue: 5580000, color: "#f59e0b" },
  { name: "Maintenance", value: 30, revenue: 3720000, color: "#10b981" },
  { name: "Industrial", value: 15, revenue: 1860000, color: "#3b82f6" },
  { name: "Consulting", value: 10, revenue: 1240000, color: "#8b5cf6" },
]

const ticketTrend = [
  { month: "Jul", open: 15, resolved: 12 },
  { month: "Aug", open: 18, resolved: 16 },
  { month: "Sep", open: 12, resolved: 14 },
  { month: "Oct", open: 20, resolved: 18 },
  { month: "Nov", open: 14, resolved: 15 },
  { month: "Dec", open: 10, resolved: 12 },
]

const clientGrowth = [
  { month: "Jul", clients: 120 },
  { month: "Aug", clients: 128 },
  { month: "Sep", clients: 135 },
  { month: "Oct", clients: 142 },
  { month: "Nov", clients: 150 },
  { month: "Dec", clients: 156 },
]

const topClients = [
  { name: "Ethio Telecom", revenue: 4200000, projects: 5 },
  { name: "Ministry of Energy", revenue: 2800000, projects: 4 },
  { name: "Ethiopian Manufacturing Co.", revenue: 1500000, projects: 3 },
  { name: "Hawassa Textile Factory", revenue: 890000, projects: 2 },
  { name: "Dire Dawa Cement Factory", revenue: 450000, projects: 1 },
]

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export default function AdminAnalytics() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      return api.getAdminStats()
    }
  })

  // Format dynamic data
  const ticketTrend = stats?.ticketTrends?.map(t => ({
    month: new Date(0, t._id - 1).toLocaleString('default', { month: 'short' }),
    open: t.count,
    resolved: t.resolved
  })) || []

  const kpis = [
    {
      label: "Total Users",
      value: stats?.kpis?.totalUsers || "0",
      change: "+0%",
      trend: "up",
      icon: Users,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Incubator Apps",
      value: stats?.kpis?.totalStartups || "0",
      change: "+0",
      trend: "up",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Open Tickets",
      value: (stats?.kpis?.totalTickets - stats?.kpis?.resolvedTickets) || "0",
      change: "+0%",
      trend: "up",
      icon: Ticket,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      label: "Resolved Tickets",
      value: stats?.kpis?.resolvedTickets || "0",
      change: "0",
      trend: "up",
      icon: CheckCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
  ]

  if (isLoading) return <div className="p-8 text-white">Loading insights...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics & Reports</h1>
          <p className="text-muted-foreground">Business intelligence and performance metrics.</p>
        </div>
        <Select defaultValue="year">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.label}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                    <Icon className={`h-5 w-5 ${kpi.color}`} />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${kpi.trend === "up" ? "text-emerald-500" : "text-red-500"}`}
                  >
                    {kpi.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    <span>{kpi.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Charts */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <PieChartIcon className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="clients" className="gap-2">
            <Users className="h-4 w-4" />
            Clients
          </TabsTrigger>
          <TabsTrigger value="support" className="gap-2">
            <Ticket className="h-4 w-4" />
            Support
          </TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue & Projects Overview</CardTitle>
              <CardDescription>Monthly revenue and project completion trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value, name) => [
                        name === "revenue" ? `ETB ${(value / 1000000).toFixed(2)}M` : value,
                        name === "revenue" ? "Revenue" : "Projects",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Service Category</CardTitle>
                <CardDescription>Distribution of revenue across service lines</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceRevenue}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {serviceRevenue.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Revenue Details</CardTitle>
                <CardDescription>Breakdown by service category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceRevenue.map((service) => (
                    <div key={service.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: service.color }} />
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <span className="text-muted-foreground">ETB {(service.revenue / 1000000).toFixed(2)}M</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${service.value}%`,
                            backgroundColor: service.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Client Growth</CardTitle>
                <CardDescription>Monthly client acquisition trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={clientGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="clients"
                        stroke="#f59e0b"
                        strokeWidth={2}
                        dot={{ fill: "#f59e0b" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Clients by Revenue</CardTitle>
                <CardDescription>Highest value client accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topClients.map((client, index) => (
                    <div key={client.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">{client.projects} projects</p>
                        </div>
                      </div>
                      <span className="font-bold">ETB {(client.revenue / 1000000).toFixed(2)}M</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="support" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Ticket Trends</CardTitle>
              <CardDescription>Open vs resolved tickets over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ticketTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="open" name="Opened" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" name="Resolved" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
