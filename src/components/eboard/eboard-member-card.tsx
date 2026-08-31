import type { PublicEboardMember } from "@/types";

type EboardMemberCardProps = {
  member: PublicEboardMember;
};

export function EboardMemberCard({ member }: EboardMemberCardProps) {
  const studyLine = [member.major, member.class_year]
    .filter((value) => value != null && value !== "")
    .join(" · ");

  return (
    <article className="content-card flex h-full min-h-0 flex-col rounded-xl border border-border bg-card p-5">
      <p className="text-xs font-medium tracking-wide text-accent uppercase">
        {member.position}
      </p>
      <h2
        className="mt-2 line-clamp-1 text-lg font-semibold break-words text-foreground"
        title={member.full_name}
      >
        {member.full_name}
      </h2>
      <p className="mt-1 line-clamp-1 min-h-[1lh] text-sm break-words text-muted-foreground">
        {studyLine || "\u00a0"}
      </p>
      <p className="mt-1 line-clamp-1 min-h-[1lh] text-xs text-muted-foreground">
        {member.academic_year}
      </p>
      <p
        className="mt-3 line-clamp-4 min-h-[4lh] text-sm leading-relaxed break-words text-muted-foreground"
        title={member.bio ?? undefined}
      >
        {member.bio ?? "\u00a0"}
      </p>
    </article>
  );
}
