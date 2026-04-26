import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "var(--ink)", color: "rgba(245,241,232,.7)", padding: "90px 0 36px" }}>
      <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
        <div className="grid-footer" style={{ marginBottom: "80px" }}>
          <div>
            <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "30px", fontWeight: 500, letterSpacing: ".3em", color: "var(--bg)", lineHeight: 1, display: "inline-block" }}>
              TAL<span style={{ color: "var(--gold-soft)", fontWeight: 500 }}>I</span>RA
            </Link>
            <p style={{ fontSize: "14px", margin: "20px 0", maxWidth: "280px" }}>
              {"Преміум-товари для дому, краси та здоров\u0027я. Колекція з європейським смаком."}
            </p>
            <div style={{ display: "flex", gap: "14px" }}>
              <SocialIcon href="https://www.instagram.com/talira.com.ua"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zM17.5 6.5h.01" /></svg></SocialIcon>
              <SocialIcon href="https://t.me/talira_com_ua"><svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path d="m22 2-7 20-4-9-9-4 20-7z" /></svg></SocialIcon>
            </div>
          </div>
          <FooterCol title="Каталог">
            <FooterLink href="/catalog?category=kuhnia">{"Все для кухні"}</FooterLink>
            <FooterLink href="/catalog?category=elektronika-dlia-domu">{"Електроніка"}</FooterLink>
            <FooterLink href="/catalog?category=krasa-ta-dohliad">{"Краса та догляд"}</FooterLink>
            <FooterLink href="/catalog?category=dim-ta-sad">{"Дім та сад"}</FooterLink>
            <FooterLink href="/catalog?category=zdorovia-ta-masazhery">{"Здоров\u0027я"}</FooterLink>
            <FooterLink href="/catalog?category=dytiachi-tovary">{"Дитячі товари"}</FooterLink>
            <FooterLink href="/catalog?category=avto-ta-instrument">{"Авто та інструмент"}</FooterLink>
          </FooterCol>
          <FooterCol title="Допомога">
            <FooterLink href="/delivery">{"Доставка та оплата"}</FooterLink>
            <FooterLink href="/reviews">{"Відгуки"}</FooterLink>
            <FooterLink href="/about">{"Про бренд"}</FooterLink>
            <FooterLink href="/contacts">{"Контакти"}</FooterLink>
          </FooterCol>
          <FooterCol title="Контакти">
            <FooterLink href="tel:+380635294105">{"+380 63 529 41 05"}</FooterLink>
            <FooterLink href="https://t.me/talira_com_ua">{"Telegram: @talira_com_ua"}</FooterLink>
            <FooterLink href="https://www.instagram.com/talira.com.ua">{"Instagram: @talira.com.ua"}</FooterLink>
            <FooterLink href="mailto:talira.com.ua@gmail.com">{"talira.com.ua@gmail.com"}</FooterLink>
          </FooterCol>
        </div>
        <div style={{ paddingTop: "32px", borderTop: "1px solid rgba(245,241,232,.1)", display: "flex", justifyContent: "space-between", color: "rgba(245,241,232,.4)", fontSize: "11px", letterSpacing: ".15em", textTransform: "uppercase", flexWrap: "wrap", gap: "12px" }}>
          <div>&copy; 2026 TALIRA</div>
          <div>{"Публічна оферта"}</div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h5 style={{ fontSize: "11px", letterSpacing: ".25em", textTransform: "uppercase", color: "var(--gold-soft)", marginBottom: "24px", fontWeight: 500, fontFamily: "'Inter', sans-serif" }}>{title}</h5>
      <ul style={{ listStyle: "none" }}>{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li style={{ marginBottom: "14px" }}>
      <Link href={href} style={{ color: "rgba(245,241,232,.7)", fontSize: "14px", transition: "color .3s" }}>{children}</Link>
    </li>
  );
}

function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} target="_blank" rel="noopener noreferrer" style={{ width: "40px", height: "40px", border: "1px solid rgba(245,241,232,.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bg)", transition: "all .3s" }}>
      {children}
    </Link>
  );
}
