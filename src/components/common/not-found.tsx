import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, FolderIcon } from "lucide-react";
import { Button } from "../ui/button";

export function NotFoundComponent() {
  return (
    <main className="container mx-auto flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <p className="text-xl font-medium tracking-widest text-muted-foreground">
        404
      </p>
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Record not found
        </h1>
        <p className="mx-auto max-w-md text-sm text-balance text-muted-foreground">
          The page or record you are looking for does not exist, or it may have
          been moved or deleted.
        </p>
      </section>
      <section className="flex flex-col gap-3 sm:flex-row">
        <Button render={<Link to="/" />}>
          <ArrowLeftIcon data-icon="inline-start" />
          Return to transactions
        </Button>
        <Button variant="outline" render={<Link to="/categories" />}>
          <FolderIcon data-icon="inline-start" />
          Browse categories
        </Button>
      </section>
    </main>
  );
}
