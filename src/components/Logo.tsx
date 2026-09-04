import Link from "next/link";
import { experimentConfig } from "@/config/experiment";
import { copy } from "@/lib/copy";
import { CaseMark } from "@/components/icons";

/**
 * Wordmark. Always the full brand name -- the short form "Kofferwerk" is only
 * used inside running text, never as a logo.
 */
export function Logo({
  showClaim = true,
  className = "",
}: {
  showClaim?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2 sm:gap-3 ${className}`}
      aria-label={`${experimentConfig.brand.name} — Startseite`}
    >
      {/* Auf sehr schmalen Displays trägt die Wortmarke allein — sonst wird die Kopfzeile zu eng. */}
      <CaseMark className="text-brass-600 group-hover:text-brass-700 xs:block hidden h-6 w-8 shrink-0 transition-colors sm:h-7 sm:w-9" />
      <span className="flex min-w-0 flex-col leading-none">
        <span className="text-ink-900 font-serif text-base tracking-tight whitespace-nowrap sm:text-xl">
          {experimentConfig.brand.name}
        </span>
        {/* Die Unterzeile weicht auf schmalen Displays, damit die Wortmarke einzeilig bleibt. */}
        {showClaim ? (
          <span className="text-ink-600 mt-1 hidden text-[0.68rem] tracking-[0.16em] uppercase sm:block">
            {copy.brandClaim}
          </span>
        ) : null}
      </span>
    </Link>
  );
}
