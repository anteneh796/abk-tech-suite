"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Calculator } from "lucide-react"
import Link from "next/link"
import { api } from "@/lib/api"

const categories = ["All", "Industrial", "Generator", "Medical", "Renewable"]

const MOCK_SERVICES = [
  {
    id: 's1',
    category: 'Renewable',
    title: 'Solar Power Systems',
    description: 'Custom solar solutions for industrial and residential use.',
    image: 'https://images.unsplash.com/photo-1508514177221-18d1427ef5b8?q=80&w=2070',
    features: ['Installation', 'Maintenance', 'Energy Audit']
  },
  {
    id: 's2',
    category: 'Industrial',
    title: 'Machine Maintenance',
    description: 'Expert maintenance for industrial machinery and production lines.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070',
    features: ['Preventive Care', 'Fault Repair', 'Efficiency Optimization']
  },
  {
    id: 's3',
    category: 'Generator',
    title: 'Power Generation Solutions',
    description: 'Reliable generator systems for uninterrupted power supply.',
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=2070',
    features: ['Diesel Generators', 'Hybrid Systems', 'Control Panels']
  }
];

export default function ServicesPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const [selectedService, setSelectedService] = useState(null)
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [servicesState, setServicesState] = useState(MOCK_SERVICES)
  const [loadingServices, setLoadingServices] = useState(false)

  const filteredServices = activeCategory === "All" ? servicesState : servicesState.filter((s) => s.category === activeCategory)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      setLoadingServices(true)
      try {
        const res = await api.getServices()
        const services = res.services || (Array.isArray(res) ? res : [])
        if (mounted && services.length > 0) {
          setServicesState(services)
        }
      } catch (err) {
        console.warn('Using mock services as fallback', err)
      } finally {
        if (mounted) setLoadingServices(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <>
      <Navbar />
      <main className="pt-24 lg:pt-32">
        {/* Hero */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-card to-background">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto text-center"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                Our Services
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">Comprehensive Engineering Solutions</h1>
              <p className="text-lg text-muted-foreground">
                From industrial maintenance to renewable energy, we deliver excellence across every sector.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Tabs */}
        <section className="py-8 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur z-40">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center gap-2 flex-wrap">
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
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service._id || service.id || `service-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-colors">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={service.image || "/placeholder.svg"}
                          alt={service.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                        <Badge className="absolute top-4 left-4 bg-background/80 backdrop-blur">
                          {service.category}
                        </Badge>
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{service.description}</p>
                        <ul className="space-y-2 mb-6">
                          {service.features.slice(0, 3).map((feature, fIndex) => (
                            <li key={`${service._id || service.id}-feat-${fIndex}`} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-primary" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                          onClick={() => setSelectedService(service)}
                        >
                          View Details
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        {/* Quote Calculator CTA */}
        <section className="py-16 lg:py-24 bg-card border-y border-border">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Calculator className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get a Quick Estimate</h2>
              <p className="text-muted-foreground mb-8">
                Use our instant quote calculator to get an estimated consultation timeframe for your specific needs.
              </p>
              <Button size="lg" onClick={() => setIsQuoteModalOpen(true)}>
                Open Quote Calculator
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Need a Custom Solution?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Our engineering team specializes in custom fabrication and tailored solutions for unique industrial
              challenges.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Contact Our Experts</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />

      {/* Service Detail Modal */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl">
          {selectedService && (
            <>
              <DialogHeader>
                <Badge className="w-fit mb-2">{selectedService.category}</Badge>
                <DialogTitle className="text-2xl">{selectedService.title}</DialogTitle>
                <DialogDescription>{selectedService.description}</DialogDescription>
              </DialogHeader>
              <div className="relative aspect-video rounded-lg overflow-hidden my-4">
                <Image
                  src={selectedService.image || "/placeholder.svg"}
                  alt={selectedService.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold mb-3">Key Features</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {selectedService.features.map((feature, fIndex) => (
                    <li key={`${selectedService._id || selectedService.id}-detail-feat-${fIndex}`} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3 mt-6">
                <Button asChild className="flex-1">
                  <Link href="/contact">Request Service</Link>
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Quote Calculator Modal */}
      <QuoteCalculatorModal open={isQuoteModalOpen} onOpenChange={setIsQuoteModalOpen} />
    </>
  )
}

function QuoteCalculatorModal({ open, onOpenChange }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    machineType: "",
    urgency: "",
    description: "",
  })
  const [result, setResult] = useState(null)

  const machineTypes = [
    { value: "generator", label: "Generator Systems", time: 24 },
    { value: "medical", label: "Medical Equipment", time: 48 },
    { value: "industrial", label: "Industrial Machinery", time: 36 },
    { value: "solar", label: "Solar/Renewable", time: 72 },
  ]

  const urgencyLevels = [
    { value: "critical", label: "Critical (Emergency)", multiplier: 0.5 },
    { value: "high", label: "High Priority", multiplier: 0.75 },
    { value: "normal", label: "Normal", multiplier: 1 },
    { value: "low", label: "Low Priority", multiplier: 1.5 },
  ]

  const calculateEstimate = () => {
    const machine = machineTypes.find((m) => m.value === formData.machineType)
    const urgency = urgencyLevels.find((u) => u.value === formData.urgency)
    if (machine && urgency) {
      const hours = Math.round(machine.time * urgency.multiplier)
      setResult({
        hours,
        message: hours <= 24 ? "Technician available within 24 hours" : `Estimated response time: ${hours} hours`,
      })
    }
  }

  const handleNext = () => {
    if (step === 3) {
      calculateEstimate()
      setStep(4)
    } else {
      setStep(step + 1)
    }
  }

  const resetForm = () => {
    setStep(1)
    setFormData({ machineType: "", urgency: "", description: "" })
    setResult(null)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Quick Quote Calculator</DialogTitle>
          <DialogDescription>Get an estimated consultation timeframe</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className={`flex-1 h-1 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="font-medium mb-4">What type of equipment?</h3>
                <div className="space-y-2">
                  {machineTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setFormData({ ...formData, machineType: type.value })}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        formData.machineType === type.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="font-medium mb-4">How urgent is this?</h3>
                <div className="space-y-2">
                  {urgencyLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setFormData({ ...formData, urgency: level.value })}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        formData.urgency === level.value
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-muted-foreground"
                      }`}
                    >
                      {level.label}
                      {level.value === "critical" && (
                        <span className="block text-xs text-destructive mt-1">
                          For emergencies, please call us directly
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="font-medium mb-4">Describe the issue (optional)</h3>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the problem..."
                  className="w-full p-3 rounded-lg border border-border bg-background min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </motion.div>
            )}

            {step === 4 && result && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{result.message}</h3>
                <p className="text-muted-foreground text-sm mb-6">
                  This is an estimate. Actual response times may vary based on technician availability.
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={resetForm} className="flex-1 bg-transparent">
                    New Estimate
                  </Button>
                  <Button asChild className="flex-1">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {step < 4 && (
            <div className="flex gap-3 mt-6">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                  Back
                </Button>
              )}
              <Button
                onClick={handleNext}
                disabled={(step === 1 && !formData.machineType) || (step === 2 && !formData.urgency)}
                className="flex-1"
              >
                {step === 3 ? "Get Estimate" : "Next"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
