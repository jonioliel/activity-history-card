/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis, be = Z.ShadowRoot && (Z.ShadyCSS === void 0 || Z.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, ve = Symbol(), $e = /* @__PURE__ */ new WeakMap();
let Qe = class {
  constructor(e, a, i) {
    if (this._$cssResult$ = !0, i !== ve) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = a;
  }
  get styleSheet() {
    let e = this.o;
    const a = this.t;
    if (be && e === void 0) {
      const i = a !== void 0 && a.length === 1;
      i && (e = $e.get(a)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && $e.set(a, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Et = (t) => new Qe(typeof t == "string" ? t : t + "", void 0, ve), et = (t, ...e) => {
  const a = t.length === 1 ? t[0] : e.reduce((i, n, s) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[s + 1], t[0]);
  return new Qe(a, t, ve);
}, Tt = (t, e) => {
  if (be) t.adoptedStyleSheets = e.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of e) {
    const i = document.createElement("style"), n = Z.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = a.cssText, t.appendChild(i);
  }
}, Ae = be ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let a = "";
  for (const i of e.cssRules) a += i.cssText;
  return Et(a);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: It, defineProperty: Ht, getOwnPropertyDescriptor: Dt, getOwnPropertyNames: Pt, getOwnPropertySymbols: Lt, getPrototypeOf: Nt } = Object, ae = globalThis, ze = ae.trustedTypes, Bt = ze ? ze.emptyScript : "", Ft = ae.reactiveElementPolyfillSupport, V = (t, e) => t, ue = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Bt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let a = t;
  switch (e) {
    case Boolean:
      a = t !== null;
      break;
    case Number:
      a = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        a = JSON.parse(t);
      } catch {
        a = null;
      }
  }
  return a;
} }, tt = (t, e) => !It(t, e), Ce = { attribute: !0, type: String, converter: ue, reflect: !1, useDefault: !1, hasChanged: tt };
Symbol.metadata ??= Symbol("metadata"), ae.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let P = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, a = Ce) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(e, a), !a.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(e, i, a);
      n !== void 0 && Ht(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, a, i) {
    const { get: n, set: s } = Dt(this.prototype, e) ?? { get() {
      return this[a];
    }, set(r) {
      this[a] = r;
    } };
    return { get: n, set(r) {
      const c = n?.call(this);
      s?.call(this, r), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Ce;
  }
  static _$Ei() {
    if (this.hasOwnProperty(V("elementProperties"))) return;
    const e = Nt(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(V("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(V("properties"))) {
      const a = this.properties, i = [...Pt(a), ...Lt(a)];
      for (const n of i) this.createProperty(n, a[n]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const a = litPropertyMetadata.get(e);
      if (a !== void 0) for (const [i, n] of a) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [a, i] of this.elementProperties) {
      const n = this._$Eu(a, i);
      n !== void 0 && this._$Eh.set(n, a);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const a = [];
    if (Array.isArray(e)) {
      const i = new Set(e.flat(1 / 0).reverse());
      for (const n of i) a.unshift(Ae(n));
    } else e !== void 0 && a.push(Ae(e));
    return a;
  }
  static _$Eu(e, a) {
    const i = a.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof e == "string" ? e.toLowerCase() : void 0;
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
    const e = /* @__PURE__ */ new Map(), a = this.constructor.elementProperties;
    for (const i of a.keys()) this.hasOwnProperty(i) && (e.set(i, this[i]), delete this[i]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Tt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, a, i) {
    this._$AK(e, i);
  }
  _$ET(e, a) {
    const i = this.constructor.elementProperties.get(e), n = this.constructor._$Eu(e, i);
    if (n !== void 0 && i.reflect === !0) {
      const s = (i.converter?.toAttribute !== void 0 ? i.converter : ue).toAttribute(a, i.type);
      this._$Em = e, s == null ? this.removeAttribute(n) : this.setAttribute(n, s), this._$Em = null;
    }
  }
  _$AK(e, a) {
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const s = i.getPropertyOptions(n), r = typeof s.converter == "function" ? { fromAttribute: s.converter } : s.converter?.fromAttribute !== void 0 ? s.converter : ue;
      this._$Em = n;
      const c = r.fromAttribute(a, s.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, a, i, n = !1, s) {
    if (e !== void 0) {
      const r = this.constructor;
      if (n === !1 && (s = this[e]), i ??= r.getPropertyOptions(e), !((i.hasChanged ?? tt)(s, a) || i.useDefault && i.reflect && s === this._$Ej?.get(e) && !this.hasAttribute(r._$Eu(e, i)))) return;
      this.C(e, a, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, a, { useDefault: i, reflect: n, wrapped: s }, r) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, r ?? a ?? this[e]), s !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (a = void 0), this._$AL.set(e, a)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (a) {
      Promise.reject(a);
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
        for (const [n, s] of this._$Ep) this[n] = s;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, s] of i) {
        const { wrapped: r } = s, c = this[n];
        r !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, s, c);
      }
    }
    let e = !1;
    const a = this._$AL;
    try {
      e = this.shouldUpdate(a), e ? (this.willUpdate(a), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(a)) : this._$EM();
    } catch (i) {
      throw e = !1, this._$EM(), i;
    }
    e && this._$AE(a);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    this._$EO?.forEach((a) => a.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
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
    this._$Eq &&= this._$Eq.forEach((a) => this._$ET(a, this[a])), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[V("elementProperties")] = /* @__PURE__ */ new Map(), P[V("finalized")] = /* @__PURE__ */ new Map(), Ft?.({ ReactiveElement: P }), (ae.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fe = globalThis, Re = (t) => t, ee = fe.trustedTypes, Me = ee ? ee.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, at = "$lit$", S = `lit$${Math.random().toFixed(9).slice(2)}$`, it = "?" + S, Ot = `<${it}>`, H = document, K = () => H.createComment(""), W = (t) => t === null || typeof t != "object" && typeof t != "function", ye = Array.isArray, jt = (t) => ye(t) || typeof t?.[Symbol.iterator] == "function", se = `[ 	
\f\r]`, q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Se = /-->/g, Ee = />/g, E = RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Te = /'/g, Ie = /"/g, nt = /^(?:script|style|textarea|title)$/i, Ut = (t) => (e, ...a) => ({ _$litType$: t, strings: e, values: a }), h = Ut(1), O = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), He = /* @__PURE__ */ new WeakMap(), T = H.createTreeWalker(H, 129);
function st(t, e) {
  if (!ye(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Me !== void 0 ? Me.createHTML(e) : e;
}
const Gt = (t, e) => {
  const a = t.length - 1, i = [];
  let n, s = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = q;
  for (let c = 0; c < a; c++) {
    const o = t[c];
    let l, d, u = -1, p = 0;
    for (; p < o.length && (r.lastIndex = p, d = r.exec(o), d !== null); ) p = r.lastIndex, r === q ? d[1] === "!--" ? r = Se : d[1] !== void 0 ? r = Ee : d[2] !== void 0 ? (nt.test(d[2]) && (n = RegExp("</" + d[2], "g")), r = E) : d[3] !== void 0 && (r = E) : r === E ? d[0] === ">" ? (r = n ?? q, u = -1) : d[1] === void 0 ? u = -2 : (u = r.lastIndex - d[2].length, l = d[1], r = d[3] === void 0 ? E : d[3] === '"' ? Ie : Te) : r === Ie || r === Te ? r = E : r === Se || r === Ee ? r = q : (r = E, n = void 0);
    const g = r === E && t[c + 1].startsWith("/>") ? " " : "";
    s += r === q ? o + Ot : u >= 0 ? (i.push(l), o.slice(0, u) + at + o.slice(u) + S + g) : o + S + (u === -2 ? c : g);
  }
  return [st(t, s + (t[a] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Y {
  constructor({ strings: e, _$litType$: a }, i) {
    let n;
    this.parts = [];
    let s = 0, r = 0;
    const c = e.length - 1, o = this.parts, [l, d] = Gt(e, a);
    if (this.el = Y.createElement(l, i), T.currentNode = this.el.content, a === 2 || a === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (n = T.nextNode()) !== null && o.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const u of n.getAttributeNames()) if (u.endsWith(at)) {
          const p = d[r++], g = n.getAttribute(u).split(S), f = /([.?@])?(.*)/.exec(p);
          o.push({ type: 1, index: s, name: f[2], strings: g, ctor: f[1] === "." ? Vt : f[1] === "?" ? Kt : f[1] === "@" ? Wt : ie }), n.removeAttribute(u);
        } else u.startsWith(S) && (o.push({ type: 6, index: s }), n.removeAttribute(u));
        if (nt.test(n.tagName)) {
          const u = n.textContent.split(S), p = u.length - 1;
          if (p > 0) {
            n.textContent = ee ? ee.emptyScript : "";
            for (let g = 0; g < p; g++) n.append(u[g], K()), T.nextNode(), o.push({ type: 2, index: ++s });
            n.append(u[p], K());
          }
        }
      } else if (n.nodeType === 8) if (n.data === it) o.push({ type: 2, index: s });
      else {
        let u = -1;
        for (; (u = n.data.indexOf(S, u + 1)) !== -1; ) o.push({ type: 7, index: s }), u += S.length - 1;
      }
      s++;
    }
  }
  static createElement(e, a) {
    const i = H.createElement("template");
    return i.innerHTML = e, i;
  }
}
function j(t, e, a = t, i) {
  if (e === O) return e;
  let n = i !== void 0 ? a._$Co?.[i] : a._$Cl;
  const s = W(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== s && (n?._$AO?.(!1), s === void 0 ? n = void 0 : (n = new s(t), n._$AT(t, a, i)), i !== void 0 ? (a._$Co ??= [])[i] = n : a._$Cl = n), n !== void 0 && (e = j(t, n._$AS(t, e.values), n, i)), e;
}
class qt {
  constructor(e, a) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = a;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: a }, parts: i } = this._$AD, n = (e?.creationScope ?? H).importNode(a, !0);
    T.currentNode = n;
    let s = T.nextNode(), r = 0, c = 0, o = i[0];
    for (; o !== void 0; ) {
      if (r === o.index) {
        let l;
        o.type === 2 ? l = new X(s, s.nextSibling, this, e) : o.type === 1 ? l = new o.ctor(s, o.name, o.strings, this, e) : o.type === 6 && (l = new Yt(s, this, e)), this._$AV.push(l), o = i[++c];
      }
      r !== o?.index && (s = T.nextNode(), r++);
    }
    return T.currentNode = H, n;
  }
  p(e) {
    let a = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, a), a += i.strings.length - 2) : i._$AI(e[a])), a++;
  }
}
class X {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, a, i, n) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = e, this._$AB = a, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const a = this._$AM;
    return a !== void 0 && e?.nodeType === 11 && (e = a.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, a = this) {
    e = j(this, e, a), W(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== O && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : jt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && W(this._$AH) ? this._$AA.nextSibling.data = e : this.T(H.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: a, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Y.createElement(st(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(a);
    else {
      const s = new qt(n, this), r = s.u(this.options);
      s.p(a), this.T(r), this._$AH = s;
    }
  }
  _$AC(e) {
    let a = He.get(e.strings);
    return a === void 0 && He.set(e.strings, a = new Y(e)), a;
  }
  k(e) {
    ye(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let i, n = 0;
    for (const s of e) n === a.length ? a.push(i = new X(this.O(K()), this.O(K()), this, this.options)) : i = a[n], i._$AI(s), n++;
    n < a.length && (this._$AR(i && i._$AB.nextSibling, n), a.length = n);
  }
  _$AR(e = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); e !== this._$AB; ) {
      const i = Re(e).nextSibling;
      Re(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class ie {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, a, i, n, s) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = a, this._$AM = n, this.options = s, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(e, a = this, i, n) {
    const s = this.strings;
    let r = !1;
    if (s === void 0) e = j(this, e, a, 0), r = !W(e) || e !== this._$AH && e !== O, r && (this._$AH = e);
    else {
      const c = e;
      let o, l;
      for (e = s[0], o = 0; o < s.length - 1; o++) l = j(this, c[i + o], a, o), l === O && (l = this._$AH[o]), r ||= !W(l) || l !== this._$AH[o], l === _ ? e = _ : e !== _ && (e += (l ?? "") + s[o + 1]), this._$AH[o] = l;
    }
    r && !n && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Vt extends ie {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class Kt extends ie {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class Wt extends ie {
  constructor(e, a, i, n, s) {
    super(e, a, i, n, s), this.type = 5;
  }
  _$AI(e, a = this) {
    if ((e = j(this, e, a, 0) ?? _) === O) return;
    const i = this._$AH, n = e === _ && i !== _ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, s = e !== _ && (i === _ || n);
    n && this.element.removeEventListener(this.name, this, i), s && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Yt {
  constructor(e, a, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    j(this, e);
  }
}
const Xt = fe.litHtmlPolyfillSupport;
Xt?.(Y, X), (fe.litHtmlVersions ??= []).push("3.3.3");
const Jt = (t, e, a) => {
  const i = a?.renderBefore ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const s = a?.renderBefore ?? null;
    i._$litPart$ = n = new X(e.insertBefore(K(), s), s, void 0, a ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const xe = globalThis;
class N extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = Jt(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return O;
  }
}
N._$litElement$ = !0, N.finalized = !0, xe.litElementHydrateSupport?.({ LitElement: N });
const Zt = xe.litElementPolyfillSupport;
Zt?.({ LitElement: N });
(xe.litElementVersions ??= []).push("4.2.2");
const Qt = {
  light: ["on"],
  switch: ["on"],
  fan: ["on"],
  input_boolean: ["on"],
  binary_sensor: ["on"],
  media_player: ["playing"],
  climate: ["cool", "heat", "heat_cool", "dry", "fan_only"],
  humidifier: ["on"],
  vacuum: ["cleaning", "returning"],
  cover: ["opening", "closing"],
  lock: ["locking", "unlocking"]
}, ea = {
  climate: {
    hvac_action: ["cooling", "heating", "drying", "fan"]
  }
}, ta = {
  on: "var(--ahc-on)",
  off: "var(--ahc-off)",
  cooling: "var(--ahc-cooling)",
  heating: "var(--ahc-heating)",
  drying: "var(--ahc-idle)",
  fan: "var(--ahc-idle)",
  playing: "var(--ahc-playing)",
  opening: "var(--ahc-opening)",
  closing: "var(--ahc-closing)",
  idle: "var(--ahc-idle)",
  unknown: "var(--ahc-unknown)",
  unavailable: "var(--ahc-unknown)"
}, b = {
  title: "היסטוריית פעילות חכמה",
  auto_discover: !0,
  debug: !1,
  hours_to_show: 24,
  live: !1,
  display_mode: "card",
  view_mode: "activity",
  group_by: "area",
  show_summary: !0,
  show_insights: !0,
  show_now_line: !0,
  show_legend: !0,
  show_fullscreen_button: !0,
  significant_changes_only: !0,
  minimal_response: !0,
  refresh_interval_seconds: 300,
  min_duration_seconds: 20,
  merge_gap_seconds: 15,
  max_visible_rows: 18,
  activity_density_buckets: 0,
  show_activity_density: !0,
  smart_filter: !0,
  activity_mode: "meaningful",
  hide_empty_rows: !0,
  hide_empty_groups: !0,
  min_row_active_seconds: 10,
  max_rows_per_group: 4,
  max_total_rows: 18,
  show_technical_entities: !1,
  show_config_entities: !1,
  show_diagnostic_entities: !1,
  show_inactive_baselines: !1,
  show_entity_id_when_name_missing: !1,
  summary_scope: "visible",
  collapse_groups: !1,
  show_area_inventory: !0,
  area_inventory_mode: "compact",
  area_inventory_include_inactive: !0,
  area_inventory_max_items: 12,
  area_inventory_group_by_domain: !0,
  area_inventory_show_state: !0,
  area_inventory_show_last_activity: !0,
  timeline_height: "min(62svh, 680px)",
  mobile_breakpoint: 760
}, M = {
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
}, Q = [
  "light",
  "switch",
  "climate",
  "media_player",
  "cover",
  "fan"
], z = {
  on: "דלוק",
  off: "כבוי",
  cooling: "קירור",
  heating: "חימום",
  drying: "ייבוש",
  fan: "מאוורר",
  playing: "מנגן",
  opening: "פתוח",
  closing: "נסגר",
  idle: "המתנה",
  unknown: "לא ידוע",
  unavailable: "לא זמין"
};
function rt(t, e, a) {
  const i = aa(e, a), n = ia(e, i), s = n.map(() => /* @__PURE__ */ new Set());
  for (const c of t)
    for (const o of c.segments)
      if (o.active)
        for (let l = 0; l < n.length; l += 1) {
          const d = n[l];
          if (!d) continue;
          const u = na(o, d.start, d.end);
          u <= 0 || (d.totalActiveMs += u, d.eventCount += sa(o, d) ? 1 : 0, s[l]?.add(c.entity.entity_id));
        }
  const r = Math.max(
    1,
    ...n.map((c) => c.totalActiveMs)
  );
  return n.map((c, o) => ({
    ...c,
    activeEntityCount: s[o]?.size ?? 0,
    intensity: c.totalActiveMs / r
  }));
}
function aa(t, e) {
  const a = e.activity_density_buckets;
  if (typeof a == "number" && Number.isFinite(a) && a > 0)
    return Math.max(1, Math.floor(a));
  const i = Math.max(
    1,
    (t.end.getTime() - t.start.getTime()) / 36e5
  );
  return i <= 30 ? 24 : i <= 24 * 3 ? 48 : 84;
}
function ia(t, e) {
  const a = t.start.getTime(), i = t.end.getTime(), s = Math.max(1, i - a) / e;
  return Array.from({ length: e }, (r, c) => {
    const o = a + c * s, l = c === e - 1 ? i : o + s;
    return {
      start: new Date(o),
      end: new Date(l),
      totalActiveMs: 0,
      eventCount: 0,
      activeEntityCount: 0,
      intensity: 0
    };
  });
}
function na(t, e, a) {
  const i = Math.max(t.start.getTime(), e.getTime()), n = Math.min(t.end.getTime(), a.getTime());
  return Math.max(0, n - i);
}
function sa(t, e) {
  const a = t.start.getTime();
  return a >= e.start.getTime() && a < e.end.getTime();
}
const ra = [
  "extra dry",
  "half load",
  "silence on demand",
  "vario speed",
  "program",
  "progress",
  "finish",
  "remote start",
  "child lock",
  "power switch",
  "option",
  "setting",
  "config",
  "diagnostic",
  "firmware",
  "update",
  "battery",
  "signal",
  "rssi",
  "router",
  "lan",
  "wlan",
  "uptime",
  "connection",
  "cloud",
  "bridge",
  "hub",
  "תוכנית",
  "תכנית",
  "מצב תוכנית",
  "מצב תכנית",
  "התקדמות",
  "סיום",
  "שטיפה",
  "ייבוש",
  "חצי כמות",
  "מהירות",
  "שקט",
  "נעילה",
  "נעילת ילדים",
  "הגדרה",
  "אפשרות",
  "אבחון",
  "עדכון",
  "סוללה",
  "אות",
  "ראוטר",
  "רשת",
  "חיבור",
  "ענן",
  "גשר",
  "רכזת"
], oa = [
  "firmware",
  "update",
  "battery",
  "signal",
  "rssi",
  "router",
  "lan",
  "wlan",
  "uptime",
  "connection",
  "cloud",
  "bridge",
  "hub",
  "diagnostic",
  "אבחון",
  "עדכון",
  "סוללה",
  "אות",
  "ראוטר",
  "רשת",
  "חיבור",
  "ענן",
  "גשר",
  "רכזת"
], ca = /* @__PURE__ */ new Set([
  "power",
  "program",
  "extra dry",
  "half load",
  "remote start",
  "child lock",
  "נעילת ילדים",
  "חצי כמות"
]), ot = /* @__PURE__ */ new Set([
  "off",
  "idle",
  "unknown",
  "unavailable"
]);
function re(t, e, a = {}) {
  const i = a.showAll === !0 || e.activity_mode === "all", n = ba(e, i), s = e.smart_filter !== !1 && n === "meaningful" && !i, r = e.show_inactive_baselines ?? b.show_inactive_baselines, c = /* @__PURE__ */ new Map(), o = pt(e), l = (_t(e.min_row_active_seconds) ?? b.min_row_active_seconds) * 1e3, d = Pe(e.max_rows_per_group) ?? b.max_rows_per_group, u = Pe(e.max_total_rows) ?? b.max_total_rows;
  let p = 0;
  const g = [], f = [];
  for (const w of t) {
    const m = o.has(w.entity.entity_id);
    m && (p += 1);
    const k = s ? ha(w, e, l, m) : { row: w };
    k.reason ? (f.push(w), c.set(w.entity.entity_id, k.reason)) : k.row && g.push(k.row);
  }
  const x = s ? pa(g, f, c, {
    groupBy: a.groupBy ?? "area",
    manualEntityIds: o,
    maxRowsPerGroup: d,
    maxTotalRows: u
  }) : { rows: g, hiddenRows: f };
  return {
    rows: x.rows,
    hiddenRows: x.hiddenRows,
    hiddenReasons: c,
    diagnostics: ga({
      totalRows: t.length,
      visibleRows: x.rows.length,
      hiddenRows: x.hiddenRows.length,
      hiddenReasons: c,
      smartFilter: s,
      activityMode: n,
      showInactiveBaselines: r,
      showAll: i,
      manualRowsProtected: p,
      maxRowsPerGroup: d,
      maxTotalRows: u
    })
  };
}
function ct(t, e) {
  if (pt(e).has(t.entity_id))
    return { visible: !0, confidence: "explicit" };
  if (t.hidden_by)
    return { visible: !1, reason: "hidden", confidence: "registry" };
  if (t.disabled_by)
    return { visible: !1, reason: "disabled", confidence: "registry" };
  if (t.entity_category === "config" && e.show_config_entities !== !0)
    return { visible: !1, reason: "config", confidence: "registry" };
  if (t.entity_category === "diagnostic" && e.show_diagnostic_entities !== !0)
    return { visible: !1, reason: "diagnostic", confidence: "registry" };
  if (e.show_technical_entities !== !0) {
    const a = ht(t);
    if (dt(t))
      return { visible: !1, reason: "technical", confidence: "heuristic" };
    if (a)
      return { visible: !1, reason: "noisy_name", confidence: "heuristic" };
  }
  return { visible: !0, confidence: "heuristic" };
}
function la(t) {
  return dt(t.entity) || t.entity.domain === "switch" && ht(t.entity);
}
function da(t, e) {
  return t.segments.filter(
    (a) => lt(a) && a.durationMs >= e
  );
}
function B(t) {
  if (!t) return "";
  if (t.showAll)
    return "מצב הצגת הכל פעיל";
  if (t.totalRows === t.visibleRows)
    return "";
  const e = [];
  return t.hiddenNoMeaningfulRows && e.push(`${t.hiddenNoMeaningfulRows} ללא פעילות`), t.hiddenTooShortRows && e.push(`${t.hiddenTooShortRows} קצרות מדי`), (t.hiddenTechnicalRows || t.hiddenNoisyNameRows) && e.push(
    `${t.hiddenTechnicalRows + t.hiddenNoisyNameRows} טכניות`
  ), (t.hiddenConfigRows || t.hiddenDiagnosticRows) && e.push(
    `${t.hiddenConfigRows + t.hiddenDiagnosticRows} אבחון/הגדרה`
  ), t.hiddenMaxRows && e.push(`${t.hiddenMaxRows} מעבר למגבלה`), `מציג ${t.visibleRows} רכיבים פעילים מתוך ${t.totalRows}${e.length ? ` · הוסתרו ${e.join(", ")}` : ""}`;
}
function ha(t, e, a, i) {
  const n = ct(t.entity, e);
  if (!i && !n.visible)
    return { reason: n.reason ?? "technical" };
  const s = da(t, a);
  return s.length ? { row: ua(t, s) } : i ? { row: t } : (e.hide_empty_rows ?? b.hide_empty_rows) === !1 ? { row: t } : t.segments.length ? {
    reason: t.segments.some(
      (c) => lt(c) && c.durationMs < a
    ) ? "too_short" : "no_meaningful_activity"
  } : { reason: "empty" };
}
function ua(t, e) {
  const a = e.reduce(
    (n, s) => n + s.durationMs,
    0
  ), i = t.currentCategory;
  return {
    ...t,
    segments: e,
    totalActiveMs: a,
    eventCount: e.length,
    currentCategory: i && !ot.has(i) ? i : void 0
  };
}
function lt(t) {
  return t.active && !ot.has(t.category);
}
function pa(t, e, a, i) {
  const n = t.filter(
    (u) => i.manualEntityIds.has(u.entity.entity_id)
  ), s = t.filter(
    (u) => !i.manualEntityIds.has(u.entity.entity_id)
  ), r = /* @__PURE__ */ new Map();
  for (const u of oe(s)) {
    const p = _a(u, i.groupBy), g = r.get(p) ?? [];
    if (g.length >= i.maxRowsPerGroup) {
      e.push(u), a.set(u.entity.entity_id, "max_rows");
      continue;
    }
    g.push(u), r.set(p, g);
  }
  const c = [...r.values()].flat(), o = new Set(
    n.map((u) => u.entity.entity_id)
  ), l = [
    ...oe(n),
    ...oe(c)
  ], d = [];
  for (const u of l) {
    if (!o.has(u.entity.entity_id) && d.length >= i.maxTotalRows) {
      e.push(u), a.set(u.entity.entity_id, "max_rows");
      continue;
    }
    d.push(u);
  }
  return { rows: d, hiddenRows: e };
}
function oe(t) {
  return [...t].sort(
    (e, a) => Number(De(a)) - Number(De(e)) || a.totalActiveMs - e.totalActiveMs || a.eventCount - e.eventCount || e.entity.name.localeCompare(a.entity.name, "he")
  );
}
function De(t) {
  const e = Date.now();
  return t.segments.some(
    (a) => a.active && a.start.getTime() <= e && a.end.getTime() >= e - 9e4
  );
}
function _a(t, e) {
  return e === "domain" ? t.entity.domain || "other" : e === "none" || e === "entity" ? "all" : t.entity.area || "ללא אזור";
}
function ga(t) {
  const e = {};
  for (const a of t.hiddenReasons.values())
    e[a] = (e[a] ?? 0) + 1;
  return {
    totalRows: t.totalRows,
    visibleRows: t.visibleRows,
    hiddenRows: t.hiddenRows,
    hiddenEmptyRows: e.empty ?? 0,
    hiddenNoMeaningfulRows: e.no_meaningful_activity ?? 0,
    hiddenTooShortRows: e.too_short ?? 0,
    hiddenTechnicalRows: e.technical ?? 0,
    hiddenNoisyNameRows: e.noisy_name ?? 0,
    hiddenConfigRows: e.config ?? 0,
    hiddenDiagnosticRows: e.diagnostic ?? 0,
    hiddenHiddenRows: e.hidden ?? 0,
    hiddenDisabledRows: e.disabled ?? 0,
    hiddenMinDurationRows: e.too_short ?? 0,
    hiddenMaxRows: e.max_rows ?? 0,
    hiddenByReason: e,
    smartFilter: t.smartFilter,
    activityMode: t.activityMode,
    showInactiveBaselines: t.showInactiveBaselines,
    showAll: t.showAll,
    manualRowsProtected: t.manualRowsProtected,
    maxRowsPerGroup: t.maxRowsPerGroup,
    maxTotalRows: t.maxTotalRows
  };
}
function dt(t) {
  const e = ma(t, !0);
  return oa.some((a) => ut(e, a));
}
function ht(t) {
  const e = te(t.name), a = te(t.entity_id), i = `${e} ${a}`;
  return t.domain === "switch" && ca.has(e) ? !0 : ra.some((n) => ut(i, n));
}
function ma(t, e = !1) {
  return [
    t.entity_id,
    t.name,
    e ? t.device_name : void 0,
    e ? t.device_manufacturer : void 0,
    e ? t.device_model : void 0,
    ...t.labels ?? []
  ].filter(Boolean).map((a) => te(String(a))).join(" ");
}
function ut(t, e) {
  const a = te(e);
  if (!a) return !1;
  if (/^[a-z0-9 ]+$/i.test(a)) {
    const i = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|\\s)${i}(\\s|$)`, "i").test(t);
  }
  return t.includes(a);
}
function ba(t, e) {
  return e ? "all" : t.activity_mode ?? b.activity_mode;
}
function pt(t) {
  return new Set(
    (t.entities ?? []).map(
      (e) => typeof e == "string" ? e : e.entity
    )
  );
}
function _t(t) {
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : void 0;
}
function Pe(t) {
  const e = _t(t);
  return e ? Math.floor(e) : void 0;
}
function te(t) {
  return t.trim().toLowerCase().replace(/[_./-]+/g, " ").replace(/\s+/g, " ");
}
const va = ["ar", "fa", "he", "iw", "ur"];
function U(t) {
  return t.includes(".") ? t.split(".")[0] ?? t : t;
}
function ce(t, e = /* @__PURE__ */ new Date()) {
  if (t.start_time) {
    const s = new Date(t.start_time), r = t.end_time ? new Date(t.end_time) : e;
    return { start: s, end: r };
  }
  const a = t.hours_to_show ?? 24, i = t.end_time ? new Date(t.end_time) : e;
  return { start: new Date(i.getTime() - a * 60 * 60 * 1e3), end: i };
}
function fa(t, e) {
  if (t === !0 || t === "rtl") return !0;
  if (t === !1 || t === "ltr") return !1;
  const a = (e || document.documentElement.lang || navigator.language || "").toLowerCase();
  return va.some(
    (i) => a === i || a.startsWith(`${i}-`)
  );
}
function y(t) {
  if (!Number.isFinite(t) || t <= 0) return "0 דק׳";
  const e = Math.round(t / 6e4), a = Math.floor(e / 60), i = e % 60;
  return a && i ? `${a}:${String(i).padStart(2, "0")} שעות` : a ? `${a} שעות` : `${i} דק׳`;
}
function v(t) {
  return new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(t);
}
function ya(t, e, a) {
  return Math.min(a, Math.max(e, t));
}
function F(t, e) {
  const a = e.end.getTime() - e.start.getTime();
  return a <= 0 ? 0 : ya(
    (t.getTime() - e.start.getTime()) / a * 100,
    0,
    100
  );
}
function gt(t) {
  const [, e = t] = t.split(".");
  return e.replace(/_/g, " ");
}
function L(t) {
  const e = t.flatMap((p) => p.rows), a = e.flatMap(
    (p) => p.segments.filter((g) => g.active)
  ), i = a.reduce(
    (p, g) => p + g.durationMs,
    0
  ), n = e.filter((p) => p.totalActiveMs > 0), s = a.length, r = Date.now(), c = e.filter(
    (p) => p.segments.some(
      (g) => g.active && g.start.getTime() <= r && g.end.getTime() >= r - 9e4
    )
  ).length, o = [...a].sort(
    (p, g) => g.start.getTime() - p.start.getTime()
  )[0], l = o ? e.find((p) => p.entity.entity_id === o.entity_id) : void 0, d = [...n].sort(
    (p, g) => g.totalActiveMs - p.totalActiveMs
  )[0], u = [...t].filter((p) => p.totalActiveMs > 0).sort((p, g) => g.totalActiveMs - p.totalActiveMs)[0];
  return {
    totalActiveMs: i,
    activeEntityCount: n.length,
    eventCount: s,
    activeNowCount: c,
    lastEvent: o,
    lastEventRow: l,
    mostActiveEntity: d,
    mostActiveArea: u,
    peakBucketLabel: xa(a)
  };
}
function xa(t) {
  if (!t.length) return;
  const e = new Array(24).fill(0);
  for (const n of t) {
    const s = n.start.getHours();
    e[s] = (e[s] ?? 0) + n.durationMs;
  }
  const a = Math.max(...e), i = e.indexOf(a);
  if (!(i < 0))
    return `${String(i).padStart(2, "0")}:00 – ${String((i + 1) % 24).padStart(2, "0")}:00`;
}
function wa(t) {
  return t > 70 ? "ultra-dense" : t > 30 ? "dense" : "normal";
}
function we(t, e) {
  const a = t.reduce(
    (c, o) => c + o.rows.length,
    0
  );
  let n = Number.isFinite(e) && e && e > 0 ? Math.floor(e) : a;
  const s = [];
  for (const c of t) {
    if (n <= 0) {
      s.push({ ...c, rows: [] });
      continue;
    }
    const o = c.rows.slice(0, n);
    n -= o.length, s.push({ ...c, rows: o });
  }
  const r = s.reduce(
    (c, o) => c + o.rows.length,
    0
  );
  return {
    groups: s,
    totalRowCount: a,
    visibleRowCount: r,
    hiddenRowCount: Math.max(0, a - r),
    density: wa(r)
  };
}
const ka = 0.5;
function mt(t, e) {
  const a = e.start.getTime(), i = e.end.getTime(), n = Math.max(1, i - a), s = Math.max(t.start.getTime(), a), r = Math.min(t.end.getTime(), i), c = Math.min(Math.max(s, a), i), o = Math.min(Math.max(r, a), i), l = Math.max(0, o - c), d = Le((c - a) / n * 100), u = Le(l / n * 100);
  return {
    leftPct: d,
    widthPct: u,
    minVisible: t.active && l > 0 && u < ka
  };
}
function Le(t) {
  return Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : 0;
}
const $a = 6e4;
function Aa(t, e) {
  const a = t.map((r) => {
    const c = r.rows.filter(Ua).sort(
      (o, l) => l.totalActiveMs - o.totalActiveMs || l.eventCount - o.eventCount || o.entity.name.localeCompare(l.entity.name, "he")
    );
    return {
      ...r,
      rows: c,
      totalActiveMs: c.reduce((o, l) => o + l.totalActiveMs, 0),
      subtitle: `${c.length} רכיבים`
    };
  }).filter((r) => r.rows.length > 0).sort(
    (r, c) => c.totalActiveMs - r.totalActiveMs || c.rows.length - r.rows.length || r.title.localeCompare(c.title, "he")
  ), i = we(
    a,
    e.max_visible_rows ?? e.max_total_rows
  ), n = i.groups.filter((r) => r.rows.length > 0), s = n.reduce(
    (r, c) => r + c.rows.length,
    0
  );
  return {
    groups: n,
    totalRowCount: i.totalRowCount,
    visibleRowCount: s,
    hiddenRowCount: Math.max(0, i.totalRowCount - s)
  };
}
function Ne(t, e, a, i, n = {}) {
  const s = Aa(t, a), r = s.groups.flatMap((m) => m.rows), c = n.inventoryRows ?? t.flatMap((m) => m.rows), o = Sa(
    c,
    a,
    n.groupBy
  ), l = Ca(
    t,
    s.groups,
    o,
    e
  ), d = i?.totalRows ?? s.totalRowCount, u = Math.max(
    0,
    i?.hiddenRows ?? 0,
    s.hiddenRowCount,
    d - s.visibleRowCount
  ), p = rt(r, e, a), g = r.reduce(
    (m, k) => m + k.totalActiveMs,
    0
  ), f = r.reduce(
    (m, k) => m + k.eventCount,
    0
  ), x = l.reduce(
    (m, k) => m + k.inventoryItemCount,
    0
  ), w = n.selectedAreas?.length === 1 || l.length === 1 && n.groupBy !== "domain";
  return {
    range: e,
    totalRowsBeforeCuration: d,
    visibleRowsCount: s.visibleRowCount,
    hiddenRowsCount: u,
    hiddenReasonSummary: B(i),
    totalVisibleActiveMs: g,
    visibleEventCount: f,
    activeNowCount: r.filter(I).length,
    totalInventoryItemCount: x,
    singleAreaFocused: w,
    densityBuckets: p,
    groups: l,
    insights: Ia(l, p)
  };
}
function za(t) {
  const e = t.groups.map((a) => ({
    id: a.id,
    title: a.title,
    subtitle: `${a.activityRows.length} רכיבי פעילות`,
    icon: a.icon,
    totalActiveMs: a.totalActiveMs,
    rows: a.activityRows.map((i) => ({
      entity: {
        entity_id: i.entityId,
        name: i.name,
        domain: i.domain,
        area: i.area,
        icon: i.icon
      },
      segments: i.segments.map((n) => ({
        entity_id: i.entityId,
        state: n.category,
        category: n.category,
        active: !0,
        start: n.start,
        end: n.end,
        durationMs: Math.max(
          0,
          n.end.getTime() - n.start.getTime()
        )
      })),
      totalActiveMs: i.totalActiveMs,
      eventCount: i.eventCount,
      currentCategory: i.activeNow ? i.segments.at(-1)?.category : void 0
    }))
  }));
  return L(e);
}
function Ca(t, e, a, i) {
  const n = new Map(t.map((o) => [o.id, o])), s = new Map(e.map((o) => [o.id, o])), r = new Map(
    a.map((o) => [o.id, o])
  );
  return [
    .../* @__PURE__ */ new Set([...s.keys(), ...r.keys()])
  ].map((o) => {
    const l = s.get(o), d = r.get(o);
    return {
      id: o,
      totalActiveMs: l?.totalActiveMs ?? 0,
      activityCount: l?.rows.length ?? 0,
      inventoryCount: d?.rows.length ?? 0,
      title: l?.title ?? d?.title ?? o
    };
  }).filter((o) => o.activityCount > 0 || o.inventoryCount > 0).sort(
    (o, l) => l.totalActiveMs - o.totalActiveMs || l.activityCount - o.activityCount || l.inventoryCount - o.inventoryCount || o.title.localeCompare(l.title, "he")
  ).map((o) => o.id).map(
    (o) => Ra(
      s.get(o),
      n.get(o),
      r.get(o),
      i
    )
  );
}
function Ra(t, e, a, i) {
  const n = t ?? e, s = (t?.rows ?? []).map(
    (d) => Ma(d, i)
  ), r = (a?.rows ?? []).map(Ea).sort(Ha), c = s.reduce((d, u) => d + u.eventCount, 0), o = s.filter((d) => d.activeNow).length, l = e?.rows.length ?? s.length;
  return {
    id: t?.id ?? a?.id ?? e?.id ?? "all",
    title: t?.title ?? a?.title ?? e?.title ?? "כל הרכיבים",
    icon: t?.icon ?? a?.icon ?? e?.icon,
    area: t?.title ?? a?.area ?? e?.title,
    totalEntityCount: r.length,
    visibleActivityRowCount: s.length,
    inventoryItemCount: r.length,
    hiddenRowsCount: Math.max(0, l - s.length),
    totalActiveMs: s.reduce(
      (d, u) => d + u.totalActiveMs,
      0
    ),
    eventCount: c,
    activeNowCount: o,
    aggregateSegments: Ta(
      t?.rows ?? [],
      i,
      n?.title ?? a?.title ?? "פעילות"
    ),
    activityRows: s,
    inventoryItems: r
  };
}
function Ma(t, e) {
  const a = t.segments.map((i, n) => ({ segment: i, sourceIndex: n })).filter((i) => i.segment.active).map(
    ({ segment: i, sourceIndex: n }) => bt(
      i,
      e,
      `${t.entity.name} · ${z[i.category]} · ${v(
        i.start
      )} עד ${v(i.end)} · ${y(i.durationMs)}`,
      n
    )
  ).filter(
    (i) => !!(i && i.widthPct > 0)
  );
  return {
    entityId: t.entity.entity_id,
    name: t.entity.name,
    secondary: [t.entity.area, M[t.entity.domain]].filter(Boolean).join(" · "),
    icon: t.entity.icon,
    domain: t.entity.domain,
    area: t.entity.area,
    totalActiveMs: t.totalActiveMs,
    eventCount: t.eventCount,
    activeNow: I(t),
    segments: a
  };
}
function Sa(t, e, a = "area") {
  const i = Oa(
    e.area_inventory_domains?.length ? e.area_inventory_domains : e.domains
  ), n = e.area_inventory_include_inactive ?? b.area_inventory_include_inactive, s = /* @__PURE__ */ new Map();
  for (const r of t) {
    if (i.length && !i.includes(r.entity.domain) || !n && r.totalActiveMs <= 0 && !I(r) || !ct(r.entity, e).visible) continue;
    const o = Da(r.entity, a), l = s.get(o) ?? {
      id: o,
      title: Pa(r.entity, a),
      icon: La(r.entity, a),
      area: r.entity.area,
      rows: []
    };
    l.rows.push(r), s.set(o, l);
  }
  return [...s.values()].map((r) => ({
    ...r,
    rows: [...r.rows].sort(
      (c, o) => Number(I(o)) - Number(I(c)) || +(o.totalActiveMs > 0) - +(c.totalActiveMs > 0) || c.entity.name.localeCompare(o.entity.name, "he")
    )
  }));
}
function Ea(t) {
  const e = t.entity.entity_category === "config" || t.entity.entity_category === "diagnostic" ? t.entity.entity_category : null;
  return {
    entityId: t.entity.entity_id,
    name: t.entity.name,
    domain: t.entity.domain,
    area: t.entity.area,
    icon: t.entity.icon,
    currentState: t.currentState,
    currentCategory: t.currentCategory,
    currentStateLabel: Na(t),
    stateTone: Ba(t),
    activeNow: I(t),
    hadActivityInRange: t.totalActiveMs > 0,
    totalActiveMs: t.totalActiveMs,
    eventCount: t.eventCount,
    entityCategory: e,
    isTechnical: la(t)
  };
}
function Ta(t, e, a) {
  const i = t.flatMap((s) => s.segments.filter((r) => r.active)).sort((s, r) => s.start.getTime() - r.start.getTime()), n = [];
  for (const s of i) {
    const r = n.at(-1);
    if (r && s.start.getTime() <= r.end.getTime() + $a) {
      r.end = new Date(
        Math.max(r.end.getTime(), s.end.getTime())
      ), r.durationMs = Math.max(
        0,
        r.end.getTime() - r.start.getTime()
      ), r.category !== s.category && (r.category = "on");
      continue;
    }
    n.push({ ...s });
  }
  return n.map(
    (s) => bt(
      s,
      e,
      `${a} · פעילות מצטברת · ${v(
        s.start
      )} עד ${v(s.end)} · ${y(s.durationMs)}`
    )
  ).filter(
    (s) => !!(s && s.widthPct > 0)
  );
}
function bt(t, e, a, i) {
  const n = mt(t, e);
  if (!(n.widthPct <= 0))
    return {
      start: t.start,
      end: t.end,
      category: t.category,
      label: a,
      colorVar: ta[t.category],
      leftPct: n.leftPct,
      widthPct: n.widthPct,
      minVisible: n.minVisible,
      sourceIndex: i
    };
}
function Ia(t, e) {
  const a = t.flatMap((o) => o.activityRows), i = t.reduce(
    (o, l) => o + l.inventoryItemCount,
    0
  ), n = t.reduce(
    (o, l) => o + l.inventoryItems.filter((d) => d.activeNow).length,
    0
  ), s = [...a].sort(
    (o, l) => l.totalActiveMs - o.totalActiveMs
  )[0], r = [...t].sort(
    (o, l) => l.totalActiveMs - o.totalActiveMs
  )[0], c = [...e].sort(
    (o, l) => l.totalActiveMs - o.totalActiveMs
  )[0];
  return {
    mostActiveEntity: s ? {
      name: s.name,
      secondary: s.secondary,
      totalActiveMs: s.totalActiveMs,
      eventCount: s.eventCount
    } : void 0,
    mostActiveArea: r && r.totalActiveMs > 0 ? {
      title: r.title,
      totalActiveMs: r.totalActiveMs,
      eventCount: r.eventCount,
      rowCount: r.activityRows.length,
      inventoryCount: r.inventoryItemCount
    } : void 0,
    peakBucketLabel: c && c.totalActiveMs > 0 ? `${v(c.start)} - ${v(c.end)}` : void 0,
    shortUsePattern: a.length ? `${a.length} רכיבי פעילות · ${t.length} אזורים` : void 0,
    inventoryPattern: i ? `${i} אביזרים במלאי · ${n} פעילים עכשיו` : void 0
  };
}
function Ha(t, e) {
  return Number(e.activeNow) - Number(t.activeNow) || Number(e.hadActivityInRange) - Number(t.hadActivityInRange) || pe(t.domain).localeCompare(pe(e.domain), "he") || t.name.localeCompare(e.name, "he");
}
function Da(t, e) {
  return e === "domain" ? t.domain || "other" : e === "none" || e === "entity" ? "all" : t.area || "ללא אזור";
}
function Pa(t, e) {
  return e === "domain" ? pe(t.domain) : e === "none" || e === "entity" ? "כל הרכיבים" : t.area || "ללא אזור";
}
function La(t, e) {
  if (e === "domain") return ja(t.domain);
}
function Na(t) {
  return t.currentCategory ? z[t.currentCategory] : t.currentState ? t.currentState : t.totalActiveMs > 0 ? "היתה פעילות" : "לא פעיל";
}
function Ba(t) {
  return Fa(t) ? "unavailable" : I(t) ? "active" : t.totalActiveMs > 0 ? "had_activity" : "inactive";
}
function Fa(t) {
  return t.currentState === "unavailable" || t.currentState === "unknown" || t.currentCategory === "unknown" && t.totalActiveMs <= 0;
}
function pe(t) {
  return M[t] ?? t;
}
function Oa(t) {
  return (t ?? []).map((e) => e.trim()).filter(Boolean).map((e) => e.toLowerCase());
}
function ja(t) {
  return t === "light" ? "mdi:lightbulb-outline" : t === "climate" ? "mdi:thermostat" : t === "media_player" ? "mdi:music" : t === "cover" ? "mdi:window-shutter" : t === "fan" ? "mdi:fan" : "mdi:toggle-switch-outline";
}
function Ua(t) {
  return t.segments.some((e) => e.active);
}
function I(t) {
  const e = Date.now();
  return t.segments.some(
    (a) => a.active && a.start.getTime() <= e && a.end.getTime() >= e - 9e4
  );
}
function le(t, e = !1) {
  return t ? [
    t.entity.area,
    M[t.entity.domain] ?? t.entity.domain,
    e ? t.entity.entity_id : void 0
  ].filter(Boolean).join(" · ") : "אין מספיק נתונים";
}
function Ga(t, e, a = !1) {
  const i = [
    ["רכיב", t.entity.name],
    ["אזור", t.entity.area ?? "ללא אזור"],
    ["סוג", M[t.entity.domain] ?? t.entity.domain],
    ["מצב", z[e.category] ?? e.state],
    ["התחלה", v(e.start)],
    ["סיום", v(e.end)],
    ["משך", y(e.durationMs)]
  ];
  return a && i.push(["entity_id", t.entity.entity_id]), i;
}
const Be = /* @__PURE__ */ new WeakMap();
async function qa(t, e) {
  const a = t.entities ?? [], i = e ? await Ya(e) : Xa(), n = a.map(
    (c) => typeof c == "string" ? { entity: c } : c
  );
  let s = !1;
  if (!n.length && e && t.auto_discover !== !1) {
    const c = Va(t, e, i);
    s = c.fallbackUsed, n.push(...c.entities);
  }
  return {
    entities: n.filter((c) => c.entity && !c.hidden).map((c) => Ka(c, t, e, i)).filter((c) => !!c).filter(
      (c) => ft(c.labels ?? [], t, i.labels)
    ),
    diagnostics: Ja(i, s, t)
  };
}
function Va(t, e, a) {
  const i = t.domains?.length ? t.domains : Q, n = D(t.exclude_domains ?? []), s = D(t.areas ?? []), r = [];
  if (a.entities.length) {
    const c = Oe(a.areas, "area_id"), o = Oe(a.devices, "id");
    for (const l of a.entities) {
      if (l.disabled_by || l.hidden_by || !e.states[l.entity_id] || !vt(l, t, !1)) continue;
      const d = U(l.entity_id);
      if (n.has(A(d)) || i.length && !i.includes(d) || !_e(l.entity_id, t)) continue;
      const u = l.device_id ? o.get(l.device_id) : void 0;
      if (u?.disabled_by) continue;
      const p = l.area_id || u?.area_id || void 0;
      if (!p) continue;
      const g = c.get(p), f = g?.name ?? p;
      if (s.size && !s.has(A(p)) && !s.has(A(f)))
        continue;
      const x = yt(l.labels, u?.labels, g?.labels);
      ft(x, t, a.labels) && r.push({
        entity: l.entity_id,
        area: f,
        domain: d
      });
    }
    return { entities: r, fallbackUsed: !1 };
  }
  for (const [c, o] of Object.entries(e.states)) {
    const l = U(c);
    if (n.has(A(l)) || i.length && !i.includes(l) || !_e(c, t)) continue;
    const d = $(o.attributes.area) ?? $(o.attributes.area_id);
    d && (s.size && !s.has(A(d)) || r.push({ entity: c, area: d, domain: l }));
  }
  return { entities: r, fallbackUsed: !0 };
}
function Ka(t, e, a, i) {
  const n = a?.states[t.entity], s = i.entities.find(
    (G) => G.entity_id === t.entity
  ), r = ti(t.entity, e);
  if (s?.disabled_by || s?.hidden_by || s && !vt(s, e, r))
    return;
  const c = s?.device_id ? i.devices.find((G) => G.id === s.device_id) : void 0;
  if (c?.disabled_by) return;
  const o = t.area ? void 0 : s?.area_id || c?.area_id || void 0, l = t.area ?? Za(o, i) ?? $(n?.attributes?.area) ?? $(n?.attributes?.area_id);
  if (e.areas?.length && (!l || !Qa(l, o, e.areas)))
    return;
  const d = t.domain ?? U(t.entity);
  if (!Wa(t.entity, d, e)) return;
  const u = yt(
    s?.labels,
    c?.labels,
    o ? i.areas.find((G) => G.area_id === o)?.labels : void 0
  ), p = n ? a?.formatEntityName?.(n) : void 0, g = n?.attributes?.friendly_name, f = $(t.name), x = $(s?.name) ?? $(s?.original_name), w = $(c?.name_by_user) ?? $(c?.name), m = $(p), k = $(g), ne = gt(t.entity), St = f ?? ai(
    m ?? k ?? x ?? ne,
    w,
    t.entity,
    d
  );
  return {
    entity_id: t.entity,
    name: St,
    area: l,
    area_id: o,
    domain: d,
    icon: t.icon ?? $(n?.attributes?.icon),
    labels: u,
    entity_category: $(s?.entity_category),
    device_id: $(s?.device_id),
    device_name: w,
    device_manufacturer: $(c?.manufacturer),
    device_model: $(c?.model),
    hidden_by: $(s?.hidden_by),
    disabled_by: $(s?.disabled_by),
    config: t
  };
}
function Wa(t, e, a) {
  return a.domains?.length && !D(a.domains).has(A(e)) || D(a.exclude_domains ?? []).has(A(e)) ? !1 : _e(t, a);
}
function _e(t, e) {
  const a = e.include_entity_globs ?? [], i = [
    ...e.exclude_entities ?? [],
    ...e.exclude_entity_globs ?? []
  ];
  return !(a.length && !a.some((n) => Fe(n).test(t)) || i.length && i.some((n) => Fe(n).test(t)));
}
function vt(t, e, a) {
  return a ? !0 : t.entity_category === "config" ? e.show_config_entities === !0 : t.entity_category === "diagnostic" ? e.show_diagnostic_entities === !0 : !0;
}
function ft(t, e, a) {
  const i = ei(t, a), n = D(e.include_labels ?? []), s = D(e.exclude_labels ?? []);
  return !(s.size && [...s].some((r) => i.has(r)) || n.size && ![...n].some((r) => i.has(r)));
}
async function Ya(t) {
  const e = Be.get(t);
  if (e) return e;
  const a = Promise.all([
    J(t, "config/area_registry/list"),
    J(t, "config/device_registry/list"),
    J(t, "config/entity_registry/list"),
    J(t, "config/label_registry/list")
  ]).then(([i, n, s, r]) => ({
    areas: i.items,
    devices: n.items,
    entities: s.items,
    labels: r.items,
    areaRegistryAvailable: i.available,
    deviceRegistryAvailable: n.available,
    entityRegistryAvailable: s.available,
    labelRegistryAvailable: r.available
  }));
  return Be.set(t, a), a;
}
async function J(t, e) {
  try {
    const a = await t.callWS({ type: e });
    return {
      items: Array.isArray(a) ? a : [],
      available: Array.isArray(a)
    };
  } catch {
    return { items: [], available: !1 };
  }
}
function Xa() {
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
function Ja(t, e, a) {
  const i = [];
  return t.areaRegistryAvailable || i.push("area_registry_unavailable"), t.entityRegistryAvailable || i.push("entity_registry_unavailable"), t.deviceRegistryAvailable || i.push("device_registry_unavailable"), (a.include_labels?.length || a.exclude_labels?.length) && !t.labelRegistryAvailable && i.push("label_registry_unavailable"), {
    registryAvailable: t.areaRegistryAvailable || t.entityRegistryAvailable || t.deviceRegistryAvailable,
    areaRegistryAvailable: t.areaRegistryAvailable,
    entityRegistryAvailable: t.entityRegistryAvailable,
    deviceRegistryAvailable: t.deviceRegistryAvailable,
    labelRegistryAvailable: t.labelRegistryAvailable,
    registryEntityCount: t.entities.length,
    areaCount: t.areas.length,
    labelCount: t.labels.length,
    fallbackUsed: e,
    unavailableReasons: i
  };
}
function Za(t, e) {
  if (t)
    return e.areas.find((a) => a.area_id === t)?.name ?? t;
}
function Qa(t, e, a) {
  const i = D(a);
  return i.has(A(t)) || !!(e && i.has(A(e)));
}
function ei(t, e) {
  const a = new Map(
    e.map((n) => [n.label_id, n.name])
  ), i = /* @__PURE__ */ new Set();
  for (const n of t) {
    i.add(A(n));
    const s = a.get(n);
    s && i.add(A(s));
  }
  return i;
}
function yt(...t) {
  return [...new Set(t.flatMap((e) => e ?? []))];
}
function Fe(t) {
  const e = t.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${e}$`);
}
function Oe(t, e) {
  return new Map(t.map((a) => [a[e], a]));
}
function D(t) {
  return new Set(t.map(A).filter(Boolean));
}
function ti(t, e) {
  return (e.entities ?? []).some(
    (a) => typeof a == "string" ? a === t : a.entity === t
  );
}
function A(t) {
  return t.trim().toLowerCase();
}
function $(t) {
  return typeof t == "string" && t.trim() ? t.trim() : void 0;
}
function ai(t, e, a, i) {
  if (!e || !t) return t;
  const n = A(t), s = A(e);
  return !n || !s || n.includes(s) || s.includes(n) ? t : i === "switch" && (ni(t) || ii(t) || t === gt(a)) ? `${e} - ${t}` : t;
}
function ii(t) {
  const e = t.trim();
  return e.length <= 16 && /^[a-z0-9][a-z0-9 ._()/+-]*$/i.test(e);
}
function ni(t) {
  return (/* @__PURE__ */ new Set([
    "power",
    "switch",
    "outlet",
    "plug",
    "extra dry",
    "half load",
    "remote start",
    "child lock",
    "door",
    "light",
    "fan",
    "מתג",
    "שקע",
    "הפעלה",
    "כיבוי",
    "דולק"
  ])).has(A(t));
}
function je(t, e) {
  const a = e.search.trim().toLowerCase();
  return t.filter((i) => {
    const { entity: n } = i;
    if (e.areas.length && (!n.area || !e.areas.includes(n.area)) || e.domains.length && !e.domains.includes(n.domain) || a && ![
      n.entity_id,
      n.name,
      n.area,
      n.domain
    ].filter(Boolean).join(" ").toLowerCase().includes(a) || e.stateMode === "active_only" && i.totalActiveMs <= 0)
      return !1;
    if (e.stateMode === "currently_active") {
      const s = Date.now();
      if (!i.segments.some(
        (r) => r.active && r.start.getTime() <= s && r.end.getTime() >= s - 9e4
      ))
        return !1;
    }
    return !0;
  });
}
function Ue(t, e) {
  if (e === "none" || e === "entity")
    return [Ge("all", "כל הרכיבים", t)];
  const a = /* @__PURE__ */ new Map();
  for (const i of t) {
    const n = e === "area" ? i.entity.area || "ללא אזור" : i.entity.domain || "other", s = a.get(n) ?? [];
    s.push(i), a.set(n, s);
  }
  return [...a.entries()].map(
    ([i, n]) => Ge(
      i,
      e === "domain" ? M[i] ?? i : i,
      n
    )
  ).sort(
    (i, n) => n.totalActiveMs - i.totalActiveMs || n.rows.length - i.rows.length || i.title.localeCompare(n.title, "he")
  );
}
function Ge(t, e, a) {
  const i = [...a].sort(
    (s, r) => r.totalActiveMs - s.totalActiveMs || r.eventCount - s.eventCount || +!!(r.currentCategory && r.currentCategory !== "off" && r.currentCategory !== "unknown") - +!!(s.currentCategory && s.currentCategory !== "off" && s.currentCategory !== "unknown") || s.entity.name.localeCompare(r.entity.name, "he")
  ), n = i.reduce(
    (s, r) => s + r.totalActiveMs,
    0
  );
  return {
    id: t,
    title: e,
    subtitle: `${i.length} רכיבים`,
    rows: i,
    totalActiveMs: n
  };
}
function si(t) {
  return new CustomEvent("hass-more-info", {
    bubbles: !0,
    composed: !0,
    detail: { entityId: t }
  });
}
function ri(t) {
  return JSON.stringify({
    mock: t.mock,
    start: t.start,
    end: t.end,
    entities: [...t.entityIds].sort(),
    withAttributes: [...t.withAttributes].sort(),
    withoutAttributes: [...t.withoutAttributes].sort(),
    includeLabels: t.includeLabels ?? [],
    excludeLabels: t.excludeLabels ?? [],
    significant: t.significant,
    minimal: t.minimal
  });
}
function qe(t) {
  return t.config?.attributes?.length || t.config?.active_attributes && Object.keys(t.config.active_attributes).length ? !0 : ["climate", "humidifier", "water_heater"].includes(t.domain);
}
async function oi(t, e, a, i) {
  const { withAttributes: n, withoutAttributes: s } = xt(e), r = await Promise.all([
    s.length ? Ve(t, s, a, i, !0) : Promise.resolve({}),
    n.length ? Ve(t, n, a, i, !1) : Promise.resolve({})
  ]);
  return Object.assign({}, ...r);
}
function xt(t) {
  return {
    withAttributes: t.filter(qe),
    withoutAttributes: t.filter((e) => !qe(e))
  };
}
async function Ve(t, e, a, i, n) {
  const s = e.map((c) => c.entity_id), r = await t.callWS({
    type: "history/history_during_period",
    entity_ids: s,
    start_time: a.start.toISOString(),
    end_time: a.end.toISOString(),
    minimal_response: i.minimal_response ?? !0,
    significant_changes_only: i.significant_changes_only ?? !0,
    no_attributes: n
  });
  return ci(r, s);
}
function ci(t, e) {
  const a = {};
  if (Array.isArray(t))
    return t.forEach((i, n) => {
      if (!Array.isArray(i)) return;
      const s = e[n], r = Ke(i, s), c = r[0]?.entity_id ?? s;
      c && (a[c] = r);
    }), a;
  if (t && typeof t == "object")
    for (const [i, n] of Object.entries(
      t
    ))
      Array.isArray(n) && (a[i] = Ke(n, i));
  return a;
}
function Ke(t, e) {
  let a = e;
  return t.map((i) => {
    if (!i || typeof i != "object") return;
    const n = i, s = R(n.entity_id) ?? a;
    s && (a = s);
    const r = R(n.last_changed) ?? R(n.lc) ?? R(n.last_updated) ?? R(n.lu), c = R(n.state) ?? R(n.s);
    if (!s || !c || !r) return;
    const o = We(n.attributes) ?? We(n.a), l = {
      entity_id: s,
      state: c,
      last_changed: r
    };
    o && (l.attributes = o);
    const d = R(n.last_updated) ?? R(n.lu);
    return d && (l.last_updated = d), l;
  }).filter((i) => i !== void 0);
}
function R(t) {
  return typeof t == "string" ? t : void 0;
}
function We(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : void 0;
}
function Ye(t, e, a, i, n = {}) {
  return e.map((s) => {
    const r = li(
      t[s.entity_id] ?? [],
      n[s.entity_id],
      a,
      s.entity_id
    ).filter((d) => d.state != null && d.last_changed).sort(
      (d, u) => new Date(d.last_changed).getTime() - new Date(u.last_changed).getTime()
    ), c = ui(r), o = hi(c, s, a, i), l = o.filter((d) => d.active);
    return {
      entity: s,
      segments: o,
      totalActiveMs: l.reduce(
        (d, u) => d + u.durationMs,
        0
      ),
      eventCount: l.length,
      currentState: o.at(-1)?.state,
      currentCategory: o.at(-1)?.category
    };
  });
}
function li(t, e, a, i) {
  const n = [...t];
  if (!e) return n;
  const s = new Date(
    e.last_changed || e.last_updated
  ).getTime(), r = Number.isFinite(s) ? Math.min(
    Math.max(s, a.start.getTime()),
    a.end.getTime()
  ) : a.start.getTime(), c = n.filter((o) => o.entity_id === i).sort(
    (o, l) => new Date(o.last_changed).getTime() - new Date(l.last_changed).getTime()
  ).at(-1);
  return (!c || new Date(c.last_changed).getTime() < r || c.state !== e.state) && n.push({
    entity_id: i,
    state: e.state,
    attributes: e.attributes,
    last_changed: new Date(r).toISOString(),
    last_updated: e.last_updated
  }), n;
}
function di(t, e, a) {
  if (e === "unknown" || e === "unavailable")
    return { category: "unknown", active: !1 };
  const i = t.domain || U(t.entity_id), s = t.config?.active_states ?? Qt[i] ?? ["on"], r = t.config?.active_attributes ?? ea[i] ?? {};
  if (i === "climate" && !t.config?.active_states) {
    const o = a?.hvac_action;
    if (typeof o == "string" && o.trim()) {
      const l = r.hvac_action ?? [];
      return {
        category: de(i, o),
        active: l.includes(o)
      };
    }
  }
  for (const [o, l] of Object.entries(r)) {
    const d = a?.[o];
    if (typeof d == "string" && l.includes(d))
      return { category: de(i, d), active: !0 };
  }
  const c = s.includes(e);
  return { category: de(i, e), active: c };
}
function hi(t, e, a, i) {
  if (!t.length) return [];
  const n = [], s = a.start.getTime(), r = a.end.getTime();
  for (let o = 0; o < t.length; o += 1) {
    const l = t[o];
    if (!l) continue;
    const d = t[o + 1], u = new Date(l.last_changed).getTime(), p = d ? new Date(d.last_changed).getTime() : r, g = Math.max(u, s), f = Math.min(p, r);
    if (f <= g) continue;
    const x = di(
      e,
      l.state,
      l.attributes
    ), w = f - g;
    n.push({
      entity_id: e.entity_id,
      state: l.state,
      category: x.category,
      active: x.active,
      start: new Date(g),
      end: new Date(f),
      durationMs: w,
      attributes: l.attributes
    });
  }
  return pi(n, i.merge_gap_seconds ?? 0).filter(
    (o) => !o.active || !i.min_duration_seconds || o.durationMs >= i.min_duration_seconds * 1e3
  );
}
function ui(t) {
  const e = [];
  for (const a of t) {
    const i = e.at(-1);
    i && i.state === a.state && Xe(i) === Xe(a) || e.push(a);
  }
  return e;
}
function Xe(t) {
  const e = t.attributes ?? {}, a = {
    hvac_action: e.hvac_action,
    temperature: e.temperature,
    current_temperature: e.current_temperature,
    media_title: e.media_title
  };
  return JSON.stringify(a);
}
function pi(t, e) {
  if (!t.length) return t;
  const a = Math.max(0, e) * 1e3, i = [];
  for (const n of t) {
    const s = i.at(-1);
    s && s.entity_id === n.entity_id && s.category === n.category && s.state === n.state && n.start.getTime() - s.end.getTime() <= a ? (s.end = n.end, s.durationMs = s.end.getTime() - s.start.getTime()) : i.push({ ...n });
  }
  return i;
}
function de(t, e) {
  return e === "unknown" || e === "unavailable" ? "unknown" : ["off", "closed", "idle", "paused", "standby"].includes(e) ? e === "idle" ? "idle" : "off" : ["cool", "cooling"].includes(e) ? "cooling" : ["heat", "heating"].includes(e) ? "heating" : ["playing"].includes(e) ? "playing" : ["opening", "open"].includes(e) ? "opening" : ["closing"].includes(e) ? "closing" : t === "climate" && ["drying", "dry"].includes(e) ? "drying" : t === "climate" && ["fan", "fan_only"].includes(e) ? "fan" : "on";
}
const ge = [
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
      {
        startHour: -21,
        endHour: -18,
        state: "cool",
        attributes: { hvac_action: "cooling", current_temperature: 24 }
      },
      {
        startHour: -12,
        endHour: -9,
        state: "cool",
        attributes: { hvac_action: "cooling", current_temperature: 23 }
      },
      {
        startHour: -4,
        endHour: -0.5,
        state: "cool",
        attributes: { hvac_action: "cooling", current_temperature: 24 }
      }
    ]
  },
  {
    entity_id: "media_player.living_room_spotify",
    name: "Spotify סלון",
    area: "סלון",
    domain: "media_player",
    icon: "♫",
    pattern: [
      {
        startHour: -18,
        endHour: -15.5,
        state: "playing",
        attributes: { media_title: "Morning mix" }
      },
      {
        startHour: -8,
        endHour: -6.5,
        state: "playing",
        attributes: { media_title: "Evening playlist" }
      },
      {
        startHour: -2.4,
        endHour: -1.2,
        state: "playing",
        attributes: { media_title: "Focus" }
      }
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
      {
        startHour: -10,
        endHour: -6.2,
        state: "cool",
        attributes: { hvac_action: "cooling", current_temperature: 23 }
      },
      {
        startHour: -2.5,
        endHour: -0.2,
        state: "cool",
        attributes: { hvac_action: "cooling", current_temperature: 23 }
      }
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
function _i(t) {
  return wt(t).map((e) => ({
    entity_id: e.entity_id,
    name: e.name,
    area: e.area,
    domain: e.domain,
    icon: e.icon,
    labels: e.labels,
    entity_category: e.entity_category,
    config: { entity: e.entity_id, name: e.name, area: e.area }
  }));
}
function gi(t, e) {
  const a = {}, i = t.end.getTime();
  for (const n of wt(e)) {
    const s = [
      he(n.entity_id, "off", t.start.getTime(), void 0)
    ];
    for (const r of n.pattern) {
      const c = i + r.startHour * 36e5, o = i + r.endHour * 36e5;
      o <= t.start.getTime() || c >= t.end.getTime() || (s.push(
        he(
          n.entity_id,
          r.state,
          Math.max(c, t.start.getTime()),
          r.attributes
        )
      ), s.push(
        he(
          n.entity_id,
          "off",
          Math.min(o, t.end.getTime()),
          void 0
        )
      ));
    }
    a[n.entity_id] = s.sort(
      (r, c) => new Date(r.last_changed).getTime() - new Date(c.last_changed).getTime()
    ).filter(
      (r, c, o) => c === 0 || r.last_changed !== o[c - 1]?.last_changed
    );
  }
  return a;
}
function wt(t) {
  return t === "large_noisy_home" ? [...ge, ...vi()] : t === "area_inventory" ? mi() : t === "clean_activity_dashboard" ? bi() : ge;
}
function mi() {
  return [
    ...ge.slice(0, 6),
    {
      entity_id: "switch.kitchen_dishwasher_main",
      name: "מדיח כלים",
      area: "מטבח",
      domain: "switch",
      icon: "mdi:dishwasher",
      pattern: []
    },
    {
      entity_id: "switch.kitchen_socket",
      name: "שקע שירות",
      area: "מטבח",
      domain: "switch",
      icon: "mdi:power-socket-eu",
      pattern: []
    },
    {
      entity_id: "fan.kitchen_ceiling",
      name: "מאוורר תקרה",
      area: "מטבח",
      domain: "fan",
      icon: "mdi:fan",
      pattern: [{ startHour: -3.2, endHour: -2.1, state: "on" }]
    },
    {
      entity_id: "light.balcony_string",
      name: "גרילנדה מרפסת",
      area: "מרפסת",
      domain: "light",
      icon: "mdi:string-lights",
      pattern: []
    },
    {
      entity_id: "cover.balcony_shade",
      name: "סוכך מרפסת",
      area: "מרפסת",
      domain: "cover",
      icon: "mdi:awning",
      pattern: [{ startHour: -7.1, endHour: -7, state: "opening" }]
    },
    {
      entity_id: "light.pool_ambient",
      name: "תאורת בריכה",
      area: "בריכה",
      domain: "light",
      icon: "mdi:pool",
      pattern: [
        { startHour: -20, endHour: -18.5, state: "on" },
        { startHour: -4.5, endHour: -1.2, state: "on" }
      ]
    },
    {
      entity_id: "switch.pool_pump",
      name: "משאבת בריכה",
      area: "בריכה",
      domain: "switch",
      icon: "mdi:pump",
      pattern: [{ startHour: -8, endHour: -3.5, state: "on" }]
    },
    {
      entity_id: "fan.pool_airflow",
      name: "מאוורר אזור בריכה",
      area: "בריכה",
      domain: "fan",
      icon: "mdi:fan",
      pattern: []
    },
    {
      entity_id: "cover.pool_cover",
      name: "כיסוי בריכה",
      area: "בריכה",
      domain: "cover",
      icon: "mdi:pool",
      pattern: [{ startHour: -6.2, endHour: -6, state: "closing" }]
    }
  ];
}
function bi() {
  return [
    {
      entity_id: "light.kitchen_counter_clean",
      name: "תאורת שיש",
      area: "מטבח",
      domain: "light",
      icon: "mdi:led-strip-variant",
      pattern: [
        { startHour: -22, endHour: -20.5, state: "on" },
        { startHour: -6, endHour: -3.8, state: "on" }
      ]
    },
    {
      entity_id: "switch.kitchen_coffee_clean",
      name: "מכונת קפה",
      area: "מטבח",
      domain: "switch",
      icon: "mdi:coffee-maker",
      pattern: [
        { startHour: -20.2, endHour: -20, state: "on" },
        { startHour: -2.2, endHour: -2, state: "on" }
      ]
    },
    {
      entity_id: "climate.living_room_clean",
      name: "מזגן סלון",
      area: "סלון",
      domain: "climate",
      icon: "mdi:air-conditioner",
      pattern: [
        {
          startHour: -12,
          endHour: -9.5,
          state: "cool",
          attributes: { hvac_action: "cooling" }
        },
        {
          startHour: -4.4,
          endHour: -1.2,
          state: "cool",
          attributes: { hvac_action: "cooling" }
        }
      ]
    },
    {
      entity_id: "media_player.living_room_clean",
      name: "מוזיקה סלון",
      area: "סלון",
      domain: "media_player",
      icon: "mdi:speaker",
      pattern: [{ startHour: -5.8, endHour: -4.1, state: "playing" }]
    },
    {
      entity_id: "fan.bedroom_clean",
      name: "מאוורר חדר שינה",
      area: "חדר שינה",
      domain: "fan",
      icon: "mdi:fan",
      pattern: [{ startHour: -8, endHour: -1.5, state: "on" }]
    },
    {
      entity_id: "cover.bedroom_shutter_clean",
      name: "תריס חדר שינה",
      area: "חדר שינה",
      domain: "cover",
      icon: "mdi:window-shutter",
      pattern: [{ startHour: -7.4, endHour: -7.2, state: "closing" }]
    }
  ];
}
function vi() {
  const t = [
    "Power",
    "Extra dry",
    "Half load",
    "Silence on demand",
    "Vario speed",
    "Program",
    "Progress",
    "Finish",
    "Remote start",
    "Child lock",
    "Router LAN0",
    "WLAN signal",
    "Firmware update",
    "Battery level",
    "Cloud connection",
    "תוכנית כביסה",
    "חצי כמות",
    "נעילת ילדים",
    "מהירות ייבוש",
    "ראוטר רשת"
  ], e = ["בריכה", "מטבח", "סלון", "חדר שירות", "חדרי ילדים"], a = ["switch", "sensor", "binary_sensor", "switch", "switch"], i = [];
  for (let n = 0; n < 170; n += 1) {
    const s = t[n % t.length] ?? "Power", r = a[n % a.length] ?? "switch", c = n % 7 === 0 ? "diagnostic" : n % 11 === 0 ? "config" : void 0, o = s.toLowerCase().replace(/[^a-z0-9\u0590-\u05ff]+/gi, "_").replace(/^_+|_+$/g, "");
    i.push({
      entity_id: `${r}.large_noisy_${n}_${o || "entity"}`,
      name: s,
      area: e[n % e.length] ?? "ללא אזור",
      domain: r,
      icon: r === "sensor" ? "mdi:gauge" : "mdi:toggle-switch",
      entity_category: c,
      labels: n % 13 === 0 ? ["לא להצגה"] : void 0,
      pattern: n % 19 === 0 ? [{ startHour: -2, endHour: -1.95, state: "on" }] : []
    });
  }
  return i;
}
function he(t, e, a, i) {
  return {
    entity_id: t,
    state: e,
    attributes: i,
    last_changed: new Date(a).toISOString(),
    last_updated: new Date(a).toISOString()
  };
}
function fi(t, e, a = 320, i = 220) {
  if (e.width <= 640)
    return {
      x: 12,
      y: Math.max(12, e.height - i - 12),
      placement: "bottom"
    };
  const n = 16, s = t.left + t.width / 2 - a / 2, r = t.top + t.height + 12, c = Je(s, n, e.width - a - n), o = Je(r, n, e.height - i - n);
  return { x: c, y: o, placement: "floating" };
}
function Je(t, e, a) {
  return a < e ? e : Math.min(a, Math.max(e, t));
}
function kt(t) {
  return !Number.isFinite(t) || !t ? 300 : Math.max(30, Math.floor(t));
}
function yi(t) {
  if (!t.hasFetchedOnce) return !0;
  if (!t.live) return !1;
  const e = kt(t.refreshIntervalSeconds) * 1e3;
  return t.now - t.lastHistoryFetchAt >= e;
}
function xi() {
  return h`<div class="ahc-state-card">
    <div>
      <h3 class="ahc-state-card__title">קורלציות</h3>
      <p>מצב קורלציה ויומן אירועים יפותח בשלב הבא.</p>
    </div>
  </div>`;
}
function wi() {
  return h`<div class="ahc-state-card">
    <div>
      <h3 class="ahc-state-card__title">פירוט רכיב</h3>
      <p>מסך Drill-down לרכיב יפותח אחרי תצוגת Swimlane.</p>
    </div>
  </div>`;
}
function ki() {
  return h`<div class="ahc-state-card">
    <div>
      <h3 class="ahc-state-card__title">Heatmap</h3>
      <p>מצב זה יפותח אחרי ה-MVP.</p>
    </div>
  </div>`;
}
function $i(t) {
  const { model: e, config: a } = t, i = Hi(e.range);
  return !e.visibleRowsCount && !e.totalInventoryItemCount ? Ei() : h`
    <section
      class="ahc-dashboard"
      dir="rtl"
      aria-label="ציר זמן פעילות"
      style=${a.timeline_height ? `--ahc-dashboard-height:${a.timeline_height}` : ""}
    >
      <header class="ahc-dashboard__header">
        <div class="ahc-dashboard__title-block">
          <h3>ציר זמן פעילות</h3>
          <p>
            ${e.visibleRowsCount} רכיבי פעילות מתוך
            ${e.totalInventoryItemCount || e.totalRowsBeforeCuration}
            אביזרים
            ${e.hiddenRowsCount ? h` · הוסתרו ${e.hiddenRowsCount} שורות רעש` : _}
          </p>
        </div>
        <div class="ahc-dashboard__range-pill">
          ${Di(e.range)}
        </div>
      </header>

      ${a.show_activity_density === !1 ? _ : Mi(e.densityBuckets)}

      <section
        class="ahc-dashboard__timeline"
        aria-label="פעילות לפי אזור ורכיב"
      >
        <div class="ahc-dashboard__axis" dir="ltr" aria-hidden="true">
          ${i.map(
    (n) => h`<span
                class="ahc-dashboard__tick"
                style=${`left:${n.percent}%`}
                >${n.label}</span
              >`
  )}
        </div>
        <div class="ahc-dashboard__scroll">
          ${e.groups.map((n) => Ai(n, t))}
        </div>
      </section>

      ${e.hiddenRowsCount ? h`<p class="ahc-dashboard__hidden-note">
            התצוגה שומרת על ציר פעילות נקי. רכיבים ללא פעילות עדיין מופיעים
            במלאי האביזרים של האזור.
          </p>` : _}
    </section>
  `;
}
function Ai(t, e) {
  const a = e.config.show_area_inventory !== !1 && e.config.area_inventory_mode !== "off", i = e.config.area_inventory_mode === "expanded" || e.model.singleAreaFocused || e.showAllInventory === !0, n = e.collapsedInventoryGroups?.has(t.id) === !0 ? !1 : i || e.expandedInventoryGroups?.has(t.id) === !0, s = Math.max(0, t.hiddenRowsCount);
  return h`
    <section
      class="ahc-area-card ahc-dashboard-group"
      data-has-activity=${t.activityRows.length ? "true" : "false"}
      data-inventory-expanded=${n ? "true" : "false"}
    >
      <header class="ahc-area-card__header ahc-dashboard-group__header">
        <div class="ahc-area-card__title ahc-dashboard-group__title">
          ${ke(t.icon, "mdi:home-outline")}
          <div class="ahc-area-card__title-copy">
            <strong>${t.title}</strong>
            <span>
              ${t.visibleActivityRowCount} פעילים בטווח ·
              ${t.inventoryItemCount} אביזרים
            </span>
          </div>
        </div>
        <div class="ahc-area-card__actions">
          <div class="ahc-area-card__meta ahc-dashboard-group__meta">
            ${y(t.totalActiveMs)} · ${t.eventCount} אירועים
          </div>
          ${a && t.inventoryItemCount ? h`<button
                class="ahc-area-card__inventory-button"
                type="button"
                aria-expanded=${n ? "true" : "false"}
                @click=${() => e.onInventoryToggle?.(t.id)}
              >
                ${n ? "סגור מלאי" : `אביזרים ${t.inventoryItemCount}`}
              </button>` : _}
        </div>
      </header>

      <div
        class="ahc-area-card__aggregate ahc-dashboard-group__aggregate"
        dir="ltr"
        aria-label=${`פעילות מצטברת עבור ${t.title}`}
      >
        ${t.aggregateSegments.map(
    (r) => $t(r, "aggregate")
  )}
      </div>

      <div class="ahc-area-card__content ahc-dashboard-group__body">
        <section class="ahc-area-card__activity" aria-label="פעילות באזור">
          ${t.activityRows.length ? h`<div class="ahc-dashboard-group__rows">
                ${t.activityRows.map((r) => zi(r, e))}
                ${s > 0 ? h`<p class="ahc-dashboard-group__more">
                      +${s} פעילויות נוספות
                    </p>` : _}
              </div>` : h`<div class="ahc-area-card__quiet">
                אין פעילות משמעותית בטווח הנוכחי
              </div>`}
        </section>
        ${a && t.inventoryItems.length && n ? Ci(t, e, n) : _}
      </div>
    </section>
  `;
}
function zi(t, e) {
  return h`
    <div class="ahc-dashboard-row">
      <div class="ahc-dashboard-row__label" dir="rtl">
        ${ke(t.icon, At(t.domain))}
        <div>
          <strong title=${t.name}>${t.name}</strong>
          ${t.secondary ? h`<span title=${t.secondary}>${t.secondary}</span>` : _}
          <span class="ahc-dashboard-row__inline-meta">
            <strong>${y(t.totalActiveMs)}</strong>
            <span>${t.eventCount} אירועים</span>
          </span>
        </div>
      </div>

      <div
        class="ahc-dashboard-row__plot"
        dir="ltr"
        role="img"
        aria-label=${`פעילות עבור ${t.name}`}
      >
        ${t.segments.map(
    (a, i) => $t(
      a,
      "row",
      (n) => e.onSegmentClick?.(
        n,
        t.entityId,
        a.sourceIndex ?? i
      )
    )
  )}
      </div>

      <div class="ahc-dashboard-row__meta">
        <strong>${y(t.totalActiveMs)}</strong>
        <span>${t.eventCount} אירועים</span>
      </div>
    </div>
  `;
}
function Ci(t, e, a) {
  const i = Ii(e.config), n = a ? t.inventoryItems : t.inventoryItems.slice(0, i), s = Math.max(0, t.inventoryItems.length - n.length), r = e.config.area_inventory_group_by_domain === !1 ? [{ title: "", items: n }] : Ti(n);
  return h`
    <section
      class="ahc-area-inventory"
      aria-label=${`אביזרים באזור ${t.title}`}
    >
      <header class="ahc-area-inventory__header">
        <span>אביזרים באזור</span>
        <small>
          ${t.inventoryItems.filter((c) => c.activeNow).length} פעילים
          עכשיו
        </small>
      </header>
      <div class="ahc-area-inventory__groups">
        ${r.map(
    (c) => h`
            <div class="ahc-area-inventory__domain">
              ${c.title ? h`<span class="ahc-area-inventory__domain-title"
                    >${c.title}</span
                  >` : _}
              <div class="ahc-area-inventory__chips">
                ${c.items.map(
      (o) => Ri(o, e.config, e)
    )}
              </div>
            </div>
          `
  )}
      </div>
      ${s ? h`<button
            class="ahc-area-inventory__more"
            type="button"
            @click=${() => e.onInventoryToggle?.(t.id)}
          >
            עוד ${s} אביזרים
          </button>` : _}
    </section>
  `;
}
function Ri(t, e, a) {
  const i = e.area_inventory_show_state ?? b.area_inventory_show_state, n = e.area_inventory_show_last_activity ?? b.area_inventory_show_last_activity, s = t.stateTone ?? (t.activeNow ? "active" : t.hadActivityInRange ? "had_activity" : "inactive"), r = `${t.name} · ${me(t.domain)}${t.currentStateLabel ? ` · ${t.currentStateLabel}` : ""}`;
  return h`
    <button
      class="ahc-inventory-chip"
      type="button"
      data-active-now=${t.activeNow ? "true" : "false"}
      data-had-activity=${t.hadActivityInRange ? "true" : "false"}
      data-state-tone=${s}
      data-state-category=${t.currentCategory ?? "none"}
      title=${r}
      aria-label=${r}
      @click=${(c) => a.onInventoryItemClick?.(c, t.entityId)}
    >
      ${ke(t.icon, At(t.domain))}
      <span class="ahc-inventory-chip__copy">
        <span class="ahc-inventory-chip__status" aria-hidden="true"></span>
        <strong>${t.name}</strong>
        <small>
          ${i && t.currentStateLabel ? t.currentStateLabel : me(t.domain)}
          ${n && t.hadActivityInRange && t.totalActiveMs ? h` · ${y(t.totalActiveMs)}` : _}
        </small>
      </span>
    </button>
  `;
}
function $t(t, e, a) {
  const i = [
    "ahc-dashboard-segment",
    `ahc-dashboard-segment--${e}`,
    t.minVisible ? "ahc-dashboard-segment--min" : ""
  ].filter(Boolean).join(" "), n = `left:${t.leftPct}%;width:${t.widthPct}%;--segment-color:${t.colorVar}`;
  return a ? h`
    <button
      class=${i}
      type="button"
      data-category=${t.category}
      style=${n}
      title=${t.label}
      aria-label=${t.label}
      @click=${a}
    >
      <span>${z[t.category]}</span>
    </button>
  ` : h`<span
      class=${i}
      data-category=${t.category}
      style=${n}
      title=${t.label}
    ></span>`;
}
function Mi(t) {
  const e = Si(t);
  return h`
    <section
      class="ahc-dashboard__density"
      dir="ltr"
      aria-label="צפיפות פעילות"
    >
      <div class="ahc-dashboard__density-bars">
        ${t.map((a) => {
    const i = a.totalActiveMs > 0, n = `${v(a.start)} - ${v(
      a.end
    )}: ${y(a.totalActiveMs)} · ${a.activeEntityCount} רכיבים`;
    return h`
            <span
              class="ahc-dashboard-density-bucket"
              data-active=${i ? "true" : "false"}
              title=${n}
            >
              <i
                class="ahc-dashboard-density-fill"
                style=${`--intensity:${a.intensity}`}
              ></i>
            </span>
          `;
  })}
      </div>
      <div class="ahc-dashboard__density-labels" aria-hidden="true">
        ${e.map((a) => h`<span>${a}</span>`)}
      </div>
    </section>
  `;
}
function Si(t) {
  if (!t.length) return [];
  const e = Math.min(6, Math.max(4, Math.ceil(t.length / 6))), a = t.length - 1;
  return Array.from({ length: e }, (i, n) => {
    const s = t[Math.round(n / (e - 1) * a)];
    return s ? v(s.start) : "";
  }).filter(Boolean);
}
function Ei() {
  return h`
    <section class="ahc-dashboard ahc-dashboard-empty" dir="rtl">
      <h3>לא נמצאה פעילות משמעותית בטווח הזה</h3>
      <p>
        נסה להגדיל את טווח הזמן, להציג את כל האביזרים, או לפתוח סינון מתקדם.
      </p>
    </section>
  `;
}
function ke(t, e) {
  return h`<span class="ahc-dashboard-icon" aria-hidden="true"
    ><ha-icon icon=${t ?? e}></ha-icon
  ></span>`;
}
function Ti(t) {
  const e = /* @__PURE__ */ new Map();
  for (const a of t) {
    const i = me(a.domain);
    e.set(i, [...e.get(i) ?? [], a]);
  }
  return [...e.entries()].map(([a, i]) => ({
    title: a,
    items: i
  }));
}
function Ii(t) {
  const e = t.area_inventory_max_items;
  return typeof e == "number" && Number.isFinite(e) ? Math.max(1, Math.floor(e)) : b.area_inventory_max_items;
}
function me(t) {
  return M[t] ?? t;
}
function At(t) {
  return t === "light" ? "mdi:lightbulb-outline" : t === "climate" ? "mdi:thermostat" : t === "media_player" ? "mdi:music" : t === "cover" ? "mdi:window-shutter" : t === "fan" ? "mdi:fan" : "mdi:toggle-switch-outline";
}
function Hi(t) {
  const e = Math.max(
    1,
    (t.end.getTime() - t.start.getTime()) / 36e5
  ), a = e <= 24 ? 3 : e <= 72 ? 6 : 24, i = [], n = new Date(t.start);
  for (n.setMinutes(0, 0, 0); n < t.end; )
    n >= t.start && i.push({
      label: v(n),
      percent: F(n, t)
    }), n.setHours(n.getHours() + a);
  return i.push({ label: v(t.end), percent: 100 }), i;
}
function Di(t) {
  const e = Math.round(
    (t.end.getTime() - t.start.getTime()) / 36e5
  );
  return e >= 24 * 7 ? "7 ימים" : e >= 24 ? `${Math.round(e / 24)} ימים` : `${e} שעות`;
}
const zt = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  climate: "mdi:air-conditioner",
  media_player: "mdi:music",
  cover: "mdi:window-shutter",
  fan: "mdi:fan",
  humidifier: "mdi:air-humidifier",
  vacuum: "mdi:robot-vacuum",
  lock: "mdi:lock",
  binary_sensor: "mdi:motion-sensor"
}, Pi = [
  [/סלון|living/i, "mdi:sofa"],
  [/מטבח|kitchen/i, "mdi:countertop"],
  [/שינה|הורים|bed/i, "mdi:bed"],
  [/ילד|ילדים|kids|child/i, "mdi:bunk-bed"],
  [/מרפסת|גינה|garden|balcony/i, "mdi:flower"],
  [/כניסה|entry|door/i, "mdi:door"]
];
function Li(t) {
  if (t.icon?.startsWith("mdi:") || t.icon && !t.icon.includes(":")) return t.icon;
  const e = t.domain || U(t.entity_id);
  return zt[e] ?? "mdi:circle-medium";
}
function Ni(t) {
  if (t.icon?.startsWith("mdi:") || t.icon && !t.icon.includes(":")) return t.icon;
  const e = zt[t.id];
  return e || (Pi.find(([i]) => i.test(t.title))?.[1] ?? "mdi:home-outline");
}
function Ct(t, e) {
  return t.startsWith("mdi:") ? h`<ha-icon class=${e} icon=${t}></ha-icon>` : h`<span class=${e} aria-hidden="true">${t}</span>`;
}
function Rt(t, e = "ahc-entity-icon") {
  return Ct(Li(t), e);
}
function Mt(t, e = "ahc-group-icon") {
  return Ct(Ni(t), e);
}
function Bi(t) {
  const e = Fi(
    t.groups,
    t.range,
    t.config
  ), a = Vi(t.range), i = B(t.curation), n = Ki(t.range);
  return e.visibleRowCount ? h`
    <section class="ahc-activity" aria-label="ציר זמן פעילות">
      <header class="ahc-activity__header">
        <div class="ahc-activity__heading">
          <h3>ציר זמן פעילות</h3>
          <p>
            מציג ${e.visibleRowCount} רכיבים פעילים מתוך
            ${t.curation?.totalRows ?? e.totalRowCount}
            ${e.hiddenRowCount ? h` · ${e.hiddenRowCount} נוספים הוסתרו מהתצוגה` : null}
            ${i ? h` · ${i}` : null}
          </p>
        </div>
        <div class="ahc-activity__range">${n}</div>
      </header>

      ${t.config.show_activity_density === !1 ? null : Ui(e.density)}

      <div class="ahc-activity__axis" dir="ltr" aria-hidden="true">
        ${a.map(
    (s) => h`<span class="ahc-activity__tick" style="left:${s.percent}%"
              >${s.label}</span
            >`
  )}
      </div>

      <div class="ahc-activity__groups">
        ${e.groups.map(
    (s) => Oi(s, t.range, t)
  )}
      </div>

      ${e.hiddenRowCount ? h`<p class="ahc-activity__more">
            + ${e.hiddenRowCount} רכיבים נוספים הוסתרו. אפשר ללחוץ “הצג
            הכל” למצב legacy/debug.
          </p>` : null}
    </section>
  ` : Gi();
}
function Fi(t, e, a) {
  const i = t.map((c) => {
    const o = c.rows.filter(qi), l = o.reduce(
      (d, u) => d + u.totalActiveMs,
      0
    );
    return {
      ...c,
      rows: o,
      totalActiveMs: l,
      subtitle: `${o.length} רכיבים`
    };
  }).filter((c) => c.rows.length > 0).sort(
    (c, o) => o.totalActiveMs - c.totalActiveMs || o.rows.length - c.rows.length || c.title.localeCompare(o.title, "he")
  ), n = we(
    i,
    a.max_visible_rows ?? a.max_total_rows
  ), s = n.groups.filter((c) => c.rows.length > 0), r = s.flatMap((c) => c.rows);
  return {
    groups: s,
    density: rt(r, e, a),
    totalRowCount: n.totalRowCount,
    visibleRowCount: r.length,
    hiddenRowCount: Math.max(0, n.totalRowCount - r.length)
  };
}
function Oi(t, e, a) {
  return h`
    <article class="ahc-activity-group" aria-label=${t.title}>
      <header class="ahc-activity-group__header">
        <span class="ahc-activity-group__title">
          ${Mt(t)}<strong>${t.title}</strong>
        </span>
        <span class="ahc-activity-group__meta">
          ${t.rows.length} רכיבים · ${y(t.totalActiveMs)}
        </span>
      </header>
      <div class="ahc-activity-group__rows">
        ${t.rows.map((i) => ji(i, e, a))}
      </div>
    </article>
  `;
}
function ji(t, e, a) {
  return h`
    <div class="ahc-activity-row">
      <div class="ahc-activity-row__label" dir="rtl">
        ${Rt(t.entity)}
        <span class="ahc-activity-row__name" title=${t.entity.name}>
          ${t.entity.name}
        </span>
      </div>
      <div
        class="ahc-activity-row__plot"
        dir="ltr"
        role="img"
        aria-label=${`ציר זמן עבור ${t.entity.name}`}
      >
        ${t.segments.map((i, n) => {
    if (!i.active) return null;
    const s = mt(i, e);
    if (s.widthPct <= 0) return null;
    const r = `${t.entity.name}, ${z[i.category]}, ${v(i.start)} עד ${v(i.end)}, ${y(
      i.durationMs
    )}`;
    return h`
            <button
              class="ahc-activity-segment"
              type="button"
              data-category=${i.category}
              data-min-visible=${s.minVisible ? "true" : "false"}
              style=${`left:${s.leftPct}%;width:max(var(--ahc-activity-segment-min-width), ${s.widthPct}%);`}
              aria-label=${r}
              @click=${(c) => a.onSegmentClick?.(c, t.entity.entity_id, n)}
            >
              <span>${z[i.category]}</span>
            </button>
          `;
  })}
      </div>
    </div>
  `;
}
function Ui(t) {
  return h`
    <div
      class="ahc-activity__density-strip"
      dir="ltr"
      aria-label="צפיפות פעילות לאורך הזמן"
    >
      ${t.map(
    (e) => h`
          <span
            class="ahc-activity__density-bar"
            style=${`--intensity:${e.intensity}`}
            title=${`${v(e.start)} - ${v(
      e.end
    )}: ${y(e.totalActiveMs)}`}
          ></span>
        `
  )}
    </div>
  `;
}
function Gi() {
  return h`
    <section class="ahc-activity ahc-activity-empty">
      <h3>לא נמצאה פעילות משמעותית בטווח הזה</h3>
      <p>נסה להגדיל את טווח הזמן, להציג את כל הרכיבים, או לפתוח סינון מתקדם.</p>
    </section>
  `;
}
function qi(t) {
  return t.segments.some((e) => e.active);
}
function Vi(t) {
  const e = Math.max(
    1,
    (t.end.getTime() - t.start.getTime()) / 36e5
  ), a = e <= 24 ? 3 : e <= 72 ? 6 : 24, i = [], n = new Date(t.start);
  for (n.setMinutes(0, 0, 0); n < t.end; )
    n >= t.start && i.push({
      label: v(n),
      percent: F(n, t)
    }), n.setHours(n.getHours() + a);
  return i.push({ label: v(t.end), percent: 100 }), i;
}
function Ki(t) {
  const e = Math.round(
    (t.end.getTime() - t.start.getTime()) / 36e5
  );
  return e >= 24 * 7 ? "7 ימים" : e >= 24 ? `${Math.round(e / 24)} ימים` : `${e} שעות`;
}
function Wi(t) {
  const e = we(
    t.groups,
    t.config.max_visible_rows
  ), a = Zi(t.range), i = B(t.curation), n = /* @__PURE__ */ new Date(), s = F(n, t.range), r = t.config.show_inactive_baselines === !0, c = t.config.show_now_line !== !1 && n.getTime() >= t.range.start.getTime() && n.getTime() <= t.range.end.getTime() + 9e4;
  return h`
    <section
      class=${`ahc-timeline-card ahc-timeline-card--${e.density}${r ? " ahc-timeline-card--baselines" : ""}`}
      aria-label="ציר זמן פעילות"
      style=${t.config.timeline_height ? `--ahc-timeline-height:${t.config.timeline_height}` : ""}
    >
      <div class="ahc-timeline-toolbar">
        <h3 class="ahc-timeline-title">ציר זמן פעילות</h3>
        <span class="ahc__metric-subtitle">
          ${v(t.range.start)} – ${v(t.range.end)}
          ${e.hiddenRowCount ? ` · מציג ${e.visibleRowCount} מתוך ${e.totalRowCount}` : ""}
        </span>
        ${i ? h`<span class="ahc-curation-note">${i}</span>` : null}
      </div>
      <div class="ahc-timeline-scroll">
        <div class="ahc-timeline" dir="ltr">
          <div class="ahc-timeline__axis" aria-hidden="true">
            <div class="ahc-timeline__ticks">
              ${a.map(
    (o) => h`<span
                    class="ahc-timeline__tick"
                    style="left:${o.percent}%"
                    >${o.label}</span
                  >`
  )}
            </div>
            <div class="ahc-timeline__axis-spacer" dir="rtl">רכיב / אזור</div>
          </div>
          <div class="ahc-timeline__groups">
            ${e.groups.map((o) => {
    const l = Yi(
      o,
      t.config
    );
    return h`
                <details
                  class="ahc-group"
                  aria-label=${o.title}
                  ?open=${!l}
                >
                  <summary class="ahc-group__header">
                    <span class="ahc-group__title"
                      >${Mt(o)}<span
                        >${o.title}</span
                      ></span
                    >
                    <span class="ahc-group__meta"
                      >${y(o.totalActiveMs)} •
                      ${o.subtitle ?? ""}</span
                    >
                  </summary>
                  ${o.rows.map(
      (d) => h`
                      <div class="ahc-row">
                        <div class="ahc-row__track">
                          <svg
                            class="ahc-row__svg"
                            viewBox="0 0 100 32"
                            preserveAspectRatio="none"
                            role="img"
                            aria-label=${`ציר זמן עבור ${d.entity.name}`}
                          >
                            ${r ? h`<line
                                  class="ahc-row__svg-track"
                                  x1="1"
                                  x2="99"
                                  y1="16"
                                  y2="16"
                                ></line>` : null}
                            ${d.segments.map((u, p) => {
        const g = F(
          u.start,
          t.range
        ), f = F(
          u.end,
          t.range
        ), x = Math.max(0.65, f - g);
        if (!Xi(
          u,
          t.config
        ))
          return null;
        const w = `${d.entity.name}, ${z[u.category]}, ${v(u.start)} עד ${v(u.end)}, ${y(u.durationMs)}`;
        return h`
                                <rect
                                  class=${u.active ? "ahc-segment-svg" : "ahc-segment-svg ahc-segment-svg--inactive"}
                                  data-category=${u.category}
                                  data-active=${u.active ? "true" : "false"}
                                  x=${g}
                                  y=${u.active ? "12" : "15"}
                                  width=${x}
                                  height=${u.active ? "8" : "2"}
                                  rx=${u.active ? "4" : "1"}
                                  tabindex="0"
                                  role="button"
                                  aria-label=${w}
                                  @click=${(m) => t.onSegmentClick?.(
          m,
          d.entity.entity_id,
          p
        )}
                                  @keydown=${(m) => {
          (m.key === "Enter" || m.key === " ") && (m.preventDefault(), t.onSegmentClick?.(
            m,
            d.entity.entity_id,
            p
          ));
        }}
                                >
                                  <title>${w}</title>
                                </rect>
                              `;
      })}
                          </svg>
                        </div>
                        <div class="ahc-row__label" dir="rtl">
                          ${Rt(d.entity)}
                          <span
                            class="ahc-row__name"
                            title=${t.config.debug ? d.entity.entity_id : d.entity.name}
                            >${d.entity.name}</span
                          >
                          ${d.currentCategory ? h`<span
                                class="ahc-row__state-chip"
                                data-state=${d.currentCategory}
                                >${z[d.currentCategory]}</span
                              >` : null}
                        </div>
                      </div>
                    `
    )}
                  ${o.rows.length ? null : h`<div class="ahc-group__empty">
                        אין שורות גלויות בקבוצה הזו
                      </div>`}
                </details>
              `;
  })}
          </div>
          ${c ? h`<div class="ahc-now-line" style="left:${s}%">
                <span class="ahc-now-line__label">עכשיו</span>
              </div>` : null}
        </div>
      </div>
      ${t.config.show_legend === !1 ? null : Ji()}
    </section>
  `;
}
function Yi(t, e) {
  const a = new Set(e.default_collapsed_groups ?? []);
  return a.has(t.id) || a.has(t.title) ? !0 : !!(e.collapse_groups && t.totalActiveMs <= 0);
}
function Xi(t, e) {
  return t.active || e.show_inactive_baselines === !0;
}
function Ji() {
  return h`<div class="ahc-legend" aria-label="מקרא">
    ${[
    ["on", "var(--ahc-on)"],
    ["cooling", "var(--ahc-cooling)"],
    ["heating", "var(--ahc-heating)"],
    ["fan", "var(--ahc-idle)"],
    ["playing", "var(--ahc-playing)"],
    ["opening", "var(--ahc-opening)"],
    ["off", "var(--ahc-off)"],
    ["unknown", "var(--ahc-unknown)"]
  ].map(
    ([e, a]) => h`<span class="ahc-legend__item"
          ><span class="ahc-legend__swatch" style="--swatch:${a}"></span
          >${z[e]}</span
        >`
  )}
  </div>`;
}
function Zi(t) {
  const e = Math.max(
    1,
    (t.end.getTime() - t.start.getTime()) / 36e5
  ), a = e <= 24 ? 3 : e <= 72 ? 6 : 24, i = [], n = new Date(t.start);
  for (n.setMinutes(0, 0, 0); n < t.end; )
    n >= t.start && i.push({
      label: v(n),
      percent: F(n, t)
    }), n.setHours(n.getHours() + a);
  return i.push({ label: v(t.end), percent: 100 }), i;
}
const Qi = et`
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

    --ahc-font-family: var(
      --primary-font-family,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Arial,
      sans-serif
    );
    --ahc-card-bg: var(
      --ha-card-background,
      var(--card-background-color, #0f172a)
    );
    --ahc-page-bg: var(--lovelace-background, #020617);
    --ahc-surface-1: color-mix(in srgb, var(--ahc-card-bg) 88%, #1e3a5f 12%);
    --ahc-surface-2: color-mix(
      in srgb,
      var(--ahc-card-bg) 80%,
      #2563eb 8%,
      #0f172a 12%
    );
    --ahc-surface-3: color-mix(
      in srgb,
      var(--ahc-card-bg) 72%,
      #38bdf8 7%,
      #0f172a 21%
    );
    --ahc-border: color-mix(
      in srgb,
      var(--divider-color, #334155) 76%,
      #60a5fa 24%
    );
    --ahc-border-soft: color-mix(
      in srgb,
      var(--divider-color, #334155) 55%,
      transparent 45%
    );
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
    --ahc-label-width: 240px;
    --ahc-row-height: 34px;
    --ahc-group-gap: 12px;
    --ahc-segment-height: 8px;
    --ahc-segment-min-width: 4px;
    --ahc-activity-row-height: 34px;
    --ahc-activity-label-width: 220px;
    --ahc-activity-segment-height: 9px;
    --ahc-activity-segment-min-width: 4px;
    --ahc-activity-group-gap: 12px;
    --ahc-dashboard-row-height: 34px;
    --ahc-dashboard-label-width: 230px;
    --ahc-dashboard-segment-height: 10px;
    --ahc-dashboard-segment-min-width: 5px;
    --ahc-dashboard-group-header-height: 42px;
    --ahc-dashboard-group-gap: 10px;
    --ahc-insights-width: 340px;

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
    gap: var(--ahc-gap-sm);
    padding: clamp(14px, 1.6vw, 22px);
    color: var(--ahc-text);
    background:
      radial-gradient(
        circle at 92% 0%,
        rgba(14, 165, 233, 0.22),
        transparent 34%
      ),
      radial-gradient(
        circle at 4% 12%,
        rgba(124, 58, 237, 0.14),
        transparent 28%
      ),
      linear-gradient(145deg, rgba(15, 23, 42, 0.98), rgba(15, 23, 42, 0.9));
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
      linear-gradient(
        90deg,
        rgba(255, 255, 255, 0.035),
        transparent 18%,
        transparent 82%,
        rgba(255, 255, 255, 0.025)
      ),
      linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent 18%);
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
    padding: max(var(--ahc-gap-lg), env(safe-area-inset-top))
      max(var(--ahc-gap-lg), env(safe-area-inset-right))
      max(var(--ahc-gap-lg), env(safe-area-inset-bottom))
      max(var(--ahc-gap-lg), env(safe-area-inset-left));
    background: linear-gradient(145deg, #020617, #0f172a 45%, #0b1221);
  }

  .ahc--panel,
  .ahc--fullscreen {
    grid-template-rows:
      minmax(72px, max-content)
      minmax(0, 58px)
      minmax(0, 88px)
      minmax(0, 1fr);
    block-size: min(100svh, 980px);
    min-block-size: min(100svh, 760px);
  }

  .ahc__hero,
  .ahc__toolbar,
  .ahc__summary-strip,
  .ahc__body,
  .ahc__main {
    min-inline-size: 0;
  }

  .ahc__hero {
    max-block-size: 96px;
    overflow: hidden;
  }

  .ahc__hero-actions {
    display: flex;
    flex: 0 0 auto;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    gap: var(--ahc-gap-sm);
    min-inline-size: min(420px, 100%);
  }

  .ahc__toolbar {
    max-block-size: 58px;
  }

  .ahc__summary-strip {
    max-block-size: 88px;
  }

  /* Top bar */
  .ahc__topbar {
    display: flex;
    flex-wrap: nowrap;
    gap: var(--ahc-gap-md);
    align-items: start;
    justify-content: space-between;
    padding: 12px 14px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: var(--ahc-radius-md);
    background:
      linear-gradient(90deg, rgba(15, 23, 42, 0.28), rgba(30, 64, 175, 0.1)),
      rgba(2, 6, 23, 0.14);
  }

  .ahc__title-block {
    display: grid;
    grid-auto-flow: row;
    gap: var(--ahc-gap-xs);
    flex: 1 1 auto;
    min-inline-size: 0;
    justify-items: start;
    text-align: start;
  }

  .ahc__title-row {
    display: inline-flex;
    align-items: center;
    gap: var(--ahc-gap-sm);
  }

  .ahc__icon-badge {
    display: inline-grid;
    place-items: center;
    min-inline-size: 48px;
    min-block-size: 48px;
    border-radius: var(--ahc-radius-md);
    background: linear-gradient(
      180deg,
      rgba(56, 189, 248, 0.24),
      rgba(37, 99, 235, 0.2)
    );
    border: 1px solid rgba(56, 189, 248, 0.42);
    color: var(--ahc-accent);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.11),
      0 10px 28px rgba(14, 165, 233, 0.1);
  }

  .ahc__icon-badge ha-icon {
    inline-size: 26px;
    block-size: 26px;
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

  .ahc-last-event {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    max-inline-size: min(560px, 100%);
    min-block-size: 34px;
    padding-block: 4px;
    padding-inline: 10px;
    border: 1px solid rgba(56, 189, 248, 0.22);
    border-radius: 999px;
    background: rgba(2, 6, 23, 0.24);
    color: var(--ahc-muted);
    font-size: 0.78rem;
  }

  .ahc-last-event strong,
  .ahc-last-event__label {
    color: var(--ahc-text);
    font-weight: 850;
  }

  .ahc__hero-actions {
    display: flex;
    flex: 0 0 auto;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    gap: var(--ahc-gap-sm);
    min-inline-size: min(460px, 100%);
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
    transition:
      background 160ms ease,
      color 160ms ease,
      border-color 160ms ease,
      transform 160ms ease;
  }

  .ahc__button:hover,
  .ahc__chip:hover,
  .ahc__segmented-button:hover {
    color: var(--ahc-text);
    border-color: color-mix(
      in srgb,
      var(--ahc-accent) 46%,
      var(--ahc-border-soft)
    );
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
    background: linear-gradient(
      180deg,
      rgba(14, 165, 233, 0.3),
      rgba(37, 99, 235, 0.18)
    );
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 8px 22px rgba(14, 165, 233, 0.1);
  }

  .ahc__button--ghost {
    background: rgba(2, 6, 23, 0.34);
  }

  .ahc__button:disabled {
    cursor: progress;
    opacity: 0.58;
  }

  .ahc__refresh-indicator {
    display: inline-flex;
    align-items: center;
    min-block-size: var(--ahc-chip-height);
    padding-inline: 12px;
    border: 1px solid rgba(56, 189, 248, 0.24);
    border-radius: var(--ahc-radius-sm);
    background: rgba(14, 165, 233, 0.1);
    color: #bae6fd;
    font-size: 0.82rem;
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
    background: rgba(2, 6, 23, 0.3);
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
    display: flex;
    align-items: center;
    gap: var(--ahc-gap-xs);
    padding: 10px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: rgba(15, 23, 42, 0.38);
    overflow: hidden;
  }

  .ahc__filter-row {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    gap: var(--ahc-gap-xs);
    min-inline-size: 0;
    inline-size: 100%;
  }

  .ahc__filter-row--primary {
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .ahc__filter-row--primary > * {
    flex: 0 0 auto;
  }

  .ahc__filter-row--compact {
    overflow-x: auto;
    scrollbar-width: none;
  }

  .ahc__filter-row--compact::-webkit-scrollbar {
    display: none;
  }

  .ahc__filter-row--compact > * {
    flex: 0 0 auto;
  }

  .ahc__filter-label {
    color: var(--ahc-muted);
    font-size: 0.82rem;
    font-weight: 700;
    margin-inline-end: 2px;
  }

  .ahc-curation-note {
    display: inline-flex;
    align-items: center;
    min-block-size: 32px;
    max-inline-size: min(480px, 42vw);
    padding-inline: 10px;
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: 999px;
    background: rgba(2, 6, 23, 0.22);
    color: var(--ahc-muted);
    font-size: 0.78rem;
    line-height: 1.35;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Summary */
  .ahc__summary-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 0;
    overflow: hidden;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background:
      linear-gradient(180deg, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.54)),
      rgba(2, 6, 23, 0.2);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);
  }

  .ahc__metric {
    min-block-size: 88px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--ahc-gap-sm);
    padding: 12px 16px;
    border: 0;
    border-inline-start: 1px solid rgba(148, 163, 184, 0.13);
    background: transparent;
    box-shadow: none;
  }

  .ahc__metric:first-child {
    border-inline-start: 0;
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
    font-size: 1.95rem;
    line-height: 1.05;
    font-weight: 850;
    letter-spacing: 0;
  }

  .ahc__metric-value--compact {
    font-size: 1.12rem;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    inline-size: 46px;
    block-size: 46px;
    border-radius: 14px;
    border: 1px solid var(--ahc-border-soft);
    background: rgba(2, 6, 23, 0.22);
    color: var(--ahc-accent);
  }

  /* Layout body */
  .ahc__body {
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ahc-insights-width);
    gap: var(--ahc-gap-md);
    align-items: stretch;
    direction: ltr;
    min-block-size: 0;
    max-inline-size: 1920px;
  }

  .ahc__body--no-insights {
    grid-template-columns: minmax(0, 1fr);
  }

  .ahc__main,
  .ahc__timeline-panel {
    min-inline-size: 0;
    min-block-size: 0;
    display: grid;
    gap: var(--ahc-gap-md);
  }

  .ahc__insights {
    display: grid;
    gap: var(--ahc-gap-sm);
    align-content: start;
    padding: var(--ahc-gap-sm);
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: linear-gradient(
      180deg,
      rgba(30, 41, 59, 0.5),
      rgba(15, 23, 42, 0.52)
    );
  }

  .ahc__insights-panel {
    inline-size: 100%;
    max-inline-size: var(--ahc-insights-width);
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
    padding: 12px;
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
    font-size: 1.12rem;
    font-weight: 850;
    overflow-wrap: anywhere;
  }

  .ahc__insight-subtitle {
    display: block;
    color: var(--ahc-muted);
    font-size: 0.78rem;
    margin-block-start: 6px;
  }

  .ahc__spark {
    display: flex;
    align-items: end;
    gap: 5px;
    block-size: 34px;
    margin-block-start: 10px;
  }

  .ahc__spark i {
    inline-size: 8px;
    block-size: var(--bar, 20%);
    min-block-size: 4px;
    border-radius: 999px 999px 2px 2px;
    background: linear-gradient(
      180deg,
      var(--ahc-accent),
      rgba(37, 99, 235, 0.38)
    );
  }

  /* Activity dashboard timeline */
  .ahc-activity {
    direction: rtl;
    display: grid;
    gap: var(--ahc-gap-md);
    min-inline-size: 0;
    min-block-size: 420px;
    padding: var(--ahc-gap-md);
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: linear-gradient(
      180deg,
      rgba(30, 41, 59, 0.42),
      rgba(2, 6, 23, 0.24)
    );
    overflow: hidden;
  }

  .ahc-activity__header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: var(--ahc-gap-md);
    padding-block-end: var(--ahc-gap-xs);
    border-block-end: 1px solid rgba(148, 163, 184, 0.12);
  }

  .ahc-activity__heading {
    min-inline-size: 0;
    text-align: start;
  }

  .ahc-activity__heading h3 {
    margin: 0;
    color: var(--ahc-text);
    font-size: 1.08rem;
    font-weight: 850;
  }

  .ahc-activity__heading p,
  .ahc-activity__more {
    margin: 6px 0 0;
    color: var(--ahc-muted);
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .ahc-activity__range {
    flex: 0 0 auto;
    min-block-size: 36px;
    display: inline-flex;
    align-items: center;
    padding-inline: 12px;
    border: 1px solid rgba(56, 189, 248, 0.28);
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.1);
    color: #bae6fd;
    font-size: 0.82rem;
    font-weight: 800;
  }

  .ahc-activity__density-strip {
    direction: ltr;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(5px, 1fr);
    align-items: end;
    gap: 3px;
    min-block-size: 58px;
    padding-block: 8px;
    padding-inline: 10px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: var(--ahc-radius-sm);
    background: rgba(2, 6, 23, 0.28);
  }

  .ahc-activity__density-bar {
    display: block;
    block-size: max(6px, calc(var(--intensity, 0) * 48px));
    border-radius: 999px 999px 3px 3px;
    background: linear-gradient(
      180deg,
      rgba(125, 211, 252, 0.95),
      rgba(34, 197, 94, 0.34)
    );
    opacity: max(0.18, calc(var(--intensity, 0) * 0.92));
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.16);
  }

  .ahc-activity__axis {
    direction: ltr;
    position: relative;
    min-block-size: 32px;
    margin-inline-start: 0;
    margin-inline-end: var(--ahc-activity-label-width);
    border-block-end: 1px solid rgba(148, 163, 184, 0.1);
  }

  .ahc-activity__tick {
    position: absolute;
    inset-block: 0;
    transform: translateX(-50%);
    min-inline-size: 42px;
    display: grid;
    place-items: center;
    color: var(--ahc-muted);
    font-size: 0.75rem;
  }

  .ahc-activity__tick::after {
    content: "";
    position: absolute;
    inset-block-end: 0;
    inline-size: 1px;
    block-size: 9px;
    background: rgba(148, 163, 184, 0.16);
  }

  .ahc-activity__groups {
    display: grid;
    gap: var(--ahc-activity-group-gap);
    min-inline-size: 0;
  }

  .ahc-activity-group {
    display: grid;
    gap: var(--ahc-gap-sm);
    padding: var(--ahc-gap-sm);
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: var(--ahc-radius-md);
    background: rgba(15, 23, 42, 0.46);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .ahc-activity-group__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    min-block-size: 32px;
  }

  .ahc-activity-group__title {
    display: inline-flex;
    align-items: center;
    gap: var(--ahc-gap-xs);
    color: var(--ahc-text);
    font-weight: 850;
  }

  .ahc-activity-group__meta {
    color: var(--ahc-muted);
    font-size: 0.78rem;
    white-space: nowrap;
  }

  .ahc-activity-group__rows {
    display: grid;
    gap: 4px;
  }

  .ahc-activity-row {
    direction: rtl;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ahc-activity-label-width);
    align-items: center;
    gap: var(--ahc-gap-sm);
    min-block-size: var(--ahc-activity-row-height);
  }

  .ahc-activity-row__label {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--ahc-gap-xs);
    min-inline-size: 0;
    color: var(--ahc-text);
  }

  .ahc-activity-row__name {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.84rem;
    font-weight: 760;
  }

  .ahc-activity-row__plot {
    direction: ltr;
    position: relative;
    min-inline-size: 0;
    min-block-size: var(--ahc-activity-row-height);
    overflow: visible;
    border-radius: 999px;
    background-image: linear-gradient(
      to right,
      rgba(148, 163, 184, 0.08) 1px,
      transparent 1px
    );
    background-size: calc(100% / 8) 100%;
  }

  .ahc-activity-segment {
    appearance: none;
    position: absolute;
    inset-block-start: 50%;
    min-inline-size: var(--ahc-activity-segment-min-width);
    block-size: var(--ahc-activity-segment-height);
    transform: translateY(-50%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    padding: 0;
    cursor: pointer;
    overflow: hidden;
    color: transparent;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.13),
      0 7px 18px rgba(0, 0, 0, 0.22);
  }

  .ahc-activity-segment span {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  .ahc-activity-segment:focus-visible {
    outline: 2px solid var(--ahc-focus);
    outline-offset: 3px;
  }

  .ahc-activity-segment[data-category="on"] {
    background: linear-gradient(90deg, var(--ahc-on), #86efac);
  }
  .ahc-activity-segment[data-category="cooling"] {
    background: linear-gradient(90deg, var(--ahc-cooling), #7dd3fc);
  }
  .ahc-activity-segment[data-category="heating"] {
    background: linear-gradient(90deg, var(--ahc-heating), #fdba74);
  }
  .ahc-activity-segment[data-category="drying"],
  .ahc-activity-segment[data-category="fan"] {
    background: linear-gradient(90deg, var(--ahc-idle), #5eead4);
  }
  .ahc-activity-segment[data-category="playing"] {
    background: linear-gradient(90deg, var(--ahc-playing), #c4b5fd);
  }
  .ahc-activity-segment[data-category="opening"] {
    background: linear-gradient(90deg, var(--ahc-opening), #fde68a);
  }
  .ahc-activity-segment[data-category="closing"] {
    background: linear-gradient(90deg, var(--ahc-closing), #e2e8f0);
  }

  .ahc-activity-empty {
    place-items: center;
    min-block-size: 260px;
    text-align: center;
  }

  .ahc-activity-empty h3 {
    margin: 0;
    color: var(--ahc-text);
    font-size: 1.18rem;
    font-weight: 850;
  }

  .ahc-activity-empty p {
    max-inline-size: 520px;
    margin: var(--ahc-gap-xs) 0 0;
    color: var(--ahc-muted);
  }

  /* Product activity dashboard */
  .ahc-dashboard {
    direction: rtl;
    display: grid;
    gap: var(--ahc-gap-sm);
    min-inline-size: 0;
    min-block-size: 360px;
    padding: var(--ahc-gap-sm);
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.68),
      rgba(2, 6, 23, 0.36)
    );
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
    overflow: hidden;
  }

  .ahc-dashboard__header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: var(--ahc-gap-md);
    min-inline-size: 0;
    padding-block-end: 8px;
    border-block-end: 1px solid rgba(148, 163, 184, 0.12);
  }

  .ahc-dashboard__title-block {
    display: grid;
    gap: 4px;
    min-inline-size: 0;
    text-align: start;
  }

  .ahc-dashboard__title-block h3 {
    margin: 0;
    color: var(--ahc-text);
    font-size: 1.08rem;
    font-weight: 850;
  }

  .ahc-dashboard__title-block p,
  .ahc-dashboard__hidden-note {
    margin: 0;
    color: var(--ahc-muted);
    font-size: 0.82rem;
    line-height: 1.45;
  }

  .ahc-dashboard__range-pill {
    flex: 0 0 auto;
    min-block-size: 36px;
    display: inline-flex;
    align-items: center;
    padding-inline: 12px;
    border: 1px solid rgba(56, 189, 248, 0.32);
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.12);
    color: #bae6fd;
    font-size: 0.82rem;
    font-weight: 800;
  }

  .ahc-dashboard__overview {
    display: grid;
    gap: 6px;
    padding: 8px 10px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: var(--ahc-radius-sm);
    background: rgba(2, 6, 23, 0.26);
  }

  .ahc-dashboard__density {
    direction: ltr;
    display: flex;
    align-items: end;
    gap: 3px;
    min-block-size: 34px;
    padding: 3px 2px;
  }

  .ahc-dashboard-density-bucket {
    flex: 1 1 0;
    min-inline-size: 3px;
    block-size: 28px;
    display: flex;
    align-items: end;
    justify-content: center;
    border-radius: 6px;
    background: rgba(148, 163, 184, 0.06);
  }

  .ahc-dashboard-density-fill {
    inline-size: 100%;
    block-size: 0;
    min-block-size: 0;
    max-block-size: 24px;
    border-radius: 5px 5px 2px 2px;
    background: linear-gradient(180deg, #7dd3fc, #22c55e);
    opacity: 0.22;
    transition:
      block-size 180ms ease,
      opacity 180ms ease;
  }

  .ahc-dashboard-density-bucket[data-active="true"]
    .ahc-dashboard-density-fill {
    block-size: max(4px, calc(var(--intensity, 0) * 24px));
    opacity: max(0.38, calc(var(--intensity, 0) * 0.96));
  }

  .ahc-dashboard__axis {
    direction: ltr;
    position: relative;
    min-block-size: 24px;
    margin-inline-start: calc(var(--ahc-dashboard-label-width) + 8px);
    margin-inline-end: 72px;
  }

  .ahc-dashboard__tick {
    position: absolute;
    inset-block: 0;
    transform: translateX(-50%);
    min-inline-size: 44px;
    display: grid;
    place-items: center;
    color: var(--ahc-muted);
    font-size: 0.74rem;
  }

  .ahc-dashboard__tick::after {
    content: "";
    position: absolute;
    inset-block-end: 0;
    inline-size: 1px;
    block-size: 7px;
    background: rgba(148, 163, 184, 0.18);
  }

  .ahc-dashboard__groups {
    display: grid;
    gap: var(--ahc-dashboard-group-gap);
    min-inline-size: 0;
  }

  .ahc-dashboard-group {
    display: grid;
    gap: 8px;
    padding: 10px;
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: var(--ahc-radius-md);
    background: rgba(15, 23, 42, 0.52);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
  }

  .ahc-area-card {
    overflow: hidden;
  }

  .ahc-dashboard-group__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-inline-size: 0;
  }

  .ahc-area-card__actions {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-inline-size: 0;
  }

  .ahc-dashboard-group__title {
    display: inline-grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--ahc-gap-xs);
    min-inline-size: 0;
  }

  .ahc-dashboard-group__title strong,
  .ahc-dashboard-row__label strong {
    color: var(--ahc-text);
    font-weight: 850;
  }

  .ahc-dashboard-group__title span,
  .ahc-dashboard-group__meta,
  .ahc-dashboard-row__label span,
  .ahc-dashboard-row__meta span {
    color: var(--ahc-muted);
    font-size: 0.76rem;
  }

  .ahc-dashboard-group__meta {
    white-space: nowrap;
  }

  .ahc-area-card__inventory-button,
  .ahc-area-inventory__more {
    appearance: none;
    min-block-size: 32px;
    border: 1px solid rgba(125, 211, 252, 0.28);
    border-radius: 999px;
    background: rgba(14, 165, 233, 0.1);
    color: #bae6fd;
    font: inherit;
    font-size: 0.76rem;
    font-weight: 800;
    cursor: pointer;
  }

  .ahc-area-card__inventory-button {
    padding-inline: 12px;
  }

  .ahc-area-card__inventory-button:hover,
  .ahc-area-inventory__more:hover {
    background: rgba(14, 165, 233, 0.18);
  }

  .ahc-dashboard-icon {
    display: inline-grid;
    place-items: center;
    inline-size: 30px;
    block-size: 30px;
    border-radius: 10px;
    background: rgba(56, 189, 248, 0.1);
    color: #bae6fd;
  }

  .ahc-dashboard-icon ha-icon {
    inline-size: 19px;
    block-size: 19px;
  }

  .ahc-dashboard-group__aggregate {
    direction: ltr;
    position: relative;
    min-block-size: 24px;
    border-radius: 999px;
    background:
      linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px),
      rgba(2, 6, 23, 0.2);
    background-size: calc(100% / 8) 100%;
    overflow: hidden;
  }

  .ahc-dashboard-group__rows {
    display: grid;
    gap: 3px;
  }

  .ahc-dashboard-row {
    direction: rtl;
    display: grid;
    grid-template-columns:
      var(--ahc-dashboard-label-width) minmax(0, 1fr)
      minmax(64px, 78px);
    align-items: center;
    gap: var(--ahc-gap-xs);
    min-block-size: var(--ahc-dashboard-row-height);
    padding-block: 1px;
    padding-inline: 6px;
    border-radius: var(--ahc-radius-sm);
  }

  .ahc-dashboard-row:hover {
    background: rgba(56, 189, 248, 0.06);
  }

  .ahc-dashboard-row__label {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: var(--ahc-gap-xs);
    min-inline-size: 0;
  }

  .ahc-dashboard-row__label div {
    min-inline-size: 0;
    display: grid;
    gap: 1px;
  }

  .ahc-dashboard-row__label strong,
  .ahc-dashboard-row__label span {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ahc-dashboard-row__label strong {
    font-size: 0.84rem;
  }

  .ahc-dashboard-row__plot {
    direction: ltr;
    position: relative;
    min-inline-size: 0;
    min-block-size: var(--ahc-dashboard-row-height);
    border-radius: 999px;
    background:
      linear-gradient(to right, rgba(148, 163, 184, 0.07) 1px, transparent 1px),
      rgba(15, 23, 42, 0.36);
    background-size: calc(100% / 8) 100%;
    overflow: visible;
  }

  .ahc-dashboard-row__meta {
    display: grid;
    justify-items: end;
    gap: 1px;
    min-inline-size: 0;
    color: var(--ahc-muted);
    font-size: 0.72rem;
    text-align: end;
  }

  .ahc-dashboard-row__meta strong {
    color: #bbf7d0;
    font-size: 0.82rem;
  }

  .ahc-dashboard-segment {
    box-sizing: border-box;
    position: absolute;
    inset-block-start: 50%;
    min-inline-size: 0;
    block-size: var(--ahc-dashboard-segment-height);
    transform: translateY(-50%);
    border: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 999px;
    background: var(--segment-color, var(--ahc-on));
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.16),
      0 6px 14px rgba(0, 0, 0, 0.18);
  }

  .ahc-dashboard-segment--min {
    min-inline-size: var(--ahc-dashboard-segment-min-width);
  }

  .ahc-dashboard-segment--aggregate {
    block-size: 13px;
    opacity: 0.86;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 8px 20px rgba(34, 197, 94, 0.18);
  }

  button.ahc-dashboard-segment {
    appearance: none;
    padding: 0;
    cursor: pointer;
  }

  .ahc-dashboard-segment span {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  .ahc-dashboard-segment:focus-visible {
    outline: 2px solid var(--ahc-focus);
    outline-offset: 3px;
  }

  .ahc-dashboard-segment[data-category="cooling"] {
    background: linear-gradient(90deg, var(--ahc-cooling), #7dd3fc);
  }

  .ahc-dashboard-segment[data-category="heating"] {
    background: linear-gradient(90deg, var(--ahc-heating), #fdba74);
  }

  .ahc-dashboard-segment[data-category="drying"],
  .ahc-dashboard-segment[data-category="fan"] {
    background: linear-gradient(90deg, var(--ahc-idle), #5eead4);
  }

  .ahc-dashboard-segment[data-category="playing"] {
    background: linear-gradient(90deg, var(--ahc-playing), #c4b5fd);
  }

  .ahc-dashboard-segment[data-category="opening"] {
    background: linear-gradient(90deg, var(--ahc-opening), #fde68a);
  }

  .ahc-dashboard-segment[data-category="closing"] {
    background: linear-gradient(90deg, var(--ahc-closing), #e2e8f0);
  }

  .ahc-area-card__quiet {
    min-block-size: 36px;
    display: grid;
    align-items: center;
    padding-inline: 10px;
    border: 1px dashed rgba(148, 163, 184, 0.18);
    border-radius: var(--ahc-radius-sm);
    background: rgba(2, 6, 23, 0.16);
    color: var(--ahc-muted);
    font-size: 0.78rem;
  }

  .ahc-area-inventory {
    display: grid;
    gap: 8px;
    padding-block-start: 6px;
    border-block-start: 1px solid rgba(148, 163, 184, 0.12);
  }

  .ahc-area-inventory__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    color: var(--ahc-text);
    font-size: 0.78rem;
    font-weight: 850;
  }

  .ahc-area-inventory__header small {
    color: var(--ahc-muted);
    font-size: 0.74rem;
    font-weight: 700;
  }

  .ahc-area-inventory__groups {
    display: grid;
    gap: 7px;
  }

  .ahc-area-inventory__domain {
    display: grid;
    gap: 5px;
  }

  .ahc-area-inventory__domain-title {
    color: var(--ahc-muted);
    font-size: 0.72rem;
    font-weight: 800;
  }

  .ahc-area-inventory__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-inline-size: 0;
  }

  .ahc-inventory-chip {
    appearance: none;
    min-inline-size: 0;
    max-inline-size: min(100%, 230px);
    min-block-size: 44px;
    display: inline-grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 7px;
    padding: 6px 9px;
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 8px;
    background: rgba(15, 23, 42, 0.58);
    color: var(--ahc-text);
    font: inherit;
    text-align: start;
    cursor: pointer;
  }

  .ahc-inventory-chip:hover {
    border-color: rgba(125, 211, 252, 0.34);
    background: rgba(30, 41, 59, 0.68);
  }

  .ahc-inventory-chip[data-active-now="true"] {
    border-color: rgba(187, 247, 208, 0.38);
    background: rgba(34, 197, 94, 0.1);
  }

  .ahc-inventory-chip[data-had-activity="false"] {
    color: rgba(226, 232, 240, 0.78);
  }

  .ahc-inventory-chip .ahc-dashboard-icon {
    inline-size: 26px;
    block-size: 26px;
    border-radius: 8px;
  }

  .ahc-inventory-chip__copy {
    display: grid;
    gap: 1px;
    min-inline-size: 0;
  }

  .ahc-inventory-chip__copy strong,
  .ahc-inventory-chip__copy small {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ahc-inventory-chip__copy strong {
    color: inherit;
    font-size: 0.78rem;
    font-weight: 850;
  }

  .ahc-inventory-chip__copy small {
    color: var(--ahc-muted);
    font-size: 0.7rem;
  }

  .ahc-area-inventory__more {
    justify-self: start;
    padding-inline: 12px;
  }

  .ahc-dashboard-empty {
    place-items: center;
    min-block-size: 260px;
    text-align: center;
  }

  .ahc-dashboard-empty h3 {
    margin: 0;
    color: var(--ahc-text);
    font-size: 1.18rem;
    font-weight: 850;
  }

  .ahc-dashboard-empty p {
    max-inline-size: 520px;
    margin: 0;
    color: var(--ahc-muted);
  }

  .ahc-legacy-warning {
    padding: 10px 12px;
    border: 1px solid rgba(251, 191, 36, 0.28);
    border-radius: var(--ahc-radius-sm);
    background: rgba(251, 191, 36, 0.1);
    color: #fde68a;
    font-size: 0.82rem;
    line-height: 1.45;
  }

  /* Area inventory dashboard polish */
  .ahc__insights-panel {
    display: block;
    inline-size: 100%;
    max-inline-size: var(--ahc-insights-width);
    min-inline-size: 0;
  }

  .ahc__insights-panel > .ahc__insights {
    inline-size: 100%;
  }

  .ahc-dashboard {
    gap: 10px;
    min-block-size: 0;
    padding: 10px;
  }

  .ahc-dashboard__header {
    min-block-size: 42px;
    padding-block-end: 6px;
  }

  .ahc-dashboard__title-block h3 {
    font-size: 1rem;
  }

  .ahc-dashboard__title-block p,
  .ahc-dashboard__hidden-note {
    font-size: 0.78rem;
  }

  .ahc-dashboard__overview {
    gap: 4px;
    padding: 6px 8px;
  }

  .ahc-dashboard__density {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(5px, 1fr));
    align-items: end;
    gap: 3px;
    min-block-size: 36px;
  }

  .ahc-dashboard-density-bucket {
    block-size: 30px;
    min-inline-size: 0;
    align-items: end;
    background: rgba(148, 163, 184, 0.045);
  }

  .ahc-dashboard-density-fill {
    align-self: end;
    inline-size: 100%;
    background: linear-gradient(180deg, #93c5fd, #86efac);
  }

  .ahc-dashboard-density-bucket[data-active="true"]
    .ahc-dashboard-density-fill {
    block-size: max(5px, calc(var(--intensity, 0) * 28px));
    opacity: max(0.46, calc(var(--intensity, 0) * 0.98));
  }

  .ahc-area-card {
    display: grid;
    gap: 9px;
    overflow: hidden;
    padding: 10px;
    border: 1px solid rgba(148, 163, 184, 0.13);
    border-radius: var(--ahc-radius-sm);
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.54), rgba(2, 6, 23, 0.28)),
      rgba(15, 23, 42, 0.42);
  }

  .ahc-dashboard-group {
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
  }

  .ahc-area-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-inline-size: 0;
  }

  .ahc-area-card__title {
    min-inline-size: 0;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 8px;
  }

  .ahc-area-card__title-copy {
    min-inline-size: 0;
    display: grid;
    gap: 2px;
  }

  .ahc-area-card__title-copy strong,
  .ahc-area-card__title-copy span {
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ahc-area-card__title-copy strong {
    color: var(--ahc-text);
    font-size: 0.9rem;
    font-weight: 850;
  }

  .ahc-area-card__title-copy span {
    color: var(--ahc-muted);
    font-size: 0.74rem;
  }

  .ahc-area-card__actions {
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    min-inline-size: 0;
  }

  .ahc-area-card__meta {
    display: grid;
    justify-items: end;
    gap: 1px;
    min-inline-size: max-content;
    color: var(--ahc-muted);
    font-size: 0.72rem;
    line-height: 1.25;
  }

  .ahc-area-card__meta strong {
    color: #bbf7d0;
    font-size: 0.84rem;
    font-weight: 850;
  }

  .ahc-area-card__aggregate {
    min-block-size: 20px;
    background:
      linear-gradient(to right, rgba(148, 163, 184, 0.06) 1px, transparent 1px),
      rgba(2, 6, 23, 0.18);
  }

  .ahc-area-card__content {
    display: grid;
    gap: 10px;
    min-inline-size: 0;
  }

  .ahc-area-card__activity {
    min-inline-size: 0;
  }

  .ahc-dashboard-group__rows {
    display: grid;
    gap: 4px;
  }

  .ahc-dashboard-row {
    direction: rtl;
    grid-template-columns:
      minmax(170px, var(--ahc-dashboard-label-width))
      minmax(220px, 1fr);
    min-block-size: var(--ahc-dashboard-row-height);
    gap: 10px;
    padding-block: 2px;
    padding-inline: 0;
    border-radius: 10px;
  }

  .ahc-dashboard-row__label {
    min-inline-size: 0;
    align-self: stretch;
    padding-inline: 4px;
  }

  .ahc-dashboard-row__label div {
    gap: 1px;
  }

  .ahc-dashboard-row__label strong {
    font-size: 0.8rem;
  }

  .ahc-dashboard-row__inline-meta {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: var(--ahc-muted);
    font-size: 0.7rem;
  }

  .ahc-dashboard-row__inline-meta strong {
    color: #bbf7d0;
    font-size: 0.72rem;
  }

  .ahc-dashboard-row__plot {
    min-block-size: var(--ahc-dashboard-row-height);
    background:
      linear-gradient(
        to right,
        rgba(148, 163, 184, 0.055) 1px,
        transparent 1px
      ),
      transparent;
  }

  .ahc-dashboard-row__plot::before {
    content: "";
    position: absolute;
    inset-inline: 4px;
    inset-block-start: 50%;
    block-size: 2px;
    transform: translateY(-50%);
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.13);
  }

  .ahc-dashboard-row__meta {
    display: none;
  }

  .ahc-dashboard-segment {
    z-index: 1;
  }

  .ahc-dashboard-segment--row {
    block-size: 11px;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 0 0 1px rgba(255, 255, 255, 0.05),
      0 8px 18px rgba(0, 0, 0, 0.2);
  }

  .ahc-dashboard-segment--min {
    min-inline-size: 8px;
    box-shadow:
      0 0 0 3px rgba(125, 211, 252, 0.13),
      0 0 16px rgba(125, 211, 252, 0.28);
  }

  .ahc-area-card__quiet {
    min-block-size: 44px;
    align-items: center;
    border-style: solid;
    background: rgba(2, 6, 23, 0.2);
  }

  .ahc-area-inventory {
    gap: 8px;
    padding: 10px;
    border: 1px solid rgba(148, 163, 184, 0.11);
    border-radius: 12px;
    background: rgba(2, 6, 23, 0.22);
  }

  .ahc-area-inventory__header {
    min-block-size: 24px;
  }

  .ahc-area-inventory__chips {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(178px, 1fr));
    gap: 7px;
  }

  .ahc-inventory-chip {
    position: relative;
    max-inline-size: none;
    min-block-size: 48px;
    grid-template-columns: auto minmax(0, 1fr);
    border-radius: 10px;
    background: rgba(15, 23, 42, 0.58);
  }

  .ahc-inventory-chip__copy {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    column-gap: 6px;
  }

  .ahc-inventory-chip__status {
    inline-size: 7px;
    block-size: 7px;
    border-radius: 999px;
    background: var(--ahc-disabled);
  }

  .ahc-inventory-chip__copy strong,
  .ahc-inventory-chip__copy small {
    grid-column: 2;
  }

  .ahc-inventory-chip[data-state-tone="active"] {
    border-color: rgba(187, 247, 208, 0.45);
    background: rgba(34, 197, 94, 0.12);
  }

  .ahc-inventory-chip[data-state-tone="active"] .ahc-inventory-chip__status {
    background: var(--ahc-on);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.14);
  }

  .ahc-inventory-chip[data-state-tone="had_activity"]
    .ahc-inventory-chip__status {
    background: var(--ahc-accent);
  }

  .ahc-inventory-chip[data-state-tone="inactive"] {
    opacity: 0.84;
  }

  .ahc-inventory-chip[data-state-tone="unavailable"] {
    border-color: rgba(148, 163, 184, 0.18);
    color: rgba(226, 232, 240, 0.68);
    background: rgba(15, 23, 42, 0.34);
  }

  .ahc-inventory-chip[data-state-tone="unavailable"]
    .ahc-inventory-chip__status {
    background: var(--ahc-unknown);
  }

  /* Timeline */
  .ahc-timeline-card {
    min-inline-size: 0;
    min-block-size: 420px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background:
      linear-gradient(180deg, rgba(30, 41, 59, 0.42), rgba(2, 6, 23, 0.3)),
      radial-gradient(
        circle at 88% 12%,
        rgba(56, 189, 248, 0.1),
        transparent 32%
      );
    overflow: hidden;
  }

  .ahc-timeline-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    min-block-size: 58px;
    padding: 12px 16px;
    border-block-end: 1px solid var(--ahc-border-soft);
    background: rgba(15, 23, 42, 0.4);
  }

  .ahc-timeline-toolbar .ahc-curation-note {
    max-inline-size: min(520px, 48vw);
  }

  .ahc-timeline-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 800;
    color: var(--ahc-text);
  }

  .ahc-timeline-scroll {
    inline-size: 100%;
    max-block-size: var(--ahc-timeline-height, min(62svh, 680px));
    overflow: auto;
    overscroll-behavior-inline: contain;
    scrollbar-color: rgba(56, 189, 248, 0.42) rgba(15, 23, 42, 0.3);
  }

  .ahc-timeline {
    direction: ltr;
    position: relative;
    min-inline-size: 1040px;
    padding: 0;
  }

  .ahc-timeline__axis {
    position: sticky;
    inset-block-start: 0;
    z-index: 3;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ahc-label-width);
    min-block-size: 48px;
    background: rgba(15, 23, 42, 0.92);
    backdrop-filter: blur(14px);
    border-block-end: 1px solid var(--ahc-border-soft);
  }

  .ahc-timeline__axis-spacer {
    position: sticky;
    inset-inline-end: 0;
    z-index: 4;
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
    margin: var(--ahc-group-gap);
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: var(--ahc-radius-sm);
    background: rgba(15, 23, 42, 0.3);
    overflow: clip;
  }

  .ahc-group:nth-child(even) {
    background: rgba(15, 23, 42, 0.36);
  }

  .ahc-group__header {
    position: sticky;
    inset-inline-start: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    min-block-size: 54px;
    padding-block: 0;
    padding-inline: var(--ahc-gap-md);
    background:
      linear-gradient(90deg, rgba(15, 23, 42, 0.82), rgba(30, 41, 59, 0.72)),
      rgba(2, 6, 23, 0.34);
    cursor: pointer;
    list-style: none;
  }

  .ahc-group__header::-webkit-details-marker {
    display: none;
  }

  .ahc-group__empty {
    direction: rtl;
    padding: var(--ahc-gap-md);
    color: var(--ahc-muted);
    font-size: 0.82rem;
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
    grid-template-columns: minmax(0, 1fr) var(--ahc-label-width);
    min-block-size: var(--ahc-row-height);
    border-block-start: 1px solid rgba(148, 163, 184, 0.09);
  }

  .ahc-row:hover {
    background: var(--ahc-row-hover);
  }

  .ahc-row__label {
    position: sticky;
    inset-inline-start: auto;
    inset-inline-end: 0;
    z-index: 2;
    direction: rtl;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    gap: var(--ahc-gap-xs);
    padding-inline: 12px 14px;
    border-inline-start: 1px solid rgba(148, 163, 184, 0.12);
    background: rgba(8, 15, 32, 0.72);
    backdrop-filter: blur(10px);
    min-inline-size: 0;
  }

  .ahc-entity-icon,
  .ahc-group-icon {
    display: inline-grid;
    place-items: center;
    inline-size: 22px;
    block-size: 22px;
    color: var(--ahc-accent);
    flex: 0 0 auto;
  }

  ha-icon.ahc-entity-icon,
  ha-icon.ahc-group-icon {
    inline-size: 22px;
    block-size: 22px;
  }

  .ahc-group-icon {
    color: #7dd3fc;
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

  .ahc-row__state-chip[data-state="on"] {
    color: #bbf7d0;
    background: rgba(34, 197, 94, 0.16);
    border-color: rgba(34, 197, 94, 0.28);
  }
  .ahc-row__state-chip[data-state="cooling"] {
    color: #bae6fd;
    background: rgba(56, 189, 248, 0.14);
    border-color: rgba(56, 189, 248, 0.3);
  }
  .ahc-row__state-chip[data-state="heating"] {
    color: #fed7aa;
    background: rgba(251, 146, 60, 0.16);
    border-color: rgba(251, 146, 60, 0.3);
  }
  .ahc-row__state-chip[data-state="playing"] {
    color: #ddd6fe;
    background: rgba(167, 139, 250, 0.16);
    border-color: rgba(167, 139, 250, 0.3);
  }

  .ahc-row__track {
    direction: ltr;
    position: relative;
    min-inline-size: 0;
    min-block-size: var(--ahc-row-height);
    background-image: linear-gradient(
      to right,
      var(--ahc-grid-line) 1px,
      transparent 1px
    );
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
    stroke: rgba(148, 163, 184, 0.08);
    stroke-width: 2;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }

  .ahc-segment-svg {
    cursor: pointer;
    stroke: rgba(255, 255, 255, 0.2);
    stroke-width: 0.8;
    vector-effect: non-scaling-stroke;
    filter: drop-shadow(0 3px 7px rgba(0, 0, 0, 0.22));
  }

  .ahc-segment-svg--inactive {
    cursor: pointer;
    opacity: 0.28;
    stroke: rgba(255, 255, 255, 0.04);
    filter: none;
  }

  .ahc-segment-svg[data-active="true"] {
    opacity: 0.96;
  }

  .ahc-segment-svg:focus-visible {
    outline: 2px solid var(--ahc-focus);
    outline-offset: 3px;
  }

  .ahc-segment-svg[data-category="on"] {
    fill: var(--ahc-on);
  }
  .ahc-segment-svg[data-category="off"] {
    fill: color-mix(in srgb, var(--ahc-off) 72%, #dbeafe 28%);
  }
  .ahc-segment-svg[data-category="cooling"] {
    fill: var(--ahc-cooling);
  }
  .ahc-segment-svg[data-category="heating"] {
    fill: var(--ahc-heating);
  }
  .ahc-segment-svg[data-category="drying"],
  .ahc-segment-svg[data-category="fan"] {
    fill: var(--ahc-idle);
  }
  .ahc-segment-svg[data-category="playing"] {
    fill: var(--ahc-playing);
  }
  .ahc-segment-svg[data-category="opening"] {
    fill: var(--ahc-opening);
  }
  .ahc-segment-svg[data-category="closing"] {
    fill: var(--ahc-closing);
  }
  .ahc-segment-svg[data-category="idle"] {
    fill: color-mix(in srgb, var(--ahc-idle) 62%, #64748b 38%);
  }
  .ahc-segment-svg[data-category="unknown"] {
    fill: var(--ahc-unknown);
    stroke-dasharray: 3 2;
  }

  .ahc-timeline-card--baselines .ahc-row__track::before {
    content: "";
    position: absolute;
    inset-inline: 14px;
    inset-block-start: 50%;
    block-size: 1px;
    transform: translateY(-50%);
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.08);
  }

  .ahc-segment {
    position: absolute;
    inset-block-start: 50%;
    block-size: 12px;
    transform: translateY(-50%);
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow:
      0 1px 0 rgba(255, 255, 255, 0.08) inset,
      0 6px 16px rgba(0, 0, 0, 0.18);
    cursor: pointer;
  }

  .ahc-segment:focus-visible {
    outline: 2px solid var(--ahc-focus);
    outline-offset: 3px;
  }

  .ahc-segment[data-category="on"] {
    background: linear-gradient(
      90deg,
      var(--ahc-on),
      color-mix(in srgb, var(--ahc-on) 72%, #0f172a)
    );
  }
  .ahc-segment[data-category="off"] {
    background: linear-gradient(
      90deg,
      var(--ahc-off),
      color-mix(in srgb, var(--ahc-off) 72%, #0f172a)
    );
  }
  .ahc-segment[data-category="cooling"] {
    background: linear-gradient(
      90deg,
      var(--ahc-cooling),
      color-mix(in srgb, var(--ahc-cooling) 70%, #1d4ed8)
    );
  }
  .ahc-segment[data-category="heating"] {
    background: linear-gradient(
      90deg,
      var(--ahc-heating),
      color-mix(in srgb, var(--ahc-heating) 70%, #7c2d12)
    );
  }
  .ahc-segment[data-category="drying"],
  .ahc-segment[data-category="fan"] {
    background: linear-gradient(
      90deg,
      var(--ahc-idle),
      color-mix(in srgb, var(--ahc-idle) 70%, #0f766e)
    );
  }
  .ahc-segment[data-category="playing"] {
    background: linear-gradient(
      90deg,
      var(--ahc-playing),
      color-mix(in srgb, var(--ahc-playing) 68%, #312e81)
    );
  }
  .ahc-segment[data-category="opening"] {
    background: linear-gradient(
      90deg,
      var(--ahc-opening),
      color-mix(in srgb, var(--ahc-opening) 70%, #713f12)
    );
  }
  .ahc-segment[data-category="closing"] {
    background: linear-gradient(
      90deg,
      var(--ahc-closing),
      color-mix(in srgb, var(--ahc-closing) 70%, #334155)
    );
  }
  .ahc-segment[data-category="idle"] {
    background: linear-gradient(
      90deg,
      var(--ahc-idle),
      color-mix(in srgb, var(--ahc-idle) 70%, #0f766e)
    );
  }
  .ahc-segment[data-category="unknown"] {
    background: repeating-linear-gradient(
      90deg,
      var(--ahc-unknown),
      var(--ahc-unknown) 6px,
      transparent 6px,
      transparent 10px
    );
  }

  .ahc-now-line {
    position: absolute;
    inset-block: 0;
    inline-size: 1px;
    background: linear-gradient(
      180deg,
      transparent,
      var(--ahc-now) 12%,
      var(--ahc-now) 88%,
      transparent
    );
    box-shadow:
      0 0 0 1px rgba(96, 165, 250, 0.14),
      0 0 18px rgba(96, 165, 250, 0.3);
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
    background: rgba(37, 99, 235, 0.62);
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
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
  }

  /* Tooltip / popover */
  .ahc-popover {
    direction: rtl;
    position: fixed;
    inset-inline-start: var(--ahc-popover-x, 16px);
    inset-block-start: var(--ahc-popover-y, 16px);
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

  .ahc-popover__close {
    appearance: none;
    position: absolute;
    inset-block-start: 8px;
    inset-inline-end: 8px;
    inline-size: 30px;
    block-size: 30px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: 999px;
    background: rgba(2, 6, 23, 0.32);
    color: var(--ahc-text);
    cursor: pointer;
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
    inset-inline: max(12px, env(safe-area-inset-left))
      max(12px, env(safe-area-inset-right));
    inset-block-end: 0;
    z-index: 2147483639;
    inline-size: min(720px, calc(100vw - 24px));
    margin-inline: auto;
    max-block-size: min(88svh, 900px);
    overflow: auto;
    padding: var(--ahc-gap-lg)
      max(var(--ahc-gap-lg), env(safe-area-inset-right))
      max(var(--ahc-gap-lg), env(safe-area-inset-bottom))
      max(var(--ahc-gap-lg), env(safe-area-inset-left));
    border-start-start-radius: var(--ahc-radius-xl);
    border-start-end-radius: var(--ahc-radius-xl);
    border: 1px solid var(--ahc-border);
    background: linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.98),
      rgba(2, 6, 23, 0.98)
    );
    color: var(--ahc-text);
    box-shadow: 0 -24px 80px rgba(0, 0, 0, 0.46);
  }

  .ahc-filter-sheet__handle {
    inline-size: 72px;
    block-size: 5px;
    margin-inline: auto;
    margin-block-end: var(--ahc-gap-md);
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.5);
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
    background: linear-gradient(
      180deg,
      rgba(14, 165, 233, 0.24),
      rgba(37, 99, 235, 0.16)
    );
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
    background: linear-gradient(180deg, transparent, rgba(2, 6, 23, 0.95) 22%);
  }

  /* Empty/loading/error */
  .ahc-loading {
    display: grid;
    gap: var(--ahc-gap-lg);
    min-block-size: 420px;
    padding: var(--ahc-gap-lg);
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-md);
    background: linear-gradient(
      180deg,
      rgba(15, 23, 42, 0.64),
      rgba(2, 6, 23, 0.34)
    );
  }

  .ahc-loading__copy {
    text-align: center;
  }

  .ahc-loading__copy h3 {
    margin: 0 0 var(--ahc-gap-xs);
    color: var(--ahc-text);
  }

  .ahc-loading__copy p {
    margin: 0;
    color: var(--ahc-muted);
  }

  .ahc-loading__timeline {
    direction: ltr;
    display: grid;
    gap: var(--ahc-gap-md);
  }

  .ahc-loading__group {
    display: grid;
    gap: 10px;
    padding: var(--ahc-gap-md);
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: var(--ahc-radius-sm);
    background: rgba(15, 23, 42, 0.34);
  }

  .ahc-loading__group span,
  .ahc-loading__group i {
    display: block;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      rgba(148, 163, 184, 0.12),
      rgba(56, 189, 248, 0.22),
      rgba(148, 163, 184, 0.12)
    );
    animation: ahc-shimmer 1400ms ease-in-out infinite;
    animation-delay: calc(var(--delay, 0) * 90ms);
  }

  .ahc-loading__group span {
    inline-size: 120px;
    block-size: 16px;
  }

  .ahc-loading__group i {
    inline-size: var(--width, 48%);
    block-size: 12px;
  }

  @keyframes ahc-shimmer {
    0%,
    100% {
      opacity: 0.44;
    }
    50% {
      opacity: 1;
    }
  }

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

  .ahc-empty-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--ahc-gap-xs);
    margin-block-start: var(--ahc-gap-md);
  }

  .ahc-debug {
    display: block;
    justify-self: start;
    inline-size: fit-content;
    max-inline-size: 100%;
    gap: var(--ahc-gap-sm);
    padding: 0;
    border: 1px solid rgba(56, 189, 248, 0.24);
    border-radius: var(--ahc-radius-sm);
    background: rgba(2, 6, 23, 0.18);
    color: var(--ahc-muted);
    font-size: 0.78rem;
  }

  .ahc-debug summary {
    cursor: pointer;
    list-style: none;
  }

  .ahc-debug summary::-webkit-details-marker {
    display: none;
  }

  .ahc-debug[open] {
    display: grid;
    inline-size: 100%;
    padding: var(--ahc-gap-md);
    border-style: dashed;
    background: rgba(2, 6, 23, 0.32);
  }

  .ahc-debug__header {
    display: flex;
    justify-content: space-between;
    gap: var(--ahc-gap-sm);
    min-block-size: 32px;
    align-items: center;
    padding-block: 0;
    padding-inline: 10px;
    color: var(--ahc-text);
  }

  .ahc-debug[open] .ahc-debug__header {
    padding: 0;
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

  .ahc-entity-list {
    display: grid;
    gap: var(--ahc-gap-xs);
    max-block-size: 260px;
    overflow: auto;
  }

  .ahc-entity-list__item {
    display: grid;
    gap: 2px;
    min-block-size: 44px;
    padding-block: 7px;
    padding-inline: 12px;
    border: 1px solid var(--ahc-border-soft);
    border-radius: var(--ahc-radius-sm);
    background: rgba(15, 23, 42, 0.42);
  }

  .ahc-entity-list__item span {
    color: var(--ahc-text);
    font-weight: 750;
  }

  .ahc-entity-list__item small,
  .ahc-entity-list__more {
    color: var(--ahc-muted);
    font-size: 0.78rem;
  }

  /* Responsive */
  @media (max-width: 1100px) {
    :host {
      --ahc-label-width: 180px;
      --ahc-activity-label-width: 190px;
      --ahc-dashboard-label-width: 200px;
      --ahc-insights-width: 320px;
    }

    .ahc__body {
      grid-template-columns: minmax(0, 1fr);
    }

    .ahc__insights-panel {
      max-inline-size: none;
    }

    .ahc__insights {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .ahc__insights-title {
      grid-column: 1 / -1;
    }
  }

  @media (max-width: 900px) {
    :host {
      --ahc-label-width: 180px;
      --ahc-activity-label-width: 180px;
      --ahc-dashboard-label-width: 180px;
    }
  }

  @media (max-width: 760px) {
    :host {
      --ahc-chip-height: 44px;
      --ahc-label-width: 180px;
      --ahc-activity-label-width: 160px;
      --ahc-dashboard-label-width: 160px;
      --ahc-dashboard-row-height: 36px;
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
      padding: max(12px, env(safe-area-inset-top))
        max(12px, env(safe-area-inset-right))
        max(12px, env(safe-area-inset-bottom))
        max(12px, env(safe-area-inset-left));
    }

    .ahc__topbar {
      flex-direction: column;
      align-items: stretch;
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
      flex-wrap: wrap;
      min-inline-size: 0;
    }

    .ahc__search {
      inline-size: 100%;
    }

    .ahc__filters {
      display: grid;
      gap: var(--ahc-gap-xs);
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

    .ahc-curation-note {
      max-inline-size: 72vw;
    }

    .ahc__filter-label {
      min-inline-size: max-content;
    }

    .ahc__summary-grid {
      display: flex;
      overflow-x: auto;
      scroll-snap-type: x proximity;
      gap: var(--ahc-gap-sm);
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      scrollbar-width: none;
    }

    .ahc__summary-grid::-webkit-scrollbar {
      display: none;
    }

    .ahc__metric {
      flex: 0 0 min(44vw, 230px);
      scroll-snap-align: start;
      min-block-size: 104px;
      grid-template-columns: minmax(0, 1fr) auto;
      padding: var(--ahc-gap-sm);
      border: 1px solid var(--ahc-border-soft);
      border-radius: var(--ahc-radius-md);
      background: linear-gradient(
        180deg,
        rgba(30, 41, 59, 0.54),
        rgba(15, 23, 42, 0.58)
      );
    }

    .ahc__metric-icon {
      inline-size: 44px;
      block-size: 44px;
      border-radius: 14px;
    }

    .ahc__insights {
      display: flex;
      overflow-x: auto;
      padding: 0;
      border: 0;
      background: transparent;
      scrollbar-width: none;
    }

    .ahc__insights::-webkit-scrollbar {
      display: none;
    }

    .ahc__insights-title {
      display: none;
    }

    .ahc__insight-card {
      flex: 0 0 min(78vw, 280px);
    }

    .ahc-activity {
      padding: var(--ahc-gap-sm);
    }

    .ahc-activity__header,
    .ahc-activity-group__header {
      align-items: stretch;
      flex-direction: column;
    }

    .ahc-activity__range,
    .ahc-activity-group__meta {
      align-self: start;
    }

    .ahc-activity__axis {
      margin-inline-end: var(--ahc-activity-label-width);
    }

    .ahc-activity-row {
      grid-template-columns: minmax(260px, 1fr) var(--ahc-activity-label-width);
      gap: var(--ahc-gap-xs);
    }

    .ahc-activity-group {
      overflow-x: auto;
    }

    .ahc-dashboard {
      padding: var(--ahc-gap-sm);
    }

    .ahc-dashboard__header,
    .ahc-dashboard-group__header {
      align-items: stretch;
      flex-direction: column;
    }

    .ahc-area-card__actions {
      justify-content: space-between;
    }

    .ahc-dashboard__range-pill,
    .ahc-dashboard-group__meta {
      align-self: start;
    }

    .ahc-dashboard__axis {
      margin-inline-start: calc(var(--ahc-dashboard-label-width) + 8px);
      margin-inline-end: 56px;
    }

    .ahc-dashboard-row {
      grid-template-columns: var(--ahc-dashboard-label-width) minmax(180px, 1fr);
      gap: 8px;
      padding-inline: 0;
    }

    .ahc-area-inventory__chips {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      padding-block-end: 2px;
      scrollbar-width: none;
    }

    .ahc-area-inventory__chips::-webkit-scrollbar {
      display: none;
    }

    .ahc-inventory-chip {
      flex: 0 0 min(72vw, 230px);
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
      background: linear-gradient(
        180deg,
        rgba(30, 41, 59, 0.48),
        rgba(15, 23, 42, 0.58)
      );
    }

    .ahc-group__header {
      position: static;
      min-block-size: 64px;
    }

    .ahc-timeline__axis,
    .ahc-row {
      grid-template-columns: minmax(560px, 1fr) var(--ahc-label-width);
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
      border-radius: 24px;
    }

    .ahc-filter-sheet {
      inset-inline: max(10px, env(safe-area-inset-left))
        max(10px, env(safe-area-inset-right));
      inline-size: auto;
      max-block-size: min(86svh, 820px);
      border-start-start-radius: 28px;
      border-start-end-radius: 28px;
    }

    .ahc-filter-section__chips {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .ahc-filter-section__chips::-webkit-scrollbar {
      display: none;
    }

    .ahc-filter-section__chips > * {
      flex: 0 0 auto;
    }
  }

  @media (max-width: 600px) {
    :host {
      --ahc-label-width: 150px;
      --ahc-activity-label-width: 145px;
      --ahc-dashboard-label-width: 150px;
      --ahc-dashboard-row-height: 34px;
    }
  }

  @media (max-width: 420px) {
    :host {
      --ahc-label-width: 130px;
      --ahc-activity-label-width: 132px;
      --ahc-dashboard-label-width: 130px;
    }

    .ahc__summary-grid {
      margin-inline: -2px;
    }

    .ahc__metric-value {
      font-size: 1.32rem;
    }

    .ahc-timeline__axis,
    .ahc-row {
      grid-template-columns: minmax(540px, 1fr) var(--ahc-label-width);
    }

    .ahc-row__name {
      font-size: 0.8rem;
    }

    .ahc-row__state-chip {
      display: none;
    }

    .ahc-activity-row__name {
      font-size: 0.78rem;
    }

    .ahc-activity__density-strip {
      grid-auto-columns: minmax(4px, 1fr);
      gap: 2px;
    }

    .ahc-dashboard-row {
      grid-template-columns: var(--ahc-dashboard-label-width) minmax(150px, 1fr);
    }

    .ahc-dashboard-row__label span {
      display: none;
    }

    .ahc-dashboard-row__meta strong {
      font-size: 0.74rem;
    }

    .ahc-inventory-chip {
      flex-basis: min(78vw, 210px);
    }
  }

  /* Mockup 05 compact dashboard shell */
  .ahc__hero {
    min-block-size: 72px;
    max-block-size: 96px;
  }

  .ahc__hero.ahc__topbar {
    align-items: center;
    padding-block: 10px;
    padding-inline: 14px;
  }

  .ahc__hero .ahc__title-block {
    justify-items: start;
  }

  .ahc__hero-actions {
    justify-content: flex-start;
    min-inline-size: 0;
  }

  .ahc__hero-actions .ahc__button {
    min-block-size: 38px;
    padding-inline: 12px;
  }

  .ahc__toolbar.ahc__filters {
    display: flex;
    align-items: center;
    max-block-size: 58px;
    min-block-size: 58px;
    padding: 8px 10px;
  }

  .ahc__toolbar .ahc__filter-row {
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
  }

  .ahc__toolbar .ahc__filter-row::-webkit-scrollbar {
    display: none;
  }

  .ahc__toolbar .ahc__filter-row > * {
    flex: 0 0 auto;
  }

  .ahc__toolbar .ahc__search {
    inline-size: min(320px, 25vw);
  }

  .ahc__toolbar .ahc-curation-note {
    max-inline-size: min(320px, 24vw);
  }

  .ahc__toolbar .ahc__chip,
  .ahc__toolbar .ahc__button,
  .ahc__toolbar .ahc__segmented-button {
    min-block-size: 40px;
  }

  .ahc__summary-strip {
    min-block-size: 82px;
    max-block-size: 88px;
  }

  .ahc__summary-strip .ahc__metric {
    min-block-size: 82px;
    padding-block: 10px;
    padding-inline: 14px;
  }

  .ahc--panel .ahc__body,
  .ahc--fullscreen .ahc__body {
    min-block-size: 0;
    block-size: 100%;
  }

  .ahc__main {
    block-size: 100%;
    direction: rtl;
    overflow: hidden;
  }

  .ahc[dir="rtl"] .ahc__main {
    grid-column: 1;
  }

  .ahc[dir="rtl"] .ahc__insights-panel {
    grid-column: 2;
  }

  .ahc[dir="ltr"] .ahc__main {
    grid-column: 1;
  }

  .ahc[dir="ltr"] .ahc__insights-panel {
    grid-column: 2;
  }

  .ahc .ahc__body--no-insights .ahc__main {
    grid-column: 1;
  }

  .ahc__insights-panel {
    align-self: stretch;
    direction: rtl;
    max-inline-size: var(--ahc-insights-width);
    min-block-size: 0;
    overflow: hidden;
  }

  .ahc__insights-panel > .ahc__insights {
    block-size: 100%;
    max-block-size: 100%;
    overflow: auto;
  }

  .ahc__insights-panel .ahc__insight-card {
    min-block-size: 112px;
  }

  .ahc-dashboard {
    grid-template-rows: auto auto minmax(0, 1fr);
    block-size: var(--ahc-dashboard-height, 100%);
    min-block-size: min(520px, 62svh);
    max-block-size: 100%;
    padding: 0;
    gap: 0;
    background:
      linear-gradient(180deg, rgba(30, 41, 59, 0.44), rgba(2, 6, 23, 0.28)),
      rgba(15, 23, 42, 0.5);
  }

  .ahc-dashboard__header {
    min-block-size: 48px;
    padding-block: 8px;
    padding-inline: 14px;
    border-block-end: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ahc-dashboard__title-block h3 {
    font-size: 0.98rem;
  }

  .ahc-dashboard__range-pill {
    min-block-size: 32px;
    border-radius: 8px;
  }

  .ahc-dashboard__density {
    display: grid;
    grid-template-rows: minmax(0, 1fr) 12px;
    gap: 2px;
    block-size: 42px;
    min-block-size: 42px;
    padding-block: 5px 3px;
    padding-inline: 14px calc(var(--ahc-dashboard-label-width) + 14px);
    border: 0;
    border-block-end: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 0;
    background: rgba(2, 6, 23, 0.18);
  }

  .ahc-dashboard__density-bars {
    direction: ltr;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(5px, 1fr));
    align-items: end;
    gap: 4px;
    min-block-size: 0;
  }

  .ahc-dashboard-density-bucket {
    display: flex;
    align-items: end;
    block-size: 24px;
    min-inline-size: 0;
    border-radius: 5px;
    background: rgba(148, 163, 184, 0.026);
  }

  .ahc-dashboard-density-fill {
    inline-size: 100%;
    max-block-size: 22px;
    border-radius: 6px 6px 2px 2px;
    background: linear-gradient(180deg, #93c5fd 0%, #38bdf8 48%, #22c55e 100%);
    opacity: 0.18;
  }

  .ahc-dashboard-density-bucket[data-active="true"]
    .ahc-dashboard-density-fill {
    block-size: max(4px, calc(var(--intensity, 0) * 22px));
    opacity: max(0.44, calc(var(--intensity, 0) * 0.98));
    box-shadow: 0 0 14px rgba(56, 189, 248, 0.18);
  }

  .ahc-dashboard__density-labels {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    color: color-mix(in srgb, var(--ahc-muted) 78%, transparent 22%);
    font-size: 0.68rem;
    line-height: 1;
  }

  .ahc-dashboard__timeline {
    min-inline-size: 0;
    min-block-size: 0;
    display: grid;
    grid-template-rows: 31px minmax(0, 1fr);
    overflow: hidden;
  }

  .ahc-dashboard__axis {
    margin-inline-start: 0;
    margin-inline-end: calc(var(--ahc-dashboard-label-width) + 12px);
    min-block-size: 31px;
    border-block-end: 1px solid rgba(148, 163, 184, 0.12);
    background: rgba(15, 23, 42, 0.5);
  }

  .ahc-dashboard__tick {
    min-inline-size: 48px;
    font-size: 0.72rem;
  }

  .ahc-dashboard__scroll {
    min-inline-size: 0;
    min-block-size: 0;
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-color: rgba(56, 189, 248, 0.48) rgba(15, 23, 42, 0.24);
  }

  .ahc-dashboard__groups {
    display: contents;
  }

  .ahc-dashboard-group,
  .ahc-area-card {
    display: grid;
    gap: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: transparent;
    box-shadow: none;
    overflow: visible;
  }

  .ahc-dashboard-group + .ahc-dashboard-group {
    border-block-start: 1px solid rgba(148, 163, 184, 0.14);
  }

  .ahc-dashboard-group__header,
  .ahc-area-card__header {
    min-block-size: var(--ahc-dashboard-group-header-height);
    padding-block: 0;
    padding-inline: 14px;
    background: linear-gradient(
      90deg,
      rgba(15, 23, 42, 0.84),
      rgba(30, 41, 59, 0.46)
    );
  }

  .ahc-dashboard-group__title,
  .ahc-area-card__title {
    min-inline-size: 0;
  }

  .ahc-area-card__title-copy strong {
    font-size: 0.94rem;
  }

  .ahc-area-card__title-copy span {
    font-size: 0.74rem;
  }

  .ahc-area-card__meta {
    min-inline-size: max-content;
    font-size: 0.72rem;
  }

  .ahc-area-card__inventory-button,
  .ahc-area-inventory__more {
    min-block-size: 32px;
    border-radius: 8px;
  }

  .ahc-dashboard-group__aggregate,
  .ahc-area-card__aggregate {
    min-block-size: 18px;
    margin-inline: 14px calc(var(--ahc-dashboard-label-width) + 12px);
    border-radius: 0;
    background-image: linear-gradient(
      to right,
      rgba(148, 163, 184, 0.055) 1px,
      transparent 1px
    );
    background-color: transparent;
    background-size: calc(100% / 8) 100%;
  }

  .ahc-dashboard-group__body,
  .ahc-area-card__content {
    display: grid;
    gap: 0;
    min-inline-size: 0;
  }

  .ahc-dashboard-group__rows {
    display: grid;
    gap: 0;
  }

  .ahc-dashboard-row {
    direction: ltr;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ahc-dashboard-label-width);
    gap: 12px;
    min-block-size: var(--ahc-dashboard-row-height);
    padding-block: 0;
    padding-inline: 14px;
    border-radius: 0;
    border-block-start: 1px solid rgba(148, 163, 184, 0.07);
  }

  .ahc-dashboard-row__plot {
    grid-column: 1;
    direction: ltr;
    min-block-size: var(--ahc-dashboard-row-height);
    border-radius: 0;
    background-image: linear-gradient(
      to right,
      rgba(148, 163, 184, 0.055) 1px,
      transparent 1px
    );
    background-color: transparent;
    background-size: calc(100% / 8) 100%;
  }

  .ahc-dashboard-row__plot::before {
    display: none;
  }

  .ahc-dashboard-row__label {
    grid-column: 2;
    direction: rtl;
    align-self: stretch;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
    gap: 8px;
    padding-inline: 0;
    min-inline-size: 0;
    border-inline-start: 1px solid rgba(148, 163, 184, 0.1);
  }

  .ahc-dashboard-row__label strong,
  .ahc-dashboard-row__label span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ahc-dashboard-row__label strong {
    font-size: 0.82rem;
  }

  .ahc-dashboard-row__inline-meta,
  .ahc-dashboard-row__meta {
    display: none;
  }

  .ahc-dashboard-segment {
    block-size: var(--ahc-dashboard-segment-height);
    min-inline-size: 0;
    border: 0;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      0 4px 14px rgba(0, 0, 0, 0.2);
  }

  .ahc-dashboard-segment--min {
    min-inline-size: var(--ahc-dashboard-segment-min-width);
  }

  .ahc-dashboard-segment--aggregate {
    block-size: 8px;
    opacity: 0.64;
  }

  .ahc-dashboard-group__more {
    margin: 0;
    padding-block: 5px 8px;
    padding-inline: 14px calc(var(--ahc-dashboard-label-width) + 26px);
    color: var(--ahc-muted);
    font-size: 0.74rem;
  }

  .ahc-area-card__quiet {
    min-block-size: 42px;
    margin-inline: 14px;
    border-radius: 8px;
  }

  .ahc-area-inventory {
    max-block-size: 120px;
    overflow: auto;
    margin: 8px 14px 12px;
    padding: 8px;
    border-radius: 8px;
    background: rgba(2, 6, 23, 0.28);
  }

  .ahc-area-inventory__header {
    min-block-size: 22px;
    font-size: 0.76rem;
  }

  .ahc-area-inventory__groups {
    gap: 6px;
  }

  .ahc-area-inventory__chips {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 6px;
  }

  .ahc-inventory-chip {
    min-block-size: 40px;
    padding-block: 5px;
    padding-inline: 7px;
    border-radius: 8px;
  }

  .ahc-inventory-chip .ahc-dashboard-icon {
    inline-size: 24px;
    block-size: 24px;
  }

  .ahc-inventory-chip__copy strong {
    font-size: 0.76rem;
  }

  .ahc-inventory-chip__copy small {
    font-size: 0.68rem;
  }

  @media (max-width: 1100px) {
    .ahc__insights-panel {
      display: none;
    }
  }

  @media (max-width: 760px) {
    :host {
      --ahc-dashboard-label-width: 156px;
      --ahc-dashboard-row-height: 36px;
    }

    .ahc,
    .ahc--panel,
    .ahc--fullscreen {
      grid-template-rows: auto auto auto minmax(0, 1fr);
      block-size: auto;
      min-block-size: 100svh;
    }

    .ahc__hero {
      max-block-size: none;
    }

    .ahc__hero.ahc__topbar {
      align-items: stretch;
      gap: 10px;
    }

    .ahc__hero-actions {
      justify-content: center;
      flex-wrap: nowrap;
      overflow-x: auto;
    }

    .ahc__toolbar.ahc__filters {
      max-block-size: none;
      min-block-size: 0;
      padding: 0;
      border: 0;
      background: transparent;
    }

    .ahc__toolbar .ahc__search {
      inline-size: min(86vw, 420px);
    }

    .ahc__summary-strip {
      display: flex;
      max-block-size: none;
    }

    .ahc__body {
      min-block-size: 0;
    }

    .ahc__main {
      overflow: visible;
    }

    .ahc-dashboard {
      min-block-size: 560px;
      block-size: auto;
    }

    .ahc-dashboard__density {
      padding-inline: 10px calc(var(--ahc-dashboard-label-width) + 10px);
    }

    .ahc-dashboard__axis {
      margin-inline-end: calc(var(--ahc-dashboard-label-width) + 10px);
    }

    .ahc-dashboard__scroll {
      max-block-size: min(66svh, 720px);
    }

    .ahc-dashboard-row {
      grid-template-columns: minmax(360px, 1fr) var(--ahc-dashboard-label-width);
      min-inline-size: calc(360px + var(--ahc-dashboard-label-width) + 32px);
      padding-inline: 10px;
    }

    .ahc-dashboard-group__aggregate,
    .ahc-area-card__aggregate {
      min-inline-size: 360px;
      margin-inline: 10px calc(var(--ahc-dashboard-label-width) + 10px);
    }

    .ahc-dashboard-row__label span {
      display: block;
    }

    .ahc-area-inventory {
      max-block-size: 150px;
      margin-inline: 10px;
    }

    .ahc-area-inventory__chips {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .ahc-inventory-chip {
      flex: 0 0 min(72vw, 230px);
    }
  }

  @media (max-width: 420px) {
    :host {
      --ahc-dashboard-label-width: 142px;
    }

    .ahc-dashboard-row {
      grid-template-columns: minmax(320px, 1fr) var(--ahc-dashboard-label-width);
      min-inline-size: calc(320px + var(--ahc-dashboard-label-width) + 28px);
    }

    .ahc-dashboard-row__label span {
      display: block;
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

  .ahc--dense .ahc-row__name {
    font-size: 0.78rem;
  }

  .ahc--ultra-dense .ahc-row,
  .ahc-timeline-card--ultra-dense .ahc-row {
    min-block-size: 24px;
  }

  .ahc--ultra-dense .ahc-row__track,
  .ahc-timeline-card--ultra-dense .ahc-row__track {
    min-block-size: 24px;
  }

  .ahc--ultra-dense .ahc-row__state-chip,
  .ahc-timeline-card--ultra-dense .ahc-row__state-chip {
    display: none;
  }

  .ahc--ultra-dense .ahc-row__name,
  .ahc-timeline-card--ultra-dense .ahc-row__name {
    font-size: 0.74rem;
  }
`;
function en(t, e = !1) {
  const a = t.view_mode ?? t.default_view ?? b.view_mode;
  return a === "activity_legacy" ? "activity_legacy" : a === "legacy_swimlane" || a === "swimlane" || t.timeline_style === "legacy" ? "legacy_swimlane" : a === "heatmap" ? "heatmap" : a === "detail" ? "detail" : a === "correlation" ? "correlation" : "activity";
}
class tn extends N {
  constructor() {
    super(...arguments), this._config = {
      type: "custom:activity-history-card"
    }, this._areas = [], this._labels = [], this._domains = Q, this._loadedOptions = !1;
  }
  static {
    this.styles = et`
    :host {
      display: block;
      color: var(--primary-text-color, #e5e7eb);
      font-family: var(
        --primary-font-family,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        Roboto,
        Arial,
        sans-serif
      );
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
      background: color-mix(
        in srgb,
        var(--card-background-color, #111827) 88%,
        transparent
      );
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
      hours_to_show: e.hours_to_show ?? b.hours_to_show,
      display_mode: e.display_mode ?? b.display_mode,
      view_mode: e.view_mode ?? b.view_mode,
      group_by: e.group_by ?? b.group_by,
      show_area_inventory: e.show_area_inventory ?? b.show_area_inventory,
      area_inventory_mode: e.area_inventory_mode ?? b.area_inventory_mode,
      area_inventory_max_items: e.area_inventory_max_items ?? b.area_inventory_max_items
    }, this.requestUpdate();
  }
  set hass(e) {
    this._hass = e, this._loadedOptions || (this._loadedOptions = !0, this._loadOptions());
  }
  render() {
    const e = this._config, a = e.domains?.length ? e.domains : Q;
    return h`
      <div class="editor">
        <section class="section">
          <h3>הגדרות כלליות</h3>
          <div class="row">
            <label>
              כותרת
              <input
                type="text"
                .value=${e.title ?? b.title}
                @input=${(i) => this._setValue("title", C(i))}
              />
            </label>
            <label>
              טווח שעות
              <input
                type="number"
                min="1"
                max="168"
                .value=${String(e.hours_to_show ?? 24)}
                @input=${(i) => this._setNumber("hours_to_show", C(i))}
              />
            </label>
          </div>
          <div class="row">
            <label>
              מצב תצוגה
              <select
                .value=${e.display_mode ?? "panel"}
                @change=${(i) => this._setValue(
      "display_mode",
      C(i)
    )}
              >
                <option value="card">כרטיס רגיל</option>
                <option value="panel">פאנל</option>
                <option value="fullscreen">מסך מלא</option>
              </select>
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.mock_data === !0}
                @change=${(i) => this._setChecked("mock_data", i)}
              />
              נתוני דוגמה
            </label>
          </div>
          <div class="row">
            <label>
              תצוגת ציר זמן
              <select
                .value=${e.view_mode ?? b.view_mode}
                @change=${(i) => this._setValue("view_mode", C(i))}
              >
                <option value="activity">Activity dashboard</option>
                <option value="activity_legacy">Activity legacy</option>
                <option value="legacy_swimlane">Legacy swimlane / debug</option>
                <option value="heatmap">Heatmap placeholder</option>
                <option value="detail">Detail placeholder</option>
                <option value="correlation">Correlation placeholder</option>
              </select>
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.show_activity_density !== !1}
                @change=${(i) => this._setChecked("show_activity_density", i)}
              />
              הצג פס צפיפות פעילות
            </label>
          </div>
          <label class="check">
            <input
              type="checkbox"
              .checked=${e.debug === !0}
              @change=${(i) => this._setChecked("debug", i)}
            />
            הצג דיאגנוסטיקה
          </label>
          <label class="check">
            <input
              type="checkbox"
              .checked=${e.auto_discover !== !1}
              @change=${(i) => this._setChecked("auto_discover", i)}
            />
            משוך אוטומטית רכיבים שמשויכים לאזורים
          </label>
          <p class="hint">
            כאשר האפשרות פעילה ואין רשימת entities ידנית, הכרטיס מאתר ישויות לפי
            אזורי Home Assistant ומסנן לפי הדומיינים והלייבלים שבחרת.
          </p>
        </section>

        <section class="section">
          <h3>מלאי אביזרים לפי אזור</h3>
          <div class="row">
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.show_area_inventory !== !1}
                @change=${(i) => this._setChecked("show_area_inventory", i)}
              />
              הצג אביזרים בכל אזור
            </label>
            <label>
              מצב מלאי
              <select
                .value=${e.area_inventory_mode ?? b.area_inventory_mode}
                @change=${(i) => this._setValue(
      "area_inventory_mode",
      C(i)
    )}
              >
                <option value="compact">קומפקטי</option>
                <option value="expanded">פתוח</option>
                <option value="off">כבוי</option>
              </select>
            </label>
          </div>
          <div class="row">
            <label>
              אביזרים לפני “עוד”
              <input
                type="number"
                min="1"
                max="80"
                .value=${String(
      e.area_inventory_max_items ?? b.area_inventory_max_items
    )}
                @input=${(i) => this._setNumber(
      "area_inventory_max_items",
      C(i)
    )}
              />
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.area_inventory_include_inactive !== !1}
                @change=${(i) => this._setChecked("area_inventory_include_inactive", i)}
              />
              כלול אביזרים שלא פעלו
            </label>
          </div>
          <div class="check-grid">
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.area_inventory_group_by_domain !== !1}
                @change=${(i) => this._setChecked("area_inventory_group_by_domain", i)}
              />
              קבץ לפי סוג
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.area_inventory_show_state !== !1}
                @change=${(i) => this._setChecked("area_inventory_show_state", i)}
              />
              הצג מצב נוכחי
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.area_inventory_show_last_activity !== !1}
                @change=${(i) => this._setChecked("area_inventory_show_last_activity", i)}
              />
              הצג משך פעילות
            </label>
          </div>
          <p class="hint">
            ציר הזמן נשאר נקי ומציג רק פעילות משמעותית; מלאי האביזרים מציג גם
            מפסקים ותאורות שלא פעלו בטווח כדי שתוכל לזהות מה קיים בכל אזור.
          </p>
        </section>

        <section class="section">
          <h3>סינון חכם</h3>
          <div class="row">
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.smart_filter !== !1}
                @change=${(i) => this._setChecked("smart_filter", i)}
              />
              הסתר רעש אוטומטית
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.hide_empty_rows !== !1}
                @change=${(i) => this._setChecked("hide_empty_rows", i)}
              />
              הסתר שורות ללא פעילות
            </label>
          </div>
          <div class="row">
            <label>
              מצב פעילות
              <select
                .value=${e.activity_mode ?? b.activity_mode}
                @change=${(i) => this._setValue(
      "activity_mode",
      C(i)
    )}
              >
                <option value="meaningful">פעילות משמעותית</option>
                <option value="all">כל הרכיבים</option>
              </select>
            </label>
            <label>
              מינימום פעילות בשניות
              <input
                type="number"
                min="0"
                max="3600"
                .value=${String(
      e.min_row_active_seconds ?? b.min_row_active_seconds
    )}
                @input=${(i) => this._setNumber("min_row_active_seconds", C(i))}
              />
            </label>
            <label>
              מקסימום שורות לקבוצה
              <input
                type="number"
                min="1"
                max="60"
                .value=${String(
      e.max_rows_per_group ?? b.max_rows_per_group
    )}
                @input=${(i) => this._setNumber("max_rows_per_group", C(i))}
              />
            </label>
            <label>
              מקסימום שורות כולל
              <input
                type="number"
                min="1"
                max="200"
                .value=${String(
      e.max_total_rows ?? b.max_total_rows
    )}
                @input=${(i) => this._setNumber("max_total_rows", C(i))}
              />
            </label>
          </div>
          <div class="check-grid">
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.show_technical_entities === !0}
                @change=${(i) => this._setChecked("show_technical_entities", i)}
              />
              הצג רכיבים טכניים
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.show_config_entities === !0}
                @change=${(i) => this._setChecked("show_config_entities", i)}
              />
              הצג ישויות הגדרה
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.show_diagnostic_entities === !0}
                @change=${(i) => this._setChecked("show_diagnostic_entities", i)}
              />
              הצג ישויות אבחון
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.show_inactive_baselines === !0}
                @change=${(i) => this._setChecked("show_inactive_baselines", i)}
              />
              הצג גם קווי בסיס כבויים
            </label>
          </div>
          <p class="hint">
            ברירת המחדל מסתירה שורות ריקות, רכיבי אבחון, אפשרויות תוכנית ורעש
            כמו נתבים/חיבור/עדכונים. רכיבים שהוגדרו ידנית ב-YAML לא מוסתרים
            אוטומטית.
          </p>
        </section>

        <section class="section">
          <h3>דומיינים להצגה</h3>
          <div class="check-grid">
            ${this._domains.map(
      (i) => this._renderArrayCheckbox(
        "domains",
        i,
        M[i] ?? i,
        a.includes(i)
      )
    )}
          </div>
          <p class="hint">
            אם לא תבחר ידנית, הכרטיס משתמש בדומיינים שימושיים לפעילות כמו תאורה,
            מתגים, מזגנים, נגני מדיה, תריסים ומאווררים.
          </p>
        </section>

        <section class="section">
          <h3>אזורים</h3>
          ${this._areas.length ? h`<div class="check-grid">
                ${this._areas.map(
      (i) => this._renderArrayCheckbox(
        "areas",
        i.name,
        i.name,
        (e.areas ?? []).includes(i.name) || (e.areas ?? []).includes(i.area_id)
      )
    )}
              </div>` : h`<p class="hint">
                לא נטענו אזורים מה־registry. אפשר עדיין לערוך YAML ידנית.
              </p>`}
          <p class="hint">
            אם לא נבחר אזור, יוצגו כל האזורים שיש להם רכיבים מתאימים.
          </p>
        </section>

        <section class="section">
          <h3>לייבלים</h3>
          ${this._labels.length ? this._renderLabelControls(e) : h`<p class="hint">
                לא נמצאו labels ב־Home Assistant, או שהגרסה לא תומכת ב־label
                registry.
              </p>`}
        </section>
      </div>
    `;
  }
  _renderLabelControls(e) {
    return h`
      <p class="hint">
        בחר labels להצגה או להסתרה. הסתרה גוברת על הצגה, כך שאפשר למשל להסתיר
        "לא להצגה" או "רכיבים מוגנים".
      </p>
      <h3>הצג רק labels אלה</h3>
      <div class="check-grid">
        ${this._labels.map(
      (a) => this._renderArrayCheckbox(
        "include_labels",
        a.name,
        a.name,
        (e.include_labels ?? []).includes(a.name) || (e.include_labels ?? []).includes(a.label_id)
      )
    )}
      </div>
      <h3>הסתר labels אלה</h3>
      <div class="check-grid">
        ${this._labels.map(
      (a) => this._renderArrayCheckbox(
        "exclude_labels",
        a.name,
        a.name,
        (e.exclude_labels ?? []).includes(a.name) || (e.exclude_labels ?? []).includes(a.label_id)
      )
    )}
      </div>
    `;
  }
  _renderArrayCheckbox(e, a, i, n) {
    return h`
      <label class="check">
        <input
          type="checkbox"
          .checked=${n}
          @change=${(s) => this._toggleArrayValue(e, a, s)}
        />
        ${i}
      </label>
    `;
  }
  async _loadOptions() {
    if (!this._hass) return;
    const [e, a] = await Promise.all([
      this._safeRegistryCall("config/area_registry/list"),
      this._safeRegistryCall("config/label_registry/list")
    ]), i = [
      ...new Set(Object.keys(this._hass.states).map(U))
    ].filter(Boolean).sort();
    this._areas = e.sort((n, s) => n.name.localeCompare(s.name, "he")), this._labels = a.sort((n, s) => n.name.localeCompare(s.name, "he")), this._domains = [
      .../* @__PURE__ */ new Set([...Q, ...i])
    ].sort(), this.requestUpdate();
  }
  async _safeRegistryCall(e) {
    try {
      const a = await this._hass?.callWS({ type: e });
      return Array.isArray(a) ? a : [];
    } catch {
      return [];
    }
  }
  _setValue(e, a) {
    this._emitConfig({ ...this._config, [e]: a });
  }
  _setNumber(e, a) {
    const i = Number(a);
    Number.isFinite(i) && (e === "hours_to_show" && i <= 0 || e !== "hours_to_show" && i < 0 || this._emitConfig({ ...this._config, [e]: i }));
  }
  _setChecked(e, a) {
    const i = a.target.checked;
    this._emitConfig({ ...this._config, [e]: i });
  }
  _toggleArrayValue(e, a, i) {
    const n = i.target.checked, s = new Set(this._config[e] ?? []);
    n ? s.add(a) : s.delete(a);
    const r = [...s];
    this._emitConfig({
      ...this._config,
      [e]: r.length ? r : void 0
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
function C(t) {
  return t.target.value;
}
customElements.get("activity-history-card-editor") || customElements.define(
  "activity-history-card-editor",
  tn
);
class an extends N {
  constructor() {
    super(...arguments), this._rows = [], this._visibleRows = [], this._groups = [], this._loading = !1, this._fullscreen = !1, this._filterSheetOpen = !1, this._usingMockData = !1, this._showAllRows = !1, this._debugLegacyView = !1, this._expandedInventoryGroups = /* @__PURE__ */ new Set(), this._collapsedInventoryGroups = /* @__PURE__ */ new Set(), this._fetchToken = 0, this._lastFetchKey = "", this._hasFetchedOnce = !1, this._initialLoad = !1, this._backgroundLoading = !1, this._lastResolvedEntityKey = "", this._lastHistoryFetchAt = 0, this._historyCache = /* @__PURE__ */ new Map(), this._filter = {
      search: "",
      areas: [],
      domains: [],
      stateMode: "all",
      groupBy: "area",
      timePreset: "24h"
    }, this._openSegmentPopover = (e, a, i) => {
      e.preventDefault(), e.stopPropagation();
      const n = this._visibleRows.find((l) => l.entity.entity_id === a) ?? this._rows.find((l) => l.entity.entity_id === a), s = n?.segments[i], r = e.currentTarget instanceof Element ? e.currentTarget : void 0;
      if (!n || !s || !r) return;
      const c = r.getBoundingClientRect(), o = fi(c, {
        width: window.innerWidth,
        height: window.innerHeight
      });
      this._segmentPopover = {
        row: n,
        segment: s,
        x: o.x,
        y: o.y,
        placement: o.placement
      }, document.addEventListener("pointerdown", this._onDocumentPointerDown), document.addEventListener("keydown", this._onDocumentKeyDown), this.requestUpdate();
    }, this._closeSegmentPopover = () => {
      this._segmentPopover = void 0, document.removeEventListener("pointerdown", this._onDocumentPointerDown), !this._fullscreen && !this._filterSheetOpen && document.removeEventListener("keydown", this._onDocumentKeyDown), this.requestUpdate();
    }, this._openFilterSheet = () => {
      this._filterSheetOpen = !0, document.addEventListener("keydown", this._onDocumentKeyDown), this.requestUpdate();
    }, this._closeFilterSheet = () => {
      this._filterSheetOpen = !1, this._fullscreen || document.removeEventListener("keydown", this._onDocumentKeyDown), this.requestUpdate();
    }, this._onSearchInput = (e) => {
      const a = e.target;
      this._filter = { ...this._filter, search: a.value }, this._rebuildGroups();
    }, this._clearFilters = () => {
      const e = this._filter.timePreset, a = this._initialTimePreset(this._config);
      this._showAllRows = !1, this._expandedInventoryGroups.clear(), this._collapsedInventoryGroups.clear(), this._filter = {
        search: "",
        areas: [],
        domains: [],
        stateMode: "all",
        groupBy: this._config.group_by ?? "area",
        timePreset: a
      }, this._rebuildGroups(), e !== a && (this._lastFetchKey = "", this._requestHistoryRefresh("range", { force: !0 }));
    }, this._toggleShowAllRows = () => {
      this._showAllRows = !this._showAllRows, this._expandedInventoryGroups.clear(), this._collapsedInventoryGroups.clear(), this._rebuildGroups();
    }, this._toggleDebugLegacyView = () => {
      this._config.debug && (this._debugLegacyView = !this._debugLegacyView, this._rebuildGroups());
    }, this._toggleInventoryGroup = (e) => {
      const a = this._isInventoryGroupDefaultExpanded();
      this._collapsedInventoryGroups.has(e) ? (this._collapsedInventoryGroups.delete(e), this._expandedInventoryGroups.add(e)) : a || this._expandedInventoryGroups.has(e) ? (this._expandedInventoryGroups.delete(e), this._collapsedInventoryGroups.add(e)) : this._expandedInventoryGroups.add(e), this.requestUpdate();
    }, this._openInventoryMoreInfo = (e, a) => {
      e.stopPropagation(), this.dispatchEvent(si(a));
    }, this._manualRefresh = () => {
      this._historyCache.clear(), this._lastFetchKey = "", this._requestHistoryRefresh("manual", { force: !0 });
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
        document.removeEventListener(
          "fullscreenchange",
          this._onFullscreenChange
        ), this._filterSheetOpen || document.removeEventListener("keydown", this._onDocumentKeyDown), document.fullscreenElement && await document.exitFullscreen().catch(() => {
        });
      this.requestUpdate();
    }, this._onDocumentKeyDown = (e) => {
      if (e.key === "Escape") {
        if (this._segmentPopover) {
          this._closeSegmentPopover();
          return;
        }
        if (this._filterSheetOpen) {
          this._closeFilterSheet();
          return;
        }
        this._fullscreen && this._toggleFullscreen();
      }
    }, this._onDocumentPointerDown = (e) => {
      e.composedPath().some(
        (i) => i instanceof HTMLElement && i.classList.contains("ahc-popover")
      ) || this._segmentPopover && this._closeSegmentPopover();
    }, this._onFullscreenChange = () => {
      !document.fullscreenElement && this._fullscreen && (this._fullscreen = !1, document.removeEventListener(
        "fullscreenchange",
        this._onFullscreenChange
      ), this._filterSheetOpen || document.removeEventListener("keydown", this._onDocumentKeyDown), this.requestUpdate());
    };
  }
  static {
    this.styles = Qi;
  }
  static getConfigElement() {
    return document.createElement("activity-history-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:activity-history-card",
      title: b.title,
      auto_discover: !0,
      display_mode: "panel",
      view_mode: "activity",
      hours_to_show: 24,
      group_by: "area"
    };
  }
  setConfig(e) {
    if (!e || e.type !== "custom:activity-history-card")
      throw new Error(
        "Invalid card type. Expected custom:activity-history-card"
      );
    const a = this._initialTimePreset(e);
    this._config = {
      ...b,
      ...e,
      view_mode: e.view_mode ?? e.default_view ?? b.view_mode,
      group_by: e.group_by ?? b.group_by,
      filters: {
        show: !0,
        show_search: !0,
        show_area_chips: !1,
        show_domain_chips: !1,
        show_state_mode: !1,
        active_only: !1,
        ...e.filters ?? {}
      }
    }, this._filter = {
      search: "",
      areas: this._config.filters?.default_areas ?? [],
      domains: this._config.filters?.default_domains ?? [],
      stateMode: this._config.filters?.active_only ? "active_only" : "all",
      groupBy: this._config.group_by ?? "area",
      timePreset: a
    }, this._lastFetchKey = "", this._lastResolvedEntityKey = "", this._showAllRows = !1, this._debugLegacyView = !1, this._expandedInventoryGroups.clear(), this._collapsedInventoryGroups.clear(), this._historyCache.clear(), this._syncRefreshTimer(), this._requestHistoryRefresh(this._hasFetchedOnce ? "config" : "initial", {
      force: !0
    });
  }
  set hass(e) {
    this._hass = e, yi({
      hasFetchedOnce: this._hasFetchedOnce,
      live: this._config?.live !== !1,
      lastHistoryFetchAt: this._lastHistoryFetchAt,
      now: Date.now(),
      refreshIntervalSeconds: this._refreshIntervalSeconds()
    }) ? this._requestHistoryRefresh(
      this._hasFetchedOnce ? "interval" : "initial"
    ) : this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsubscribeHistory?.(), this._unsubscribeHistory = void 0, this._fetchToken += 1, this._refreshTimer && window.clearTimeout(this._refreshTimer), this._refreshTimer = void 0, this._inFlightHistoryRequest = void 0, document.removeEventListener("keydown", this._onDocumentKeyDown), document.removeEventListener("fullscreenchange", this._onFullscreenChange), document.removeEventListener("pointerdown", this._onDocumentPointerDown);
  }
  getCardSize() {
    const e = this._visibleRows.length || this._rows.length || (this._config?.entities?.length ?? 3);
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
    if (!this._config) return h``;
    const e = this._hass?.locale?.language ?? this._hass?.language, a = fa(
      this._config.direction ?? this._config.rtl ?? "auto",
      e
    ), i = [
      "ahc",
      this._config.display_mode === "panel" ? "ahc--panel" : "",
      this._fullscreen || this._config.display_mode === "fullscreen" ? "ahc--fullscreen" : "",
      this._filterSheetOpen ? "ahc--sheet-open" : "",
      this._usingMockData ? "ahc--mock" : "",
      this._backgroundLoading ? "ahc--background-loading" : "",
      this._visibleRows.length > 70 ? "ahc--ultra-dense" : this._visibleRows.length > 30 ? "ahc--dense" : ""
    ].filter(Boolean).join(" ");
    return h`
      <ha-card
        class=${i}
        dir=${a ? "rtl" : "ltr"}
        tabindex=${this._fullscreen ? "0" : "-1"}
        aria-busy=${this._initialLoad ? "true" : "false"}
      >
        ${this._renderHeader()} ${this._renderFilters()}
        ${this._renderSummary()}
        ${this._config.debug ? this._renderDiagnostics() : _}
        ${this._renderBody()}
        ${this._segmentPopover ? this._renderSegmentPopover() : _}
        ${this._filterSheetOpen ? this._renderFilterSheet() : _}
      </ha-card>
    `;
  }
  _renderBody() {
    const e = this._config.show_insights !== !1;
    return h`
      <section
        class=${e ? "ahc__body" : "ahc__body ahc__body--no-insights"}
      >
        <main class="ahc__main">${this._renderMainContent()}</main>
        ${e ? h`<aside class="ahc__insights-panel" aria-label="תובנות חכמות">
              ${this._renderInsights()}
            </aside>` : _}
      </section>
    `;
  }
  _renderHeader() {
    const e = `${this._timePresetLabel(this._filter.timePreset)} · ${this._usingMockData ? "נתוני דוגמה" : "נתוני Home Assistant"}`;
    return h`
      <header class="ahc__hero ahc__topbar">
        <div class="ahc__title-block">
          <div class="ahc__title-row">
            <span class="ahc__icon-badge" aria-hidden="true"
              ><ha-icon icon="mdi:chart-timeline-variant"></ha-icon
            ></span>
            <h2 class="ahc__title">
              ${this._config.title ?? b.title}
            </h2>
          </div>
          <p class="ahc__subtitle">${e}</p>
          ${this._renderLastEventPill()}
        </div>
        <div class="ahc__hero-actions">
          ${this._config.show_fullscreen_button === !1 ? _ : h`
                <button
                  class="ahc__button ahc__button--ghost"
                  type="button"
                  @click=${this._toggleFullscreen}
                  aria-pressed=${this._fullscreen ? "true" : "false"}
                >
                  <span aria-hidden="true"
                    >${this._fullscreen ? "×" : "⛶"}</span
                  >
                  <span>${this._fullscreen ? "צא ממסך מלא" : "מסך מלא"}</span>
                </button>
              `}
          <button
            class="ahc__button ahc__button--ghost"
            type="button"
            @click=${this._manualRefresh}
            ?disabled=${this._initialLoad || this._backgroundLoading}
          >
            <span aria-hidden="true">↻</span><span>רענן</span>
          </button>
          ${this._backgroundLoading ? h`<span class="ahc__refresh-indicator" role="status"
                >מעדכן...</span
              >` : _}
        </div>
      </header>
    `;
  }
  _renderLastEventPill() {
    const e = this._summary, a = e?.lastEventRow, i = e?.lastEvent;
    return !a || !i ? _ : h`
      <div class="ahc-last-event">
        <span class="ahc-last-event__label">אירוע אחרון</span>
        <strong>${a.entity.name}</strong>
        <span
          >${v(i.start)} · ${z[i.category]} ·
          ${le(a, this._config.debug === !0)}</span
        >
      </div>
    `;
  }
  _renderFilters() {
    if (this._config.filters?.show === !1) return _;
    const e = B(this._curation), i = this._currentRendererMode() === "activity", n = !!(i ? this._canToggleAreaInventory() : this._curation?.hiddenRows || this._showAllRows), s = i ? this._showAllRows ? "פעילות בלבד" : "כל האביזרים" : this._showAllRows ? "הצג רק פעילות" : "הצג הכל";
    return h`
      <section class="ahc__toolbar ahc__filters" aria-label="מסננים">
        <div class="ahc__filter-row ahc__filter-row--primary">
          <span class="ahc__filter-label">טווח זמן</span>
          ${this._renderChip(
      "24 שעות",
      this._filter.timePreset === "24h",
      () => this._setTimePreset("24h")
    )}
          ${this._renderChip(
      "7 ימים",
      this._filter.timePreset === "7d",
      () => this._setTimePreset("7d")
    )}
          ${this._renderChip(
      "מותאם",
      this._filter.timePreset === "custom",
      () => this._setTimePreset("custom")
    )}
          <span class="ahc__filter-label">קבץ לפי</span>
          <div class="ahc__segmented" aria-label="קיבוץ לפי">
            <button
              class="ahc__segmented-button"
              type="button"
              aria-pressed=${this._filter.groupBy === "area"}
              @click=${() => this._setGroupBy("area")}
            >
              אזור
            </button>
            <button
              class="ahc__segmented-button"
              type="button"
              aria-pressed=${this._filter.groupBy === "domain"}
              @click=${() => this._setGroupBy("domain")}
            >
              סוג
            </button>
            <button
              class="ahc__segmented-button"
              type="button"
              aria-pressed=${this._filter.groupBy === "none"}
              @click=${() => this._setGroupBy("none")}
            >
              ללא
            </button>
          </div>
          <div class="ahc__search">
            <span class="ahc__search-icon" aria-hidden="true">⌕</span>
            <input
              class="ahc__search-input"
              type="search"
              .value=${this._filter.search}
              placeholder="חיפוש רכיב או אזור..."
              @input=${this._onSearchInput}
            />
          </div>
          <button
            class="ahc__button ahc__button--primary"
            type="button"
            @click=${this._openFilterSheet}
            aria-expanded=${this._filterSheetOpen ? "true" : "false"}
          >
            <span aria-hidden="true">▾</span><span>סינון</span>
          </button>
          ${n ? h`<button
                class="ahc__button ahc__button--ghost"
                type="button"
                aria-pressed=${this._showAllRows ? "true" : "false"}
                @click=${this._toggleShowAllRows}
              >
                ${s}
              </button>` : _}
          ${this._config.debug ? h`<button
                class="ahc__button ahc__button--ghost ahc__button--debug"
                type="button"
                aria-pressed=${this._debugLegacyView ? "true" : "false"}
                @click=${this._toggleDebugLegacyView}
              >
                תצוגת legacy
              </button>` : _}
          ${e ? h`<span class="ahc-curation-note">${e}</span>` : _}
        </div>
      </section>
    `;
  }
  _renderChip(e, a, i) {
    return h`<button
      class="ahc__chip"
      type="button"
      aria-pressed=${a ? "true" : "false"}
      @click=${i}
    >
      ${e}
    </button>`;
  }
  _renderSummary() {
    if (this._config.show_summary === !1) return _;
    if (this._dashboardModel && this._config.summary_scope !== "all")
      return this._renderDashboardSummary(this._dashboardModel);
    const e = this._summary, i = this._dashboardModel?.visibleRowsCount || this._visibleRows.length || this._rows.length, n = this._config.summary_scope === "all" ? "לפי כל הרכיבים שנמצאו" : "לפי הרכיבים שמוצגים";
    return h`
      <section
        class="ahc__summary-strip ahc__summary-grid"
        aria-label="סיכום פעילות"
      >
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">פעילים עכשיו</span>
            <span class="ahc__metric-value"
              >${e?.activeNowCount ?? 0}</span
            >
            <span class="ahc__metric-subtitle">רכיבים שפועלים כרגע</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">●</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">רכיבים שפעלו</span>
            <span class="ahc__metric-value"
              >${e?.activeEntityCount ?? 0}</span
            >
            <span class="ahc__metric-subtitle"
              >מתוך ${i} רכיבים מוצגים</span
            >
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">▣</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירועים</span>
            <span class="ahc__metric-value">${e?.eventCount ?? 0}</span>
            <span class="ahc__metric-subtitle">שינויי מצב פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">סה״כ שעות־רכיב</span>
            <span class="ahc__metric-value ahc__metric-value--positive"
              >${y(e?.totalActiveMs ?? 0)}</span
            >
            <span class="ahc__metric-subtitle">${n}</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◴</span>
        </article>
      </section>
    `;
  }
  _renderDashboardSummary(e) {
    return h`
      <section
        class="ahc__summary-strip ahc__summary-grid"
        aria-label="סיכום פעילות"
      >
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">סה״כ שעות־רכיב</span>
            <span class="ahc__metric-value ahc__metric-value--positive">
              ${y(e.totalVisibleActiveMs)}
            </span>
            <span class="ahc__metric-subtitle">לפי התצוגה הנוכחית</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◴</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">רכיבים שפעלו</span>
            <span class="ahc__metric-value">${e.visibleRowsCount}</span>
            <span class="ahc__metric-subtitle">
              מתוך
              ${e.totalInventoryItemCount || e.totalRowsBeforeCuration}
              אביזרים
            </span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">▣</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירועים</span>
            <span class="ahc__metric-value"
              >${e.visibleEventCount}</span
            >
            <span class="ahc__metric-subtitle">שינויי מצב פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">פעילים עכשיו</span>
            <span class="ahc__metric-value">${e.activeNowCount}</span>
            <span class="ahc__metric-subtitle">רכיבים שפועלים כרגע</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">●</span>
        </article>
      </section>
    `;
  }
  _renderSummaryLegacy() {
    if (this._config.show_summary === !1) return _;
    const e = this._summary, a = e?.lastEventRow, i = e?.lastEvent;
    return h`
      <section
        class="ahc__summary-strip ahc__summary-grid"
        aria-label="סיכום פעילות"
      >
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירוע אחרון</span>
            <span class="ahc__metric-value ahc__metric-value--compact"
              >${a?.entity.name ?? "אין"}</span
            >
            <span class="ahc__metric-subtitle">
              ${i && a ? `${v(i.start)} · ${z[i.category]} · ${le(a, this._config.debug === !0)}` : "לא נמצאו אירועים בטווח"}
            </span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">♪</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">סה״כ שעות־רכיב</span>
            <span class="ahc__metric-value ahc__metric-value--positive"
              >${y(e?.totalActiveMs ?? 0)}</span
            >
            <span class="ahc__metric-subtitle"
              >סכום פעילות על פני כל הרכיבים</span
            >
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◷</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירועים</span>
            <span class="ahc__metric-value">${e?.eventCount ?? 0}</span>
            <span class="ahc__metric-subtitle">שינויי מצב פעילים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">⌁</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">פעילים עכשיו</span>
            <span class="ahc__metric-value"
              >${e?.activeNowCount ?? 0}</span
            >
            <span class="ahc__metric-subtitle"
              >${e?.activeEntityCount ?? 0} רכיבים פעלו בטווח</span
            >
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">●</span>
        </article>
      </section>
    `;
  }
  _renderMainContent() {
    if (this._initialLoad && !this._rows.length)
      return this._renderInitialLoading();
    if (this._error && !this._rows.length)
      return h`<div class="ahc-state-card">
        <div>
          <h3 class="ahc-state-card__title">שגיאה בטעינת ההיסטוריה</h3>
          <p>${this._error}</p>
        </div>
      </div>`;
    const e = !!(this._dashboardModel && (this._dashboardModel.visibleRowsCount || this._dashboardModel.totalInventoryItemCount));
    if (this._emptyReason && !e || !this._groups.length && !e)
      return this._renderEmptyState(
        this._emptyReason ?? "no_resolved_entities"
      );
    const a = this._resolveRange();
    switch (this._currentRendererMode()) {
      case "heatmap":
        return ki();
      case "detail":
        return wi();
      case "correlation":
        return xi();
      case "legacy_swimlane":
        return h`
          ${this._showAllRows && this._config.view_mode === "activity" ? h`<div class="ahc-legacy-warning">
                מצב הצגת הכל מיועד לבדיקה. התצוגה מציגה שורות גולמיות יותר
                ועלולה לכלול רכיבים רועשים.
              </div>` : _}
          ${Wi({
          groups: this._groups,
          range: a,
          config: this._showAllRows && this._config.view_mode === "activity" ? {
            ...this._config,
            show_inactive_baselines: !0,
            max_visible_rows: Math.max(
              this._config.max_visible_rows ?? 0,
              80
            )
          } : this._config,
          summary: this._summary ?? L(this._groups),
          curation: this._curation,
          onSegmentClick: this._openSegmentPopover
        })}
        `;
      case "activity_legacy":
        return Bi({
          groups: this._groups,
          range: a,
          config: this._config,
          summary: this._summary ?? L(this._groups),
          curation: this._curation,
          onSegmentClick: this._openSegmentPopover
        });
      case "activity":
      default:
        return $i({
          model: this._dashboardModel ?? Ne(
            this._groups,
            a,
            this._config,
            this._curation,
            {
              inventoryRows: je(this._rows, this._filter),
              selectedAreas: this._filter.areas,
              groupBy: this._filter.groupBy
            }
          ),
          config: this._config,
          expandedInventoryGroups: this._expandedInventoryGroups,
          collapsedInventoryGroups: this._collapsedInventoryGroups,
          showAllInventory: this._showAllRows,
          onSegmentClick: this._openSegmentPopover,
          onInventoryToggle: this._toggleInventoryGroup,
          onInventoryItemClick: this._openInventoryMoreInfo
        });
    }
  }
  _renderInitialLoading() {
    const e = !this._hass && !this._usingMockData ? "ממתין לחיבור Home Assistant." : "מושך היסטוריה מה-Recorder.";
    return h`
      <section class="ahc-loading" aria-label="טעינת היסטוריה" aria-busy="true">
        <div class="ahc-loading__copy">
          <h3>טוען ציר זמן...</h3>
          <p>${e}</p>
        </div>
        <div class="ahc-loading__timeline" aria-hidden="true">
          ${Array.from({ length: 4 }).map(
      (a, i) => h`
              <div class="ahc-loading__group">
                <span></span>
                ${Array.from({ length: 5 }).map(
        (n, s) => h`<i
                      style="--delay:${i + s}; --width:${42 + (i + s) % 4 * 12}%"
                    ></i>`
      )}
              </div>
            `
    )}
        </div>
      </section>
    `;
  }
  _renderSegmentPopover() {
    const e = this._segmentPopover;
    if (!e) return h``;
    const a = Ga(
      e.row,
      e.segment,
      this._config.debug === !0
    );
    return h`
      <aside
        class="ahc-popover"
        data-placement=${e.placement}
        role="dialog"
        aria-label="פרטי מקטע פעילות"
        style=${`--ahc-popover-x:${e.x}px; --ahc-popover-y:${e.y}px`}
      >
        <button
          class="ahc-popover__close"
          type="button"
          aria-label="סגור"
          @click=${this._closeSegmentPopover}
        >
          ×
        </button>
        <h3 class="ahc-popover__title">${e.row.entity.name}</h3>
        <dl class="ahc-popover__dl">
          ${a.map(
      ([i, n]) => h`<dt class="ahc-popover__dt">${i}</dt>
                <dd class="ahc-popover__dd">${n}</dd>`
    )}
        </dl>
      </aside>
    `;
  }
  _renderEmptyState(e) {
    const i = {
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
      },
      no_meaningful_activity: {
        title: "לא נמצאה פעילות משמעותית בטווח הזה",
        body: "הכרטיס מצא רכיבים והיסטוריה, אבל הסינון החכם הסתיר שורות בלי פעילות אמיתית, רכיבים טכניים או מקטעים קצרים מאוד. אפשר להציג הכל לבדיקה או להגדיל את הטווח.",
        yaml: `type: custom:activity-history-card
auto_discover: true
activity_mode: all
show_inactive_baselines: true`
      }
    }[e], n = e === "no_resolved_entities" && this._diagnostics?.discovery?.unavailableReasons.length ? this._diagnostics.discovery.unavailableReasons.join(", ") : "";
    return h`
      <div class="ahc-state-card">
        <div>
          <h3 class="ahc-state-card__title">${i.title}</h3>
          <p>${i.body}</p>
          ${n ? h`<p>
                אזהרת discovery: ${n}. אם האזורים לא זמינים, נסה
                להגדיר entities ידנית או להפעיל debug.
              </p>` : _}
          ${e === "no_meaningful_activity" && this._config.debug ? h`<p class="ahc-debug__meta">
                ${B(this._curation)}
              </p>` : _}
          <pre
            class="ahc-state-card__yaml"
            dir="ltr"
          ><code>${i.yaml}</code></pre>
          ${e === "no_meaningful_activity" ? h`<div class="ahc-empty-actions">
                <button
                  class="ahc__button ahc__button--primary"
                  type="button"
                  @click=${this._toggleShowAllRows}
                >
                  הצג הכל
                </button>
                <button
                  class="ahc__button ahc__button--ghost"
                  type="button"
                  @click=${() => this._setTimePreset("7d")}
                >
                  7 ימים
                </button>
                <button
                  class="ahc__button ahc__button--ghost"
                  type="button"
                  @click=${this._openFilterSheet}
                >
                  פתח סינון
                </button>
              </div>` : _}
        </div>
      </div>
    `;
  }
  _renderDiagnostics() {
    const e = this._diagnostics;
    return e ? h`
      <details class="ahc-debug" aria-label="אבחון">
        <summary class="ahc-debug__header">
          <strong>Debug</strong>
          <span
            >${e.fetchReason ?? "loaded"} ·
            ${e.cacheHit ? "cache hit" : "cache miss"}</span
          >
        </summary>
        <dl class="ahc-debug__grid">
          <div>
            <dt>רכיבים</dt>
            <dd>${e.resolvedEntityCount}</dd>
          </div>
          <div>
            <dt>רשומות</dt>
            <dd>${e.historyRecordCount}</dd>
          </div>
          <div>
            <dt>מקטעים</dt>
            <dd>${e.timelineSegmentCount}</dd>
          </div>
          <div>
            <dt>פעילים</dt>
            <dd>${e.activeTimelineSegmentCount}</dd>
          </div>
          <div>
            <dt>אחרי סינון</dt>
            <dd>${e.filteredRowCount}</dd>
          </div>
          <div>
            <dt>מוצגות</dt>
            <dd>${e.curation?.visibleRows ?? 0}</dd>
          </div>
          <div>
            <dt>הוסתרו חכם</dt>
            <dd>${e.curation?.hiddenRows ?? 0}</dd>
          </div>
          <div>
            <dt>קבוצות</dt>
            <dd>${e.renderedGroupCount}</dd>
          </div>
          <div>
            <dt>attributes</dt>
            <dd>
              ${e.attributesRequested.withAttributes}/${e.attributesRequested.withoutAttributes}
            </dd>
          </div>
          <div>
            <dt>registry</dt>
            <dd>
              ${e.discovery?.registryAvailable ? "זמין" : "fallback"}
            </dd>
          </div>
          <div>
            <dt>refresh</dt>
            <dd>
              ${e.refreshIntervalSeconds ?? this._refreshIntervalSeconds()}s
            </dd>
          </div>
          <div>
            <dt>duration</dt>
            <dd>${e.fetchDurationMs ?? 0}ms</dd>
          </div>
          <div>
            <dt>mode</dt>
            <dd>
              ${e.initialLoad ? "initial" : e.backgroundLoading ? "background" : "idle"}
            </dd>
          </div>
        </dl>
        <p class="ahc-debug__meta" dir="ltr">
          ${e.historyRange ? `${e.historyRange.start.toISOString()} → ${e.historyRange.end.toISOString()}` : "no range"}
        </p>
        <p class="ahc-debug__meta" dir="ltr">
          last fetch: ${e.lastFetchTime?.toISOString() ?? "never"}
        </p>
        <p class="ahc-debug__meta" dir="ltr">
          history key: ${e.currentHistoryKey ?? "none"}
        </p>
        <p class="ahc-debug__meta">
          מסננים: ${JSON.stringify(e.activeFilters)}
        </p>
        ${e.curation ? h`<p class="ahc-debug__meta" dir="ltr">
              curation: ${JSON.stringify(e.curation.hiddenByReason)}
            </p>` : _}
        ${e.discovery?.unavailableReasons.length ? h`<p class="ahc-debug__meta">
              Registry warnings:
              ${e.discovery.unavailableReasons.join(", ")}
            </p>` : _}
      </details>
    ` : h`<details class="ahc-debug" aria-label="אבחון">
        <summary>Debug · ממתין לטעינת נתונים...</summary>
      </details>`;
  }
  _renderInsights() {
    if (this._dashboardModel && this._config.summary_scope !== "all")
      return this._renderDashboardInsights(this._dashboardModel);
    const e = this._summary, a = e?.mostActiveEntity, i = e?.mostActiveArea, n = !!(e && e.eventCount > 0);
    return h`
      <section class="ahc__insights" aria-label="תובנות חכמות">
        <h3 class="ahc__insights-title">
          <span>תובנות חכמות</span><span aria-hidden="true">✦</span>
        </h3>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">הרכיב הפעיל ביותר</span>
          <span class="ahc__insight-value"
            >${a?.entity.name ?? "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle"
            >${a ? `${y(a.totalActiveMs)} · ${le(a, this._config.debug === !0)}` : "צריך היסטוריה פעילה בטווח"}</span
          >
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">האזור הפעיל ביותר</span>
          <span class="ahc__insight-value"
            >${i?.title ?? "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle"
            >${i ? `${y(i.totalActiveMs)} · ${i.subtitle ?? ""}` : "אין אזור עם פעילות משמעותית"}</span
          >
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">שעות שיא</span>
          <span class="ahc__insight-value"
            >${e?.peakBucketLabel ?? "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle">לפי משך פעילות</span>
          <span class="ahc__spark" aria-hidden="true"
            >${[35, 48, 62, 44, 72, 54, 38].map(
      (s) => h`<i style="--bar:${n ? s : 12}%"></i>`
    )}</span
          >
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">דפוס שימוש קצר</span>
          <span class="ahc__insight-value"
            >${n ? `${e?.activeEntityCount ?? 0} רכיבים` : "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle"
            >${n ? `נרשמו ${e?.eventCount ?? 0} אירועים בטווח הנוכחי` : "נסה טווח זמן ארוך יותר או ודא שה-Recorder פעיל"}</span
          >
        </article>
      </section>
    `;
  }
  _renderDashboardInsights(e) {
    const a = e.insights, i = e.visibleEventCount > 0;
    return h`
      <section class="ahc__insights" aria-label="תובנות חכמות">
        <h3 class="ahc__insights-title">
          <span>תובנות חכמות</span><span aria-hidden="true">✦</span>
        </h3>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">הרכיב הפעיל ביותר</span>
          <span class="ahc__insight-value">
            ${a.mostActiveEntity?.name ?? "אין מספיק נתונים משמעותיים"}
          </span>
          <span class="ahc__insight-subtitle">
            ${a.mostActiveEntity ? `${y(
      a.mostActiveEntity.totalActiveMs
    )} · ${a.mostActiveEntity.secondary ?? ""}` : "רק רכיבים משמעותיים מוצגים כברירת מחדל"}
          </span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">האזור הפעיל ביותר</span>
          <span class="ahc__insight-value">
            ${a.mostActiveArea?.title ?? "אין מספיק נתונים משמעותיים"}
          </span>
          <span class="ahc__insight-subtitle">
            ${a.mostActiveArea ? `${y(a.mostActiveArea.totalActiveMs)} · ${a.mostActiveArea.rowCount} רכיבי פעילות מתוך ${a.mostActiveArea.inventoryCount} אביזרים` : "אין אזור עם פעילות משמעותית"}
          </span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">שעות שיא</span>
          <span class="ahc__insight-value">
            ${a.peakBucketLabel ?? "אין מספיק נתונים משמעותיים"}
          </span>
          <span class="ahc__insight-subtitle">לפי צפיפות הפעילות המוצגת</span>
          <span class="ahc__spark" aria-hidden="true">
            ${e.densityBuckets.slice(0, 12).map(
      (n) => h`<i
                    style=${`--bar:${i ? Math.max(12, n.intensity * 100) : 12}%`}
                  ></i>`
    )}
          </span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">דפוס שימוש קצר</span>
          <span class="ahc__insight-value">
            ${a.shortUsePattern ?? "אין מספיק נתונים משמעותיים"}
          </span>
          <span class="ahc__insight-subtitle">
            ${a.inventoryPattern ?? (e.hiddenRowsCount ? `${e.hiddenRowsCount} רכיבים הוסתרו כדי לשמור על תצוגה נקייה` : "כל הפעילות המשמעותית מוצגת")}
          </span>
        </article>
      </section>
    `;
  }
  _renderFilterSheet() {
    const e = this._availableAreas(), a = this._availableDomains(), i = this._visibleRows;
    return h`
      <div
        class="ahc-filter-sheet-backdrop"
        @click=${this._closeFilterSheet}
      ></div>
      <section
        class="ahc-filter-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="סינון מתקדם"
      >
        <div class="ahc-filter-sheet__handle" aria-hidden="true"></div>
        <header class="ahc-filter-sheet__header">
          <button
            class="ahc__button ahc__button--ghost"
            type="button"
            @click=${this._closeFilterSheet}
            aria-label="סגור"
          >
            ×
          </button>
          <h3 class="ahc-filter-sheet__title">סינון מתקדם</h3>
        </header>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>טווח זמן</span><span aria-hidden="true">◷</span>
          </div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip(
      "24 שעות",
      this._filter.timePreset === "24h",
      () => this._setTimePreset("24h")
    )}
            ${this._renderChip(
      "7 ימים",
      this._filter.timePreset === "7d",
      () => this._setTimePreset("7d")
    )}
            ${this._renderChip(
      "טווח מותאם",
      this._filter.timePreset === "custom",
      () => this._setTimePreset("custom")
    )}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>אזורים</span><span aria-hidden="true">▦</span>
          </div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip(
      "כל האזורים",
      !this._filter.areas.length,
      () => this._setAreas([])
    )}
            ${e.map(
      (n) => this._renderChip(
        n,
        this._filter.areas.includes(n),
        () => this._toggleArea(n)
      )
    )}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>סוגי רכיבים</span><span aria-hidden="true">▦</span>
          </div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip(
      "כל הסוגים",
      !this._filter.domains.length,
      () => this._setDomains([])
    )}
            ${a.map(
      (n) => this._renderChip(
        M[n] ?? n,
        this._filter.domains.includes(n),
        () => this._toggleDomain(n)
      )
    )}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>מצבים</span><span aria-hidden="true">⌁</span>
          </div>
          <button
            class="ahc-filter-option"
            type="button"
            aria-pressed=${this._filter.stateMode === "active_only"}
            @click=${() => this._setStateMode("active_only")}
          >
            <span>רק פעילים</span><small>הצג רכיבים שהיו פעילים בטווח</small>
          </button>
          <button
            class="ahc-filter-option"
            type="button"
            aria-pressed=${this._filter.stateMode === "all"}
            @click=${() => this._setStateMode("all")}
          >
            <span>כל המצבים</span><small>הצג גם זמני כבוי ולא זמין</small>
          </button>
          <button
            class="ahc-filter-option"
            type="button"
            aria-pressed=${this._filter.stateMode === "currently_active"}
            @click=${() => this._setStateMode("currently_active")}
          >
            <span>פעילים עכשיו</span><small>התמקד ברכיבים שפועלים כעת</small>
          </button>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>תצוגה חכמה</span
            ><span>${this._curation?.visibleRows ?? i.length}</span>
          </div>
          <button
            class="ahc-filter-option"
            type="button"
            aria-pressed=${this._showAllRows ? "true" : "false"}
            @click=${this._toggleShowAllRows}
          >
            <span>
              ${this._currentRendererMode() === "activity" ? this._showAllRows ? "פעילות בלבד" : "כל האביזרים" : this._showAllRows ? "הצג רק פעילות" : "הצג הכל"}
            </span>
            <small
              >${B(this._curation) || "הסתר שורות ריקות, טכניות וקצרות מאוד"}</small
            >
          </button>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>קבוצות וחיפוש</span><span aria-hidden="true">▤</span>
          </div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip(
      "קבץ לפי אזור",
      this._filter.groupBy === "area",
      () => this._setGroupBy("area")
    )}
            ${this._renderChip(
      "קבץ לפי סוג",
      this._filter.groupBy === "domain",
      () => this._setGroupBy("domain")
    )}
            ${this._renderChip(
      "ללא קיבוץ",
      this._filter.groupBy === "none",
      () => this._setGroupBy("none")
    )}
          </div>
          <div class="ahc__search ahc__search--sheet">
            <span class="ahc__search-icon" aria-hidden="true">⌕</span>
            <input
              class="ahc__search-input"
              type="search"
              .value=${this._filter.search}
              placeholder="חיפוש רכיב או אזור"
              @input=${this._onSearchInput}
            />
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title">
            <span>רכיבים נבחרים</span><span>${i.length}</span>
          </div>
          <div class="ahc-entity-list">
            ${i.slice(0, 32).map(
      (n) => h`
                <span class="ahc-entity-list__item">
                  <span>${n.entity.name}</span>
                  <small
                    >${[
        n.entity.area,
        M[n.entity.domain] ?? n.entity.domain
      ].filter(Boolean).join(" · ")}</small
                  >
                </span>
              `
    )}
            ${i.length > 32 ? h`<span class="ahc-entity-list__more"
                  >ועוד ${i.length - 32} רכיבים</span
                >` : _}
          </div>
        </div>

        <footer class="ahc-filter-sheet__footer">
          <button
            class="ahc__button ahc__button--ghost"
            type="button"
            @click=${this._clearFilters}
          >
            נקה סינון
          </button>
          <button
            class="ahc__button ahc__button--primary"
            type="button"
            @click=${this._closeFilterSheet}
          >
            החל סינון
          </button>
        </footer>
      </section>
    `;
  }
  _requestHistoryRefresh(e, a = {}) {
    if (!this._config || this._inFlightHistoryRequest && !a.force) return;
    const i = this._fetchAndRender(e, a.force === !0);
    this._inFlightHistoryRequest = i, i.finally(() => {
      this._inFlightHistoryRequest === i && (this._inFlightHistoryRequest = void 0);
    });
  }
  async _fetchAndRender(e, a) {
    if (!this._config) return;
    const i = Date.now(), n = this._config.mock_data === !0;
    if (!this._hass && !n) {
      this._usingMockData = !1, this._initialLoad = !this._rows.length, this._loading = this._initialLoad, this._backgroundLoading = !1, this._error = void 0, this._emptyReason = void 0, this.requestUpdate();
      return;
    }
    const s = ++this._fetchToken, r = !this._hasFetchedOnce && !this._rows.length;
    this._initialLoad = r, this._loading = r, this._backgroundLoading = !r, this._error = void 0, this._rows.length || (this._emptyReason = void 0), this._usingMockData = n, this.requestUpdate();
    const c = n ? {
      entities: _i(this._config.mock_profile),
      diagnostics: void 0
    } : await qa(this._config, this._hass);
    if (s !== this._fetchToken) return;
    const o = c.entities, l = nn(o), d = this._resolveRange(), u = xt(o), p = ri({
      mock: n,
      start: d.start.toISOString(),
      end: d.end.toISOString(),
      entityIds: o.map((m) => m.entity_id),
      withAttributes: u.withAttributes.map(
        (m) => m.entity_id
      ),
      withoutAttributes: u.withoutAttributes.map(
        (m) => m.entity_id
      ),
      includeLabels: this._config.include_labels ?? [],
      excludeLabels: this._config.exclude_labels ?? [],
      significant: this._config.significant_changes_only,
      minimal: this._config.minimal_response
    }), g = a && ["manual", "timer", "interval", "config"].includes(e), x = !!(this._lastResolvedEntityKey && this._lastResolvedEntityKey !== l) && e === "interval" ? "entities" : e, w = (m, k, ne = c.diagnostics) => {
      this._lastResolvedEntityKey = l, this._lastHistoryFetchAt = Date.now(), this._hasFetchedOnce = !0, this._setPostLoadState(
        k,
        d,
        u,
        m,
        n,
        ne,
        {
          reason: x,
          key: p,
          durationMs: Date.now() - i
        }
      ), this._syncRefreshTimer();
    };
    if (!o.length) {
      this._usingMockData = !1, this._rows = [], this._visibleRows = [], this._groups = [], this._dashboardModel = void 0, this._summary = L([]), this._curation = re([], this._config).diagnostics, this._emptyReason = this._config.auto_discover === !1 && !this._config.entities?.length ? "no_entities_selected" : "no_resolved_entities", this._setDiagnostics({
        resolvedEntityCount: 0,
        historyRecordCount: 0,
        timelineSegmentCount: 0,
        activeTimelineSegmentCount: 0,
        filteredRowCount: 0,
        renderedGroupCount: 0,
        activeFilters: { ...this._filter },
        historyRange: d,
        attributesRequested: { withAttributes: 0, withoutAttributes: 0 },
        cacheHit: !1,
        mockData: n,
        discovery: c.diagnostics,
        curation: this._curation,
        lastFetchTime: /* @__PURE__ */ new Date(),
        fetchDurationMs: Date.now() - i,
        fetchReason: x,
        currentHistoryKey: p,
        refreshIntervalSeconds: this._refreshIntervalSeconds(),
        initialLoad: r,
        backgroundLoading: !1
      }), this._hasFetchedOnce = !0, this._lastResolvedEntityKey = l, this._lastHistoryFetchAt = Date.now(), this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this._error = void 0, this._syncRefreshTimer(), this.requestUpdate();
      return;
    }
    if (!g && p === this._lastFetchKey) {
      const m = this._historyCache.get(p);
      if (m) {
        const k = Ze(m);
        this._rows = Ye(
          m,
          o,
          d,
          this._config,
          this._hass?.states ?? {}
        ), w(!0, k), this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this._error = void 0, this._rebuildGroups();
        return;
      }
    }
    try {
      let m = g ? void 0 : this._historyCache.get(p);
      if (m || (m = n ? gi(d, this._config.mock_profile) : await oi(
        this._hass,
        o,
        d,
        this._config
      ), this._historyCache.set(p, m)), s !== this._fetchToken) return;
      const k = Ze(m);
      this._rows = Ye(
        m,
        o,
        d,
        this._config,
        this._hass?.states ?? {}
      ), w(!1, k), this._lastFetchKey = p, this._rebuildGroups();
    } catch (m) {
      this._error = m instanceof Error ? m.message : String(m), this._rows.length || (this._visibleRows = [], this._groups = [], this._dashboardModel = void 0, this._summary = L([]), this._curation = re([], this._config).diagnostics, this._emptyReason = void 0);
    } finally {
      s === this._fetchToken && (this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this.requestUpdate());
    }
  }
  _rebuildGroups() {
    const e = je(this._rows, this._filter), a = this._currentRendererMode(), i = a !== "activity" && this._showAllRows, n = re(e, this._config, {
      showAll: i,
      groupBy: this._filter.groupBy
    });
    this._visibleRows = n.rows, this._curation = n.diagnostics, this._groups = Ue(n.rows, this._filter.groupBy).filter(
      (s) => this._config.hide_empty_groups === !1 || s.rows.length > 0
    ), this._dashboardModel = a === "activity" ? Ne(
      this._groups,
      this._resolveRange(),
      this._config,
      n.diagnostics,
      {
        inventoryRows: e,
        selectedAreas: this._filter.areas,
        groupBy: this._filter.groupBy
      }
    ) : void 0, this._summary = a === "activity" && this._dashboardModel && this._config.summary_scope !== "all" ? za(this._dashboardModel) : L(
      this._config.summary_scope === "all" ? Ue(e, this._filter.groupBy) : this._groups
    ), this._rows.length && !e.length ? this._emptyReason = "all_entities_filtered" : e.length && !n.rows.length ? this._emptyReason = "no_meaningful_activity" : (this._emptyReason === "all_entities_filtered" || this._emptyReason === "no_meaningful_activity") && (this._emptyReason = void 0), this._diagnostics && this._setDiagnostics({
      ...this._diagnostics,
      filteredRowCount: e.length,
      renderedGroupCount: this._dashboardModel?.groups.length ?? this._groups.length,
      curation: n.diagnostics,
      activeFilters: { ...this._filter }
    }), this.requestUpdate();
  }
  _setPostLoadState(e, a, i, n, s, r, c) {
    const o = this._rows.reduce(
      (d, u) => d + u.segments.length,
      0
    ), l = this._rows.reduce(
      (d, u) => d + u.segments.filter((p) => p.active).length,
      0
    );
    e === 0 && l === 0 ? this._emptyReason = "no_history_returned" : e > 0 && o === 0 ? this._emptyReason = "history_unusable" : this._emptyReason = void 0, this._setDiagnostics({
      resolvedEntityCount: this._rows.length,
      historyRecordCount: e,
      timelineSegmentCount: o,
      activeTimelineSegmentCount: l,
      filteredRowCount: this._rows.length,
      renderedGroupCount: 0,
      activeFilters: { ...this._filter },
      historyRange: a,
      attributesRequested: {
        withAttributes: i.withAttributes.length,
        withoutAttributes: i.withoutAttributes.length
      },
      cacheHit: n,
      mockData: s,
      discovery: r,
      curation: this._curation,
      lastFetchTime: new Date(this._lastHistoryFetchAt || Date.now()),
      fetchDurationMs: c.durationMs,
      fetchReason: c.reason,
      currentHistoryKey: c.key,
      refreshIntervalSeconds: this._refreshIntervalSeconds(),
      initialLoad: this._initialLoad,
      backgroundLoading: this._backgroundLoading
    });
  }
  _setDiagnostics(e) {
    this._diagnostics = e;
  }
  _syncRefreshTimer() {
    if (this._refreshTimer && window.clearTimeout(this._refreshTimer), this._refreshTimer = void 0, !this._config || this._config.live === !1) return;
    const e = this._refreshIntervalSeconds();
    this._refreshTimer = window.setTimeout(() => {
      this._refreshTimer = void 0, this._requestHistoryRefresh("timer", { force: !0 });
    }, e * 1e3);
  }
  _refreshIntervalSeconds() {
    return kt(
      this._config?.refresh_interval_seconds
    );
  }
  _resolveRange() {
    const e = this._roundedNow();
    return this._filter.timePreset === "24h" ? ce(
      {
        ...this._config,
        start_time: void 0,
        end_time: e.toISOString(),
        hours_to_show: 24
      },
      e
    ) : this._filter.timePreset === "7d" ? ce(
      {
        ...this._config,
        start_time: void 0,
        end_time: e.toISOString(),
        hours_to_show: 24 * 7
      },
      e
    ) : ce(this._config, e);
  }
  _roundedNow() {
    const e = Date.now();
    return new Date(Math.floor(e / 6e4) * 6e4);
  }
  _availableDomains() {
    return [...new Set(this._rows.map((e) => e.entity.domain))].filter(Boolean).sort();
  }
  _availableAreas() {
    return [
      ...new Set(
        this._rows.map((e) => e.entity.area).filter((e) => !!e)
      )
    ].sort();
  }
  _toggleArea(e) {
    const a = this._filter.areas.includes(e) ? this._filter.areas.filter((i) => i !== e) : [...this._filter.areas, e];
    this._setAreas(a);
  }
  _setAreas(e) {
    this._filter = { ...this._filter, areas: e }, this._resetInventoryExpansion(), this._rebuildGroups();
  }
  _toggleDomain(e) {
    const a = this._filter.domains.includes(e) ? this._filter.domains.filter((i) => i !== e) : [...this._filter.domains, e];
    this._setDomains(a);
  }
  _setDomains(e) {
    this._filter = { ...this._filter, domains: e }, this._resetInventoryExpansion(), this._rebuildGroups();
  }
  _setGroupBy(e) {
    this._filter = { ...this._filter, groupBy: e }, this._resetInventoryExpansion(), this._rebuildGroups();
  }
  _setStateMode(e) {
    this._filter = { ...this._filter, stateMode: e }, this._rebuildGroups();
  }
  _setTimePreset(e) {
    this._filter.timePreset !== e && (this._filter = { ...this._filter, timePreset: e }, this._lastFetchKey = "", this._requestHistoryRefresh("range", { force: !0 }));
  }
  _currentRendererMode() {
    return this._config.debug && this._debugLegacyView ? "legacy_swimlane" : en(this._config, this._showAllRows);
  }
  _resetInventoryExpansion() {
    this._showAllRows = !1, this._expandedInventoryGroups.clear(), this._collapsedInventoryGroups.clear();
  }
  _canToggleAreaInventory() {
    return this._config.show_area_inventory === !1 || this._config.area_inventory_mode === "off" ? !1 : !!(this._showAllRows || this._dashboardModel?.totalInventoryItemCount);
  }
  _isInventoryGroupDefaultExpanded() {
    return this._showAllRows || this._config.area_inventory_mode === "expanded" || this._dashboardModel?.singleAreaFocused === !0;
  }
  _initialTimePreset(e) {
    return e.start_time || e.end_time ? "custom" : (e.hours_to_show ?? 24) >= 168 ? "7d" : "24h";
  }
  _timePresetLabel(e) {
    return e === "7d" ? "7 ימים" : e === "custom" ? "טווח מותאם" : "24 שעות אחרונות";
  }
}
function Ze(t) {
  return Object.values(t).reduce(
    (e, a) => e + a.length,
    0
  );
}
function nn(t) {
  return t.map((e) => "entity" in e ? e.entity.entity_id : e.entity_id).sort().join("|");
}
customElements.get("activity-history-card") || customElements.define("activity-history-card", an);
window.customCards = window.customCards || [];
window.customCards.some((t) => t.type === "activity-history-card") || window.customCards.push({
  type: "activity-history-card",
  name: "Activity History Card",
  description: "RTL/mobile-friendly Home Assistant activity history timeline",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/activity-history-card"
});
export {
  an as ActivityHistoryCard
};
//# sourceMappingURL=activity-history-card.js.map
