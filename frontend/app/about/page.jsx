"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Target, Lightbulb, Users, Shield, ArrowRight } from "lucide-react"
import { PartnersSection } from "@/components/home/partners-section"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

const values = [
  {
    icon: Target,
    title: "Integrity",
    description: "Honest, transparent business practices in every interaction.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Embracing new technologies and creative problem-solving.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Empowering local entrepreneurs and supporting grassroots development.",
  },
  {
    icon: Shield,
    title: "Sustainability",
    description: "Engineering solutions that protect our environment for future generations.",
  },
]

export default function AboutPage() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  })

  const { data: timelineData } = useQuery({
    queryKey: ['timeline'],
    queryFn: () => api.getTimeline(),
  })

  const timeline = timelineData?.items || []

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-card to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  About Us
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
                  Engineering Ethiopia's <span className="text-gradient">Sustainable Future</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-6">
                  From humble beginnings as a machine maintenance company, ABK Technologies has evolved into a
                  comprehensive engineering and innovation hub. We combine technical excellence with a commitment to
                  sustainability and community development.
                </p>
                <p className="text-muted-foreground mb-8">
                  Our journey from ABK Machine Maintenance to ABK Technologies reflects our expanded vision: to not only
                  repair and maintain but to innovate, educate, and transform industries across Ethiopia.
                </p>
                <Button asChild>
                  <Link href="/contact">
                    Partner With Us
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative aspect-square lg:aspect-[4/3]"
              >
                <Image
                  src="/professional-african-engineer-team-industrial-sett.jpg"
                  alt="ABK Technologies Team"
                  fill
                  className="object-cover rounded-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CEO Profile */}
        <section className="py-16 lg:py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="lg:col-span-1"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
                  <Image
                    src={settings?.ceo_image || "/professional-african-male-ceo-portrait-business-at.jpg"}
                    alt={`${settings?.ceo_name || "CEO"} portrait`}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-2"
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                  Leadership
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">{settings?.ceo_name || "Anteneh Belay Kassa"}</h2>
                <p className="text-xl text-primary mb-6">{settings?.ceo_title || "Founder & CEO"}</p>
                <div className="space-y-4 text-muted-foreground">
                  {settings?.ceo_bio ? (
                    settings.ceo_bio.split('\n').map((para, i) => (
                      <p key={i}>{para}</p>
                    ))
                  ) : (
                    <>
                      <p>
                        With over a decade of experience in industrial engineering, Anteneh founded ABK Technologies with a
                        vision to transform Ethiopia's industrial landscape through sustainable innovation.
                      </p>
                      <p>
                        His dual role as an engineer and ecosystem builder has led to partnerships with major institutions
                        including the University of Gondar and Etige Mintwabe Trade Company, while also nurturing the next
                        generation of entrepreneurs through the Innovation & Incubation Center.
                      </p>
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Journey
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold">{settings?.about_timeline_title || "Building a Legacy of Excellence"}</h2>
            </motion.div>

            <div className="relative max-w-3xl mx-auto">
              {/* Timeline Line */}
              {timeline.length > 0 && (
                <div className="absolute left-8 top-0 bottom-0 w-px bg-border lg:left-1/2" />
              )}

              {timeline.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative flex items-start gap-8 mb-12 ${
                    index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute left-8 lg:left-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background -translate-x-1/2" />

                  {/* Content */}
                  <div className={`flex-1 pl-16 lg:pl-0 ${index % 2 === 0 ? "lg:pr-16 lg:text-right" : "lg:pl-16"}`}>
                    <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold mb-2">
                      {item.year}
                    </span>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>

                  {/* Spacer for alternating layout */}
                  <div className="hidden lg:block flex-1" />
                </motion.div>
              ))}

              {timeline.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                   Sharing our story soon...
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Values
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold">What Drives Us</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners */}
        <PartnersSection />
      </main>
      <Footer />
    </>
  )
}
