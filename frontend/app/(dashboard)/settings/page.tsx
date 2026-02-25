"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Users, 
  Settings2, 
  Link as LinkIcon, 
  Plus, 
  Trash2, 
  Edit,
  Mail,
  Slack,
  Webhook,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { useState } from "react"

// Mock data
const teamMembers = [
  { id: "1", name: "Sarah Chen", email: "sarah@company.com", role: "Admin", status: "Active", tickets: 145 },
  { id: "2", name: "Mike Johnson", email: "mike@company.com", role: "Agent", status: "Active", tickets: 132 },
  { id: "3", name: "Emily Davis", email: "emily@company.com", role: "Agent", status: "Active", tickets: 128 },
  { id: "4", name: "Alex Kim", email: "alex@company.com", role: "Agent", status: "Away", tickets: 118 },
  { id: "5", name: "David Lee", email: "david@company.com", role: "Manager", status: "Active", tickets: 105 },
]

const routingRules = [
  { id: "1", name: "Billing Issues", condition: "Category = Billing", action: "Assign to Finance Team", active: true },
  { id: "2", name: "High Priority Bugs", condition: "Priority = Urgent AND Category = Bug", action: "Assign to Senior Agents", active: true },
  { id: "3", name: "Feature Requests", condition: "Category = Feature Request", action: "Add tag 'product-feedback'", active: false },
]

const integrations = [
  { id: "1", name: "Slack", type: "slack", status: "connected", icon: Slack },
  { id: "2", name: "Email (Gmail)", type: "email", status: "connected", icon: Mail },
  { id: "3", name: "Webhook", type: "webhook", status: "disconnected", icon: Webhook },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("team")

  return (
    <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your team, routing rules, and integrations
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="team">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="routing">
              <Settings2 className="h-4 w-4 mr-2" />
              Routing
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <LinkIcon className="h-4 w-4 mr-2" />
              Integrations
            </TabsTrigger>
          </TabsList>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>Manage your support team and their permissions</CardDescription>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>
                        Send an invitation email to add a new team member
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="Enter name" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="manager">Manager</SelectItem>
                            <SelectItem value="agent">Agent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <DialogFooter>
                      <Button type="submit">Send Invitation</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Tickets</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={member.role === "Admin" ? "default" : "secondary"}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              member.status === "Active" ? "bg-green-500" : "bg-yellow-500"
                            }`} />
                            <span className="text-sm">{member.status}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{member.tickets}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Routing Tab */}
          <TabsContent value="routing" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Routing Rules</CardTitle>
                  <CardDescription>Automatically route tickets based on conditions</CardDescription>
                </div>
                
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Rule
                </Button>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {routingRules.map((rule) => (
                    <Card key={rule.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{rule.name}</h4>
                              <Switch checked={rule.active} />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              If <span className="font-medium text-foreground">{rule.condition}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Then <span className="font-medium text-foreground">{rule.action}</span>
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Connected Integrations</CardTitle>
                <CardDescription>Manage your connected services and webhooks</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {integrations.map((integration) => {
                    const Icon = integration.icon
                    return (
                      <Card key={integration.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              
                              <div>
                                <h4 className="font-medium">{integration.name}</h4>
                                <div className="flex items-center gap-2">
                                  {integration.status === "connected" ? (
                                    <>
                                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                                      <span className="text-xs text-green-600">Connected</span>
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="h-3 w-3 text-red-500" />
                                      <span className="text-xs text-red-600">Disconnected</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <Button 
                              variant={integration.status === "connected" ? "outline" : "default"}
                            >
                              {integration.status === "connected" ? "Configure" : "Connect"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
    </div>
  )
}
