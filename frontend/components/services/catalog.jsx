import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wrench, Zap, Handshake } from "lucide-react"

const services = [
    {
        title: "Industrial Maintenance",
        description: "Expert repair and lifecycle management for heavy machinery.",
        icon: <Wrench className="w-8 h-8 text-blue-500" />,
        tiers: [
            { name: "Diagnostic", price: "Free", features: ["Remote Analysis", "Damage Assessment"] },
            { name: "Pro", price: "$499/mo", features: ["Bi-weekly checks", "Priority support"] },
            { name: "Enterprise", price: "Custom", features: ["24/7 on-site", "Spares management"] }
        ]
    },
    {
        title: "Solar & Renewable",
        description: "Full-scale installation and optimization of renewable systems.",
        icon: <Zap className="w-8 h-8 text-yellow-500" />,
        tiers: [
            { name: "Residential", price: "$2,000+", features: ["Home installation", "1 year warranty"] },
            { name: "Commercial", price: "$10,000+", features: ["Grid-tie systems", "Maintenance plan"] }
        ]
    }
]

export default function ServiceCatalog() {
    return (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 p-6">
            {services.map((service, idx) => (
                <Card key={idx} className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <div className="mb-4">{service.icon}</div>
                        <CardTitle className="text-white">{service.title}</CardTitle>
                        <CardDescription className="text-zinc-400">{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {service.tiers.map((tier, tidx) => (
                            <div key={tidx} className="flex justify-between items-center p-3 rounded-lg bg-zinc-800/50">
                                <div>
                                    <p className="font-medium text-zinc-100">{tier.name}</p>
                                    <p className="text-xs text-zinc-500">{tier.features.join(", ")}</p>
                                </div>
                                <Badge variant="secondary">{tier.price}</Badge>
                            </div>
                        ))}
                        <Button className="w-full mt-4">Get Quote</Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
