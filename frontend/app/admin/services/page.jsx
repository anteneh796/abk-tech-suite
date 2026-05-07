"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Loader2, Zap } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/image-upload"

export default function ServicesManagement() {
  const categoriesList = ["Industrial", "Renewable", "Generator", "Innovation", "Medical"]
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [isDeleting, setIsDeleting] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Industrial",
    description: "",
    image: ""
  })

  const { data, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
        const res = await api.getServices()
        return res.services || []
    }
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['services'])
      toast.success("Service created successfully")
      setIsAdding(false)
      resetForm()
    },
    onError: (err) => toast.error(err.message || "Failed to create service")
  })

  const updateMutation = useMutation({
    mutationFn: ({id, data}) => api.updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['services'])
      toast.success("Service updated successfully")
      setEditingService(null)
      resetForm()
    },
    onError: (err) => toast.error(err.message || "Failed to update service")
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteService(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['services'])
      toast.success("Service deleted")
      setIsDeleting(null)
    }
  })

  const resetForm = () => {
    setFormData({ title: "", category: "", description: "", image: "" })
  }

  const handleEdit = (svc) => {
    setEditingService(svc)
    setFormData({
      title: svc.title,
      category: svc.category,
      description: svc.description,
      image: svc.image || ""
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingService) {
      updateMutation.mutate({ id: editingService._id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Services Management</h1>
          <p className="text-muted-foreground">Manage your engineering service catalog</p>
        </div>
        <Button className="bg-[#0060A9]" onClick={() => { resetForm(); setIsAdding(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((svc) => (
          <Card key={svc._id} className="overflow-hidden group hover:shadow-lg transition-all">
            <div className="relative h-48 bg-muted">
              {svc.image ? (
                <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full"><Zap className="w-12 h-12 text-muted-foreground/20" /></div>
              )}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" onClick={() => handleEdit(svc)}><Edit2 className="w-4 h-4" /></Button>
                <Button size="icon" variant="destructive" onClick={() => setIsDeleting(svc)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant="outline">{svc.category}</Badge>
              </div>
              <CardTitle className="mt-2">{svc.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{svc.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isAdding || !!editingService} onOpenChange={(open) => { if(!open) { setIsAdding(false); setEditingService(null); } }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            <DialogDescription>
              {editingService ? "Update the service details." : "Create a new service listing for the website."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="space-y-2">
               <label className="text-sm font-medium">Title</label>
               <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Service Title" required />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Category</label>
               <Select 
                 value={formData.category} 
                 onValueChange={(val) => setFormData({...formData, category: val})}
               >
                 <SelectTrigger>
                   <SelectValue placeholder="Select a category" />
                 </SelectTrigger>
                 <SelectContent>
                   {categoriesList.map((cat) => (
                     <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Description</label>
               <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Short description..." required />
            </div>
            
            <ImageUpload 
               value={formData.image}
               onChange={(val) => setFormData({...formData, image: val})}
            />

            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : editingService ? "Save Changes" : "Create Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the service "{isDeleting?.title}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleting(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate(isDeleting._id)} disabled={deleteMutation.isPending}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
