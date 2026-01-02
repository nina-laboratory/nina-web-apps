"use server";

import { FitnessService, type Session } from "@nina/nina-core";
import { revalidatePath } from "next/cache";
import { getAuthSession } from "../lib/auth-helper";

const fitnessService = new FitnessService();

export async function getMySessions(): Promise<Session[]> {
  const session = await getAuthSession();
  if (!session || !session.user || !session.user.email) {
    return [];
  }
  return await fitnessService.getSessionsByUser(session.user.email);
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const session = await getAuthSession();
  if (!session || !session.user || !session.user.email) {
    return null;
  }
  return await fitnessService.getSession(session.user.email, sessionId);
}

export async function saveMySession(data: Session): Promise<void> {
  const session = await getAuthSession();
  if (!session || !session.user || !session.user.email) {
    throw new Error("Unauthorized");
  }

  // Ensure the session belongs to the logged-in user
  data.userId = session.user.email;

  await fitnessService.saveSession(data);
  revalidatePath("/");
  revalidatePath("/history");
}
