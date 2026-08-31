import type { ReactNode } from "react";
import Image from "next/image";

type HomeBannerProps = {
  children: ReactNode;
  src?: string;
  alt?: string;
};

export function HomeBanner({
  children,
  src = "/tast_banner.jpg",
  alt = "Placeholder homepage banner. Replace this image with a TAST photo.",
}: HomeBannerProps) {
  return (
    <section
      aria-label="Homepage banner"
      className="relative overflow-hidden border-b border-border bg-primary"
    >
      <div className="banner-media absolute inset-0">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/55 to-primary/25"
          aria-hidden="true"
        />
      </div>
      <div className="relative mx-auto flex min-h-72 w-full max-w-6xl items-end px-4 py-12 sm:min-h-80 sm:px-6 sm:py-16 md:min-h-[22rem] lg:px-8">
        {children}
      </div>
    </section>
  );
}
