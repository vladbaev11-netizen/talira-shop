"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

export default function TelegramButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<"messengers" | "chat">("messengers");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const pathname = usePathname();

  if (pathname.startsWith("/studio")) return null;

  async function handleSend() {
    if (!name.trim() || !phone.trim()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone: phone.trim(), message: message.trim() }),
      });
      if (res.ok) {
        setStatus("sent");
        setTimeout(() => { setStatus("idle"); setName(""); setPhone(""); setMessage(""); }, 4000);
      } else setStatus("error");
    } catch { setStatus("error"); }
  }

  return (
    <>
      <style>{`
        @keyframes chatPulse {
          0% { box-shadow: 0 4px 16px rgba(42,171,238,.3); }
          50% { box-shadow: 0 4px 24px rgba(42,171,238,.6), 0 0 0 8px rgba(42,171,238,.15); }
          100% { box-shadow: 0 4px 16px rgba(42,171,238,.3); }
        }
        @keyframes chatBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>

      {/* Chat window */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: "90px", left: "24px", zIndex: 999,
          width: "340px", maxWidth: "calc(100vw - 48px)",
          background: "var(--bg)", borderRadius: "16px",
          boxShadow: "0 12px 40px rgba(26,22,18,.25)",
          overflow: "hidden", border: "1px solid var(--line-soft)",
        }}>
          <div style={{ background: "var(--ink)", padding: "20px", color: "var(--bg)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 500, letterSpacing: ".15em" }}>
                TAL<span style={{ color: "var(--gold-soft)" }}>I</span>RA
              </span>
              <button onClick={() => setIsOpen(false)} style={{ background: "none", border: "none", color: "rgba(245,241,232,.6)", cursor: "pointer", fontSize: "18px" }}>{"✕"}</button>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(245,241,232,.7)" }}>{"Ми на зв\u0027язку! Оберіть зручний спосіб."}</p>
          </div>

          <div style={{ display: "flex", borderBottom: "1px solid var(--line-soft)" }}>
            <button onClick={() => setTab("messengers")} style={{
              flex: 1, padding: "12px", fontSize: "12px", fontWeight: 600,
              letterSpacing: ".1em", textTransform: "uppercase", border: "none", cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              background: tab === "messengers" ? "var(--bg)" : "var(--paper)",
              color: tab === "messengers" ? "var(--gold-deep)" : "var(--text-dim)",
              borderBottom: tab === "messengers" ? "2px solid var(--gold-deep)" : "2px solid transparent",
            }}>{"Месенджери"}</button>
            <button onClick={() => setTab("chat")} style={{
              flex: 1, padding: "12px", fontSize: "12px", fontWeight: 600,
              letterSpacing: ".1em", textTransform: "uppercase", border: "none", cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              background: tab === "chat" ? "var(--bg)" : "var(--paper)",
              color: tab === "chat" ? "var(--gold-deep)" : "var(--text-dim)",
              borderBottom: tab === "chat" ? "2px solid var(--gold-deep)" : "2px solid transparent",
            }}>{"Написати нам"}</button>
          </div>

          <div style={{ padding: "20px" }}>
            {tab === "messengers" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <MessengerLink href="https://t.me/talira_com_ua" color="#2AABEE" label="Telegram" sub="@talira_com_ua"
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>} />
                <MessengerLink href="viber://chat?number=%2B380635294105" color="#7360F2" label="Viber" sub="+380 63 529 41 05"
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.541 6.783.46 9.942c-.08 3.16-.19 9.085 5.56 10.59h.01l-.01 2.42s-.04.98.61 1.18c.78.24 1.24-.5 1.99-1.3.41-.44.98-1.09 1.41-1.58 3.87.33 6.84-.42 7.18-.53.78-.26 5.18-.82 5.9-6.68.74-6.03-.36-9.83-2.36-11.55 0 0-1.1-1.15-4.28-1.95-1.6-.39-3.54-.54-5.07-.52z"/></svg>} />
                <MessengerLink href="https://wa.me/380635294105" color="#25D366" label="WhatsApp" sub="+380 63 529 41 05"
                  icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>} />
              </div>
            ) : (
              status === "sent" ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: "36px", marginBottom: "12px" }}>&#10003;</div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", marginBottom: "6px" }}>{"Дякуємо!"}</p>
                  <p style={{ fontSize: "13px", color: "var(--text-dim)" }}>{"Ми зв\u0027яжемося з вами найближчим часом"}</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <input type="text" placeholder="Ваше ім'я *" value={name} onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "6px", background: "var(--bg-card)", fontSize: "14px", fontFamily: "'Inter', sans-serif", color: "var(--ink)", outline: "none" }} />
                  <input type="tel" placeholder="Телефон *" value={phone} onChange={(e) => setPhone(e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "6px", background: "var(--bg-card)", fontSize: "14px", fontFamily: "'Inter', sans-serif", color: "var(--ink)", outline: "none" }} />
                  <textarea placeholder="Повідомлення (необов'язково)" value={message} onChange={(e) => setMessage(e.target.value)}
                    style={{ width: "100%", minHeight: "70px", padding: "12px 14px", border: "1px solid var(--line)", borderRadius: "6px", background: "var(--bg-card)", fontSize: "14px", fontFamily: "'Inter', sans-serif", color: "var(--ink)", outline: "none", resize: "vertical" }} />
                  <button onClick={handleSend} disabled={status === "sending" || !name.trim() || !phone.trim()}
                    style={{ padding: "14px", background: status === "sending" ? "var(--text-dim)" : "var(--gold-deep)", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, letterSpacing: ".15em", textTransform: "uppercase", cursor: status === "sending" ? "wait" : "pointer", fontFamily: "'Inter', sans-serif" }}>
                    {status === "sending" ? "Надсилаємо..." : "Надіслати"}
                  </button>
                  {status === "error" && <p style={{ color: "#c0392b", fontSize: "12px", textAlign: "center" }}>{"Помилка. Спробуйте ще раз."}</p>}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Animated button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed", bottom: "24px", left: "24px", zIndex: 999,
          width: "56px", height: "56px", borderRadius: "50%",
          background: isOpen ? "var(--ink)" : "#2AABEE",
          border: "none", display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all .3s",
          animation: isOpen ? "none" : "chatPulse 2s infinite, chatBounce 3s infinite",
        }}
      >
        {isOpen ? (
          <svg width="24" height="24" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/><path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>
        )}
      </button>
    </>
  );
}

function MessengerLink({ href, color, label, sub, icon }: { href: string; color: string; label: string; sub: string; icon: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", borderRadius: "10px", textDecoration: "none", background: "var(--paper)", border: "1px solid var(--line-soft)" }}>
      <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{label}</div>
        <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>{sub}</div>
      </div>
    </a>
  );
}
