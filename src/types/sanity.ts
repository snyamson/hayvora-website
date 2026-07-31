export type SanityImage = {
  asset?: { _ref?: string; url?: string };
} & Record<string, unknown>;

export type ColorTokenDoc = { label?: string; hex?: string };

/** Editor-authored SEO overrides (sanity/schemaTypes/objects/seoMeta.ts). */
export type SeoMetaDoc = { metaTitle?: string; metaDescription?: string; ogImage?: SanityImage };

export type LogoAssetDoc = { variant: "primary" | "reversed" | "mark" | "favicon"; image: SanityImage };

export type BrandDoc = {
  _id: string;
  name: string;
  slug: { current: string };
  isParent?: boolean;
  tagline?: string;
  shortDescription?: string;
  logos?: LogoAssetDoc[];
  colors?: {
    primary?: ColorTokenDoc;
    secondary?: ColorTokenDoc;
    accent?: ColorTokenDoc;
    surface?: ColorTokenDoc;
    ink?: ColorTokenDoc;
    textOnPrimary?: ColorTokenDoc;
  };
  hero?: {
    headline: string;
    subheadline?: string;
    media?: { type: "image" | "video"; image?: SanityImage; video?: SanityImage; caption?: string }[];
    ctaLabel?: string;
    ctaHref?: string;
  };
  /** Figures come from `stats`, not from here — see whyChooseContent schema. */
  whyChoose?: {
    eyebrow?: string;
    heading: string;
    statDescription?: string;
    statImage?: SanityImage;
    ctaLabel?: string;
    ctaHref?: string;
    highlightVideo?: SanityImage;
    highlightPoster?: SanityImage;
  };
  narrativeImage?: SanityImage;
  about?: unknown;
  stats?: { value: string; label: string }[];
  process?: { title: string; description?: string }[];
  enabledModules?: string[];
  orderRank?: number;
  seo?: SeoMetaDoc;
};

export type HomeGalleryDoc = {
  _id: string;
  eyebrow?: string;
  heading?: string;
  images?: (SanityImage & { alt?: string; caption?: string })[];
};

/** Shape returned by PROJECT_GALLERY_POOL_QUERY — a project plus its images. */
export type ProjectGallerySource = {
  title: string;
  slug: { current: string };
  brandSlug?: string;
  coverImage?: SanityImage;
  gallery?: (SanityImage & { alt?: string; caption?: string })[];
};

export type ClientDoc = {
  _id: string;
  name: string;
  logo?: SanityImage;
  website?: string;
  orderRank?: number;
};

export type ProjectDoc = {
  _id: string;
  title: string;
  slug: { current: string };
  brand?: { name: string; slug: { current: string } };
  summary?: string;
  description?: unknown;
  /** Card/thumbnail image — grids, featured bento, social shares. */
  coverImage?: SanityImage;
  /** Optional dedicated media for the top of the project's own page. */
  hero?: { video?: SanityImage; image?: SanityImage; poster?: SanityImage };
  gallery?: (SanityImage & { alt?: string; caption?: string })[];
  location?: string;
  year?: number;
  duration?: string;
  category?: string[];
  client?: string;
  status?: "completed" | "ongoing" | "planned";
  featured?: boolean;
};

export type PropertyDoc = {
  _id: string;
  title: string;
  slug: { current: string };
  brand?: { _id: string; name: string; slug: { current: string } };
  images?: SanityImage[];
  price?: number;
  priceOnRequest?: boolean;
  location?: { line1?: string; city?: string; region?: string };
  specs?: {
    propertyType?: string;
    bedrooms?: number;
    bathrooms?: number;
    sizeSqm?: number;
    landSizeAcres?: number;
  };
  status: "available" | "reserved" | "sold";
};

export type ServiceDoc = {
  _id: string;
  title: string;
  slug: { current: string };
  brand?: { name: string; slug: { current: string } };
  icon?: SanityImage;
  shortDescription?: string;
};

export type SiteSettingsDoc = {
  title?: string;
  contactInfo?: { email?: string; phone?: string; whatsapp?: string };
  socialLinks?: { platform: string; url: string }[];
  footerText?: string;
};
