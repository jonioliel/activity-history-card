/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, ee = F.ShadowRoot && (F.ShadyCSS === void 0 || F.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, te = Symbol(), ne = /* @__PURE__ */ new WeakMap();
let Ee = class {
  constructor(e, i, t) {
    if (this._$cssResult$ = !0, t !== te) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ee && e === void 0) {
      const t = i !== void 0 && i.length === 1;
      t && (e = ne.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && ne.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Fe = (a) => new Ee(typeof a == "string" ? a : a + "", void 0, te), ze = (a, ...e) => {
  const i = a.length === 1 ? a[0] : e.reduce((t, s, r) => t + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + a[r + 1], a[0]);
  return new Ee(i, a, te);
}, Ie = (a, e) => {
  if (ee) a.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const t = document.createElement("style"), s = F.litNonce;
    s !== void 0 && t.setAttribute("nonce", s), t.textContent = i.cssText, a.appendChild(t);
  }
}, oe = ee ? (a) => a : (a) => a instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const t of e.cssRules) i += t.cssText;
  return Fe(i);
})(a) : a;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Be, defineProperty: je, getOwnPropertyDescriptor: qe, getOwnPropertyNames: Ge, getOwnPropertySymbols: Ve, getPrototypeOf: Ke } = Object, V = globalThis, ce = V.trustedTypes, We = ce ? ce.emptyScript : "", Ye = V.reactiveElementPolyfillSupport, T = (a, e) => a, Z = { toAttribute(a, e) {
  switch (e) {
    case Boolean:
      a = a ? We : null;
      break;
    case Object:
    case Array:
      a = a == null ? a : JSON.stringify(a);
  }
  return a;
}, fromAttribute(a, e) {
  let i = a;
  switch (e) {
    case Boolean:
      i = a !== null;
      break;
    case Number:
      i = a === null ? null : Number(a);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(a);
      } catch {
        i = null;
      }
  }
  return i;
} }, Te = (a, e) => !Be(a, e), le = { attribute: !0, type: String, converter: Z, reflect: !1, useDefault: !1, hasChanged: Te };
Symbol.metadata ??= Symbol("metadata"), V.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let A = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = le) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const t = Symbol(), s = this.getPropertyDescriptor(e, t, i);
      s !== void 0 && je(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, t) {
    const { get: s, set: r } = qe(this.prototype, e) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: s, set(n) {
      const c = s?.call(this);
      r?.call(this, n), this.requestUpdate(e, c, t);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? le;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    const e = Ke(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(T("properties"))) {
      const i = this.properties, t = [...Ge(i), ...Ve(i)];
      for (const s of t) this.createProperty(s, i[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [t, s] of i) this.elementProperties.set(t, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, t] of this.elementProperties) {
      const s = this._$Eu(i, t);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const t = new Set(e.flat(1 / 0).reverse());
      for (const s of t) i.unshift(oe(s));
    } else e !== void 0 && i.push(oe(e));
    return i;
  }
  static _$Eu(e, i) {
    const t = i.attribute;
    return t === !1 ? void 0 : typeof t == "string" ? t : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
  }
  addController(e) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
  }
  removeController(e) {
    this._$EO?.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const t of i.keys()) this.hasOwnProperty(t) && (e.set(t, this[t]), delete this[t]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ie(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, t) {
    this._$AK(e, t);
  }
  _$ET(e, i) {
    const t = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, t);
    if (s !== void 0 && t.reflect === !0) {
      const r = (t.converter?.toAttribute !== void 0 ? t.converter : Z).toAttribute(i, t.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const t = this.constructor, s = t._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const r = t.getPropertyOptions(s), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Z;
      this._$Em = s;
      const c = n.fromAttribute(i, r.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, t, s = !1, r) {
    if (e !== void 0) {
      const n = this.constructor;
      if (s === !1 && (r = this[e]), t ??= n.getPropertyOptions(e), !((t.hasChanged ?? Te)(r, i) || t.useDefault && t.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, t)))) return;
      this.C(e, i, t);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: t, reflect: s, wrapped: r }, n) {
    t && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? i ?? this[e]), r !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || t || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const t = this.constructor.elementProperties;
      if (t.size > 0) for (const [s, r] of t) {
        const { wrapped: n } = r, c = this[s];
        n !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, r, c);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((t) => t.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (t) {
      throw e = !1, this._$EM(), t;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((i) => i.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq &&= this._$Eq.forEach((i) => this._$ET(i, this[i])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
A.elementStyles = [], A.shadowRootOptions = { mode: "open" }, A[T("elementProperties")] = /* @__PURE__ */ new Map(), A[T("finalized")] = /* @__PURE__ */ new Map(), Ye?.({ ReactiveElement: A }), (V.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ie = globalThis, de = (a) => a, j = ie.trustedTypes, he = j ? j.createPolicy("lit-html", { createHTML: (a) => a }) : void 0, Me = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, Re = "?" + b, Je = `<${Re}>`, k = document, H = () => k.createComment(""), D = (a) => a === null || typeof a != "object" && typeof a != "function", ae = Array.isArray, Xe = (a) => ae(a) || typeof a?.[Symbol.iterator] == "function", W = `[ 	
\f\r]`, z = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ue = /-->/g, _e = />/g, x = RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pe = /'/g, ge = /"/g, He = /^(?:script|style|textarea|title)$/i, Ze = (a) => (e, ...i) => ({ _$litType$: a, strings: e, values: i }), u = Ze(1), C = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), me = /* @__PURE__ */ new WeakMap(), w = k.createTreeWalker(k, 129);
function De(a, e) {
  if (!ae(a) || !a.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return he !== void 0 ? he.createHTML(e) : e;
}
const Qe = (a, e) => {
  const i = a.length - 1, t = [];
  let s, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = z;
  for (let c = 0; c < i; c++) {
    const o = a[c];
    let d, l, h = -1, g = 0;
    for (; g < o.length && (n.lastIndex = g, l = n.exec(o), l !== null); ) g = n.lastIndex, n === z ? l[1] === "!--" ? n = ue : l[1] !== void 0 ? n = _e : l[2] !== void 0 ? (He.test(l[2]) && (s = RegExp("</" + l[2], "g")), n = x) : l[3] !== void 0 && (n = x) : n === x ? l[0] === ">" ? (n = s ?? z, h = -1) : l[1] === void 0 ? h = -2 : (h = n.lastIndex - l[2].length, d = l[1], n = l[3] === void 0 ? x : l[3] === '"' ? ge : pe) : n === ge || n === pe ? n = x : n === ue || n === _e ? n = z : (n = x, s = void 0);
    const p = n === x && a[c + 1].startsWith("/>") ? " " : "";
    r += n === z ? o + Je : h >= 0 ? (t.push(d), o.slice(0, h) + Me + o.slice(h) + b + p) : o + b + (h === -2 ? c : p);
  }
  return [De(a, r + (a[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), t];
};
class P {
  constructor({ strings: e, _$litType$: i }, t) {
    let s;
    this.parts = [];
    let r = 0, n = 0;
    const c = e.length - 1, o = this.parts, [d, l] = Qe(e, i);
    if (this.el = P.createElement(d, t), w.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = w.nextNode()) !== null && o.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(Me)) {
          const g = l[n++], p = s.getAttribute(h).split(b), m = /([.?@])?(.*)/.exec(g);
          o.push({ type: 1, index: r, name: m[2], strings: p, ctor: m[1] === "." ? tt : m[1] === "?" ? it : m[1] === "@" ? at : K }), s.removeAttribute(h);
        } else h.startsWith(b) && (o.push({ type: 6, index: r }), s.removeAttribute(h));
        if (He.test(s.tagName)) {
          const h = s.textContent.split(b), g = h.length - 1;
          if (g > 0) {
            s.textContent = j ? j.emptyScript : "";
            for (let p = 0; p < g; p++) s.append(h[p], H()), w.nextNode(), o.push({ type: 2, index: ++r });
            s.append(h[g], H());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Re) o.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(b, h + 1)) !== -1; ) o.push({ type: 7, index: r }), h += b.length - 1;
      }
      r++;
    }
  }
  static createElement(e, i) {
    const t = k.createElement("template");
    return t.innerHTML = e, t;
  }
}
function E(a, e, i = a, t) {
  if (e === C) return e;
  let s = t !== void 0 ? i._$Co?.[t] : i._$Cl;
  const r = D(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== r && (s?._$AO?.(!1), r === void 0 ? s = void 0 : (s = new r(a), s._$AT(a, i, t)), t !== void 0 ? (i._$Co ??= [])[t] = s : i._$Cl = s), s !== void 0 && (e = E(a, s._$AS(a, e.values), s, t)), e;
}
class et {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: t } = this._$AD, s = (e?.creationScope ?? k).importNode(i, !0);
    w.currentNode = s;
    let r = w.nextNode(), n = 0, c = 0, o = t[0];
    for (; o !== void 0; ) {
      if (n === o.index) {
        let d;
        o.type === 2 ? d = new U(r, r.nextSibling, this, e) : o.type === 1 ? d = new o.ctor(r, o.name, o.strings, this, e) : o.type === 6 && (d = new st(r, this, e)), this._$AV.push(d), o = t[++c];
      }
      n !== o?.index && (r = w.nextNode(), n++);
    }
    return w.currentNode = k, s;
  }
  p(e) {
    let i = 0;
    for (const t of this._$AV) t !== void 0 && (t.strings !== void 0 ? (t._$AI(e, t, i), i += t.strings.length - 2) : t._$AI(e[i])), i++;
  }
}
class U {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, t, s) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = t, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && e?.nodeType === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = E(this, e, i), D(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== C && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Xe(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(k.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: t } = e, s = typeof t == "number" ? this._$AC(e) : (t.el === void 0 && (t.el = P.createElement(De(t.h, t.h[0]), this.options)), t);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const r = new et(s, this), n = r.u(this.options);
      r.p(i), this.T(n), this._$AH = r;
    }
  }
  _$AC(e) {
    let i = me.get(e.strings);
    return i === void 0 && me.set(e.strings, i = new P(e)), i;
  }
  k(e) {
    ae(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let t, s = 0;
    for (const r of e) s === i.length ? i.push(t = new U(this.O(H()), this.O(H()), this, this.options)) : t = i[s], t._$AI(r), s++;
    s < i.length && (this._$AR(t && t._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const t = de(e).nextSibling;
      de(e).remove(), e = t;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class K {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, t, s, r) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = r, t.length > 2 || t[0] !== "" || t[1] !== "" ? (this._$AH = Array(t.length - 1).fill(new String()), this.strings = t) : this._$AH = _;
  }
  _$AI(e, i = this, t, s) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) e = E(this, e, i, 0), n = !D(e) || e !== this._$AH && e !== C, n && (this._$AH = e);
    else {
      const c = e;
      let o, d;
      for (e = r[0], o = 0; o < r.length - 1; o++) d = E(this, c[t + o], i, o), d === C && (d = this._$AH[o]), n ||= !D(d) || d !== this._$AH[o], d === _ ? e = _ : e !== _ && (e += (d ?? "") + r[o + 1]), this._$AH[o] = d;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class tt extends K {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class it extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class at extends K {
  constructor(e, i, t, s, r) {
    super(e, i, t, s, r), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = E(this, e, i, 0) ?? _) === C) return;
    const t = this._$AH, s = e === _ && t !== _ || e.capture !== t.capture || e.once !== t.once || e.passive !== t.passive, r = e !== _ && (t === _ || s);
    s && this.element.removeEventListener(this.name, this, t), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class st {
  constructor(e, i, t) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = t;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    E(this, e);
  }
}
const rt = ie.litHtmlPolyfillSupport;
rt?.(P, U), (ie.litHtmlVersions ??= []).push("3.3.3");
const nt = (a, e, i) => {
  const t = i?.renderBefore ?? e;
  let s = t._$litPart$;
  if (s === void 0) {
    const r = i?.renderBefore ?? null;
    t._$litPart$ = s = new U(e.insertBefore(H(), r), r, void 0, i ?? {});
  }
  return s._$AI(a), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const se = globalThis;
class S extends A {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = nt(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return C;
  }
}
S._$litElement$ = !0, S.finalized = !0, se.litElementHydrateSupport?.({ LitElement: S });
const ot = se.litElementPolyfillSupport;
ot?.({ LitElement: S });
(se.litElementVersions ??= []).push("4.2.2");
const ct = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  input_boolean: ["on"],
  binary_sensor: ["on"],
  media_player: ["playing"],
  climate: ["cool", "heat", "heat_cool", "dry", "fan_only"],
  humidifier: ["on"],
  vacuum: ["cleaning", "returning"],
  cover: ["opening", "closing", "open"],
  lock: ["unlocked", "locking", "unlocking"]
}, lt = {
  climate: {
    hvac_action: ["cooling", "heating", "drying", "fan"]
  }
}, v = {
  title: "היסטוריית פעילות חכמה",
  auto_discover: !0,
  debug: !1,
  hours_to_show: 24,
  live: !0,
  display_mode: "card",
  group_by: "area",
  show_summary: !0,
  show_insights: !0,
  show_now_line: !0,
  show_legend: !0,
  show_fullscreen_button: !0,
  significant_changes_only: !0,
  minimal_response: !0,
  min_duration_seconds: 20,
  merge_gap_seconds: 15,
  mobile_breakpoint: 760
}, q = {
  light: "תאורה",
  switch: "מתגים",
  binary_sensor: "חיישנים",
  input_boolean: "מתגים וירטואליים",
  climate: "מזגנים",
  media_player: "מוזיקה",
  cover: "תריסים",
  fan: "מאווררים",
  humidifier: "לחות",
  vacuum: "שואבים",
  lock: "מנעולים"
}, I = [
  "light",
  "switch",
  "binary_sensor",
  "input_boolean",
  "climate",
  "media_player",
  "cover",
  "fan",
  "humidifier",
  "vacuum",
  "lock"
], Q = {
  on: "דלוק",
  off: "כבוי",
  cooling: "קירור",
  heating: "חימום",
  playing: "מנגן",
  opening: "פתוח",
  closing: "נסגר",
  idle: "המתנה",
  unknown: "לא ידוע"
}, dt = ["ar", "fa", "he", "iw", "ur"];
function O(a) {
  return a.includes(".") ? a.split(".")[0] ?? a : a;
}
function Y(a, e = /* @__PURE__ */ new Date()) {
  if (a.start_time) {
    const r = new Date(a.start_time), n = a.end_time ? new Date(a.end_time) : e;
    return { start: r, end: n };
  }
  const i = a.hours_to_show ?? 24, t = a.end_time ? new Date(a.end_time) : e;
  return { start: new Date(t.getTime() - i * 60 * 60 * 1e3), end: t };
}
function ht(a, e) {
  if (a === !0 || a === "rtl") return !0;
  if (a === !1 || a === "ltr") return !1;
  const i = (e || document.documentElement.lang || navigator.language || "").toLowerCase();
  return dt.some((t) => i === t || i.startsWith(`${t}-`));
}
function M(a) {
  if (!Number.isFinite(a) || a <= 0) return "0 דק׳";
  const e = Math.round(a / 6e4), i = Math.floor(e / 60), t = e % 60;
  return i && t ? `${i}:${String(t).padStart(2, "0")} שעות` : i ? `${i} שעות` : `${t} דק׳`;
}
function $(a) {
  return new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit" }).format(a);
}
function ut(a, e, i) {
  return Math.min(i, Math.max(e, a));
}
function B(a, e) {
  const i = e.end.getTime() - e.start.getTime();
  return i <= 0 ? 0 : ut((a.getTime() - e.start.getTime()) / i * 100, 0, 100);
}
function _t(a) {
  const [, e = a] = a.split(".");
  return e.replace(/_/g, " ");
}
const fe = /* @__PURE__ */ new WeakMap();
async function pt(a, e) {
  const i = a.entities ?? [], t = e ? await ft(e) : bt(), s = i.map((c) => typeof c == "string" ? { entity: c } : c);
  let r = !1;
  if (!s.length && e && a.auto_discover !== !1) {
    const c = gt(a, e, t);
    r = c.fallbackUsed, s.push(...c.entities);
  }
  return {
    entities: s.filter((c) => c.entity && !c.hidden && !$t(c.entity, a.exclude_entities ?? [])).map((c) => mt(c, a, e, t)).filter((c) => !!c).filter((c) => Pe(c.labels ?? [], a, t.labels)),
    diagnostics: vt(t, r, a)
  };
}
function gt(a, e, i) {
  const t = a.domains?.length ? a.domains : I, s = G(a.areas ?? []), r = [];
  if (i.entities.length) {
    const n = be(i.areas, "area_id"), c = be(i.devices, "id");
    for (const o of i.entities) {
      if (o.disabled_by || o.hidden_by || !e.states[o.entity_id]) continue;
      const d = O(o.entity_id);
      if (t.length && !t.includes(d)) continue;
      const l = o.device_id ? c.get(o.device_id) : void 0;
      if (l?.disabled_by) continue;
      const h = o.area_id || l?.area_id || void 0;
      if (!h) continue;
      const g = n.get(h), p = g?.name ?? h;
      if (s.size && !s.has(y(h)) && !s.has(y(p))) continue;
      const m = Oe(o.labels, l?.labels, g?.labels);
      Pe(m, a, i.labels) && r.push({
        entity: o.entity_id,
        name: o.name ?? o.original_name ?? void 0,
        area: p,
        domain: d
      });
    }
    return { entities: r, fallbackUsed: !1 };
  }
  for (const [n, c] of Object.entries(e.states)) {
    const o = O(n);
    if (t.length && !t.includes(o)) continue;
    const d = R(c.attributes.area) ?? R(c.attributes.area_id);
    d && (s.size && !s.has(y(d)) || r.push({ entity: n, area: d, domain: o }));
  }
  return { entities: r, fallbackUsed: !0 };
}
function mt(a, e, i, t) {
  const s = i?.states[a.entity], r = t.entities.find((p) => p.entity_id === a.entity);
  if (r?.disabled_by || r?.hidden_by) return;
  const n = r?.device_id ? t.devices.find((p) => p.id === r.device_id) : void 0;
  if (n?.disabled_by) return;
  const c = a.area ? void 0 : r?.area_id || n?.area_id || void 0, o = a.area ?? yt(c, t) ?? R(s?.attributes?.area) ?? R(s?.attributes?.area_id);
  if (e.areas?.length && (!o || !xt(o, c, e.areas))) return;
  const d = a.domain ?? O(a.entity), l = Oe(
    r?.labels,
    n?.labels,
    c ? t.areas.find((p) => p.area_id === c)?.labels : void 0
  ), h = s ? i?.formatEntityName?.(s) : void 0, g = s?.attributes?.friendly_name;
  return {
    entity_id: a.entity,
    name: a.name ?? r?.name ?? h ?? (typeof g == "string" ? g : _t(a.entity)),
    area: o,
    area_id: c,
    domain: d,
    icon: a.icon ?? R(s?.attributes?.icon),
    labels: l,
    config: a
  };
}
function Pe(a, e, i) {
  const t = wt(a, i), s = G(e.include_labels ?? []), r = G(e.exclude_labels ?? []);
  return !(r.size && [...r].some((n) => t.has(n)) || s.size && ![...s].some((n) => t.has(n)));
}
async function ft(a) {
  const e = fe.get(a);
  if (e) return e;
  const i = Promise.all([
    L(a, "config/area_registry/list"),
    L(a, "config/device_registry/list"),
    L(a, "config/entity_registry/list"),
    L(a, "config/label_registry/list")
  ]).then(([t, s, r, n]) => ({
    areas: t.items,
    devices: s.items,
    entities: r.items,
    labels: n.items,
    areaRegistryAvailable: t.available,
    deviceRegistryAvailable: s.available,
    entityRegistryAvailable: r.available,
    labelRegistryAvailable: n.available
  }));
  return fe.set(a, i), i;
}
async function L(a, e) {
  try {
    const i = await a.callWS({ type: e });
    return { items: Array.isArray(i) ? i : [], available: Array.isArray(i) };
  } catch {
    return { items: [], available: !1 };
  }
}
function bt() {
  return {
    areas: [],
    devices: [],
    entities: [],
    labels: [],
    areaRegistryAvailable: !1,
    deviceRegistryAvailable: !1,
    entityRegistryAvailable: !1,
    labelRegistryAvailable: !1
  };
}
function vt(a, e, i) {
  const t = [];
  return a.areaRegistryAvailable || t.push("area_registry_unavailable"), a.entityRegistryAvailable || t.push("entity_registry_unavailable"), a.deviceRegistryAvailable || t.push("device_registry_unavailable"), (i.include_labels?.length || i.exclude_labels?.length) && !a.labelRegistryAvailable && t.push("label_registry_unavailable"), {
    registryAvailable: a.areaRegistryAvailable || a.entityRegistryAvailable || a.deviceRegistryAvailable,
    areaRegistryAvailable: a.areaRegistryAvailable,
    entityRegistryAvailable: a.entityRegistryAvailable,
    deviceRegistryAvailable: a.deviceRegistryAvailable,
    labelRegistryAvailable: a.labelRegistryAvailable,
    registryEntityCount: a.entities.length,
    areaCount: a.areas.length,
    labelCount: a.labels.length,
    fallbackUsed: e,
    unavailableReasons: t
  };
}
function yt(a, e) {
  if (a)
    return e.areas.find((i) => i.area_id === a)?.name ?? a;
}
function xt(a, e, i) {
  const t = G(i);
  return t.has(y(a)) || !!(e && t.has(y(e)));
}
function wt(a, e) {
  const i = new Map(e.map((s) => [s.label_id, s.name])), t = /* @__PURE__ */ new Set();
  for (const s of a) {
    t.add(y(s));
    const r = i.get(s);
    r && t.add(y(r));
  }
  return t;
}
function Oe(...a) {
  return [...new Set(a.flatMap((e) => e ?? []))];
}
function $t(a, e) {
  return e.some((i) => kt(i).test(a));
}
function kt(a) {
  const e = a.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${e}$`);
}
function be(a, e) {
  return new Map(a.map((i) => [i[e], i]));
}
function G(a) {
  return new Set(a.map(y).filter(Boolean));
}
function y(a) {
  return a.trim().toLowerCase();
}
function R(a) {
  return typeof a == "string" && a.trim() ? a : void 0;
}
function At(a, e) {
  const i = e.search.trim().toLowerCase();
  return a.filter((t) => {
    const { entity: s } = t;
    if (e.areas.length && (!s.area || !e.areas.includes(s.area)) || e.domains.length && !e.domains.includes(s.domain) || i && ![s.entity_id, s.name, s.area, s.domain].filter(Boolean).join(" ").toLowerCase().includes(i) || e.stateMode === "active_only" && t.totalActiveMs <= 0) return !1;
    if (e.stateMode === "currently_active") {
      const r = Date.now();
      if (!t.segments.some((n) => n.active && n.start.getTime() <= r && n.end.getTime() >= r - 9e4)) return !1;
    }
    return !0;
  });
}
function St(a, e) {
  if (e === "none" || e === "entity")
    return [ve("all", "כל הרכיבים", a)];
  const i = /* @__PURE__ */ new Map();
  for (const t of a) {
    const s = e === "area" ? t.entity.area || "ללא אזור" : t.entity.domain || "other", r = i.get(s) ?? [];
    r.push(t), i.set(s, r);
  }
  return [...i.entries()].map(([t, s]) => ve(t, e === "domain" ? q[t] ?? t : t, s));
}
function ve(a, e, i) {
  const t = i.reduce((s, r) => s + r.totalActiveMs, 0);
  return {
    id: a,
    title: e,
    subtitle: `${i.length} רכיבים`,
    rows: i,
    totalActiveMs: t
  };
}
function ye(a) {
  return a.config?.attributes?.length || a.config?.active_attributes && Object.keys(a.config.active_attributes).length ? !0 : ["climate", "humidifier", "water_heater"].includes(a.domain);
}
async function Ct(a, e, i, t) {
  const { withAttributes: s, withoutAttributes: r } = Ue(e), n = await Promise.all([
    r.length ? xe(a, r, i, t, !0) : Promise.resolve({}),
    s.length ? xe(a, s, i, t, !1) : Promise.resolve({})
  ]);
  return Object.assign({}, ...n);
}
function Ue(a) {
  return {
    withAttributes: a.filter(ye),
    withoutAttributes: a.filter((e) => !ye(e))
  };
}
async function xe(a, e, i, t, s) {
  const r = e.map((c) => c.entity_id), n = await a.callWS({
    type: "history/history_during_period",
    entity_ids: r,
    start_time: i.start.toISOString(),
    end_time: i.end.toISOString(),
    minimal_response: t.minimal_response ?? !0,
    significant_changes_only: t.significant_changes_only ?? !0,
    no_attributes: s
  });
  return Et(n, r);
}
function Et(a, e) {
  const i = {};
  if (Array.isArray(a))
    return a.forEach((t, s) => {
      if (!Array.isArray(t)) return;
      const r = e[s], n = we(t, r), c = n[0]?.entity_id ?? r;
      c && (i[c] = n);
    }), i;
  if (a && typeof a == "object")
    for (const [t, s] of Object.entries(a))
      Array.isArray(s) && (i[t] = we(s, t));
  return i;
}
function we(a, e) {
  let i = e;
  return a.map((t) => {
    if (!t || typeof t != "object") return;
    const s = t, r = f(s.entity_id) ?? i;
    r && (i = r);
    const n = f(s.last_changed) ?? f(s.lc) ?? f(s.last_updated) ?? f(s.lu), c = f(s.state) ?? f(s.s);
    if (!r || !c || !n) return;
    const o = $e(s.attributes) ?? $e(s.a), d = {
      entity_id: r,
      state: c,
      last_changed: n
    };
    o && (d.attributes = o);
    const l = f(s.last_updated) ?? f(s.lu);
    return l && (d.last_updated = l), d;
  }).filter((t) => t !== void 0);
}
function f(a) {
  return typeof a == "string" ? a : void 0;
}
function $e(a) {
  return a && typeof a == "object" && !Array.isArray(a) ? a : void 0;
}
function ke(a, e, i, t, s = {}) {
  return e.map((r) => {
    const n = zt(a[r.entity_id] ?? [], s[r.entity_id], i, r.entity_id).filter((l) => l.state != null && l.last_changed).sort((l, h) => new Date(l.last_changed).getTime() - new Date(h.last_changed).getTime()), c = Rt(n), o = Mt(c, r, i, t), d = o.filter((l) => l.active);
    return {
      entity: r,
      segments: o,
      totalActiveMs: d.reduce((l, h) => l + h.durationMs, 0),
      eventCount: d.length,
      currentState: o.at(-1)?.state,
      currentCategory: o.at(-1)?.category
    };
  });
}
function zt(a, e, i, t) {
  const s = [...a];
  if (!e) return s;
  const r = new Date(e.last_changed || e.last_updated).getTime(), n = Number.isFinite(r) ? Math.min(Math.max(r, i.start.getTime()), i.end.getTime()) : i.start.getTime(), c = s.filter((o) => o.entity_id === t).sort((o, d) => new Date(o.last_changed).getTime() - new Date(d.last_changed).getTime()).at(-1);
  return (!c || new Date(c.last_changed).getTime() < n || c.state !== e.state) && s.push({
    entity_id: t,
    state: e.state,
    attributes: e.attributes,
    last_changed: new Date(n).toISOString(),
    last_updated: e.last_updated
  }), s;
}
function Tt(a, e, i) {
  if (e === "unknown" || e === "unavailable") return { category: "unknown", active: !1 };
  const t = a.domain || O(a.entity_id), r = a.config?.active_states ?? ct[t] ?? ["on"], n = a.config?.active_attributes ?? lt[t] ?? {};
  for (const [o, d] of Object.entries(n)) {
    const l = i?.[o];
    if (typeof l == "string" && d.includes(l))
      return { category: Se(t, l), active: !0 };
  }
  const c = r.includes(e);
  return { category: Se(t, e), active: c };
}
function Mt(a, e, i, t) {
  if (!a.length) return [];
  const s = [], r = i.start.getTime(), n = i.end.getTime();
  for (let o = 0; o < a.length; o += 1) {
    const d = a[o];
    if (!d) continue;
    const l = a[o + 1], h = new Date(d.last_changed).getTime(), g = l ? new Date(l.last_changed).getTime() : n, p = Math.max(h, r), m = Math.min(g, n);
    if (m <= p) continue;
    const re = Tt(e, d.state, d.attributes), Ne = m - p;
    s.push({
      entity_id: e.entity_id,
      state: d.state,
      category: re.category,
      active: re.active,
      start: new Date(p),
      end: new Date(m),
      durationMs: Ne,
      attributes: d.attributes
    });
  }
  return Ht(s, t.merge_gap_seconds ?? 0).filter((o) => !o.active || !t.min_duration_seconds || o.durationMs >= t.min_duration_seconds * 1e3);
}
function Rt(a) {
  const e = [];
  for (const i of a) {
    const t = e.at(-1);
    t && t.state === i.state && Ae(t) === Ae(i) || e.push(i);
  }
  return e;
}
function Ae(a) {
  const e = a.attributes ?? {}, i = {
    hvac_action: e.hvac_action,
    temperature: e.temperature,
    current_temperature: e.current_temperature,
    media_title: e.media_title
  };
  return JSON.stringify(i);
}
function Ht(a, e) {
  if (!a.length) return a;
  const i = Math.max(0, e) * 1e3, t = [];
  for (const s of a) {
    const r = t.at(-1);
    r && r.entity_id === s.entity_id && r.category === s.category && r.state === s.state && s.start.getTime() - r.end.getTime() <= i ? (r.end = s.end, r.durationMs = r.end.getTime() - r.start.getTime()) : t.push({ ...s });
  }
  return t;
}
function Se(a, e) {
  return e === "unknown" || e === "unavailable" ? "unknown" : ["off", "closed", "idle", "paused", "standby"].includes(e) ? e === "idle" ? "idle" : "off" : ["cool", "cooling"].includes(e) ? "cooling" : ["heat", "heating"].includes(e) ? "heating" : ["playing"].includes(e) ? "playing" : ["opening", "open"].includes(e) ? "opening" : ["closing"].includes(e) ? "closing" : a === "climate" && ["drying", "fan", "fan_only", "dry"].includes(e) ? "idle" : "on";
}
const Le = [
  {
    entity_id: "light.living_room_main",
    name: "תאורת סלון",
    area: "סלון",
    domain: "light",
    icon: "💡",
    pattern: [
      { startHour: -22, endHour: -20, state: "on" },
      { startHour: -15, endHour: -13, state: "on" },
      { startHour: -5, endHour: -1, state: "on" }
    ]
  },
  {
    entity_id: "climate.living_room_ac",
    name: "מזגן סלון",
    area: "סלון",
    domain: "climate",
    icon: "❄",
    pattern: [
      { startHour: -21, endHour: -18, state: "cool", attributes: { hvac_action: "cooling", current_temperature: 24 } },
      { startHour: -12, endHour: -9, state: "cool", attributes: { hvac_action: "cooling", current_temperature: 23 } },
      { startHour: -4, endHour: -0.5, state: "cool", attributes: { hvac_action: "cooling", current_temperature: 24 } }
    ]
  },
  {
    entity_id: "media_player.living_room_spotify",
    name: "Spotify סלון",
    area: "סלון",
    domain: "media_player",
    icon: "♫",
    pattern: [
      { startHour: -18, endHour: -15.5, state: "playing", attributes: { media_title: "Morning mix" } },
      { startHour: -8, endHour: -6.5, state: "playing", attributes: { media_title: "Evening playlist" } },
      { startHour: -2.4, endHour: -1.2, state: "playing", attributes: { media_title: "Focus" } }
    ]
  },
  {
    entity_id: "cover.living_room_blinds",
    name: "תריס סלון",
    area: "סלון",
    domain: "cover",
    icon: "▤",
    pattern: [
      { startHour: -19, endHour: -18.8, state: "opening" },
      { startHour: -7, endHour: -6.8, state: "closing" }
    ]
  },
  {
    entity_id: "light.kitchen_counter",
    name: "תאורת מטבח",
    area: "מטבח",
    domain: "light",
    icon: "💡",
    pattern: [
      { startHour: -23, endHour: -21, state: "on" },
      { startHour: -14.5, endHour: -13.2, state: "on" },
      { startHour: -6, endHour: -3.5, state: "on" }
    ]
  },
  {
    entity_id: "switch.kitchen_coffee_machine",
    name: "מכונת קפה",
    area: "מטבח",
    domain: "switch",
    icon: "☕",
    pattern: [
      { startHour: -20.5, endHour: -20.1, state: "on" },
      { startHour: -11.2, endHour: -10.8, state: "on" },
      { startHour: -2, endHour: -1.6, state: "on" }
    ]
  },
  {
    entity_id: "cover.kitchen_blinds",
    name: "תריס מטבח",
    area: "מטבח",
    domain: "cover",
    icon: "▤",
    pattern: [
      { startHour: -17, endHour: -16.7, state: "opening" },
      { startHour: -5.4, endHour: -5.1, state: "closing" }
    ]
  },
  {
    entity_id: "light.children_room",
    name: "תאורת חדר ילדים",
    area: "חדרי ילדים",
    domain: "light",
    icon: "💡",
    pattern: [
      { startHour: -16, endHour: -14.8, state: "on" },
      { startHour: -4.8, endHour: -1, state: "on" }
    ]
  },
  {
    entity_id: "climate.children_room",
    name: "מזגן חדר ילדים",
    area: "חדרי ילדים",
    domain: "climate",
    icon: "❄",
    pattern: [
      { startHour: -10, endHour: -6.2, state: "cool", attributes: { hvac_action: "cooling", current_temperature: 23 } },
      { startHour: -2.5, endHour: -0.2, state: "cool", attributes: { hvac_action: "cooling", current_temperature: 23 } }
    ]
  },
  {
    entity_id: "fan.bedroom",
    name: "מאוורר חדר שינה",
    area: "חדר שינה",
    domain: "fan",
    icon: "◌",
    pattern: [
      { startHour: -9, endHour: -6, state: "on" },
      { startHour: -3.5, endHour: -0.1, state: "on" }
    ]
  }
];
function Dt() {
  return Le.map((a) => ({
    entity_id: a.entity_id,
    name: a.name,
    area: a.area,
    domain: a.domain,
    icon: a.icon,
    config: { entity: a.entity_id, name: a.name, area: a.area }
  }));
}
function Pt(a) {
  const e = {}, i = a.end.getTime();
  for (const t of Le) {
    const s = [
      J(t.entity_id, "off", a.start.getTime(), void 0)
    ];
    for (const r of t.pattern) {
      const n = i + r.startHour * 36e5, c = i + r.endHour * 36e5;
      c <= a.start.getTime() || n >= a.end.getTime() || (s.push(J(t.entity_id, r.state, Math.max(n, a.start.getTime()), r.attributes)), s.push(J(t.entity_id, "off", Math.min(c, a.end.getTime()), void 0)));
    }
    e[t.entity_id] = s.sort((r, n) => new Date(r.last_changed).getTime() - new Date(n.last_changed).getTime()).filter((r, n, c) => n === 0 || r.last_changed !== c[n - 1]?.last_changed);
  }
  return e;
}
function J(a, e, i, t) {
  return {
    entity_id: a,
    state: e,
    attributes: t,
    last_changed: new Date(i).toISOString(),
    last_updated: new Date(i).toISOString()
  };
}
function Ot() {
  return u`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">קורלציות</h3><p>מצב קורלציה ויומן אירועים יפותח בשלב הבא.</p></div></div>`;
}
function Ut() {
  return u`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">פירוט רכיב</h3><p>מסך Drill-down לרכיב יפותח אחרי תצוגת Swimlane.</p></div></div>`;
}
function Lt() {
  return u`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">Heatmap</h3><p>מצב זה יפותח אחרי ה-MVP.</p></div></div>`;
}
function Nt(a) {
  const e = It(a.range), i = /* @__PURE__ */ new Date(), t = B(i, a.range), s = a.config.show_now_line !== !1 && i.getTime() >= a.range.start.getTime() && i.getTime() <= a.range.end.getTime() + 9e4;
  return u`
    <section class="ahc-timeline-card" aria-label="ציר זמן פעילות">
      <div class="ahc-timeline-toolbar">
        <h3 class="ahc-timeline-title">ציר זמן פעילות</h3>
        <span class="ahc__metric-subtitle">${$(a.range.start)} – ${$(a.range.end)}</span>
      </div>
      <div class="ahc-timeline-scroll">
        <div class="ahc-timeline">
          <div class="ahc-timeline__axis" aria-hidden="true">
            <div class="ahc-timeline__axis-spacer">רכיב / אזור</div>
            <div class="ahc-timeline__ticks">
              ${e.map(
    (r) => u`<span class="ahc-timeline__tick" style="left:${r.percent}%">${r.label}</span>`
  )}
            </div>
          </div>
          <div class="ahc-timeline__groups">
            ${a.groups.map(
    (r) => u`
                <section class="ahc-group" aria-label=${r.title}>
                  <header class="ahc-group__header">
                    <span class="ahc-group__title">${r.icon ? u`<span>${r.icon}</span>` : null}${r.title}</span>
                    <span class="ahc-group__meta">${M(r.totalActiveMs)} • ${r.subtitle ?? ""}</span>
                  </header>
                  ${r.rows.map(
      (n) => u`
                      <div class="ahc-row">
                        <div class="ahc-row__label">
                          <span class="ahc-row__icon" aria-hidden="true">${n.entity.icon ?? "●"}</span>
                          <span class="ahc-row__name" title=${n.entity.entity_id}>${n.entity.name}</span>
                          ${n.currentCategory ? u`<span class="ahc-row__state-chip" data-state=${n.currentCategory}>${Q[n.currentCategory]}</span>` : null}
                        </div>
                        <div class="ahc-row__track">
                          <svg
                            class="ahc-row__svg"
                            viewBox="0 0 100 32"
                            preserveAspectRatio="none"
                            role="img"
                            aria-label=${`ציר זמן עבור ${n.entity.name}`}
                          >
                            <line class="ahc-row__svg-track" x1="1" x2="99" y1="16" y2="16"></line>
                            ${n.segments.map((c, o) => {
        const d = B(c.start, a.range), l = B(c.end, a.range), h = Math.max(0.35, l - d);
        if (!c.active && c.category !== "unknown") return null;
        const g = `${n.entity.name}, ${Q[c.category]}, ${$(c.start)} עד ${$(c.end)}, ${M(c.durationMs)}`;
        return u`
                                <rect
                                  class="ahc-segment-svg"
                                  data-category=${c.category}
                                  x=${d}
                                  y="10"
                                  width=${h}
                                  height="12"
                                  rx="6"
                                  tabindex="0"
                                  role="button"
                                  aria-label=${g}
                                  @click=${(p) => a.onSegmentClick?.(p, n.entity.entity_id, o)}
                                  @keydown=${(p) => {
          (p.key === "Enter" || p.key === " ") && (p.preventDefault(), a.onSegmentClick?.(p, n.entity.entity_id, o));
        }}
                                >
                                  <title>${g}</title>
                                </rect>
                              `;
      })}
                          </svg>
                        </div>
                      </div>
                    `
    )}
                </section>
              `
  )}
          </div>
          ${s ? u`<div class="ahc-now-line" style="left:${t}%"><span class="ahc-now-line__label">עכשיו</span></div>` : null}
        </div>
      </div>
      ${a.config.show_legend === !1 ? null : Ft()}
    </section>
  `;
}
function Ft() {
  return u`<div class="ahc-legend" aria-label="מקרא">
    ${[
    ["on", "var(--ahc-on)"],
    ["cooling", "var(--ahc-cooling)"],
    ["heating", "var(--ahc-heating)"],
    ["playing", "var(--ahc-playing)"],
    ["opening", "var(--ahc-opening)"],
    ["off", "var(--ahc-off)"],
    ["unknown", "var(--ahc-unknown)"]
  ].map(
    ([e, i]) => u`<span class="ahc-legend__item"><span class="ahc-legend__swatch" style="--swatch:${i}"></span>${Q[e]}</span>`
  )}
  </div>`;
}
function It(a) {
  const e = Math.max(1, (a.end.getTime() - a.start.getTime()) / 36e5), i = e <= 24 ? 3 : e <= 72 ? 6 : 24, t = [], s = new Date(a.start);
  for (s.setMinutes(0, 0, 0); s < a.end; )
    s >= a.start && t.push({ label: $(s), percent: B(s, a) }), s.setHours(s.getHours() + i);
  return t.push({ label: $(a.end), percent: 100 }), t;
}
const Bt = ze`
/*
  Activity History Card design baseline
  Target: Home Assistant Lovelace custom card, RTL-first, mobile-first capable.

  Notes for implementation:
  - Apply \`dir="rtl"\` on \`.ahc\` for Hebrew/RTL UI.
  - Keep the inner chart math/timeline in LTR with \`.ahc-timeline { direction: ltr; }\`.
  - Prefer CSS logical properties in TS/templates too.
*/

:host {
  --ahc-radius-xs: 8px;
  --ahc-radius-sm: 12px;
  --ahc-radius-md: 18px;
  --ahc-radius-lg: 24px;
  --ahc-radius-xl: 32px;

  --ahc-gap-xxs: 4px;
  --ahc-gap-xs: 8px;
  --ahc-gap-sm: 12px;
  --ahc-gap-md: 16px;
  --ahc-gap-lg: 24px;
  --ahc-gap-xl: 32px;

  --ahc-font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif);
  --ahc-card-bg: var(--ha-card-background, var(--card-background-color, #0f172a));
  --ahc-page-bg: var(--lovelace-background, #020617);
  --ahc-surface-1: color-mix(in srgb, var(--ahc-card-bg) 88%, #1e3a5f 12%);
  --ahc-surface-2: color-mix(in srgb, var(--ahc-card-bg) 80%, #2563eb 8%, #0f172a 12%);
  --ahc-surface-3: color-mix(in srgb, var(--ahc-card-bg) 72%, #38bdf8 7%, #0f172a 21%);
  --ahc-border: color-mix(in srgb, var(--divider-color, #334155) 76%, #60a5fa 24%);
  --ahc-border-soft: color-mix(in srgb, var(--divider-color, #334155) 55%, transparent 45%);
  --ahc-shadow: 0 18px 60px rgba(0, 0, 0, 0.32);
  --ahc-shadow-soft: 0 8px 26px rgba(0, 0, 0, 0.22);

  --ahc-text: var(--primary-text-color, #f8fafc);
  --ahc-muted: var(--secondary-text-color, #94a3b8);
  --ahc-disabled: var(--disabled-text-color, #64748b);
  --ahc-accent: var(--primary-color, #38bdf8);
  --ahc-accent-strong: #0ea5e9;
  --ahc-accent-soft: rgba(56, 189, 248, 0.16);
  --ahc-focus: #93c5fd;

  --ahc-on: var(--success-color, #22c55e);
  --ahc-off: #64748b;
  --ahc-cooling: #38bdf8;
  --ahc-heating: #fb923c;
  --ahc-playing: #a78bfa;
  --ahc-opening: #facc15;
  --ahc-closing: #cbd5e1;
  --ahc-idle: #14b8a6;
  --ahc-unknown: #94a3b8;

  --ahc-track: rgba(148, 163, 184, 0.12);
  --ahc-grid-line: rgba(148, 163, 184, 0.16);
  --ahc-row-hover: rgba(56, 189, 248, 0.08);
  --ahc-now: #60a5fa;

  --ahc-chip-height: 40px;
  --ahc-touch-target: 44px;
  --ahc-mobile-breakpoint: 760px;

  display: block;
  font-family: var(--ahc-font-family);
}

:host([hidden]) {
  display: none;
}

/* Root */
.ahc {
  direction: rtl;
  box-sizing: border-box;
  position: relative;
  display: grid;
  gap: var(--ahc-gap-md);
  padding: var(--ahc-gap-lg);
  color: var(--ahc-text);
  background:
    radial-gradient(circle at 92% 0%, rgba(14, 165, 233, 0.22), transparent 34%),
    radial-gradient(circle at 4% 12%, rgba(124, 58, 237, 0.14), transparent 28%),
    linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.90));
  border: 1px solid var(--ahc-border);
  border-radius: var(--ahc-radius-lg);
  box-shadow: var(--ahc-shadow-soft);
  overflow: hidden;
  isolation: isolate;
}

.ahc *,
.ahc *::before,
.ahc *::after {
  box-sizing: border-box;
}

.ahc[dir="ltr"] {
  direction: ltr;
}

.ahc::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(90deg, rgba(255,255,255,0.035), transparent 18%, transparent 82%, rgba(255,255,255,0.025)),
    linear-gradient(180deg, rgba(255,255,255,0.055), transparent 18%);
  z-index: -1;
}

.ahc--panel {
  min-height: min(100svh, 920px);
  inline-size: 100%;
}

.ahc--fullscreen {
  position: fixed;
  inset: 0;
  z-index: 2147483640;
  min-height: 100svh;
  border-radius: 0;
  padding:
    max(var(--ahc-gap-lg), env(safe-area-inset-top))
    max(var(--ahc-gap-lg), env(safe-area-inset-right))
    max(var(--ahc-gap-lg), env(safe-area-inset-bottom))
    max(var(--ahc-gap-lg), env(safe-area-inset-left));
  background: linear-gradient(145deg, #020617, #0f172a 45%, #0b1221);
}

/* Top bar */
.ahc__topbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: var(--ahc-gap-md);
  align-items: start;
}

.ahc__title-block {
  display: grid;
  grid-auto-flow: row;
  gap: var(--ahc-gap-xs);
  justify-items: end;
  text-align: end;
}

.ahc__title-row {
  display: inline-flex;
  flex-direction: row-reverse;
  align-items: center;
  gap: var(--ahc-gap-sm);
}

.ahc__icon-badge {
  display: inline-grid;
  place-items: center;
  min-inline-size: 48px;
  min-block-size: 48px;
  border-radius: var(--ahc-radius-md);
  background: linear-gradient(180deg, rgba(56, 189, 248, 0.24), rgba(37, 99, 235, 0.20));
  border: 1px solid rgba(56, 189, 248, 0.42);
  color: var(--ahc-accent);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.11), 0 10px 28px rgba(14, 165, 233, 0.10);
}

.ahc__title {
  margin: 0;
  color: var(--ahc-text);
  font-size: 1.75rem;
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: 0;
}

.ahc__subtitle {
  margin: 0;
  color: var(--ahc-muted);
  font-size: 0.92rem;
  line-height: 1.45;
}

.ahc__toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: var(--ahc-gap-sm);
  min-inline-size: min(720px, 100%);
}

.ahc__search {
  position: relative;
  inline-size: min(320px, 100%);
}

.ahc__search-input {
  inline-size: 100%;
  min-block-size: var(--ahc-touch-target);
  border-radius: var(--ahc-radius-sm);
  border: 1px solid var(--ahc-border-soft);
  background: rgba(2, 6, 23, 0.42);
  color: var(--ahc-text);
  padding-block: 0;
  padding-inline: 44px 16px;
  outline: none;
  text-align: start;
  font: inherit;
}

.ahc__search-input::placeholder {
  color: color-mix(in srgb, var(--ahc-muted) 82%, transparent 18%);
}

.ahc__search-icon {
  position: absolute;
  inset-block-start: 50%;
  inset-inline-start: 14px;
  transform: translateY(-50%);
  color: var(--ahc-muted);
  pointer-events: none;
}

.ahc[dir="rtl"] .ahc__search-input {
  padding-inline: 16px 44px;
}

.ahc[dir="rtl"] .ahc__search-icon {
  inset-inline-start: auto;
  inset-inline-end: 14px;
}

/* Buttons and chips */
.ahc__button,
.ahc__chip,
.ahc__segmented-button {
  appearance: none;
  min-block-size: var(--ahc-chip-height);
  min-inline-size: var(--ahc-touch-target);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-sm);
  background: rgba(15, 23, 42, 0.58);
  color: var(--ahc-muted);
  font: inherit;
  font-size: 0.92rem;
  line-height: 1;
  padding-block: 0;
  padding-inline: 16px;
  cursor: pointer;
  user-select: none;
  transition: background 160ms ease, color 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.ahc__button:hover,
.ahc__chip:hover,
.ahc__segmented-button:hover {
  color: var(--ahc-text);
  border-color: color-mix(in srgb, var(--ahc-accent) 46%, var(--ahc-border-soft));
  background: rgba(30, 41, 59, 0.72);
}

.ahc__button:focus-visible,
.ahc__chip:focus-visible,
.ahc__segmented-button:focus-visible,
.ahc__search-input:focus-visible,
.ahc__row-action:focus-visible,
.ahc-filter-option:focus-visible {
  outline: 2px solid var(--ahc-focus);
  outline-offset: 2px;
}

.ahc__chip[aria-pressed="true"],
.ahc__segmented-button[aria-pressed="true"],
.ahc__chip--active,
.ahc__button--primary {
  color: #e0f2fe;
  border-color: rgba(56, 189, 248, 0.75);
  background: linear-gradient(180deg, rgba(14, 165, 233, 0.30), rgba(37, 99, 235, 0.18));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 8px 22px rgba(14, 165, 233, 0.10);
}

.ahc__button--ghost {
  background: rgba(2, 6, 23, 0.34);
}

.ahc__button-icon {
  inline-size: 20px;
  block-size: 20px;
  flex: 0 0 auto;
}

.ahc__segmented {
  display: inline-flex;
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-sm);
  overflow: hidden;
  background: rgba(2, 6, 23, 0.30);
}

.ahc__segmented-button {
  border: 0;
  border-radius: 0;
  background: transparent;
  min-inline-size: 84px;
}

.ahc__segmented-button + .ahc__segmented-button {
  border-inline-start: 1px solid var(--ahc-border-soft);
}

/* Filters */
.ahc__filters {
  display: grid;
  gap: var(--ahc-gap-sm);
  padding: var(--ahc-gap-md);
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-md);
  background: rgba(15, 23, 42, 0.46);
}

.ahc__filter-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: var(--ahc-gap-xs);
}

.ahc__filter-label {
  color: var(--ahc-muted);
  font-size: 0.82rem;
  font-weight: 700;
  margin-inline-end: 2px;
}

/* Summary */
.ahc__summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ahc-gap-md);
}

.ahc__metric {
  min-block-size: 92px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--ahc-gap-md);
  padding: var(--ahc-gap-md);
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-md);
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.54), rgba(15, 23, 42, 0.58));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.045);
}

.ahc__metric-copy {
  min-inline-size: 0;
  text-align: end;
}

.ahc__metric-label {
  display: block;
  color: var(--ahc-muted);
  font-size: 0.82rem;
  font-weight: 700;
  margin-block-end: 4px;
}

.ahc__metric-value {
  display: block;
  color: var(--ahc-text);
  font-size: 1.8rem;
  line-height: 1.05;
  font-weight: 850;
  letter-spacing: 0;
}

.ahc__metric-value--positive {
  color: var(--ahc-on);
}

.ahc__metric-subtitle {
  display: block;
  color: var(--ahc-muted);
  font-size: 0.78rem;
  line-height: 1.35;
  margin-block-start: 6px;
}

.ahc__metric-icon {
  display: inline-grid;
  place-items: center;
  inline-size: 52px;
  block-size: 52px;
  border-radius: 18px;
  border: 1px solid var(--ahc-border-soft);
  background: rgba(2, 6, 23, 0.22);
  color: var(--ahc-accent);
}

/* Layout body */
.ahc__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 320px);
  gap: var(--ahc-gap-md);
  align-items: stretch;
}

.ahc__body--no-insights {
  grid-template-columns: minmax(0, 1fr);
}

.ahc__main {
  min-inline-size: 0;
  display: grid;
  gap: var(--ahc-gap-md);
}

.ahc__insights {
  display: grid;
  gap: var(--ahc-gap-sm);
  align-content: start;
  padding: var(--ahc-gap-md);
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-md);
  background: linear-gradient(180deg, rgba(30, 41, 59, 0.50), rgba(15, 23, 42, 0.52));
}

.ahc__insights-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ahc-gap-sm);
  margin: 0 0 var(--ahc-gap-xs);
  color: var(--ahc-text);
  font-size: 1.05rem;
  font-weight: 800;
}

.ahc__insight-card {
  padding: var(--ahc-gap-md);
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-md);
  background: rgba(15, 23, 42, 0.52);
}

.ahc__insight-kicker {
  display: block;
  color: var(--ahc-muted);
  font-size: 0.78rem;
  font-weight: 700;
  margin-block-end: 8px;
}

.ahc__insight-value {
  display: block;
  color: var(--ahc-text);
  font-size: 1.3rem;
  font-weight: 850;
}

.ahc__insight-subtitle {
  display: block;
  color: var(--ahc-muted);
  font-size: 0.78rem;
  margin-block-start: 6px;
}

/* Timeline */
.ahc-timeline-card {
  min-inline-size: 0;
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-md);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.66), rgba(2, 6, 23, 0.34));
  overflow: hidden;
}

.ahc-timeline-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ahc-gap-sm);
  padding: var(--ahc-gap-md);
  border-block-end: 1px solid var(--ahc-border-soft);
}

.ahc-timeline-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--ahc-text);
}

.ahc-timeline-scroll {
  inline-size: 100%;
  overflow: auto;
  overscroll-behavior-inline: contain;
  scrollbar-color: rgba(56, 189, 248, 0.42) rgba(15, 23, 42, 0.30);
}

.ahc-timeline {
  direction: ltr;
  position: relative;
  min-inline-size: 860px;
  padding: 0;
}

.ahc-timeline__axis {
  position: sticky;
  inset-block-start: 0;
  z-index: 3;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  min-block-size: 44px;
  background: rgba(15, 23, 42, 0.88);
  backdrop-filter: blur(14px);
  border-block-end: 1px solid var(--ahc-border-soft);
}

.ahc-timeline__axis-spacer {
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-inline: var(--ahc-gap-md);
  color: var(--ahc-muted);
  font-size: 0.8rem;
}

.ahc-timeline__ticks {
  position: relative;
  min-block-size: 44px;
}

.ahc-timeline__tick {
  position: absolute;
  inset-block: 0;
  transform: translateX(-50%);
  color: var(--ahc-muted);
  font-size: 0.78rem;
  display: grid;
  place-items: center;
  min-inline-size: 48px;
}

.ahc-timeline__tick::after {
  content: "";
  position: absolute;
  inset-block-end: 0;
  inline-size: 1px;
  block-size: 12px;
  background: var(--ahc-grid-line);
}

.ahc-group {
  direction: rtl;
  border-block-end: 1px solid rgba(148, 163, 184, 0.10);
}

.ahc-group__header {
  position: sticky;
  inset-inline-end: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ahc-gap-sm);
  min-block-size: 56px;
  padding-block: 0;
  padding-inline: var(--ahc-gap-md);
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.78), rgba(30, 41, 59, 0.70));
}

.ahc-group__title {
  display: flex;
  align-items: center;
  gap: var(--ahc-gap-xs);
  color: var(--ahc-text);
  font-weight: 850;
}

.ahc-group__meta {
  color: var(--ahc-muted);
  font-size: 0.78rem;
}

.ahc-row {
  direction: ltr;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  min-block-size: 40px;
  border-block-start: 1px solid rgba(148, 163, 184, 0.09);
}

.ahc-row:hover {
  background: var(--ahc-row-hover);
}

.ahc-row__label {
  direction: rtl;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--ahc-gap-xs);
  padding-inline: var(--ahc-gap-md) var(--ahc-gap-sm);
  border-inline-end: 1px solid rgba(148, 163, 184, 0.12);
  background: rgba(2, 6, 23, 0.18);
  min-inline-size: 0;
}

.ahc-row__icon {
  color: var(--ahc-accent);
}

.ahc-row__name {
  min-inline-size: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--ahc-text);
  font-weight: 700;
  font-size: 0.86rem;
}

.ahc-row__state-chip {
  justify-self: end;
  border-radius: 999px;
  padding-block: 3px;
  padding-inline: 8px;
  color: var(--ahc-text);
  font-size: 0.72rem;
  font-weight: 800;
  background: rgba(148, 163, 184, 0.14);
  border: 1px solid rgba(148, 163, 184, 0.18);
}

.ahc-row__state-chip[data-state="on"] { color: #bbf7d0; background: rgba(34,197,94,0.16); border-color: rgba(34,197,94,0.28); }
.ahc-row__state-chip[data-state="cooling"] { color: #bae6fd; background: rgba(56,189,248,0.14); border-color: rgba(56,189,248,0.30); }
.ahc-row__state-chip[data-state="heating"] { color: #fed7aa; background: rgba(251,146,60,0.16); border-color: rgba(251,146,60,0.30); }
.ahc-row__state-chip[data-state="playing"] { color: #ddd6fe; background: rgba(167,139,250,0.16); border-color: rgba(167,139,250,0.30); }

.ahc-row__track {
  direction: ltr;
  position: relative;
  min-inline-size: 0;
  min-block-size: 40px;
  background-image: linear-gradient(to right, var(--ahc-grid-line) 1px, transparent 1px);
  background-size: calc(100% / 8) 100%;
}

.ahc-row__svg {
  position: absolute;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  overflow: visible;
}

.ahc-row__svg-track {
  stroke: var(--ahc-track);
  stroke-width: 8;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.ahc-segment-svg {
  cursor: pointer;
  stroke: rgba(255,255,255,0.20);
  stroke-width: 0.8;
  vector-effect: non-scaling-stroke;
  filter: drop-shadow(0 3px 7px rgba(0,0,0,0.22));
}

.ahc-segment-svg:focus-visible {
  outline: 2px solid var(--ahc-focus);
  outline-offset: 3px;
}

.ahc-segment-svg[data-category="on"] { fill: var(--ahc-on); }
.ahc-segment-svg[data-category="off"] { fill: var(--ahc-off); }
.ahc-segment-svg[data-category="cooling"] { fill: var(--ahc-cooling); }
.ahc-segment-svg[data-category="heating"] { fill: var(--ahc-heating); }
.ahc-segment-svg[data-category="playing"] { fill: var(--ahc-playing); }
.ahc-segment-svg[data-category="opening"] { fill: var(--ahc-opening); }
.ahc-segment-svg[data-category="closing"] { fill: var(--ahc-closing); }
.ahc-segment-svg[data-category="idle"] { fill: var(--ahc-idle); }
.ahc-segment-svg[data-category="unknown"] { fill: var(--ahc-unknown); stroke-dasharray: 3 2; }

.ahc-row__track::before {
  content: "";
  position: absolute;
  inset-inline: 10px;
  inset-block-start: 50%;
  block-size: 8px;
  transform: translateY(-50%);
  border-radius: 999px;
  background: var(--ahc-track);
}

.ahc-segment {
  position: absolute;
  inset-block-start: 50%;
  block-size: 12px;
  transform: translateY(-50%);
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow: 0 1px 0 rgba(255,255,255,0.08) inset, 0 6px 16px rgba(0,0,0,0.18);
  cursor: pointer;
}

.ahc-segment:focus-visible {
  outline: 2px solid var(--ahc-focus);
  outline-offset: 3px;
}

.ahc-segment[data-category="on"] { background: linear-gradient(90deg, var(--ahc-on), color-mix(in srgb, var(--ahc-on) 72%, #0f172a)); }
.ahc-segment[data-category="off"] { background: linear-gradient(90deg, var(--ahc-off), color-mix(in srgb, var(--ahc-off) 72%, #0f172a)); }
.ahc-segment[data-category="cooling"] { background: linear-gradient(90deg, var(--ahc-cooling), color-mix(in srgb, var(--ahc-cooling) 70%, #1d4ed8)); }
.ahc-segment[data-category="heating"] { background: linear-gradient(90deg, var(--ahc-heating), color-mix(in srgb, var(--ahc-heating) 70%, #7c2d12)); }
.ahc-segment[data-category="playing"] { background: linear-gradient(90deg, var(--ahc-playing), color-mix(in srgb, var(--ahc-playing) 68%, #312e81)); }
.ahc-segment[data-category="opening"] { background: linear-gradient(90deg, var(--ahc-opening), color-mix(in srgb, var(--ahc-opening) 70%, #713f12)); }
.ahc-segment[data-category="closing"] { background: linear-gradient(90deg, var(--ahc-closing), color-mix(in srgb, var(--ahc-closing) 70%, #334155)); }
.ahc-segment[data-category="idle"] { background: linear-gradient(90deg, var(--ahc-idle), color-mix(in srgb, var(--ahc-idle) 70%, #0f766e)); }
.ahc-segment[data-category="unknown"] { background: repeating-linear-gradient(90deg, var(--ahc-unknown), var(--ahc-unknown) 6px, transparent 6px, transparent 10px); }

.ahc-now-line {
  position: absolute;
  inset-block: 0;
  inline-size: 2px;
  background: var(--ahc-now);
  box-shadow: 0 0 0 1px rgba(96,165,250,0.25), 0 0 22px rgba(96,165,250,0.42);
  pointer-events: none;
  z-index: 4;
}

.ahc-now-line__label {
  position: absolute;
  inset-block-start: 8px;
  transform: translateX(-50%);
  padding-block: 2px;
  padding-inline: 8px;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.72);
  color: #dbeafe;
  font-size: 0.72rem;
  font-weight: 800;
  white-space: nowrap;
}

/* Legend */
.ahc-legend {
  direction: rtl;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--ahc-gap-md);
  flex-wrap: wrap;
  padding: var(--ahc-gap-md);
  color: var(--ahc-muted);
  font-size: 0.82rem;
}

.ahc-legend__item {
  display: inline-flex;
  align-items: center;
  gap: 7px;
}

.ahc-legend__swatch {
  inline-size: 24px;
  block-size: 8px;
  border-radius: 999px;
  background: var(--swatch, var(--ahc-accent));
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.14);
}

/* Tooltip / popover */
.ahc-popover {
  direction: rtl;
  position: fixed;
  z-index: 2147483641;
  max-inline-size: min(320px, calc(100vw - 32px));
  padding: var(--ahc-gap-md);
  border: 1px solid var(--ahc-border);
  border-radius: var(--ahc-radius-md);
  background: rgba(15, 23, 42, 0.96);
  color: var(--ahc-text);
  box-shadow: var(--ahc-shadow);
  backdrop-filter: blur(18px);
}

.ahc-popover__title {
  margin: 0 0 var(--ahc-gap-xs);
  font-size: 1rem;
  font-weight: 850;
}

.ahc-popover__dl {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 6px 14px;
  margin: 0;
  font-size: 0.86rem;
}

.ahc-popover__dt {
  color: var(--ahc-muted);
}

.ahc-popover__dd {
  margin: 0;
  color: var(--ahc-text);
  text-align: end;
}

/* Mobile filter sheet */
.ahc-filter-sheet-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483638;
  background: rgba(2, 6, 23, 0.62);
  backdrop-filter: blur(4px);
}

.ahc-filter-sheet {
  direction: rtl;
  position: fixed;
  inset-inline: max(12px, env(safe-area-inset-left)) max(12px, env(safe-area-inset-right));
  inset-block-end: 0;
  z-index: 2147483639;
  inline-size: min(720px, calc(100vw - 24px));
  margin-inline: auto;
  max-block-size: min(88svh, 900px);
  overflow: auto;
  padding:
    var(--ahc-gap-lg)
    max(var(--ahc-gap-lg), env(safe-area-inset-right))
    max(var(--ahc-gap-lg), env(safe-area-inset-bottom))
    max(var(--ahc-gap-lg), env(safe-area-inset-left));
  border-start-start-radius: var(--ahc-radius-xl);
  border-start-end-radius: var(--ahc-radius-xl);
  border: 1px solid var(--ahc-border);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.98), rgba(2, 6, 23, 0.98));
  color: var(--ahc-text);
  box-shadow: 0 -24px 80px rgba(0,0,0,0.46);
}

.ahc-filter-sheet__handle {
  inline-size: 72px;
  block-size: 5px;
  margin-inline: auto;
  margin-block-end: var(--ahc-gap-md);
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.50);
}

.ahc-filter-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ahc-gap-sm);
  margin-block-end: var(--ahc-gap-md);
}

.ahc-filter-sheet__title {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 850;
}

.ahc-filter-section {
  display: grid;
  gap: var(--ahc-gap-sm);
  padding: var(--ahc-gap-md);
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-md);
  background: rgba(30, 41, 59, 0.34);
  margin-block-end: var(--ahc-gap-md);
}

.ahc-filter-section__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--ahc-gap-xs);
}

.ahc-filter-section__title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ahc-gap-sm);
  color: var(--ahc-text);
  font-weight: 850;
}

.ahc-filter-option {
  appearance: none;
  display: grid;
  gap: 4px;
  min-block-size: 64px;
  padding-block: 10px;
  padding-inline: 16px;
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-sm);
  background: rgba(15, 23, 42, 0.46);
  color: var(--ahc-text);
  text-align: start;
  font: inherit;
  cursor: pointer;
}

.ahc-filter-option small {
  color: var(--ahc-muted);
  font-size: 0.78rem;
}

.ahc-filter-option[aria-pressed="true"] {
  border-color: rgba(56, 189, 248, 0.75);
  background: linear-gradient(180deg, rgba(14, 165, 233, 0.24), rgba(37, 99, 235, 0.16));
}

.ahc__search--sheet {
  inline-size: 100%;
}

.ahc-filter-sheet__footer {
  position: sticky;
  inset-block-end: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.35fr);
  gap: var(--ahc-gap-sm);
  padding-block-start: var(--ahc-gap-md);
  background: linear-gradient(180deg, transparent, rgba(2,6,23,0.95) 22%);
}

/* Empty/loading/error */
.ahc-state-card {
  display: grid;
  place-items: center;
  min-block-size: 220px;
  padding: var(--ahc-gap-xl);
  border: 1px dashed var(--ahc-border-soft);
  border-radius: var(--ahc-radius-md);
  color: var(--ahc-muted);
  text-align: center;
}

.ahc-state-card__title {
  margin: 0 0 var(--ahc-gap-xs);
  color: var(--ahc-text);
  font-weight: 850;
}

.ahc-state-card__yaml {
  direction: ltr;
  text-align: left;
  max-inline-size: min(520px, 100%);
  margin: var(--ahc-gap-md) auto 0;
  padding: var(--ahc-gap-md);
  overflow: auto;
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-sm);
  background: rgba(2, 6, 23, 0.34);
  color: var(--ahc-text);
  font-size: 0.82rem;
}

.ahc-debug {
  display: grid;
  gap: var(--ahc-gap-sm);
  padding: var(--ahc-gap-md);
  border: 1px dashed rgba(56, 189, 248, 0.42);
  border-radius: var(--ahc-radius-md);
  background: rgba(2, 6, 23, 0.32);
  color: var(--ahc-muted);
  font-size: 0.82rem;
}

.ahc-debug__header {
  display: flex;
  justify-content: space-between;
  gap: var(--ahc-gap-sm);
  color: var(--ahc-text);
}

.ahc-debug__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--ahc-gap-xs);
  margin: 0;
}

.ahc-debug__grid div {
  display: grid;
  gap: 2px;
  padding: var(--ahc-gap-xs);
  border-radius: var(--ahc-radius-xs);
  background: rgba(15, 23, 42, 0.42);
}

.ahc-debug dt,
.ahc-debug dd {
  margin: 0;
}

.ahc-debug dd {
  color: var(--ahc-text);
  font-weight: 800;
}

.ahc-debug__meta {
  margin: 0;
  overflow-wrap: anywhere;
}

/* Responsive */
@media (max-width: 1100px) {
  .ahc__body {
    grid-template-columns: minmax(0, 1fr);
  }

  .ahc__insights {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ahc__insights-title {
    grid-column: 1 / -1;
  }
}

@media (max-width: 760px) {
  :host {
    --ahc-chip-height: 44px;
  }

  .ahc {
    min-block-size: 100svh;
    border-radius: var(--ahc-radius-md);
    padding: var(--ahc-gap-md);
    gap: var(--ahc-gap-md);
  }

  .ahc--panel,
  .ahc--fullscreen {
    border-radius: 0;
    min-block-size: 100svh;
    padding:
      max(12px, env(safe-area-inset-top))
      max(12px, env(safe-area-inset-right))
      max(12px, env(safe-area-inset-bottom))
      max(12px, env(safe-area-inset-left));
  }

  .ahc__topbar {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .ahc__title-block {
    order: -1;
    justify-items: center;
    text-align: center;
  }

  .ahc__title {
    font-size: 1.45rem;
  }

  .ahc__toolbar {
    justify-content: center;
    min-inline-size: 0;
  }

  .ahc__search {
    inline-size: 100%;
  }

  .ahc__filters {
    padding: 0;
    border: 0;
    background: transparent;
    overflow: hidden;
  }

  .ahc__filter-row {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    padding-block: 2px 8px;
    scroll-snap-type: x proximity;
    scrollbar-width: none;
  }

  .ahc__filter-row::-webkit-scrollbar {
    display: none;
  }

  .ahc__filter-row > * {
    flex: 0 0 auto;
    scroll-snap-align: start;
  }

  .ahc__filter-label {
    min-inline-size: max-content;
  }

  .ahc__summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--ahc-gap-sm);
  }

  .ahc__metric {
    min-block-size: 104px;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: var(--ahc-gap-sm);
  }

  .ahc__metric-icon {
    inline-size: 44px;
    block-size: 44px;
    border-radius: 14px;
  }

  .ahc__insights {
    display: none;
  }

  .ahc-timeline-card {
    border-radius: var(--ahc-radius-md);
    background: transparent;
    border: 0;
  }

  .ahc-timeline-toolbar {
    position: sticky;
    inset-block-start: 0;
    z-index: 5;
    background: rgba(15, 23, 42, 0.88);
    backdrop-filter: blur(14px);
  }

  .ahc-timeline {
    min-inline-size: 760px;
  }

  .ahc-timeline__groups {
    display: grid;
    gap: var(--ahc-gap-md);
    padding: var(--ahc-gap-sm);
  }

  .ahc-group {
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    overflow: hidden;
    background: linear-gradient(180deg, rgba(30, 41, 59, 0.48), rgba(15, 23, 42, 0.58));
  }

  .ahc-group__header {
    position: static;
    min-block-size: 64px;
  }

  .ahc-timeline__axis,
  .ahc-row {
    grid-template-columns: 180px minmax(560px, 1fr);
  }

  .ahc-row {
    min-block-size: 46px;
  }

  .ahc-row__label {
    padding-inline: var(--ahc-gap-sm);
  }

  .ahc-row__state-chip {
    display: inline-flex;
    min-block-size: 28px;
    align-items: center;
  }

  .ahc-legend {
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-inline: var(--ahc-gap-sm);
  }

  .ahc-popover {
    inset-inline: 12px !important;
    inset-block-end: 12px !important;
    inset-block-start: auto !important;
    max-inline-size: none;
  }

  .ahc-filter-sheet {
    inset-inline: max(10px, env(safe-area-inset-left)) max(10px, env(safe-area-inset-right));
    inline-size: auto;
    max-block-size: min(86svh, 820px);
    border-start-start-radius: 28px;
    border-start-end-radius: 28px;
  }

  .ahc-filter-section__chips {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 420px) {
  .ahc__summary-grid {
    grid-template-columns: 1fr 1fr;
  }

  .ahc__metric-value {
    font-size: 1.32rem;
  }

  .ahc-timeline__axis,
  .ahc-row {
    grid-template-columns: 164px minmax(540px, 1fr);
  }

  .ahc-row__name {
    font-size: 0.80rem;
  }
}

/* Motion & contrast */
@media (prefers-reduced-motion: reduce) {
  .ahc *,
  .ahc *::before,
  .ahc *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}

@media (forced-colors: active) {
  .ahc,
  .ahc__metric,
  .ahc__filters,
  .ahc-timeline-card,
  .ahc__insights,
  .ahc-filter-sheet,
  .ahc-popover {
    border: 1px solid CanvasText;
    background: Canvas;
    color: CanvasText;
  }

  .ahc__button,
  .ahc__chip,
  .ahc__segmented-button {
    border: 1px solid ButtonText;
    background: ButtonFace;
    color: ButtonText;
  }

  .ahc-segment {
    border: 2px solid CanvasText;
  }
}

/* Optional compact mode for many entities */
.ahc--dense .ahc-row {
  min-block-size: 30px;
}

.ahc--dense .ahc-row__track {
  min-block-size: 30px;
}

.ahc--dense .ahc-segment {
  block-size: 8px;
}

.ahc--dense .ahc-row__state-chip {
  display: none;
}

`;
function N(a) {
  const e = a.flatMap((l) => l.rows), i = e.flatMap((l) => l.segments.filter((h) => h.active)), t = i.reduce((l, h) => l + h.durationMs, 0), s = i.length, r = Date.now(), n = e.filter((l) => l.segments.some((h) => h.active && h.start.getTime() <= r && h.end.getTime() >= r - 9e4)).length, c = [...i].sort((l, h) => h.start.getTime() - l.start.getTime())[0], o = [...e].sort((l, h) => h.totalActiveMs - l.totalActiveMs)[0], d = [...a].sort((l, h) => h.totalActiveMs - l.totalActiveMs)[0];
  return {
    totalActiveMs: t,
    eventCount: s,
    activeNowCount: n,
    lastEvent: c,
    mostActiveEntity: o,
    mostActiveArea: d,
    peakBucketLabel: jt(i)
  };
}
function jt(a) {
  if (!a.length) return;
  const e = new Array(24).fill(0);
  for (const s of a) {
    const r = s.start.getHours();
    e[r] = (e[r] ?? 0) + s.durationMs;
  }
  const i = Math.max(...e), t = e.indexOf(i);
  if (!(t < 0))
    return `${String(t).padStart(2, "0")}:00 – ${String((t + 1) % 24).padStart(2, "0")}:00`;
}
class qt extends S {
  constructor() {
    super(...arguments), this._config = { type: "custom:activity-history-card" }, this._areas = [], this._labels = [], this._domains = I, this._loadedOptions = !1;
  }
  static {
    this.styles = ze`
    :host {
      display: block;
      color: var(--primary-text-color, #e5e7eb);
      font-family: var(--primary-font-family, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif);
      direction: rtl;
    }

    .editor {
      display: grid;
      gap: 16px;
      padding: 16px;
    }

    .section {
      display: grid;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--divider-color, rgba(148, 163, 184, 0.24));
      border-radius: 12px;
      background: color-mix(in srgb, var(--card-background-color, #111827) 88%, transparent);
    }

    h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
    }

    label {
      display: grid;
      gap: 6px;
      font-size: 0.92rem;
    }

    .row {
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .check-grid {
      display: grid;
      gap: 8px;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    }

    .check {
      display: flex;
      align-items: center;
      gap: 8px;
      min-block-size: 40px;
      padding-inline: 10px;
      border: 1px solid var(--divider-color, rgba(148, 163, 184, 0.24));
      border-radius: 10px;
      background: rgba(15, 23, 42, 0.08);
    }

    input[type="text"],
    input[type="number"],
    select {
      min-block-size: 40px;
      border: 1px solid var(--divider-color, rgba(148, 163, 184, 0.34));
      border-radius: 10px;
      padding-inline: 10px;
      background: var(--card-background-color, #111827);
      color: var(--primary-text-color, #e5e7eb);
      font: inherit;
    }

    .hint {
      margin: 0;
      color: var(--secondary-text-color, #94a3b8);
      font-size: 0.82rem;
      line-height: 1.45;
    }

    @media (max-width: 640px) {
      .row {
        grid-template-columns: 1fr;
      }
    }
  `;
  }
  setConfig(e) {
    this._config = {
      ...e,
      type: "custom:activity-history-card",
      auto_discover: e.auto_discover ?? !0,
      hours_to_show: e.hours_to_show ?? v.hours_to_show,
      display_mode: e.display_mode ?? v.display_mode,
      group_by: e.group_by ?? v.group_by
    }, this.requestUpdate();
  }
  set hass(e) {
    this._hass = e, this._loadedOptions || (this._loadedOptions = !0, this._loadOptions());
  }
  render() {
    const e = this._config, i = e.domains?.length ? e.domains : I;
    return u`
      <div class="editor">
        <section class="section">
          <h3>הגדרות כלליות</h3>
          <div class="row">
            <label>
              כותרת
              <input type="text" .value=${e.title ?? v.title} @input=${(t) => this._setValue("title", X(t))} />
            </label>
            <label>
              טווח שעות
              <input type="number" min="1" max="168" .value=${String(e.hours_to_show ?? 24)} @input=${(t) => this._setNumber("hours_to_show", X(t))} />
            </label>
          </div>
          <div class="row">
            <label>
              מצב תצוגה
              <select .value=${e.display_mode ?? "panel"} @change=${(t) => this._setValue("display_mode", X(t))}>
                <option value="card">כרטיס רגיל</option>
                <option value="panel">פאנל</option>
                <option value="fullscreen">מסך מלא</option>
              </select>
            </label>
            <label class="check">
              <input type="checkbox" .checked=${e.mock_data === !0} @change=${(t) => this._setChecked("mock_data", t)} />
              נתוני דוגמה
            </label>
          </div>
          <label class="check">
            <input type="checkbox" .checked=${e.debug === !0} @change=${(t) => this._setChecked("debug", t)} />
            הצג דיאגנוסטיקה
          </label>
          <label class="check">
            <input type="checkbox" .checked=${e.auto_discover !== !1} @change=${(t) => this._setChecked("auto_discover", t)} />
            משוך אוטומטית רכיבים שמשויכים לאזורים
          </label>
          <p class="hint">כאשר האפשרות פעילה ואין רשימת entities ידנית, הכרטיס מאתר ישויות לפי אזורי Home Assistant ומסנן לפי הדומיינים והלייבלים שבחרת.</p>
        </section>

        <section class="section">
          <h3>דומיינים להצגה</h3>
          <div class="check-grid">
            ${this._domains.map((t) => this._renderArrayCheckbox("domains", t, q[t] ?? t, i.includes(t)))}
          </div>
          <p class="hint">אם לא תבחר ידנית, הכרטיס משתמש בדומיינים שימושיים לפעילות כמו תאורה, מתגים, מזגנים, תריסים וחיישנים בינאריים.</p>
        </section>

        <section class="section">
          <h3>אזורים</h3>
          ${this._areas.length ? u`<div class="check-grid">
                ${this._areas.map((t) => this._renderArrayCheckbox("areas", t.name, t.name, (e.areas ?? []).includes(t.name) || (e.areas ?? []).includes(t.area_id)))}
              </div>` : u`<p class="hint">לא נטענו אזורים מה־registry. אפשר עדיין לערוך YAML ידנית.</p>`}
          <p class="hint">אם לא נבחר אזור, יוצגו כל האזורים שיש להם רכיבים מתאימים.</p>
        </section>

        <section class="section">
          <h3>לייבלים</h3>
          ${this._labels.length ? this._renderLabelControls(e) : u`<p class="hint">לא נמצאו labels ב־Home Assistant, או שהגרסה לא תומכת ב־label registry.</p>`}
        </section>
      </div>
    `;
  }
  _renderLabelControls(e) {
    return u`
      <p class="hint">בחר labels להצגה או להסתרה. הסתרה גוברת על הצגה, כך שאפשר למשל להסתיר "לא להצגה" או "רכיבים מוגנים".</p>
      <h3>הצג רק labels אלה</h3>
      <div class="check-grid">
        ${this._labels.map((i) => this._renderArrayCheckbox("include_labels", i.name, i.name, (e.include_labels ?? []).includes(i.name) || (e.include_labels ?? []).includes(i.label_id)))}
      </div>
      <h3>הסתר labels אלה</h3>
      <div class="check-grid">
        ${this._labels.map((i) => this._renderArrayCheckbox("exclude_labels", i.name, i.name, (e.exclude_labels ?? []).includes(i.name) || (e.exclude_labels ?? []).includes(i.label_id)))}
      </div>
    `;
  }
  _renderArrayCheckbox(e, i, t, s) {
    return u`
      <label class="check">
        <input type="checkbox" .checked=${s} @change=${(r) => this._toggleArrayValue(e, i, r)} />
        ${t}
      </label>
    `;
  }
  async _loadOptions() {
    if (!this._hass) return;
    const [e, i] = await Promise.all([this._safeRegistryCall("config/area_registry/list"), this._safeRegistryCall("config/label_registry/list")]), t = [...new Set(Object.keys(this._hass.states).map(O))].filter(Boolean).sort();
    this._areas = e.sort((s, r) => s.name.localeCompare(r.name, "he")), this._labels = i.sort((s, r) => s.name.localeCompare(r.name, "he")), this._domains = [.../* @__PURE__ */ new Set([...I, ...t])].sort(), this.requestUpdate();
  }
  async _safeRegistryCall(e) {
    try {
      const i = await this._hass?.callWS({ type: e });
      return Array.isArray(i) ? i : [];
    } catch {
      return [];
    }
  }
  _setValue(e, i) {
    this._emitConfig({ ...this._config, [e]: i });
  }
  _setNumber(e, i) {
    const t = Number(i);
    Number.isFinite(t) && t > 0 && this._emitConfig({ ...this._config, [e]: t });
  }
  _setChecked(e, i) {
    const t = i.target.checked;
    this._emitConfig({ ...this._config, [e]: t });
  }
  _toggleArrayValue(e, i, t) {
    const s = t.target.checked, r = new Set(this._config[e] ?? []);
    s ? r.add(i) : r.delete(i);
    const n = [...r];
    this._emitConfig({
      ...this._config,
      [e]: n.length ? n : void 0
    });
  }
  _emitConfig(e) {
    this._config = e, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: e },
        bubbles: !0,
        composed: !0
      })
    ), this.requestUpdate();
  }
}
function X(a) {
  return a.target.value;
}
customElements.get("activity-history-card-editor") || customElements.define("activity-history-card-editor", qt);
const Gt = "0.1.0";
class Vt extends S {
  constructor() {
    super(...arguments), this._rows = [], this._groups = [], this._loading = !1, this._fullscreen = !1, this._filterSheetOpen = !1, this._usingMockData = !1, this._fetchToken = 0, this._lastFetchKey = "", this._historyCache = /* @__PURE__ */ new Map(), this._filter = {
      search: "",
      areas: [],
      domains: [],
      stateMode: "all",
      groupBy: "area",
      timePreset: "24h"
    }, this._openFilterSheet = () => {
      this._filterSheetOpen = !0, document.addEventListener("keydown", this._onDocumentKeyDown), this.requestUpdate();
    }, this._closeFilterSheet = () => {
      this._filterSheetOpen = !1, this._fullscreen || document.removeEventListener("keydown", this._onDocumentKeyDown), this.requestUpdate();
    }, this._onSearchInput = (e) => {
      const i = e.target;
      this._filter = { ...this._filter, search: i.value }, this._rebuildGroups();
    }, this._clearFilters = () => {
      this._filter = {
        search: "",
        areas: [],
        domains: [],
        stateMode: "all",
        groupBy: this._config.group_by ?? "area",
        timePreset: this._initialTimePreset(this._config)
      }, this._lastFetchKey = "", this._scheduleFetch();
    }, this._toggleFullscreen = async () => {
      const e = !this._fullscreen;
      if (this._fullscreen = e, e) {
        document.addEventListener("keydown", this._onDocumentKeyDown), document.addEventListener("fullscreenchange", this._onFullscreenChange);
        try {
          await this.requestFullscreen();
        } catch {
        }
        await this.updateComplete, this.renderRoot.querySelector(".ahc")?.focus();
      } else
        document.removeEventListener("fullscreenchange", this._onFullscreenChange), this._filterSheetOpen || document.removeEventListener("keydown", this._onDocumentKeyDown), document.fullscreenElement && await document.exitFullscreen().catch(() => {
        });
      this.requestUpdate();
    }, this._onDocumentKeyDown = (e) => {
      if (e.key === "Escape") {
        if (this._filterSheetOpen) {
          this._closeFilterSheet();
          return;
        }
        this._fullscreen && this._toggleFullscreen();
      }
    }, this._onFullscreenChange = () => {
      !document.fullscreenElement && this._fullscreen && (this._fullscreen = !1, document.removeEventListener("fullscreenchange", this._onFullscreenChange), this._filterSheetOpen || document.removeEventListener("keydown", this._onDocumentKeyDown), this.requestUpdate());
    };
  }
  static {
    this.styles = Bt;
  }
  static getConfigElement() {
    return document.createElement("activity-history-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:activity-history-card",
      title: v.title,
      auto_discover: !0,
      display_mode: "panel",
      hours_to_show: 24,
      group_by: "area"
    };
  }
  setConfig(e) {
    if (!e || e.type !== "custom:activity-history-card")
      throw new Error("Invalid card type. Expected custom:activity-history-card");
    const i = this._initialTimePreset(e);
    this._config = {
      ...v,
      ...e,
      view_mode: e.view_mode ?? e.default_view ?? "swimlane",
      group_by: e.group_by ?? v.group_by,
      filters: {
        show: !0,
        show_search: !0,
        show_area_chips: !0,
        show_domain_chips: !0,
        show_state_mode: !0,
        active_only: !1,
        ...e.filters ?? {}
      }
    }, this._filter = {
      search: "",
      areas: this._config.filters?.default_areas ?? [],
      domains: this._config.filters?.default_domains ?? [],
      stateMode: this._config.filters?.active_only ? "active_only" : "all",
      groupBy: this._config.group_by ?? "area",
      timePreset: i
    }, this._lastFetchKey = "", this._historyCache.clear(), this._scheduleFetch();
  }
  set hass(e) {
    this._hass = e, this._scheduleFetch();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsubscribeHistory?.(), this._unsubscribeHistory = void 0, this._fetchDebounce && window.clearTimeout(this._fetchDebounce), document.removeEventListener("keydown", this._onDocumentKeyDown), document.removeEventListener("fullscreenchange", this._onFullscreenChange);
  }
  getCardSize() {
    const e = this._rows.length || (this._config?.entities?.length ?? 3);
    return Math.min(18, Math.max(5, Math.ceil(e * 0.7) + 4));
  }
  getGridOptions() {
    return {
      columns: this._config?.display_mode === "panel" || this._fullscreen ? "full" : 12,
      min_columns: 6,
      rows: this._config?.display_mode === "panel" || this._fullscreen ? 12 : 8,
      min_rows: 5
    };
  }
  render() {
    if (!this._config) return u``;
    const e = this._hass?.locale?.language ?? this._hass?.language, i = ht(this._config.direction ?? this._config.rtl ?? "auto", e), t = [
      "ahc",
      this._config.display_mode === "panel" ? "ahc--panel" : "",
      this._fullscreen || this._config.display_mode === "fullscreen" ? "ahc--fullscreen" : "",
      this._filterSheetOpen ? "ahc--sheet-open" : "",
      this._usingMockData ? "ahc--mock" : "",
      this._rows.length > 40 ? "ahc--dense" : ""
    ].filter(Boolean).join(" ");
    return u`
      <ha-card class=${t} dir=${i ? "rtl" : "ltr"} tabindex=${this._fullscreen ? "0" : "-1"}>
        ${this._renderHeader()} ${this._renderFilters()} ${this._renderSummary()}
        ${this._config.debug ? this._renderDiagnostics() : _}
        <div class=${this._config.show_insights === !1 ? "ahc__body ahc__body--no-insights" : "ahc__body"}>
          <main class="ahc__main">${this._renderMainContent()}</main>
          ${this._config.show_insights === !1 ? _ : this._renderInsights()}
        </div>
        ${this._filterSheetOpen ? this._renderFilterSheet() : _}
      </ha-card>
    `;
  }
  _renderHeader() {
    const e = `${this._timePresetLabel(this._filter.timePreset)} · ${this._usingMockData ? "נתוני דוגמה" : "נתוני Home Assistant"}`;
    return u`
      <header class="ahc__topbar">
        <div class="ahc__toolbar">
          ${this._config.show_fullscreen_button === !1 ? _ : u`
                <button
                  class="ahc__button ahc__button--ghost"
                  type="button"
                  @click=${this._toggleFullscreen}
                  aria-pressed=${this._fullscreen ? "true" : "false"}
                >
                  <span aria-hidden="true">${this._fullscreen ? "×" : "⛶"}</span>
                  <span>${this._fullscreen ? "צא ממסך מלא" : "מסך מלא"}</span>
                </button>
              `}
          <div class="ahc__segmented" aria-label="קיבוץ לפי">
            <button class="ahc__segmented-button" type="button" aria-pressed=${this._filter.groupBy === "area"} @click=${() => this._setGroupBy("area")}>אזור</button>
            <button class="ahc__segmented-button" type="button" aria-pressed=${this._filter.groupBy === "domain"} @click=${() => this._setGroupBy("domain")}>סוג</button>
          </div>
          <div class="ahc__search">
            <span class="ahc__search-icon" aria-hidden="true">⌕</span>
            <input
              class="ahc__search-input"
              type="search"
              .value=${this._filter.search}
              placeholder="חיפוש ישות או אזור..."
              @input=${this._onSearchInput}
            />
          </div>
          <button class="ahc__button ahc__button--ghost ahc__filter-toggle" type="button" @click=${this._openFilterSheet} aria-expanded=${this._filterSheetOpen ? "true" : "false"}>
            <span aria-hidden="true">▾</span><span>סינון</span>
          </button>
        </div>
        <div class="ahc__title-block">
          <div class="ahc__title-row">
            <span class="ahc__icon-badge" aria-hidden="true">▥</span>
            <h2 class="ahc__title">${this._config.title ?? v.title}</h2>
          </div>
          <p class="ahc__subtitle">${e}</p>
        </div>
      </header>
    `;
  }
  _renderFilters() {
    if (this._config.filters?.show === !1) return _;
    const e = this._availableDomains(), i = this._availableAreas();
    return u`
      <section class="ahc__filters" aria-label="מסננים">
        <div class="ahc__filter-row">
          <span class="ahc__filter-label">טווח זמן</span>
          ${this._renderChip("24 שעות", this._filter.timePreset === "24h", () => this._setTimePreset("24h"))}
          ${this._renderChip("7 ימים", this._filter.timePreset === "7d", () => this._setTimePreset("7d"))}
          ${this._renderChip("מותאם", this._filter.timePreset === "custom", () => this._setTimePreset("custom"))}
        </div>
        ${this._config.filters?.show_area_chips === !1 ? _ : u`
              <div class="ahc__filter-row">
                <span class="ahc__filter-label">אזור</span>
                ${this._renderChip("הכל", !this._filter.areas.length, () => this._setAreas([]))}
                ${i.map((t) => this._renderChip(t, this._filter.areas.includes(t), () => this._toggleArea(t)))}
              </div>
            `}
        ${this._config.filters?.show_domain_chips === !1 ? _ : u`
              <div class="ahc__filter-row">
                <span class="ahc__filter-label">סוג ישות</span>
                ${this._renderChip("הכל", !this._filter.domains.length, () => this._setDomains([]))}
                ${e.map((t) => this._renderChip(q[t] ?? t, this._filter.domains.includes(t), () => this._toggleDomain(t)))}
              </div>
            `}
        ${this._config.filters?.show_state_mode === !1 ? _ : u`
              <div class="ahc__filter-row">
                <span class="ahc__filter-label">מצב</span>
                ${this._renderChip("כל המצבים", this._filter.stateMode === "all", () => this._setStateMode("all"))}
                ${this._renderChip("רק פעילים", this._filter.stateMode === "active_only", () => this._setStateMode("active_only"))}
                ${this._renderChip("פעילים עכשיו", this._filter.stateMode === "currently_active", () => this._setStateMode("currently_active"))}
              </div>
            `}
      </section>
    `;
  }
  _renderChip(e, i, t) {
    return u`<button class="ahc__chip" type="button" aria-pressed=${i ? "true" : "false"} @click=${t}>${e}</button>`;
  }
  _renderSummary() {
    if (this._config.show_summary === !1) return _;
    const e = this._summary;
    return u`
      <section class="ahc__summary-grid" aria-label="סיכום פעילות">
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">זמן פעילות</span>
            <span class="ahc__metric-value ahc__metric-value--positive">${M(e?.totalActiveMs ?? 0)}</span>
            <span class="ahc__metric-subtitle">בטווח הנבחר</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◷</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">מספר אירועים</span>
            <span class="ahc__metric-value">${e?.eventCount ?? 0}</span>
            <span class="ahc__metric-subtitle">שינויי מצב פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">פעילים עכשיו</span>
            <span class="ahc__metric-value">${e?.activeNowCount ?? 0}</span>
            <span class="ahc__metric-subtitle">רכיבים פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">●</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירוע אחרון</span>
            <span class="ahc__metric-value">${e?.lastEvent ? $(e.lastEvent.start) : "אין"}</span>
            <span class="ahc__metric-subtitle">${e?.lastEvent?.entity_id ?? "לא נמצאו אירועים"}</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">♫</span>
        </article>
      </section>
    `;
  }
  _renderMainContent() {
    if (this._loading) {
      const i = !this._hass && !this._usingMockData ? "ממתין לחיבור Home Assistant." : "מושך נתוני פעילות מ-Home Assistant.";
      return u`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">טוען היסטוריה...</h3><p>${i}</p></div></div>`;
    }
    if (this._error)
      return u`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">שגיאה בטעינת ההיסטוריה</h3><p>${this._error}</p></div></div>`;
    if (this._emptyReason || !this._groups.length)
      return this._renderEmptyState(this._emptyReason ?? "no_resolved_entities");
    const e = this._resolveRange();
    switch (this._config.view_mode ?? this._config.default_view ?? "swimlane") {
      case "heatmap":
        return Lt();
      case "detail":
        return Ut();
      case "correlation":
        return Ot();
      case "swimlane":
      default:
        return Nt({
          groups: this._groups,
          range: e,
          config: this._config,
          summary: this._summary ?? N(this._groups)
        });
    }
  }
  _renderEmptyState(e) {
    const t = {
      no_entities_selected: {
        title: "לא נבחרו רכיבים",
        body: "הפעל גילוי אוטומטי או הוסף רשימת entities ידנית. בלי אחד מהם הכרטיס לא יודע אילו רכיבים לטעון.",
        yaml: `type: custom:activity-history-card
auto_discover: true
mock_data: false`
      },
      no_resolved_entities: {
        title: "לא נמצאו רכיבים באזורים",
        body: "בדוק שהרכיבים משויכים לאזורים ב-Home Assistant, שהדומיינים שבחרת מתאימים, ושלא סיננת אותם באמצעות labels.",
        yaml: `type: custom:activity-history-card
auto_discover: true
mock_data: false
exclude_labels:
  - לא להצגה`
      },
      no_history_returned: {
        title: "Recorder לא החזיר היסטוריה",
        body: "נמצאו רכיבים, אבל Home Assistant לא החזיר עבורם רשומות בטווח הזמן. נסה להגדיל את הטווח או לבדוק שה-Recorder שומר את הישויות האלה.",
        yaml: `type: custom:activity-history-card
auto_discover: true
hours_to_show: 168`
      },
      history_unusable: {
        title: "היסטוריה לא תקינה להצגה",
        body: "התקבלו רשומות היסטוריה, אבל הן היו חסרות זמן/מצב או לא יצרו מקטעים תקינים. הפעל debug כדי לראות את מספר הרשומות והמקטעים.",
        yaml: `type: custom:activity-history-card
debug: true`
      },
      all_entities_filtered: {
        title: "כל הרכיבים סוננו",
        body: "יש נתונים, אבל המסננים הנוכחיים מסתירים הכל. נקה חיפוש, אזור, סוג ישות או מצב פעיל בלבד.",
        yaml: `type: custom:activity-history-card
auto_discover: true
filters:
  active_only: false`
      }
    }[e], s = e === "no_resolved_entities" && this._diagnostics?.discovery?.unavailableReasons.length ? this._diagnostics.discovery.unavailableReasons.join(", ") : "";
    return u`
      <div class="ahc-state-card">
        <div>
          <h3 class="ahc-state-card__title">${t.title}</h3>
          <p>${t.body}</p>
          ${s ? u`<p>אזהרת discovery: ${s}. אם האזורים לא זמינים, נסה להגדיר entities ידנית או להפעיל debug.</p>` : _}
          <pre class="ahc-state-card__yaml" dir="ltr"><code>${t.yaml}</code></pre>
        </div>
      </div>
    `;
  }
  _renderDiagnostics() {
    const e = this._diagnostics;
    return e ? u`
      <section class="ahc-debug" aria-label="אבחון">
        <div class="ahc-debug__header">
          <strong>Debug</strong>
          <span>${e.cacheHit ? "cache hit" : "loaded"}</span>
        </div>
        <dl class="ahc-debug__grid">
          <div><dt>רכיבים</dt><dd>${e.resolvedEntityCount}</dd></div>
          <div><dt>רשומות</dt><dd>${e.historyRecordCount}</dd></div>
          <div><dt>מקטעים</dt><dd>${e.timelineSegmentCount}</dd></div>
          <div><dt>פעילים</dt><dd>${e.activeTimelineSegmentCount}</dd></div>
          <div><dt>אחרי סינון</dt><dd>${e.filteredRowCount}</dd></div>
          <div><dt>קבוצות</dt><dd>${e.renderedGroupCount}</dd></div>
          <div><dt>attributes</dt><dd>${e.attributesRequested.withAttributes}/${e.attributesRequested.withoutAttributes}</dd></div>
          <div><dt>registry</dt><dd>${e.discovery?.registryAvailable ? "זמין" : "fallback"}</dd></div>
        </dl>
        <p class="ahc-debug__meta" dir="ltr">
          ${e.historyRange ? `${e.historyRange.start.toISOString()} → ${e.historyRange.end.toISOString()}` : "no range"}
        </p>
        <p class="ahc-debug__meta">מסננים: ${JSON.stringify(e.activeFilters)}</p>
        ${e.discovery?.unavailableReasons.length ? u`<p class="ahc-debug__meta">Registry warnings: ${e.discovery.unavailableReasons.join(", ")}</p>` : _}
      </section>
    ` : u`<section class="ahc-debug" aria-label="אבחון"><strong>Debug</strong><span>ממתין לטעינת נתונים...</span></section>`;
  }
  _renderInsights() {
    const e = this._summary;
    return u`
      <aside class="ahc__insights" aria-label="תובנות חכמות">
        <h3 class="ahc__insights-title"><span>תובנות חכמות</span><span aria-hidden="true">✦</span></h3>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">הרכיב הפעיל ביותר</span>
          <span class="ahc__insight-value">${e?.mostActiveEntity?.entity.name ?? "אין נתונים"}</span>
          <span class="ahc__insight-subtitle">${M(e?.mostActiveEntity?.totalActiveMs ?? 0)}</span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">האזור הפעיל ביותר</span>
          <span class="ahc__insight-value">${e?.mostActiveArea?.title ?? "אין נתונים"}</span>
          <span class="ahc__insight-subtitle">${M(e?.mostActiveArea?.totalActiveMs ?? 0)}</span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">שעות שיא</span>
          <span class="ahc__insight-value">${e?.peakBucketLabel ?? "אין נתונים"}</span>
          <span class="ahc__insight-subtitle">לפי משך פעילות</span>
        </article>
      </aside>
    `;
  }
  _renderFilterSheet() {
    const e = this._availableAreas(), i = this._availableDomains();
    return u`
      <div class="ahc-filter-sheet-backdrop" @click=${this._closeFilterSheet}></div>
      <section class="ahc-filter-sheet" role="dialog" aria-modal="true" aria-label="סינון מתקדם">
        <div class="ahc-filter-sheet__handle" aria-hidden="true"></div>
        <header class="ahc-filter-sheet__header">
          <button class="ahc__button ahc__button--ghost" type="button" @click=${this._closeFilterSheet} aria-label="סגור">×</button>
          <h3 class="ahc-filter-sheet__title">סינון מתקדם</h3>
        </header>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>טווח זמן</span><span aria-hidden="true">◷</span></div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("24 שעות", this._filter.timePreset === "24h", () => this._setTimePreset("24h"))}
            ${this._renderChip("7 ימים", this._filter.timePreset === "7d", () => this._setTimePreset("7d"))}
            ${this._renderChip("טווח מותאם", this._filter.timePreset === "custom", () => this._setTimePreset("custom"))}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>אזורים</span><span aria-hidden="true">▦</span></div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("כל האזורים", !this._filter.areas.length, () => this._setAreas([]))}
            ${e.map((t) => this._renderChip(t, this._filter.areas.includes(t), () => this._toggleArea(t)))}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>סוגי רכיבים</span><span aria-hidden="true">▦</span></div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("כל הסוגים", !this._filter.domains.length, () => this._setDomains([]))}
            ${i.map((t) => this._renderChip(q[t] ?? t, this._filter.domains.includes(t), () => this._toggleDomain(t)))}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>מצבים</span><span aria-hidden="true">⌁</span></div>
          <button class="ahc-filter-option" type="button" aria-pressed=${this._filter.stateMode === "active_only"} @click=${() => this._setStateMode("active_only")}>
            <span>רק פעילים</span><small>הצג רכיבים שהיו פעילים בטווח</small>
          </button>
          <button class="ahc-filter-option" type="button" aria-pressed=${this._filter.stateMode === "all"} @click=${() => this._setStateMode("all")}>
            <span>כל המצבים</span><small>הצג גם זמני כבוי ולא זמין</small>
          </button>
          <button class="ahc-filter-option" type="button" aria-pressed=${this._filter.stateMode === "currently_active"} @click=${() => this._setStateMode("currently_active")}>
            <span>פעילים עכשיו</span><small>התמקד ברכיבים שפועלים כעת</small>
          </button>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>קבוצות וחיפוש</span><span aria-hidden="true">▤</span></div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("קבץ לפי אזור", this._filter.groupBy === "area", () => this._setGroupBy("area"))}
            ${this._renderChip("קבץ לפי סוג", this._filter.groupBy === "domain", () => this._setGroupBy("domain"))}
            ${this._renderChip("ללא קיבוץ", this._filter.groupBy === "none", () => this._setGroupBy("none"))}
          </div>
          <div class="ahc__search ahc__search--sheet">
            <span class="ahc__search-icon" aria-hidden="true">⌕</span>
            <input class="ahc__search-input" type="search" .value=${this._filter.search} placeholder="חיפוש רכיב או אזור" @input=${this._onSearchInput} />
          </div>
        </div>

        <footer class="ahc-filter-sheet__footer">
          <button class="ahc__button ahc__button--ghost" type="button" @click=${this._clearFilters}>נקה סינון</button>
          <button class="ahc__button ahc__button--primary" type="button" @click=${this._closeFilterSheet}>החל סינון</button>
        </footer>
      </section>
    `;
  }
  _scheduleFetch() {
    this._fetchDebounce && window.clearTimeout(this._fetchDebounce), this._fetchDebounce = window.setTimeout(() => {
      this._fetchDebounce = void 0, this._fetchAndRender();
    }, 120);
  }
  async _fetchAndRender() {
    if (!this._config) return;
    const e = this._config.mock_data === !0;
    if (!this._hass && !e) {
      this._usingMockData = !1, this._loading = !0, this._error = void 0, this._emptyReason = void 0, this.requestUpdate();
      return;
    }
    const i = ++this._fetchToken;
    this._loading = !e, this._error = void 0, this._emptyReason = void 0, this._usingMockData = e, this.requestUpdate();
    const t = e ? { entities: Dt(), diagnostics: void 0 } : await pt(this._config, this._hass);
    if (i !== this._fetchToken) return;
    const s = t.entities, r = this._resolveRange(), n = Ue(s), c = JSON.stringify({
      mock: e,
      start: r.start.toISOString(),
      end: r.end.toISOString(),
      entities: s.map((o) => o.entity_id),
      withAttributes: n.withAttributes.map((o) => o.entity_id),
      withoutAttributes: n.withoutAttributes.map((o) => o.entity_id),
      includeLabels: this._config.include_labels ?? [],
      excludeLabels: this._config.exclude_labels ?? [],
      significant: this._config.significant_changes_only,
      minimal: this._config.minimal_response
    });
    if (!s.length) {
      this._usingMockData = !1, this._rows = [], this._groups = [], this._summary = N([]), this._emptyReason = this._config.auto_discover === !1 && !this._config.entities?.length ? "no_entities_selected" : "no_resolved_entities", this._setDiagnostics({
        resolvedEntityCount: 0,
        historyRecordCount: 0,
        timelineSegmentCount: 0,
        activeTimelineSegmentCount: 0,
        filteredRowCount: 0,
        renderedGroupCount: 0,
        activeFilters: { ...this._filter },
        historyRange: r,
        attributesRequested: { withAttributes: 0, withoutAttributes: 0 },
        cacheHit: !1,
        mockData: e,
        discovery: t.diagnostics
      }), this._loading = !1, this._error = void 0, this.requestUpdate();
      return;
    }
    if (c === this._lastFetchKey) {
      const o = this._historyCache.get(c);
      if (o) {
        const d = Ce(o);
        this._rows = ke(o, s, r, this._config, this._hass?.states ?? {}), this._setPostLoadState(d, r, n, !0, e, t.diagnostics), this._loading = !1, this._error = void 0, this._rebuildGroups();
        return;
      }
    }
    try {
      let o = this._historyCache.get(c);
      if (o || (o = e ? Pt(r) : await Ct(this._hass, s, r, this._config), this._historyCache.set(c, o)), i !== this._fetchToken) return;
      const d = Ce(o);
      this._rows = ke(o, s, r, this._config, this._hass?.states ?? {}), this._setPostLoadState(d, r, n, !1, e, t.diagnostics), this._lastFetchKey = c, this._rebuildGroups();
    } catch (o) {
      this._error = o instanceof Error ? o.message : String(o), this._rows = [], this._groups = [], this._summary = N([]), this._emptyReason = void 0;
    } finally {
      i === this._fetchToken && (this._loading = !1, this.requestUpdate());
    }
  }
  _rebuildGroups() {
    const e = At(this._rows, this._filter);
    this._groups = St(e, this._filter.groupBy), this._summary = N(this._groups), this._rows.length && !e.length ? this._emptyReason = "all_entities_filtered" : this._emptyReason === "all_entities_filtered" && (this._emptyReason = void 0), this._diagnostics && this._setDiagnostics({
      ...this._diagnostics,
      filteredRowCount: e.length,
      renderedGroupCount: this._groups.length,
      activeFilters: { ...this._filter }
    }), this.requestUpdate();
  }
  _setPostLoadState(e, i, t, s, r, n) {
    const c = this._rows.reduce((d, l) => d + l.segments.length, 0), o = this._rows.reduce((d, l) => d + l.segments.filter((h) => h.active).length, 0);
    e === 0 && o === 0 ? this._emptyReason = "no_history_returned" : e > 0 && c === 0 ? this._emptyReason = "history_unusable" : this._emptyReason = void 0, this._setDiagnostics({
      resolvedEntityCount: this._rows.length,
      historyRecordCount: e,
      timelineSegmentCount: c,
      activeTimelineSegmentCount: o,
      filteredRowCount: this._rows.length,
      renderedGroupCount: 0,
      activeFilters: { ...this._filter },
      historyRange: i,
      attributesRequested: {
        withAttributes: t.withAttributes.length,
        withoutAttributes: t.withoutAttributes.length
      },
      cacheHit: s,
      mockData: r,
      discovery: n
    });
  }
  _setDiagnostics(e) {
    this._diagnostics = e;
  }
  _resolveRange() {
    const e = this._roundedNow();
    return this._filter.timePreset === "24h" ? Y({ ...this._config, start_time: void 0, end_time: e.toISOString(), hours_to_show: 24 }, e) : this._filter.timePreset === "7d" ? Y({ ...this._config, start_time: void 0, end_time: e.toISOString(), hours_to_show: 24 * 7 }, e) : Y(this._config, e);
  }
  _roundedNow() {
    const e = Date.now();
    return new Date(Math.floor(e / 6e4) * 6e4);
  }
  _availableDomains() {
    return [...new Set(this._rows.map((e) => e.entity.domain))].filter(Boolean).sort();
  }
  _availableAreas() {
    return [...new Set(this._rows.map((e) => e.entity.area).filter((e) => !!e))].sort();
  }
  _toggleArea(e) {
    const i = this._filter.areas.includes(e) ? this._filter.areas.filter((t) => t !== e) : [...this._filter.areas, e];
    this._setAreas(i);
  }
  _setAreas(e) {
    this._filter = { ...this._filter, areas: e }, this._rebuildGroups();
  }
  _toggleDomain(e) {
    const i = this._filter.domains.includes(e) ? this._filter.domains.filter((t) => t !== e) : [...this._filter.domains, e];
    this._setDomains(i);
  }
  _setDomains(e) {
    this._filter = { ...this._filter, domains: e }, this._rebuildGroups();
  }
  _setGroupBy(e) {
    this._filter = { ...this._filter, groupBy: e }, this._rebuildGroups();
  }
  _setStateMode(e) {
    this._filter = { ...this._filter, stateMode: e }, this._rebuildGroups();
  }
  _setTimePreset(e) {
    this._filter.timePreset !== e && (this._filter = { ...this._filter, timePreset: e }, this._lastFetchKey = "", this._scheduleFetch());
  }
  _initialTimePreset(e) {
    return e.start_time || e.end_time ? "custom" : (e.hours_to_show ?? 24) >= 168 ? "7d" : "24h";
  }
  _timePresetLabel(e) {
    return e === "7d" ? "7 ימים" : e === "custom" ? "טווח מותאם" : "24 שעות אחרונות";
  }
}
function Ce(a) {
  return Object.values(a).reduce((e, i) => e + i.length, 0);
}
customElements.get("activity-history-card") || customElements.define("activity-history-card", Vt);
window.customCards = window.customCards || [];
window.customCards.some((a) => a.type === "activity-history-card") || window.customCards.push({
  type: "activity-history-card",
  name: "Activity History Card",
  description: "RTL/mobile-friendly Home Assistant activity history timeline",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/activity-history-card"
});
console.info(`%c ACTIVITY-HISTORY-CARD %c ${Gt} `, "color:#38bdf8;font-weight:700", "color:#94a3b8");
export {
  Vt as ActivityHistoryCard
};
//# sourceMappingURL=activity-history-card.js.map
