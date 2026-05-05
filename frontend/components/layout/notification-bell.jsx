"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, Mail, Info, AlertTriangle } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useAuth } from "@/components/providers/auth-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import Link from "next/link"

export function NotificationBell() {
  const { user, socket } = useAuth()
  const queryClient = useQueryClient()
  const [hasUnread, setHasUnread] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => api.getNotifications(),
    enabled: !!user,
  })

  const notifications = data?.notifications || []
  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    setHasUnread(unreadCount > 0)
  }, [unreadCount])

  useEffect(() => {
    if (socket && user) {
      const handleNotification = (newNotif) => {
        // Invalidate and refetch for most reliable data sync
        queryClient.invalidateQueries(['notifications'])
        
        // Show toast
        toast.success(newNotif.title, {
          description: newNotif.message,
        })
      }

      socket.on('notification', handleNotification)
      return () => socket.off('notification', handleNotification)
    }
  }, [socket, user, queryClient])

  const markReadMutation = useMutation({
    mutationFn: (id) => api.markAsRead(id),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  })

  const markAllReadMutation = useMutation({
    mutationFn: () => api.markAllAsRead(),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteNotification(id),
    onSuccess: () => queryClient.invalidateQueries(['notifications'])
  })

  if (!user || user.role !== 'admin') return null

  const getIcon = (type) => {
    switch (type) {
      case 'new_inquiry': return <Mail className="w-4 h-4 text-primary" />
      default: return <Info className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-destructive text-[10px]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[10px] h-7 px-2"
              onClick={() => markAllReadMutation.mutate()}
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications yet.
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`flex flex-col gap-1 p-3 border-b border-border/50 hover:bg-muted/50 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getIcon(notif.type)}
                      <span className={`text-sm font-semibold ${!notif.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {notif.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notif.read && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => markReadMutation.mutate(notif._id)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-destructive/50 hover:text-destructive"
                        onClick={() => deleteMutation.mutate(notif._id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true })}
                  </span>
                  {notif.data?.inquiryId && (
                    <Link 
                      href="/admin/messages" 
                      className="text-[10px] text-primary hover:underline mt-1"
                      onClick={() => markReadMutation.mutate(notif._id)}
                    >
                      View Inquiry
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
