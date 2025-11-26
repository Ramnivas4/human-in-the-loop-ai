import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Users, Database } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">TechFlow Solutions Support</h1>
          <p className="text-xl text-muted-foreground">
            AI Technical Support Specialist with live human escalation
          </p>
        </div>

        {/* Voice Call Feature - Prominent CTA */}
        <Card className="mb-8 border-2 border-primary bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl">
              <Phone className="h-6 w-6" />
              Talk to Tech Support
            </CardTitle>
            <CardDescription className="text-base">
              Get instant help with your internet, computer, or device issues
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Link href="/voice">
              <Button size="lg" className="gap-2 text-lg px-8">
                <Phone className="h-5 w-5" />
                Start Voice Call
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="max-w-md mx-auto mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Supervisor Dashboard
              </CardTitle>
              <CardDescription>Manage help requests and respond to escalations</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/supervisor">
                <Button className="w-full" variant="outline">Open Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
