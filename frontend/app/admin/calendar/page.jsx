"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from "lucide-react"

export default function AdminCalendar() {
  const [selectedDate, setSelectedDate] = useState(null)
  const [events, setEvents] = useState([
    { id: 1, date: "2026-01-20", title: "Site visit - Endoscopy Unit", project: "Endoscopy Unit Upgrade" },
    { id: 2, date: "2026-02-02", title: "Solar site assessment", project: "Solar Microgrid Installation" },
    { id: 3, date: "2026-03-10", title: "Factory automation review", project: "Factory Automation Rollout" },
  ])

  const byDate = events.reduce((acc, ev) => {
    (acc[ev.date] = acc[ev.date] || []).push(ev)
    return acc
  }, {})

  const handleAddEvent = (e) => {
    e.preventDefault()
    const form = new FormData(e.target)
    const newEv = {
      id: Date.now(),
      date: form.get('date'),
      title: form.get('title'),
      project: form.get('project'),
    }
    setEvents((prev) => [newEv, ...prev])
    e.target.reset()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground">Upcoming project events and milestones</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Event</DialogTitle>
              <DialogDescription>Create a calendar event</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEvent} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <input name="date" type="date" className="w-full rounded-md border px-3 py-2" required />
              </div>
              <div className="space-y-2">
                <Label>Title</Label>
                <input name="title" className="w-full rounded-md border px-3 py-2" required />
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <input name="project" className="w-full rounded-md border px-3 py-2" />
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit">Create</Button>
                </DialogClose>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <h3 className="font-medium">Upcoming Dates</h3>
            <ul className="mt-4 space-y-3">
              {events.map((ev) => (
                <li key={ev.id} className="flex justify-between">
                  <div>
                    <div className="font-medium">{ev.title}</div>
                    <div className="text-sm text-muted-foreground">{ev.project}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{ev.date}</div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent>
            <h3 className="font-medium">Day view</h3>
            <p className="text-sm text-muted-foreground mt-2">Select a date from the list to view events (simple placeholder UI).</p>
            <div className="mt-4">
              {selectedDate ? (
                <div>Events on {selectedDate} will appear here.</div>
              ) : (
                <div className="text-muted-foreground">No date selected</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
