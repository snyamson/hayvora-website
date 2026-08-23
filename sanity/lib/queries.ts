import { defineQuery } from "next-sanity";

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]
`);

export const BRAND_BY_SLUG_QUERY = defineQuery(`
  *[_type == "brand" && slug.current == $slug][0]
`);

export const ALL_SUBSIDIARY_BRANDS_QUERY = defineQuery(`
  *[_type == "brand" && isParent != true] | order(orderRank asc)
`);

export const ALL_CLIENTS_QUERY = defineQuery(`
  *[_type == "client"] | order(orderRank asc)
`);

export const HOME_GALLERY_QUERY = defineQuery(`
  *[_type == "homeGallery"][0]
`);

/** Every project's gallery (plus its cover as a fallback) for the homepage gallery pool. */
export const PROJECT_GALLERY_POOL_QUERY = defineQuery(`
  *[_type == "project"] | order(orderRank asc){
    title,
    slug,
    coverImage,
    gallery,
    "brandSlug": brand->slug.current
  }
`);

export const FEATURED_PROJECTS_BY_BRAND_QUERY = defineQuery(`
  *[_type == "project" && brand->slug.current == $slug && featured == true]
    | order(orderRank asc)
`);

export const FEATURED_PROJECTS_ACROSS_BRANDS_QUERY = defineQuery(`
  *[_type == "project" && featured == true] | order(orderRank asc) [0...6]{
    ...,
    brand->{name, slug}
  }
`);

export const PROJECTS_BY_BRAND_QUERY = defineQuery(`
  *[_type == "project" && brand->slug.current == $slug] | order(orderRank asc)
`);

export const PROJECT_BY_SLUG_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]
`);

export const AVAILABLE_PROPERTIES_QUERY = defineQuery(`
  *[_type == "property" && status != "sold"] | order(listedDate desc){
    ...,
    brand->{_id, name, slug}
  }
`);

export const LATEST_AVAILABLE_PROPERTIES_QUERY = defineQuery(`
  *[_type == "property" && status != "sold"] | order(listedDate desc) [0...3]{
    ...,
    brand->{_id, name, slug}
  }
`);

export const SOLD_PROPERTIES_QUERY = defineQuery(`
  *[_type == "property" && status == "sold"] | order(listedDate desc){
    ...,
    brand->{_id, name, slug}
  }
`);

export const GALLERY_IMAGES_BY_BRAND_QUERY = defineQuery(`
  *[_type == "project" && brand->slug.current == $slug]{
    title,
    "images": gallery[]
  }
`);

export const DIVISION_PROFILE_BY_BRAND_QUERY = defineQuery(`
  *[_type == "divisionProfile" && brand->slug.current == $slug][0]{
    legalName,
    tagline,
    overview,
    vision,
    mission,
    values[]{title, description},
    servicesHeading,
    servicesIntro,
    services[]{title, description, items, image},
    clients,
    operationalZone,
    operationalNote
  }
`);

export const SERVICES_BY_BRAND_QUERY = defineQuery(`
  *[_type == "service" && brand->slug.current == $slug] | order(orderRank asc)
`);

export const SERVICE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "service" && slug.current == $slug][0]
`);

export const PROPERTY_BY_SLUG_QUERY = defineQuery(`
  *[_type == "property" && slug.current == $slug][0]{
    ...,
    brand->{_id, name, slug}
  }
`);
