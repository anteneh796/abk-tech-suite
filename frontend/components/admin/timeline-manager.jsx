"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit2, Trash2, Loader2, Calendar } from "lucide-react"
import { toast } from "sonner"

export function TimelineManager() {
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [isDeleting, setIsDeleting] = useState(null)

  const [formData, setFormData] = useState({
    year: "",
    title: "",
    description: "",
    order: 0
  })

  const { data: timelineData, isLoading } = useQuery({
    queryKey: ['timeline'],
    queryFn: () => api.getTimeline()
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.createTimelineItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeline'])
      setIsAdding(false)
      resetForm()
      toast.success("Milestone added to journey")
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.updateTimelineItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeline'])
      setEditingItem(null)
      resetForm()
      toast.success("Journey milestone updated")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteTimelineItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeline'])
      setIsDeleting(null)
      toast.success("Milestone removed")
    }
  })

  const resetForm = () => {
    setFormData({ year: "", title: "", description: "", order: 0 })
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      year: item.year,
      title: item.title,
      description: item.description,
      order: item.order || 0
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingItem) {
      updateMutation.mutate({ id: editingItem._id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-32"><Loader2 className="animate-spin" /></div>

  const items = timelineData?.items || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Our Journey (Timeline)</CardTitle>
          <CardDescription>Manage the history milestones displayed on the About page</CardDescription>
        </div>
        <Button onClick={() => { resetForm(); setIsAdding(true) }} size="sm" className="bg-[#0060A9]">
          <Plus className="w-4 h-4 mr-2" />
          Add Milestone
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="flex items-start justify-between p-4 rounded-lg border bg-muted/30 group">
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary font-bold px-3 py-1 rounded h-fit text-sm">
                  {item.year}
                </div>
                <div>
                  <h4 className="font-bold">{item.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleEdit(item)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => setIsDeleting(item)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No journey milestones added yet.
            </div>
          )}
        </div>
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={isAdding || !!editingItem} onOpenChange={(open) => { if (!open) { setIsAdding(false); setEditingItem(null) } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Milestone" : "Add Journey Milestone"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Year</Label>
                <Input value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} placeholder="e.g. 2018" required />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="e.g. Foundation" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Describe this milestone..." rows={4} required />
            </div>
            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {editingItem ? "Update" : "Add Milestone"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!isDeleting} onOpenChange={(open) => !open && setIsDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Milestone?</DialogTitle>
            <DialogDescription>
              This will remove the "{isDeleting?.title}" milestone from the company journey.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleting(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate(isDeleting._id)} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
