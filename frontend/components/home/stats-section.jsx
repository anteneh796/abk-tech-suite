"use client"

import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { Factory, Lightbulb, Users, Award } from "lucide-react"

const stats = [
  {
    icon: Factory,
    value: 50,
    suffix: "+",
    label: "Industrial Machines Restored",
  },
  {
    icon: Lightbulb,
    value: 10,
    suffix: "+",
    label: "Startups Incubated",
  },
  {
    icon: Users,
    value: 500,
    suffix: "+",
    label: "Families Impacted",
  },
  {
    icon: Award,
    value: 100,
    suffix: "%",
    label: "Client Satisfaction",
  },
]

export function StatsSection() {
  return (
    <section className="py-16 lg:py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
