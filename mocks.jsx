/* global React */
/* ─── Product mocks — small, in-bento UI previews ─── */

const { useEffect, useRef, useState } = React;

/* Helper to render a tech-hero icon at a given size */
function TechIcon({ name, size = 20, className = "", style }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.Icons) return;
    ref.current.innerHTML = window.Icons.svg(name, { size, class: className });
  }, [name, size, className]);
  return <span ref={ref} style={{ display: "inline-flex", ...(style || {}) }} aria-hidden="true" />;
}

/* ─── POS mock ─── */
function PosMock({ country }) {
  const symbol = "USD";
  const products = country === "PY"
    ? [
        { i: "phone",   n: "iPhone 13 Pro · 128GB",   p: "1.090" },
        { i: "battery", n: "Bat. iPhone 12 OEM",       p: "32" },
        { i: "screen",  n: "Display Samsung A54",     p: "78" },
        { i: "cable",   n: "Cable Type-C 1m",          p: "4" },
      ]
    : [
        { i: "phone",   n: "Samsung A15 · 128GB",     p: "245.300" },
        { i: "battery", n: "Bat. iPhone 12 OEM",       p: "38.900" },
        { i: "screen",  n: "Display Moto G54",        p: "62.500" },
        { i: "cable",   n: "Cable Type-C 1m",          p: "4.200" },
      ];
  const total = country === "PY" ? "USD 1.204" : "$ 350.900";
  const change = country === "PY" ? "Vuelto · USD 0" : "Vuelto · $ 0";

  return (
    <div className="pos-mock">
      <div className="pos-pane">
        <h5>Buscar artículo</h5>
        <div style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 6, background: "rgba(0,0,0,0.25)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)", fontSize: 10, color: "var(--fg-4)" }}>
          <TechIcon name="search" size={12} />
          <span>display samsung a5…</span>
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-5)" }}>F2</span>
        </div>
        {products.map((p) => (
          <div className="pos-product" key={p.n}>
            <span className="ico"><TechIcon name={p.i} size={12} /></span>
            <span className="name">{p.n}</span>
            <span className="price">{p.p}</span>
          </div>
        ))}
      </div>
      <div className="pos-pane pos-cart">
        <h5>Venta #4821</h5>
        <div className="line"><span>Display Moto G54 ×1</span><span>{country === "PY" ? "USD 78" : "$ 62.500"}</span></div>
        <div className="line"><span>Bat. iPhone 12 ×2</span><span>{country === "PY" ? "USD 64" : "$ 77.800"}</span></div>
        <div className="line"><span>Cable Type-C ×3</span><span>{country === "PY" ? "USD 12" : "$ 12.600"}</span></div>
        <div className="line"><span>iPhone 13 Pro ×1</span><span>{country === "PY" ? "USD 1.090" : "$ 245.300"}</span></div>
        <div className="total">
          <span><div className="l">Total · {symbol}</div><div className="v">{total}</div></span>
          <span style={{ fontSize: 9, color: "var(--fg-4)", textAlign: "right" }}>{change}</span>
        </div>
        <div className="pay">Cobrar →</div>
      </div>
    </div>
  );
}

/* ─── Dashboard mock ─── */
function DashMock({ country }) {
  const heights = [42, 58, 35, 72, 51, 88, 64, 95, 76, 82, 67, 100];
  const kpis = country === "PY"
    ? [
        { l: "Ventas hoy", v: "USD 8.412", d: "+12.4%", up: true },
        { l: "Stock crítico", v: "23", d: "-4", up: true },
        { l: "Cta. cte.", v: "USD 22k", d: "+2.1k", up: false },
      ]
    : [
        { l: "Ventas hoy", v: "$ 2.4M", d: "+12.4%", up: true },
        { l: "Stock crítico", v: "23", d: "-4", up: true },
        { l: "Cta. cte.", v: "$ 6.8M", d: "+520k", up: false },
      ];

  return (
    <div className="dash-mock">
      {kpis.map((k, i) => (
        <div className="dash-kpi" key={i}>
          <div className="l">{k.l}</div>
          <div className="v">{k.v}</div>
          <div className={`d ${k.up ? "up" : "down"}`}>{k.up ? "↗" : "↘"} {k.d}</div>
        </div>
      ))}
      <div className="dash-chart">
        {heights.map((h, i) => (
          <div className="dash-bar" key={i} style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Catalog mock ─── */
function CatalogMock() {
  const items = [
    { ico: "phone", name: "iPhone 13", price: "USD 590" },
    { ico: "battery", name: "Bat. Sams.", price: "USD 28" },
    { ico: "screen", name: "Display A54", price: "USD 78" },
    { ico: "cable", name: "Cable USB-C", price: "USD 4" },
    { ico: "glass", name: "Vidrio temp.", price: "USD 6" },
    { ico: "flex", name: "Flex carga", price: "USD 12" },
  ];
  return (
    <div className="cat-mock">
      {items.map((it, i) => (
        <div className="cat-tile" key={i}>
          <div className="ph"><TechIcon name={it.ico} size={20} /></div>
          <div className="name">{it.name}</div>
          <div className="price">{it.price}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── WhatsApp chat mock ─── */
function ChatMock({ country }) {
  const lines = country === "PY"
    ? [
        { who: "user", t: "Hola, tenés display de A54?" },
        { who: "bot",  t: "Sí, en stock. USD 78. ¿Vidrio templado lo incluyo?" },
        { who: "user", t: "Dale, mandame foto" },
      ]
    : [
        { who: "user", t: "Hola, tenés display de A54?" },
        { who: "bot",  t: "Sí, en stock. $62.500. ¿Vidrio templado lo incluyo?" },
        { who: "user", t: "Dale, mandame foto" },
      ];
  return (
    <div className="chat-mock">
      {lines.map((l, i) => (
        <div className={`chat-bubble ${l.who}`} key={i}>{l.t}</div>
      ))}
      <div className="chat-typing"><span></span><span></span><span></span></div>
    </div>
  );
}

/* ─── Console log mock — for services without a dedicated UI mock.
   Cycles through liveLog lines so the card feels "running". ─── */
function ConsoleMock({ service, country }) {
  const lines = service.liveLog || ["[--:--] sin actividad"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % lines.length), 1700);
    return () => clearInterval(t);
  }, [lines.length]);

  // Show the 4 most recent lines (older fades out)
  const visible = [];
  for (let i = 0; i < 4 && i <= idx; i++) {
    visible.push({ line: lines[(idx - i + lines.length) % lines.length], age: i });
  }

  return (
    <div className="console-mock">
      <div className="console-bar">
        <span className="live-dot" />
        <span className="live-text">LIVE</span>
        <span className="console-host">{service.id}.rokerlabs.com</span>
        <span className="console-clock">{new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
      <div className="console-feed">
        {visible.map((v, i) => (
          <div key={idx + "-" + i} className="console-line" style={{ opacity: 1 - v.age * 0.22, animationDelay: `${i * 40}ms` }}>
            <span className="prompt">›</span> {v.line}
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { PosMock, DashMock, CatalogMock, ChatMock, TechIcon, ConsoleMock });
