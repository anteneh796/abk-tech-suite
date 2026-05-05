"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Wrench, Zap, Heart, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

const pillars = [
  {
    icon: Wrench,
    title: "Installation & Maintenance",
    description: "Complete machine installation and preventive maintenance for industrial systems.",
    href: "/services#industrial",
  },
  {
    icon: Zap,
    title: "Generator Systems",
    description: "880KVA and high-voltage generator maintenance, rewinding, and emergency repairs.",
    href: "/services#generator",
  },
  {
    icon: Heart,
    title: "Medical Equipment",
    description: "Specialized maintenance for hospital diagnostic and treatment equipment.",
    href: "/services#medical",
  },
  {
    icon: Sun,
    title: "Green Energy",
    description: "Solar thermal, biogas systems, and improved cookstoves for sustainable communities.",
    href: "/services#renewable",
  },
]

export function ServicesPreview() {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4"
          >
            What We Do
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-4xl font-bold mb-4 text-balance"
          >
            Engineering Solutions for Every Sector
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            From industrial manufacturing to healthcare, we provide comprehensive engineering services that drive
            progress.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={pillar.href}
                className="block h-full p-6 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <pillar.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{pillar.description}</p>
                <span className="inline-flex items-center text-sm text-primary font-medium">
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" variant="outline" asChild>
            <Link href="/services">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
