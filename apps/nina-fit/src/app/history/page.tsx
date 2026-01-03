import { Card, CardContent } from "@nina/ui-components";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthSession } from "../../lib/auth-helper";
import { getMySessions } from "../actions";

export default async function HistoryPage() {
  const session = await getAuthSession();

  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }

  const sessions = await getMySessions();

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Workout History</h1>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No sessions recorded yet.
          </p>
        ) : (
          sessions.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-lg">
                    {new Date(s.date).toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {s.exercises.length} exercises performed
                  </p>
                </div>
                <Link
                  href={`/session/${s.id}`}
                  className="text-primary hover:underline"
                >
                  View Details
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
