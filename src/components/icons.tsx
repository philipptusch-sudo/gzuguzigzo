import type { SVGProps } from "react";

/**
 * Inline icons. Kept local so the page loads no icon font and no external
 * sprite. All icons are decorative; the surrounding control carries the label.
 */

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m16.2 16.2 4.3 4.3" />
    </svg>
  );
}

export function CartIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 5h2l1.6 9.4a2 2 0 0 0 2 1.6h6.9a2 2 0 0 0 2-1.6L20 8H6.5" />
      <circle cx="10" cy="19.5" r="1.2" />
      <circle cx="17" cy="19.5" r="1.2" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TrashIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function InfoIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

/** Very reduced line drawing of a classic trunk, used next to the wordmark. */
export function CaseMark(props: IconProps) {
  return (
    <svg viewBox="0 0 40 32" fill="none" aria-hidden focusable="false" {...props}>
      <rect x="3" y="7" width="34" height="22" rx="4" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M3 15h34" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
      <path d="M17 15v14M23 15v14" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
    </svg>
  );
}
