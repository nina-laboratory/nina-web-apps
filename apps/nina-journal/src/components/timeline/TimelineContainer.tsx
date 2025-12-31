import { ReleaseService } from "@nina/nina-core";
import { TimelineInteractive } from "./TimelineInteractive";

export async function TimelineContainer() {
  const releaseService = new ReleaseService();
  const releases = await releaseService.listReleases("2026");

  if (releases.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground border rounded-lg border-dashed">
        No releases via timeline found for 2026.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Timeline 2026</h2>
          <p className="text-sm text-muted-foreground">
            Evolution of the platform
          </p>
        </div>
        <div className="text-right">
          <span className="text-3xl font-mono font-light text-primary">
            {releases.length}
          </span>
          <span className="text-xs text-muted-foreground uppercase ml-2 tracking-wide">
            Updates
          </span>
        </div>
      </div>

      <TimelineInteractive releases={releases} />
    </div>
  );
}
