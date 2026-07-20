import Link from "next/link";

const navigationItems = [
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact Us" },
];

export default function NavigationMenu() {
  return (
    <>
      <nav className="desktop-navigation" aria-label="Main navigation">
        {navigationItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <details className="menu">
        <summary aria-label="Open navigation menu">
          <span />
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile navigation">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </details>
    </>
  );
}
