import Link from "next/link";
import { experimentConfig } from "@/config/experiment";
import { copy } from "@/lib/copy";
import { CaseMark } from "@/components/icons";

type FooterLink = { href: string; label: string };

/**
 * Footer of the shop view.
 *
 * Which columns exist is decided by the experiment arm. In the arms that test
 * missing provider information there are no legal links at all -- not even as
 * placeholders, because an empty page behind a footer link would be a
 * different signal than a missing link.
 */
export function SiteFooter() {
  const { signals, brand } = experimentConfig;

  const shopLinks: FooterLink[] = [
    { href: "/kollektion", label: "Kollektion" },
    { href: "/kollektion?kategorie=handgepaeck", label: "Handgepäck" },
    { href: "/kollektion?kategorie=reisekoffer", label: "Reisekoffer" },
    { href: "/kollektion?kategorie=koffersets", label: "Koffersets" },
    { href: "/faq", label: "FAQ" },
  ];

  const campaignLinks: FooterLink[] = signals.closureNarrative
    ? [
        { href: "/kollektion", label: "Letzte Kollektion" },
        { href: "/#letzte-stuecke", label: "Abschiedsverkauf" },
        { href: "/#unsere-geschichte", label: "Unsere Geschichte" },
      ]
    : [{ href: "/#unsere-geschichte", label: "Unsere Werkstatt" }];

  const legalLinks: FooterLink[] = [
    ...(signals.showImprint ? [{ href: "/impressum", label: "Impressum" }] : []),
    ...(signals.showContactPage ? [{ href: "/kontakt", label: "Kontakt" }] : []),
    ...(signals.showShippingPage ? [{ href: "/versand", label: "Versand" }] : []),
    ...(signals.showWithdrawalPage ? [{ href: "/widerruf", label: "Widerruf" }] : []),
    ...(signals.showTermsPage ? [{ href: "/agb", label: "AGB" }] : []),
    ...(signals.showPrivacyPage ? [{ href: "/datenschutz", label: "Datenschutz" }] : []),
  ];

  return (
    <footer className="border-cream-300 bg-cream-200 mt-24 border-t">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <CaseMark className="text-brass-600 h-6 w-8" />
            <span className="text-ink-900 font-serif text-lg">{brand.name}</span>
          </div>
          <p className="text-ink-600 mt-3 text-sm">{copy.brandClaim}</p>
        </div>

        <FooterColumn title="Shop" links={shopLinks} />
        <FooterColumn
          title={signals.closureNarrative ? "Kampagne" : "Marke"}
          links={campaignLinks}
        />

        {legalLinks.length > 0 ? (
          <FooterColumn title="Rechtliches" links={legalLinks} />
        ) : (
          <div aria-hidden />
        )}
      </div>

      <div className="border-cream-300 border-t">
        <p className="container-page text-ink-600 py-5 text-xs">
          {brand.name} — {copy.brandClaim}
        </p>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: readonly FooterLink[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="text-ink-700 font-sans text-xs font-semibold tracking-[0.16em] uppercase">
        {title}
      </h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="text-ink-700 hover:text-ink-900 text-sm underline-offset-4 hover:underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
