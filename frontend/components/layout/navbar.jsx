"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown, Sun, Clock, Phone, Send, MessageCircle, Linkedin, Settings, Wrench, Zap, Facebook, Instagram, Youtube } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/providers/auth-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { NotificationBell } from "@/components/layout/notification-bell"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact Us" },
]

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  // Secret Admin Access (Ctrl + Shift + A)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault()
        router.push('/admin')
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])


  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  })

  const contactPhone = settings?.contact_phone || "+251 96 282 7360"
  
  const socials = [
    { icon: Facebook, href: settings?.social_facebook, label: "Facebook" },
    { icon: Instagram, href: settings?.social_instagram, label: "Instagram" },
    { icon: Send, href: settings?.social_telegram, label: "Telegram" },
    { icon: Linkedin, href: settings?.social_linkedin, label: "LinkedIn" },
    { icon: Youtube, href: settings?.social_youtube, label: "YouTube" },
  ].filter(s => s.href)

  const isActive = (href) => pathname === href

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
      {/* Top Bar */}
      <div className="bg-accent py-2 px-4 lg:px-8 border-b border-accent/20 hidden sm:block">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[13px] font-medium text-accent-foreground">
            <div className="flex items-center gap-1.5 border-r border-accent-foreground/10 pr-4">
              <Clock className="w-4 h-4" />
              <span>Monday - Friday 08:00 AM - 05:00 PM</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Phone className="w-4 h-4" />
              <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="hover:opacity-80 transition-opacity">
                {contactPhone}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[13px] font-medium text-accent-foreground">
            <span>Follow Us -</span>
            <div className="flex items-center gap-3">
              {socials.map((social) => (
                <a 
                  key={social.label}
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="bg-background border-b border-border shadow-sm">
        <nav className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-24">
            {/* Logo with Secret Admin Access */}
            <div className="flex items-center gap-3">
              <div 
                className="relative cursor-pointer group"
                onClick={(e) => {
                  const now = Date.now();
                  const lastTap = e.currentTarget.dataset.lastTap || 0;
                  const tapCount = parseInt(e.currentTarget.dataset.tapCount || "0");
                  
                  if (now - lastTap < 400) {
                    const newCount = tapCount + 1;
                    e.currentTarget.dataset.tapCount = newCount;
                    if (newCount >= 3) {
                      e.currentTarget.dataset.tapCount = "0";
                      router.push('/admin');
                    }
                  } else {
                    e.currentTarget.dataset.tapCount = "1";
                  }
                  e.currentTarget.dataset.lastTap = now;
                }}
              >
                <Link href="/" className="flex items-center gap-3">
                  {settings?.site_logo ? (
                    <img src={settings.site_logo} alt={settings.site_name} className="h-12 w-auto object-contain" />
                  ) : (
                    <div className="relative w-16 h-16 flex items-center justify-center">
                      <Settings className="w-14 h-14 text-[#0060A9] animate-spin-slow relative z-0" />
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <Wrench className="w-9 h-9 text-[#3A3A3A] rotate-[60deg]" />
                      </div>
                      <div className="absolute top-0 left-0 z-20">
                        <Zap className="w-4 h-4 text-[#FFB200] fill-[#FFB200]" />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-extrabold text-3xl leading-none text-[#1A1A1A] tracking-tighter">
                      {settings?.site_name?.split(' ')[0] || "ABK"}
                    </span>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                      <span className="text-[10px] font-bold text-[#0060A9] uppercase tracking-widest">
                        {settings?.site_name?.split(' ')[1] || "TECHNOLOGIES"}
                      </span>
                      <div className="h-[2px] w-12 bg-[#3A3A3A]"></div>
                    </div>
                    <span className="text-[8px] font-black text-[#555555] uppercase tracking-[0.25em] mt-0.5">
                      {settings?.site_tagline || "INSTALLATION & MAINTENANCE"}
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-accent ${
                    isActive(link.href) ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Auth Buttons Hidden for public */}
            <div className="hidden lg:flex items-center gap-3">
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-primary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden border-t border-border bg-card"
              >
                <div className="py-4 space-y-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-2 text-sm font-bold uppercase tracking-widest ${
                        isActive(link.href) ? "text-primary bg-primary/5" : "text-muted-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-border">
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>
    </header>
  )
}
