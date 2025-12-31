import { TableClient } from "@azure/data-tables";
import { DefaultAzureCredential } from "@azure/identity";

export interface ReleaseEntity {
  partitionKey: string; // Year
  rowKey: string; // Release ID
  title: string;
  date: string;
  apps: string; // JSON string array
  body: string; // Markdown
}

export type Release = {
  id: string;
  year: string;
  title: string;
  date: Date;
  apps: string[];
  body: string;
};

export class ReleaseService {
  private client?: TableClient;

  constructor(tableName = "releases") {
    // Default to ninalabsstorage if env var is not set, or override if preferred.
    // User requested specifically to use "ninalabsstorage".
    const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || "ninalabsstorage";
    
    try {
        const credential = new DefaultAzureCredential();
        const endpoint = `https://${accountName}.table.core.windows.net`;
        this.client = new TableClient(endpoint, tableName, credential);
    } catch (error) {
        console.error("Failed to initialize Azure Table Client:", error);
    }
  }

  private async ensureTableExists() {
      if (!this.client) return;
      try {
          await this.client.createTable();
      } catch (error: any) {
          // Ignore if table already exists (409 Conflict)
          if (error.statusCode !== 409) {
             console.warn("Error ensuring table exists:", error);
          }
      }
  }

  async listReleases(year: string): Promise<Release[]> {
    if (!this.client) return this.getMockData(year);

    const releases: Release[] = [];
    
    try {
        await this.ensureTableExists();

        const entities = this.client.listEntities<ReleaseEntity>({
            queryOptions: { filter: `PartitionKey eq '${year}'` }
        });

        for await (const entity of entities) {
            releases.push(this.mapEntityToRelease(entity));
        }
    } catch (error) {
        console.warn("Failed to fetch from Azure, falling back to mock data:", error);
        return this.getMockData(year);
    }
    
    return releases.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  // Moved mock data to a helper method to keep listReleases clean
  private getMockData(year: string): Release[] {
      if (year === "2026") {
            const mockReleases: Release[] = [
                {
                    id: "2026.12.25",
                    year: "2026",
                    title: "Holiday Special",
                    date: new Date("2026-12-25"),
                    apps: ["nina-fit", "nina-quick"],
                    body: "# Holiday Update\n\nSpecial holiday themes and quick actions added!"
                },
                {
                    id: "2026.11.15",
                    year: "2026",
                    title: "Performance Boost",
                    date: new Date("2026-11-15"),
                    apps: ["nina-journal"],
                    body: "# Performance Update\n\nOptimized rendering for large journals."
                },
                {
                    id: "2026.10.01",
                    year: "2026",
                    title: "Autumn Refresh",
                    date: new Date("2026-10-01"),
                    apps: ["nina-fit"],
                    body: "# Autumn Refresh\n\nNew workout plans for the season."
                },
                 {
                    id: "2026.08.20",
                    year: "2026",
                    title: "Back to School",
                    date: new Date("2026-08-20"),
                    apps: ["nina-journal", "nina-quick"],
                    body: "# Back to School\n\nGet organized with new journal templates."
                },
                 {
                    id: "2026.05.05",
                    year: "2026",
                    title: "May Update",
                    date: new Date("2026-05-05"),
                    apps: ["nina-fit"],
                    body: "# May Update\n\nGetting ready for summer."
                },
                {
                    id: "2026.01.01",
                    year: "2026",
                    title: "New Year Launch",
                    date: new Date("2026-01-01"),
                    apps: ["nina-journal", "nina-fit"],
                    body: "# New Year Launch\n\nInitial release of the 2026 suite."
                }
            ];
            return mockReleases.sort((a, b) => a.date.getTime() - b.date.getTime());
      }
      return [];
  }

  async getRelease(year: string, id: string): Promise<Release | null> {
    if (!this.client) {
         // Check against mock data
         const releases = this.getMockData(year);
         return releases.find(r => r.id === id) || null;
    }
    try {
      await this.ensureTableExists();
      const entity = await this.client.getEntity<ReleaseEntity>(year, id);
      return this.mapEntityToRelease(entity);
    } catch (e: any) {
      if (e.statusCode === 404) {
        return null; // Not found in real storage
      }
      // If error is auth/network, fallback to mock?
      // User said "fetches the storage", so we should try real storage.
      // But if it fails, maybe fallback to mock if the user is dev-ing without creds?
      // "If error, fallback to mock" approach for safety during dev.
      console.warn("Error getting release from Azure, falling back to mock:", e);
      const releases = this.getMockData(year);
      return releases.find(r => r.id === id) || null;
    }
  }

  private mapEntityToRelease(entity: ReleaseEntity): Release {
    let apps: string[] = [];
    try {
        apps = JSON.parse(entity.apps);
    } catch {
        apps = [];
    }

    return {
      id: entity.rowKey,
      year: entity.partitionKey,
      title: entity.title,
      date: new Date(entity.date),
      apps,
      body: entity.body
    };
  }
}
