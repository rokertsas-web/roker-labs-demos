/* global React, ReactDOM, CONTENT, PosMock, DashMock, CatalogMock, ChatMock, TechIcon */

const { useState, useEffect, useRef, useCallback, useMemo } = React;

/* ─── Country detection ─── */
const COOKIE_NAME = "roker_country";
const COOKIE_DAYS = 30;

function getCookie(name) {
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : null;
}
function setCookie(name, val, days) {
  const exp = new Date(Date.now() + days * 86400_000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(val)}; expires=${exp}; path=/; SameSite=Lax`;
}
function getQueryCountry() {
  const p = new URLSearchParams(window.location.search);
  const c = (p.get("country") || "").toUpperCase();
  return ["AR", "PY"].includes(c) ? c : null;
}
async function ipDetect() {
  // Best-effort. Times out fast; falls back to AR if anything fails.
  try {
    const ctrl = new AbortController();
    const to = setTimeout(() => ctrl.abort(), 2000);
    const r = await fetch("https://ipapi.co/json/", { signal: ctrl.signal });
    clearTimeout(to);
    if (!r.ok) return null;
    const j = await r.json();
    const cc = (j.country_code || j.country || "").toUpperCase();
    return cc === "PY" ? "PY" : "AR";
  } catch {
    return null;
  }
}

/* ─── Magnetic button wrapper ─── */
function MagneticButton({ children, strength = 0.35, ...rest }) {
  const wrapRef = useRef(null);
  const innerRef = useRef(null);

  const onMove = useCallback((e) => {
    const el = wrapRef.current;
    if (!el || !innerRef.current) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    innerRef.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }, [strength]);

  const onLeave = useCallback(() => {
    if (!innerRef.current) return;
    innerRef.current.style.transform = "translate(0,0)";
  }, []);

  return (
    <span ref={wrapRef} className="mag-wrap" onMouseMove={onMove} onMouseLeave={onLeave} {...rest}>
      <span ref={innerRef} className="mag-inner">{children}</span>
    </span>);

}

/* ─── Topbar ─── */
function Topbar({ country, setCountry, services }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="dot" />
        ROKER <span style={{ color: "var(--crimson-500)" }}>LABS</span>
      </div>
      <nav className="topbar-nav">
        <a href="#demos">Sistemas</a>
        <a href="#proceso">Cómo trabajo</a>
        <a href="#analisis">Análisis gratis</a>
        <a href="#faq">FAQ</a>
        <a href="#contacto">Contacto</a>
      </nav>
      <div className="topbar-spacer" />
      <CountrySwitch country={country} setCountry={setCountry} />
    </header>);

}

/* ─── Country switcher ─── */
function CountrySwitch({ country, setCountry }) {
  return (
    <div className="country-switch" role="group" aria-label="Seleccionar país">
      {["AR", "PY"].map((c) =>
      <button
        key={c}
        className={country === c ? "is-active" : ""}
        onClick={() => setCountry(c)}
        aria-pressed={country === c}
        title={c === "AR" ? "Argentina" : "Paraguay"}>
        
          <span className="flag">{c === "AR" ? "🇦🇷" : "🇵🇾"}</span>
          {c}
        </button>
      )}
    </div>);

}

/* ─── Quick Launch — 5 demos reales (Cmd/Ctrl+K) ─── */
function QuickLaunch() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);

  // Detectar Mac vs Windows/Linux para mostrar el shortcut correcto
  const isMac = useMemo(() =>
    typeof navigator !== "undefined" && /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent)
  , []);
  const kbdLabel = isMac ? "⌘K" : "Ctrl+K";

  const allDemos = window.DEMOS || [];
  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    return allDemos.filter((d) =>
      !q || d.name.toLowerCase().includes(q) ||
            d.vertical.toLowerCase().includes(q) ||
            d.id.includes(q)
    );
  }, [allDemos, filter]);

  // Keep flat alias for keyboard nav (same shape)
  const flat = filtered;

  // Global keyboard: Cmd/Ctrl+K to toggle, Esc to close
  useEffect(() => {
    const onKey = (e) => {
      const isOpenKey = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isOpenKey) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (open && e.key === "Escape") {
        setOpen(false);
      } else if (open && e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(flat.length - 1, i + 1));
      } else if (open && e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(0, i - 1));
      } else if (open && e.key === "Enter") {
        e.preventDefault();
        const item = flat[activeIdx];
        if (item && item.url) window.open(item.url, "_blank");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, activeIdx]);

  // Reset filter + index when opening; focus input
  useEffect(() => {
    if (open) {
      setFilter("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Reset active index when filter narrows
  useEffect(() => {setActiveIdx(0);}, [filter]);

  return (
    <>
      <button
        className={`ql-trigger ${open ? "is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        title="Modo vendedor (⌘K)">
        
        <span className="ql-grid" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => <span key={i} />)}
        </span>
        <span className="ql-trigger-label">Demos</span>
        <span className="ql-kbd">{kbdLabel}</span>
      </button>

      {open && <>
          <div className="ql-backdrop" onClick={() => setOpen(false)} />
          <div className="ql-panel" role="dialog" aria-label="Lanzador de demos">
            <div className="ql-search">
              <TechIcon name="search" size={18} />
              <input
              ref={inputRef}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Buscar sistema · POS, Dashboard, SIFEN..." />
            
              <span className="ql-kbd ql-kbd--inline">esc</span>
            </div>
            <div className="ql-list" ref={listRef}>
              <div className="ql-group-head">
                <TechIcon name="bolt" size={12} />
                Demos en vivo
                <span className="ql-group-count">{filtered.length}</span>
              </div>
              {filtered.length === 0 &&
                <div className="ql-empty">Sin resultados para «{filter}»</div>
              }
              {filtered.map((d, i) =>
                <a
                  key={d.id}
                  href={d.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`ql-item ${i === activeIdx ? "is-active" : ""}`}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => setOpen(false)}>
                  <span className="ql-item-icon" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: d.color, boxShadow: `0 0 8px ${d.color}80` }} />
                  </span>
                  <span className="ql-item-body">
                    <span className="ql-item-title">{d.name}</span>
                    <span className="ql-item-url">{d.vertical} · {d.url.replace("https://", "")}</span>
                  </span>
                  <span className="ql-badge ql-badge--live">LIVE</span>
                  <span className="ql-item-launch"><TechIcon name="arrow-right" size={14} /></span>
                </a>
              )}
            </div>
            <div className="ql-foot">
              <span><span className="ql-kbd ql-kbd--inline">↑↓</span> navegar</span>
              <span><span className="ql-kbd ql-kbd--inline">↵</span> lanzar</span>
              <span><span className="ql-kbd ql-kbd--inline">esc</span> cerrar</span>
              <span className="ql-foot-spacer" />
              <span className="ql-foot-meta">5 demos en vivo</span>
            </div>
          </div>
        </>
      }
    </>);

}

/* ─── Hero ─── */
function Hero({ data, country, waPrefill }) {
  const h = data.hero;
  return (
    <section className="hero" id="top">
      <div className="flow-blob flow-blob--cta" />
      <div className="hero-text" data-country-content key={"hero-" + country}>
        <span className="hero-eyebrow">
          <span className="pulse-dot" />
          {h.eyebrowDot}
        </span>
        <h1 className="hero-h1">
          {h.h1Pre} <span className="strike">{h.h1Strike}</span> {h.h1Post}{" "}
          <span className="accent">{h.h1Accent}</span>
        </h1>
        <p className="hero-sub">{h.sub}</p>

        <div className="hero-ctas">
          <MagneticButton strength={0.3}>
            <a className="btn btn--lg btn--primary btn--pulse" href={waPrefill("una demo de tus sistemas")}>
              {h.cta1} <TechIcon name="arrow-right" size={18} />
            </a>
          </MagneticButton>
          <a className="btn btn--lg btn--ghost" href="#demos">{h.cta2}</a>
        </div>

        <div className="hero-meta">
          {h.kpis.map((k, i) =>
          <React.Fragment key={i}>
              {i > 0 && <span className="dot-sep">·</span>}
              <span>
                <strong style={{ color: "var(--fg-0)", fontWeight: 700, marginRight: 6 }}>{k.v}</strong>
                {k.l}
              </span>
            </React.Fragment>
          )}
        </div>
      </div>

      <HeroVisual country={country} />
    </section>);

}

/* Hero visual = small overlapping product mocks (POS large, Dashboard floating) */
function HeroVisual({ country }) {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="hero-mock hero-mock--pos">
        <div style={{ height: 280, display: "flex", flexDirection: "column" }}>
          <div className="device-bar" style={{ height: 26, padding: "0 12px", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 5, boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.04)" }}>
            <span className="traffic" style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF5F57" }} />
            <span className="traffic" style={{ width: 9, height: 9, borderRadius: "50%", background: "#FEBC2E" }} />
            <span className="traffic" style={{ width: 9, height: 9, borderRadius: "50%", background: "#28C840" }} />
            <span style={{ flex: 1, marginLeft: 12, height: 16, borderRadius: 5, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 10, color: "var(--fg-4)", fontFamily: "var(--font-mono)" }}>
              {country === "PY" ? "saborcriollo-demo.pages.dev" : "saborcriollo-demo.pages.dev"}
            </span>
            <span style={{ fontSize: 10, color: "var(--fg-4)", letterSpacing: "0.04em" }}>Caja · Lu</span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <PosMock country={country} />
          </div>
        </div>
      </div>

      <div className="hero-mock hero-mock--dash">
        <div style={{ height: 220, display: "flex", flexDirection: "column" }}>
          <div style={{ height: 22, padding: "0 10px", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: "var(--fg-3)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.04)" }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--crimson-500)", boxShadow: "0 0 6px var(--crimson-500)" }} />
            Dashboard · 14:32
            <span style={{ marginLeft: "auto", color: "var(--ok-400)" }}>● Live</span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <DashMock country={country} />
          </div>
        </div>
      </div>

      <div className="hero-mock--chip">
        <div className="toast">
          <span className="toast-dot" />
          <span style={{ fontSize: 12, color: "var(--fg-1)" }}>
            <strong style={{ color: "var(--fg-0)", fontWeight: 600 }}>+12 ventas</strong> en la última hora
          </span>
        </div>
      </div>
    </div>);

}

/* ─── Trust bar ─── */
function TrustBar({ data, country }) {
  return (
    <section className="trust" key={"trust-" + country} data-country-content>
      <span className="trust-label">{data.trust.label}</span>
      <div className="trust-list">
        {data.trust.items.map((it, i) =>
        <span className="trust-item" key={it.name + i}>
            <span className="mark" style={{ "--accent": it.color }}>{it.initial}</span>
            <span><strong style={{ color: "var(--fg-1)", fontWeight: 600 }}>{it.name}</strong> <span style={{ color: "var(--fg-4)" }}>· {it.city}</span></span>
          </span>
        )}
      </div>
      <div className="trust-stats">
        {data.trust.stats.map((s, i) =>
        <div className="trust-stat" key={i}>
            <span className="v">{s.v}</span>
            <span className="l">{s.l}</span>
          </div>
        )}
      </div>
    </section>);

}

/* ─── Bento grid (with tabbed categories) ─── */
function Bento({ data, country, bankList, waPrefill }) {
  const tabs = window.CATEGORIES;
  const [tab, setTab] = useState(tabs[0].id);

  const counts = useMemo(() => {
    const c = {};
    tabs.forEach((t) => {c[t.id] = data.services.filter((s) => s.cat === t.id).length;});
    return c;
  }, [data, tabs]);

  const visible = data.services.filter((s) => s.cat === tab);
  const active = tabs.find((t) => t.id === tab) || tabs[0];
  const total = data.services.length;

  return (
    <section className="section" id="servicios">
      <div className="section-head" data-country-content key={"head-" + country}>
        <div className="section-eyebrow">{data.bento.eyebrow}</div>
        <h2 className="section-h2">{data.bento.h2}</h2>
        <p className="section-sub">{data.bento.sub}</p>
      </div>

      <div className="tabs-row">
        <div className="tab-shell" role="tablist">
          {tabs.map((t) =>
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={`tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => setTab(t.id)}>
            
              {t.short}
              <span className="count">{counts[t.id] || 0}</span>
            </button>
          )}
        </div>
        <span className="tab-meta">
          <strong>{visible.length}</strong> de <strong>{total}</strong> servicios · {country === "PY" ? "Paraguay" : "Argentina"}
        </span>
      </div>
      <p className="tab-desc" key={"tabdesc-" + tab + "-" + country}>{active.desc}</p>

      <div className="bento bento--tabbed cascade" key={"bento-" + country + "-" + tab}>
        {visible.map((s) =>
        <ServiceCell
          key={s.id}
          svc={{ ...s, size: tabbedSize(s) }}
          country={country}
          bankList={bankList}
          waPrefill={waPrefill} />

        )}
      </div>
    </section>);

}

/* Normalize card sizes in the tabbed view: features (mock=pos/dash, bank-grids)
   are 3-col 2-row showcases; everything else is a 3-col 1-row half-tile. */
function tabbedSize(svc) {
  if (svc.mock === "pos" || svc.mock === "dash") return "w3 h2";
  if (svc.id === "mp" || svc.id === "billeteras") return "w3 h2";
  return "w3";
}

/* ─── Demos showcase (magazine cards with real photos) ─── */
function DemosShowcase({ data, country }) {
  const demos = window.DEMOS || [];
  return (
    <section className="section demos-section" id="demos">
      <div className="section-head" data-country-content key={"dhead-" + country}>
        <div className="section-eyebrow">Demos navegables en vivo</div>
        <h2 className="section-h2">5 sistemas reales. Tocá y probá.</h2>
        <p className="section-sub">
          No son mockups de Figma. Son sistemas deployados que podés navegar ahora
          desde cualquier dispositivo — celular, tablet o computadora.
        </p>
      </div>
      <div className="demos-grid">
        {demos.map((demo) =>
          <a
            key={demo.id}
            className="demo-card"
            href={demo.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ "--demo-color": demo.color }}
          >
            <div
              className="demo-card__photo"
              style={{ backgroundImage: `${demo.bgMood}, url("${demo.bgImage}")` }}
              aria-hidden="true"
            />
            <div className="demo-card__body">
              <div className="demo-card__eyebrow">
                <span className="demo-card__dot" style={{ background: demo.color }} aria-hidden="true" />
                {demo.vertical}
              </div>
              <h3 className="demo-card__name">{demo.name}</h3>
              <p className="demo-card__desc">{demo.tagline}</p>
              <div className="demo-card__chips">
                {demo.features.map((f) => <span key={f} className="demo-card__chip">{f}</span>)}
              </div>
              <div className="demo-card__footer">
                <span className="demo-card__tech">{demo.tech}</span>
                <span className="demo-card__cta" style={{ color: demo.color }}>Ver sistema →</span>
              </div>
            </div>
          </a>
        )}
      </div>
    </section>
  );
}

function ServiceCell({ svc, country, bankList, waPrefill }) {
  const sizeClasses = (svc.size || "w2").split(" ").map((s) => `cell--${s}`).join(" ");
  const hasPhoto = !!svc.bgImage;
  const [revealed, setRevealed] = useState(false);

  // Tap toggle for mobile / sticky-reveal. Don't fire when clicking inner links/buttons.
  const onCardClick = (e) => {
    if (e.target.closest("a, button")) return;
    setRevealed((r) => !r);
  };

  const launchHref = svc.demoUrl || waPrefill(svc.title);
  const launchInNewTab = !!svc.demoUrl;

  return (
    <article
      className={`cell ${sizeClasses}${svc.brand ? " cell--brand" : ""}${hasPhoto ? " cell--photo" : ""}${revealed ? " is-revealed" : ""}`}
      onClick={onCardClick}>
      
      {hasPhoto &&
      <>
          <div
          className="cell-bg"
          style={{ backgroundImage: `${svc.bgMood ? svc.bgMood + ", " : ""}url("${svc.bgImage}")` }}
          aria-hidden="true" />
        
          <div className="cell-bg-overlay" aria-hidden="true" />
        </>
      }
      <div className="cell-head">
        <span className="cell-icon"><TechIcon name={svc.icon} size={20} /></span>
        <span className="cell-live-badge" aria-hidden="true">
          <span className="ld" /> LIVE
        </span>
        {svc.tag &&
        <span className={`cell-tag${svc.tagPY ? " cell-tag--py" : svc.isNew ? " cell-tag--new" : ""}`}>
            {svc.isNew ? "Nuevo · " : ""}{svc.tag}
          </span>
        }
      </div>
      <h3 className="cell-title">{svc.title}</h3>

      <div className="cell-body">
        <p className="cell-desc">{svc.desc}</p>
        <div className="cell-live" aria-hidden={!revealed}>
          <LivePreview svc={svc} country={country} bankList={bankList} />
        </div>
      </div>

      <div className="cell-launch-wrap">
        {svc.price &&
        <span className="cell-price">
            {svc.price}
            {svc.priceNote && <em> · {svc.priceNote}</em>}
          </span>
        }
        <a
          className="launch-btn"
          href={launchHref}
          target={launchInNewTab ? "_blank" : undefined}
          rel={launchInNewTab ? "noopener noreferrer" : undefined}>
          
          Lanzar sistema en vivo
          <span className="launch-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </article>);

}

/* LivePreview chooses the right "running" mock per service */
function LivePreview({ svc, country, bankList }) {
  if (svc.mock === "pos") return <PosLive country={country} svc={svc} />;
  if (svc.mock === "dash") return <DashLive country={country} svc={svc} />;
  if (svc.mock === "chat") return <ChatLive country={country} svc={svc} />;
  if (svc.mock === "catalog") return <CatalogLive svc={svc} />;
  if (svc.id === "mp" || svc.id === "billeteras") return <BankLive bankList={bankList} svc={svc} />;
  return <ConsoleLive svc={svc} country={country} />;
}

function liveFrame(host, children) {
  return (
    <div className="live-frame">
      <div className="device-bar">
        <span className="traffic" /><span className="traffic" /><span className="traffic" />
        <span className="url">{host}</span>
        <span className="device-live"><span className="ld" /> LIVE</span>
      </div>
      <div className="live-body">{children}</div>
    </div>);

}

function PosLive({ country, svc }) {return liveFrame(country === "PY" ? "saborcriollo-demo.pages.dev" : "saborcriollo-demo.pages.dev", <PosMock country={country} />);}
function DashLive({ country, svc }) {return liveFrame("carhub-demo.pages.dev", <DashMock country={country} />);}
function ChatLive({ country, svc }) {return liveFrame("fixmobile-demo.pages.dev", <ChatMock country={country} />);}
function CatalogLive({ svc }) {return liveFrame("motohub-demo.pages.dev", <CatalogMock />);}
function ConsoleLive({ svc, country }) {return liveFrame("roker-labs-demos.pages.dev/" + svc.id, <ConsoleMock service={svc} country={country} />);}
function BankLive({ bankList, svc }) {
  return liveFrame("roker-labs-demos.pages.dev/" + svc.id,
  <div className="bank-grid bank-grid--live">
      {bankList.map((b) => {
      const c = bankColor(b);
      return (
        <div className="bank-chip" key={b} style={{
          background: `linear-gradient(135deg, ${hexAlpha(c, 0.22)} 0%, ${hexAlpha(c, 0.02)} 70%), rgba(255,255,255,0.025)`,
          ["--bank-accent"]: c
        }}>
            <div className="top">
              <span className="swatch" style={{ background: c, boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.18), 0 0 10px -2px ${c}` }} />
              <span className="name">{b}</span>
            </div>
            <span className="meta">{bankMeta(b)}</span>
          </div>);

    })}
    </div>
  );
}

function bankColor(name) {
  const map = {
    "Galicia": "#F59E0B",
    "Santander": "#F43F5E",
    "BBVA": "#3B82F6",
    "Mercado Pago": "#22D3EE",
    "Bancard": "#3B82F6",
    "Tigo Money": "#22D3EE",
    "Personal Pay": "#A855F7",
    "Wally": "#F59E0B"
  };
  return map[name] || "rgba(255,255,255,0.2)";
}
function bankMeta(name) {
  const m = {
    "Galicia": "Tarjetas · QR",
    "Santander": "Tarjetas · QR",
    "BBVA": "Tarjetas · QR",
    "Mercado Pago": "QR · link · point",
    "Bancard": "POS · QR",
    "Tigo Money": "Billetera · QR",
    "Personal Pay": "Billetera · QR",
    "Wally": "Billetera · QR"
  };
  return m[name] || "";
}
function hexAlpha(hex, a) {
  if (!hex || !hex.startsWith("#")) return hex;
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* ─── Lead magnet ─── */
function LeadMagnet({ data, country }) {
  const lm = data.leadMagnet;
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  return (
    <section className="section" id="analisis">
      <div className="lead-magnet" data-country-content key={"lm-" + country}>
        <div>
          <div className="section-eyebrow">Análisis gratuito · 48hs</div>
          <h2 className="lead-h">
            {lm.h}<br />
            <span>{lm.hAccent}</span>
          </h2>
          <p className="lead-sub">{lm.sub}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, color: "var(--fg-2)", fontSize: 14 }}>
            {[
            "Top 20 SKUs por margen y rotación",
            "Outliers de precio · sobrestock · faltantes",
            "1 recomendación de automatización concreta"].
            map((t) =>
            <li key={t} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 999, background: "var(--ok-soft)", color: "var(--ok-400)", boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.30)" }}>
                  <TechIcon name="check" size={12} />
                </span>
                {t}
              </li>
            )}
          </ul>
        </div>
        <form className="lead-form" onSubmit={(e) => e.preventDefault()}>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: "none" }}
            onChange={(e) => setFileName(e.target.files?.[0]?.name || null)} />
          
          <div className="dropzone" onClick={() => inputRef.current?.click()}>
            <span className="ico"><TechIcon name="arrow-up" size={22} /></span>
            <span className="hint"><strong>{fileName || "Arrastrá tu Excel acá"}</strong> {!fileName && <span style={{ color: "var(--fg-4)" }}>o tocá para elegir archivo</span>}</span>
            <span className="sub">{lm.hint}</span>
          </div>
          <div className="field" style={{ marginTop: 4 }}>
            <TechIcon name="user" size={16} />
            <input placeholder="Nombre + email · WhatsApp si preferís" />
          </div>
          <MagneticButton strength={0.25}>
            <button type="submit" className="btn btn--primary btn--lg btn--pulse" style={{ width: "100%", justifyContent: "center" }}>
              {lm.cta} <TechIcon name="arrow-right" size={18} />
            </button>
          </MagneticButton>
        </form>
      </div>
    </section>);

}

/* ─── WhatsApp CTA ─── */
function WaCta({ data, country, waPrefill }) {
  return (
    <section className="wa-cta" id="contacto" data-country-content key={"wa-" + country}>
      <div className="wa-card">
        <div className="section-eyebrow">Contacto directo</div>
        <h2 className="wa-h">{data.wa.h}</h2>
        <p className="wa-sub">{data.wa.sub}</p>
        <MagneticButton strength={0.25}>
          <a className="btn--wa" href={waPrefill()}>
            <TechIcon name="whatsapp" size={20} />
            {data.wa.btn}
          </a>
        </MagneticButton>
        <p style={{ marginTop: 16, fontSize: 12, color: "var(--fg-4)", letterSpacing: "0.02em" }}>
          {data.wa.phone} · AR + PY
        </p>
      </div>

      <div className="glass" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
        <div className="section-eyebrow">Cómo trabajamos</div>
        {[
        { n: "01", t: "Llamada de 25 min", d: "Vemos tu operación actual y los puntos de fricción." },
        { n: "02", t: "Propuesta técnica en 48hs", d: "Un mock funcional con tus datos reales. Sin contratos todavía." },
        { n: "03", t: "Implementación en 30 días", d: "Sistema en producción, capacitación al equipo, soporte directo." }].
        map((step) =>
        <div key={step.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <span style={{
            flexShrink: 0, width: 38, height: 38, borderRadius: 10,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.05)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
            fontSize: 12, fontWeight: 700, letterSpacing: "-0.02em",
            color: "var(--fg-2)", fontVariantNumeric: "tabular-nums"
          }}>{step.n}</span>
            <div>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "var(--fg-0)", letterSpacing: "-0.01em" }}>{step.t}</h4>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--fg-3)", lineHeight: 1.5 }}>{step.d}</p>
            </div>
          </div>
        )}
      </div>
    </section>);

}

/* ─── Footer ─── */
function Footer({ data, country }) {
  return (
    <footer className="footer" data-country-content key={"foot-" + country}>
      <div className="col">
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, var(--crimson-400), var(--crimson-700))", boxShadow: "0 0 12px var(--crimson-500)" }} />
          <strong style={{ fontWeight: 900, letterSpacing: "-0.04em", fontSize: 18, color: "var(--fg-0)" }}>ROKER <span style={{ color: "var(--crimson-500)" }}>LABS</span></strong>
        </div>
        <p style={{ color: "var(--fg-2)", fontSize: 13, lineHeight: 1.55, maxWidth: 36 + "ch" }}>{data.footer.tagline}</p>
        <p style={{ color: "var(--fg-4)", fontSize: 11, marginTop: 12 }}>{data.footer.address}</p>
        <p style={{ color: "var(--fg-4)", fontSize: 11 }}>{data.footer.cuit}</p>
      </div>
      <div className="col">
        <h4>Servicios</h4>
        <a href="#servicios">Sistemas POS</a>
        <a href="#servicios">Dashboards</a>
        <a href="#servicios">Automatizaciones IA</a>
        <a href="#servicios">Catálogos web</a>
        {country === "PY" && <a href="#servicios">Facturación SIFEN</a>}
      </div>
      <div className="col">
        <h4>Recursos</h4>
        <a href="#analisis">Análisis gratis 48hs</a>
        <a href="#servicios">Demos en vivo</a>
        <a href="#contacto">Agendar demo</a>
      </div>
      <div className="col">
        <h4>Contacto</h4>
        <a href="#contacto">WhatsApp directo</a>
        <a href="mailto:rokertsas@gmail.com">rokertsas@gmail.com</a>
        <a href="#contacto">Argentina · trabajando con Paraguay</a>
      </div>
      <div className="footer-bottom" style={{ gridColumn: "1 / -1" }}>
        <span>© 2026 Roker Labs · Sergio Roker</span>
        <span>Hecho a mano en {country === "PY" ? "Argentina 🇦🇷 · trabajando con PY 🇵🇾" : "Argentina · trabajando con Paraguay"}</span>
      </div>
    </footer>);

}

/* ─── Process ─── */
function Process({ waPrefill }) {
  const steps = [
    { n: "01", t: "Llamada de diagnóstico", d: "25 minutos, gratis. Vemos tu operación, los cuellos de botella y si tiene sentido seguir." },
    { n: "02", t: "Propuesta en 48hs", d: "Precio fijo, sin letra chica. Un mock funcional con tus datos reales. Sin contrato todavía." },
    { n: "03", t: "Construcción iterativa", d: "Primera versión funcional en 30 días. Updates semanales. El equipo empieza a usar mientras se construye." },
    { n: "04", t: "Lanzamiento y soporte", d: "WhatsApp directo. Bugs resueltos el mismo día. Soporte incluido 60 días post-lanzamiento." },
  ];

  return (
    <section className="section process-section" id="proceso">
      <div className="section-head">
        <div className="section-eyebrow">Cómo trabajo</div>
        <h2 className="section-h2">Del diagnóstico al sistema en producción.</h2>
        <p className="section-sub">Sin metodologías inventadas. Sin reuniones de planning eternas. Cuatro pasos.</p>
      </div>
      <div className="process-steps">
        {steps.map((s) => (
          <div key={s.n} className="process-step">
            <div className="process-step__num">{s.n}</div>
            <div>
              <h3 className="process-step__title">{s.t}</h3>
              <p className="process-step__desc">{s.d}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="process-cta">
        <MagneticButton strength={0.3}>
          <a className="btn btn--lg btn--primary btn--pulse" href={waPrefill("una llamada de diagnóstico gratuita")}>
            Agendar llamada gratuita <TechIcon name="arrow-right" size={18} />
          </a>
        </MagneticButton>
        <span style={{ fontSize: 13, color: "var(--fg-4)" }}>25 min · sin compromiso · sin tarjeta</span>
      </div>
    </section>);
}

/* ─── FAQ accordion ─── */
function FAQ() {
  const items = [
    {
      q: "¿Trabajás solo? ¿Qué pasa si me dejás colgado?",
      a: "15 años trabajando así, sin interrupciones mayores. Para urgencias críticas tengo backup en la nube y acceso remoto desde cualquier dispositivo. El SLA real: en 3 años de sistemas propios no hubo downtime mayor a 4 horas en horario laboral.",
    },
    {
      q: "¿Cuánto tarda implementar un sistema desde cero?",
      a: "30 días para la primera versión funcional. No el producto terminado — el núcleo operativo que el equipo empieza a usar. Las iteraciones siguientes salen en sprints de 7 a 10 días.",
    },
    {
      q: "¿Qué pasa si necesito cambios después del lanzamiento?",
      a: "Soporte incluido 60 días post-lanzamiento. Bugs = mismo día. Features nuevas = cotización separada antes de empezar, sin sorpresas ni cambios de precio en el camino.",
    },
    {
      q: "¿Integrás con MercadoLibre, AFIP, WhatsApp?",
      a: "Sí. ML (listings, órdenes, stock), AFIP/ARCA (SICORE, percepciones, facturación electrónica), SIFEN Paraguay, WhatsApp API. Cada integración se cotiza por separado según complejidad.",
    },
    {
      q: "¿El código queda mío si dejamos de trabajar?",
      a: "100%. Al cerrar el proyecto entrego el repositorio completo (GitHub privado a tu nombre) más documentación técnica. Sin lock-in: cualquier desarrollador puede continuar desde donde dejamos.",
    },
    {
      q: "¿Puedo empezar con algo pequeño sin compromiso?",
      a: "Ese es exactamente el modelo. La llamada de diagnóstico es gratis. La propuesta técnica viene con un mock con tus datos reales, sin contrato todavía. La mayoría empieza con un solo módulo y escala cuando ve el resultado.",
    },
  ];

  const [open, setOpen] = useState(null);
  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <section className="section faq-section" id="faq">
      <div className="section-head">
        <div className="section-eyebrow">Preguntas frecuentes</div>
        <h2 className="section-h2">Las dudas que frenan la decisión.</h2>
        <p className="section-sub">Respuestas directas, sin marketing.</p>
      </div>
      <div className="faq-list">
        {items.map((item, i) => (
          <div key={i} className={`faq-item${open === i ? " is-open" : ""}`}>
            <button className="faq-q" onClick={() => toggle(i)} aria-expanded={open === i}>
              <span>{item.q}</span>
              <span className="faq-chevron" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </button>
            <div className="faq-a" aria-hidden={open !== i}>
              <div className="faq-a-inner">{item.a}</div>
            </div>
          </div>
        ))}
      </div>
    </section>);
}

/* ─── App root ─── */
function App() {
  const [country, setCountry] = useState(() => {
    // Sync best-guess at first paint (URL → cookie → default AR).
    return getQueryCountry() || getCookie(COOKIE_NAME) || "AR";
  });

  // Async IP detect if there's no explicit choice yet.
  useEffect(() => {
    if (getQueryCountry() || getCookie(COOKIE_NAME)) return;
    (async () => {
      const cc = await ipDetect();
      if (cc && !getCookie(COOKIE_NAME)) {
        setCountry(cc);
        setCookie(COOKIE_NAME, cc, COOKIE_DAYS);
      }
    })();
  }, []);

  const onSetCountry = useCallback((c) => {
    setCountry(c);
    setCookie(COOKIE_NAME, c, COOKIE_DAYS);
    // Reflect in URL (without reload) so links can be shared.
    const u = new URL(window.location.href);
    u.searchParams.set("country", c);
    window.history.replaceState({}, "", u.toString());
  }, []);

  const data = window.CONTENT[country];

  // WA prefill builder bound to current country
  const waPrefill = useCallback((service) => {
    const txt = data.wa.prefill(service);
    const phone = data.wa.phone.replace(/[^0-9]/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(txt)}`;
  }, [data, country]);

  return (
    <>
      <Topbar country={country} setCountry={onSetCountry} services={data.services} />
      <main className="page">
        <Hero data={data} country={country} waPrefill={waPrefill} />
        <TrustBar data={data} country={country} />
        <DemosShowcase data={data} country={country} />
        <Process waPrefill={waPrefill} />
        <LeadMagnet data={data} country={country} />
        <WaCta data={data} country={country} waPrefill={waPrefill} />
        <FAQ />
        <Footer data={data} country={country} />
      </main>
    </>);

}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);