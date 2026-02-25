"use client"

import { MetricCard } from "@/components/ui/metric-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Ticket, 
  Clock, 
  CheckCircle2, 
  TrendingUp,
  Users,
  AlertCircle
} from "lucide-react"
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

// Mock data for demonstration
const ticketVolumeData = [
  { date: "Jan 20", tickets: 45 },
  { date: "Jan 21", tickets: 52 },
  { date: "Jan 22", tickets: 38 },
  { date: "Jan 23", tickets: 65 },
  { date: "Jan 24", tickets: 48 },
  { date: "Jan 25", tickets: 72 },
  { date: "Jan 26", tickets: 58 },
  { date: "Jan 27", tickets: 63 },
  { date: "Jan 28", tickets: 55 },
  { date: "Jan 29", tickets: 70 },
  { date: "Jan 30", tickets: 82 },
  { date: "Jan 31", tickets: 68 },
  { date: "Feb 1", tickets: 75 },
  { date: "Feb 2", tickets: 60 },
  { date: "Feb 3", tickets: 85 },
  { date: "Feb 4", tickets: 72 },
  { date: "Feb 5", tickets: 90 },
  { date: "Feb 6", tickets: 78 },
  { date: "Feb 7", tickets: 65 },
  { date: "Feb 8", tickets: 88 },
  { date: "Feb 9", tickets: 95 },
  { date: "Feb 10", tickets: 82 },
  { date: "Feb 11", tickets: 70 },
  { date: "Feb 12", tickets: 76 },
  { date: "Feb 13", tickets: 68 },
  { date: "Feb 14", tickets: 85 },
  { date: "Feb 15", tickets: 92 },
  { date: "Feb 16", tickets: 78 },
  { date: "Feb 17", tickets: 88 },
  { date: "Feb 18", tickets: 72 },
]

const priorityData = [
  { name: "Low", value: 35, color: "#6b7280" },
  { name: "Medium", value: 40, color: "#3b82f6" },
  { name: "High", value: 18, color: "#f97316" },
  { name: "Urgent", value: 7, color: "#ef4444" },
]

const sentimentData = [
  { date: "Week 1", positive: 45, neutral: 35, negative: 20 },
  { date: "Week 2", positive: 48, neutral: 32, negative: 20 },
  { date: "Week 3", positive: 52, neutral: 30, negative: 18 },
  { date: "Week 4", positive: 55, neutral: 28, negative: 17 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your support performance and ticket metrics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Tickets"
          value="1,284"
          description="vs last month"
          icon={Ticket}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Avg Response Time"
          value="3.2h"
          description="vs last month"
          icon={Clock}
          trend={{ value: 18, isPositive: true }}
        />
        <MetricCard
          title="Resolution Rate"
          value="87%"
          description="vs last month"
          icon={CheckCircle2}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Open Tickets"
          value="42"
          description="Requires attention"
          icon={AlertCircle}
          trend={{ value: 8, isPositive: false }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Ticket Volume (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ticketVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    interval={4}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {priorityData.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="positive"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="neutral"
                    stroke="#6b7280"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="negative"
                    stroke="#ef4444"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center mt-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Positive</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-xs text-muted-foreground">Neutral</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-xs text-muted-foreground">Negative</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { user: "Sarah Chen", action: "Resolved ticket #1234", time: "5 min ago" },
                { user: "Mike Johnson", action: "Assigned ticket #1235", time: "12 min ago" },
                { user: "Emily Davis", action: "Added internal note", time: "28 min ago" },
                { user: "Alex Kim", action: "Escalated ticket #1236", time: "1 hour ago" },
                { user: "Sarah Chen", action: "Resolved ticket #1233", time: "2 hours ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                      {activity.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.user}</p>
                      <p className="text-xs text-muted-foreground">{activity.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
