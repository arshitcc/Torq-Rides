import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-2xl font-semibold">Page Not Found</p>
      <p className="text-muted-foreground max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="default">Back to Home</Button>
      </Link>
    </div>
  );
}
