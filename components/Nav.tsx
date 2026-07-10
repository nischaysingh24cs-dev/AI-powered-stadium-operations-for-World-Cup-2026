'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/ops', label: 'Ops Command' },
  { href: '/concierge', label: 'Fan Concierge' },
  { href: '/vision', label: 'Safety & Vision' },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-6 border-b border-border bg-panel2/60 backdrop-blur sticky top-0 z-50 px-6 py-3">
      <Link href="/" className="font-display font-bold text-gold text-lg tracking-wide">
        🏟️ Stadium Copilot
      </Link>
      <div className="flex gap-4 ml-auto">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-medium transition-colors ${
              pathname === item.href
                ? 'text-gold'
                : 'text-mist hover:text-floodlight'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
