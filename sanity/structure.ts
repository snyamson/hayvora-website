import type { StructureResolver } from "sanity/structure";

const BRAND_SLUGS = [
  { slug: "holdings", title: "Hayvora Holdings" },
  { slug: "infrastructure", title: "Infrastructure" },
  { slug: "jhm-geo-consult", title: "JHM Geo Consult" },
  { slug: "agrisystem-analytics", title: "AgriSystem & Analytics" },
];

const BRAND_SCOPED_TYPES: Array<{ type: string; title: string }> = [
  { type: "project", title: "Projects" },
  { type: "service", title: "Services" },
  { type: "testimonial", title: "Testimonials" },
  { type: "teamMember", title: "Team" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .child(S.document().schemaType("siteSettings").documentId("siteSettings")),

      S.listItem()
        .title("Home Gallery")
        .child(S.document().schemaType("homeGallery").documentId("homeGallery")),

      S.divider(),

      ...BRAND_SLUGS.map(({ slug, title }) =>
        S.listItem()
          .title(title)
          .child(
            S.list()
              .title(title)
              .items([
                S.listItem()
                  .title("Brand profile")
                  .child(
                    S.documentList()
                      .title("Brand profile")
                      .filter('_type == "brand" && slug.current == $slug')
                      .params({ slug }),
                  ),
                ...BRAND_SCOPED_TYPES.map(({ type, title: typeTitle }) =>
                  S.listItem()
                    .title(typeTitle)
                    .child(
                      S.documentList()
                        .title(typeTitle)
                        .filter('_type == $type && brand->slug.current == $slug')
                        .params({ type, slug }),
                    ),
                ),
              ]),
          ),
      ),

      S.divider(),

      S.listItem()
        .title("Properties")
        .child(S.documentTypeList("property").title("Properties")),

      S.listItem()
        .title("Clients")
        .child(S.documentTypeList("client").title("Clients")),

      S.listItem()
        .title("Inquiries")
        .child(
          S.documentList()
            .title("Inquiries")
            .filter('_type == "inquiry"')
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) =>
          ![
            "siteSettings",
            "brand",
            "project",
            "property",
            "inquiry",
            "testimonial",
            "teamMember",
            "service",
            "client",
            "homeGallery",
          ].includes(item.getId() ?? ""),
      ),
    ]);
