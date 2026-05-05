"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Loader2, MapPin } from "lucide-react"
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

export default function ProjectsManagement() {
  const categoriesList = ["Industrial", "Renewable", "Generator", "Medical", "Innovation"]
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [isDeleting, setIsDeleting] = useState(null)

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Industrial",
    location: "",
    description: "",
    challenge: "",
    solution: "",
    image: ""
  })

  const { data, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
        const res = await api.getProjects()
        return res.projects || res || []
    }
  })

  const createMutation = useMutation({
    mutationFn: (data) => api.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-projects'])
      toast.success("Project added successfully")
      setIsAdding(false)
      resetForm()
    },
    onError: (err) => toast.error(err.message || "Failed to add project")
  })

  const updateMutation = useMutation({
    mutationFn: ({id, data}) => api.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-projects'])
      toast.success("Project updated")
      setEditingProject(null)
      resetForm()
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => api.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-projects'])
      toast.success("Project deleted")
      setIsDeleting(null)
    }
  })

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      location: "",
      description: "",
      challenge: "",
      solution: "",
      image: ""
    })
  }

  const handleEdit = (proj) => {
    setEditingProject(proj)
    setFormData({
      title: proj.title,
      category: proj.category,
      location: proj.location,
      description: proj.description,
      challenge: proj.challenge || "",
      solution: proj.solution || "",
      image: proj.image || ""
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingProject) {
      updateMutation.mutate({ id: editingProject._id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  if (isLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>

  const projects = Array.isArray(data) ? data : (data.projects || [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Portfolio</h1>
          <p className="text-muted-foreground">Manage your completed and ongoing engineering works</p>
        </div>
        <Button className="bg-[#0060A9]" onClick={() => { resetForm(); setIsAdding(true); }}>
          <Plus className="w-4 h-4 mr-2" /> Add Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <Card key={proj._id} className="overflow-hidden group border-none shadow-sm hover:shadow-md transition-all">
             <div className="flex flex-col sm:flex-row h-full">
               <div className="w-full sm:w-1/3 h-48 sm:h-auto bg-muted relative">
                  {proj.image ? (
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground/20 italic text-xs">No Image</div>
                  )}
               </div>
               <div className="flex-1 p-4 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="secondary" className="text-[10px]">{proj.category}</Badge>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleEdit(proj)}><Edit2 className="w-3 h-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => setIsDeleting(proj)}><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{proj.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" /> {proj.location}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-auto">{proj.description}</p>
               </div>
             </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <Dialog open={isAdding || !!editingProject} onOpenChange={(open) => { if(!open) { setIsAdding(false); setEditingProject(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? "Edit Project" : "New Project Entry"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 pt-4">
            <div className="col-span-2 space-y-2">
               <label className="text-sm font-medium">Project Title</label>
               <Input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Project Title" required />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Category</label>
               <Select 
                 value={formData.category} 
                 onValueChange={(val) => setFormData({...formData, category: val})}
               >
                 <SelectTrigger>
                   <SelectValue placeholder="Select category" />
                 </SelectTrigger>
                 <SelectContent>
                   {categoriesList.map((cat) => (
                     <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Location</label>
               <Input value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="Location" required />
            </div>
            <div className="col-span-2 space-y-2">
               <label className="text-sm font-medium">Summary</label>
               <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="Short summary" required />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">The Challenge</label>
               <Textarea value={formData.challenge} onChange={(e) => setFormData({...formData, challenge: e.target.value})} placeholder="What was the challenge?" />
            </div>
            <div className="space-y-2">
               <label className="text-sm font-medium">Our Solution</label>
               <Textarea value={formData.solution} onChange={(e) => setFormData({...formData, solution: e.target.value})} placeholder="What was our solution?" />
            </div>

            <div className="col-span-2">
              <ImageUpload 
                value={formData.image}
                onChange={(val) => setFormData({...formData, image: val})}
              />
            </div>

            <DialogFooter className="col-span-2">
               <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : editingProject ? "Update Project" : "Save Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!isDeleting} onOpenChange={() => setIsDeleting(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Delete Project?</DialogTitle></DialogHeader>
          <p className="text-muted-foreground">Are you sure you want to remove "{isDeleting?.title}"?</p>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsDeleting(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => deleteMutation.mutate(isDeleting._id)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
