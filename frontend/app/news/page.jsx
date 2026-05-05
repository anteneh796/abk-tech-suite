"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Calendar, ArrowRight, CalendarPlus, Loader2 } from "lucide-react"

export default function NewsPage() {
  const [filter, setFilter] = useState("all")
  const [selectedItem, setSelectedItem] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: () => api.getNews(),
  })

  const newsEvents = data?.news || []

  const filteredItems = filter === "all" ? newsEvents : newsEvents.filter((item) => item.type === filter)

  const news = newsEvents.filter((item) => item.type === "news")
  const events = newsEvents.filter((item) => item.type === "event")

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    )
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
                Stay Updated
              </span>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-balance">News & Events</h1>
              <p className="text-lg text-muted-foreground">
                Latest updates, announcements, and upcoming events from ABK Technologies.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter */}
        <section className="py-8 border-b border-border sticky top-16 lg:top-20 bg-background/95 backdrop-blur z-40">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center justify-center gap-2">
              {[
                { value: "all", label: "All" },
                { value: "news", label: "News" },
                { value: "event", label: "Events" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Featured Item */}
            {filteredItems[0] && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
                <div
                  className="grid lg:grid-cols-2 gap-8 p-6 rounded-xl border border-border bg-card cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => setSelectedItem(filteredItems[0])}
                >
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={filteredItems[0].image || "/placeholder.svg"}
                      alt={filteredItems[0].title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant={filteredItems[0].type === "news" ? "default" : "secondary"}>
                        {filteredItems[0].type === "news" ? "News" : "Event"}
                      </Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(filteredItems[0].date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h2 className="text-2xl lg:text-3xl font-bold mb-4">{filteredItems[0].title}</h2>
                    <p className="text-muted-foreground mb-6">{filteredItems[0].excerpt}</p>
                    <Button variant="outline" className="w-fit bg-transparent">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.slice(1).map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl border border-border bg-card overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge className="absolute top-4 left-4" variant={item.type === "news" ? "default" : "secondary"}>
                      {item.type === "news" ? "News" : "Event"}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <span className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(item.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        {events.length > 0 && (
          <section className="py-16 lg:py-24 bg-card border-y border-border">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
                  Mark Your Calendar
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold">Upcoming Events</h2>
              </motion.div>

              <div className="max-w-3xl mx-auto space-y-4">
                {events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-6 p-4 rounded-xl border border-border bg-background hover:border-primary/50 transition-colors"
                  >
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-primary/10 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-primary">{new Date(event.date).getDate()}</span>
                      <span className="text-xs text-primary uppercase">
                        {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.excerpt}</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex-shrink-0 bg-transparent">
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />

      {/* Detail Modal */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedItem && (
            <>
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={selectedItem.type === "news" ? "default" : "secondary"}>
                    {selectedItem.type === "news" ? "News" : "Event"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(selectedItem.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <DialogTitle className="text-2xl">{selectedItem.title}</DialogTitle>
              </DialogHeader>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>{selectedItem.excerpt}</p>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </p>
              </div>
              {selectedItem.type === "event" && (
                <div className="flex gap-3 mt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      const title = encodeURIComponent(selectedItem.title);
                      const details = encodeURIComponent(selectedItem.excerpt);
                      const location = encodeURIComponent(selectedItem.location || 'Addis Ababa, Ethiopia');
                      const date = new Date(selectedItem.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
                      const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${date}/${date}`;
                      window.open(calendarUrl, '_blank');
                    }}
                  >
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      const shareData = {
                        title: selectedItem.title,
                        text: selectedItem.excerpt,
                        url: window.location.href,
                      };
                      if (navigator.share) {
                        navigator.share(shareData);
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Link copied to clipboard!");
                      }
                    }}
                  >
                    Share Event
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
