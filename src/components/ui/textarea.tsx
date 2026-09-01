import { type ComponentProps } from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textareaVariants = cva(
  "min-h-24 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
);

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(textareaVariants(), className)}
      {...props}
    />
  );
}

export { Textarea };
