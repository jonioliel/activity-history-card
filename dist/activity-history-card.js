/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = globalThis, _e = X.ShadowRoot && (X.ShadyCSS === void 0 || X.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, pe = Symbol(), ve = /* @__PURE__ */ new WeakMap();
let Ve = class {
  constructor(e, i, a) {
    if (this._$cssResult$ = !0, a !== pe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (_e && e === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (e = ve.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && ve.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (t) => new Ve(typeof t == "string" ? t : t + "", void 0, pe), We = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((a, s, n) => a + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[n + 1], t[0]);
  return new Ve(i, t, pe);
}, yt = (t, e) => {
  if (_e) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const a = document.createElement("style"), s = X.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = i.cssText, t.appendChild(a);
  }
}, be = _e ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const a of e.cssRules) i += a.cssText;
  return bt(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: wt, defineProperty: xt, getOwnPropertyDescriptor: $t, getOwnPropertyNames: kt, getOwnPropertySymbols: At, getPrototypeOf: St } = Object, te = globalThis, ye = te.trustedTypes, Rt = ye ? ye.emptyScript : "", Ct = te.reactiveElementPolyfillSupport, j = (t, e) => t, he = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? Rt : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, Ye = (t, e) => !wt(t, e), we = { attribute: !0, type: String, converter: he, reflect: !1, useDefault: !1, hasChanged: Ye };
Symbol.metadata ??= Symbol("metadata"), te.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let D = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = we) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, i);
      s !== void 0 && xt(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, a) {
    const { get: s, set: n } = $t(this.prototype, e) ?? { get() {
      return this[i];
    }, set(r) {
      this[i] = r;
    } };
    return { get: s, set(r) {
      const c = s?.call(this);
      n?.call(this, r), this.requestUpdate(e, c, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? we;
  }
  static _$Ei() {
    if (this.hasOwnProperty(j("elementProperties"))) return;
    const e = St(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(j("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(j("properties"))) {
      const i = this.properties, a = [...kt(i), ...At(i)];
      for (const s of a) this.createProperty(s, i[s]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [a, s] of i) this.elementProperties.set(a, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, a] of this.elementProperties) {
      const s = this._$Eu(i, a);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const a = new Set(e.flat(1 / 0).reverse());
      for (const s of a) i.unshift(be(s));
    } else e !== void 0 && i.push(be(e));
    return i;
  }
  static _$Eu(e, i) {
    const a = i.attribute;
    return a === !1 ? void 0 : typeof a == "string" ? a : typeof e == "string" ? e.toLowerCase() : void 0;
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
    for (const a of i.keys()) this.hasOwnProperty(a) && (e.set(a, this[a]), delete this[a]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return yt(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((e) => e.hostDisconnected?.());
  }
  attributeChangedCallback(e, i, a) {
    this._$AK(e, a);
  }
  _$ET(e, i) {
    const a = this.constructor.elementProperties.get(e), s = this.constructor._$Eu(e, a);
    if (s !== void 0 && a.reflect === !0) {
      const n = (a.converter?.toAttribute !== void 0 ? a.converter : he).toAttribute(i, a.type);
      this._$Em = e, n == null ? this.removeAttribute(s) : this.setAttribute(s, n), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const n = a.getPropertyOptions(s), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : he;
      this._$Em = s;
      const c = r.fromAttribute(i, n.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, a, s = !1, n) {
    if (e !== void 0) {
      const r = this.constructor;
      if (s === !1 && (n = this[e]), a ??= r.getPropertyOptions(e), !((a.hasChanged ?? Ye)(n, i) || a.useDefault && a.reflect && n === this._$Ej?.get(e) && !this.hasAttribute(r._$Eu(e, a)))) return;
      this.C(e, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: a, reflect: s, wrapped: n }, r) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, r ?? i ?? this[e]), n !== !0 || r !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [s, n] of this._$Ep) this[s] = n;
        this._$Ep = void 0;
      }
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [s, n] of a) {
        const { wrapped: r } = n, c = this[s];
        r !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, n, c);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), this._$EO?.forEach((a) => a.hostUpdate?.()), this.update(i)) : this._$EM();
    } catch (a) {
      throw e = !1, this._$EM(), a;
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
D.elementStyles = [], D.shadowRootOptions = { mode: "open" }, D[j("elementProperties")] = /* @__PURE__ */ new Map(), D[j("finalized")] = /* @__PURE__ */ new Map(), Ct?.({ ReactiveElement: D }), (te.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ge = globalThis, xe = (t) => t, Q = ge.trustedTypes, $e = Q ? Q.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Je = "$lit$", C = `lit$${Math.random().toFixed(9).slice(2)}$`, Xe = "?" + C, zt = `<${Xe}>`, T = document, K = () => T.createComment(""), V = (t) => t === null || typeof t != "object" && typeof t != "function", me = Array.isArray, Mt = (t) => me(t) || typeof t?.[Symbol.iterator] == "function", se = `[ 	
\f\r]`, B = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ke = /-->/g, Ae = />/g, M = RegExp(`>|${se}(?:([^\\s"'>=/]+)(${se}*=${se}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Se = /'/g, Re = /"/g, Ze = /^(?:script|style|textarea|title)$/i, Et = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), u = Et(1), L = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), Ce = /* @__PURE__ */ new WeakMap(), E = T.createTreeWalker(T, 129);
function Qe(t, e) {
  if (!me(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $e !== void 0 ? $e.createHTML(e) : e;
}
const Tt = (t, e) => {
  const i = t.length - 1, a = [];
  let s, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", r = B;
  for (let c = 0; c < i; c++) {
    const o = t[c];
    let d, l, h = -1, _ = 0;
    for (; _ < o.length && (r.lastIndex = _, l = r.exec(o), l !== null); ) _ = r.lastIndex, r === B ? l[1] === "!--" ? r = ke : l[1] !== void 0 ? r = Ae : l[2] !== void 0 ? (Ze.test(l[2]) && (s = RegExp("</" + l[2], "g")), r = M) : l[3] !== void 0 && (r = M) : r === M ? l[0] === ">" ? (r = s ?? B, h = -1) : l[1] === void 0 ? h = -2 : (h = r.lastIndex - l[2].length, d = l[1], r = l[3] === void 0 ? M : l[3] === '"' ? Re : Se) : r === Re || r === Se ? r = M : r === ke || r === Ae ? r = B : (r = M, s = void 0);
    const p = r === M && t[c + 1].startsWith("/>") ? " " : "";
    n += r === B ? o + zt : h >= 0 ? (a.push(d), o.slice(0, h) + Je + o.slice(h) + C + p) : o + C + (h === -2 ? c : p);
  }
  return [Qe(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class W {
  constructor({ strings: e, _$litType$: i }, a) {
    let s;
    this.parts = [];
    let n = 0, r = 0;
    const c = e.length - 1, o = this.parts, [d, l] = Tt(e, i);
    if (this.el = W.createElement(d, a), E.currentNode = this.el.content, i === 2 || i === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (s = E.nextNode()) !== null && o.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const h of s.getAttributeNames()) if (h.endsWith(Je)) {
          const _ = l[r++], p = s.getAttribute(h).split(C), v = /([.?@])?(.*)/.exec(_);
          o.push({ type: 1, index: n, name: v[2], strings: p, ctor: v[1] === "." ? Dt : v[1] === "?" ? Pt : v[1] === "@" ? Lt : ie }), s.removeAttribute(h);
        } else h.startsWith(C) && (o.push({ type: 6, index: n }), s.removeAttribute(h));
        if (Ze.test(s.tagName)) {
          const h = s.textContent.split(C), _ = h.length - 1;
          if (_ > 0) {
            s.textContent = Q ? Q.emptyScript : "";
            for (let p = 0; p < _; p++) s.append(h[p], K()), E.nextNode(), o.push({ type: 2, index: ++n });
            s.append(h[_], K());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Xe) o.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = s.data.indexOf(C, h + 1)) !== -1; ) o.push({ type: 7, index: n }), h += C.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const a = T.createElement("template");
    return a.innerHTML = e, a;
  }
}
function N(t, e, i = t, a) {
  if (e === L) return e;
  let s = a !== void 0 ? i._$Co?.[a] : i._$Cl;
  const n = V(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== n && (s?._$AO?.(!1), n === void 0 ? s = void 0 : (s = new n(t), s._$AT(t, i, a)), a !== void 0 ? (i._$Co ??= [])[a] = s : i._$Cl = s), s !== void 0 && (e = N(t, s._$AS(t, e.values), s, a)), e;
}
class Ht {
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
    const { el: { content: i }, parts: a } = this._$AD, s = (e?.creationScope ?? T).importNode(i, !0);
    E.currentNode = s;
    let n = E.nextNode(), r = 0, c = 0, o = a[0];
    for (; o !== void 0; ) {
      if (r === o.index) {
        let d;
        o.type === 2 ? d = new Y(n, n.nextSibling, this, e) : o.type === 1 ? d = new o.ctor(n, o.name, o.strings, this, e) : o.type === 6 && (d = new Nt(n, this, e)), this._$AV.push(d), o = a[++c];
      }
      r !== o?.index && (n = E.nextNode(), r++);
    }
    return E.currentNode = T, s;
  }
  p(e) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, i), i += a.strings.length - 2) : a._$AI(e[i])), i++;
  }
}
class Y {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(e, i, a, s) {
    this.type = 2, this._$AH = g, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = a, this.options = s, this._$Cv = s?.isConnected ?? !0;
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
    e = N(this, e, i), V(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== L && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : Mt(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && V(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = W.createElement(Qe(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const n = new Ht(s, this), r = n.u(this.options);
      n.p(i), this.T(r), this._$AH = n;
    }
  }
  _$AC(e) {
    let i = Ce.get(e.strings);
    return i === void 0 && Ce.set(e.strings, i = new W(e)), i;
  }
  k(e) {
    me(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, s = 0;
    for (const n of e) s === i.length ? i.push(a = new Y(this.O(K()), this.O(K()), this, this.options)) : a = i[s], a._$AI(n), s++;
    s < i.length && (this._$AR(a && a._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const a = xe(e).nextSibling;
      xe(e).remove(), e = a;
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
  constructor(e, i, a, s, n) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = n, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = g;
  }
  _$AI(e, i = this, a, s) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) e = N(this, e, i, 0), r = !V(e) || e !== this._$AH && e !== L, r && (this._$AH = e);
    else {
      const c = e;
      let o, d;
      for (e = n[0], o = 0; o < n.length - 1; o++) d = N(this, c[a + o], i, o), d === L && (d = this._$AH[o]), r ||= !V(d) || d !== this._$AH[o], d === g ? e = g : e !== g && (e += (d ?? "") + n[o + 1]), this._$AH[o] = d;
    }
    r && !s && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class Dt extends ie {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class Pt extends ie {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class Lt extends ie {
  constructor(e, i, a, s, n) {
    super(e, i, a, s, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = N(this, e, i, 0) ?? g) === L) return;
    const a = this._$AH, s = e === g && a !== g || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, n = e !== g && (a === g || s);
    s && this.element.removeEventListener(this.name, this, a), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class Nt {
  constructor(e, i, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    N(this, e);
  }
}
const Ot = ge.litHtmlPolyfillSupport;
Ot?.(W, Y), (ge.litHtmlVersions ??= []).push("3.3.3");
const It = (t, e, i) => {
  const a = i?.renderBefore ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const n = i?.renderBefore ?? null;
    a._$litPart$ = s = new Y(e.insertBefore(K(), n), n, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const fe = globalThis;
class P extends D {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = It(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return L;
  }
}
P._$litElement$ = !0, P.finalized = !0, fe.litElementHydrateSupport?.({ LitElement: P });
const Ft = fe.litElementPolyfillSupport;
Ft?.({ LitElement: P });
(fe.litElementVersions ??= []).push("4.2.2");
const Bt = {
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
}, Ut = {
  climate: {
    hvac_action: ["cooling", "heating", "drying", "fan"]
  }
}, f = {
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
  max_visible_rows: 24,
  activity_density_buckets: 0,
  show_activity_density: !0,
  smart_filter: !0,
  activity_mode: "meaningful",
  hide_empty_rows: !0,
  hide_empty_groups: !0,
  min_row_active_seconds: 10,
  max_rows_per_group: 5,
  max_total_rows: 24,
  show_technical_entities: !1,
  show_config_entities: !1,
  show_diagnostic_entities: !1,
  show_inactive_baselines: !1,
  show_entity_id_when_name_missing: !1,
  summary_scope: "visible",
  collapse_groups: !1,
  timeline_height: "min(62svh, 680px)",
  mobile_breakpoint: 760
}, O = {
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
}, Z = [
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
}, jt = ["ar", "fa", "he", "iw", "ur"];
function I(t) {
  return t.includes(".") ? t.split(".")[0] ?? t : t;
}
function ne(t, e = /* @__PURE__ */ new Date()) {
  if (t.start_time) {
    const n = new Date(t.start_time), r = t.end_time ? new Date(t.end_time) : e;
    return { start: n, end: r };
  }
  const i = t.hours_to_show ?? 24, a = t.end_time ? new Date(t.end_time) : e;
  return { start: new Date(a.getTime() - i * 60 * 60 * 1e3), end: a };
}
function Gt(t, e) {
  if (t === !0 || t === "rtl") return !0;
  if (t === !1 || t === "ltr") return !1;
  const i = (e || document.documentElement.lang || navigator.language || "").toLowerCase();
  return jt.some(
    (a) => i === a || i.startsWith(`${a}-`)
  );
}
function A(t) {
  if (!Number.isFinite(t) || t <= 0) return "0 דק׳";
  const e = Math.round(t / 6e4), i = Math.floor(e / 60), a = e % 60;
  return i && a ? `${i}:${String(a).padStart(2, "0")} שעות` : i ? `${i} שעות` : `${a} דק׳`;
}
function x(t) {
  return new Intl.DateTimeFormat("he-IL", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(t);
}
function qt(t, e, i) {
  return Math.min(i, Math.max(e, t));
}
function G(t, e) {
  const i = e.end.getTime() - e.start.getTime();
  return i <= 0 ? 0 : qt(
    (t.getTime() - e.start.getTime()) / i * 100,
    0,
    100
  );
}
function et(t) {
  const [, e = t] = t.split(".");
  return e.replace(/_/g, " ");
}
function re(t, e = !1) {
  return t ? [
    t.entity.area,
    O[t.entity.domain] ?? t.entity.domain,
    e ? t.entity.entity_id : void 0
  ].filter(Boolean).join(" · ") : "אין מספיק נתונים";
}
function Kt(t, e, i = !1) {
  const a = [
    ["רכיב", t.entity.name],
    ["אזור", t.entity.area ?? "ללא אזור"],
    ["סוג", O[t.entity.domain] ?? t.entity.domain],
    ["מצב", z[e.category] ?? e.state],
    ["התחלה", x(e.start)],
    ["סיום", x(e.end)],
    ["משך", A(e.durationMs)]
  ];
  return i && a.push(["entity_id", t.entity.entity_id]), a;
}
const ze = /* @__PURE__ */ new WeakMap();
async function Vt(t, e) {
  const i = t.entities ?? [], a = e ? await Xt(e) : Zt(), s = i.map(
    (c) => typeof c == "string" ? { entity: c } : c
  );
  let n = !1;
  if (!s.length && e && t.auto_discover !== !1) {
    const c = Wt(t, e, a);
    n = c.fallbackUsed, s.push(...c.entities);
  }
  return {
    entities: s.filter((c) => c.entity && !c.hidden).map((c) => Yt(c, t, e, a)).filter((c) => !!c).filter(
      (c) => it(c.labels ?? [], t, a.labels)
    ),
    diagnostics: Qt(a, n, t)
  };
}
function Wt(t, e, i) {
  const a = t.domains?.length ? t.domains : Z, s = H(t.exclude_domains ?? []), n = H(t.areas ?? []), r = [];
  if (i.entities.length) {
    const c = Ee(i.areas, "area_id"), o = Ee(i.devices, "id");
    for (const d of i.entities) {
      if (d.disabled_by || d.hidden_by || !e.states[d.entity_id] || !tt(d, t, !1)) continue;
      const l = I(d.entity_id);
      if (s.has($(l)) || a.length && !a.includes(l) || !ue(d.entity_id, t)) continue;
      const h = d.device_id ? o.get(d.device_id) : void 0;
      if (h?.disabled_by) continue;
      const _ = d.area_id || h?.area_id || void 0;
      if (!_) continue;
      const p = c.get(_), v = p?.name ?? _;
      if (n.size && !n.has($(_)) && !n.has($(v)))
        continue;
      const y = at(d.labels, h?.labels, p?.labels);
      it(y, t, i.labels) && r.push({
        entity: d.entity_id,
        area: v,
        domain: l
      });
    }
    return { entities: r, fallbackUsed: !1 };
  }
  for (const [c, o] of Object.entries(e.states)) {
    const d = I(c);
    if (s.has($(d)) || a.length && !a.includes(d) || !ue(c, t)) continue;
    const l = b(o.attributes.area) ?? b(o.attributes.area_id);
    l && (n.size && !n.has($(l)) || r.push({ entity: c, area: l, domain: d }));
  }
  return { entities: r, fallbackUsed: !0 };
}
function Yt(t, e, i, a) {
  const s = i?.states[t.entity], n = a.entities.find(
    (F) => F.entity_id === t.entity
  ), r = ai(t.entity, e);
  if (n?.disabled_by || n?.hidden_by || n && !tt(n, e, r))
    return;
  const c = n?.device_id ? a.devices.find((F) => F.id === n.device_id) : void 0;
  if (c?.disabled_by) return;
  const o = t.area ? void 0 : n?.area_id || c?.area_id || void 0, d = t.area ?? ei(o, a) ?? b(s?.attributes?.area) ?? b(s?.attributes?.area_id);
  if (e.areas?.length && (!d || !ti(d, o, e.areas)))
    return;
  const l = t.domain ?? I(t.entity);
  if (!Jt(t.entity, l, e)) return;
  const h = at(
    n?.labels,
    c?.labels,
    o ? a.areas.find((F) => F.area_id === o)?.labels : void 0
  ), _ = s ? i?.formatEntityName?.(s) : void 0, p = s?.attributes?.friendly_name, v = b(t.name), y = b(n?.name) ?? b(n?.original_name), w = b(c?.name_by_user) ?? b(c?.name), m = b(_), k = b(p), ae = et(t.entity), vt = v ?? si(
    m ?? k ?? y ?? ae,
    w,
    t.entity,
    l
  );
  return {
    entity_id: t.entity,
    name: vt,
    area: d,
    area_id: o,
    domain: l,
    icon: t.icon ?? b(s?.attributes?.icon),
    labels: h,
    entity_category: b(n?.entity_category),
    device_id: b(n?.device_id),
    device_name: w,
    device_manufacturer: b(c?.manufacturer),
    device_model: b(c?.model),
    hidden_by: b(n?.hidden_by),
    disabled_by: b(n?.disabled_by),
    config: t
  };
}
function Jt(t, e, i) {
  return i.domains?.length && !H(i.domains).has($(e)) || H(i.exclude_domains ?? []).has($(e)) ? !1 : ue(t, i);
}
function ue(t, e) {
  const i = e.include_entity_globs ?? [], a = [
    ...e.exclude_entities ?? [],
    ...e.exclude_entity_globs ?? []
  ];
  return !(i.length && !i.some((s) => Me(s).test(t)) || a.length && a.some((s) => Me(s).test(t)));
}
function tt(t, e, i) {
  return i ? !0 : t.entity_category === "config" ? e.show_config_entities === !0 : t.entity_category === "diagnostic" ? e.show_diagnostic_entities === !0 : !0;
}
function it(t, e, i) {
  const a = ii(t, i), s = H(e.include_labels ?? []), n = H(e.exclude_labels ?? []);
  return !(n.size && [...n].some((r) => a.has(r)) || s.size && ![...s].some((r) => a.has(r)));
}
async function Xt(t) {
  const e = ze.get(t);
  if (e) return e;
  const i = Promise.all([
    J(t, "config/area_registry/list"),
    J(t, "config/device_registry/list"),
    J(t, "config/entity_registry/list"),
    J(t, "config/label_registry/list")
  ]).then(([a, s, n, r]) => ({
    areas: a.items,
    devices: s.items,
    entities: n.items,
    labels: r.items,
    areaRegistryAvailable: a.available,
    deviceRegistryAvailable: s.available,
    entityRegistryAvailable: n.available,
    labelRegistryAvailable: r.available
  }));
  return ze.set(t, i), i;
}
async function J(t, e) {
  try {
    const i = await t.callWS({ type: e });
    return {
      items: Array.isArray(i) ? i : [],
      available: Array.isArray(i)
    };
  } catch {
    return { items: [], available: !1 };
  }
}
function Zt() {
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
function Qt(t, e, i) {
  const a = [];
  return t.areaRegistryAvailable || a.push("area_registry_unavailable"), t.entityRegistryAvailable || a.push("entity_registry_unavailable"), t.deviceRegistryAvailable || a.push("device_registry_unavailable"), (i.include_labels?.length || i.exclude_labels?.length) && !t.labelRegistryAvailable && a.push("label_registry_unavailable"), {
    registryAvailable: t.areaRegistryAvailable || t.entityRegistryAvailable || t.deviceRegistryAvailable,
    areaRegistryAvailable: t.areaRegistryAvailable,
    entityRegistryAvailable: t.entityRegistryAvailable,
    deviceRegistryAvailable: t.deviceRegistryAvailable,
    labelRegistryAvailable: t.labelRegistryAvailable,
    registryEntityCount: t.entities.length,
    areaCount: t.areas.length,
    labelCount: t.labels.length,
    fallbackUsed: e,
    unavailableReasons: a
  };
}
function ei(t, e) {
  if (t)
    return e.areas.find((i) => i.area_id === t)?.name ?? t;
}
function ti(t, e, i) {
  const a = H(i);
  return a.has($(t)) || !!(e && a.has($(e)));
}
function ii(t, e) {
  const i = new Map(
    e.map((s) => [s.label_id, s.name])
  ), a = /* @__PURE__ */ new Set();
  for (const s of t) {
    a.add($(s));
    const n = i.get(s);
    n && a.add($(n));
  }
  return a;
}
function at(...t) {
  return [...new Set(t.flatMap((e) => e ?? []))];
}
function Me(t) {
  const e = t.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${e}$`);
}
function Ee(t, e) {
  return new Map(t.map((i) => [i[e], i]));
}
function H(t) {
  return new Set(t.map($).filter(Boolean));
}
function ai(t, e) {
  return (e.entities ?? []).some(
    (i) => typeof i == "string" ? i === t : i.entity === t
  );
}
function $(t) {
  return t.trim().toLowerCase();
}
function b(t) {
  return typeof t == "string" && t.trim() ? t.trim() : void 0;
}
function si(t, e, i, a) {
  if (!e || !t) return t;
  const s = $(t), n = $(e);
  return !s || !n || s.includes(n) || n.includes(s) ? t : a === "switch" && (ri(t) || ni(t) || t === et(i)) ? `${e} - ${t}` : t;
}
function ni(t) {
  const e = t.trim();
  return e.length <= 16 && /^[a-z0-9][a-z0-9 ._()/+-]*$/i.test(e);
}
function ri(t) {
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
  ])).has($(t));
}
function oi(t, e) {
  const i = e.search.trim().toLowerCase();
  return t.filter((a) => {
    const { entity: s } = a;
    if (e.areas.length && (!s.area || !e.areas.includes(s.area)) || e.domains.length && !e.domains.includes(s.domain) || i && ![
      s.entity_id,
      s.name,
      s.area,
      s.domain
    ].filter(Boolean).join(" ").toLowerCase().includes(i) || e.stateMode === "active_only" && a.totalActiveMs <= 0)
      return !1;
    if (e.stateMode === "currently_active") {
      const n = Date.now();
      if (!a.segments.some(
        (r) => r.active && r.start.getTime() <= n && r.end.getTime() >= n - 9e4
      ))
        return !1;
    }
    return !0;
  });
}
function Te(t, e) {
  if (e === "none" || e === "entity")
    return [He("all", "כל הרכיבים", t)];
  const i = /* @__PURE__ */ new Map();
  for (const a of t) {
    const s = e === "area" ? a.entity.area || "ללא אזור" : a.entity.domain || "other", n = i.get(s) ?? [];
    n.push(a), i.set(s, n);
  }
  return [...i.entries()].map(
    ([a, s]) => He(
      a,
      e === "domain" ? O[a] ?? a : a,
      s
    )
  ).sort(
    (a, s) => s.totalActiveMs - a.totalActiveMs || s.rows.length - a.rows.length || a.title.localeCompare(s.title, "he")
  );
}
function He(t, e, i) {
  const a = [...i].sort(
    (n, r) => r.totalActiveMs - n.totalActiveMs || r.eventCount - n.eventCount || +!!(r.currentCategory && r.currentCategory !== "off" && r.currentCategory !== "unknown") - +!!(n.currentCategory && n.currentCategory !== "off" && n.currentCategory !== "unknown") || n.entity.name.localeCompare(r.entity.name, "he")
  ), s = a.reduce(
    (n, r) => n + r.totalActiveMs,
    0
  );
  return {
    id: t,
    title: e,
    subtitle: `${a.length} רכיבים`,
    rows: a,
    totalActiveMs: s
  };
}
function ci(t) {
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
function De(t) {
  return t.config?.attributes?.length || t.config?.active_attributes && Object.keys(t.config.active_attributes).length ? !0 : ["climate", "humidifier", "water_heater"].includes(t.domain);
}
async function li(t, e, i, a) {
  const { withAttributes: s, withoutAttributes: n } = st(e), r = await Promise.all([
    n.length ? Pe(t, n, i, a, !0) : Promise.resolve({}),
    s.length ? Pe(t, s, i, a, !1) : Promise.resolve({})
  ]);
  return Object.assign({}, ...r);
}
function st(t) {
  return {
    withAttributes: t.filter(De),
    withoutAttributes: t.filter((e) => !De(e))
  };
}
async function Pe(t, e, i, a, s) {
  const n = e.map((c) => c.entity_id), r = await t.callWS({
    type: "history/history_during_period",
    entity_ids: n,
    start_time: i.start.toISOString(),
    end_time: i.end.toISOString(),
    minimal_response: a.minimal_response ?? !0,
    significant_changes_only: a.significant_changes_only ?? !0,
    no_attributes: s
  });
  return di(r, n);
}
function di(t, e) {
  const i = {};
  if (Array.isArray(t))
    return t.forEach((a, s) => {
      if (!Array.isArray(a)) return;
      const n = e[s], r = Le(a, n), c = r[0]?.entity_id ?? n;
      c && (i[c] = r);
    }), i;
  if (t && typeof t == "object")
    for (const [a, s] of Object.entries(
      t
    ))
      Array.isArray(s) && (i[a] = Le(s, a));
  return i;
}
function Le(t, e) {
  let i = e;
  return t.map((a) => {
    if (!a || typeof a != "object") return;
    const s = a, n = S(s.entity_id) ?? i;
    n && (i = n);
    const r = S(s.last_changed) ?? S(s.lc) ?? S(s.last_updated) ?? S(s.lu), c = S(s.state) ?? S(s.s);
    if (!n || !c || !r) return;
    const o = Ne(s.attributes) ?? Ne(s.a), d = {
      entity_id: n,
      state: c,
      last_changed: r
    };
    o && (d.attributes = o);
    const l = S(s.last_updated) ?? S(s.lu);
    return l && (d.last_updated = l), d;
  }).filter((a) => a !== void 0);
}
function S(t) {
  return typeof t == "string" ? t : void 0;
}
function Ne(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : void 0;
}
function Oe(t, e, i, a, s = {}) {
  return e.map((n) => {
    const r = hi(
      t[n.entity_id] ?? [],
      s[n.entity_id],
      i,
      n.entity_id
    ).filter((l) => l.state != null && l.last_changed).sort(
      (l, h) => new Date(l.last_changed).getTime() - new Date(h.last_changed).getTime()
    ), c = pi(r), o = _i(c, n, i, a), d = o.filter((l) => l.active);
    return {
      entity: n,
      segments: o,
      totalActiveMs: d.reduce(
        (l, h) => l + h.durationMs,
        0
      ),
      eventCount: d.length,
      currentState: o.at(-1)?.state,
      currentCategory: o.at(-1)?.category
    };
  });
}
function hi(t, e, i, a) {
  const s = [...t];
  if (!e) return s;
  const n = new Date(
    e.last_changed || e.last_updated
  ).getTime(), r = Number.isFinite(n) ? Math.min(
    Math.max(n, i.start.getTime()),
    i.end.getTime()
  ) : i.start.getTime(), c = s.filter((o) => o.entity_id === a).sort(
    (o, d) => new Date(o.last_changed).getTime() - new Date(d.last_changed).getTime()
  ).at(-1);
  return (!c || new Date(c.last_changed).getTime() < r || c.state !== e.state) && s.push({
    entity_id: a,
    state: e.state,
    attributes: e.attributes,
    last_changed: new Date(r).toISOString(),
    last_updated: e.last_updated
  }), s;
}
function ui(t, e, i) {
  if (e === "unknown" || e === "unavailable")
    return { category: "unknown", active: !1 };
  const a = t.domain || I(t.entity_id), n = t.config?.active_states ?? Bt[a] ?? ["on"], r = t.config?.active_attributes ?? Ut[a] ?? {};
  if (a === "climate" && !t.config?.active_states) {
    const o = i?.hvac_action;
    if (typeof o == "string" && o.trim()) {
      const d = r.hvac_action ?? [];
      return {
        category: oe(a, o),
        active: d.includes(o)
      };
    }
  }
  for (const [o, d] of Object.entries(r)) {
    const l = i?.[o];
    if (typeof l == "string" && d.includes(l))
      return { category: oe(a, l), active: !0 };
  }
  const c = n.includes(e);
  return { category: oe(a, e), active: c };
}
function _i(t, e, i, a) {
  if (!t.length) return [];
  const s = [], n = i.start.getTime(), r = i.end.getTime();
  for (let o = 0; o < t.length; o += 1) {
    const d = t[o];
    if (!d) continue;
    const l = t[o + 1], h = new Date(d.last_changed).getTime(), _ = l ? new Date(l.last_changed).getTime() : r, p = Math.max(h, n), v = Math.min(_, r);
    if (v <= p) continue;
    const y = ui(
      e,
      d.state,
      d.attributes
    ), w = v - p;
    s.push({
      entity_id: e.entity_id,
      state: d.state,
      category: y.category,
      active: y.active,
      start: new Date(p),
      end: new Date(v),
      durationMs: w,
      attributes: d.attributes
    });
  }
  return gi(s, a.merge_gap_seconds ?? 0).filter(
    (o) => !o.active || !a.min_duration_seconds || o.durationMs >= a.min_duration_seconds * 1e3
  );
}
function pi(t) {
  const e = [];
  for (const i of t) {
    const a = e.at(-1);
    a && a.state === i.state && Ie(a) === Ie(i) || e.push(i);
  }
  return e;
}
function Ie(t) {
  const e = t.attributes ?? {}, i = {
    hvac_action: e.hvac_action,
    temperature: e.temperature,
    current_temperature: e.current_temperature,
    media_title: e.media_title
  };
  return JSON.stringify(i);
}
function gi(t, e) {
  if (!t.length) return t;
  const i = Math.max(0, e) * 1e3, a = [];
  for (const s of t) {
    const n = a.at(-1);
    n && n.entity_id === s.entity_id && n.category === s.category && n.state === s.state && s.start.getTime() - n.end.getTime() <= i ? (n.end = s.end, n.durationMs = n.end.getTime() - n.start.getTime()) : a.push({ ...s });
  }
  return a;
}
function oe(t, e) {
  return e === "unknown" || e === "unavailable" ? "unknown" : ["off", "closed", "idle", "paused", "standby"].includes(e) ? e === "idle" ? "idle" : "off" : ["cool", "cooling"].includes(e) ? "cooling" : ["heat", "heating"].includes(e) ? "heating" : ["playing"].includes(e) ? "playing" : ["opening", "open"].includes(e) ? "opening" : ["closing"].includes(e) ? "closing" : t === "climate" && ["drying", "dry"].includes(e) ? "drying" : t === "climate" && ["fan", "fan_only"].includes(e) ? "fan" : "on";
}
const Fe = [
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
function mi(t) {
  return nt(t).map((e) => ({
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
function fi(t, e) {
  const i = {}, a = t.end.getTime();
  for (const s of nt(e)) {
    const n = [
      ce(s.entity_id, "off", t.start.getTime(), void 0)
    ];
    for (const r of s.pattern) {
      const c = a + r.startHour * 36e5, o = a + r.endHour * 36e5;
      o <= t.start.getTime() || c >= t.end.getTime() || (n.push(
        ce(
          s.entity_id,
          r.state,
          Math.max(c, t.start.getTime()),
          r.attributes
        )
      ), n.push(
        ce(
          s.entity_id,
          "off",
          Math.min(o, t.end.getTime()),
          void 0
        )
      ));
    }
    i[s.entity_id] = n.sort(
      (r, c) => new Date(r.last_changed).getTime() - new Date(c.last_changed).getTime()
    ).filter(
      (r, c, o) => c === 0 || r.last_changed !== o[c - 1]?.last_changed
    );
  }
  return i;
}
function nt(t) {
  return t === "large_noisy_home" ? [...Fe, ...vi()] : Fe;
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
  ], e = ["בריכה", "מטבח", "סלון", "חדר שירות", "חדרי ילדים"], i = ["switch", "sensor", "binary_sensor", "switch", "switch"], a = [];
  for (let s = 0; s < 170; s += 1) {
    const n = t[s % t.length] ?? "Power", r = i[s % i.length] ?? "switch", c = s % 7 === 0 ? "diagnostic" : s % 11 === 0 ? "config" : void 0, o = n.toLowerCase().replace(/[^a-z0-9\u0590-\u05ff]+/gi, "_").replace(/^_+|_+$/g, "");
    a.push({
      entity_id: `${r}.large_noisy_${s}_${o || "entity"}`,
      name: n,
      area: e[s % e.length] ?? "ללא אזור",
      domain: r,
      icon: r === "sensor" ? "mdi:gauge" : "mdi:toggle-switch",
      entity_category: c,
      labels: s % 13 === 0 ? ["לא להצגה"] : void 0,
      pattern: s % 19 === 0 ? [{ startHour: -2, endHour: -1.95, state: "on" }] : []
    });
  }
  return a;
}
function ce(t, e, i, a) {
  return {
    entity_id: t,
    state: e,
    attributes: a,
    last_changed: new Date(i).toISOString(),
    last_updated: new Date(i).toISOString()
  };
}
function bi(t, e, i = 320, a = 220) {
  if (e.width <= 640)
    return {
      x: 12,
      y: Math.max(12, e.height - a - 12),
      placement: "bottom"
    };
  const s = 16, n = t.left + t.width / 2 - i / 2, r = t.top + t.height + 12, c = Be(n, s, e.width - i - s), o = Be(r, s, e.height - a - s);
  return { x: c, y: o, placement: "floating" };
}
function Be(t, e, i) {
  return i < e ? e : Math.min(i, Math.max(e, t));
}
function rt(t) {
  return !Number.isFinite(t) || !t ? 300 : Math.max(30, Math.floor(t));
}
function yi(t) {
  if (!t.hasFetchedOnce) return !0;
  if (!t.live) return !1;
  const e = rt(t.refreshIntervalSeconds) * 1e3;
  return t.now - t.lastHistoryFetchAt >= e;
}
function wi() {
  return u`<div class="ahc-state-card">
    <div>
      <h3 class="ahc-state-card__title">קורלציות</h3>
      <p>מצב קורלציה ויומן אירועים יפותח בשלב הבא.</p>
    </div>
  </div>`;
}
function xi() {
  return u`<div class="ahc-state-card">
    <div>
      <h3 class="ahc-state-card__title">פירוט רכיב</h3>
      <p>מסך Drill-down לרכיב יפותח אחרי תצוגת Swimlane.</p>
    </div>
  </div>`;
}
function $i() {
  return u`<div class="ahc-state-card">
    <div>
      <h3 class="ahc-state-card__title">Heatmap</h3>
      <p>מצב זה יפותח אחרי ה-MVP.</p>
    </div>
  </div>`;
}
function ki(t, e, i) {
  const a = Ai(e, i), s = Si(e, a), n = s.map(() => /* @__PURE__ */ new Set());
  for (const c of t)
    for (const o of c.segments)
      if (o.active)
        for (let d = 0; d < s.length; d += 1) {
          const l = s[d];
          if (!l) continue;
          const h = Ri(o, l.start, l.end);
          h <= 0 || (l.totalActiveMs += h, l.eventCount += Ci(o, l) ? 1 : 0, n[d]?.add(c.entity.entity_id));
        }
  const r = Math.max(
    1,
    ...s.map((c) => c.totalActiveMs)
  );
  return s.map((c, o) => ({
    ...c,
    activeEntityCount: n[o]?.size ?? 0,
    intensity: c.totalActiveMs / r
  }));
}
function Ai(t, e) {
  const i = e.activity_density_buckets;
  if (typeof i == "number" && Number.isFinite(i) && i > 0)
    return Math.max(1, Math.floor(i));
  const a = Math.max(
    1,
    (t.end.getTime() - t.start.getTime()) / 36e5
  );
  return a <= 30 ? 24 : a <= 24 * 3 ? 48 : 84;
}
function Si(t, e) {
  const i = t.start.getTime(), a = t.end.getTime(), n = Math.max(1, a - i) / e;
  return Array.from({ length: e }, (r, c) => {
    const o = i + c * n, d = c === e - 1 ? a : o + n;
    return {
      start: new Date(o),
      end: new Date(d),
      totalActiveMs: 0,
      eventCount: 0,
      activeEntityCount: 0,
      intensity: 0
    };
  });
}
function Ri(t, e, i) {
  const a = Math.max(t.start.getTime(), e.getTime()), s = Math.min(t.end.getTime(), i.getTime());
  return Math.max(0, s - a);
}
function Ci(t, e) {
  const i = t.start.getTime();
  return i >= e.start.getTime() && i < e.end.getTime();
}
const zi = [
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
], Mi = [
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
], Ei = /* @__PURE__ */ new Set([
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
function le(t, e, i = {}) {
  const a = i.showAll === !0 || e.activity_mode === "all", s = Ui(e, a), n = e.smart_filter !== !1 && s === "meaningful" && !a, r = e.show_inactive_baselines ?? f.show_inactive_baselines, c = /* @__PURE__ */ new Map(), o = dt(e), d = (ht(e.min_row_active_seconds) ?? f.min_row_active_seconds) * 1e3, l = je(e.max_rows_per_group) ?? f.max_rows_per_group, h = je(e.max_total_rows) ?? f.max_total_rows;
  let _ = 0;
  const p = [], v = [];
  for (const w of t) {
    const m = o.has(w.entity.entity_id);
    m && (_ += 1);
    const k = n ? Di(w, e, d, m) : { row: w };
    k.reason ? (v.push(w), c.set(w.entity.entity_id, k.reason)) : k.row && p.push(k.row);
  }
  const y = n ? Li(p, v, c, {
    groupBy: i.groupBy ?? "area",
    manualEntityIds: o,
    maxRowsPerGroup: l,
    maxTotalRows: h
  }) : { rows: p, hiddenRows: v };
  return {
    rows: y.rows,
    hiddenRows: y.hiddenRows,
    hiddenReasons: c,
    diagnostics: Oi({
      totalRows: t.length,
      visibleRows: y.rows.length,
      hiddenRows: y.hiddenRows.length,
      hiddenReasons: c,
      smartFilter: n,
      activityMode: s,
      showInactiveBaselines: r,
      showAll: a,
      manualRowsProtected: _,
      maxRowsPerGroup: l,
      maxTotalRows: h
    })
  };
}
function Ti(t, e) {
  if (dt(e).has(t.entity_id))
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
    const i = Fi(t);
    if (Ii(t))
      return { visible: !1, reason: "technical", confidence: "heuristic" };
    if (i)
      return { visible: !1, reason: "noisy_name", confidence: "heuristic" };
  }
  return { visible: !0, confidence: "heuristic" };
}
function Hi(t, e) {
  return t.segments.filter(
    (i) => ct(i) && i.durationMs >= e
  );
}
function q(t) {
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
function Di(t, e, i, a) {
  const s = Ti(t.entity, e);
  if (!a && !s.visible)
    return { reason: s.reason ?? "technical" };
  const n = Hi(t, i);
  return n.length ? { row: Pi(t, n) } : a ? { row: t } : (e.hide_empty_rows ?? f.hide_empty_rows) === !1 ? { row: t } : t.segments.length ? {
    reason: t.segments.some(
      (c) => ct(c) && c.durationMs < i
    ) ? "too_short" : "no_meaningful_activity"
  } : { reason: "empty" };
}
function Pi(t, e) {
  const i = e.reduce(
    (s, n) => s + n.durationMs,
    0
  ), a = t.currentCategory;
  return {
    ...t,
    segments: e,
    totalActiveMs: i,
    eventCount: e.length,
    currentCategory: a && !ot.has(a) ? a : void 0
  };
}
function ct(t) {
  return t.active && !ot.has(t.category);
}
function Li(t, e, i, a) {
  const s = t.filter(
    (h) => a.manualEntityIds.has(h.entity.entity_id)
  ), n = t.filter(
    (h) => !a.manualEntityIds.has(h.entity.entity_id)
  ), r = /* @__PURE__ */ new Map();
  for (const h of de(n)) {
    const _ = Ni(h, a.groupBy), p = r.get(_) ?? [];
    if (p.length >= a.maxRowsPerGroup) {
      e.push(h), i.set(h.entity.entity_id, "max_rows");
      continue;
    }
    p.push(h), r.set(_, p);
  }
  const c = [...r.values()].flat(), o = new Set(
    s.map((h) => h.entity.entity_id)
  ), d = [
    ...de(s),
    ...de(c)
  ], l = [];
  for (const h of d) {
    if (!o.has(h.entity.entity_id) && l.length >= a.maxTotalRows) {
      e.push(h), i.set(h.entity.entity_id, "max_rows");
      continue;
    }
    l.push(h);
  }
  return { rows: l, hiddenRows: e };
}
function de(t) {
  return [...t].sort(
    (e, i) => Number(Ue(i)) - Number(Ue(e)) || i.totalActiveMs - e.totalActiveMs || i.eventCount - e.eventCount || e.entity.name.localeCompare(i.entity.name, "he")
  );
}
function Ue(t) {
  const e = Date.now();
  return t.segments.some(
    (i) => i.active && i.start.getTime() <= e && i.end.getTime() >= e - 9e4
  );
}
function Ni(t, e) {
  return e === "domain" ? t.entity.domain || "other" : e === "none" || e === "entity" ? "all" : t.entity.area || "ללא אזור";
}
function Oi(t) {
  const e = {};
  for (const i of t.hiddenReasons.values())
    e[i] = (e[i] ?? 0) + 1;
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
function Ii(t) {
  const e = Bi(t, !0);
  return Mi.some((i) => lt(e, i));
}
function Fi(t) {
  const e = ee(t.name), i = ee(t.entity_id), a = `${e} ${i}`;
  return t.domain === "switch" && Ei.has(e) ? !0 : zi.some((s) => lt(a, s));
}
function Bi(t, e = !1) {
  return [
    t.entity_id,
    t.name,
    e ? t.device_name : void 0,
    e ? t.device_manufacturer : void 0,
    e ? t.device_model : void 0,
    ...t.labels ?? []
  ].filter(Boolean).map((i) => ee(String(i))).join(" ");
}
function lt(t, e) {
  const i = ee(e);
  if (!i) return !1;
  if (/^[a-z0-9 ]+$/i.test(i)) {
    const a = i.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|\\s)${a}(\\s|$)`, "i").test(t);
  }
  return t.includes(i);
}
function Ui(t, e) {
  return e ? "all" : t.activity_mode ?? f.activity_mode;
}
function dt(t) {
  return new Set(
    (t.entities ?? []).map(
      (e) => typeof e == "string" ? e : e.entity
    )
  );
}
function ht(t) {
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : void 0;
}
function je(t) {
  const e = ht(t);
  return e ? Math.floor(e) : void 0;
}
function ee(t) {
  return t.trim().toLowerCase().replace(/[_./-]+/g, " ").replace(/\s+/g, " ");
}
const ut = {
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
}, ji = [
  [/סלון|living/i, "mdi:sofa"],
  [/מטבח|kitchen/i, "mdi:countertop"],
  [/שינה|הורים|bed/i, "mdi:bed"],
  [/ילד|ילדים|kids|child/i, "mdi:bunk-bed"],
  [/מרפסת|גינה|garden|balcony/i, "mdi:flower"],
  [/כניסה|entry|door/i, "mdi:door"]
];
function Gi(t) {
  if (t.icon?.startsWith("mdi:") || t.icon && !t.icon.includes(":")) return t.icon;
  const e = t.domain || I(t.entity_id);
  return ut[e] ?? "mdi:circle-medium";
}
function qi(t) {
  if (t.icon?.startsWith("mdi:") || t.icon && !t.icon.includes(":")) return t.icon;
  const e = ut[t.id];
  return e || (ji.find(([a]) => a.test(t.title))?.[1] ?? "mdi:home-outline");
}
function _t(t, e) {
  return t.startsWith("mdi:") ? u`<ha-icon class=${e} icon=${t}></ha-icon>` : u`<span class=${e} aria-hidden="true">${t}</span>`;
}
function pt(t, e = "ahc-entity-icon") {
  return _t(Gi(t), e);
}
function gt(t, e = "ahc-group-icon") {
  return _t(qi(t), e);
}
function Ki(t) {
  return t > 70 ? "ultra-dense" : t > 30 ? "dense" : "normal";
}
function mt(t, e) {
  const i = t.reduce(
    (c, o) => c + o.rows.length,
    0
  );
  let s = Number.isFinite(e) && e && e > 0 ? Math.floor(e) : i;
  const n = [];
  for (const c of t) {
    if (s <= 0) {
      n.push({ ...c, rows: [] });
      continue;
    }
    const o = c.rows.slice(0, s);
    s -= o.length, n.push({ ...c, rows: o });
  }
  const r = n.reduce(
    (c, o) => c + o.rows.length,
    0
  );
  return {
    groups: n,
    totalRowCount: i,
    visibleRowCount: r,
    hiddenRowCount: Math.max(0, i - r),
    density: Ki(r)
  };
}
const Vi = 0.5;
function Wi(t, e) {
  const i = e.start.getTime(), a = e.end.getTime(), s = Math.max(1, a - i), n = Math.max(t.start.getTime(), i), r = Math.min(t.end.getTime(), a), c = Math.min(Math.max(n, i), a), o = Math.min(Math.max(r, i), a), d = Math.max(0, o - c), l = Ge((c - i) / s * 100), h = Ge(d / s * 100);
  return {
    leftPct: l,
    widthPct: h,
    minVisible: t.active && d > 0 && h < Vi
  };
}
function Ge(t) {
  return Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : 0;
}
function Yi(t) {
  const e = ft(
    t.groups,
    t.range,
    t.config
  ), i = ta(t.range), a = q(t.curation), s = ia(t.range);
  return e.visibleRowCount ? u`
    <section class="ahc-activity" aria-label="ציר זמן פעילות">
      <header class="ahc-activity__header">
        <div class="ahc-activity__heading">
          <h3>ציר זמן פעילות</h3>
          <p>
            מציג ${e.visibleRowCount} רכיבים פעילים מתוך
            ${t.curation?.totalRows ?? e.totalRowCount}
            ${e.hiddenRowCount ? u` · ${e.hiddenRowCount} נוספים הוסתרו מהתצוגה` : null}
            ${a ? u` · ${a}` : null}
          </p>
        </div>
        <div class="ahc-activity__range">${s}</div>
      </header>

      ${t.config.show_activity_density === !1 ? null : Zi(e.density)}

      <div class="ahc-activity__axis" dir="ltr" aria-hidden="true">
        ${i.map(
    (n) => u`<span class="ahc-activity__tick" style="left:${n.percent}%"
              >${n.label}</span
            >`
  )}
      </div>

      <div class="ahc-activity__groups">
        ${e.groups.map(
    (n) => Ji(n, t.range, t)
  )}
      </div>

      ${e.hiddenRowCount ? u`<p class="ahc-activity__more">
            + ${e.hiddenRowCount} רכיבים נוספים הוסתרו. אפשר ללחוץ “הצג
            הכל” למצב legacy/debug.
          </p>` : null}
    </section>
  ` : Qi();
}
function ft(t, e, i) {
  const a = t.map((c) => {
    const o = c.rows.filter(ea), d = o.reduce(
      (l, h) => l + h.totalActiveMs,
      0
    );
    return {
      ...c,
      rows: o,
      totalActiveMs: d,
      subtitle: `${o.length} רכיבים`
    };
  }).filter((c) => c.rows.length > 0).sort(
    (c, o) => o.totalActiveMs - c.totalActiveMs || o.rows.length - c.rows.length || c.title.localeCompare(o.title, "he")
  ), s = mt(
    a,
    i.max_visible_rows ?? i.max_total_rows
  ), n = s.groups.filter((c) => c.rows.length > 0), r = n.flatMap((c) => c.rows);
  return {
    groups: n,
    density: ki(r, e, i),
    totalRowCount: s.totalRowCount,
    visibleRowCount: r.length,
    hiddenRowCount: Math.max(0, s.totalRowCount - r.length)
  };
}
function Ji(t, e, i) {
  return u`
    <article class="ahc-activity-group" aria-label=${t.title}>
      <header class="ahc-activity-group__header">
        <span class="ahc-activity-group__title">
          ${gt(t)}<strong>${t.title}</strong>
        </span>
        <span class="ahc-activity-group__meta">
          ${t.rows.length} רכיבים · ${A(t.totalActiveMs)}
        </span>
      </header>
      <div class="ahc-activity-group__rows">
        ${t.rows.map((a) => Xi(a, e, i))}
      </div>
    </article>
  `;
}
function Xi(t, e, i) {
  return u`
    <div class="ahc-activity-row">
      <div class="ahc-activity-row__label" dir="rtl">
        ${pt(t.entity)}
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
        ${t.segments.map((a, s) => {
    if (!a.active) return null;
    const n = Wi(a, e);
    if (n.widthPct <= 0) return null;
    const r = `${t.entity.name}, ${z[a.category]}, ${x(a.start)} עד ${x(a.end)}, ${A(
      a.durationMs
    )}`;
    return u`
            <button
              class="ahc-activity-segment"
              type="button"
              data-category=${a.category}
              data-min-visible=${n.minVisible ? "true" : "false"}
              style=${`left:${n.leftPct}%;width:max(var(--ahc-activity-segment-min-width), ${n.widthPct}%);`}
              aria-label=${r}
              @click=${(c) => i.onSegmentClick?.(c, t.entity.entity_id, s)}
            >
              <span>${z[a.category]}</span>
            </button>
          `;
  })}
      </div>
    </div>
  `;
}
function Zi(t) {
  return u`
    <div
      class="ahc-activity__density-strip"
      dir="ltr"
      aria-label="צפיפות פעילות לאורך הזמן"
    >
      ${t.map(
    (e) => u`
          <span
            class="ahc-activity__density-bar"
            style=${`--intensity:${e.intensity}`}
            title=${`${x(e.start)} - ${x(
      e.end
    )}: ${A(e.totalActiveMs)}`}
          ></span>
        `
  )}
    </div>
  `;
}
function Qi() {
  return u`
    <section class="ahc-activity ahc-activity-empty">
      <h3>לא נמצאה פעילות משמעותית בטווח הזה</h3>
      <p>נסה להגדיל את טווח הזמן, להציג את כל הרכיבים, או לפתוח סינון מתקדם.</p>
    </section>
  `;
}
function ea(t) {
  return t.segments.some((e) => e.active);
}
function ta(t) {
  const e = Math.max(
    1,
    (t.end.getTime() - t.start.getTime()) / 36e5
  ), i = e <= 24 ? 3 : e <= 72 ? 6 : 24, a = [], s = new Date(t.start);
  for (s.setMinutes(0, 0, 0); s < t.end; )
    s >= t.start && a.push({
      label: x(s),
      percent: G(s, t)
    }), s.setHours(s.getHours() + i);
  return a.push({ label: x(t.end), percent: 100 }), a;
}
function ia(t) {
  const e = Math.round(
    (t.end.getTime() - t.start.getTime()) / 36e5
  );
  return e >= 24 * 7 ? "7 ימים" : e >= 24 ? `${Math.round(e / 24)} ימים` : `${e} שעות`;
}
function aa(t) {
  const e = mt(
    t.groups,
    t.config.max_visible_rows
  ), i = oa(t.range), a = q(t.curation), s = /* @__PURE__ */ new Date(), n = G(s, t.range), r = t.config.show_inactive_baselines === !0, c = t.config.show_now_line !== !1 && s.getTime() >= t.range.start.getTime() && s.getTime() <= t.range.end.getTime() + 9e4;
  return u`
    <section
      class=${`ahc-timeline-card ahc-timeline-card--${e.density}${r ? " ahc-timeline-card--baselines" : ""}`}
      aria-label="ציר זמן פעילות"
      style=${t.config.timeline_height ? `--ahc-timeline-height:${t.config.timeline_height}` : ""}
    >
      <div class="ahc-timeline-toolbar">
        <h3 class="ahc-timeline-title">ציר זמן פעילות</h3>
        <span class="ahc__metric-subtitle">
          ${x(t.range.start)} – ${x(t.range.end)}
          ${e.hiddenRowCount ? ` · מציג ${e.visibleRowCount} מתוך ${e.totalRowCount}` : ""}
        </span>
        ${a ? u`<span class="ahc-curation-note">${a}</span>` : null}
      </div>
      <div class="ahc-timeline-scroll">
        <div class="ahc-timeline" dir="ltr">
          <div class="ahc-timeline__axis" aria-hidden="true">
            <div class="ahc-timeline__ticks">
              ${i.map(
    (o) => u`<span
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
    const d = sa(
      o,
      t.config
    );
    return u`
                <details
                  class="ahc-group"
                  aria-label=${o.title}
                  ?open=${!d}
                >
                  <summary class="ahc-group__header">
                    <span class="ahc-group__title"
                      >${gt(o)}<span
                        >${o.title}</span
                      ></span
                    >
                    <span class="ahc-group__meta"
                      >${A(o.totalActiveMs)} •
                      ${o.subtitle ?? ""}</span
                    >
                  </summary>
                  ${o.rows.map(
      (l) => u`
                      <div class="ahc-row">
                        <div class="ahc-row__track">
                          <svg
                            class="ahc-row__svg"
                            viewBox="0 0 100 32"
                            preserveAspectRatio="none"
                            role="img"
                            aria-label=${`ציר זמן עבור ${l.entity.name}`}
                          >
                            ${r ? u`<line
                                  class="ahc-row__svg-track"
                                  x1="1"
                                  x2="99"
                                  y1="16"
                                  y2="16"
                                ></line>` : null}
                            ${l.segments.map((h, _) => {
        const p = G(
          h.start,
          t.range
        ), v = G(
          h.end,
          t.range
        ), y = Math.max(0.65, v - p);
        if (!na(
          h,
          t.config
        ))
          return null;
        const w = `${l.entity.name}, ${z[h.category]}, ${x(h.start)} עד ${x(h.end)}, ${A(h.durationMs)}`;
        return u`
                                <rect
                                  class=${h.active ? "ahc-segment-svg" : "ahc-segment-svg ahc-segment-svg--inactive"}
                                  data-category=${h.category}
                                  data-active=${h.active ? "true" : "false"}
                                  x=${p}
                                  y=${h.active ? "12" : "15"}
                                  width=${y}
                                  height=${h.active ? "8" : "2"}
                                  rx=${h.active ? "4" : "1"}
                                  tabindex="0"
                                  role="button"
                                  aria-label=${w}
                                  @click=${(m) => t.onSegmentClick?.(
          m,
          l.entity.entity_id,
          _
        )}
                                  @keydown=${(m) => {
          (m.key === "Enter" || m.key === " ") && (m.preventDefault(), t.onSegmentClick?.(
            m,
            l.entity.entity_id,
            _
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
                          ${pt(l.entity)}
                          <span
                            class="ahc-row__name"
                            title=${t.config.debug ? l.entity.entity_id : l.entity.name}
                            >${l.entity.name}</span
                          >
                          ${l.currentCategory ? u`<span
                                class="ahc-row__state-chip"
                                data-state=${l.currentCategory}
                                >${z[l.currentCategory]}</span
                              >` : null}
                        </div>
                      </div>
                    `
    )}
                  ${o.rows.length ? null : u`<div class="ahc-group__empty">
                        אין שורות גלויות בקבוצה הזו
                      </div>`}
                </details>
              `;
  })}
          </div>
          ${c ? u`<div class="ahc-now-line" style="left:${n}%">
                <span class="ahc-now-line__label">עכשיו</span>
              </div>` : null}
        </div>
      </div>
      ${t.config.show_legend === !1 ? null : ra()}
    </section>
  `;
}
function sa(t, e) {
  const i = new Set(e.default_collapsed_groups ?? []);
  return i.has(t.id) || i.has(t.title) ? !0 : !!(e.collapse_groups && t.totalActiveMs <= 0);
}
function na(t, e) {
  return t.active || e.show_inactive_baselines === !0;
}
function ra() {
  return u`<div class="ahc-legend" aria-label="מקרא">
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
    ([e, i]) => u`<span class="ahc-legend__item"
          ><span class="ahc-legend__swatch" style="--swatch:${i}"></span
          >${z[e]}</span
        >`
  )}
  </div>`;
}
function oa(t) {
  const e = Math.max(
    1,
    (t.end.getTime() - t.start.getTime()) / 36e5
  ), i = e <= 24 ? 3 : e <= 72 ? 6 : 24, a = [], s = new Date(t.start);
  for (s.setMinutes(0, 0, 0); s < t.end; )
    s >= t.start && a.push({
      label: x(s),
      percent: G(s, t)
    }), s.setHours(s.getHours() + i);
  return a.push({ label: x(t.end), percent: 100 }), a;
}
const ca = We`
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

  /* Top bar */
  .ahc__topbar {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: var(--ahc-gap-md);
    align-items: start;
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

  .ahc__toolbar {
    display: flex;
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
    grid-template-columns: minmax(0, 4fr) minmax(260px, 1fr);
    gap: var(--ahc-gap-md);
    align-items: start;
    max-inline-size: 1920px;
  }

  .ahc__body--no-insights {
    grid-template-columns: minmax(0, 1fr);
  }

  .ahc__main,
  .ahc__timeline-panel {
    min-inline-size: 0;
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
    max-inline-size: 340px;
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
    }
  }

  @media (max-width: 760px) {
    :host {
      --ahc-chip-height: 44px;
      --ahc-label-width: 180px;
      --ahc-activity-label-width: 160px;
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
    }
  }

  @media (max-width: 420px) {
    :host {
      --ahc-label-width: 130px;
      --ahc-activity-label-width: 132px;
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
function U(t) {
  const e = t.flatMap((_) => _.rows), i = e.flatMap(
    (_) => _.segments.filter((p) => p.active)
  ), a = i.reduce(
    (_, p) => _ + p.durationMs,
    0
  ), s = e.filter((_) => _.totalActiveMs > 0), n = i.length, r = Date.now(), c = e.filter(
    (_) => _.segments.some(
      (p) => p.active && p.start.getTime() <= r && p.end.getTime() >= r - 9e4
    )
  ).length, o = [...i].sort(
    (_, p) => p.start.getTime() - _.start.getTime()
  )[0], d = o ? e.find((_) => _.entity.entity_id === o.entity_id) : void 0, l = [...s].sort(
    (_, p) => p.totalActiveMs - _.totalActiveMs
  )[0], h = [...t].filter((_) => _.totalActiveMs > 0).sort((_, p) => p.totalActiveMs - _.totalActiveMs)[0];
  return {
    totalActiveMs: a,
    activeEntityCount: s.length,
    eventCount: n,
    activeNowCount: c,
    lastEvent: o,
    lastEventRow: d,
    mostActiveEntity: l,
    mostActiveArea: h,
    peakBucketLabel: la(i)
  };
}
function la(t) {
  if (!t.length) return;
  const e = new Array(24).fill(0);
  for (const s of t) {
    const n = s.start.getHours();
    e[n] = (e[n] ?? 0) + s.durationMs;
  }
  const i = Math.max(...e), a = e.indexOf(i);
  if (!(a < 0))
    return `${String(a).padStart(2, "0")}:00 – ${String((a + 1) % 24).padStart(2, "0")}:00`;
}
function qe(t, e = !1) {
  const i = t.view_mode ?? t.default_view ?? f.view_mode;
  return e && i === "activity" || i === "legacy_swimlane" || i === "swimlane" && t.timeline_style === "legacy" ? "legacy_swimlane" : i === "heatmap" ? "heatmap" : i === "detail" ? "detail" : i === "correlation" ? "correlation" : "activity";
}
class da extends P {
  constructor() {
    super(...arguments), this._config = {
      type: "custom:activity-history-card"
    }, this._areas = [], this._labels = [], this._domains = Z, this._loadedOptions = !1;
  }
  static {
    this.styles = We`
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
      hours_to_show: e.hours_to_show ?? f.hours_to_show,
      display_mode: e.display_mode ?? f.display_mode,
      view_mode: e.view_mode ?? f.view_mode,
      group_by: e.group_by ?? f.group_by
    }, this.requestUpdate();
  }
  set hass(e) {
    this._hass = e, this._loadedOptions || (this._loadedOptions = !0, this._loadOptions());
  }
  render() {
    const e = this._config, i = e.domains?.length ? e.domains : Z;
    return u`
      <div class="editor">
        <section class="section">
          <h3>הגדרות כלליות</h3>
          <div class="row">
            <label>
              כותרת
              <input
                type="text"
                .value=${e.title ?? f.title}
                @input=${(a) => this._setValue("title", R(a))}
              />
            </label>
            <label>
              טווח שעות
              <input
                type="number"
                min="1"
                max="168"
                .value=${String(e.hours_to_show ?? 24)}
                @input=${(a) => this._setNumber("hours_to_show", R(a))}
              />
            </label>
          </div>
          <div class="row">
            <label>
              מצב תצוגה
              <select
                .value=${e.display_mode ?? "panel"}
                @change=${(a) => this._setValue(
      "display_mode",
      R(a)
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
                @change=${(a) => this._setChecked("mock_data", a)}
              />
              נתוני דוגמה
            </label>
          </div>
          <div class="row">
            <label>
              תצוגת ציר זמן
              <select
                .value=${e.view_mode ?? f.view_mode}
                @change=${(a) => this._setValue("view_mode", R(a))}
              >
                <option value="activity">Activity dashboard</option>
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
                @change=${(a) => this._setChecked("show_activity_density", a)}
              />
              הצג פס צפיפות פעילות
            </label>
          </div>
          <label class="check">
            <input
              type="checkbox"
              .checked=${e.debug === !0}
              @change=${(a) => this._setChecked("debug", a)}
            />
            הצג דיאגנוסטיקה
          </label>
          <label class="check">
            <input
              type="checkbox"
              .checked=${e.auto_discover !== !1}
              @change=${(a) => this._setChecked("auto_discover", a)}
            />
            משוך אוטומטית רכיבים שמשויכים לאזורים
          </label>
          <p class="hint">
            כאשר האפשרות פעילה ואין רשימת entities ידנית, הכרטיס מאתר ישויות לפי
            אזורי Home Assistant ומסנן לפי הדומיינים והלייבלים שבחרת.
          </p>
        </section>

        <section class="section">
          <h3>סינון חכם</h3>
          <div class="row">
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.smart_filter !== !1}
                @change=${(a) => this._setChecked("smart_filter", a)}
              />
              הסתר רעש אוטומטית
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.hide_empty_rows !== !1}
                @change=${(a) => this._setChecked("hide_empty_rows", a)}
              />
              הסתר שורות ללא פעילות
            </label>
          </div>
          <div class="row">
            <label>
              מצב פעילות
              <select
                .value=${e.activity_mode ?? f.activity_mode}
                @change=${(a) => this._setValue(
      "activity_mode",
      R(a)
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
      e.min_row_active_seconds ?? f.min_row_active_seconds
    )}
                @input=${(a) => this._setNumber("min_row_active_seconds", R(a))}
              />
            </label>
            <label>
              מקסימום שורות לקבוצה
              <input
                type="number"
                min="1"
                max="60"
                .value=${String(
      e.max_rows_per_group ?? f.max_rows_per_group
    )}
                @input=${(a) => this._setNumber("max_rows_per_group", R(a))}
              />
            </label>
            <label>
              מקסימום שורות כולל
              <input
                type="number"
                min="1"
                max="200"
                .value=${String(
      e.max_total_rows ?? f.max_total_rows
    )}
                @input=${(a) => this._setNumber("max_total_rows", R(a))}
              />
            </label>
          </div>
          <div class="check-grid">
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.show_technical_entities === !0}
                @change=${(a) => this._setChecked("show_technical_entities", a)}
              />
              הצג רכיבים טכניים
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.show_config_entities === !0}
                @change=${(a) => this._setChecked("show_config_entities", a)}
              />
              הצג ישויות הגדרה
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.show_diagnostic_entities === !0}
                @change=${(a) => this._setChecked("show_diagnostic_entities", a)}
              />
              הצג ישויות אבחון
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${e.show_inactive_baselines === !0}
                @change=${(a) => this._setChecked("show_inactive_baselines", a)}
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
      (a) => this._renderArrayCheckbox(
        "domains",
        a,
        O[a] ?? a,
        i.includes(a)
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
          ${this._areas.length ? u`<div class="check-grid">
                ${this._areas.map(
      (a) => this._renderArrayCheckbox(
        "areas",
        a.name,
        a.name,
        (e.areas ?? []).includes(a.name) || (e.areas ?? []).includes(a.area_id)
      )
    )}
              </div>` : u`<p class="hint">
                לא נטענו אזורים מה־registry. אפשר עדיין לערוך YAML ידנית.
              </p>`}
          <p class="hint">
            אם לא נבחר אזור, יוצגו כל האזורים שיש להם רכיבים מתאימים.
          </p>
        </section>

        <section class="section">
          <h3>לייבלים</h3>
          ${this._labels.length ? this._renderLabelControls(e) : u`<p class="hint">
                לא נמצאו labels ב־Home Assistant, או שהגרסה לא תומכת ב־label
                registry.
              </p>`}
        </section>
      </div>
    `;
  }
  _renderLabelControls(e) {
    return u`
      <p class="hint">
        בחר labels להצגה או להסתרה. הסתרה גוברת על הצגה, כך שאפשר למשל להסתיר
        "לא להצגה" או "רכיבים מוגנים".
      </p>
      <h3>הצג רק labels אלה</h3>
      <div class="check-grid">
        ${this._labels.map(
      (i) => this._renderArrayCheckbox(
        "include_labels",
        i.name,
        i.name,
        (e.include_labels ?? []).includes(i.name) || (e.include_labels ?? []).includes(i.label_id)
      )
    )}
      </div>
      <h3>הסתר labels אלה</h3>
      <div class="check-grid">
        ${this._labels.map(
      (i) => this._renderArrayCheckbox(
        "exclude_labels",
        i.name,
        i.name,
        (e.exclude_labels ?? []).includes(i.name) || (e.exclude_labels ?? []).includes(i.label_id)
      )
    )}
      </div>
    `;
  }
  _renderArrayCheckbox(e, i, a, s) {
    return u`
      <label class="check">
        <input
          type="checkbox"
          .checked=${s}
          @change=${(n) => this._toggleArrayValue(e, i, n)}
        />
        ${a}
      </label>
    `;
  }
  async _loadOptions() {
    if (!this._hass) return;
    const [e, i] = await Promise.all([
      this._safeRegistryCall("config/area_registry/list"),
      this._safeRegistryCall("config/label_registry/list")
    ]), a = [
      ...new Set(Object.keys(this._hass.states).map(I))
    ].filter(Boolean).sort();
    this._areas = e.sort((s, n) => s.name.localeCompare(n.name, "he")), this._labels = i.sort((s, n) => s.name.localeCompare(n.name, "he")), this._domains = [
      .../* @__PURE__ */ new Set([...Z, ...a])
    ].sort(), this.requestUpdate();
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
    const a = Number(i);
    Number.isFinite(a) && (e === "hours_to_show" && a <= 0 || e !== "hours_to_show" && a < 0 || this._emitConfig({ ...this._config, [e]: a }));
  }
  _setChecked(e, i) {
    const a = i.target.checked;
    this._emitConfig({ ...this._config, [e]: a });
  }
  _toggleArrayValue(e, i, a) {
    const s = a.target.checked, n = new Set(this._config[e] ?? []);
    s ? n.add(i) : n.delete(i);
    const r = [...n];
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
function R(t) {
  return t.target.value;
}
customElements.get("activity-history-card-editor") || customElements.define(
  "activity-history-card-editor",
  da
);
class ha extends P {
  constructor() {
    super(...arguments), this._rows = [], this._visibleRows = [], this._groups = [], this._loading = !1, this._fullscreen = !1, this._filterSheetOpen = !1, this._usingMockData = !1, this._showAllRows = !1, this._fetchToken = 0, this._lastFetchKey = "", this._hasFetchedOnce = !1, this._initialLoad = !1, this._backgroundLoading = !1, this._lastResolvedEntityKey = "", this._lastHistoryFetchAt = 0, this._historyCache = /* @__PURE__ */ new Map(), this._filter = {
      search: "",
      areas: [],
      domains: [],
      stateMode: "all",
      groupBy: "area",
      timePreset: "24h"
    }, this._openSegmentPopover = (e, i, a) => {
      e.preventDefault(), e.stopPropagation();
      const s = this._visibleRows.find((d) => d.entity.entity_id === i) ?? this._rows.find((d) => d.entity.entity_id === i), n = s?.segments[a], r = e.currentTarget instanceof Element ? e.currentTarget : void 0;
      if (!s || !n || !r) return;
      const c = r.getBoundingClientRect(), o = bi(c, {
        width: window.innerWidth,
        height: window.innerHeight
      });
      this._segmentPopover = {
        row: s,
        segment: n,
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
      const i = e.target;
      this._filter = { ...this._filter, search: i.value }, this._rebuildGroups();
    }, this._clearFilters = () => {
      const e = this._filter.timePreset, i = this._initialTimePreset(this._config);
      this._showAllRows = !1, this._filter = {
        search: "",
        areas: [],
        domains: [],
        stateMode: "all",
        groupBy: this._config.group_by ?? "area",
        timePreset: i
      }, this._rebuildGroups(), e !== i && (this._lastFetchKey = "", this._requestHistoryRefresh("range", { force: !0 }));
    }, this._toggleShowAllRows = () => {
      this._showAllRows = !this._showAllRows, this._rebuildGroups();
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
        (a) => a instanceof HTMLElement && a.classList.contains("ahc-popover")
      ) || this._segmentPopover && this._closeSegmentPopover();
    }, this._onFullscreenChange = () => {
      !document.fullscreenElement && this._fullscreen && (this._fullscreen = !1, document.removeEventListener(
        "fullscreenchange",
        this._onFullscreenChange
      ), this._filterSheetOpen || document.removeEventListener("keydown", this._onDocumentKeyDown), this.requestUpdate());
    };
  }
  static {
    this.styles = ca;
  }
  static getConfigElement() {
    return document.createElement("activity-history-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:activity-history-card",
      title: f.title,
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
    const i = this._initialTimePreset(e);
    this._config = {
      ...f,
      ...e,
      view_mode: e.view_mode ?? e.default_view ?? f.view_mode,
      group_by: e.group_by ?? f.group_by,
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
      timePreset: i
    }, this._lastFetchKey = "", this._lastResolvedEntityKey = "", this._showAllRows = !1, this._historyCache.clear(), this._syncRefreshTimer(), this._requestHistoryRefresh(this._hasFetchedOnce ? "config" : "initial", {
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
    if (!this._config) return u``;
    const e = this._hass?.locale?.language ?? this._hass?.language, i = Gt(
      this._config.direction ?? this._config.rtl ?? "auto",
      e
    ), a = [
      "ahc",
      this._config.display_mode === "panel" ? "ahc--panel" : "",
      this._fullscreen || this._config.display_mode === "fullscreen" ? "ahc--fullscreen" : "",
      this._filterSheetOpen ? "ahc--sheet-open" : "",
      this._usingMockData ? "ahc--mock" : "",
      this._backgroundLoading ? "ahc--background-loading" : "",
      this._visibleRows.length > 70 ? "ahc--ultra-dense" : this._visibleRows.length > 30 ? "ahc--dense" : ""
    ].filter(Boolean).join(" ");
    return u`
      <ha-card
        class=${a}
        dir=${i ? "rtl" : "ltr"}
        tabindex=${this._fullscreen ? "0" : "-1"}
        aria-busy=${this._initialLoad ? "true" : "false"}
      >
        ${this._renderHeader()} ${this._renderFilters()}
        ${this._renderSummary()}
        ${this._config.debug ? this._renderDiagnostics() : g}
        ${this._renderBody()}
        ${this._segmentPopover ? this._renderSegmentPopover() : g}
        ${this._filterSheetOpen ? this._renderFilterSheet() : g}
      </ha-card>
    `;
  }
  _renderBody() {
    const e = this._config.show_insights !== !1;
    return u`
      <section
        class=${e ? "ahc__body" : "ahc__body ahc__body--no-insights"}
      >
        <main class="ahc__main">${this._renderMainContent()}</main>
        ${e ? this._renderInsights() : g}
      </section>
    `;
  }
  _renderHeader() {
    const e = `${this._timePresetLabel(this._filter.timePreset)} · ${this._usingMockData ? "נתוני דוגמה" : "נתוני Home Assistant"}`;
    return u`
      <header class="ahc__topbar">
        <div class="ahc__toolbar">
          ${this._config.show_fullscreen_button === !1 ? g : u`
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
          ${this._backgroundLoading ? u`<span class="ahc__refresh-indicator" role="status"
                >מעדכן...</span
              >` : g}
        </div>
        <div class="ahc__title-block">
          <div class="ahc__title-row">
            <span class="ahc__icon-badge" aria-hidden="true"
              ><ha-icon icon="mdi:chart-timeline-variant"></ha-icon
            ></span>
            <h2 class="ahc__title">
              ${this._config.title ?? f.title}
            </h2>
          </div>
          <p class="ahc__subtitle">${e}</p>
          ${this._renderLastEventPill()}
        </div>
      </header>
    `;
  }
  _renderLastEventPill() {
    const e = this._summary, i = e?.lastEventRow, a = e?.lastEvent;
    return !i || !a ? g : u`
      <div class="ahc-last-event">
        <span class="ahc-last-event__label">אירוע אחרון</span>
        <strong>${i.entity.name}</strong>
        <span
          >${x(a.start)} · ${z[a.category]} ·
          ${re(i, this._config.debug === !0)}</span
        >
      </div>
    `;
  }
  _renderFilters() {
    if (this._config.filters?.show === !1) return g;
    const e = q(this._curation), i = !!(this._curation?.hiddenRows || this._showAllRows);
    return u`
      <section class="ahc__filters" aria-label="מסננים">
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
          ${i ? u`<button
                class="ahc__button ahc__button--ghost"
                type="button"
                aria-pressed=${this._showAllRows ? "true" : "false"}
                @click=${this._toggleShowAllRows}
              >
                ${this._showAllRows ? "הצג רק פעילות" : "הצג הכל"}
              </button>` : g}
          ${e ? u`<span class="ahc-curation-note">${e}</span>` : g}
        </div>
      </section>
    `;
  }
  _renderChip(e, i, a) {
    return u`<button
      class="ahc__chip"
      type="button"
      aria-pressed=${i ? "true" : "false"}
      @click=${a}
    >
      ${e}
    </button>`;
  }
  _renderSummary() {
    if (this._config.show_summary === !1) return g;
    const e = this._summary, i = this._visibleRows.length || this._rows.length, a = this._config.summary_scope === "all" ? "לפי כל הרכיבים שנמצאו" : "לפי הרכיבים שמוצגים";
    return u`
      <section class="ahc__summary-grid" aria-label="סיכום פעילות">
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
              >${A(e?.totalActiveMs ?? 0)}</span
            >
            <span class="ahc__metric-subtitle">${a}</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◴</span>
        </article>
      </section>
    `;
  }
  _renderSummaryLegacy() {
    if (this._config.show_summary === !1) return g;
    const e = this._summary, i = e?.lastEventRow, a = e?.lastEvent;
    return u`
      <section class="ahc__summary-grid" aria-label="סיכום פעילות">
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">אירוע אחרון</span>
            <span class="ahc__metric-value ahc__metric-value--compact"
              >${i?.entity.name ?? "אין"}</span
            >
            <span class="ahc__metric-subtitle">
              ${a && i ? `${x(a.start)} · ${z[a.category]} · ${re(i, this._config.debug === !0)}` : "לא נמצאו אירועים בטווח"}
            </span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">♪</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">סה״כ שעות־רכיב</span>
            <span class="ahc__metric-value ahc__metric-value--positive"
              >${A(e?.totalActiveMs ?? 0)}</span
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
      return u`<div class="ahc-state-card">
        <div>
          <h3 class="ahc-state-card__title">שגיאה בטעינת ההיסטוריה</h3>
          <p>${this._error}</p>
        </div>
      </div>`;
    if (this._emptyReason || !this._groups.length)
      return this._renderEmptyState(
        this._emptyReason ?? "no_resolved_entities"
      );
    const e = this._resolveRange();
    switch (qe(this._config, this._showAllRows)) {
      case "heatmap":
        return $i();
      case "detail":
        return xi();
      case "correlation":
        return wi();
      case "legacy_swimlane":
        return aa({
          groups: this._groups,
          range: e,
          config: this._showAllRows && this._config.view_mode === "activity" ? {
            ...this._config,
            show_inactive_baselines: !0,
            max_visible_rows: Math.max(
              this._config.max_visible_rows ?? 0,
              80
            )
          } : this._config,
          summary: this._summary ?? U(this._groups),
          curation: this._curation,
          onSegmentClick: this._openSegmentPopover
        });
      case "activity":
      default:
        return Yi({
          groups: this._groups,
          range: e,
          config: this._config,
          summary: this._summary ?? U(this._groups),
          curation: this._curation,
          onSegmentClick: this._openSegmentPopover
        });
    }
  }
  _renderInitialLoading() {
    const e = !this._hass && !this._usingMockData ? "ממתין לחיבור Home Assistant." : "מושך היסטוריה מה-Recorder.";
    return u`
      <section class="ahc-loading" aria-label="טעינת היסטוריה" aria-busy="true">
        <div class="ahc-loading__copy">
          <h3>טוען ציר זמן...</h3>
          <p>${e}</p>
        </div>
        <div class="ahc-loading__timeline" aria-hidden="true">
          ${Array.from({ length: 4 }).map(
      (i, a) => u`
              <div class="ahc-loading__group">
                <span></span>
                ${Array.from({ length: 5 }).map(
        (s, n) => u`<i
                      style="--delay:${a + n}; --width:${42 + (a + n) % 4 * 12}%"
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
    if (!e) return u``;
    const i = Kt(
      e.row,
      e.segment,
      this._config.debug === !0
    );
    return u`
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
          ${i.map(
      ([a, s]) => u`<dt class="ahc-popover__dt">${a}</dt>
                <dd class="ahc-popover__dd">${s}</dd>`
    )}
        </dl>
      </aside>
    `;
  }
  _renderEmptyState(e) {
    const a = {
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
    }[e], s = e === "no_resolved_entities" && this._diagnostics?.discovery?.unavailableReasons.length ? this._diagnostics.discovery.unavailableReasons.join(", ") : "";
    return u`
      <div class="ahc-state-card">
        <div>
          <h3 class="ahc-state-card__title">${a.title}</h3>
          <p>${a.body}</p>
          ${s ? u`<p>
                אזהרת discovery: ${s}. אם האזורים לא זמינים, נסה
                להגדיר entities ידנית או להפעיל debug.
              </p>` : g}
          ${e === "no_meaningful_activity" && this._config.debug ? u`<p class="ahc-debug__meta">
                ${q(this._curation)}
              </p>` : g}
          <pre
            class="ahc-state-card__yaml"
            dir="ltr"
          ><code>${a.yaml}</code></pre>
          ${e === "no_meaningful_activity" ? u`<div class="ahc-empty-actions">
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
              </div>` : g}
        </div>
      </div>
    `;
  }
  _renderDiagnostics() {
    const e = this._diagnostics;
    return e ? u`
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
        ${e.curation ? u`<p class="ahc-debug__meta" dir="ltr">
              curation: ${JSON.stringify(e.curation.hiddenByReason)}
            </p>` : g}
        ${e.discovery?.unavailableReasons.length ? u`<p class="ahc-debug__meta">
              Registry warnings:
              ${e.discovery.unavailableReasons.join(", ")}
            </p>` : g}
      </details>
    ` : u`<details class="ahc-debug" aria-label="אבחון">
        <summary>Debug · ממתין לטעינת נתונים...</summary>
      </details>`;
  }
  _renderInsights() {
    const e = this._summary, i = e?.mostActiveEntity, a = e?.mostActiveArea, s = !!(e && e.eventCount > 0);
    return u`
      <aside
        class="ahc__insights ahc__insights-panel"
        aria-label="תובנות חכמות"
      >
        <h3 class="ahc__insights-title">
          <span>תובנות חכמות</span><span aria-hidden="true">✦</span>
        </h3>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">הרכיב הפעיל ביותר</span>
          <span class="ahc__insight-value"
            >${i?.entity.name ?? "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle"
            >${i ? `${A(i.totalActiveMs)} · ${re(i, this._config.debug === !0)}` : "צריך היסטוריה פעילה בטווח"}</span
          >
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">האזור הפעיל ביותר</span>
          <span class="ahc__insight-value"
            >${a?.title ?? "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle"
            >${a ? `${A(a.totalActiveMs)} · ${a.subtitle ?? ""}` : "אין אזור עם פעילות משמעותית"}</span
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
      (n) => u`<i style="--bar:${s ? n : 12}%"></i>`
    )}</span
          >
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">דפוס שימוש קצר</span>
          <span class="ahc__insight-value"
            >${s ? `${e?.activeEntityCount ?? 0} רכיבים` : "אין מספיק נתונים"}</span
          >
          <span class="ahc__insight-subtitle"
            >${s ? `נרשמו ${e?.eventCount ?? 0} אירועים בטווח הנוכחי` : "נסה טווח זמן ארוך יותר או ודא שה-Recorder פעיל"}</span
          >
        </article>
      </aside>
    `;
  }
  _renderFilterSheet() {
    const e = this._availableAreas(), i = this._availableDomains(), a = this._visibleRows;
    return u`
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
      (s) => this._renderChip(
        s,
        this._filter.areas.includes(s),
        () => this._toggleArea(s)
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
            ${i.map(
      (s) => this._renderChip(
        O[s] ?? s,
        this._filter.domains.includes(s),
        () => this._toggleDomain(s)
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
            ><span>${this._curation?.visibleRows ?? a.length}</span>
          </div>
          <button
            class="ahc-filter-option"
            type="button"
            aria-pressed=${this._showAllRows ? "true" : "false"}
            @click=${this._toggleShowAllRows}
          >
            <span>${this._showAllRows ? "הצג רק פעילות" : "הצג הכל"}</span>
            <small
              >${q(this._curation) || "הסתר שורות ריקות, טכניות וקצרות מאוד"}</small
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
            <span>רכיבים נבחרים</span><span>${a.length}</span>
          </div>
          <div class="ahc-entity-list">
            ${a.slice(0, 32).map(
      (s) => u`
                <span class="ahc-entity-list__item">
                  <span>${s.entity.name}</span>
                  <small
                    >${[
        s.entity.area,
        O[s.entity.domain] ?? s.entity.domain
      ].filter(Boolean).join(" · ")}</small
                  >
                </span>
              `
    )}
            ${a.length > 32 ? u`<span class="ahc-entity-list__more"
                  >ועוד ${a.length - 32} רכיבים</span
                >` : g}
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
  _requestHistoryRefresh(e, i = {}) {
    if (!this._config || this._inFlightHistoryRequest && !i.force) return;
    const a = this._fetchAndRender(e, i.force === !0);
    this._inFlightHistoryRequest = a, a.finally(() => {
      this._inFlightHistoryRequest === a && (this._inFlightHistoryRequest = void 0);
    });
  }
  async _fetchAndRender(e, i) {
    if (!this._config) return;
    const a = Date.now(), s = this._config.mock_data === !0;
    if (!this._hass && !s) {
      this._usingMockData = !1, this._initialLoad = !this._rows.length, this._loading = this._initialLoad, this._backgroundLoading = !1, this._error = void 0, this._emptyReason = void 0, this.requestUpdate();
      return;
    }
    const n = ++this._fetchToken, r = !this._hasFetchedOnce && !this._rows.length;
    this._initialLoad = r, this._loading = r, this._backgroundLoading = !r, this._error = void 0, this._rows.length || (this._emptyReason = void 0), this._usingMockData = s, this.requestUpdate();
    const c = s ? {
      entities: mi(this._config.mock_profile),
      diagnostics: void 0
    } : await Vt(this._config, this._hass);
    if (n !== this._fetchToken) return;
    const o = c.entities, d = ua(o), l = this._resolveRange(), h = st(o), _ = ci({
      mock: s,
      start: l.start.toISOString(),
      end: l.end.toISOString(),
      entityIds: o.map((m) => m.entity_id),
      withAttributes: h.withAttributes.map(
        (m) => m.entity_id
      ),
      withoutAttributes: h.withoutAttributes.map(
        (m) => m.entity_id
      ),
      includeLabels: this._config.include_labels ?? [],
      excludeLabels: this._config.exclude_labels ?? [],
      significant: this._config.significant_changes_only,
      minimal: this._config.minimal_response
    }), p = i && ["manual", "timer", "interval", "config"].includes(e), y = !!(this._lastResolvedEntityKey && this._lastResolvedEntityKey !== d) && e === "interval" ? "entities" : e, w = (m, k, ae = c.diagnostics) => {
      this._lastResolvedEntityKey = d, this._lastHistoryFetchAt = Date.now(), this._hasFetchedOnce = !0, this._setPostLoadState(
        k,
        l,
        h,
        m,
        s,
        ae,
        {
          reason: y,
          key: _,
          durationMs: Date.now() - a
        }
      ), this._syncRefreshTimer();
    };
    if (!o.length) {
      this._usingMockData = !1, this._rows = [], this._visibleRows = [], this._groups = [], this._summary = U([]), this._curation = le([], this._config).diagnostics, this._emptyReason = this._config.auto_discover === !1 && !this._config.entities?.length ? "no_entities_selected" : "no_resolved_entities", this._setDiagnostics({
        resolvedEntityCount: 0,
        historyRecordCount: 0,
        timelineSegmentCount: 0,
        activeTimelineSegmentCount: 0,
        filteredRowCount: 0,
        renderedGroupCount: 0,
        activeFilters: { ...this._filter },
        historyRange: l,
        attributesRequested: { withAttributes: 0, withoutAttributes: 0 },
        cacheHit: !1,
        mockData: s,
        discovery: c.diagnostics,
        curation: this._curation,
        lastFetchTime: /* @__PURE__ */ new Date(),
        fetchDurationMs: Date.now() - a,
        fetchReason: y,
        currentHistoryKey: _,
        refreshIntervalSeconds: this._refreshIntervalSeconds(),
        initialLoad: r,
        backgroundLoading: !1
      }), this._hasFetchedOnce = !0, this._lastResolvedEntityKey = d, this._lastHistoryFetchAt = Date.now(), this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this._error = void 0, this._syncRefreshTimer(), this.requestUpdate();
      return;
    }
    if (!p && _ === this._lastFetchKey) {
      const m = this._historyCache.get(_);
      if (m) {
        const k = Ke(m);
        this._rows = Oe(
          m,
          o,
          l,
          this._config,
          this._hass?.states ?? {}
        ), w(!0, k), this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this._error = void 0, this._rebuildGroups();
        return;
      }
    }
    try {
      let m = p ? void 0 : this._historyCache.get(_);
      if (m || (m = s ? fi(l, this._config.mock_profile) : await li(
        this._hass,
        o,
        l,
        this._config
      ), this._historyCache.set(_, m)), n !== this._fetchToken) return;
      const k = Ke(m);
      this._rows = Oe(
        m,
        o,
        l,
        this._config,
        this._hass?.states ?? {}
      ), w(!1, k), this._lastFetchKey = _, this._rebuildGroups();
    } catch (m) {
      this._error = m instanceof Error ? m.message : String(m), this._rows.length || (this._visibleRows = [], this._groups = [], this._summary = U([]), this._curation = le([], this._config).diagnostics, this._emptyReason = void 0);
    } finally {
      n === this._fetchToken && (this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this.requestUpdate());
    }
  }
  _rebuildGroups() {
    const e = oi(this._rows, this._filter), i = le(e, this._config, {
      showAll: this._showAllRows,
      groupBy: this._filter.groupBy
    });
    this._visibleRows = i.rows, this._curation = i.diagnostics, this._groups = Te(i.rows, this._filter.groupBy).filter(
      (n) => this._config.hide_empty_groups === !1 || n.rows.length > 0
    );
    const a = qe(this._config, this._showAllRows), s = this._config.summary_scope === "all" ? Te(e, this._filter.groupBy) : a === "activity" ? ft(
      this._groups,
      this._resolveRange(),
      this._config
    ).groups : this._groups;
    this._summary = U(s), this._rows.length && !e.length ? this._emptyReason = "all_entities_filtered" : e.length && !i.rows.length ? this._emptyReason = "no_meaningful_activity" : (this._emptyReason === "all_entities_filtered" || this._emptyReason === "no_meaningful_activity") && (this._emptyReason = void 0), this._diagnostics && this._setDiagnostics({
      ...this._diagnostics,
      filteredRowCount: e.length,
      renderedGroupCount: this._groups.length,
      curation: i.diagnostics,
      activeFilters: { ...this._filter }
    }), this.requestUpdate();
  }
  _setPostLoadState(e, i, a, s, n, r, c) {
    const o = this._rows.reduce(
      (l, h) => l + h.segments.length,
      0
    ), d = this._rows.reduce(
      (l, h) => l + h.segments.filter((_) => _.active).length,
      0
    );
    e === 0 && d === 0 ? this._emptyReason = "no_history_returned" : e > 0 && o === 0 ? this._emptyReason = "history_unusable" : this._emptyReason = void 0, this._setDiagnostics({
      resolvedEntityCount: this._rows.length,
      historyRecordCount: e,
      timelineSegmentCount: o,
      activeTimelineSegmentCount: d,
      filteredRowCount: this._rows.length,
      renderedGroupCount: 0,
      activeFilters: { ...this._filter },
      historyRange: i,
      attributesRequested: {
        withAttributes: a.withAttributes.length,
        withoutAttributes: a.withoutAttributes.length
      },
      cacheHit: s,
      mockData: n,
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
    return rt(
      this._config?.refresh_interval_seconds
    );
  }
  _resolveRange() {
    const e = this._roundedNow();
    return this._filter.timePreset === "24h" ? ne(
      {
        ...this._config,
        start_time: void 0,
        end_time: e.toISOString(),
        hours_to_show: 24
      },
      e
    ) : this._filter.timePreset === "7d" ? ne(
      {
        ...this._config,
        start_time: void 0,
        end_time: e.toISOString(),
        hours_to_show: 24 * 7
      },
      e
    ) : ne(this._config, e);
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
    const i = this._filter.areas.includes(e) ? this._filter.areas.filter((a) => a !== e) : [...this._filter.areas, e];
    this._setAreas(i);
  }
  _setAreas(e) {
    this._filter = { ...this._filter, areas: e }, this._rebuildGroups();
  }
  _toggleDomain(e) {
    const i = this._filter.domains.includes(e) ? this._filter.domains.filter((a) => a !== e) : [...this._filter.domains, e];
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
    this._filter.timePreset !== e && (this._filter = { ...this._filter, timePreset: e }, this._lastFetchKey = "", this._requestHistoryRefresh("range", { force: !0 }));
  }
  _initialTimePreset(e) {
    return e.start_time || e.end_time ? "custom" : (e.hours_to_show ?? 24) >= 168 ? "7d" : "24h";
  }
  _timePresetLabel(e) {
    return e === "7d" ? "7 ימים" : e === "custom" ? "טווח מותאם" : "24 שעות אחרונות";
  }
}
function Ke(t) {
  return Object.values(t).reduce(
    (e, i) => e + i.length,
    0
  );
}
function ua(t) {
  return t.map((e) => "entity" in e ? e.entity.entity_id : e.entity_id).sort().join("|");
}
customElements.get("activity-history-card") || customElements.define("activity-history-card", ha);
window.customCards = window.customCards || [];
window.customCards.some((t) => t.type === "activity-history-card") || window.customCards.push({
  type: "activity-history-card",
  name: "Activity History Card",
  description: "RTL/mobile-friendly Home Assistant activity history timeline",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/activity-history-card"
});
export {
  ha as ActivityHistoryCard
};
//# sourceMappingURL=activity-history-card.js.map
