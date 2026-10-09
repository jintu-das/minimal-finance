import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories")({
  component: RouteComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function RouteComponent() {
  return (
    <main className="container mx-auto space-y-2 pt-4">
      <h1 className="text-3xl">Categories Page</h1>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum culpa
        quibusdam ab nemo officia, consequatur exercitationem labore omnis
        repellendus aliquam atque natus modi odit sapiente sint reprehenderit
        fugiat iure ullam.
      </p>
    </main>
  );
}
