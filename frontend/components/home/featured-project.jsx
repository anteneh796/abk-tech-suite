"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"

export function FeaturedProject() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [project, setProject] = useState({
    title: "880KVA Generator Restoration",
    category: "Featured Impact Story",
    description: "When the University of Gondar Hospital's critical backup power system failed, our team delivered a complete restoration in just 48 hours.",
    challenge: "Generator failed during critical hospital hours causing potential medical emergencies.",
    solution: "Complete rewinding and AVR replacement with enhanced surge protection.",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800",
    beforeImage: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800",
    afterImage: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=800"
  })

  useEffect(() => {
    api.getProjects().then(res => {
      const projects = res.projects || (Array.isArray(res) ? res : [])
      if (projects.length > 0) {
        setProject({
            ...project, // Keep defaults for missing fields
            ...projects[0]
        })
      }
    }).catch(console.warn)
  }, [])

  return (
    <section className="py-16 lg:py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              {project.category}
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">{project.title}</h2>
            <p className="text-muted-foreground mb-6">
              {project.description}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-destructive font-bold">!</span>
                </div>
                <div>
                  <p className="font-medium">The Challenge</p>
                  <p className="text-sm text-muted-foreground">
                    {project.challenge}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary font-bold">✓</span>
                </div>
                <div>
                  <p className="font-medium">Our Solution</p>
                  <p className="text-sm text-muted-foreground">
                    {project.solution}
                  </p>
                </div>
              </div>
            </div>

            <Button asChild>
              <Link href="/projects">
                View All Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          {/* Before/After Slider */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border"
          >
            {/* After Image (Background) */}
            <Image src={project.afterImage || project.image || "/placeholder.svg"} alt="After" fill className="object-cover" />

            {/* Before Image (Foreground - clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <Image
                src={project.beforeImage || project.image || "/placeholder.svg"}
                alt="Before"
                fill
                className="object-cover"
              />
            </div>

            {/* Slider Handle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 text-background absolute -left-0.5" />
                <ChevronRight className="w-4 h-4 text-background absolute -right-0.5" />
              </div>
            </div>

            {/* Slider Input */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
            />

            {/* Labels */}
            <div className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
              Before
            </div>
            <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-background/80 backdrop-blur text-xs font-medium">
              After
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
