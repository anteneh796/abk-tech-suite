"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save, Globe, Phone, Mail, MapPin, Share2, Layout, Shield, Image as ImageIcon, Facebook, Linkedin, Send, Instagram, Users } from "lucide-react"
import { toast } from "sonner"
import { ImageUpload } from "@/components/admin/image-upload"
import { useEffect } from "react"
import { TimelineManager } from "@/components/admin/timeline-manager"

export default function SettingsPage() {
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState("general")
  const [localLogo, setLocalLogo] = useState(null)
  const [localFavicon, setLocalFavicon] = useState(null)

  // Fetch Global Settings
  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.getSettings(),
  })

  // Sync local state when settings load
  useEffect(() => {
    if (settings) {
      setLocalLogo(settings.site_logo)
      setLocalFavicon(settings.site_favicon)
    }
  }, [settings])

  // Fetch Current User (for Account settings)
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.me(),
  })

  const saveSettingsMutation = useMutation({
    mutationFn: (values) => api.updateSettings(values),
    onSuccess: () => {
      queryClient.invalidateQueries(['settings'])
      toast.success("Settings updated successfully")
    }
  })

  const updateAccountMutation = useMutation({
    mutationFn: (values) => api.updateCredentials(values),
    onSuccess: () => {
      toast.success("Account credentials updated")
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update account")
    }
  })

  const handleSettingsSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const values = Object.fromEntries(formData.entries())
    
    // Include the local branding states
    if (localLogo) values.site_logo = localLogo
    if (localFavicon) values.site_favicon = localFavicon
    
    saveSettingsMutation.mutate(values)
  }

  const handleAccountSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const values = Object.fromEntries(formData.entries())
    
    if (values.newPassword && values.newPassword !== values.confirmPassword) {
      return toast.error("New passwords do not match")
    }
    
    updateAccountMutation.mutate(values)
  }

  if (settingsLoading || userLoading) return <div className="flex items-center justify-center h-64"><Loader2 className="animate-spin" /></div>

  const user = userData?.user || {}

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">Manage website identity, content, and security</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-lg">
          <TabsTrigger value="general" className="gap-2"><Globe className="w-4 h-4" /> General</TabsTrigger>
          <TabsTrigger value="contact" className="gap-2"><Phone className="w-4 h-4" /> Contact</TabsTrigger>
          <TabsTrigger value="homepage" className="gap-2"><Layout className="w-4 h-4" /> Homepage</TabsTrigger>
          <TabsTrigger value="socials" className="gap-2"><Share2 className="w-4 h-4" /> Socials</TabsTrigger>
          <TabsTrigger value="marketing" className="gap-2"><Users className="w-4 h-4" /> Marketing</TabsTrigger>
          <TabsTrigger value="about" className="gap-2"><Users className="w-4 h-4" /> About Us</TabsTrigger>
          <TabsTrigger value="footer" className="gap-2"><ImageIcon className="w-4 h-4" /> Branding & Footer</TabsTrigger>
          <TabsTrigger value="account" className="gap-2"><Shield className="w-4 h-4" /> Account</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSettingsSubmit}>
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Leadership Profile</CardTitle>
                <CardDescription>Manage founder/CEO information displayed on the About page</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Founder/CEO Name</Label>
                      <Input name="ceo_name" defaultValue={settings?.ceo_name || "Anteneh Belay Kassa"} />
                    </div>
                    <div className="space-y-2">
                      <Label>Professional Title</Label>
                      <Input name="ceo_title" defaultValue={settings?.ceo_title || "Founder & CEO"} />
                    </div>
                    <div className="space-y-2">
                      <Label>Biography</Label>
                      <Textarea name="ceo_bio" defaultValue={settings?.ceo_bio} rows={6} placeholder="Tell the company's leadership story..." />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label>Leader Portrait Image</Label>
                    <ImageUpload 
                      value={settings?.ceo_image} 
                      onChange={(val) => saveSettingsMutation.mutate({ ceo_image: val })} 
                    />
                    <p className="text-xs text-muted-foreground italic">
                      Recommended: Portrait orientation (e.g., 3:4 aspect ratio)
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t">
                  <div className="space-y-2">
                    <Label>Journey/Timeline Section Title</Label>
                    <Input name="about_timeline_title" defaultValue={settings?.about_timeline_title || "Building a Legacy of Excellence"} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <TimelineManager />
          </TabsContent>
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Basic Info</CardTitle>
                <CardDescription>Main identity of your company</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Website Name</Label>
                    <Input name="site_name" defaultValue={settings?.site_name || "ABK Technologies"} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline / Slogan</Label>
                    <Input name="site_tagline" defaultValue={settings?.site_tagline || "Innovating Sustainable Solutions"} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Company Description</Label>
                  <Textarea name="site_description" defaultValue={settings?.site_description} rows={4} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Displayed in the contact page and footer</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Public Email</Label>
                    <Input name="contact_email" defaultValue={settings?.contact_email} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input name="contact_phone" defaultValue={settings?.contact_phone} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input name="contact_address" defaultValue={settings?.contact_address} />
                </div>
                <div className="space-y-2">
                  <Label>Google Maps Embed Link</Label>
                  <Input name="contact_maps_url" defaultValue={settings?.contact_maps_url} placeholder="https://www.google.com/maps/embed?..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="homepage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Hero Section</CardTitle>
                <CardDescription>Control the main attraction of your site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Hero Title</Label>
                  <Input name="hero_title" defaultValue={settings?.hero_title} />
                </div>
                <div className="space-y-2">
                  <Label>Hero Subtitle</Label>
                  <Textarea name="hero_description" defaultValue={settings?.hero_description} rows={3} />
                </div>
                <div className="space-y-2">
                  <Label>Hero Button Text</Label>
                  <Input name="hero_button_text" defaultValue={settings?.hero_button_text || "Get Started"} />
                </div>
                <div className="space-y-2">
                  <Label>Hero Badge Text (Above Title)</Label>
                  <Input name="hero_badge" defaultValue={settings?.hero_badge || "Engineering Excellence Since 2018"} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="socials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>URLs for your social profiles</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Facebook className="w-4 h-4 text-blue-600" /> Facebook</Label>
                  <Input name="social_facebook" defaultValue={settings?.social_facebook} placeholder="https://facebook.com/..." />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Linkedin className="w-4 h-4 text-blue-700" /> LinkedIn</Label>
                  <Input name="social_linkedin" defaultValue={settings?.social_linkedin} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Send className="w-4 h-4 text-sky-500" /> Telegram</Label>
                  <Input name="social_telegram" defaultValue={settings?.social_telegram} placeholder="https://t.me/..." />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-600" /> Instagram</Label>
                  <Input name="social_instagram" defaultValue={settings?.social_instagram} placeholder="https://instagram.com/..." />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="marketing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Login Page Testimonial</CardTitle>
                <CardDescription>The quote shown on the login screen</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Quote Text</Label>
                  <Textarea name="login_quote_text" defaultValue={settings?.login_quote_text} rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Author Name</Label>
                    <Input name="login_quote_author" defaultValue={settings?.login_quote_author} />
                  </div>
                  <div className="space-y-2">
                    <Label>Author Role/Company</Label>
                    <Input name="login_quote_role" defaultValue={settings?.login_quote_role} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="footer" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Logos & Branding</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-4">
                      <Label>Main Logo</Label>
                      <ImageUpload 
                        value={localLogo || settings?.site_logo} 
                        onChange={(val) => setLocalLogo(val)} 
                      />
                   </div>
                   <div className="space-y-4">
                      <Label>Favicon</Label>
                      <ImageUpload 
                        value={localFavicon || settings?.site_favicon} 
                        onChange={(val) => setLocalFavicon(val)} 
                      />
                   </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Footer Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Footer Description</Label>
                    <Textarea name="footer_description" defaultValue={settings?.footer_description} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Copyright Text</Label>
                    <Input name="footer_copyright" defaultValue={settings?.footer_copyright || "© 2024 ABK Technologies. All rights reserved."} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {activeTab !== "account" && (
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={saveSettingsMutation.isPending} className="bg-[#0060A9] px-8">
                {saveSettingsMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                Save All Settings
              </Button>
            </div>
          )}
        </form>

        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Admin Account Settings</CardTitle>
              <CardDescription>Update your login credentials and security</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Login Email</Label>
                  <Input name="email" defaultValue={user.email} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Password (leave blank to keep current)</Label>
                    <Input name="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input name="confirmPassword" type="password" />
                  </div>
                </div>
                <div className="border-t pt-4 mt-4">
                   <div className="space-y-2">
                      <Label className="text-destructive font-bold">Current Password (Required to save changes)</Label>
                      <Input name="currentPassword" type="password" required />
                   </div>
                </div>
                <div className="flex justify-between items-center pt-4">
                   <Button type="button" variant="outline" onClick={() => api.logout().then(() => window.location.href = '/login')}>
                     Logout
                   </Button>
                   <Button type="submit" disabled={updateAccountMutation.isPending} className="bg-red-600 hover:bg-red-700">
                     {updateAccountMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                     Update Account
                   </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
