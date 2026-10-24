export type SanityImage = {
  asset?: { _ref?: string; url?: string };
} & Record<string, unknown>;

export type ColorTokenDoc = { label?: string; hex?: string };

/** Editor-authored SEO overrides (sanity/schemaTypes/objects/seoMeta.ts). */
export type SeoMetaDoc = { metaTitle?: string; metaDescription?: string; ogImage?: SanityImage };

export type LogoAssetDoc = {
  variant: "primary" | "reversed" | "mark" | "wordmark" | "stacked" | "favicon";
  image: SanityImage;
};

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
  process?: { title: string; description?: string; image?: SanityImage }[];
  enabledModules?: string[];
  orderRank?: number;
  seo?: SeoMetaDoc;
};

/** sanity/schemaTypes/documents/divisionProfile.ts */
export type DivisionProfileDoc = {
  legalName?: string;
  tagline?: string;
  overview?: string[];
  vision?: string;
  mission?: string;
  values?: { title: string; description?: string }[];
  servicesHeading?: string;
  servicesHeadingEmphasis?: string;
  servicesIntro?: string;
  services?: { title: string; description?: string; items?: string[]; image?: SanityImage }[];
  clients?: string[];
  operationalZone?: string;
  operationalNote?: string;
};

export type HomeGalleryDoc = {
  _id: string;
  eyebrow?: string;
  heading?: string;
  link?: LinkDoc;
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

/** sanity/schemaTypes/objects/linkItem.ts */
export type LinkDoc = { label?: string; href?: string };

/** sanity/schemaTypes/objects/sectionIntro.ts */
export type SectionIntroDoc = { eyebrow?: string; heading?: string; headingEmphasis?: string; description?: string };

type CardCopy = {
  eyebrow?: string;
  heading?: string;
  body?: string;
  primaryCta?: LinkDoc;
  secondaryCta?: LinkDoc;
  image?: SanityImage;
};

export type SiteSettingsDoc = {
  title?: string;
  companyName?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    whatsapp?: string;
    address?: { line1?: string; city?: string; region?: string; country?: string };
  };
  socialLinks?: { platform: string; url: string }[];
  footerText?: string;
  header?: {
    navItems?: { _key: string; label?: string; href?: string; opensDivisionsMenu?: boolean }[];
    cta?: LinkDoc;
    openMenuLabel?: string;
    closeMenuLabel?: string;
  };
  divisionsMenu?: {
    eyebrow?: string;
    heading?: string;
    body?: string;
    cta?: LinkDoc;
    featuredHeading?: string;
    featuredLink?: LinkDoc;
  };
  closingCta?: CardCopy;
  footer?: {
    headquartersLabel?: string;
    exploreHeading?: string;
    exploreLinks?: (LinkDoc & { _key: string })[];
    divisionsHeading?: string;
    contactHeading?: string;
    whatsappLabel?: string;
    enquiryLink?: LinkDoc;
    rightsText?: string;
    locationText?: string;
    backToTopLabel?: string;
  };
  labels?: {
    home?: string;
    breadcrumb?: string;
    previous?: string;
    next?: string;
    counter?: string;
    goToSlide?: string;
    close?: string;
    scroll?: string;
  };
  defaultSeo?: SeoMetaDoc;
  titleSuffix?: string;
  keywords?: string[];
};

/** sanity/schemaTypes/documents/homePage.ts */
export type HomePageDoc = {
  statement?: { text?: string; cta?: LinkDoc };
  metrics?: SectionIntroDoc;
  divisions?: SectionIntroDoc;
  divisionCardLabel?: string;
  narrative?: { heading?: string; body?: string; cta?: LinkDoc };
  process?: { intro?: SectionIntroDoc; cta?: LinkDoc };
  featuredProjects?: { heading?: string; cta?: LinkDoc; emptyText?: string };
  properties?: { intro?: SectionIntroDoc; cardLinkLabel?: string; cta?: LinkDoc; emptyText?: string };
  seo?: SeoMetaDoc;
};

/** sanity/schemaTypes/documents/divisionPage.ts */
export type DivisionPageDoc = {
  overviewCta?: LinkDoc;
  visionLabel?: string;
  missionLabel?: string;
  servicesEyebrow?: string;
  valuesIntro?: SectionIntroDoc;
  clientsIntro?: SectionIntroDoc;
  zoneEyebrow?: string;
  projects?: { heading?: string; cta?: LinkDoc; emptyText?: string };
  closing?: CardCopy;
};

type Strings<K extends string> = Partial<Record<K, string>>;

/** sanity/schemaTypes/documents/pageText.ts */
export type PageTextDoc = {
  about?: Strings<"eyebrow" | "divisionEyebrow"> & { seo?: SeoMetaDoc };
  contact?: Strings<
    | "eyebrow"
    | "title"
    | "description"
    | "divisionTitle"
    | "directHeading"
    | "directBody"
    | "divisionDirectBody"
    | "emailLabel"
    | "phoneLabel"
    | "whatsappLabel"
    | "officeLabel"
  > & { seo?: SeoMetaDoc };
  properties?: Strings<
    | "eyebrow"
    | "availableTitle"
    | "soldTitle"
    | "description"
    | "allLabel"
    | "viewAvailableLabel"
    | "viewSoldLabel"
    | "emptyAvailable"
    | "emptySold"
    | "statusAvailable"
    | "statusReserved"
    | "statusSold"
    | "bedroomsLabel"
    | "bathroomsLabel"
    | "floorAreaLabel"
    | "landSizeLabel"
    | "bedUnit"
    | "bathUnit"
    | "areaUnit"
    | "landUnit"
    | "soldNoticeTitle"
    | "soldNoticeBody"
    | "notFoundTitle"
    | "detailDescription"
  > & { seo?: SeoMetaDoc };
  projects?: Strings<
    | "eyebrow"
    | "title"
    | "description"
    | "emptyText"
    | "clientLabel"
    | "locationLabel"
    | "durationLabel"
    | "yearLabel"
    | "viewLabel"
    | "viewFullLabel"
    | "ctaHeading"
    | "ctaBody"
    | "ctaLabel"
    | "notFoundTitle"
  >;
  services?: Strings<
    | "eyebrow"
    | "title"
    | "description"
    | "emptyText"
    | "learnMoreLabel"
    | "fullListLabel"
    | "detailEyebrow"
    | "ctaHeading"
    | "ctaBody"
    | "ctaLabel"
    | "notFoundTitle"
  >;
  gallery?: Strings<"eyebrow" | "title" | "description" | "emptyText" | "imageAlt">;
  form?: Strings<
    | "regardingLabel"
    | "nameLabel"
    | "emailLabel"
    | "phoneLabel"
    | "messageLabel"
    | "optionalHint"
    | "submitViewing"
    | "submitService"
    | "submitContact"
    | "sendingLabel"
    | "successTitle"
    | "successBody"
    | "nameRequired"
    | "emailInvalid"
    | "phoneRequired"
    | "sendError"
    | "networkError"
  >;
  email?: Strings<
    | "viewingSubject"
    | "generalSubject"
    | "typeLabel"
    | "propertyLabel"
    | "nameLabel"
    | "emailLabel"
    | "phoneLabel"
    | "messageLabel"
  >;
};
