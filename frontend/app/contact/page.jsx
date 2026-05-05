"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { MapPin, Phone, Mail, Clock, Send, AlertTriangle } from "lucide-react"
import { api } from "@/lib/api"
import { useQuery } from "@tanstack/react-query"

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  interest: z.string().min(1, "Please select an interest"),
  message: z.string().min(10, "Message must be at least 10 characters"),
})

const interests = [
  { value: "industrial", label: "Industrial Maintenance" },
  { value: "generator", label: "Generator Services" },
  { value: "medical", label: "Medical Equipment" },
  { value: "renewable", label: "Renewable Energy" },
  { value: "incubator", label: "Innovation & Incubation" },
  { value: "partnership", label: "Partnership Inquiry" },
  { value: "emergency", label: "Emergency Repair" },
  { value: "other", label: "Other" },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedInterest, setSelectedInterest] = useState("")

  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  })

  const contactInfo = {
    address: settings?.contact_address || "Gondar, Ethiopia",
    phone: settings?.contact_phone || "+251 96 282 7360",
    email: settings?.contact_email || "abktechnology19@gmail.com",
  }

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    try {
      await api.submitInquiry({
        name: data.name,
        email: data.email,
        subject: data.interest,
        message: data.message
      })
      toast.success("Message sent successfully! We'll get back to you soon.")
      reset()
      setSelectedInterest("")
    } catch (err) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-card to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Get In Touch
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Let's Build Something Great Together</h1>
              <p className="text-lg text-muted-foreground">
                Have a project in mind or need expert engineering support? We're here to help transform your vision into
                reality.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <div className="rounded-xl border border-border bg-card p-6 lg:p-8">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input id="name" placeholder="Your name" {...register("name")} />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="you@example.com" {...register("email")} />
                        {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company (Optional)</Label>
                      <Input id="company" placeholder="Your company name" {...register("company")} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="interest">I'm Interested In *</Label>
                      <Select
                        value={selectedInterest}
                        onValueChange={(value) => {
                          setSelectedInterest(value)
                          setValue("interest", value)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your interest" />
                        </SelectTrigger>
                        <SelectContent>
                          {interests.map((interest) => (
                            <SelectItem key={interest.value} value={interest.value}>
                              {interest.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.interest && <p className="text-xs text-destructive">{errors.interest.message}</p>}

                      {selectedInterest === "emergency" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 mt-2"
                        >
                          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-destructive">For emergencies, please call us immediately:</p>
                            <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="text-destructive underline">
                              {contactInfo.phone}
                            </a>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your project or inquiry..."
                        className="min-h-[120px]"
                        {...register("message")}
                      />
                      {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </motion.div>

              {/* Contact Info & Map */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Contact Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Visit Us</h3>
                    <p className="text-sm text-muted-foreground">
                      ABK Technologies HQ
                      <br />
                      {contactInfo.address}
                    </p>
                  </div>

                  <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Call Us</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                        {contactInfo.phone}
                      </a>
                    </p>
                  </div>

                  <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Email Us</h3>
                    <p className="text-sm text-muted-foreground">
                      <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                        {contactInfo.email}
                      </a>
                    </p>
                  </div>

                  <div className="p-6 rounded-xl border border-border bg-card">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Working Hours</h3>
                    <p className="text-sm text-muted-foreground">
                      Mon - Fri: 8:00 AM - 6:00 PM
                      <br />
                      Sat: 9:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>

                {/* Map */}
                <div className="rounded-xl overflow-hidden border border-border aspect-[4/3]">
                  <iframe
                    src={settings?.contact_maps_url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d62302.63287678765!2d37.407826!3d12.6029057!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164327f0387b6c8f%3A0xf6c6c8e0a8b7d8c0!2sGondar%2C%20Ethiopia!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
