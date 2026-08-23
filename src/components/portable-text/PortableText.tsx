import { PortableText as PortableTextBase, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

import { urlFor } from "../../../sanity/lib/image";

/**
 * Renderer for every rich-text field on the site (brand about copy, project and
 * service descriptions). Styling lives here rather than in a prose plugin so editor
 * copy inherits exactly the same type scale, measure and link treatment as the rest of
 * the design system.
 */
const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <span className="relative my-10 block aspect-video w-full overflow-hidden rounded-card shadow-soft">
        <Image
          src={urlFor(value).width(1200).url()}
          alt={value.alt ?? ""}
          fill
          sizes="(min-width: 1024px) 48rem, 100vw"
          className="object-cover"
        />
      </span>
    ),
  },

  block: {
    h2: ({ children }) => (
      <h2 className="font-display mt-14 mb-4 text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-display mt-10 mb-3 text-xl font-semibold tracking-tight text-brand-ink">{children}</h3>
    ),
    normal: ({ children }) => <p className="mb-5 leading-[1.75] text-brand-ink/75">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-2 border-brand-secondary pl-6 text-lg leading-relaxed text-brand-ink/80 italic">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => <ul className="mb-6 space-y-2.5">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 list-decimal space-y-2.5 pl-5 marker:text-brand-secondary">{children}</ol>,
  },

  listItem: {
    // Custom bullet so list markers pick up the brand green instead of the browser dot.
    bullet: ({ children }) => (
      <li className="relative pl-6 leading-[1.7] text-brand-ink/75">
        <span aria-hidden className="absolute top-[0.7em] left-0 h-1.5 w-1.5 rounded-full bg-brand-secondary" />
        {children}
      </li>
    ),
    number: ({ children }) => <li className="leading-[1.7] text-brand-ink/75">{children}</li>,
  },

  marks: {
    strong: ({ children }) => <strong className="font-semibold text-brand-ink">{children}</strong>,
    link: ({ value, children }) => {
      const href = (value?.href as string) ?? "#";
      const external = /^https?:\/\//.test(href);

      return external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-brand-primary underline decoration-brand-secondary/40 underline-offset-4 transition-colors hover:decoration-brand-secondary"
        >
          {children}
        </a>
      ) : (
        <Link
          href={href}
          className="font-medium text-brand-primary underline decoration-brand-secondary/40 underline-offset-4 transition-colors hover:decoration-brand-secondary"
        >
          {children}
        </Link>
      );
    },
  },
};

export function PortableText({ value }: { value: unknown }) {
  if (!value) return null;
  return <PortableTextBase value={value as never} components={components} />;
}
