import { ReleaseService } from "@nina/nina-core";
import { Button } from "@nina/ui-components";
import { format } from "date-fns"; // Make sure date-fns is installed or use native Intl
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";

interface ReleasePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ReleasePage({ params }: ReleasePageProps) {
  const { id } = await params;
  const releaseService = new ReleaseService();
  const release = await releaseService.getRelease("2026", id);

  if (!release) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background p-8 max-w-4xl mx-auto space-y-8">
      <header>
        <Link href="/" className="inline-block mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="pl-0 hover:pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Journal
          </Button>
        </Link>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-mono text-muted-foreground">
              {format(release.date, "MMM dd, yyyy")}
            </span>
            <span className="text-sm font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              {release.id}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">{release.title}</h1>

          <div className="flex flex-wrap gap-2">
            {release.apps.map((app) => (
              <span
                key={app}
                className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-md uppercase tracking-wider font-semibold"
              >
                {app}
              </span>
            ))}
          </div>
        </div>
      </header>

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown>{release.body}</ReactMarkdown>
      </article>
    </div>
  );
}
