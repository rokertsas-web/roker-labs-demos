(() => {
  const { useEffect, useRef, useState } = React;
  function TechIcon({ name, size = 20, className = "", style }) {
    const ref = useRef(null);
    useEffect(() => {
      if (!ref.current || !window.Icons) return;
      ref.current.innerHTML = window.Icons.svg(name, { size, class: className });
    }, [name, size, className]);
    return /* @__PURE__ */ React.createElement("span", { ref, style: { display: "inline-flex", ...style || {} }, "aria-hidden": "true" });
  }
  function PosMock({ country }) {
    const symbol = "USD";
    const products = country === "PY" ? [
      { i: "phone", n: "iPhone 13 Pro \xB7 128GB", p: "1.090" },
      { i: "battery", n: "Bat. iPhone 12 OEM", p: "32" },
      { i: "screen", n: "Display Samsung A54", p: "78" },
      { i: "cable", n: "Cable Type-C 1m", p: "4" }
    ] : [
      { i: "phone", n: "Samsung A15 \xB7 128GB", p: "245.300" },
      { i: "battery", n: "Bat. iPhone 12 OEM", p: "38.900" },
      { i: "screen", n: "Display Moto G54", p: "62.500" },
      { i: "cable", n: "Cable Type-C 1m", p: "4.200" }
    ];
    const total = country === "PY" ? "USD 1.204" : "$ 350.900";
    const change = country === "PY" ? "Vuelto \xB7 USD 0" : "Vuelto \xB7 $ 0";
    return /* @__PURE__ */ React.createElement("div", { className: "pos-mock" }, /* @__PURE__ */ React.createElement("div", { className: "pos-pane" }, /* @__PURE__ */ React.createElement("h5", null, "Buscar art\xEDculo"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 6, display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 6, background: "rgba(0,0,0,0.25)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)", fontSize: 10, color: "var(--fg-4)" } }, /* @__PURE__ */ React.createElement(TechIcon, { name: "search", size: 12 }), /* @__PURE__ */ React.createElement("span", null, "display samsung a5\u2026"), /* @__PURE__ */ React.createElement("span", { style: { marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--fg-5)" } }, "F2")), products.map((p) => /* @__PURE__ */ React.createElement("div", { className: "pos-product", key: p.n }, /* @__PURE__ */ React.createElement("span", { className: "ico" }, /* @__PURE__ */ React.createElement(TechIcon, { name: p.i, size: 12 })), /* @__PURE__ */ React.createElement("span", { className: "name" }, p.n), /* @__PURE__ */ React.createElement("span", { className: "price" }, p.p)))), /* @__PURE__ */ React.createElement("div", { className: "pos-pane pos-cart" }, /* @__PURE__ */ React.createElement("h5", null, "Venta #4821"), /* @__PURE__ */ React.createElement("div", { className: "line" }, /* @__PURE__ */ React.createElement("span", null, "Display Moto G54 \xD71"), /* @__PURE__ */ React.createElement("span", null, country === "PY" ? "USD 78" : "$ 62.500")), /* @__PURE__ */ React.createElement("div", { className: "line" }, /* @__PURE__ */ React.createElement("span", null, "Bat. iPhone 12 \xD72"), /* @__PURE__ */ React.createElement("span", null, country === "PY" ? "USD 64" : "$ 77.800")), /* @__PURE__ */ React.createElement("div", { className: "line" }, /* @__PURE__ */ React.createElement("span", null, "Cable Type-C \xD73"), /* @__PURE__ */ React.createElement("span", null, country === "PY" ? "USD 12" : "$ 12.600")), /* @__PURE__ */ React.createElement("div", { className: "line" }, /* @__PURE__ */ React.createElement("span", null, "iPhone 13 Pro \xD71"), /* @__PURE__ */ React.createElement("span", null, country === "PY" ? "USD 1.090" : "$ 245.300")), /* @__PURE__ */ React.createElement("div", { className: "total" }, /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("div", { className: "l" }, "Total \xB7 ", symbol), /* @__PURE__ */ React.createElement("div", { className: "v" }, total)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 9, color: "var(--fg-4)", textAlign: "right" } }, change)), /* @__PURE__ */ React.createElement("div", { className: "pay" }, "Cobrar \u2192")));
  }
  function DashMock({ country }) {
    const heights = [42, 58, 35, 72, 51, 88, 64, 95, 76, 82, 67, 100];
    const kpis = country === "PY" ? [
      { l: "Ventas hoy", v: "USD 8.412", d: "+12.4%", up: true },
      { l: "Stock cr\xEDtico", v: "23", d: "-4", up: true },
      { l: "Cta. cte.", v: "USD 22k", d: "+2.1k", up: false }
    ] : [
      { l: "Ventas hoy", v: "$ 2.4M", d: "+12.4%", up: true },
      { l: "Stock cr\xEDtico", v: "23", d: "-4", up: true },
      { l: "Cta. cte.", v: "$ 6.8M", d: "+520k", up: false }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "dash-mock" }, kpis.map((k, i) => /* @__PURE__ */ React.createElement("div", { className: "dash-kpi", key: i }, /* @__PURE__ */ React.createElement("div", { className: "l" }, k.l), /* @__PURE__ */ React.createElement("div", { className: "v" }, k.v), /* @__PURE__ */ React.createElement("div", { className: `d ${k.up ? "up" : "down"}` }, k.up ? "\u2197" : "\u2198", " ", k.d))), /* @__PURE__ */ React.createElement("div", { className: "dash-chart" }, heights.map((h, i) => /* @__PURE__ */ React.createElement("div", { className: "dash-bar", key: i, style: { height: `${h}%`, animationDelay: `${i * 60}ms` } }))));
  }
  function CatalogMock() {
    const items = [
      { ico: "phone", name: "iPhone 13", price: "USD 590" },
      { ico: "battery", name: "Bat. Sams.", price: "USD 28" },
      { ico: "screen", name: "Display A54", price: "USD 78" },
      { ico: "cable", name: "Cable USB-C", price: "USD 4" },
      { ico: "glass", name: "Vidrio temp.", price: "USD 6" },
      { ico: "flex", name: "Flex carga", price: "USD 12" }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "cat-mock" }, items.map((it, i) => /* @__PURE__ */ React.createElement("div", { className: "cat-tile", key: i }, /* @__PURE__ */ React.createElement("div", { className: "ph" }, /* @__PURE__ */ React.createElement(TechIcon, { name: it.ico, size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "name" }, it.name), /* @__PURE__ */ React.createElement("div", { className: "price" }, it.price))));
  }
  function ChatMock({ country }) {
    const lines = country === "PY" ? [
      { who: "user", t: "Hola, ten\xE9s display de A54?" },
      { who: "bot", t: "S\xED, en stock. USD 78. \xBFVidrio templado lo incluyo?" },
      { who: "user", t: "Dale, mandame foto" }
    ] : [
      { who: "user", t: "Hola, ten\xE9s display de A54?" },
      { who: "bot", t: "S\xED, en stock. $62.500. \xBFVidrio templado lo incluyo?" },
      { who: "user", t: "Dale, mandame foto" }
    ];
    return /* @__PURE__ */ React.createElement("div", { className: "chat-mock" }, lines.map((l, i) => /* @__PURE__ */ React.createElement("div", { className: `chat-bubble ${l.who}`, key: i }, l.t)), /* @__PURE__ */ React.createElement("div", { className: "chat-typing" }, /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null), /* @__PURE__ */ React.createElement("span", null)));
  }
  function ConsoleMock({ service, country }) {
    const lines = service.liveLog || ["[--:--] sin actividad"];
    const [idx, setIdx] = useState(0);
    useEffect(() => {
      const t = setInterval(() => setIdx((i) => (i + 1) % lines.length), 1700);
      return () => clearInterval(t);
    }, [lines.length]);
    const visible = [];
    for (let i = 0; i < 4 && i <= idx; i++) {
      visible.push({ line: lines[(idx - i + lines.length) % lines.length], age: i });
    }
    return /* @__PURE__ */ React.createElement("div", { className: "console-mock" }, /* @__PURE__ */ React.createElement("div", { className: "console-bar" }, /* @__PURE__ */ React.createElement("span", { className: "live-dot" }), /* @__PURE__ */ React.createElement("span", { className: "live-text" }, "LIVE"), /* @__PURE__ */ React.createElement("span", { className: "console-host" }, service.id, ".rokerlabs.com"), /* @__PURE__ */ React.createElement("span", { className: "console-clock" }, (/* @__PURE__ */ new Date()).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }))), /* @__PURE__ */ React.createElement("div", { className: "console-feed" }, visible.map((v, i) => /* @__PURE__ */ React.createElement("div", { key: idx + "-" + i, className: "console-line", style: { opacity: 1 - v.age * 0.22, animationDelay: `${i * 40}ms` } }, /* @__PURE__ */ React.createElement("span", { className: "prompt" }, "\u203A"), " ", v.line))));
  }
  Object.assign(window, { PosMock, DashMock, CatalogMock, ChatMock, TechIcon, ConsoleMock });
})();
