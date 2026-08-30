import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SiteContainerProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: "main" | "div";
};

export function SiteContainer({
  children,
  className,
  id,
  as: Tag = "main",
}: SiteContainerProps) {
  return (
    <Tag
      id={id}
      className={cn(
        "mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8",
        className
      )}
    >
      {children}
    </Tag>
  );
}
