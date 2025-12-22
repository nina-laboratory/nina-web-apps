import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@nina/ui-components";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Nina Quick
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Welcome to Nina Quick. Fast interactions.
          </p>
          <div className="flex justify-center gap-4">
            <Button>Get Started</Button>
            <Button variant="destructive">Style Check</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
