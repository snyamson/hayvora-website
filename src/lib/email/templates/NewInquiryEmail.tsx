import type { PageTextDoc } from "@/types/sanity";
import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

export function NewInquiryEmail({
  name,
  email,
  phone,
  message,
  propertyTitle,
  kind,
  subject,
  labels = {},
}: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  propertyTitle?: string;
  kind: string;
  subject: string;
  labels?: NonNullable<PageTextDoc["email"]>;
}) {

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f4" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px" }}>
          <Heading style={{ fontSize: "18px" }}>{subject}</Heading>
          <Section>
            <Text>
              <strong>{labels.typeLabel}</strong> {kind}
            </Text>
            {propertyTitle && (
              <Text>
                <strong>{labels.propertyLabel}</strong> {propertyTitle}
              </Text>
            )}
            <Text>
              <strong>{labels.nameLabel}</strong> {name}
            </Text>
            <Text>
              <strong>{labels.emailLabel}</strong> {email}
            </Text>
            <Text>
              <strong>{labels.phoneLabel}</strong> {phone}
            </Text>
            {message && (
              <Text>
                <strong>{labels.messageLabel}</strong> {message}
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
