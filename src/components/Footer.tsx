import Link from "next/link";

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--ink)",
        color: "rgba(245,241,232,.7)",
        padding: "90px 0 36px",
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "0 48px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
            gap: "60px",
            marginBottom: "80px",
          }}
        >
          {/* Brand */}
          <div>
            <Link
              href="/"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "30px",
                fontWeight: 500,
                letterSpacing: ".42em",
                color: "var(--bg)",
                lineHeight: 1,
              }}
            >
              TAL
              <em style={{ color: "var(--gold-soft)", fontWeight: 400, letterSpacing: 0, fontStyle: "italic" }}>I</em>
              RA
            </Link>
            <p style={{ fontSize: "14px", margin: "20px 0", maxWidth: "280px" }}>
              Преміум-товари для дому, краси та здоров'я. Колекція з європейським
              смаком.
            </p>
            <div style={{ display: "flex", gap: "14px" }}>
              <SocialIcon href="#">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </SocialIcon>
              <SocialIcon href="#">
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="m22 2-7 20-4-9-9-4 20-7z" />
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* Catalog */}
          <FooterCol title="Каталог">
            <FooterLink href="/catalog">Меблі</FooterLink>
            <FooterLink href="/catalog">Здоров'я</FooterLink>
            <FooterLink href="/catalog">Електроніка</FooterLink>
            <FooterLink href="/catalog">Краса</FooterLink>
          </FooterCol>

          {/* Help */}
          <FooterCol title="Допомога">
            <FooterLink href="/delivery">Доставка та оплата</FooterLink>
            <FooterLink href="#">Гарантія</FooterLink>
            <FooterLink href="#">Повернення</FooterLink>
            <FooterLink href="#">FAQ</FooterLink>
          </FooterCol>

          {/* Contacts */}
          <FooterCol title="Контакти">
            <FooterLink href="#">+380 XX XXX XX XX</FooterLink>
            <FooterLink href="#">hello@talira.com.ua</FooterLink>
            <FooterLink href="#">@talira.com.ua</FooterLink>
          </FooterCol>
        </div>

        {/* Bottom */}
        <div
          style={{
            paddingTop: "32px",
            borderTop: "1px solid rgba(245,241,232,.1)",
            display: "flex",
            justifyContent: "space-between",
            color: "rgba(245,241,232,.4)",
            fontSize: "11px",
            letterSpacing: ".15em",
            textTransform: "uppercase",
          }}
        >
          <div>© 2026 TALIRA</div>
          <div>Політика конфіденційності · Публічна оферта</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h5
        style={{
          fontSize: "11px",
          letterSpacing: ".25em",
          textTransform: "uppercase",
          color: "var(--gold-soft)",
          marginBottom: "24px",
          fontWeight: 500,
          fontFamily: "'Inter', sans-serif",
        }}
      >
        {title}
      </h5>
      <ul style={{ listStyle: "none" }}>{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li style={{ marginBottom: "14px" }}>
      <Link
        href={href}
        style={{
          color: "rgba(245,241,232,.7)",
          fontSize: "14px",
          transition: "color .3s",
        }}
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        width: "40px",
        height: "40px",
        border: "1px solid rgba(245,241,232,.2)",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--bg)",
        transition: "all .3s",
      }}
    >
      {children}
    </Link>
  );
}
