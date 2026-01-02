import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

export interface ExerciseRecord {
    id: string;
    exerciseId: string; // e.g., "pushups", "plank"
    type: "reps" | "time" | "custom";
    value: number; // reps count or seconds
    timestamp: string;
}

export interface SessionEntity {
    partitionKey: string; // userId
    rowKey: string; // sessionId
    date: string; // ISO date
    exercises: string; // JSON string of ExerciseRecord[]
}

export type Session = {
    id: string;
    userId: string;
    date: Date;
    exercises: ExerciseRecord[];
};

export class FitnessService {
    private client?: TableClient;
    private mockSessions: Session[] = [];

    constructor(tableName = "FitnessSessions") {
        if (process.env.MOCK_DB === "true") {
            console.log("Using Mock DB for FitnessService");
            return;
        }
        const accountName =
            process.env.AZURE_STORAGE_ACCOUNT_NAME || "ninalabsstorage";

        try {
            const credential = new DefaultAzureCredential();
            const endpoint = `https://${accountName}.table.core.windows.net`;
            this.client = new TableClient(endpoint, tableName, credential);
        } catch (error) {
            console.error("Failed to initialize Azure Table Client for Fitness:", error);
        }
    }

    private async ensureTableExists() {
        if (!this.client) return;
        try {
            await this.client.createTable();
        } catch (error: any) {
            if (error.statusCode !== 409) {
                console.warn("Error ensuring fitness table exists:", error);
            }
        }
    }

    /**
     * List sessions for a specific user, optionally filtered by year/month if needed later.
     * For now, returns all or we can implement specific date queries.
     */
    async getSessionsByUser(userId: string): Promise<Session[]> {
        if (process.env.MOCK_DB === "true") {
            return this.mockSessions.filter(s => s.userId === userId).sort((a, b) => b.date.getTime() - a.date.getTime());
        }
        const client = this.client;
        if (!client) return []; // TODO: Add mock data if needed

        const sessions: Session[] = [];
        try {
            await this.ensureTableExists();
            const entities = client.listEntities<SessionEntity>({
                queryOptions: { filter: `PartitionKey eq '${userId}'` },
            });

            for await (const entity of entities) {
                sessions.push(this.mapEntityToSession(entity));
            }
        } catch (error) {
            console.error("Failed to fetch sessions:", error);
            return [];
        }

        // Sort by date descending
        return sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
    }

    async getSession(userId: string, sessionId: string): Promise<Session | null> {
        if (process.env.MOCK_DB === "true") {
            return this.mockSessions.find(s => s.userId === userId && s.id === sessionId) || null;
        }
        if (!this.client) return null;
        try {
            await this.ensureTableExists();
            const entity = await this.client.getEntity<SessionEntity>(userId, sessionId);
            return this.mapEntityToSession(entity);
        } catch (error: any) {
            if (error.statusCode !== 404) {
                console.error("Error fetching session:", error);
            }
            return null;
        }
    }

    async saveSession(session: Session): Promise<void> {
        if (process.env.MOCK_DB === "true") {
            const existingIndex = this.mockSessions.findIndex(s => s.userId === session.userId && s.id === session.id);
            if (existingIndex >= 0) {
                this.mockSessions[existingIndex] = session;
            } else {
                this.mockSessions.push(session);
            }
            return;
        }
        if (!this.client) {
            console.warn("No Azure Client available to save session");
            return;
        }

        try {
            await this.ensureTableExists();
            const entity: SessionEntity = {
                partitionKey: session.userId,
                rowKey: session.id,
                date: session.date.toISOString(),
                exercises: JSON.stringify(session.exercises),
            };
            await this.client.upsertEntity(entity, "Replace");
        } catch (error) {
            console.error("Error saving session:", error);
            throw error;
        }
    }

    private mapEntityToSession(entity: SessionEntity): Session {
        let exercises: ExerciseRecord[] = [];
        try {
            exercises = JSON.parse(entity.exercises);
        } catch {
            exercises = [];
        }

        return {
            id: entity.rowKey,
            userId: entity.partitionKey,
            date: new Date(entity.date),
            exercises,
        };
    }
}
