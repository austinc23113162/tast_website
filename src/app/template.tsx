import type { ReactNode } from "react";

type TemplateProps = {
  children: ReactNode;
};

export default function Template({ children }: TemplateProps) {
  return <div className="page-enter relative z-0 flex min-h-0 flex-1 flex-col">{children}</div>;
}
