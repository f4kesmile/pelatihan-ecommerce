import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="space-y-6 max-w-md mx-auto">
        {/* Visual Element */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <h1 className="relative text-[150px] font-black leading-none text-primary/10 select-none">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-4 rounded-full border-4 border-border shadow-xl">
            <HelpCircle className="h-16 w-16 text-primary" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Page not found
          </h2>
          <p className="text-muted-foreground">
            Oops! The page you are looking for might have been removed, had its
            name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 relative z-10">
          <Button asChild size="lg" className="gap-2">
            <Link href="/">
              <MoveLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link href="/support">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
