"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trash2, Plus, Loader2, Image as ImageIcon, Edit2, X, Check } from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/image-upload"

export default function NewsManagement() {
  const queryClient = useQueryClient()
  const [editingItem, setEditingItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    type: "news",
    date: new Date().toISOString().split('T')[0],
    excerpt: "",
    image: "",
    location: ""
  })

  const { data, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => api.getNews(),
  })

  const newsItems = data?.news || []

  const createMutation = useMutation({
    mutationFn: (data) => api.createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['news'])
      toast.success("News item created")
      setIsModalOpen(false)
      resetForm()
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({id, data}) => api.updateNews(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['news'])
      toast.success("News item updated")
      setIsModalOpen(false)
      resetForm()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteNews(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['news'])
      toast.success("Item deleted")
    }
  })

  const resetForm = () => {
    setFormData({
      title: "",
      type: "news",
      date: new Date().toISOString().split('T')[0],
      excerpt: "",
      image: "",
      location: ""
    })
    setEditingItem(null)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      type: item.type,
      date: new Date(item.date).toISOString().split('T')[0],
      excerpt: item.excerpt,
      image: item.image || "",
      location: item.location || ""
    })
    setIsModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingItem) {
      updateMutation.mutate({ id: editingItem._id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">News & Events</h1>
          <p className="text-muted-foreground">Manage your website's news feed and upcoming events</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add New
        </Button>
      </div>

      <div className="grid gap-4">
        {newsItems.map((item) => (
          <Card key={item._id} className="overflow-hidden hover:border-primary/30 transition-colors">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-48 aspect-video md:aspect-auto relative bg-muted border-r border-border">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={item.type === 'news' ? 'default' : 'secondary'}>
                        {item.type === 'news' ? 'News' : 'Event'}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(item.date), 'PPP')}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => setIsDeleting(item)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.excerpt}</p>
                  {item.location && (
                    <p className="text-xs text-muted-foreground italic flex items-center gap-1">
                      📍 {item.location}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
            <DialogDescription>
              {editingItem ? "Update the details for this news or event entry." : "Post a new announcement or upcoming event to the platform."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({...formData, title: e.target.value})} 
                placeholder="News or Event Title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={formData.type} onValueChange={(v) => setFormData({...formData, type: v})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  required 
                  value={formData.date} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Location (for events)</label>
              <Input 
                value={formData.location} 
                onChange={(e) => setFormData({...formData, location: e.target.value})} 
                placeholder="e.g. Addis Ababa"
              />
            </div>
            <ImageUpload 
              value={formData.image} 
              onChange={(val) => setFormData({...formData, image: val})} 
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Excerpt / Summary</label>
              <Textarea 
                required 
                value={formData.excerpt} 
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})} 
                placeholder="Brief summary for the card view"
                className="h-20"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : editingItem ? "Save Changes" : "Create Item"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the item "{isDeleting?.title}". This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
             <Button variant="outline" className="flex-1" onClick={() => setIsDeleting(null)}>Cancel</Button>
             <Button variant="destructive" className="flex-1" onClick={() => deleteMutation.mutate(isDeleting._id)} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : "Delete"}
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
