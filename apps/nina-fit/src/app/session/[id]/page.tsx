import type { Session } from "@nina/nina-core";
import { redirect } from "next/navigation";
import { SessionManager } from "../../../components/session/session-manager";
import { getAuthSession } from "../../../lib/auth-helper";
import { getSession } from "../../actions";

export default async function SessionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getAuthSession();
  const { id } = await params;

  if (!session || !session.user || !session.user.email) {
    redirect("/api/auth/signin");
  }

  let currentSession = await getSession(id);

  if (!currentSession) {
    // If it's a date-like ID, initialize a new session object
    const dates = id.match(/^\d{4}-\d{2}-\d{2}$/);
    if (dates) {
      currentSession = {
        id: id,
        userId: session.user.email,
        date: new Date(id),
        exercises: [],
      };
    } else {
      return <div>Invalid Session Date</div>;
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto min-h-screen bg-background pb-20">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {new Date(currentSession.date).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </h1>
      <SessionManager initialSession={currentSession as Session} />
    </div>
  );
}
