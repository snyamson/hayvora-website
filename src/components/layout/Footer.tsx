import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/Container";
import type { NavItem } from "@/components/layout/Header";

export function Footer({
  brandName,
  logoUrl,
  footerText,
  links = [],
  email,
  phone,
  socialLinks = [],
}: {
  brandName: string;
  logoUrl?: string;
  footerText?: string;
  links?: NavItem[];
  email?: string;
  phone?: string;
  socialLinks?: { platform: string; url: string }[];
}) {
  return (
    <footer className="bg-brand-secondary text-white">
      <Container className="grid grid-cols-1 gap-12 py-20 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div className="flex items-start">
          {logoUrl ? (
            <Image src={logoUrl} alt={brandName} width={240} height={240} className="h-28 w-28 sm:h-36 sm:w-36" />
          ) : (
            <p className="font-display text-3xl font-bold tracking-tight uppercase">{brandName}</p>
          )}
        </div>

        <div>
          <p className="font-display text-sm font-bold tracking-wide text-white/60 uppercase">About {brandName}</p>
          {footerText && <p className="mt-4 text-sm leading-relaxed text-white/85">{footerText}</p>}
        </div>

        {links.length > 0 && (
          <div>
            <p className="font-display text-sm font-bold tracking-wide text-white/60 uppercase">Links</p>
            <nav className="mt-4 flex flex-col gap-2">
              {links.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-white/85 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}

        <div>
          <p className="font-display text-sm font-bold tracking-wide text-white/60 uppercase">Contact Us</p>
          <div className="mt-4 space-y-1 text-sm text-white/85">
            {email && <p>{email}</p>}
            {phone && <p>{phone}</p>}
          </div>
        </div>
      </Container>

      <Container className="flex flex-col items-center justify-between gap-4 border-t border-white/20 py-6 text-xs text-white/70 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {brandName}. All rights reserved.
        </p>
        {socialLinks.length > 0 && (
          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <Link key={link.platform} href={link.url} className="capitalize hover:text-white">
                {link.platform}
              </Link>
            ))}
          </div>
        )}
      </Container>
    </footer>
  );
}
