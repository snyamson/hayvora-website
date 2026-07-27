import { Body, Container, Head, Heading, Html, Preview, Section, Text } from "@react-email/components";

export function NewInquiryEmail({
  name,
  email,
  phone,
  message,
  propertyTitle,
  kind,
}: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  propertyTitle?: string;
  kind: string;
}) {
  const subject = propertyTitle ? `Viewing request: ${propertyTitle}` : "New website inquiry";

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f4" }}>
        <Container style={{ backgroundColor: "#ffffff", padding: "32px", borderRadius: "12px" }}>
          <Heading style={{ fontSize: "18px" }}>{subject}</Heading>
          <Section>
            <Text>
              <strong>Type:</strong> {kind}
            </Text>
            {propertyTitle && (
              <Text>
                <strong>Property:</strong> {propertyTitle}
              </Text>
            )}
            <Text>
              <strong>Name:</strong> {name}
            </Text>
            <Text>
              <strong>Email:</strong> {email}
            </Text>
            <Text>
              <strong>Phone:</strong> {phone}
            </Text>
            {message && (
              <Text>
                <strong>Message:</strong> {message}
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
