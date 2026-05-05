"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mail, Trash2, Loader2, CheckCircle2, Clock } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

export default function MessagesManagement() {
  const queryClient = useQueryClient()

  const { data: messages = [], isLoading, isError } = useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
        const res = await api.getInquiries()
        return res.inquiries || []
    }
  })

  const statusMutation = useMutation({
    mutationFn: ({id, status}) => api.updateInquiryStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['inquiries'])
      queryClient.invalidateQueries(['notifications'])
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteInquiry(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['inquiries'])
      queryClient.invalidateQueries(['notifications'])
      toast.success("Message deleted")
    }
  })

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>
  if (isError) return <div className="p-8 text-center text-destructive">Failed to load messages. Please try again.</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <p className="text-muted-foreground">Inquiries from your potential clients</p>
      </div>

      <div className="space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
            <Mail className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No messages found yet.</p>
          </div>
        )}

        {messages.map((msg) => (
          <Card key={msg._id} className={`${msg.status === 'new' ? 'border-l-4 border-l-[#0060A9]' : ''} hover:border-border transition-all`}>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                 <div className="md:w-64 space-y-1">
                    <div className="flex items-center gap-2">
                       <p className="font-bold text-foreground">{msg.name}</p>
                       {msg.status === 'new' && <Badge className="bg-[#0060A9]">NEW</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground break-all">{msg.email}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                       <Clock className="w-2 h-2" /> {format(new Date(msg.createdAt), 'PPp')}
                    </p>
                 </div>
                 <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-2 text-[#0060A9]">{msg.subject || 'No Subject'}</h3>
                    <p className="text-sm text-foreground/80 whitespace-pre-wrap">{msg.message}</p>
                 </div>
                 <div className="flex md:flex-col gap-2 justify-end">
                    {msg.status === 'new' && (
                      <Button size="sm" variant="outline" onClick={() => statusMutation.mutate({id: msg._id, status: 'read'})}>
                        Mark as Read
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => deleteMutation.mutate(msg._id)}>
                       <Trash2 className="w-4 h-4 mr-2" /> Delete
                    </Button>
                 </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
