/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, Y = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = Symbol(), et = /* @__PURE__ */ new WeakMap();
let yt = class {
  constructor(t, a, e) {
    if (this._$cssResult$ = !0, e !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = a;
  }
  get styleSheet() {
    let t = this.o;
    const a = this.t;
    if (Y && t === void 0) {
      const e = a !== void 0 && a.length === 1;
      e && (t = et.get(a)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), e && et.set(a, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ct = (i) => new yt(typeof i == "string" ? i : i + "", void 0, J), Tt = (i, ...t) => {
  const a = i.length === 1 ? i[0] : t.reduce((e, s, r) => e + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + i[r + 1], i[0]);
  return new yt(a, i, J);
}, zt = (i, t) => {
  if (Y) i.adoptedStyleSheets = t.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of t) {
    const e = document.createElement("style"), s = R.litNonce;
    s !== void 0 && e.setAttribute("nonce", s), e.textContent = a.cssText, i.appendChild(e);
  }
}, at = Y ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let a = "";
  for (const e of t.cssRules) a += e.cssText;
  return Ct(a);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Mt, defineProperty: Ht, getOwnPropertyDescriptor: Dt, getOwnPropertyNames: Pt, getOwnPropertySymbols: Ot, getPrototypeOf: Rt } = Object, N = globalThis, it = N.trustedTypes, Ut = it ? it.emptyScript : "", Lt = N.reactiveElementPolyfillSupport, C = (i, t) => i, q = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Ut : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let a = i;
  switch (t) {
    case Boolean:
      a = i !== null;
      break;
    case Number:
      a = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        a = JSON.parse(i);
      } catch {
        a = null;
      }
  }
  return a;
} }, xt = (i, t) => !Mt(i, t), st = { attribute: !0, type: String, converter: q, reflect: !1, useDefault: !1, hasChanged: xt };
Symbol.metadata ??= Symbol("metadata"), N.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let w = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, a = st) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(t, a), !a.noAccessor) {
      const e = Symbol(), s = this.getPropertyDescriptor(t, e, a);
      s !== void 0 && Ht(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, a, e) {
    const { get: s, set: r } = Dt(this.prototype, t) ?? { get() {
      return this[a];
    }, set(n) {
      this[a] = n;
    } };
    return { get: s, set(n) {
      const c = s?.call(this);
      r?.call(this, n), this.requestUpdate(t, c, e);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? st;
  }
  static _$Ei() {
    if (this.hasOwnProperty(C("elementProperties"))) return;
    const t = Rt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(C("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(C("properties"))) {
      const a = this.properties, e = [...Pt(a), ...Ot(a)];
      for (const s of e) this.createProperty(s, a[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const a = litPropertyMetadata.get(t);
      if (a !== void 0) for (const [e, s] of a) this.elementProperties.set(e, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [a, e] of this.elementProperties) {
      const s = this._$Eu(a, e);
      s !== void 0 && this._$Eh.set(s, a);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const a = [];
    if (Array.isArray(t)) {
      const e = new Set(t.flat(1 / 0).reverse());
      for (const s of e) a.unshift(at(s));
    } else t !== void 0 && a.push(at(t));
    return a;
  }
  static _$Eu(t, a) {
    const e = a.attribute;
    return e === !1 ? void 0 : typeof e == "string" ? e : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), a = this.constructor.elementProperties;
    for (const e of a.keys()) this.hasOwnProperty(e) && (t.set(e, this[e]), delete this[e]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return zt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, a, e) {
    this._$AK(t, e);
  }
  _$ET(t, a) {
    const e = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, e);
    if (s !== void 0 && e.reflect === !0) {
      const r = (e.converter?.toAttribute !== void 0 ? e.converter : q).toAttribute(a, e.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, a) {
    const e = this.constructor, s = e._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const r = e.getPropertyOptions(s), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : q;
      this._$Em = s;
      const c = n.fromAttribute(a, r.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, a, e, s = !1, r) {
    if (t !== void 0) {
      const n = this.constructor;
      if (s === !1 && (r = this[t]), e ??= n.getPropertyOptions(t), !((e.hasChanged ?? xt)(r, a) || e.useDefault && e.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, e)))) return;
      this.C(t, a, e);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, a, { useDefault: e, reflect: s, wrapped: r }, n) {
    e && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? a ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || e || (a = void 0), this._$AL.set(t, a)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (a) {
      Promise.reject(a);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
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
      const e = this.constructor.elementProperties;
      if (e.size > 0) for (const [s, r] of e) {
        const { wrapped: n } = r, c = this[s];
        n !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, r, c);
      }
    }
    let t = !1;
    const a = this._$AL;
    try {
      t = this.shouldUpdate(a), t ? (this.willUpdate(a), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(a)) : this._$EM();
    } catch (e) {
      throw t = !1, this._$EM(), e;
    }
    t && this._$AE(a);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((a) => a.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((a) => this._$ET(a, this[a])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
w.elementStyles = [], w.shadowRootOptions = { mode: "open" }, w[C("elementProperties")] = /* @__PURE__ */ new Map(), w[C("finalized")] = /* @__PURE__ */ new Map(), Lt?.({ ReactiveElement: w }), (N.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, rt = (i) => i, L = X.trustedTypes, nt = L ? L.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, $t = "$lit$", b = `lit$${Math.random().toFixed(9).slice(2)}$`, wt = "?" + b, Nt = `<${wt}>`, $ = document, M = () => $.createComment(""), H = (i) => i === null || typeof i != "object" && typeof i != "function", Z = Array.isArray, It = (i) => Z(i) || typeof i?.[Symbol.iterator] == "function", F = `[ 	
\f\r]`, S = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ot = /-->/g, ct = />/g, v = RegExp(`>|${F}(?:([^\\s"'>=/]+)(${F}*=${F}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), lt = /'/g, ht = /"/g, kt = /^(?:script|style|textarea|title)$/i, Ft = (i) => (t, ...a) => ({ _$litType$: i, strings: t, values: a }), u = Ft(1), k = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), dt = /* @__PURE__ */ new WeakMap(), y = $.createTreeWalker($, 129);
function At(i, t) {
  if (!Z(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return nt !== void 0 ? nt.createHTML(t) : t;
}
const jt = (i, t) => {
  const a = i.length - 1, e = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = S;
  for (let c = 0; c < a; c++) {
    const o = i[c];
    let d, l, h = -1, g = 0;
    for (; g < o.length && (n.lastIndex = g, l = n.exec(o), l !== null); ) g = n.lastIndex, n === S ? l[1] === "!--" ? n = ot : l[1] !== void 0 ? n = ct : l[2] !== void 0 ? (kt.test(l[2]) && (s = RegExp("</" + l[2], "g")), n = v) : l[3] !== void 0 && (n = v) : n === v ? l[0] === ">" ? (n = s ?? S, h = -1) : l[1] === void 0 ? h = -2 : (h = n.lastIndex - l[2].length, d = l[1], n = l[3] === void 0 ? v : l[3] === '"' ? ht : lt) : n === ht || n === lt ? n = v : n === ot || n === ct ? n = S : (n = v, s = void 0);
    const _ = n === v && i[c + 1].startsWith("/>") ? " " : "";
    r += n === S ? o + Nt : h >= 0 ? (e.push(d), o.slice(0, h) + $t + o.slice(h) + b + _) : o + b + (h === -2 ? c : _);
  }
  return [At(i, r + (i[a] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), e];
};
class D {
  constructor({ strings: t, _$litType$: a }, e) {
    let s;
    this.parts = [];
    let r = 0, n = 0;
    const c = t.length - 1, o = this.parts, [d, l] = jt(t, a);
    if (this.el = D.createElement(d, e), y.currentNode = this.el.content, a === 2 || a === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = y.nextNode()) !== null && o.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith($t)) {
          const g = l[n++], _ = s.getAttribute(h).split(b), f = /([.?@])?(.*)/.exec(g);
          o.push({ type: 1, index: r, name: f[2], strings: _, ctor: f[1] === "." ? Gt : f[1] === "?" ? qt : f[1] === "@" ? Kt : I }), s.removeAttribute(h);
        } else h.startsWith(b) && (o.push({ type: 6, index: r }), s.removeAttribute(h));
        if (kt.test(s.tagName)) {
          const h = s.textContent.split(b), g = h.length - 1;
          if (g > 0) {
            s.textContent = L ? L.emptyScript : "";
            for (let _ = 0; _ < g; _++) s.append(h[_], M()), y.nextNode(), o.push({ type: 2, index: ++r });
            s.append(h[g], M());
          }
        }
      } else if (s.nodeType === 8) if (s.data === wt) o.push({ type: 2, index: r });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(b, h + 1)) !== -1; ) o.push({ type: 7, index: r }), h += b.length - 1;
      }
      r++;
    }
  }
  static createElement(t, a) {
    const e = $.createElement("template");
    return e.innerHTML = t, e;
  }
}
function A(i, t, a = i, e) {
  if (t === k) return t;
  let s = e !== void 0 ? a._$Co?.[e] : a._$Cl;
  const r = H(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== r && (s?._$AO?.(!1), r === void 0 ? s = void 0 : (s = new r(i), s._$AT(i, a, e)), e !== void 0 ? (a._$Co ??= [])[e] = s : a._$Cl = s), s !== void 0 && (t = A(i, s._$AS(i, t.values), s, e)), t;
}
class Bt {
  constructor(t, a) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = a;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: a }, parts: e } = this._$AD, s = (t?.creationScope ?? $).importNode(a, !0);
    y.currentNode = s;
    let r = y.nextNode(), n = 0, c = 0, o = e[0];
    for (; o !== void 0; ) {
      if (n === o.index) {
        let d;
        o.type === 2 ? d = new P(r, r.nextSibling, this, t) : o.type === 1 ? d = new o.ctor(r, o.name, o.strings, this, t) : o.type === 6 && (d = new Vt(r, this, t)), this._$AV.push(d), o = e[++c];
      }
      n !== o?.index && (r = y.nextNode(), n++);
    }
    return y.currentNode = $, s;
  }
  p(t) {
    let a = 0;
    for (const e of this._$AV) e !== void 0 && (e.strings !== void 0 ? (e._$AI(t, e, a), a += e.strings.length - 2) : e._$AI(t[a])), a++;
  }
}
class P {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, a, e, s) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = a, this._$AM = e, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const a = this._$AM;
    return a !== void 0 && t?.nodeType === 11 && (t = a.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, a = this) {
    t = A(this, t, a), H(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== k && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : It(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && H(this._$AH) ? this._$AA.nextSibling.data = t : this.T($.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: a, _$litType$: e } = t, s = typeof e == "number" ? this._$AC(t) : (e.el === void 0 && (e.el = D.createElement(At(e.h, e.h[0]), this.options)), e);
    if (this._$AH?._$AD === s) this._$AH.p(a);
    else {
      const r = new Bt(s, this), n = r.u(this.options);
      r.p(a), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let a = dt.get(t.strings);
    return a === void 0 && dt.set(t.strings, a = new D(t)), a;
  }
  k(t) {
    Z(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let e, s = 0;
    for (const r of t) s === a.length ? a.push(e = new P(this.O(M()), this.O(M()), this, this.options)) : e = a[s], e._$AI(r), s++;
    s < a.length && (this._$AR(e && e._$AB.nextSibling, s), a.length = s);
  }
  _$AR(t = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); t !== this._$AB; ) {
      const e = rt(t).nextSibling;
      rt(t).remove(), t = e;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class I {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, a, e, s, r) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = a, this._$AM = s, this.options = r, e.length > 2 || e[0] !== "" || e[1] !== "" ? (this._$AH = Array(e.length - 1).fill(new String()), this.strings = e) : this._$AH = p;
  }
  _$AI(t, a = this, e, s) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = A(this, t, a, 0), n = !H(t) || t !== this._$AH && t !== k, n && (this._$AH = t);
    else {
      const c = t;
      let o, d;
      for (t = r[0], o = 0; o < r.length - 1; o++) d = A(this, c[e + o], a, o), d === k && (d = this._$AH[o]), n ||= !H(d) || d !== this._$AH[o], d === p ? t = p : t !== p && (t += (d ?? "") + r[o + 1]), this._$AH[o] = d;
    }
    n && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Gt extends I {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class qt extends I {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Kt extends I {
  constructor(t, a, e, s, r) {
    super(t, a, e, s, r), this.type = 5;
  }
  _$AI(t, a = this) {
    if ((t = A(this, t, a, 0) ?? p) === k) return;
    const e = this._$AH, s = t === p && e !== p || t.capture !== e.capture || t.once !== e.once || t.passive !== e.passive, r = t !== p && (e === p || s);
    s && this.element.removeEventListener(this.name, this, e), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Vt {
  constructor(t, a, e) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = e;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    A(this, t);
  }
}
const Wt = X.litHtmlPolyfillSupport;
Wt?.(D, P), (X.litHtmlVersions ??= []).push("3.3.3");
const Yt = (i, t, a) => {
  const e = a?.renderBefore ?? t;
  let s = e._$litPart$;
  if (s === void 0) {
    const r = a?.renderBefore ?? null;
    e._$litPart$ = s = new P(t.insertBefore(M(), r), r, void 0, a ?? {});
  }
  return s._$AI(i), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Q = globalThis;
class T extends w {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Yt(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return k;
  }
}
T._$litElement$ = !0, T.finalized = !0, Q.litElementHydrateSupport?.({ LitElement: T });
const Jt = Q.litElementPolyfillSupport;
Jt?.({ LitElement: T });
(Q.litElementVersions ??= []).push("4.2.2");
const Xt = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  input_boolean: ["on"],
  media_player: ["playing"],
  climate: ["cool", "heat", "heat_cool", "dry", "fan_only"],
  humidifier: ["on"],
  vacuum: ["cleaning", "returning"],
  cover: ["opening", "closing", "open"]
}, Zt = {
  climate: {
    hvac_action: ["cooling", "heating", "drying", "fan"]
  }
}, j = {
  title: "היסטוריית פעילות חכמה",
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
}, K = {
  light: "תאורה",
  switch: "מתגים",
  climate: "מזגנים",
  media_player: "מוזיקה",
  cover: "תריסים",
  fan: "מאווררים",
  vacuum: "שואבים"
}, V = {
  on: "דלוק",
  off: "כבוי",
  cooling: "קירור",
  heating: "חימום",
  playing: "מנגן",
  opening: "פתוח",
  closing: "נסגר",
  idle: "המתנה",
  unknown: "לא ידוע"
}, Qt = ["ar", "fa", "he", "iw", "ur"];
function W(i) {
  return i.includes(".") ? i.split(".")[0] ?? i : i;
}
function B(i, t = /* @__PURE__ */ new Date()) {
  if (i.start_time) {
    const r = new Date(i.start_time), n = i.end_time ? new Date(i.end_time) : t;
    return { start: r, end: n };
  }
  const a = i.hours_to_show ?? 24, e = i.end_time ? new Date(i.end_time) : t;
  return { start: new Date(e.getTime() - a * 60 * 60 * 1e3), end: e };
}
function te(i, t) {
  if (i === !0 || i === "rtl") return !0;
  if (i === !1 || i === "ltr") return !1;
  const a = (t || document.documentElement.lang || navigator.language || "").toLowerCase();
  return Qt.some((e) => a === e || a.startsWith(`${e}-`));
}
function z(i) {
  if (!Number.isFinite(i) || i <= 0) return "0 דק׳";
  const t = Math.round(i / 6e4), a = Math.floor(t / 60), e = t % 60;
  return a && e ? `${a}:${String(e).padStart(2, "0")} שעות` : a ? `${a} שעות` : `${e} דק׳`;
}
function x(i) {
  return new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit" }).format(i);
}
function ee(i, t, a) {
  return Math.min(a, Math.max(t, i));
}
function U(i, t) {
  const a = t.end.getTime() - t.start.getTime();
  return a <= 0 ? 0 : ee((i.getTime() - t.start.getTime()) / a * 100, 0, 100);
}
function ae(i) {
  const [, t = i] = i.split(".");
  return t.replace(/_/g, " ");
}
function ie(i, t) {
  const e = (i.entities ?? []).map((s) => typeof s == "string" ? { entity: s } : s);
  if (!e.length && t && (i.domains?.length || i.areas?.length))
    for (const s of Object.keys(t.states)) {
      const r = t.states[s], n = W(s), c = E(r?.attributes?.area) ?? E(r?.attributes?.area_id);
      i.domains?.length && !i.domains.includes(n) || i.areas?.length && (!c || !i.areas.includes(c)) || e.push({ entity: s, area: c });
    }
  return e.filter((s) => s.entity && !s.hidden && !se(s.entity, i.exclude_entities ?? [])).map((s) => {
    const r = t?.states[s.entity], n = s.domain ?? W(s.entity), c = r ? t?.formatEntityName?.(r) : void 0, o = r?.attributes?.friendly_name, d = s.area ?? E(r?.attributes?.area) ?? E(r?.attributes?.area_id);
    return {
      entity_id: s.entity,
      name: s.name ?? c ?? (typeof o == "string" ? o : ae(s.entity)),
      area: d,
      domain: n,
      icon: s.icon ?? E(r?.attributes?.icon),
      config: s
    };
  });
}
function se(i, t) {
  return t.some((a) => re(a).test(i));
}
function re(i) {
  const t = i.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${t}$`);
}
function E(i) {
  return typeof i == "string" && i.trim() ? i : void 0;
}
function ne(i, t) {
  const a = t.search.trim().toLowerCase();
  return i.filter((e) => {
    const { entity: s } = e;
    if (t.areas.length && (!s.area || !t.areas.includes(s.area)) || t.domains.length && !t.domains.includes(s.domain) || a && ![s.entity_id, s.name, s.area, s.domain].filter(Boolean).join(" ").toLowerCase().includes(a) || t.stateMode === "active_only" && e.totalActiveMs <= 0) return !1;
    if (t.stateMode === "currently_active") {
      const r = Date.now();
      if (!e.segments.some((n) => n.active && n.start.getTime() <= r && n.end.getTime() >= r - 9e4)) return !1;
    }
    return !0;
  });
}
function oe(i, t) {
  if (t === "none" || t === "entity")
    return [ut("all", "כל הרכיבים", i)];
  const a = /* @__PURE__ */ new Map();
  for (const e of i) {
    const s = t === "area" ? e.entity.area || "ללא אזור" : e.entity.domain || "other", r = a.get(s) ?? [];
    r.push(e), a.set(s, r);
  }
  return [...a.entries()].map(([e, s]) => ut(e, t === "domain" ? K[e] ?? e : e, s));
}
function ut(i, t, a) {
  const e = a.reduce((s, r) => s + r.totalActiveMs, 0);
  return {
    id: i,
    title: t,
    subtitle: `${a.length} רכיבים`,
    rows: a,
    totalActiveMs: e
  };
}
function pt(i) {
  return i.config?.attributes?.length || i.config?.active_attributes && Object.keys(i.config.active_attributes).length ? !0 : ["climate", "humidifier", "water_heater"].includes(i.domain);
}
async function ce(i, t, a, e) {
  const s = t.filter(pt), r = t.filter((c) => !pt(c)), n = await Promise.all([
    r.length ? _t(i, r, a, e, !0) : Promise.resolve({}),
    s.length ? _t(i, s, a, e, !1) : Promise.resolve({})
  ]);
  return Object.assign({}, ...n);
}
async function _t(i, t, a, e, s) {
  const r = t.map((c) => c.entity_id), n = await i.callWS({
    type: "history/history_during_period",
    entity_ids: r,
    start_time: a.start.toISOString(),
    end_time: a.end.toISOString(),
    minimal_response: e.minimal_response ?? !0,
    significant_changes_only: e.significant_changes_only ?? !0,
    no_attributes: s
  });
  return le(n, r);
}
function le(i, t) {
  const a = {};
  if (Array.isArray(i))
    return i.forEach((e, s) => {
      if (!Array.isArray(e)) return;
      const r = t[s], n = gt(e, r), c = n[0]?.entity_id ?? r;
      c && (a[c] = n);
    }), a;
  if (i && typeof i == "object")
    for (const [e, s] of Object.entries(i))
      Array.isArray(s) && (a[e] = gt(s, e));
  return a;
}
function gt(i, t) {
  let a = t;
  return i.map((e) => {
    if (!e || typeof e != "object") return;
    const s = e, r = m(s.entity_id) ?? a;
    r && (a = r);
    const n = m(s.last_changed) ?? m(s.lc) ?? m(s.last_updated) ?? m(s.lu), c = m(s.state) ?? m(s.s);
    if (!r || !c || !n) return;
    const o = mt(s.attributes) ?? mt(s.a), d = {
      entity_id: r,
      state: c,
      last_changed: n
    };
    o && (d.attributes = o);
    const l = m(s.last_updated) ?? m(s.lu);
    return l && (d.last_updated = l), d;
  }).filter((e) => e !== void 0);
}
function m(i) {
  return typeof i == "string" ? i : void 0;
}
function mt(i) {
  return i && typeof i == "object" && !Array.isArray(i) ? i : void 0;
}
function ft(i, t, a, e, s = {}) {
  return t.map((r) => {
    const n = he(i[r.entity_id] ?? [], s[r.entity_id], a, r.entity_id).filter((l) => l.state != null && l.last_changed).sort((l, h) => new Date(l.last_changed).getTime() - new Date(h.last_changed).getTime()), c = pe(n), o = ue(c, r, a, e), d = o.filter((l) => l.active);
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
function he(i, t, a, e) {
  const s = [...i];
  if (!t) return s;
  const r = new Date(t.last_changed || t.last_updated).getTime(), n = Number.isFinite(r) ? Math.min(Math.max(r, a.start.getTime()), a.end.getTime()) : a.start.getTime(), c = s.filter((o) => o.entity_id === e).sort((o, d) => new Date(o.last_changed).getTime() - new Date(d.last_changed).getTime()).at(-1);
  return (!c || new Date(c.last_changed).getTime() < n || c.state !== t.state) && s.push({
    entity_id: e,
    state: t.state,
    attributes: t.attributes,
    last_changed: new Date(n).toISOString(),
    last_updated: t.last_updated
  }), s;
}
function de(i, t, a) {
  if (t === "unknown" || t === "unavailable") return { category: "unknown", active: !1 };
  const e = i.domain || W(i.entity_id), r = i.config?.active_states ?? Xt[e] ?? ["on"], n = i.config?.active_attributes ?? Zt[e] ?? {};
  for (const [o, d] of Object.entries(n)) {
    const l = a?.[o];
    if (typeof l == "string" && d.includes(l))
      return { category: vt(e, l), active: !0 };
  }
  const c = r.includes(t);
  return { category: vt(e, t), active: c };
}
function ue(i, t, a, e) {
  if (!i.length) return [];
  const s = [], r = a.start.getTime(), n = a.end.getTime();
  for (let o = 0; o < i.length; o += 1) {
    const d = i[o];
    if (!d) continue;
    const l = i[o + 1], h = new Date(d.last_changed).getTime(), g = l ? new Date(l.last_changed).getTime() : n, _ = Math.max(h, r), f = Math.min(g, n);
    if (f <= _) continue;
    const tt = de(t, d.state, d.attributes), Et = f - _;
    s.push({
      entity_id: t.entity_id,
      state: d.state,
      category: tt.category,
      active: tt.active,
      start: new Date(_),
      end: new Date(f),
      durationMs: Et,
      attributes: d.attributes
    });
  }
  return _e(s, e.merge_gap_seconds ?? 0).filter((o) => !o.active || !e.min_duration_seconds || o.durationMs >= e.min_duration_seconds * 1e3);
}
function pe(i) {
  const t = [];
  for (const a of i) {
    const e = t.at(-1);
    e && e.state === a.state && bt(e) === bt(a) || t.push(a);
  }
  return t;
}
function bt(i) {
  const t = i.attributes ?? {}, a = {
    hvac_action: t.hvac_action,
    temperature: t.temperature,
    current_temperature: t.current_temperature,
    media_title: t.media_title
  };
  return JSON.stringify(a);
}
function _e(i, t) {
  if (!i.length || t <= 0) return i;
  const a = t * 1e3, e = [];
  for (const s of i) {
    const r = e.at(-1);
    r && r.entity_id === s.entity_id && r.category === s.category && r.state === s.state && s.start.getTime() - r.end.getTime() <= a ? (r.end = s.end, r.durationMs = r.end.getTime() - r.start.getTime()) : e.push({ ...s });
  }
  return e;
}
function vt(i, t) {
  return t === "unknown" || t === "unavailable" ? "unknown" : ["off", "closed", "idle", "paused", "standby"].includes(t) ? t === "idle" ? "idle" : "off" : ["cool", "cooling"].includes(t) ? "cooling" : ["heat", "heating"].includes(t) ? "heating" : ["playing"].includes(t) ? "playing" : ["opening", "open"].includes(t) ? "opening" : ["closing"].includes(t) ? "closing" : i === "climate" && ["drying", "fan", "fan_only", "dry"].includes(t) ? "idle" : "on";
}
const St = [
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
function ge() {
  return St.map((i) => ({
    entity_id: i.entity_id,
    name: i.name,
    area: i.area,
    domain: i.domain,
    icon: i.icon,
    config: { entity: i.entity_id, name: i.name, area: i.area }
  }));
}
function me(i) {
  const t = {}, a = i.end.getTime();
  for (const e of St) {
    const s = [
      G(e.entity_id, "off", i.start.getTime(), void 0)
    ];
    for (const r of e.pattern) {
      const n = a + r.startHour * 36e5, c = a + r.endHour * 36e5;
      c <= i.start.getTime() || n >= i.end.getTime() || (s.push(G(e.entity_id, r.state, Math.max(n, i.start.getTime()), r.attributes)), s.push(G(e.entity_id, "off", Math.min(c, i.end.getTime()), void 0)));
    }
    t[e.entity_id] = s.sort((r, n) => new Date(r.last_changed).getTime() - new Date(n.last_changed).getTime()).filter((r, n, c) => n === 0 || r.last_changed !== c[n - 1]?.last_changed);
  }
  return t;
}
function G(i, t, a, e) {
  return {
    entity_id: i,
    state: t,
    attributes: e,
    last_changed: new Date(a).toISOString(),
    last_updated: new Date(a).toISOString()
  };
}
function fe() {
  return u`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">קורלציות</h3><p>מצב קורלציה ויומן אירועים יפותח בשלב הבא.</p></div></div>`;
}
function be() {
  return u`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">פירוט רכיב</h3><p>מסך Drill-down לרכיב יפותח אחרי תצוגת Swimlane.</p></div></div>`;
}
function ve() {
  return u`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">Heatmap</h3><p>מצב זה יפותח אחרי ה-MVP.</p></div></div>`;
}
function ye(i) {
  const t = $e(i.range), a = /* @__PURE__ */ new Date(), e = U(a, i.range), s = i.config.show_now_line !== !1 && a.getTime() >= i.range.start.getTime() && a.getTime() <= i.range.end.getTime() + 9e4;
  return u`
    <section class="ahc-timeline-card" aria-label="ציר זמן פעילות">
      <div class="ahc-timeline-toolbar">
        <h3 class="ahc-timeline-title">ציר זמן פעילות</h3>
        <span class="ahc__metric-subtitle">${x(i.range.start)} – ${x(i.range.end)}</span>
      </div>
      <div class="ahc-timeline-scroll">
        <div class="ahc-timeline">
          <div class="ahc-timeline__axis" aria-hidden="true">
            <div class="ahc-timeline__axis-spacer">רכיב / אזור</div>
            <div class="ahc-timeline__ticks">
              ${t.map(
    (r) => u`<span class="ahc-timeline__tick" style="left:${r.percent}%">${r.label}</span>`
  )}
            </div>
          </div>
          <div class="ahc-timeline__groups">
            ${i.groups.map(
    (r) => u`
                <section class="ahc-group" aria-label=${r.title}>
                  <header class="ahc-group__header">
                    <span class="ahc-group__title">${r.icon ? u`<span>${r.icon}</span>` : null}${r.title}</span>
                    <span class="ahc-group__meta">${z(r.totalActiveMs)} • ${r.subtitle ?? ""}</span>
                  </header>
                  ${r.rows.map(
      (n) => u`
                      <div class="ahc-row">
                        <div class="ahc-row__label">
                          <span class="ahc-row__icon" aria-hidden="true">${n.entity.icon ?? "●"}</span>
                          <span class="ahc-row__name" title=${n.entity.entity_id}>${n.entity.name}</span>
                          ${n.currentCategory ? u`<span class="ahc-row__state-chip" data-state=${n.currentCategory}>${V[n.currentCategory]}</span>` : null}
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
        const d = U(c.start, i.range), l = U(c.end, i.range), h = Math.max(0.35, l - d);
        if (!c.active && c.category !== "unknown") return null;
        const g = `${n.entity.name}, ${V[c.category]}, ${x(c.start)} עד ${x(c.end)}, ${z(c.durationMs)}`;
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
                                  @click=${(_) => i.onSegmentClick?.(_, n.entity.entity_id, o)}
                                  @keydown=${(_) => {
          (_.key === "Enter" || _.key === " ") && (_.preventDefault(), i.onSegmentClick?.(_, n.entity.entity_id, o));
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
          ${s ? u`<div class="ahc-now-line" style="left:${e}%"><span class="ahc-now-line__label">עכשיו</span></div>` : null}
        </div>
      </div>
      ${i.config.show_legend === !1 ? null : xe()}
    </section>
  `;
}
function xe() {
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
    ([t, a]) => u`<span class="ahc-legend__item"><span class="ahc-legend__swatch" style="--swatch:${a}"></span>${V[t]}</span>`
  )}
  </div>`;
}
function $e(i) {
  const t = Math.max(1, (i.end.getTime() - i.start.getTime()) / 36e5), a = t <= 24 ? 3 : t <= 72 ? 6 : 24, e = [], s = new Date(i.start);
  for (s.setMinutes(0, 0, 0); s < i.end; )
    s >= i.start && e.push({ label: x(s), percent: U(s, i) }), s.setHours(s.getHours() + a);
  return e.push({ label: x(i.end), percent: 100 }), e;
}
const we = Tt`
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
function O(i) {
  const t = i.flatMap((l) => l.rows), a = t.flatMap((l) => l.segments.filter((h) => h.active)), e = a.reduce((l, h) => l + h.durationMs, 0), s = a.length, r = Date.now(), n = t.filter((l) => l.segments.some((h) => h.active && h.start.getTime() <= r && h.end.getTime() >= r - 9e4)).length, c = [...a].sort((l, h) => h.start.getTime() - l.start.getTime())[0], o = [...t].sort((l, h) => h.totalActiveMs - l.totalActiveMs)[0], d = [...i].sort((l, h) => h.totalActiveMs - l.totalActiveMs)[0];
  return {
    totalActiveMs: e,
    eventCount: s,
    activeNowCount: n,
    lastEvent: c,
    mostActiveEntity: o,
    mostActiveArea: d,
    peakBucketLabel: ke(a)
  };
}
function ke(i) {
  if (!i.length) return;
  const t = new Array(24).fill(0);
  for (const s of i) {
    const r = s.start.getHours();
    t[r] = (t[r] ?? 0) + s.durationMs;
  }
  const a = Math.max(...t), e = t.indexOf(a);
  if (!(e < 0))
    return `${String(e).padStart(2, "0")}:00 – ${String((e + 1) % 24).padStart(2, "0")}:00`;
}
const Ae = "0.1.0";
class Se extends T {
  constructor() {
    super(...arguments), this._rows = [], this._groups = [], this._loading = !1, this._fullscreen = !1, this._filterSheetOpen = !1, this._usingMockData = !1, this._fetchToken = 0, this._lastFetchKey = "", this._historyCache = /* @__PURE__ */ new Map(), this._filter = {
      search: "",
      areas: [],
      domains: [],
      stateMode: "all",
      groupBy: "area",
      timePreset: "24h"
    }, this._openFilterSheet = () => {
      this._filterSheetOpen = !0, this.requestUpdate();
    }, this._closeFilterSheet = () => {
      this._filterSheetOpen = !1, this.requestUpdate();
    }, this._onSearchInput = (t) => {
      const a = t.target;
      this._filter = { ...this._filter, search: a.value }, this._rebuildGroups();
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
      const t = !this._fullscreen;
      if (this._fullscreen = t, t) {
        document.addEventListener("keydown", this._onDocumentKeyDown), document.addEventListener("fullscreenchange", this._onFullscreenChange);
        try {
          await this.requestFullscreen();
        } catch {
        }
        await this.updateComplete, this.renderRoot.querySelector(".ahc")?.focus();
      } else
        document.removeEventListener("keydown", this._onDocumentKeyDown), document.removeEventListener("fullscreenchange", this._onFullscreenChange), document.fullscreenElement && await document.exitFullscreen().catch(() => {
        });
      this.requestUpdate();
    }, this._onDocumentKeyDown = (t) => {
      t.key === "Escape" && this._fullscreen && this._toggleFullscreen();
    }, this._onFullscreenChange = () => {
      !document.fullscreenElement && this._fullscreen && (this._fullscreen = !1, document.removeEventListener("keydown", this._onDocumentKeyDown), document.removeEventListener("fullscreenchange", this._onFullscreenChange), this.requestUpdate());
    };
  }
  static {
    this.styles = we;
  }
  setConfig(t) {
    if (!t || t.type !== "custom:activity-history-card")
      throw new Error("Invalid card type. Expected custom:activity-history-card");
    const a = this._initialTimePreset(t);
    this._config = {
      ...j,
      ...t,
      view_mode: t.view_mode ?? t.default_view ?? "swimlane",
      group_by: t.group_by ?? j.group_by,
      filters: {
        show: !0,
        show_search: !0,
        show_area_chips: !0,
        show_domain_chips: !0,
        show_state_mode: !0,
        active_only: !1,
        ...t.filters ?? {}
      }
    }, this._filter = {
      search: "",
      areas: this._config.filters?.default_areas ?? [],
      domains: this._config.filters?.default_domains ?? [],
      stateMode: this._config.filters?.active_only ? "active_only" : "all",
      groupBy: this._config.group_by ?? "area",
      timePreset: a
    }, this._lastFetchKey = "", this._historyCache.clear(), this._scheduleFetch();
  }
  set hass(t) {
    this._hass = t, this._scheduleFetch();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsubscribeHistory?.(), this._unsubscribeHistory = void 0, this._fetchDebounce && window.clearTimeout(this._fetchDebounce), document.removeEventListener("keydown", this._onDocumentKeyDown), document.removeEventListener("fullscreenchange", this._onFullscreenChange);
  }
  getCardSize() {
    const t = this._rows.length || (this._config?.entities?.length ?? 3);
    return Math.min(18, Math.max(5, Math.ceil(t * 0.7) + 4));
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
    const t = this._hass?.locale?.language ?? this._hass?.language, a = te(this._config.direction ?? this._config.rtl ?? "auto", t), e = [
      "ahc",
      this._config.display_mode === "panel" ? "ahc--panel" : "",
      this._fullscreen || this._config.display_mode === "fullscreen" ? "ahc--fullscreen" : "",
      this._filterSheetOpen ? "ahc--sheet-open" : "",
      this._usingMockData ? "ahc--mock" : "",
      this._rows.length > 40 ? "ahc--dense" : ""
    ].filter(Boolean).join(" ");
    return u`
      <ha-card class=${e} dir=${a ? "rtl" : "ltr"} tabindex=${this._fullscreen ? "0" : "-1"}>
        ${this._renderHeader()} ${this._renderFilters()} ${this._renderSummary()}
        <div class=${this._config.show_insights === !1 ? "ahc__body ahc__body--no-insights" : "ahc__body"}>
          <main class="ahc__main">${this._renderMainContent()}</main>
          ${this._config.show_insights === !1 ? p : this._renderInsights()}
        </div>
        ${this._filterSheetOpen ? this._renderFilterSheet() : p}
      </ha-card>
    `;
  }
  _renderHeader() {
    const t = `${this._timePresetLabel(this._filter.timePreset)} · ${this._usingMockData ? "נתוני דוגמה" : "עודכן עכשיו"}`;
    return u`
      <header class="ahc__topbar">
        <div class="ahc__toolbar">
          ${this._config.show_fullscreen_button === !1 ? p : u`
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
            <h2 class="ahc__title">${this._config.title ?? j.title}</h2>
          </div>
          <p class="ahc__subtitle">${t}</p>
        </div>
      </header>
    `;
  }
  _renderFilters() {
    if (this._config.filters?.show === !1) return p;
    const t = this._availableDomains(), a = this._availableAreas();
    return u`
      <section class="ahc__filters" aria-label="מסננים">
        <div class="ahc__filter-row">
          <span class="ahc__filter-label">טווח זמן</span>
          ${this._renderChip("24 שעות", this._filter.timePreset === "24h", () => this._setTimePreset("24h"))}
          ${this._renderChip("7 ימים", this._filter.timePreset === "7d", () => this._setTimePreset("7d"))}
          ${this._renderChip("מותאם", this._filter.timePreset === "custom", () => this._setTimePreset("custom"))}
        </div>
        ${this._config.filters?.show_area_chips === !1 ? p : u`
              <div class="ahc__filter-row">
                <span class="ahc__filter-label">אזור</span>
                ${this._renderChip("הכל", !this._filter.areas.length, () => this._setAreas([]))}
                ${a.map((e) => this._renderChip(e, this._filter.areas.includes(e), () => this._toggleArea(e)))}
              </div>
            `}
        ${this._config.filters?.show_domain_chips === !1 ? p : u`
              <div class="ahc__filter-row">
                <span class="ahc__filter-label">סוג ישות</span>
                ${this._renderChip("הכל", !this._filter.domains.length, () => this._setDomains([]))}
                ${t.map((e) => this._renderChip(K[e] ?? e, this._filter.domains.includes(e), () => this._toggleDomain(e)))}
              </div>
            `}
        ${this._config.filters?.show_state_mode === !1 ? p : u`
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
  _renderChip(t, a, e) {
    return u`<button class="ahc__chip" type="button" aria-pressed=${a ? "true" : "false"} @click=${e}>${t}</button>`;
  }
  _renderSummary() {
    if (this._config.show_summary === !1) return p;
    const t = this._summary;
    return u`
      <section class="ahc__summary-grid" aria-label="סיכום פעילות">
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">זמן פעילות</span>
            <span class="ahc__metric-value ahc__metric-value--positive">${z(t?.totalActiveMs ?? 0)}</span>
            <span class="ahc__metric-subtitle">בטווח הנבחר</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◷</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">מספר אירועים</span>
            <span class="ahc__metric-value">${t?.eventCount ?? 0}</span>
            <span class="ahc__metric-subtitle">שינויי מצב פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">פעילים עכשיו</span>
            <span class="ahc__metric-value">${t?.activeNowCount ?? 0}</span>
            <span class="ahc__metric-subtitle">רכיבים פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">●</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירוע אחרון</span>
            <span class="ahc__metric-value">${t?.lastEvent ? x(t.lastEvent.start) : "אין"}</span>
            <span class="ahc__metric-subtitle">${t?.lastEvent?.entity_id ?? "לא נמצאו אירועים"}</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">♫</span>
        </article>
      </section>
    `;
  }
  _renderMainContent() {
    if (this._loading)
      return u`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">טוען היסטוריה...</h3><p>מושך נתוני פעילות מ-Home Assistant.</p></div></div>`;
    if (this._error)
      return u`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">שגיאה בטעינת ההיסטוריה</h3><p>${this._error}</p></div></div>`;
    if (!this._groups.length)
      return u`
        <div class="ahc-state-card">
          <div>
            <h3 class="ahc-state-card__title">אין נתונים להצגה</h3>
            <p>בחר רכיבים, הגדר domains/areas, או הפעל mock_data כדי לצפות בתצוגת דוגמה.</p>
          </div>
        </div>
      `;
    const t = this._resolveRange();
    switch (this._config.view_mode ?? this._config.default_view ?? "swimlane") {
      case "heatmap":
        return ve();
      case "detail":
        return be();
      case "correlation":
        return fe();
      case "swimlane":
      default:
        return ye({
          groups: this._groups,
          range: t,
          config: this._config,
          summary: this._summary ?? O(this._groups)
        });
    }
  }
  _renderInsights() {
    const t = this._summary;
    return u`
      <aside class="ahc__insights" aria-label="תובנות חכמות">
        <h3 class="ahc__insights-title"><span>תובנות חכמות</span><span aria-hidden="true">✦</span></h3>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">הרכיב הפעיל ביותר</span>
          <span class="ahc__insight-value">${t?.mostActiveEntity?.entity.name ?? "אין נתונים"}</span>
          <span class="ahc__insight-subtitle">${z(t?.mostActiveEntity?.totalActiveMs ?? 0)}</span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">האזור הפעיל ביותר</span>
          <span class="ahc__insight-value">${t?.mostActiveArea?.title ?? "אין נתונים"}</span>
          <span class="ahc__insight-subtitle">${z(t?.mostActiveArea?.totalActiveMs ?? 0)}</span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">שעות שיא</span>
          <span class="ahc__insight-value">${t?.peakBucketLabel ?? "אין נתונים"}</span>
          <span class="ahc__insight-subtitle">לפי משך פעילות</span>
        </article>
      </aside>
    `;
  }
  _renderFilterSheet() {
    const t = this._availableAreas(), a = this._availableDomains();
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
            ${t.map((e) => this._renderChip(e, this._filter.areas.includes(e), () => this._toggleArea(e)))}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>סוגי רכיבים</span><span aria-hidden="true">▦</span></div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("כל הסוגים", !this._filter.domains.length, () => this._setDomains([]))}
            ${a.map((e) => this._renderChip(K[e] ?? e, this._filter.domains.includes(e), () => this._toggleDomain(e)))}
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
    const t = this._config.mock_data === !0 || !this._hass, a = t ? ge() : ie(this._config, this._hass), e = this._resolveRange(), s = JSON.stringify({
      mock: t,
      start: e.start.toISOString(),
      end: e.end.toISOString(),
      entities: a.map((n) => n.entity_id),
      significant: this._config.significant_changes_only,
      minimal: this._config.minimal_response
    });
    if (!a.length) {
      this._usingMockData = !1, this._rows = [], this._groups = [], this._summary = O([]), this._loading = !1, this._error = void 0, this.requestUpdate();
      return;
    }
    if (s === this._lastFetchKey) {
      const n = this._historyCache.get(s);
      if (n) {
        this._rows = ft(n, a, e, this._config, this._hass?.states ?? {}), this._rebuildGroups();
        return;
      }
    }
    const r = ++this._fetchToken;
    this._loading = !t, this._error = void 0, this._usingMockData = t, this.requestUpdate();
    try {
      let n = this._historyCache.get(s);
      if (n || (n = t ? me(e) : await ce(this._hass, a, e, this._config), this._historyCache.set(s, n)), r !== this._fetchToken) return;
      this._rows = ft(n, a, e, this._config, this._hass?.states ?? {}), this._lastFetchKey = s, this._rebuildGroups();
    } catch (n) {
      this._error = n instanceof Error ? n.message : String(n), this._rows = [], this._groups = [], this._summary = O([]);
    } finally {
      r === this._fetchToken && (this._loading = !1, this.requestUpdate());
    }
  }
  _rebuildGroups() {
    const t = ne(this._rows, this._filter);
    this._groups = oe(t, this._filter.groupBy), this._summary = O(this._groups), this.requestUpdate();
  }
  _resolveRange() {
    const t = this._roundedNow();
    return this._filter.timePreset === "24h" ? B({ ...this._config, start_time: void 0, end_time: t.toISOString(), hours_to_show: 24 }, t) : this._filter.timePreset === "7d" ? B({ ...this._config, start_time: void 0, end_time: t.toISOString(), hours_to_show: 24 * 7 }, t) : B(this._config, t);
  }
  _roundedNow() {
    const t = Date.now();
    return new Date(Math.floor(t / 6e4) * 6e4);
  }
  _availableDomains() {
    return [...new Set(this._rows.map((t) => t.entity.domain))].filter(Boolean).sort();
  }
  _availableAreas() {
    return [...new Set(this._rows.map((t) => t.entity.area).filter((t) => !!t))].sort();
  }
  _toggleArea(t) {
    const a = this._filter.areas.includes(t) ? this._filter.areas.filter((e) => e !== t) : [...this._filter.areas, t];
    this._setAreas(a);
  }
  _setAreas(t) {
    this._filter = { ...this._filter, areas: t }, this._rebuildGroups();
  }
  _toggleDomain(t) {
    const a = this._filter.domains.includes(t) ? this._filter.domains.filter((e) => e !== t) : [...this._filter.domains, t];
    this._setDomains(a);
  }
  _setDomains(t) {
    this._filter = { ...this._filter, domains: t }, this._rebuildGroups();
  }
  _setGroupBy(t) {
    this._filter = { ...this._filter, groupBy: t }, this._rebuildGroups();
  }
  _setStateMode(t) {
    this._filter = { ...this._filter, stateMode: t }, this._rebuildGroups();
  }
  _setTimePreset(t) {
    this._filter.timePreset !== t && (this._filter = { ...this._filter, timePreset: t }, this._lastFetchKey = "", this._scheduleFetch());
  }
  _initialTimePreset(t) {
    return t.start_time || t.end_time ? "custom" : (t.hours_to_show ?? 24) >= 168 ? "7d" : "24h";
  }
  _timePresetLabel(t) {
    return t === "7d" ? "7 ימים" : t === "custom" ? "טווח מותאם" : "24 שעות אחרונות";
  }
}
customElements.get("activity-history-card") || customElements.define("activity-history-card", Se);
window.customCards = window.customCards || [];
window.customCards.some((i) => i.type === "activity-history-card") || window.customCards.push({
  type: "activity-history-card",
  name: "Activity History Card",
  description: "RTL/mobile-friendly Home Assistant activity history timeline",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/activity-history-card"
});
console.info(`%c ACTIVITY-HISTORY-CARD %c ${Ae} `, "color:#38bdf8;font-weight:700", "color:#94a3b8");
export {
  Se as ActivityHistoryCard
};
//# sourceMappingURL=activity-history-card.js.map
