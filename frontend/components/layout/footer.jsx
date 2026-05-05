"use client"

import Link from "next/link"
import { Zap, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Settings, Wrench, Instagram, Youtube, Send } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"

const footerLinks = {
  services: [
    { label: "Industrial Maintenance", href: "/services#industrial" },
    { label: "Generator Systems", href: "/services#generator" },
    { label: "Medical Equipment", href: "/services#medical" },
    { label: "Renewable Energy", href: "/services#renewable" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "News & Events", href: "/news" },
  ],
}

export function Footer() {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  })

  const contactInfo = {
    address: settings?.contact_address || "Gondar, Ethiopia",
    phone: settings?.contact_phone || "+251 96 282 7360",
    email: settings?.contact_email || "abktechnology19@gmail.com",
  }

  const socials = [
    { icon: Linkedin, href: settings?.social_linkedin, label: "LinkedIn" },
    { icon: Facebook, href: settings?.social_facebook, label: "Facebook" },
    { icon: Instagram, href: settings?.social_instagram, label: "Instagram" },
    { icon: Twitter, href: settings?.social_twitter, label: "Twitter" },
    { icon: Send, href: settings?.social_telegram, label: "Telegram" },
    { icon: Youtube, href: settings?.social_youtube, label: "YouTube" },
  ].filter(s => s.href) // Only show if link exists

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-4">
              {settings?.site_logo ? (
                <img src={settings.site_logo} alt={settings.site_name} className="h-12 w-auto object-contain" />
              ) : (
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <Settings className="w-10 h-10 text-[#0060A9] animate-spin-slow relative z-0" />
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Wrench className="w-7 h-7 text-[#3A3A3A] rotate-[60deg]" />
                  </div>
                  <div className="absolute top-0 left-0 z-20">
                    <Zap className="w-3 h-3 text-[#FFB200] fill-[#FFB200]" />
                  </div>
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-bold text-xl leading-none text-foreground tracking-tighter">{settings?.site_name?.split(' ')[0] || "ABK"}</span>
                <span className="text-[7px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-0.5">{settings?.site_tagline || "MACHINE - MAINTENANCE"}</span>
              </div>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              {settings?.footer_description || "Engineering Sustainable Solutions for Ethiopia's Future. From Industrial Machine Maintenance to Renewable Energy Solutions."}
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{contactInfo.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href={`tel:${contactInfo.phone.replace(/\s/g, '')}`} className="hover:text-primary transition-colors">
                  {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href={`mailto:${contactInfo.email}`} className="hover:text-primary transition-colors">
                  {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {settings?.footer_copyright || `© ${new Date().getFullYear()} ABK Technologies. All rights reserved.`}
          </p>
          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a 
                key={social.label}
                href={social.href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors" 
                aria-label={social.label}
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

