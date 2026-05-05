"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

export function DynamicBranding() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  })

  useEffect(() => {
    if (settings) {
      // Update Title
      if (settings.site_name) {
        document.title = settings.site_tagline 
          ? `${settings.site_name} | ${settings.site_tagline}`
          : settings.site_name
      }

      // Update Favicon
      if (settings.site_favicon) {
        let link = document.querySelector("link[rel~='icon']")
        if (!link) {
          link = document.createElement('link')
          link.rel = 'icon'
          document.getElementsByTagName('head')[0].appendChild(link)
        }
        link.href = settings.site_favicon
      }
    }
  }, [settings])

  return null
}
