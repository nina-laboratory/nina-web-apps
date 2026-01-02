import type { Session } from "@nina/nina-core";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@nina/ui-components";
import Link from "next/link";
import { LoginButton } from "../components/login-button";
import { StartSessionButton } from "../components/start-session-button";
import { getAuthSession } from "../lib/auth-helper";
import { getMySessions } from "./actions";

export default async function Home() {
  const session = await getAuthSession();
  const user = session?.user;
  let recentSessions: Session[] = [];

  if (user) {
    const allSessions = await getMySessions();
    recentSessions = allSessions.slice(0, 5); // Top 5
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 bg-background">
      <Card className="w-full max-w-md mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Nina Fit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex flex-col items-center">
          {!user ? (
            <>
              <p className="text-center text-muted-foreground">
                Welcome to Nina Fit. Sign in to track your gym sessions.
              </p>
              <LoginButton />
            </>
          ) : (
            <>
              <p className="text-center text-muted-foreground">
                Welcome back, {user.name || "Athlete"}!
              </p>
              <StartSessionButton />
            </>
          )}
        </CardContent>
      </Card>

      {user && recentSessions.length > 0 && (
        <div className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-semibold">Recent Sessions</h2>
          {recentSessions.map((s) => (
            <Card key={s.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {new Date(s.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {s.exercises.length} exercises
                  </p>
                </div>
                <Link href={`/session/${s.id}`}>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
