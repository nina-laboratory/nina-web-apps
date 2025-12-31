import type { Release } from "@nina/nina-core";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@nina/ui-components";
import { format } from "date-fns";

import Link from "next/link";

// Checking if Badge exists in ui-components later. For now I'll use a simple span with tailwind classes.

interface ReleaseCardProps {
  release: Release;
}

export function ReleaseCard({ release }: ReleaseCardProps) {
  return (
    <Link href={`/releases/${release.id}`} className="block group">
      <Card className="min-w-[300px] w-[300px] h-full transition-colors hover:border-primary/50 cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-mono">
              {format(release.date, "MMM dd, yyyy")}
            </span>
            <span className="text-xs font-semibold bg-muted px-2 py-0.5 rounded-full">
              {release.id}
            </span>
          </div>
          <CardTitle className="text-lg group-hover:text-primary transition-colors">
            {release.title}
          </CardTitle>
          <CardDescription>
            {/* Apps impacted */}
            <div className="flex flex-wrap gap-1 mt-2">
              {release.apps.map((app) => (
                <span
                  key={app}
                  className="text-[10px] px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded-md uppercase tracking-wider font-semibold"
                >
                  {app}
                </span>
              ))}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {release.body.substring(0, 150)}...
          </p>
        </CardContent>
        <CardFooter>
          <span className="text-sm text-primary font-medium group-hover:underline decoration-primary/50 underline-offset-4">
            View Release &rarr;
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
