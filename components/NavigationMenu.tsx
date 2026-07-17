const navigationItems = [
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact Us" },
];

export default function NavigationMenu() {
  return (
    <details className="menu">
      <summary aria-label="Open navigation menu">
        <span />
        <span />
        <span />
      </summary>
      <nav aria-label="Main navigation">
        {navigationItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
    </details>
  );
}
