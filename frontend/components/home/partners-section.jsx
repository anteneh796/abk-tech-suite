"use client"

import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function PartnersSection() {
  const { data: partnersData } = useQuery({
    queryKey: ['partners'],
    queryFn: () => api.getPartners()
  })

  const partners = partnersData?.partners || []

  if (partners.length === 0) return null

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Partners
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Trusted Partnerships</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're proud to work with leading institutions and organizations across Ethiopia.
          </p>
        </motion.div>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {partners.map((partner, index) => (
            <motion.div
              key={partner._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-all group w-full max-w-[280px]"
            >
              <div className="h-24 w-full relative mb-4 flex items-center justify-center">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partner.name)}&background=random&size=128`
                  }}
                  className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                />
              </div>
              <div className="text-center">
                <h3 className="font-bold text-base text-foreground mb-1">{partner.name}</h3>
                {partner.website && (
                  <a 
                    href={partner.website} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-xs text-primary hover:underline flex items-center justify-center gap-1"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
