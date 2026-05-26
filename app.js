(() => {
  const { useState, useEffect, useRef, useCallback, useMemo } = React;
  const COOKIE_NAME = "roker_country";
  const COOKIE_DAYS = 30;
  function getCookie(name) {
    const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return m ? decodeURIComponent(m[1]) : null;
  }
  function setCookie(name, val, days) {
    const exp = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(val)}; expires=${exp}; path=/; SameSite=Lax`;
  }
  function getQueryCountry() {
    const p = new URLSearchParams(window.location.search);
    const c = (p.get("country") || "").toUpperCase();
    return ["AR", "PY"].includes(c) ? c : null;
  }
  async function ipDetect() {
    try {
      const ctrl = new AbortController();
      const to = setTimeout(() => ctrl.abort(), 2e3);
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
    return /* @__PURE__ */ React.createElement("span", { ref: wrapRef, className: "mag-wrap", onMouseMove: onMove, onMouseLeave: onLeave, ...rest }, /* @__PURE__ */ React.createElement("span", { ref: innerRef, className: "mag-inner" }, children));
  }
  function Topbar({ country, setCountry, services }) {
    return /* @__PURE__ */ React.createElement("header", { className: "topbar" }, /* @__PURE__ */ React.createElement("div", { className: "topbar-brand" }, /* @__PURE__ */ React.createElement("span", { className: "dot" }), "ROKER ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--crimson-500)" } }, "LABS")), /* @__PURE__ */ React.createElement("nav", { className: "topbar-nav" }, /* @__PURE__ */ React.createElement("a", { href: "#servicios" }, "Sistemas"), /* @__PURE__ */ React.createElement("a", { href: "#analisis" }, "An\xE1lisis gratis"), /* @__PURE__ */ React.createElement("a", { href: "#contacto" }, "Contacto")), /* @__PURE__ */ React.createElement("div", { className: "topbar-spacer" }), /* @__PURE__ */ React.createElement(QuickLaunch, { services }), /* @__PURE__ */ React.createElement(CountrySwitch, { country, setCountry }), /* @__PURE__ */ React.createElement(MagneticButton, { strength: 0.25 }, /* @__PURE__ */ React.createElement("a", { className: "btn btn--primary btn--pulse", href: "#contacto" }, "Agendar demo ", /* @__PURE__ */ React.createElement(TechIcon, { name: "arrow-right", size: 16 }))));
  }
  function CountrySwitch({ country, setCountry }) {
    return /* @__PURE__ */ React.createElement("div", { className: "country-switch", role: "group", "aria-label": "Seleccionar pa\xEDs" }, ["AR", "PY"].map(
      (c) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: c,
          className: country === c ? "is-active" : "",
          onClick: () => setCountry(c),
          "aria-pressed": country === c,
          title: c === "AR" ? "Argentina" : "Paraguay"
        },
        /* @__PURE__ */ React.createElement("span", { className: "flag" }, c === "AR" ? "\u{1F1E6}\u{1F1F7}" : "\u{1F1F5}\u{1F1FE}"),
        c
      )
    ));
  }
  function QuickLaunch({ services }) {
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const cats = window.CATEGORIES;
    const filtered = useMemo(() => {
      const q = filter.trim().toLowerCase();
      return services.filter(
        (s) => !q || s.title.toLowerCase().includes(q) || (s.tag || "").toLowerCase().includes(q) || s.id.includes(q)
      );
    }, [services, filter]);
    const grouped = useMemo(() => {
      const map = {};
      cats.forEach((c) => {
        map[c.id] = [];
      });
      filtered.forEach((s) => {
        (map[s.cat] = map[s.cat] || []).push(s);
      });
      return cats.map((c) => ({ ...c, items: map[c.id] || [] })).filter((c) => c.items.length);
    }, [filtered, cats]);
    const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);
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
          if (item && item.demoUrl) window.open(item.demoUrl, "_blank");
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, [open, flat, activeIdx]);
    useEffect(() => {
      if (open) {
        setFilter("");
        setActiveIdx(0);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }, [open]);
    useEffect(() => {
      setActiveIdx(0);
    }, [filter]);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: `ql-trigger ${open ? "is-open" : ""}`,
        onClick: () => setOpen((o) => !o),
        title: "Modo vendedor (\u2318K)"
      },
      /* @__PURE__ */ React.createElement("span", { className: "ql-grid", "aria-hidden": "true" }, [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => /* @__PURE__ */ React.createElement("span", { key: i }))),
      /* @__PURE__ */ React.createElement("span", { className: "ql-trigger-label" }, "Demos"),
      /* @__PURE__ */ React.createElement("span", { className: "ql-kbd" }, "\u2318K")
    ), open && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "ql-backdrop", onClick: () => setOpen(false) }), /* @__PURE__ */ React.createElement("div", { className: "ql-panel", role: "dialog", "aria-label": "Lanzador de demos" }, /* @__PURE__ */ React.createElement("div", { className: "ql-search" }, /* @__PURE__ */ React.createElement(TechIcon, { name: "search", size: 18 }), /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: inputRef,
        value: filter,
        onChange: (e) => setFilter(e.target.value),
        placeholder: "Buscar sistema \xB7 POS, Dashboard, SIFEN..."
      }
    ), /* @__PURE__ */ React.createElement("span", { className: "ql-kbd ql-kbd--inline" }, "esc")), /* @__PURE__ */ React.createElement("div", { className: "ql-list", ref: listRef }, grouped.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "ql-empty" }, "Sin resultados para \xAB", filter, "\xBB"), grouped.map(
      (g) => /* @__PURE__ */ React.createElement("div", { className: "ql-group", key: g.id }, /* @__PURE__ */ React.createElement("div", { className: "ql-group-head" }, /* @__PURE__ */ React.createElement(TechIcon, { name: g.icon, size: 12 }), g.label, /* @__PURE__ */ React.createElement("span", { className: "ql-group-count" }, g.items.length)), g.items.map((s) => {
        const flatIdx = flat.indexOf(s);
        const isActive = flatIdx === activeIdx;
        return /* @__PURE__ */ React.createElement(
          "a",
          {
            key: s.id,
            href: s.demoUrl || "#",
            target: "_blank",
            rel: "noopener noreferrer",
            className: `ql-item ${isActive ? "is-active" : ""}`,
            onMouseEnter: () => setActiveIdx(flatIdx),
            onClick: () => setOpen(false)
          },
          /* @__PURE__ */ React.createElement("span", { className: "ql-item-icon" }, /* @__PURE__ */ React.createElement(TechIcon, { name: s.icon, size: 16 })),
          /* @__PURE__ */ React.createElement("span", { className: "ql-item-body" }, /* @__PURE__ */ React.createElement("span", { className: "ql-item-title" }, s.title), /* @__PURE__ */ React.createElement("span", { className: "ql-item-url" }, (s.demoUrl || "").replace("https://", ""))),
          s.tag && /* @__PURE__ */ React.createElement("span", { className: `ql-item-tag${s.tagPY ? " is-py" : ""}` }, s.tag),
          /* @__PURE__ */ React.createElement("span", { className: "ql-item-launch" }, /* @__PURE__ */ React.createElement(TechIcon, { name: "arrow-right", size: 14 }))
        );
      }))
    )), /* @__PURE__ */ React.createElement("div", { className: "ql-foot" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "ql-kbd ql-kbd--inline" }, "\u2191\u2193"), " navegar"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "ql-kbd ql-kbd--inline" }, "\u21B5"), " lanzar"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("span", { className: "ql-kbd ql-kbd--inline" }, "esc"), " cerrar"), /* @__PURE__ */ React.createElement("span", { className: "ql-foot-spacer" }), /* @__PURE__ */ React.createElement("span", { className: "ql-foot-meta" }, flat.length, " sistemas activos")))));
  }
  function Hero({ data, country, waPrefill }) {
    const h = data.hero;
    return /* @__PURE__ */ React.createElement("section", { className: "hero", id: "top" }, /* @__PURE__ */ React.createElement("div", { className: "flow-blob flow-blob--cta" }), /* @__PURE__ */ React.createElement("div", { className: "hero-text", "data-country-content": true, key: "hero-" + country }, /* @__PURE__ */ React.createElement("span", { className: "hero-eyebrow" }, /* @__PURE__ */ React.createElement("span", { className: "pulse-dot" }), h.eyebrowDot), /* @__PURE__ */ React.createElement("h1", { className: "hero-h1" }, h.h1Pre, " ", /* @__PURE__ */ React.createElement("span", { className: "strike" }, h.h1Strike), " ", h.h1Post, " ", /* @__PURE__ */ React.createElement("span", { className: "accent" }, h.h1Accent)), /* @__PURE__ */ React.createElement("p", { className: "hero-sub" }, h.sub), /* @__PURE__ */ React.createElement("div", { className: "hero-ctas" }, /* @__PURE__ */ React.createElement(MagneticButton, { strength: 0.3 }, /* @__PURE__ */ React.createElement("a", { className: "btn btn--lg btn--primary btn--pulse", href: waPrefill("una demo de tus sistemas") }, h.cta1, " ", /* @__PURE__ */ React.createElement(TechIcon, { name: "arrow-right", size: 18 }))), /* @__PURE__ */ React.createElement("a", { className: "btn btn--lg btn--ghost", href: "#servicios" }, h.cta2)), /* @__PURE__ */ React.createElement("div", { className: "hero-meta" }, h.kpis.map(
      (k, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, i > 0 && /* @__PURE__ */ React.createElement("span", { className: "dot-sep" }, "\xB7"), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--fg-0)", fontWeight: 700, marginRight: 6 } }, k.v), k.l))
    ))), /* @__PURE__ */ React.createElement(HeroVisual, { country }));
  }
  function HeroVisual({ country }) {
    return /* @__PURE__ */ React.createElement("div", { className: "hero-visual", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("div", { className: "hero-mock hero-mock--pos" }, /* @__PURE__ */ React.createElement("div", { style: { height: 280, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { className: "device-bar", style: { height: 26, padding: "0 12px", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 5, boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.04)" } }, /* @__PURE__ */ React.createElement("span", { className: "traffic", style: { width: 9, height: 9, borderRadius: "50%", background: "#FF5F57" } }), /* @__PURE__ */ React.createElement("span", { className: "traffic", style: { width: 9, height: 9, borderRadius: "50%", background: "#FEBC2E" } }), /* @__PURE__ */ React.createElement("span", { className: "traffic", style: { width: 9, height: 9, borderRadius: "50%", background: "#28C840" } }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, marginLeft: 12, height: 16, borderRadius: 5, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", padding: "0 10px", fontSize: 10, color: "var(--fg-4)", fontFamily: "var(--font-mono)" } }, country === "PY" ? "pos.demo.rokerlabs.com.py/mostrador" : "pos.demo.rokerlabs.com.ar/mostrador"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, color: "var(--fg-4)", letterSpacing: "0.04em" } }, "Caja \xB7 Lu")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minHeight: 0 } }, /* @__PURE__ */ React.createElement(PosMock, { country })))), /* @__PURE__ */ React.createElement("div", { className: "hero-mock hero-mock--dash" }, /* @__PURE__ */ React.createElement("div", { style: { height: 220, display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { height: 22, padding: "0 10px", background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", gap: 8, fontSize: 10, color: "var(--fg-3)", fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase", boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.04)" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--crimson-500)", boxShadow: "0 0 6px var(--crimson-500)" } }), "Dashboard \xB7 14:32", /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", color: "var(--ok-400)" } }, "\u25CF Live")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minHeight: 0 } }, /* @__PURE__ */ React.createElement(DashMock, { country })))), /* @__PURE__ */ React.createElement("div", { className: "hero-mock--chip" }, /* @__PURE__ */ React.createElement("div", { className: "toast" }, /* @__PURE__ */ React.createElement("span", { className: "toast-dot" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "var(--fg-1)" } }, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--fg-0)", fontWeight: 600 } }, "+12 ventas"), " en la \xFAltima hora"))));
  }
  function TrustBar({ data, country }) {
    return /* @__PURE__ */ React.createElement("section", { className: "trust", key: "trust-" + country, "data-country-content": true }, /* @__PURE__ */ React.createElement("span", { className: "trust-label" }, data.trust.label), /* @__PURE__ */ React.createElement("div", { className: "trust-list" }, data.trust.items.map(
      (it, i) => /* @__PURE__ */ React.createElement("span", { className: "trust-item", key: it.name + i }, /* @__PURE__ */ React.createElement("span", { className: "mark", style: { "--accent": it.color } }, it.initial), /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("strong", { style: { color: "var(--fg-1)", fontWeight: 600 } }, it.name), " ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-4)" } }, "\xB7 ", it.city)))
    )), /* @__PURE__ */ React.createElement("div", { className: "trust-stats" }, data.trust.stats.map(
      (s, i) => /* @__PURE__ */ React.createElement("div", { className: "trust-stat", key: i }, /* @__PURE__ */ React.createElement("span", { className: "v" }, s.v), /* @__PURE__ */ React.createElement("span", { className: "l" }, s.l))
    )));
  }
  function Bento({ data, country, bankList, waPrefill }) {
    const tabs = window.CATEGORIES;
    const [tab, setTab] = useState(tabs[0].id);
    const counts = useMemo(() => {
      const c = {};
      tabs.forEach((t) => {
        c[t.id] = data.services.filter((s) => s.cat === t.id).length;
      });
      return c;
    }, [data, tabs]);
    const visible = data.services.filter((s) => s.cat === tab);
    const active = tabs.find((t) => t.id === tab) || tabs[0];
    const total = data.services.length;
    return /* @__PURE__ */ React.createElement("section", { className: "section", id: "servicios" }, /* @__PURE__ */ React.createElement("div", { className: "section-head", "data-country-content": true, key: "head-" + country }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, data.bento.eyebrow), /* @__PURE__ */ React.createElement("h2", { className: "section-h2" }, data.bento.h2), /* @__PURE__ */ React.createElement("p", { className: "section-sub" }, data.bento.sub)), /* @__PURE__ */ React.createElement("div", { className: "tabs-row" }, /* @__PURE__ */ React.createElement("div", { className: "tab-shell", role: "tablist" }, tabs.map(
      (t) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: t.id,
          role: "tab",
          "aria-selected": tab === t.id,
          className: `tab ${tab === t.id ? "is-active" : ""}`,
          onClick: () => setTab(t.id)
        },
        t.short,
        /* @__PURE__ */ React.createElement("span", { className: "count" }, counts[t.id] || 0)
      )
    )), /* @__PURE__ */ React.createElement("span", { className: "tab-meta" }, /* @__PURE__ */ React.createElement("strong", null, visible.length), " de ", /* @__PURE__ */ React.createElement("strong", null, total), " servicios \xB7 ", country === "PY" ? "Paraguay" : "Argentina")), /* @__PURE__ */ React.createElement("p", { className: "tab-desc", key: "tabdesc-" + tab + "-" + country }, active.desc), /* @__PURE__ */ React.createElement("div", { className: "bento bento--tabbed cascade", key: "bento-" + country + "-" + tab }, visible.map(
      (s) => /* @__PURE__ */ React.createElement(
        ServiceCell,
        {
          key: s.id,
          svc: { ...s, size: tabbedSize(s) },
          country,
          bankList,
          waPrefill
        }
      )
    )));
  }
  function tabbedSize(svc) {
    if (svc.mock === "pos" || svc.mock === "dash") return "w3 h2";
    if (svc.id === "mp" || svc.id === "billeteras") return "w3 h2";
    return "w3";
  }
  function ServiceCell({ svc, country, bankList, waPrefill }) {
    const sizeClasses = (svc.size || "w2").split(" ").map((s) => `cell--${s}`).join(" ");
    const hasPhoto = !!svc.bgImage;
    const [revealed, setRevealed] = useState(false);
    const onCardClick = (e) => {
      if (e.target.closest("a, button")) return;
      setRevealed((r) => !r);
    };
    const launchHref = svc.demoUrl || waPrefill(svc.title);
    const launchInNewTab = !!svc.demoUrl;
    return /* @__PURE__ */ React.createElement(
      "article",
      {
        className: `cell ${sizeClasses}${svc.brand ? " cell--brand" : ""}${hasPhoto ? " cell--photo" : ""}${revealed ? " is-revealed" : ""}`,
        onClick: onCardClick
      },
      hasPhoto && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "cell-bg",
          style: { backgroundImage: `${svc.bgMood ? svc.bgMood + ", " : ""}url("${svc.bgImage}")` },
          "aria-hidden": "true"
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "cell-bg-overlay", "aria-hidden": "true" })),
      /* @__PURE__ */ React.createElement("div", { className: "cell-head" }, /* @__PURE__ */ React.createElement("span", { className: "cell-icon" }, /* @__PURE__ */ React.createElement(TechIcon, { name: svc.icon, size: 20 })), /* @__PURE__ */ React.createElement("span", { className: "cell-live-badge", "aria-hidden": "true" }, /* @__PURE__ */ React.createElement("span", { className: "ld" }), " LIVE"), svc.tag && /* @__PURE__ */ React.createElement("span", { className: `cell-tag${svc.tagPY ? " cell-tag--py" : svc.isNew ? " cell-tag--new" : ""}` }, svc.isNew ? "Nuevo \xB7 " : "", svc.tag)),
      /* @__PURE__ */ React.createElement("h3", { className: "cell-title" }, svc.title),
      /* @__PURE__ */ React.createElement("div", { className: "cell-body" }, /* @__PURE__ */ React.createElement("p", { className: "cell-desc" }, svc.desc), /* @__PURE__ */ React.createElement("div", { className: "cell-live", "aria-hidden": !revealed }, /* @__PURE__ */ React.createElement(LivePreview, { svc, country, bankList }))),
      /* @__PURE__ */ React.createElement("div", { className: "cell-launch-wrap" }, svc.price && /* @__PURE__ */ React.createElement("span", { className: "cell-price" }, svc.price, svc.priceNote && /* @__PURE__ */ React.createElement("em", null, " \xB7 ", svc.priceNote)), /* @__PURE__ */ React.createElement(
        "a",
        {
          className: "launch-btn",
          href: launchHref,
          target: launchInNewTab ? "_blank" : void 0,
          rel: launchInNewTab ? "noopener noreferrer" : void 0
        },
        "Lanzar sistema en vivo",
        /* @__PURE__ */ React.createElement("span", { className: "launch-arrow", "aria-hidden": "true" }, "\u2197")
      ))
    );
  }
  function LivePreview({ svc, country, bankList }) {
    if (svc.mock === "pos") return /* @__PURE__ */ React.createElement(PosLive, { country, svc });
    if (svc.mock === "dash") return /* @__PURE__ */ React.createElement(DashLive, { country, svc });
    if (svc.mock === "chat") return /* @__PURE__ */ React.createElement(ChatLive, { country, svc });
    if (svc.mock === "catalog") return /* @__PURE__ */ React.createElement(CatalogLive, { svc });
    if (svc.id === "mp" || svc.id === "billeteras") return /* @__PURE__ */ React.createElement(BankLive, { bankList, svc });
    return /* @__PURE__ */ React.createElement(ConsoleLive, { svc, country });
  }
  function liveFrame(host, children) {
    return /* @__PURE__ */ React.createElement("div", { className: "live-frame" }, /* @__PURE__ */ React.createElement("div", { className: "device-bar" }, /* @__PURE__ */ React.createElement("span", { className: "traffic" }), /* @__PURE__ */ React.createElement("span", { className: "traffic" }), /* @__PURE__ */ React.createElement("span", { className: "traffic" }), /* @__PURE__ */ React.createElement("span", { className: "url" }, host), /* @__PURE__ */ React.createElement("span", { className: "device-live" }, /* @__PURE__ */ React.createElement("span", { className: "ld" }), " LIVE")), /* @__PURE__ */ React.createElement("div", { className: "live-body" }, children));
  }
  function PosLive({ country, svc }) {
    return liveFrame(country === "PY" ? "pos.demo.rokerlabs.com.py" : "pos.demo.rokerlabs.com.ar", /* @__PURE__ */ React.createElement(PosMock, { country }));
  }
  function DashLive({ country, svc }) {
    return liveFrame("dashboard.rokerlabs.com", /* @__PURE__ */ React.createElement(DashMock, { country }));
  }
  function ChatLive({ country, svc }) {
    return liveFrame("atajo-ia.rokerlabs.com", /* @__PURE__ */ React.createElement(ChatMock, { country }));
  }
  function CatalogLive({ svc }) {
    return liveFrame("tienda.rokerlabs.com", /* @__PURE__ */ React.createElement(CatalogMock, null));
  }
  function ConsoleLive({ svc, country }) {
    return liveFrame(svc.id + ".rokerlabs.com", /* @__PURE__ */ React.createElement(ConsoleMock, { service: svc, country }));
  }
  function BankLive({ bankList, svc }) {
    return liveFrame(
      svc.id + ".rokerlabs.com",
      /* @__PURE__ */ React.createElement("div", { className: "bank-grid bank-grid--live" }, bankList.map((b) => {
        const c = bankColor(b);
        return /* @__PURE__ */ React.createElement("div", { className: "bank-chip", key: b, style: {
          background: `linear-gradient(135deg, ${hexAlpha(c, 0.22)} 0%, ${hexAlpha(c, 0.02)} 70%), rgba(255,255,255,0.025)`,
          ["--bank-accent"]: c
        } }, /* @__PURE__ */ React.createElement("div", { className: "top" }, /* @__PURE__ */ React.createElement("span", { className: "swatch", style: { background: c, boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.18), 0 0 10px -2px ${c}` } }), /* @__PURE__ */ React.createElement("span", { className: "name" }, b)), /* @__PURE__ */ React.createElement("span", { className: "meta" }, bankMeta(b)));
      }))
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
      "Galicia": "Tarjetas \xB7 QR",
      "Santander": "Tarjetas \xB7 QR",
      "BBVA": "Tarjetas \xB7 QR",
      "Mercado Pago": "QR \xB7 link \xB7 point",
      "Bancard": "POS \xB7 QR",
      "Tigo Money": "Billetera \xB7 QR",
      "Personal Pay": "Billetera \xB7 QR",
      "Wally": "Billetera \xB7 QR"
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
  function LeadMagnet({ data, country }) {
    const lm = data.leadMagnet;
    const [fileName, setFileName] = useState(null);
    const inputRef = useRef(null);
    return /* @__PURE__ */ React.createElement("section", { className: "section", id: "analisis" }, /* @__PURE__ */ React.createElement("div", { className: "lead-magnet", "data-country-content": true, key: "lm-" + country }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, "An\xE1lisis gratuito \xB7 48hs"), /* @__PURE__ */ React.createElement("h2", { className: "lead-h" }, lm.h, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", null, lm.hAccent)), /* @__PURE__ */ React.createElement("p", { className: "lead-sub" }, lm.sub), /* @__PURE__ */ React.createElement("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 10, color: "var(--fg-2)", fontSize: 14 } }, [
      "Top 20 SKUs por margen y rotaci\xF3n",
      "Outliers de precio \xB7 sobrestock \xB7 faltantes",
      "1 recomendaci\xF3n de automatizaci\xF3n concreta"
    ].map(
      (t) => /* @__PURE__ */ React.createElement("li", { key: t, style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: 999, background: "var(--ok-soft)", color: "var(--ok-400)", boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.30)" } }, /* @__PURE__ */ React.createElement(TechIcon, { name: "check", size: 12 })), t)
    ))), /* @__PURE__ */ React.createElement("form", { className: "lead-form", onSubmit: (e) => e.preventDefault() }, /* @__PURE__ */ React.createElement(
      "input",
      {
        ref: inputRef,
        type: "file",
        accept: ".xlsx,.xls,.csv",
        style: { display: "none" },
        onChange: (e) => setFileName(e.target.files?.[0]?.name || null)
      }
    ), /* @__PURE__ */ React.createElement("div", { className: "dropzone", onClick: () => inputRef.current?.click() }, /* @__PURE__ */ React.createElement("span", { className: "ico" }, /* @__PURE__ */ React.createElement(TechIcon, { name: "arrow-up", size: 22 })), /* @__PURE__ */ React.createElement("span", { className: "hint" }, /* @__PURE__ */ React.createElement("strong", null, fileName || "Arrastr\xE1 tu Excel ac\xE1"), " ", !fileName && /* @__PURE__ */ React.createElement("span", { style: { color: "var(--fg-4)" } }, "o toc\xE1 para elegir archivo")), /* @__PURE__ */ React.createElement("span", { className: "sub" }, lm.hint)), /* @__PURE__ */ React.createElement("div", { className: "field", style: { marginTop: 4 } }, /* @__PURE__ */ React.createElement(TechIcon, { name: "user", size: 16 }), /* @__PURE__ */ React.createElement("input", { placeholder: "Nombre + email \xB7 WhatsApp si prefer\xEDs" })), /* @__PURE__ */ React.createElement(MagneticButton, { strength: 0.25 }, /* @__PURE__ */ React.createElement("button", { type: "submit", className: "btn btn--primary btn--lg btn--pulse", style: { width: "100%", justifyContent: "center" } }, lm.cta, " ", /* @__PURE__ */ React.createElement(TechIcon, { name: "arrow-right", size: 18 }))))));
  }
  function WaCta({ data, country, waPrefill }) {
    return /* @__PURE__ */ React.createElement("section", { className: "wa-cta", id: "contacto", "data-country-content": true, key: "wa-" + country }, /* @__PURE__ */ React.createElement("div", { className: "wa-card" }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, "Contacto directo"), /* @__PURE__ */ React.createElement("h2", { className: "wa-h" }, data.wa.h), /* @__PURE__ */ React.createElement("p", { className: "wa-sub" }, data.wa.sub), /* @__PURE__ */ React.createElement(MagneticButton, { strength: 0.25 }, /* @__PURE__ */ React.createElement("a", { className: "btn--wa", href: waPrefill() }, /* @__PURE__ */ React.createElement(TechIcon, { name: "whatsapp", size: 20 }), data.wa.btn)), /* @__PURE__ */ React.createElement("p", { style: { marginTop: 16, fontSize: 12, color: "var(--fg-4)", letterSpacing: "0.02em" } }, data.wa.phone, " \xB7 respondo en horario de oficina \xB7 espa\xF1ol rioplatense")), /* @__PURE__ */ React.createElement("div", { className: "glass", style: { padding: 28, display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { className: "section-eyebrow" }, "C\xF3mo trabajamos"), [
      { n: "01", t: "Llamada de 25 min", d: "Vemos tu operaci\xF3n actual y los puntos de fricci\xF3n." },
      { n: "02", t: "Prototipo en 48hs", d: "Un mock funcional con tus datos reales. Sin contratos todav\xEDa." },
      { n: "03", t: "Implementaci\xF3n en 30 d\xEDas", d: "Sistema en producci\xF3n, capacitaci\xF3n al equipo, soporte directo." }
    ].map(
      (step) => /* @__PURE__ */ React.createElement("div", { key: step.n, style: { display: "flex", gap: 14, alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("span", { style: {
        flexShrink: 0,
        width: 38,
        height: 38,
        borderRadius: 10,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.05)",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)",
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: "var(--fg-2)",
        fontVariantNumeric: "tabular-nums"
      } }, step.n), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { style: { margin: 0, fontSize: 15, fontWeight: 600, color: "var(--fg-0)", letterSpacing: "-0.01em" } }, step.t), /* @__PURE__ */ React.createElement("p", { style: { margin: "2px 0 0", fontSize: 13, color: "var(--fg-3)", lineHeight: 1.5 } }, step.d)))
    )));
  }
  function Footer({ data, country }) {
    return /* @__PURE__ */ React.createElement("footer", { className: "footer", "data-country-content": true, key: "foot-" + country }, /* @__PURE__ */ React.createElement("div", { className: "col" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: "radial-gradient(circle at 30% 30%, var(--crimson-400), var(--crimson-700))", boxShadow: "0 0 12px var(--crimson-500)" } }), /* @__PURE__ */ React.createElement("strong", { style: { fontWeight: 900, letterSpacing: "-0.04em", fontSize: 18, color: "var(--fg-0)" } }, "ROKER ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--crimson-500)" } }, "LABS"))), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--fg-2)", fontSize: 13, lineHeight: 1.55, maxWidth: "36ch" } }, data.footer.tagline), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--fg-4)", fontSize: 11, marginTop: 12 } }, data.footer.address), /* @__PURE__ */ React.createElement("p", { style: { color: "var(--fg-4)", fontSize: 11 } }, data.footer.cuit)), /* @__PURE__ */ React.createElement("div", { className: "col" }, /* @__PURE__ */ React.createElement("h4", null, "Servicios"), /* @__PURE__ */ React.createElement("a", { href: "#servicios" }, "Sistemas POS"), /* @__PURE__ */ React.createElement("a", { href: "#servicios" }, "Dashboards"), /* @__PURE__ */ React.createElement("a", { href: "#servicios" }, "Automatizaciones IA"), /* @__PURE__ */ React.createElement("a", { href: "#servicios" }, "Cat\xE1logos web"), country === "PY" && /* @__PURE__ */ React.createElement("a", { href: "#servicios" }, "Facturaci\xF3n SIFEN")), /* @__PURE__ */ React.createElement("div", { className: "col" }, /* @__PURE__ */ React.createElement("h4", null, "Recursos"), /* @__PURE__ */ React.createElement("a", { href: "#analisis" }, "An\xE1lisis gratis 48hs"), /* @__PURE__ */ React.createElement("a", { href: "#servicios" }, "Demos en vivo"), /* @__PURE__ */ React.createElement("a", { href: "#contacto" }, "Agendar demo")), /* @__PURE__ */ React.createElement("div", { className: "col" }, /* @__PURE__ */ React.createElement("h4", null, "Contacto"), /* @__PURE__ */ React.createElement("a", { href: "#contacto" }, "WhatsApp directo"), /* @__PURE__ */ React.createElement("a", { href: "mailto:sergio@rokerlabs.com" }, "sergio@rokerlabs.com"), /* @__PURE__ */ React.createElement("a", { href: "#contacto" }, "Tandil \xB7 BA \xB7 Argentina")), /* @__PURE__ */ React.createElement("div", { className: "footer-bottom", style: { gridColumn: "1 / -1" } }, /* @__PURE__ */ React.createElement("span", null, "\xA9 2026 Roker Labs \xB7 Sergio Roker"), /* @__PURE__ */ React.createElement("span", null, "Hecho a mano en ", country === "PY" ? "Tandil \u{1F1E6}\u{1F1F7} \xB7 trabajando con PY \u{1F1F5}\u{1F1FE}" : "Tandil, Buenos Aires")));
  }
  function App() {
    const [country, setCountry] = useState(() => {
      return getQueryCountry() || getCookie(COOKIE_NAME) || "AR";
    });
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
      const u = new URL(window.location.href);
      u.searchParams.set("country", c);
      window.history.replaceState({}, "", u.toString());
    }, []);
    const data = window.CONTENT[country];
    const waPrefill = useCallback((service) => {
      const txt = data.wa.prefill(service);
      const phone = data.wa.phone.replace(/[^0-9]/g, "");
      return `https://wa.me/${phone}?text=${encodeURIComponent(txt)}`;
    }, [data, country]);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Topbar, { country, setCountry: onSetCountry, services: data.services }), /* @__PURE__ */ React.createElement("main", { className: "page" }, /* @__PURE__ */ React.createElement(Hero, { data, country, waPrefill }), /* @__PURE__ */ React.createElement(TrustBar, { data, country }), /* @__PURE__ */ React.createElement(Bento, { data, country, bankList: data.bankList, waPrefill }), /* @__PURE__ */ React.createElement(LeadMagnet, { data, country }), /* @__PURE__ */ React.createElement(WaCta, { data, country, waPrefill }), /* @__PURE__ */ React.createElement(Footer, { data, country })));
  }
  ReactDOM.createRoot(document.getElementById("root")).render(/* @__PURE__ */ React.createElement(App, null));
})();
