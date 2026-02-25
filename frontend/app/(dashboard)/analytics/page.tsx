"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "@/components/ui/metric-card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts"
import { 
  Download, 
  TrendingUp, 
  Clock, 
  Users, 
  Star,
  Calendar
} from "lucide-react"
import { useState } from "react"

// Mock data
const responseTimeData = [
  { date: "Week 1", avg: 2.5, target: 4 },
  { date: "Week 2", avg: 2.8, target: 4 },
  { date: "Week 3", avg: 2.2, target: 4 },
  { date: "Week 4", avg: 1.9, target: 4 },
]

const categoryData = [
  { category: "Billing", count: 145, avgTime: 3.2, satisfaction: 4.2 },
  { category: "Technical", count: 234, avgTime: 4.5, satisfaction: 4.0 },
  { category: "Feature Request", count: 89, avgTime: 8.2, satisfaction: 4.5 },
  { category: "Bug", count: 167, avgTime: 5.1, satisfaction: 3.8 },
  { category: "General", count: 98, avgTime: 2.8, satisfaction: 4.3 },
]

const agentPerformanceData = [
  { name: "Sarah Chen", tickets: 145, avgResponse: 1.8, avgResolution: 4.2, satisfaction: 4.8, resolutionRate: 94 },
  { name: "Mike Johnson", tickets: 132, avgResponse: 2.1, avgResolution: 5.1, satisfaction: 4.5, resolutionRate: 89 },
  { name: "Emily Davis", tickets: 128, avgResponse: 1.5, avgResolution: 3.8, satisfaction: 4.9, resolutionRate: 96 },
  { name: "Alex Kim", tickets: 118, avgResponse: 2.5, avgResolution: 5.5, satisfaction: 4.3, resolutionRate: 87 },
  { name: "David Lee", tickets: 105, avgResponse: 2.8, avgResolution: 6.2, satisfaction: 4.1, resolutionRate: 85 },
]

const volumeTrendData = [
  { date: "Mon", received: 45, resolved: 38 },
  { date: "Tue", received: 52, resolved: 45 },
  { date: "Wed", received: 48, resolved: 42 },
  { date: "Thu", received: 65, resolved: 55 },
  { date: "Fri", received: 58, resolved: 52 },
  { date: "Sat", received: 32, resolved: 30 },
  { date: "Sun", received: 28, resolved: 25 },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("30")

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Detailed insights into your support performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[160px]">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Tickets"
            value="733"
            description="vs previous period"
            icon={TrendingUp}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Avg Response Time"
            value="2.1h"
            description="vs previous period"
            icon={Clock}
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Active Agents"
            value="12"
            description="Currently active"
            icon={Users}
          />
          <MetricCard
            title="CSAT Score"
            value="4.5/5"
            description="Customer satisfaction"
            icon={Star}
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Response Time Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Response Time Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="avg"
                      name="Avg Response (hours)"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      name="Target (hours)"
                      stroke="#22c55e"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Volume Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Ticket Volume (This Week)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={volumeTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="received" name="Received" fill="#3b82f6" />
                    <Bar dataKey="resolved" name="Resolved" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Tickets</TableHead>
                  <TableHead className="text-right">Avg Resolution</TableHead>
                  <TableHead className="text-right">CSAT</TableHead>
                  <TableHead className="text-right">% of Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categoryData.map((cat) => {
                  const total = categoryData.reduce((sum, c) => sum + c.count, 0)
                  const percentage = ((cat.count / total) * 100).toFixed(1)
                  
                  return (
                    <TableRow key={cat.category}>
                      <TableCell className="font-medium">{cat.category}</TableCell>
                      <TableCell className="text-right">{cat.count}</TableCell>
                      <TableCell className="text-right">{cat.avgTime}h</TableCell>
                      <TableCell className="text-right">{cat.satisfaction}/5</TableCell>
                      <TableCell className="text-right">{percentage}%</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agent</TableHead>
                    <TableHead className="text-right">Tickets</TableHead>
                    <TableHead className="text-right">Avg Response</TableHead>
                    <TableHead className="text-right">Avg Resolution</TableHead>
                    <TableHead className="text-right">CSAT</TableHead>
                    <TableHead className="text-right">Resolution Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agentPerformanceData.map((agent) => (
                    <TableRow key={agent.name}>
                      <TableCell className="font-medium">{agent.name}</TableCell>
                      <TableCell className="text-right">{agent.tickets}</TableCell>
                      <TableCell className="text-right">{agent.avgResponse}h</TableCell>
                      <TableCell className="text-right">{agent.avgResolution}h</TableCell>
                      <TableCell className="text-right">{agent.satisfaction}/5</TableCell>
                      <TableCell className="text-right">{agent.resolutionRate}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
