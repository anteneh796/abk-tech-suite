"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, Edit2, Trash2, Loader2, Link as LinkIcon, Handshake } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/components/admin/image-upload"

export default function PartnersManagement() {
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)
  const [editingPartner, setEditingPartner] = useState(null)
  const [isDeleting, setIsDeleting] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    website: "",
    order: 0
  })

  const { data: partnersData, isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: () => api.getPartners()
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.createPartner(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['partners'])
      setIsAdding(false)
      resetForm()
      toast.success("Partner added successfully")
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.updatePartner(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['partners'])
      setEditingPartner(null)
      resetForm()
      toast.success("Partner updated successfully")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deletePartner(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['partners'])
      setIsDeleting(null)
      toast.success("Partner deleted")
    }
  })

  const resetForm = () => {
    setFormData({ name: "", logo: "", website: "", order: 0 })
  }

  const handleEdit = (partner) => {
    setEditingPartner(partner)
    setFormData({
      name: partner.name,
      logo: partner.logo,
      website: partner.website || "",
      order: partner.order || 0
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingPartner) {
      updateMutation.mutate({ id: editingPartner._id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>

  const partners = partnersData?.partners || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trusted Partnerships</h1>
          <p className="text-muted-foreground">Manage logos of organizations you work with</p>
        </div>
        <Button onClick={() => { resetForm(); setIsAdding(true) }} className="bg-[#0060A9]">
          <Plus className="w-4 h-4 mr-2" />
          Add Partner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card key={partner._id} className="overflow-hidden group">
            <div className="aspect-video bg-muted flex items-center justify-center p-8 relative">
              <img 
                src={partner.logo} 
                alt={partner.name} 
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" 
              />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => handleEdit(partner)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => setIsDeleting(partner)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="p-4">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{partner.name}</h3>
                    {partner.website && (
                      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline">
                        <LinkIcon className="w-3 h-3" />
                        Website
                      </a>
                    )}
                  </div>
                  <Badge variant="outline">Order: {partner.order}</Badge>
               </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-20 bg-muted/30 rounded-xl border-2 border-dashed">
          <Handshake className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No partners added yet.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isAdding || !!editingPartner} onOpenChange={(open) => { if (!open) { setIsAdding(false); setEditingPartner(null) } }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPartner ? "Edit Partner" : "Add New Partner"}</DialogTitle>
            <DialogDescription>Enter partner details and upload their logo.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Partner Name</Label>
              <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. University of Gondar" required />
            </div>
            <div className="space-y-2">
              <Label>Logo</Label>
              <ImageUpload 
                value={formData.logo} 
                onChange={(val) => setFormData({...formData, logo: val})} 
              />
            </div>
            <div className="space-y-2">
              <Label>Website (Optional)</Label>
              <Input value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Display Order</Label>
              <Input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                {editingPartner ? "Update Partner" : "Add Partner"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!isDeleting} onOpenChange={(open) => !open && setIsDeleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the partnership with <strong>{isDeleting?.name}</strong>.
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
    </div>
  )
}

function Label({ children, className }) {
  return <label className={`text-sm font-medium ${className}`}>{children}</label>
}
