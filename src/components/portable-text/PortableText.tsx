import { PortableText as PortableTextBase, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";

import { urlFor } from "../../../sanity/lib/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <span className="relative my-6 block aspect-video w-full overflow-hidden rounded-xl">
        <Image src={urlFor(value).width(1200).url()} alt={value.alt ?? ""} fill className="object-cover" />
      </span>
    ),
  },
  block: {
    h2: ({ children }) => <h2 className="mt-10 mb-4 text-2xl font-semibold text-brand-ink">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-semibold text-brand-ink">{children}</h3>,
    normal: ({ children }) => <p className="mb-4 leading-relaxed text-brand-ink/80">{children}</p>,
  },
};

export function PortableText({ value }: { value: unknown }) {
  if (!value) return null;
  return <PortableTextBase value={value as never} components={components} />;
}
