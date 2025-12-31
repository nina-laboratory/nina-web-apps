import { Button } from "@nina/ui-components";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { TimelineContainer } from "../../components/timeline/TimelineContainer";

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="p-6 flex items-center border-b">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <Suspense
          fallback={
            <div className="animate-pulse text-muted-foreground">
              Loading timeline...
            </div>
          }
        >
          <TimelineContainer />
        </Suspense>
      </main>
    </div>
  );
}
