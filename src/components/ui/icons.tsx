import { FC, ReactNode, SVGProps } from 'react';

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number };

// Square caps and mitred joins keep the icon set matching the cut-corner buttons
const makeIcon = (children: ReactNode): FC<IconProps> => ({ size = 18, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.75}
    strokeLinecap="square"
    strokeLinejoin="miter"
    aria-hidden="true"
    {...props}
  >
    {children}
  </svg>
);

export const DashboardIcon = makeIcon(
  <>
    <rect x="3" y="3" width="8" height="8" />
    <rect x="13" y="3" width="8" height="5" />
    <rect x="13" y="10" width="8" height="11" />
    <rect x="3" y="13" width="8" height="8" />
  </>
);

export const SlidersIcon = makeIcon(
  <>
    <path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1" />
    <rect x="13" y="5" width="4" height="4" />
    <rect x="7" y="10" width="4" height="4" />
    <rect x="15" y="15" width="4" height="4" />
  </>
);

export const LayersIcon = makeIcon(
  <>
    <path d="M12 3 21 8l-9 5-9-5z" />
    <path d="m3 12.5 9 5 9-5" />
    <path d="m3 17 9 5 9-5" />
  </>
);

export const ServerIcon = makeIcon(
  <>
    <rect x="3" y="4" width="18" height="6" />
    <rect x="3" y="14" width="18" height="6" />
    <path d="M7 7h.01M7 17h.01" />
  </>
);

export const CogIcon = makeIcon(
  <>
    <circle cx="12" cy="12" r="3.5" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
  </>
);

export const PlusIcon = makeIcon(<path d="M12 5v14M5 12h14" />);
export const MinusIcon = makeIcon(<path d="M5 12h14" />);
export const CheckIcon = makeIcon(<path d="m4 12.5 5 5L20 6.5" />);
export const XIcon = makeIcon(<path d="m5 5 14 14M19 5 5 19" />);
export const SwapIcon = makeIcon(<path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4" />);
export const ArrowRightIcon = makeIcon(<path d="M4 12h16M14 6l6 6-6 6" />);
export const DownloadIcon = makeIcon(<path d="M12 4v11M7 10l5 5 5-5M4 20h16" />);
export const UploadIcon = makeIcon(<path d="M12 16V5M7 10l5-5 5 5M4 20h16" />);
export const TrashIcon = makeIcon(<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" />);

export const EyeIcon = makeIcon(
  <>
    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </>
);

export const CopyIcon = makeIcon(
  <>
    <rect x="8" y="8" width="12" height="12" />
    <path d="M16 8V4H4v12h4" />
  </>
);
