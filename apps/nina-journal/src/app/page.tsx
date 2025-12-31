import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@nina/ui-components";
import { ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Nina Journal
          </h1>
          <p className="text-xl text-muted-foreground">
            Track the evolution of the Nina Labs ecosystem.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 w-full max-w-4xl">
          <Card className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Release Timeline
              </CardTitle>
              <CardDescription>
                Explore the history of updates across all apps.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/timeline">
                <Button className="w-full gap-2 group">
                  View Timeline
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documentation</CardTitle>
              <CardDescription>
                Learn more about the Nina Labs architecture.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
