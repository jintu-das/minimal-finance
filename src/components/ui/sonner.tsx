import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

function Toaster(props: ToasterProps) {
  return <Sonner className="toaster group" {...props} />;
}

export { Toaster };
