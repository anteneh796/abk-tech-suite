"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { MapPin, ChevronLeft, ChevronRight, Sun } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

const categories = ["All", "Generator", "Medical", "Renewable", "Industrial"]
const locations = ["All Locations", "Gondar", "Bahir Dar", "Addis Ababa", "Hawassa", "Rural Amhara"]

const MOCK_PROJECTS = [
  {
    id: 'p1',
    title: 'Industrial Solar Grid',
    category: 'Renewable',
    location: 'Bahir Dar',
    description: 'A massive 500kW solar installation for a textile manufacturing plant.',
    image: 'https://images.unsplash.com/photo-1508514177221-18d1427ef5b8?q=80&w=2070',
    challenge: 'Unstable grid power causing 15% production loss.',
    solution: 'Designed and installed a hybrid photovoltaic system with battery storage.',
    result: 'Electricity costs reduced by 40%, zero downtime recorded in first 6 months.',
    beforeImage: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2070',
    afterImage: 'https://images.unsplash.com/photo-1509391366360-fe5ab45891b9?q=80&w=2070'
  },
  {
    id: 'p2',
    title: 'Hospital Backup Generator System',
    category: 'Medical',
    location: 'Gondar',
    description: 'Automated backup power solution for a regional hospital center.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070',
    challenge: 'Critical care equipment failing during grid blackouts.',
    solution: 'Triple-redundant diesel generator system with synchronized control panels.',
    result: 'Instantaneous power switching (less than 1s) ensuring continuous patient care.',
    beforeImage: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=2070',
    afterImage: 'https://images.unsplash.com/photo-1513224502586-d1e602410265?q=80&w=2070'
  }
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [activeLocation, setActiveLocation] = useState("All Locations")
  const [selectedProject, setSelectedProject] = useState(null)
  const [isMapModalOpen, setIsMapModalOpen] = useState(false)
  const [projectsState, setProjectsState] = useState(MOCK_PROJECTS)
  const [loadingProjects, setLoadingProjects] = useState(false)

  const filteredProjects = projectsState.filter((p) => {
    const categoryMatch = activeCategory === "All" || p.category === activeCategory
    const locationMatch = activeLocation === "All Locations" || p.location === activeLocation
    return categoryMatch && locationMatch
  })

  const locationToMapUrl = {
    "Gondar": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.886539092!2d37.32985565!3d12.603479!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164327f0387b6c8f%3A0xf6c6c8e0a8b7d8c0!2sGondar%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890",
    "Bahir Dar": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125218.423984402!2d37.32306785!3d11.5912444!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1643202e887a07a1%3A0x6336336e9d6d0a7a!2sBahir%20Dar%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890",
    "Addis Ababa": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d252230.222416!2d38.6521!3d9.0054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sAddis%20Ababa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890",
    "Hawassa": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63321.493206!2d38.4418!3d7.0504!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x17b145a30368!2sHawassa%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890",
    "Rural Amhara": "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2000000!2d37.5!3d11.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164327f0387b6c8f%3A0xf6c6c8e0a8b7d8c0!2sAmhara%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1234567890"
  }

  const currentMapUrl = activeLocation === "All Locations" 
    ? locationToMapUrl["Addis Ababa"] 
    : (locationToMapUrl[activeLocation] || locationToMapUrl["Addis Ababa"])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingProjects(true)
      try {
        const res = await api.getProjects()
        const projects = res.projects || (Array.isArray(res) ? res : [])
        if (mounted && projects.length > 0) {
          setProjectsState(projects)
        }
      } catch (err) {
        console.warn('Using mock projects as fallback', err)
      } finally {
        if (mounted) setLoadingProjects(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden pt-24 lg:pt-32">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000"
            style={{ 
              backgroundImage: `url('https://images.unsplash.com/photo-1508514177221-18d1427ef5b8?q=80&w=2070&auto=format&fit=crop')`, // Professional solar site
            }}
          />
          <div className="absolute inset-0 bg-black/60 shadow-inner" />
          
          <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-7xl font-black text-white uppercase tracking-tighter mb-4"
            >
              Our Projects
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto font-medium"
            >
              Lighting up homes, businesses, and public spaces with clean, reliable solar solutions.
            </motion.p>
            
            {/* Breadcrumbs */}
            <div className="mt-8 flex items-center justify-center gap-2 text-white/60 font-bold uppercase text-xs tracking-widest">
              <Link href="/" className="hover:text-accent flex items-center gap-1.5 transition-colors">
                <Sun className="w-4 h-4 text-accent" />
                Home
              </Link>
              <span className="text-white/20">/</span>
              <span className="text-white">Projects</span>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="py-8 border-b border-border sticky top-16 lg:top-32 bg-background/95 backdrop-blur z-40">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2 flex-wrap justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      activeCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Location Filter & Map Button */}
              <div className="flex items-center gap-3">
                <select
                  value={activeLocation}
                  onChange={(e) => setActiveLocation(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-background text-sm"
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
                <Button variant="outline" size="sm" onClick={() => setIsMapModalOpen(true)}>
                  <MapPin className="w-4 h-4 mr-2" />
                  View Map
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeCategory}-${activeLocation}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id || project.id || `project-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                              {project.category}
                            </Badge>
                            <Badge variant="outline" className="bg-background/80 backdrop-blur border-none">
                              <MapPin className="w-3 h-3 mr-1" />
                              {project.location}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-semibold text-foreground">{project.title}</h3>
                        </div>
                      </div>
                      <div className="p-6">
                        <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                        <div className="flex items-center text-sm text-primary font-medium">
                          View Case Study
                          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>

            {filteredProjects.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No projects found matching your filters.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setActiveCategory("All")
                    setActiveLocation("All Locations")
                  }}
                >
                  Clear filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />

      {/* Case Study Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedProject && <CaseStudyContent project={selectedProject} onClose={() => setSelectedProject(null)} />}
        </DialogContent>
      </Dialog>

      {/* Map Modal */}
      <Dialog open={isMapModalOpen} onOpenChange={setIsMapModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Project Locations - {activeLocation}</DialogTitle>
          </DialogHeader>
          <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
            <iframe
              src={currentMapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
            {/* Project Markers Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {projectsState.map((project, index) => (
                <div
                  key={project._id || project.id || `marker-${index}`}
                  className="absolute w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"
                  style={{
                    top: `${30 + Math.random() * 40}%`,
                    left: `${20 + Math.random() * 60}%`,
                  }}
                  title={project.title}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            {projectsState.map((project, index) => (
              <div key={project._id || project.id || `list-${index}`} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>{project.title}</span>
                <span className="text-muted-foreground">({project.location})</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function CaseStudyContent({ project, onClose }) {
  const [sliderPosition, setSliderPosition] = useState(50)

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-2 mb-2">
          <Badge>{project.category}</Badge>
          <Badge variant="outline">
            <MapPin className="w-3 h-3 mr-1" />
            {project.location}
          </Badge>
        </div>
        <DialogTitle className="text-2xl">{project.title}</DialogTitle>
      </DialogHeader>

      <div className="space-y-6 mt-4">
        {/* Before/After Slider */}
        <div className="relative aspect-video rounded-lg overflow-hidden border border-border">
          {/* After Image */}
          <Image src={project.afterImage || "/placeholder.svg"} alt="After" fill className="object-cover" />
          {/* Before Image (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image src={project.beforeImage || "/placeholder.svg"} alt="Before" fill className="object-cover" />
          </div>
          {/* Slider Handle */}
          <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize" style={{ left: `${sliderPosition}%` }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <ChevronLeft className="w-4 h-4 text-background absolute -left-0.5" />
              <ChevronRight className="w-4 h-4 text-background absolute -right-0.5" />
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
          />
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
            Before
          </div>
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
            After
          </div>
        </div>

        {/* Case Study Details */}
        <div className="grid gap-4">
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
            <h4 className="font-semibold text-destructive mb-2">The Challenge</h4>
            <p className="text-sm text-muted-foreground">{project.challenge}</p>
          </div>
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <h4 className="font-semibold text-primary mb-2">Our Solution</h4>
            <p className="text-sm text-muted-foreground">{project.solution}</p>
          </div>
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <h4 className="font-semibold text-accent mb-2">The Result</h4>
            <p className="text-sm text-muted-foreground">{project.result}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button asChild className="flex-1">
            <a href="/contact">Start Your Project</a>
          </Button>
          <Button variant="outline" className="flex-1 bg-transparent" onClick={onClose}>
            View More Projects
          </Button>
        </div>
      </div>
    </>
  )
}
