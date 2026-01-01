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

      <article>
        <ReactMarkdown
          components={{
            h1: ({ node, ...props }) => (
              <h1
                className="text-3xl font-bold mt-8 mb-4 text-foreground"
                {...props}
              />
            ),
            h2: ({ node, ...props }) => (
              <h2
                className="text-2xl font-semibold mt-6 mb-3 text-foreground"
                {...props}
              />
            ),
            h3: ({ node, ...props }) => (
              <h3
                className="text-xl font-medium mt-4 mb-2 text-foreground"
                {...props}
              />
            ),
            p: ({ node, ...props }) => (
              <p className="leading-7 mb-4 text-muted-foreground" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul
                className="list-disc pl-6 mb-4 text-muted-foreground"
                {...props}
              />
            ),
            ol: ({ node, ...props }) => (
              <ol
                className="list-decimal pl-6 mb-4 text-muted-foreground"
                {...props}
              />
            ),
            li: ({ node, ...props }) => <li className="mb-1" {...props} />,
            a: ({ node, ...props }) => (
              <a
                className="text-primary hover:underline underline-offset-4"
                {...props}
              />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote
                className="border-l-4 border-muted pl-4 italic text-muted-foreground"
                {...props}
              />
            ),
            code: ({ node, ...props }) => (
              <code
                className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm text-foreground"
                {...props}
              />
            ),
          }}
        >
          {release.body}
        </ReactMarkdown>
      </article>
    </div>
  );
}
