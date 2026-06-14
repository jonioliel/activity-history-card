/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ae = globalThis, ke = ae.ShadowRoot && (ae.ShadyCSS === void 0 || ae.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $e = Symbol(), Te = /* @__PURE__ */ new WeakMap();
let ht = class {
  constructor(e, a, i) {
    if (this._$cssResult$ = !0, i !== $e) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = a;
  }
  get styleSheet() {
    let e = this.o;
    const a = this.t;
    if (ke && e === void 0) {
      const i = a !== void 0 && a.length === 1;
      i && (e = Te.get(a)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), i && Te.set(a, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Qt = (t) => new ht(typeof t == "string" ? t : t + "", void 0, $e), pt = (t, ...e) => {
  const a = t.length === 1 ? t[0] : e.reduce((i, n, r) => i + ((s) => {
    if (s._$cssResult$ === !0) return s.cssText;
    if (typeof s == "number") return s;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + s + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + t[r + 1], t[0]);
  return new ht(a, t, $e);
}, ea = (t, e) => {
  if (ke) t.adoptedStyleSheets = e.map((a) => a instanceof CSSStyleSheet ? a : a.styleSheet);
  else for (const a of e) {
    const i = document.createElement("style"), n = ae.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = a.cssText, t.appendChild(i);
  }
}, Ie = ke ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let a = "";
  for (const i of e.cssRules) a += i.cssText;
  return Qt(a);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ta, defineProperty: aa, getOwnPropertyDescriptor: ia, getOwnPropertyNames: na, getOwnPropertySymbols: ra, getPrototypeOf: sa } = Object, se = globalThis, Ee = se.trustedTypes, oa = Ee ? Ee.emptyScript : "", ca = se.reactiveElementPolyfillSupport, Y = (t, e) => t, be = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? oa : null;
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
} }, ut = (t, e) => !ta(t, e), Pe = { attribute: !0, type: String, converter: be, reflect: !1, useDefault: !1, hasChanged: ut };
Symbol.metadata ??= Symbol("metadata"), se.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let B = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, a = Pe) {
    if (a.state && (a.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((a = Object.create(a)).wrapped = !0), this.elementProperties.set(e, a), !a.noAccessor) {
      const i = Symbol(), n = this.getPropertyDescriptor(e, i, a);
      n !== void 0 && aa(this.prototype, e, n);
    }
  }
  static getPropertyDescriptor(e, a, i) {
    const { get: n, set: r } = ia(this.prototype, e) ?? { get() {
      return this[a];
    }, set(s) {
      this[a] = s;
    } };
    return { get: n, set(s) {
      const c = n?.call(this);
      r?.call(this, s), this.requestUpdate(e, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? Pe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Y("elementProperties"))) return;
    const e = sa(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Y("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Y("properties"))) {
      const a = this.properties, i = [...na(a), ...ra(a)];
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
      for (const n of i) a.unshift(Ie(n));
    } else e !== void 0 && a.push(Ie(e));
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
    return ea(e, this.constructor.elementStyles), e;
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
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : be).toAttribute(a, i.type);
      this._$Em = e, r == null ? this.removeAttribute(n) : this.setAttribute(n, r), this._$Em = null;
    }
  }
  _$AK(e, a) {
    const i = this.constructor, n = i._$Eh.get(e);
    if (n !== void 0 && this._$Em !== n) {
      const r = i.getPropertyOptions(n), s = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : be;
      this._$Em = n;
      const c = s.fromAttribute(a, r.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, a, i, n = !1, r) {
    if (e !== void 0) {
      const s = this.constructor;
      if (n === !1 && (r = this[e]), i ??= s.getPropertyOptions(e), !((i.hasChanged ?? ut)(r, a) || i.useDefault && i.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(s._$Eu(e, i)))) return;
      this.C(e, a, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, a, { useDefault: i, reflect: n, wrapped: r }, s) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, s ?? a ?? this[e]), r !== !0 || s !== void 0) || (this._$AL.has(e) || (this.hasUpdated || i || (a = void 0), this._$AL.set(e, a)), n === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
        for (const [n, r] of this._$Ep) this[n] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, r] of i) {
        const { wrapped: s } = r, c = this[n];
        s !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, r, c);
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
B.elementStyles = [], B.shadowRootOptions = { mode: "open" }, B[Y("elementProperties")] = /* @__PURE__ */ new Map(), B[Y("finalized")] = /* @__PURE__ */ new Map(), ca?.({ ReactiveElement: B }), (se.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ze = globalThis, He = (t) => t, ne = ze.trustedTypes, Le = ne ? ne.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, _t = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, gt = "?" + T, la = `<${gt}>`, D = document, X = () => D.createComment(""), J = (t) => t === null || typeof t != "object" && typeof t != "function", Ae = Array.isArray, da = (t) => Ae(t) || typeof t?.[Symbol.iterator] == "function", le = `[ 	
\f\r]`, W = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, De = /-->/g, Ne = />/g, E = RegExp(`>|${le}(?:([^\\s"'>=/]+)(${le}*=${le}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Fe = /'/g, Be = /"/g, mt = /^(?:script|style|textarea|title)$/i, ha = (t) => (e, ...a) => ({ _$litType$: t, strings: e, values: a }), h = ha(1), U = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Oe = /* @__PURE__ */ new WeakMap(), H = D.createTreeWalker(D, 129);
function bt(t, e) {
  if (!Ae(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Le !== void 0 ? Le.createHTML(e) : e;
}
const pa = (t, e) => {
  const a = t.length - 1, i = [];
  let n, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", s = W;
  for (let c = 0; c < a; c++) {
    const o = t[c];
    let l, d, p = -1, u = 0;
    for (; u < o.length && (s.lastIndex = u, d = s.exec(o), d !== null); ) u = s.lastIndex, s === W ? d[1] === "!--" ? s = De : d[1] !== void 0 ? s = Ne : d[2] !== void 0 ? (mt.test(d[2]) && (n = RegExp("</" + d[2], "g")), s = E) : d[3] !== void 0 && (s = E) : s === E ? d[0] === ">" ? (s = n ?? W, p = -1) : d[1] === void 0 ? p = -2 : (p = s.lastIndex - d[2].length, l = d[1], s = d[3] === void 0 ? E : d[3] === '"' ? Be : Fe) : s === Be || s === Fe ? s = E : s === De || s === Ne ? s = W : (s = E, n = void 0);
    const g = s === E && t[c + 1].startsWith("/>") ? " " : "";
    r += s === W ? o + la : p >= 0 ? (i.push(l), o.slice(0, p) + _t + o.slice(p) + T + g) : o + T + (p === -2 ? c : g);
  }
  return [bt(t, r + (t[a] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), i];
};
class Z {
  constructor({ strings: e, _$litType$: a }, i) {
    let n;
    this.parts = [];
    let r = 0, s = 0;
    const c = e.length - 1, o = this.parts, [l, d] = pa(e, a);
    if (this.el = Z.createElement(l, i), H.currentNode = this.el.content, a === 2 || a === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (n = H.nextNode()) !== null && o.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const p of n.getAttributeNames()) if (p.endsWith(_t)) {
          const u = d[s++], g = n.getAttribute(p).split(T), f = /([.?@])?(.*)/.exec(u);
          o.push({ type: 1, index: r, name: f[2], strings: g, ctor: f[1] === "." ? _a : f[1] === "?" ? ga : f[1] === "@" ? ma : oe }), n.removeAttribute(p);
        } else p.startsWith(T) && (o.push({ type: 6, index: r }), n.removeAttribute(p));
        if (mt.test(n.tagName)) {
          const p = n.textContent.split(T), u = p.length - 1;
          if (u > 0) {
            n.textContent = ne ? ne.emptyScript : "";
            for (let g = 0; g < u; g++) n.append(p[g], X()), H.nextNode(), o.push({ type: 2, index: ++r });
            n.append(p[u], X());
          }
        }
      } else if (n.nodeType === 8) if (n.data === gt) o.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = n.data.indexOf(T, p + 1)) !== -1; ) o.push({ type: 7, index: r }), p += T.length - 1;
      }
      r++;
    }
  }
  static createElement(e, a) {
    const i = D.createElement("template");
    return i.innerHTML = e, i;
  }
}
function V(t, e, a = t, i) {
  if (e === U) return e;
  let n = i !== void 0 ? a._$Co?.[i] : a._$Cl;
  const r = J(e) ? void 0 : e._$litDirective$;
  return n?.constructor !== r && (n?._$AO?.(!1), r === void 0 ? n = void 0 : (n = new r(t), n._$AT(t, a, i)), i !== void 0 ? (a._$Co ??= [])[i] = n : a._$Cl = n), n !== void 0 && (e = V(t, n._$AS(t, e.values), n, i)), e;
}
class ua {
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
    const { el: { content: a }, parts: i } = this._$AD, n = (e?.creationScope ?? D).importNode(a, !0);
    H.currentNode = n;
    let r = H.nextNode(), s = 0, c = 0, o = i[0];
    for (; o !== void 0; ) {
      if (s === o.index) {
        let l;
        o.type === 2 ? l = new Q(r, r.nextSibling, this, e) : o.type === 1 ? l = new o.ctor(r, o.name, o.strings, this, e) : o.type === 6 && (l = new ba(r, this, e)), this._$AV.push(l), o = i[++c];
      }
      s !== o?.index && (r = H.nextNode(), s++);
    }
    return H.currentNode = D, n;
  }
  p(e) {
    let a = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(e, i, a), a += i.strings.length - 2) : i._$AI(e[a])), a++;
  }
}
class Q {
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
    e = V(this, e, a), J(e) ? e === _ || e == null || e === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : e !== this._$AH && e !== U && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : da(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== _ && J(this._$AH) ? this._$AA.nextSibling.data = e : this.T(D.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: a, _$litType$: i } = e, n = typeof i == "number" ? this._$AC(e) : (i.el === void 0 && (i.el = Z.createElement(bt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(a);
    else {
      const r = new ua(n, this), s = r.u(this.options);
      r.p(a), this.T(s), this._$AH = r;
    }
  }
  _$AC(e) {
    let a = Oe.get(e.strings);
    return a === void 0 && Oe.set(e.strings, a = new Z(e)), a;
  }
  k(e) {
    Ae(this._$AH) || (this._$AH = [], this._$AR());
    const a = this._$AH;
    let i, n = 0;
    for (const r of e) n === a.length ? a.push(i = new Q(this.O(X()), this.O(X()), this, this.options)) : i = a[n], i._$AI(r), n++;
    n < a.length && (this._$AR(i && i._$AB.nextSibling, n), a.length = n);
  }
  _$AR(e = this._$AA.nextSibling, a) {
    for (this._$AP?.(!1, !0, a); e !== this._$AB; ) {
      const i = He(e).nextSibling;
      He(e).remove(), e = i;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class oe {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, a, i, n, r) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = e, this.name = a, this._$AM = n, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(e, a = this, i, n) {
    const r = this.strings;
    let s = !1;
    if (r === void 0) e = V(this, e, a, 0), s = !J(e) || e !== this._$AH && e !== U, s && (this._$AH = e);
    else {
      const c = e;
      let o, l;
      for (e = r[0], o = 0; o < r.length - 1; o++) l = V(this, c[i + o], a, o), l === U && (l = this._$AH[o]), s ||= !J(l) || l !== this._$AH[o], l === _ ? e = _ : e !== _ && (e += (l ?? "") + r[o + 1]), this._$AH[o] = l;
    }
    s && !n && this.j(e);
  }
  j(e) {
    e === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class _a extends oe {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === _ ? void 0 : e;
  }
}
class ga extends oe {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== _);
  }
}
class ma extends oe {
  constructor(e, a, i, n, r) {
    super(e, a, i, n, r), this.type = 5;
  }
  _$AI(e, a = this) {
    if ((e = V(this, e, a, 0) ?? _) === U) return;
    const i = this._$AH, n = e === _ && i !== _ || e.capture !== i.capture || e.once !== i.once || e.passive !== i.passive, r = e !== _ && (i === _ || n);
    n && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ba {
  constructor(e, a, i) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = a, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    V(this, e);
  }
}
const va = ze.litHtmlPolyfillSupport;
va?.(Z, Q), (ze.litHtmlVersions ??= []).push("3.3.3");
const fa = (t, e, a) => {
  const i = a?.renderBefore ?? e;
  let n = i._$litPart$;
  if (n === void 0) {
    const r = a?.renderBefore ?? null;
    i._$litPart$ = n = new Q(e.insertBefore(X(), r), r, void 0, a ?? {});
  }
  return n._$AI(t), n;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Me = globalThis;
class j extends B {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const a = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = fa(a, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return U;
  }
}
j._$litElement$ = !0, j.finalized = !0, Me.litElementHydrateSupport?.({ LitElement: j });
const ya = Me.litElementPolyfillSupport;
ya?.({ LitElement: j });
(Me.litElementVersions ??= []).push("4.2.2");
const xa = {
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
}, wa = {
  climate: {
    hvac_action: ["cooling", "heating", "drying", "fan"]
  }
}, ka = {
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
  desktop_density: "compact",
  fullscreen_behavior: "fixed_overlay",
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
  timeline_height: "calc(100svh - 320px)",
  timeline_axis_density: "comfortable",
  debug_timeline_geometry: !1,
  mobile_breakpoint: 760
}, R = {
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
}, ie = [
  "light",
  "switch",
  "climate",
  "media_player",
  "cover",
  "fan"
], A = {
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
function vt(t, e, a) {
  const i = $a(e, a), n = za(e, i), r = n.map(() => /* @__PURE__ */ new Set());
  for (const c of t)
    for (const o of c.segments)
      if (o.active)
        for (let l = 0; l < n.length; l += 1) {
          const d = n[l];
          if (!d) continue;
          const p = Aa(o, d.start, d.end);
          p <= 0 || (d.totalActiveMs += p, d.eventCount += Ma(o, d) ? 1 : 0, r[l]?.add(c.entity.entity_id));
        }
  const s = Math.max(
    1,
    ...n.map((c) => c.totalActiveMs)
  );
  return n.map((c, o) => ({
    ...c,
    activeEntityCount: r[o]?.size ?? 0,
    intensity: c.totalActiveMs / s
  }));
}
function $a(t, e) {
  const a = e.activity_density_buckets;
  if (typeof a == "number" && Number.isFinite(a) && a > 0)
    return Math.max(1, Math.floor(a));
  const i = Math.max(
    1,
    (t.end.getTime() - t.start.getTime()) / 36e5
  );
  return i <= 30 ? 24 : i <= 24 * 3 ? 48 : 84;
}
function za(t, e) {
  const a = t.start.getTime(), i = t.end.getTime(), r = Math.max(1, i - a) / e;
  return Array.from({ length: e }, (s, c) => {
    const o = a + c * r, l = c === e - 1 ? i : o + r;
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
function Aa(t, e, a) {
  const i = Math.max(t.start.getTime(), e.getTime()), n = Math.min(t.end.getTime(), a.getTime());
  return Math.max(0, n - i);
}
function Ma(t, e) {
  const a = t.start.getTime();
  return a >= e.start.getTime() && a < e.end.getTime();
}
const Ca = [
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
], Ra = [
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
], Sa = /* @__PURE__ */ new Set([
  "power",
  "program",
  "extra dry",
  "half load",
  "remote start",
  "child lock",
  "נעילת ילדים",
  "חצי כמות"
]), ft = /* @__PURE__ */ new Set([
  "off",
  "idle",
  "unknown",
  "unavailable"
]);
function de(t, e, a = {}) {
  const i = a.showAll === !0 || e.activity_mode === "all", n = Fa(e, i), r = e.smart_filter !== !1 && n === "meaningful" && !i, s = e.show_inactive_baselines ?? b.show_inactive_baselines, c = /* @__PURE__ */ new Map(), o = zt(e), l = (At(e.min_row_active_seconds) ?? b.min_row_active_seconds) * 1e3, d = Ge(e.max_rows_per_group) ?? b.max_rows_per_group, p = Ge(e.max_total_rows) ?? b.max_total_rows;
  let u = 0;
  const g = [], f = [];
  for (const x of t) {
    const m = o.has(x.entity.entity_id);
    m && (u += 1);
    const k = r ? Ea(x, e, l, m) : { row: x };
    k.reason ? (f.push(x), c.set(x.entity.entity_id, k.reason)) : k.row && g.push(k.row);
  }
  const w = r ? Ha(g, f, c, {
    groupBy: a.groupBy ?? "area",
    manualEntityIds: o,
    maxRowsPerGroup: d,
    maxTotalRows: p
  }) : { rows: g, hiddenRows: f };
  return {
    rows: w.rows,
    hiddenRows: w.hiddenRows,
    hiddenReasons: c,
    diagnostics: Da({
      totalRows: t.length,
      visibleRows: w.rows.length,
      hiddenRows: w.hiddenRows.length,
      hiddenReasons: c,
      smartFilter: r,
      activityMode: n,
      showInactiveBaselines: s,
      showAll: i,
      manualRowsProtected: u,
      maxRowsPerGroup: d,
      maxTotalRows: p
    })
  };
}
function yt(t, e) {
  if (zt(e).has(t.entity_id))
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
    const a = kt(t);
    if (wt(t))
      return { visible: !1, reason: "technical", confidence: "heuristic" };
    if (a)
      return { visible: !1, reason: "noisy_name", confidence: "heuristic" };
  }
  return { visible: !0, confidence: "heuristic" };
}
function Ta(t) {
  return wt(t.entity) || t.entity.domain === "switch" && kt(t.entity);
}
function Ia(t, e) {
  return t.segments.filter(
    (a) => xt(a) && a.durationMs >= e
  );
}
function G(t) {
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
function Ea(t, e, a, i) {
  const n = yt(t.entity, e);
  if (!i && !n.visible)
    return { reason: n.reason ?? "technical" };
  const r = Ia(t, a);
  return r.length ? { row: Pa(t, r) } : i ? { row: t } : (e.hide_empty_rows ?? b.hide_empty_rows) === !1 ? { row: t } : t.segments.length ? {
    reason: t.segments.some(
      (c) => xt(c) && c.durationMs < a
    ) ? "too_short" : "no_meaningful_activity"
  } : { reason: "empty" };
}
function Pa(t, e) {
  const a = e.reduce(
    (n, r) => n + r.durationMs,
    0
  ), i = t.currentCategory;
  return {
    ...t,
    segments: e,
    totalActiveMs: a,
    eventCount: e.length,
    currentCategory: i && !ft.has(i) ? i : void 0
  };
}
function xt(t) {
  return t.active && !ft.has(t.category);
}
function Ha(t, e, a, i) {
  const n = t.filter(
    (p) => i.manualEntityIds.has(p.entity.entity_id)
  ), r = t.filter(
    (p) => !i.manualEntityIds.has(p.entity.entity_id)
  ), s = /* @__PURE__ */ new Map();
  for (const p of he(r)) {
    const u = La(p, i.groupBy), g = s.get(u) ?? [];
    if (g.length >= i.maxRowsPerGroup) {
      e.push(p), a.set(p.entity.entity_id, "max_rows");
      continue;
    }
    g.push(p), s.set(u, g);
  }
  const c = [...s.values()].flat(), o = new Set(
    n.map((p) => p.entity.entity_id)
  ), l = [
    ...he(n),
    ...he(c)
  ], d = [];
  for (const p of l) {
    if (!o.has(p.entity.entity_id) && d.length >= i.maxTotalRows) {
      e.push(p), a.set(p.entity.entity_id, "max_rows");
      continue;
    }
    d.push(p);
  }
  return { rows: d, hiddenRows: e };
}
function he(t) {
  return [...t].sort(
    (e, a) => Number(je(a)) - Number(je(e)) || a.totalActiveMs - e.totalActiveMs || a.eventCount - e.eventCount || e.entity.name.localeCompare(a.entity.name, "he")
  );
}
function je(t) {
  const e = Date.now();
  return t.segments.some(
    (a) => a.active && a.start.getTime() <= e && a.end.getTime() >= e - 9e4
  );
}
function La(t, e) {
  return e === "domain" ? t.entity.domain || "other" : e === "none" || e === "entity" ? "all" : t.entity.area || "ללא אזור";
}
function Da(t) {
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
function wt(t) {
  const e = Na(t, !0);
  return Ra.some((a) => $t(e, a));
}
function kt(t) {
  const e = re(t.name), a = re(t.entity_id), i = `${e} ${a}`;
  return t.domain === "switch" && Sa.has(e) ? !0 : Ca.some((n) => $t(i, n));
}
function Na(t, e = !1) {
  return [
    t.entity_id,
    t.name,
    e ? t.device_name : void 0,
    e ? t.device_manufacturer : void 0,
    e ? t.device_model : void 0,
    ...t.labels ?? []
  ].filter(Boolean).map((a) => re(String(a))).join(" ");
}
function $t(t, e) {
  const a = re(e);
  if (!a) return !1;
  if (/^[a-z0-9 ]+$/i.test(a)) {
    const i = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`(^|\\s)${i}(\\s|$)`, "i").test(t);
  }
  return t.includes(a);
}
function Fa(t, e) {
  return e ? "all" : t.activity_mode ?? b.activity_mode;
}
function zt(t) {
  return new Set(
    (t.entities ?? []).map(
      (e) => typeof e == "string" ? e : e.entity
    )
  );
}
function At(t) {
  return typeof t == "number" && Number.isFinite(t) && t > 0 ? t : void 0;
}
function Ge(t) {
  const e = At(t);
  return e ? Math.floor(e) : void 0;
}
function re(t) {
  return t.trim().toLowerCase().replace(/[_./-]+/g, " ").replace(/\s+/g, " ");
}
const Ba = ["ar", "fa", "he", "iw", "ur"];
function q(t) {
  return t.includes(".") ? t.split(".")[0] ?? t : t;
}
function pe(t, e = /* @__PURE__ */ new Date()) {
  if (t.start_time) {
    const r = new Date(t.start_time), s = t.end_time ? new Date(t.end_time) : e;
    return { start: r, end: s };
  }
  const a = t.hours_to_show ?? 24, i = t.end_time ? new Date(t.end_time) : e;
  return { start: new Date(i.getTime() - a * 60 * 60 * 1e3), end: i };
}
function Oa(t, e) {
  if (t === !0 || t === "rtl") return !0;
  if (t === !1 || t === "ltr") return !1;
  const a = (e || document.documentElement.lang || navigator.language || "").toLowerCase();
  return Ba.some(
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
function ja(t, e, a) {
  return Math.min(a, Math.max(e, t));
}
function I(t, e) {
  const a = e.end.getTime() - e.start.getTime();
  return a <= 0 ? 0 : ja(
    (t.getTime() - e.start.getTime()) / a * 100,
    0,
    100
  );
}
function Mt(t) {
  const [, e = t] = t.split(".");
  return e.replace(/_/g, " ");
}
function O(t) {
  const e = t.flatMap((u) => u.rows), a = e.flatMap(
    (u) => u.segments.filter((g) => g.active)
  ), i = a.reduce(
    (u, g) => u + g.durationMs,
    0
  ), n = e.filter((u) => u.totalActiveMs > 0), r = a.length, s = Date.now(), c = e.filter(
    (u) => u.segments.some(
      (g) => g.active && g.start.getTime() <= s && g.end.getTime() >= s - 9e4
    )
  ).length, o = [...a].sort(
    (u, g) => g.start.getTime() - u.start.getTime()
  )[0], l = o ? e.find((u) => u.entity.entity_id === o.entity_id) : void 0, d = [...n].sort(
    (u, g) => g.totalActiveMs - u.totalActiveMs
  )[0], p = [...t].filter((u) => u.totalActiveMs > 0).sort((u, g) => g.totalActiveMs - u.totalActiveMs)[0];
  return {
    totalActiveMs: i,
    activeEntityCount: n.length,
    eventCount: r,
    activeNowCount: c,
    lastEvent: o,
    lastEventRow: l,
    mostActiveEntity: d,
    mostActiveArea: p,
    peakBucketLabel: Ga(a)
  };
}
function Ga(t) {
  if (!t.length) return;
  const e = new Array(24).fill(0);
  for (const n of t) {
    const r = n.start.getHours();
    e[r] = (e[r] ?? 0) + n.durationMs;
  }
  const a = Math.max(...e), i = e.indexOf(a);
  if (!(i < 0))
    return `${String(i).padStart(2, "0")}:00 – ${String((i + 1) % 24).padStart(2, "0")}:00`;
}
function Ua(t) {
  return t > 70 ? "ultra-dense" : t > 30 ? "dense" : "normal";
}
function Ce(t, e) {
  const a = t.reduce(
    (c, o) => c + o.rows.length,
    0
  );
  let n = Number.isFinite(e) && e && e > 0 ? Math.floor(e) : a;
  const r = [];
  for (const c of t) {
    if (n <= 0) {
      r.push({ ...c, rows: [] });
      continue;
    }
    const o = c.rows.slice(0, n);
    n -= o.length, r.push({ ...c, rows: o });
  }
  const s = r.reduce(
    (c, o) => c + o.rows.length,
    0
  );
  return {
    groups: r,
    totalRowCount: a,
    visibleRowCount: s,
    hiddenRowCount: Math.max(0, a - s),
    density: Ua(s)
  };
}
const Va = 0.5;
function Ct(t, e) {
  const a = e.start.getTime(), i = e.end.getTime(), n = Math.max(1, i - a), r = Math.max(t.start.getTime(), a), s = Math.min(t.end.getTime(), i), c = Math.min(Math.max(r, a), i), o = Math.min(Math.max(s, a), i), l = Math.max(0, o - c), d = Ue((c - a) / n * 100), p = Ue(l / n * 100);
  return {
    leftPct: d,
    widthPct: p,
    minVisible: t.active && l > 0 && p < Va
  };
}
function Ue(t) {
  return Number.isFinite(t) ? Math.min(100, Math.max(0, t)) : 0;
}
const qa = 6e4;
function Ka(t, e) {
  const a = t.map((s) => {
    const c = s.rows.filter(hi).sort(
      (o, l) => l.totalActiveMs - o.totalActiveMs || l.eventCount - o.eventCount || o.entity.name.localeCompare(l.entity.name, "he")
    );
    return {
      ...s,
      rows: c,
      totalActiveMs: c.reduce((o, l) => o + l.totalActiveMs, 0),
      subtitle: `${c.length} רכיבים`
    };
  }).filter((s) => s.rows.length > 0).sort(
    (s, c) => c.totalActiveMs - s.totalActiveMs || c.rows.length - s.rows.length || s.title.localeCompare(c.title, "he")
  ), i = Ce(
    a,
    e.max_visible_rows ?? e.max_total_rows
  ), n = i.groups.filter((s) => s.rows.length > 0), r = n.reduce(
    (s, c) => s + c.rows.length,
    0
  );
  return {
    groups: n,
    totalRowCount: i.totalRowCount,
    visibleRowCount: r,
    hiddenRowCount: Math.max(0, i.totalRowCount - r)
  };
}
function Ve(t, e, a, i, n = {}) {
  const r = Ka(t, a), s = r.groups.flatMap((m) => m.rows), c = n.inventoryRows ?? t.flatMap((m) => m.rows), o = Za(
    c,
    a,
    n.groupBy
  ), l = Ya(
    t,
    r.groups,
    o,
    e
  ), d = i?.totalRows ?? r.totalRowCount, p = Math.max(
    0,
    i?.hiddenRows ?? 0,
    r.hiddenRowCount,
    d - r.visibleRowCount
  ), u = vt(s, e, a), g = s.reduce(
    (m, k) => m + k.totalActiveMs,
    0
  ), f = s.reduce(
    (m, k) => m + k.eventCount,
    0
  ), w = l.reduce(
    (m, k) => m + k.inventoryItemCount,
    0
  ), x = n.selectedAreas?.length === 1 || l.length === 1 && n.groupBy !== "domain";
  return {
    range: e,
    totalRowsBeforeCuration: d,
    visibleRowsCount: r.visibleRowCount,
    hiddenRowsCount: p,
    hiddenReasonSummary: G(i),
    totalVisibleActiveMs: g,
    visibleEventCount: f,
    activeNowCount: s.filter(L).length,
    totalInventoryItemCount: w,
    singleAreaFocused: x,
    densityBuckets: u,
    groups: l,
    insights: ti(l, u)
  };
}
function Wa(t) {
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
  return O(e);
}
function Ya(t, e, a, i) {
  const n = new Map(t.map((o) => [o.id, o])), r = new Map(e.map((o) => [o.id, o])), s = new Map(
    a.map((o) => [o.id, o])
  );
  return [
    .../* @__PURE__ */ new Set([...r.keys(), ...s.keys()])
  ].map((o) => {
    const l = r.get(o), d = s.get(o);
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
    (o) => Xa(
      r.get(o),
      n.get(o),
      s.get(o),
      i
    )
  );
}
function Xa(t, e, a, i) {
  const n = t ?? e, r = (t?.rows ?? []).map(
    (d) => Ja(d, i)
  ), s = (a?.rows ?? []).map(Qa).sort(ai), c = r.reduce((d, p) => d + p.eventCount, 0), o = r.filter((d) => d.activeNow).length, l = e?.rows.length ?? r.length;
  return {
    id: t?.id ?? a?.id ?? e?.id ?? "all",
    title: t?.title ?? a?.title ?? e?.title ?? "כל הרכיבים",
    icon: t?.icon ?? a?.icon ?? e?.icon,
    area: t?.title ?? a?.area ?? e?.title,
    totalEntityCount: s.length,
    visibleActivityRowCount: r.length,
    inventoryItemCount: s.length,
    hiddenRowsCount: Math.max(0, l - r.length),
    totalActiveMs: r.reduce(
      (d, p) => d + p.totalActiveMs,
      0
    ),
    eventCount: c,
    activeNowCount: o,
    aggregateSegments: ei(
      t?.rows ?? [],
      i,
      n?.title ?? a?.title ?? "פעילות"
    ),
    activityRows: r,
    inventoryItems: s
  };
}
function Ja(t, e) {
  const a = t.segments.map((i, n) => ({ segment: i, sourceIndex: n })).filter((i) => i.segment.active).map(
    ({ segment: i, sourceIndex: n }) => Rt(
      i,
      e,
      `${t.entity.name} · ${A[i.category]} · ${v(
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
    secondary: [t.entity.area, R[t.entity.domain]].filter(Boolean).join(" · "),
    icon: t.entity.icon,
    domain: t.entity.domain,
    area: t.entity.area,
    totalActiveMs: t.totalActiveMs,
    eventCount: t.eventCount,
    activeNow: L(t),
    segments: a
  };
}
function Za(t, e, a = "area") {
  const i = li(
    e.area_inventory_domains?.length ? e.area_inventory_domains : e.domains
  ), n = e.area_inventory_include_inactive ?? b.area_inventory_include_inactive, r = /* @__PURE__ */ new Map();
  for (const s of t) {
    if (i.length && !i.includes(s.entity.domain) || !n && s.totalActiveMs <= 0 && !L(s) || !yt(s.entity, e).visible) continue;
    const o = ii(s.entity, a), l = r.get(o) ?? {
      id: o,
      title: ni(s.entity, a),
      icon: ri(s.entity, a),
      area: s.entity.area,
      rows: []
    };
    l.rows.push(s), r.set(o, l);
  }
  return [...r.values()].map((s) => ({
    ...s,
    rows: [...s.rows].sort(
      (c, o) => Number(L(o)) - Number(L(c)) || +(o.totalActiveMs > 0) - +(c.totalActiveMs > 0) || c.entity.name.localeCompare(o.entity.name, "he")
    )
  }));
}
function Qa(t) {
  const e = t.entity.entity_category === "config" || t.entity.entity_category === "diagnostic" ? t.entity.entity_category : null;
  return {
    entityId: t.entity.entity_id,
    name: t.entity.name,
    domain: t.entity.domain,
    area: t.entity.area,
    icon: t.entity.icon,
    currentState: t.currentState,
    currentCategory: t.currentCategory,
    currentStateLabel: si(t),
    stateTone: oi(t),
    activeNow: L(t),
    hadActivityInRange: t.totalActiveMs > 0,
    totalActiveMs: t.totalActiveMs,
    eventCount: t.eventCount,
    entityCategory: e,
    isTechnical: Ta(t)
  };
}
function ei(t, e, a) {
  const i = t.flatMap((r) => r.segments.filter((s) => s.active)).sort((r, s) => r.start.getTime() - s.start.getTime()), n = [];
  for (const r of i) {
    const s = n.at(-1);
    if (s && r.start.getTime() <= s.end.getTime() + qa) {
      s.end = new Date(
        Math.max(s.end.getTime(), r.end.getTime())
      ), s.durationMs = Math.max(
        0,
        s.end.getTime() - s.start.getTime()
      ), s.category !== r.category && (s.category = "on");
      continue;
    }
    n.push({ ...r });
  }
  return n.map(
    (r) => Rt(
      r,
      e,
      `${a} · פעילות מצטברת · ${v(
        r.start
      )} עד ${v(r.end)} · ${y(r.durationMs)}`
    )
  ).filter(
    (r) => !!(r && r.widthPct > 0)
  );
}
function Rt(t, e, a, i) {
  const n = Ct(t, e);
  if (!(n.widthPct <= 0))
    return {
      start: t.start,
      end: t.end,
      category: t.category,
      label: a,
      colorVar: ka[t.category],
      leftPct: n.leftPct,
      widthPct: n.widthPct,
      minVisible: n.minVisible,
      sourceIndex: i
    };
}
function ti(t, e) {
  const a = t.flatMap((o) => o.activityRows), i = t.reduce(
    (o, l) => o + l.inventoryItemCount,
    0
  ), n = t.reduce(
    (o, l) => o + l.inventoryItems.filter((d) => d.activeNow).length,
    0
  ), r = [...a].sort(
    (o, l) => l.totalActiveMs - o.totalActiveMs
  )[0], s = [...t].sort(
    (o, l) => l.totalActiveMs - o.totalActiveMs
  )[0], c = [...e].sort(
    (o, l) => l.totalActiveMs - o.totalActiveMs
  )[0];
  return {
    mostActiveEntity: r ? {
      name: r.name,
      secondary: r.secondary,
      totalActiveMs: r.totalActiveMs,
      eventCount: r.eventCount
    } : void 0,
    mostActiveArea: s && s.totalActiveMs > 0 ? {
      title: s.title,
      totalActiveMs: s.totalActiveMs,
      eventCount: s.eventCount,
      rowCount: s.activityRows.length,
      inventoryCount: s.inventoryItemCount
    } : void 0,
    peakBucketLabel: c && c.totalActiveMs > 0 ? `${v(c.start)} - ${v(c.end)}` : void 0,
    shortUsePattern: a.length ? `${a.length} רכיבי פעילות · ${t.length} אזורים` : void 0,
    inventoryPattern: i ? `${i} אביזרים במלאי · ${n} פעילים עכשיו` : void 0
  };
}
function ai(t, e) {
  return Number(e.activeNow) - Number(t.activeNow) || Number(e.hadActivityInRange) - Number(t.hadActivityInRange) || ve(t.domain).localeCompare(ve(e.domain), "he") || t.name.localeCompare(e.name, "he");
}
function ii(t, e) {
  return e === "domain" ? t.domain || "other" : e === "none" || e === "entity" ? "all" : t.area || "ללא אזור";
}
function ni(t, e) {
  return e === "domain" ? ve(t.domain) : e === "none" || e === "entity" ? "כל הרכיבים" : t.area || "ללא אזור";
}
function ri(t, e) {
  if (e === "domain") return di(t.domain);
}
function si(t) {
  return t.currentCategory ? A[t.currentCategory] : t.currentState ? t.currentState : t.totalActiveMs > 0 ? "היתה פעילות" : "לא פעיל";
}
function oi(t) {
  return ci(t) ? "unavailable" : L(t) ? "active" : t.totalActiveMs > 0 ? "had_activity" : "inactive";
}
function ci(t) {
  return t.currentState === "unavailable" || t.currentState === "unknown" || t.currentCategory === "unknown" && t.totalActiveMs <= 0;
}
function ve(t) {
  return R[t] ?? t;
}
function li(t) {
  return (t ?? []).map((e) => e.trim()).filter(Boolean).map((e) => e.toLowerCase());
}
function di(t) {
  return t === "light" ? "mdi:lightbulb-outline" : t === "climate" ? "mdi:thermostat" : t === "media_player" ? "mdi:music" : t === "cover" ? "mdi:window-shutter" : t === "fan" ? "mdi:fan" : "mdi:toggle-switch-outline";
}
function hi(t) {
  return t.segments.some((e) => e.active);
}
function L(t) {
  const e = Date.now();
  return t.segments.some(
    (a) => a.active && a.start.getTime() <= e && a.end.getTime() >= e - 9e4
  );
}
function ue(t, e = !1) {
  return t ? [
    t.entity.area,
    R[t.entity.domain] ?? t.entity.domain,
    e ? t.entity.entity_id : void 0
  ].filter(Boolean).join(" · ") : "אין מספיק נתונים";
}
function pi(t, e, a = !1) {
  const i = [
    ["רכיב", t.entity.name],
    ["אזור", t.entity.area ?? "ללא אזור"],
    ["סוג", R[t.entity.domain] ?? t.entity.domain],
    ["מצב", A[e.category] ?? e.state],
    ["התחלה", v(e.start)],
    ["סיום", v(e.end)],
    ["משך", y(e.durationMs)]
  ];
  return a && i.push(["entity_id", t.entity.entity_id]), i;
}
const qe = /* @__PURE__ */ new WeakMap();
async function ui(t, e) {
  const a = t.entities ?? [], i = e ? await bi(e) : vi(), n = a.map(
    (c) => typeof c == "string" ? { entity: c } : c
  );
  let r = !1;
  if (!n.length && e && t.auto_discover !== !1) {
    const c = _i(t, e, i);
    r = c.fallbackUsed, n.push(...c.entities);
  }
  return {
    entities: n.filter((c) => c.entity && !c.hidden).map((c) => gi(c, t, e, i)).filter((c) => !!c).filter(
      (c) => Tt(c.labels ?? [], t, i.labels)
    ),
    diagnostics: fi(i, r, t)
  };
}
function _i(t, e, a) {
  const i = t.domains?.length ? t.domains : ie, n = N(t.exclude_domains ?? []), r = N(t.areas ?? []), s = [];
  if (a.entities.length) {
    const c = We(a.areas, "area_id"), o = We(a.devices, "id");
    for (const l of a.entities) {
      if (l.disabled_by || l.hidden_by || !e.states[l.entity_id] || !St(l, t, !1)) continue;
      const d = q(l.entity_id);
      if (n.has($(d)) || i.length && !i.includes(d) || !fe(l.entity_id, t)) continue;
      const p = l.device_id ? o.get(l.device_id) : void 0;
      if (p?.disabled_by) continue;
      const u = l.area_id || p?.area_id || void 0;
      if (!u) continue;
      const g = c.get(u), f = g?.name ?? u;
      if (r.size && !r.has($(u)) && !r.has($(f)))
        continue;
      const w = It(l.labels, p?.labels, g?.labels);
      Tt(w, t, a.labels) && s.push({
        entity: l.entity_id,
        area: f,
        domain: d
      });
    }
    return { entities: s, fallbackUsed: !1 };
  }
  for (const [c, o] of Object.entries(e.states)) {
    const l = q(c);
    if (n.has($(l)) || i.length && !i.includes(l) || !fe(c, t)) continue;
    const d = z(o.attributes.area) ?? z(o.attributes.area_id);
    d && (r.size && !r.has($(d)) || s.push({ entity: c, area: d, domain: l }));
  }
  return { entities: s, fallbackUsed: !0 };
}
function gi(t, e, a, i) {
  const n = a?.states[t.entity], r = i.entities.find(
    (K) => K.entity_id === t.entity
  ), s = ki(t.entity, e);
  if (r?.disabled_by || r?.hidden_by || r && !St(r, e, s))
    return;
  const c = r?.device_id ? i.devices.find((K) => K.id === r.device_id) : void 0;
  if (c?.disabled_by) return;
  const o = t.area ? void 0 : r?.area_id || c?.area_id || void 0, l = t.area ?? yi(o, i) ?? z(n?.attributes?.area) ?? z(n?.attributes?.area_id);
  if (e.areas?.length && (!l || !xi(l, o, e.areas)))
    return;
  const d = t.domain ?? q(t.entity);
  if (!mi(t.entity, d, e)) return;
  const p = It(
    r?.labels,
    c?.labels,
    o ? i.areas.find((K) => K.area_id === o)?.labels : void 0
  ), u = n ? a?.formatEntityName?.(n) : void 0, g = n?.attributes?.friendly_name, f = P(t.name, t.entity), w = P(r?.name, t.entity) ?? P(r?.original_name, t.entity), x = P(c?.name_by_user, t.entity) ?? P(c?.name, t.entity), m = P(u, t.entity), k = P(g, t.entity), ee = Mt(t.entity), Se = Et(
    ee,
    t.entity
  ), Zt = f ?? $i(m ?? k ?? w ?? (Se && x ? x : Se ? "רכיב ללא שם" : ee), x, t.entity, d);
  return {
    entity_id: t.entity,
    name: Zt,
    area: l,
    area_id: o,
    domain: d,
    icon: t.icon ?? z(n?.attributes?.icon),
    labels: p,
    entity_category: z(r?.entity_category),
    device_id: z(r?.device_id),
    device_name: x,
    device_manufacturer: z(c?.manufacturer),
    device_model: z(c?.model),
    hidden_by: z(r?.hidden_by),
    disabled_by: z(r?.disabled_by),
    config: t
  };
}
function mi(t, e, a) {
  return a.domains?.length && !N(a.domains).has($(e)) || N(a.exclude_domains ?? []).has($(e)) ? !1 : fe(t, a);
}
function fe(t, e) {
  const a = e.include_entity_globs ?? [], i = [
    ...e.exclude_entities ?? [],
    ...e.exclude_entity_globs ?? []
  ];
  return !(a.length && !a.some((n) => Ke(n).test(t)) || i.length && i.some((n) => Ke(n).test(t)));
}
function St(t, e, a) {
  return a ? !0 : t.entity_category === "config" ? e.show_config_entities === !0 : t.entity_category === "diagnostic" ? e.show_diagnostic_entities === !0 : !0;
}
function Tt(t, e, a) {
  const i = wi(t, a), n = N(e.include_labels ?? []), r = N(e.exclude_labels ?? []);
  return !(r.size && [...r].some((s) => i.has(s)) || n.size && ![...n].some((s) => i.has(s)));
}
async function bi(t) {
  const e = qe.get(t);
  if (e) return e;
  const a = Promise.all([
    te(t, "config/area_registry/list"),
    te(t, "config/device_registry/list"),
    te(t, "config/entity_registry/list"),
    te(t, "config/label_registry/list")
  ]).then(([i, n, r, s]) => ({
    areas: i.items,
    devices: n.items,
    entities: r.items,
    labels: s.items,
    areaRegistryAvailable: i.available,
    deviceRegistryAvailable: n.available,
    entityRegistryAvailable: r.available,
    labelRegistryAvailable: s.available
  }));
  return qe.set(t, a), a;
}
async function te(t, e) {
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
function vi() {
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
function fi(t, e, a) {
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
function yi(t, e) {
  if (t)
    return e.areas.find((a) => a.area_id === t)?.name ?? t;
}
function xi(t, e, a) {
  const i = N(a);
  return i.has($(t)) || !!(e && i.has($(e)));
}
function wi(t, e) {
  const a = new Map(
    e.map((n) => [n.label_id, n.name])
  ), i = /* @__PURE__ */ new Set();
  for (const n of t) {
    i.add($(n));
    const r = a.get(n);
    r && i.add($(r));
  }
  return i;
}
function It(...t) {
  return [...new Set(t.flatMap((e) => e ?? []))];
}
function Ke(t) {
  const e = t.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${e}$`);
}
function We(t, e) {
  return new Map(t.map((a) => [a[e], a]));
}
function N(t) {
  return new Set(t.map($).filter(Boolean));
}
function ki(t, e) {
  return (e.entities ?? []).some(
    (a) => typeof a == "string" ? a === t : a.entity === t
  );
}
function $(t) {
  return t.trim().toLowerCase();
}
function z(t) {
  return typeof t == "string" && t.trim() ? t.trim() : void 0;
}
function P(t, e) {
  const a = z(t);
  if (!(!a || Et(a, e)))
    return a;
}
function Et(t, e) {
  const a = $(t).replace(/[._-]/g, " "), i = $(e.split(".")[1] ?? e).replace(
    /[._-]/g,
    " "
  );
  return a === "na" || a === "n/a" || a === "n a" || a === "unknown" || a === "null" || a === "none" || a === i && i.length <= 2;
}
function $i(t, e, a, i) {
  if (!e || !t) return t;
  const n = $(t), r = $(e);
  return !n || !r || n.includes(r) || r.includes(n) ? t : i === "switch" && (Ai(t) || zi(t) || t === Mt(a)) ? `${e} - ${t}` : t;
}
function zi(t) {
  const e = t.trim();
  return e.length <= 16 && /^[a-z0-9][a-z0-9 ._()/+-]*$/i.test(e);
}
function Ai(t) {
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
function Ye(t, e) {
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
      const r = Date.now();
      if (!i.segments.some(
        (s) => s.active && s.start.getTime() <= r && s.end.getTime() >= r - 9e4
      ))
        return !1;
    }
    return !0;
  });
}
function Xe(t, e) {
  if (e === "none" || e === "entity")
    return [Je("all", "כל הרכיבים", t)];
  const a = /* @__PURE__ */ new Map();
  for (const i of t) {
    const n = e === "area" ? i.entity.area || "ללא אזור" : i.entity.domain || "other", r = a.get(n) ?? [];
    r.push(i), a.set(n, r);
  }
  return [...a.entries()].map(
    ([i, n]) => Je(
      i,
      e === "domain" ? R[i] ?? i : i,
      n
    )
  ).sort(
    (i, n) => n.totalActiveMs - i.totalActiveMs || n.rows.length - i.rows.length || i.title.localeCompare(n.title, "he")
  );
}
function Je(t, e, a) {
  const i = [...a].sort(
    (r, s) => s.totalActiveMs - r.totalActiveMs || s.eventCount - r.eventCount || +!!(s.currentCategory && s.currentCategory !== "off" && s.currentCategory !== "unknown") - +!!(r.currentCategory && r.currentCategory !== "off" && r.currentCategory !== "unknown") || r.entity.name.localeCompare(s.entity.name, "he")
  ), n = i.reduce(
    (r, s) => r + s.totalActiveMs,
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
function Mi(t) {
  return new CustomEvent("hass-more-info", {
    bubbles: !0,
    composed: !0,
    detail: { entityId: t }
  });
}
function Ci(t) {
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
function Ze(t) {
  return t.config?.attributes?.length || t.config?.active_attributes && Object.keys(t.config.active_attributes).length ? !0 : ["climate", "humidifier", "water_heater"].includes(t.domain);
}
async function Ri(t, e, a, i) {
  const { withAttributes: n, withoutAttributes: r } = Pt(e), s = await Promise.all([
    r.length ? Qe(t, r, a, i, !0) : Promise.resolve({}),
    n.length ? Qe(t, n, a, i, !1) : Promise.resolve({})
  ]);
  return Object.assign({}, ...s);
}
function Pt(t) {
  return {
    withAttributes: t.filter(Ze),
    withoutAttributes: t.filter((e) => !Ze(e))
  };
}
async function Qe(t, e, a, i, n) {
  const r = e.map((c) => c.entity_id), s = await t.callWS({
    type: "history/history_during_period",
    entity_ids: r,
    start_time: a.start.toISOString(),
    end_time: a.end.toISOString(),
    minimal_response: i.minimal_response ?? !0,
    significant_changes_only: i.significant_changes_only ?? !0,
    no_attributes: n
  });
  return Si(s, r);
}
function Si(t, e) {
  const a = {};
  if (Array.isArray(t))
    return t.forEach((i, n) => {
      if (!Array.isArray(i)) return;
      const r = e[n], s = et(i, r), c = s[0]?.entity_id ?? r;
      c && (a[c] = s);
    }), a;
  if (t && typeof t == "object")
    for (const [i, n] of Object.entries(
      t
    ))
      Array.isArray(n) && (a[i] = et(n, i));
  return a;
}
function et(t, e) {
  let a = e;
  return t.map((i) => {
    if (!i || typeof i != "object") return;
    const n = i, r = C(n.entity_id) ?? a;
    r && (a = r);
    const s = C(n.last_changed) ?? C(n.lc) ?? C(n.last_updated) ?? C(n.lu), c = C(n.state) ?? C(n.s);
    if (!r || !c || !s) return;
    const o = tt(n.attributes) ?? tt(n.a), l = {
      entity_id: r,
      state: c,
      last_changed: s
    };
    o && (l.attributes = o);
    const d = C(n.last_updated) ?? C(n.lu);
    return d && (l.last_updated = d), l;
  }).filter((i) => i !== void 0);
}
function C(t) {
  return typeof t == "string" ? t : void 0;
}
function tt(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : void 0;
}
function at(t, e, a, i, n = {}) {
  return e.map((r) => {
    const s = Ti(
      t[r.entity_id] ?? [],
      n[r.entity_id],
      a,
      r.entity_id
    ).filter((d) => d.state != null && d.last_changed).sort(
      (d, p) => new Date(d.last_changed).getTime() - new Date(p.last_changed).getTime()
    ), c = Pi(s), o = Ei(c, r, a, i), l = o.filter((d) => d.active);
    return {
      entity: r,
      segments: o,
      totalActiveMs: l.reduce(
        (d, p) => d + p.durationMs,
        0
      ),
      eventCount: l.length,
      currentState: o.at(-1)?.state,
      currentCategory: o.at(-1)?.category
    };
  });
}
function Ti(t, e, a, i) {
  const n = [...t];
  if (!e) return n;
  const r = new Date(
    e.last_changed || e.last_updated
  ).getTime(), s = Number.isFinite(r) ? Math.min(
    Math.max(r, a.start.getTime()),
    a.end.getTime()
  ) : a.start.getTime(), c = n.filter((o) => o.entity_id === i).sort(
    (o, l) => new Date(o.last_changed).getTime() - new Date(l.last_changed).getTime()
  ).at(-1);
  return (!c || new Date(c.last_changed).getTime() < s || c.state !== e.state) && n.push({
    entity_id: i,
    state: e.state,
    attributes: e.attributes,
    last_changed: new Date(s).toISOString(),
    last_updated: e.last_updated
  }), n;
}
function Ii(t, e, a) {
  if (e === "unknown" || e === "unavailable")
    return { category: "unknown", active: !1 };
  const i = t.domain || q(t.entity_id), r = t.config?.active_states ?? xa[i] ?? ["on"], s = t.config?.active_attributes ?? wa[i] ?? {};
  if (i === "climate" && !t.config?.active_states) {
    const o = a?.hvac_action;
    if (typeof o == "string" && o.trim()) {
      const l = s.hvac_action ?? [];
      return {
        category: _e(i, o),
        active: l.includes(o)
      };
    }
  }
  for (const [o, l] of Object.entries(s)) {
    const d = a?.[o];
    if (typeof d == "string" && l.includes(d))
      return { category: _e(i, d), active: !0 };
  }
  const c = r.includes(e);
  return { category: _e(i, e), active: c };
}
function Ei(t, e, a, i) {
  if (!t.length) return [];
  const n = [], r = a.start.getTime(), s = a.end.getTime();
  for (let o = 0; o < t.length; o += 1) {
    const l = t[o];
    if (!l) continue;
    const d = t[o + 1], p = new Date(l.last_changed).getTime(), u = d ? new Date(d.last_changed).getTime() : s, g = Math.max(p, r), f = Math.min(u, s);
    if (f <= g) continue;
    const w = Ii(
      e,
      l.state,
      l.attributes
    ), x = f - g;
    n.push({
      entity_id: e.entity_id,
      state: l.state,
      category: w.category,
      active: w.active,
      start: new Date(g),
      end: new Date(f),
      durationMs: x,
      attributes: l.attributes
    });
  }
  return Hi(n, i.merge_gap_seconds ?? 0).filter(
    (o) => !o.active || !i.min_duration_seconds || o.durationMs >= i.min_duration_seconds * 1e3
  );
}
function Pi(t) {
  const e = [];
  for (const a of t) {
    const i = e.at(-1);
    i && i.state === a.state && it(i) === it(a) || e.push(a);
  }
  return e;
}
function it(t) {
  const e = t.attributes ?? {}, a = {
    hvac_action: e.hvac_action,
    temperature: e.temperature,
    current_temperature: e.current_temperature,
    media_title: e.media_title
  };
  return JSON.stringify(a);
}
function Hi(t, e) {
  if (!t.length) return t;
  const a = Math.max(0, e) * 1e3, i = [];
  for (const n of t) {
    const r = i.at(-1);
    r && r.entity_id === n.entity_id && r.category === n.category && r.state === n.state && n.start.getTime() - r.end.getTime() <= a ? (r.end = n.end, r.durationMs = r.end.getTime() - r.start.getTime()) : i.push({ ...n });
  }
  return i;
}
function _e(t, e) {
  return e === "unknown" || e === "unavailable" ? "unknown" : ["off", "closed", "idle", "paused", "standby"].includes(e) ? e === "idle" ? "idle" : "off" : ["cool", "cooling"].includes(e) ? "cooling" : ["heat", "heating"].includes(e) ? "heating" : ["playing"].includes(e) ? "playing" : ["opening", "open"].includes(e) ? "opening" : ["closing"].includes(e) ? "closing" : t === "climate" && ["drying", "dry"].includes(e) ? "drying" : t === "climate" && ["fan", "fan_only"].includes(e) ? "fan" : "on";
}
const ye = [
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
function Li(t) {
  return Ht(t).map((e) => ({
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
function Di(t, e) {
  const a = {}, i = t.end.getTime();
  for (const n of Ht(e)) {
    const r = [
      ge(n.entity_id, "off", t.start.getTime(), void 0)
    ];
    for (const s of n.pattern) {
      const c = i + s.startHour * 36e5, o = i + s.endHour * 36e5;
      o <= t.start.getTime() || c >= t.end.getTime() || (r.push(
        ge(
          n.entity_id,
          s.state,
          Math.max(c, t.start.getTime()),
          s.attributes
        )
      ), r.push(
        ge(
          n.entity_id,
          "off",
          Math.min(o, t.end.getTime()),
          void 0
        )
      ));
    }
    a[n.entity_id] = r.sort(
      (s, c) => new Date(s.last_changed).getTime() - new Date(c.last_changed).getTime()
    ).filter(
      (s, c, o) => c === 0 || s.last_changed !== o[c - 1]?.last_changed
    );
  }
  return a;
}
function Ht(t) {
  return t === "mockup05_visual" ? [] : t === "large_noisy_home" ? [...ye, ...Bi()] : t === "area_inventory" ? Ni() : t === "clean_activity_dashboard" ? Fi() : ye;
}
function Ni() {
  return [
    ...ye.slice(0, 6),
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
function Fi() {
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
function Bi() {
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
    const r = t[n % t.length] ?? "Power", s = a[n % a.length] ?? "switch", c = n % 7 === 0 ? "diagnostic" : n % 11 === 0 ? "config" : void 0, o = r.toLowerCase().replace(/[^a-z0-9\u0590-\u05ff]+/gi, "_").replace(/^_+|_+$/g, "");
    i.push({
      entity_id: `${s}.large_noisy_${n}_${o || "entity"}`,
      name: r,
      area: e[n % e.length] ?? "ללא אזור",
      domain: s,
      icon: s === "sensor" ? "mdi:gauge" : "mdi:toggle-switch",
      entity_category: c,
      labels: n % 13 === 0 ? ["לא להצגה"] : void 0,
      pattern: n % 19 === 0 ? [{ startHour: -2, endHour: -1.95, state: "on" }] : []
    });
  }
  return i;
}
function ge(t, e, a, i) {
  return {
    entity_id: t,
    state: e,
    attributes: i,
    last_changed: new Date(a).toISOString(),
    last_updated: new Date(a).toISOString()
  };
}
function Oi(t, e, a = 320, i = 220) {
  if (e.width <= 640)
    return {
      x: 12,
      y: Math.max(12, e.height - i - 12),
      placement: "bottom"
    };
  const n = 16, r = t.left + t.width / 2 - a / 2, s = t.top + t.height + 12, c = nt(r, n, e.width - a - n), o = nt(s, n, e.height - i - n);
  return { x: c, y: o, placement: "floating" };
}
function nt(t, e, a) {
  return a < e ? e : Math.min(a, Math.max(e, t));
}
function Lt(t) {
  return !Number.isFinite(t) || !t ? 300 : Math.max(30, Math.floor(t));
}
function ji(t) {
  if (!t.hasFetchedOnce) return !0;
  if (!t.live) return !1;
  const e = Lt(t.refreshIntervalSeconds) * 1e3;
  return t.now - t.lastHistoryFetchAt >= e;
}
function Gi() {
  return h`<div class="ahc-state-card">
    <div>
      <h3 class="ahc-state-card__title">קורלציות</h3>
      <p>מצב קורלציה ויומן אירועים יפותח בשלב הבא.</p>
    </div>
  </div>`;
}
function Ui() {
  return h`<div class="ahc-state-card">
    <div>
      <h3 class="ahc-state-card__title">פירוט רכיב</h3>
      <p>מסך Drill-down לרכיב יפותח אחרי תצוגת Swimlane.</p>
    </div>
  </div>`;
}
function Vi() {
  return h`<div class="ahc-state-card">
    <div>
      <h3 class="ahc-state-card__title">Heatmap</h3>
      <p>מצב זה יפותח אחרי ה-MVP.</p>
    </div>
  </div>`;
}
const qi = [
  { label: "18:00", percent: 0 },
  { label: "22:00", percent: 20 },
  { label: "02:00", percent: 40 },
  { label: "06:00", percent: 60 },
  { label: "10:00", percent: 80 },
  { label: "14:00", percent: 100 }
], Ki = [
  0.12,
  0.22,
  0.18,
  0.28,
  0.2,
  0.16,
  0.34,
  0.46,
  0.62,
  0.72,
  0.58,
  0.4,
  0.24,
  0.18,
  0.26,
  0.38,
  0.66,
  0.82,
  0.74,
  0.52,
  0.3,
  0.2,
  0.16,
  0.12
], Wi = Ki.map(
  (t, e) => ({
    id: `density-${e}`,
    label: `${String(e).padStart(2, "0")}:00`,
    value: `${Math.round(t * 12)} אירועים`,
    intensity: t,
    active: t > 0.22
  })
), S = {
  hero: {
    title: "היסטוריית פעילות חכמה",
    subtitle: "Home Assistant · שעות אחרונות · תצוגת מוקאפ 05",
    icon: "mdi:chart-timeline-variant-shimmer",
    status: "מוכן לתצוגה"
  },
  toolbar: {
    timePresets: [
      { id: "24h", label: "24 שעות", active: !0 },
      { id: "7d", label: "7 ימים" },
      { id: "custom", label: "מותאם" }
    ],
    groupBy: [
      { id: "area", label: "אזור", active: !0 },
      { id: "domain", label: "סוג" },
      { id: "none", label: "ללא" }
    ],
    searchPlaceholder: "חיפוש רכיב או אזור...",
    filtersLabel: "סינון"
  },
  summary: [
    {
      id: "active-now",
      label: "פעילים עכשיו",
      value: "18",
      caption: "רכיבים במצב פעיל",
      icon: "mdi:circle-medium",
      tone: "on"
    },
    {
      id: "active-components",
      label: "רכיבים שפעלו",
      value: "42",
      caption: "מתוך 57 אביזרים במלאי",
      icon: "mdi:toggle-switch-outline",
      tone: "cooling"
    },
    {
      id: "events",
      label: "אירועים",
      value: "169",
      caption: "שינויי מצב פעילים",
      icon: "mdi:timeline-clock-outline",
      tone: "playing"
    },
    {
      id: "component-hours",
      label: "סה״כ שעות־רכיב",
      value: "42:18",
      caption: "סכום פעילות על פני כל הרכיבים",
      icon: "mdi:clock-outline",
      tone: "heating"
    },
    {
      id: "last-event",
      label: "אירוע אחרון",
      value: "מזגן סלון",
      caption: "קירור · סלון · לפני 3 דק׳",
      icon: "mdi:snowflake",
      tone: "cooling"
    }
  ],
  rangeLabel: "18:00 - 14:00 · 24 שעות",
  axisLabels: qi,
  density: Wi,
  groups: [
    {
      id: "living",
      title: "סלון",
      icon: "mdi:sofa-outline",
      meta: "7 רכיבים · 12:35 שעות",
      activityLabel: "פעילות רציפה",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [
        { leftPct: 6, widthPct: 12, tone: "on", label: "תאורת סלון" },
        { leftPct: 22, widthPct: 18, tone: "cooling", label: "מזגן" },
        { leftPct: 58, widthPct: 9, tone: "playing", label: "מוזיקה" },
        { leftPct: 78, widthPct: 14, tone: "on", label: "סצנת ערב" }
      ],
      rows: [
        {
          id: "living-ac",
          entityId: "climate.living_room",
          label: "מזגן סלון",
          secondary: "אקלים · סלון",
          state: "קירור",
          stateTone: "cooling",
          icon: "mdi:snowflake",
          totalLabel: "4:18",
          eventLabel: "9 אירועים",
          segments: [
            { leftPct: 20, widthPct: 14, tone: "cooling", label: "קירור ערב" },
            { leftPct: 50, widthPct: 8, tone: "cooling", label: "קירור קצר" },
            { leftPct: 78, widthPct: 15, tone: "cooling", label: "קירור בוקר" }
          ]
        },
        {
          id: "living-main-light",
          entityId: "light.living_room_main",
          label: "תאורת סלון ראשית",
          secondary: "תאורה · סלון",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:ceiling-light",
          totalLabel: "3:04",
          eventLabel: "14 אירועים",
          segments: [
            { leftPct: 5, widthPct: 10, tone: "on", label: "אור ערב" },
            { leftPct: 63, widthPct: 4, tone: "on", label: "בדיקה" },
            { leftPct: 82, widthPct: 12, tone: "on", label: "אור בוקר" }
          ]
        },
        {
          id: "living-media",
          entityId: "media_player.living_room",
          label: "רמקול סלון",
          secondary: "מדיה · סלון",
          state: "מנגן",
          stateTone: "playing",
          icon: "mdi:speaker-wireless",
          totalLabel: "1:26",
          eventLabel: "5 אירועים",
          segments: [
            { leftPct: 56, widthPct: 7, tone: "playing", label: "מוזיקה" },
            { leftPct: 74, widthPct: 6, tone: "playing", label: "רדיו" }
          ]
        }
      ],
      inventoryItems: [
        {
          id: "living-ac-chip",
          entityId: "climate.living_room",
          label: "מזגן סלון",
          secondary: "אקלים",
          state: "קירור",
          stateTone: "cooling",
          icon: "mdi:snowflake",
          activeNow: !0,
          hadActivity: !0
        },
        {
          id: "living-light-chip",
          entityId: "light.living_room_main",
          label: "תאורה ראשית",
          secondary: "תאורה",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:ceiling-light",
          activeNow: !0,
          hadActivity: !0
        },
        {
          id: "living-media-chip",
          entityId: "media_player.living_room",
          label: "רמקול סלון",
          secondary: "מדיה",
          state: "מנגן",
          stateTone: "playing",
          icon: "mdi:speaker",
          activeNow: !0,
          hadActivity: !0
        },
        {
          id: "living-cover-chip",
          entityId: "cover.living_room",
          label: "תריס סלון",
          secondary: "כיסוי",
          state: "סגור",
          stateTone: "idle",
          icon: "mdi:window-shutter",
          hadActivity: !0
        }
      ],
      inventoryTotal: 7,
      hiddenInventoryCount: 3
    },
    {
      id: "kitchen",
      title: "מטבח",
      icon: "mdi:silverware-fork-knife",
      meta: "6 רכיבים · 8:10 שעות",
      activityLabel: "פעילות בוקר",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [
        { leftPct: 4, widthPct: 6, tone: "on", label: "קפה" },
        { leftPct: 67, widthPct: 12, tone: "on", label: "בישול" },
        { leftPct: 82, widthPct: 9, tone: "fan", label: "קולט אדים" }
      ],
      rows: [
        {
          id: "kitchen-strip",
          entityId: "light.kitchen_strip",
          label: "פס לד מטבח",
          secondary: "תאורה · מטבח",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:led-strip-variant",
          totalLabel: "2:12",
          eventLabel: "11 אירועים",
          segments: [
            { leftPct: 3, widthPct: 8, tone: "on", label: "קפה" },
            { leftPct: 70, widthPct: 15, tone: "on", label: "בישול" }
          ]
        },
        {
          id: "kitchen-fan",
          entityId: "fan.kitchen_hood",
          label: "קולט אדים",
          secondary: "מאוורר · מטבח",
          state: "פועל",
          stateTone: "fan",
          icon: "mdi:fan",
          totalLabel: "0:58",
          eventLabel: "4 אירועים",
          segments: [
            { leftPct: 79, widthPct: 10, tone: "fan", label: "אוורור" }
          ]
        }
      ],
      inventoryItems: [
        {
          id: "kitchen-strip-chip",
          entityId: "light.kitchen_strip",
          label: "פס לד",
          secondary: "תאורה",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:led-strip-variant",
          activeNow: !0,
          hadActivity: !0
        },
        {
          id: "kitchen-fan-chip",
          entityId: "fan.kitchen_hood",
          label: "קולט אדים",
          secondary: "מאוורר",
          state: "כבוי",
          stateTone: "idle",
          icon: "mdi:fan",
          hadActivity: !0
        },
        {
          id: "kitchen-switch-chip",
          entityId: "switch.kitchen_counter",
          label: "שקע שיש",
          secondary: "מתג",
          state: "כבוי",
          stateTone: "idle",
          icon: "mdi:power-socket-eu"
        }
      ],
      inventoryTotal: 6,
      hiddenInventoryCount: 3
    },
    {
      id: "kids",
      title: "חדרי ילדים",
      icon: "mdi:teddy-bear",
      meta: "5 רכיבים · 6:48 שעות",
      activityLabel: "פעילות ערב",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [
        { leftPct: 12, widthPct: 11, tone: "on", label: "לילה" },
        { leftPct: 61, widthPct: 13, tone: "heating", label: "חימום" }
      ],
      rows: [
        {
          id: "kids-night",
          entityId: "light.kids_night",
          label: "מנורת לילה",
          secondary: "תאורה · חדר ילדים",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:lamp",
          totalLabel: "5:22",
          eventLabel: "7 אירועים",
          segments: [
            { leftPct: 11, widthPct: 13, tone: "on", label: "שנת לילה" },
            { leftPct: 88, widthPct: 4, tone: "on", label: "התעוררות" }
          ]
        },
        {
          id: "kids-heater",
          entityId: "climate.kids_room",
          label: "חימום חדר ילדים",
          secondary: "אקלים · חדר ילדים",
          state: "חימום",
          stateTone: "heating",
          icon: "mdi:radiator",
          totalLabel: "1:26",
          eventLabel: "3 אירועים",
          segments: [
            { leftPct: 60, widthPct: 15, tone: "heating", label: "חימום" }
          ]
        }
      ],
      inventoryItems: [
        {
          id: "kids-night-chip",
          entityId: "light.kids_night",
          label: "מנורת לילה",
          secondary: "תאורה",
          state: "דלוק",
          stateTone: "on",
          icon: "mdi:lamp",
          activeNow: !0,
          hadActivity: !0
        },
        {
          id: "kids-heater-chip",
          entityId: "climate.kids_room",
          label: "חימום",
          secondary: "אקלים",
          state: "חימום",
          stateTone: "heating",
          icon: "mdi:radiator",
          hadActivity: !0
        }
      ],
      inventoryTotal: 5,
      hiddenInventoryCount: 3
    },
    {
      id: "balcony",
      title: "מרפסת",
      icon: "mdi:flower-outline",
      meta: "4 רכיבים · 4:45 שעות",
      activityLabel: "פתיחות ותאורה",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [
        { leftPct: 18, widthPct: 8, tone: "open", label: "תריס נפתח" },
        { leftPct: 72, widthPct: 7, tone: "on", label: "תאורה" }
      ],
      rows: [
        {
          id: "balcony-cover",
          entityId: "cover.balcony",
          label: "תריס מרפסת",
          secondary: "כיסוי · מרפסת",
          state: "נפתח",
          stateTone: "open",
          icon: "mdi:window-shutter-open",
          totalLabel: "0:18",
          eventLabel: "5 אירועים",
          segments: [
            { leftPct: 18, widthPct: 3, tone: "open", label: "פתיחה" },
            { leftPct: 24, widthPct: 2, tone: "open", label: "סגירה" }
          ]
        },
        {
          id: "balcony-light",
          entityId: "light.balcony",
          label: "תאורת מרפסת",
          secondary: "תאורה · מרפסת",
          state: "כבוי",
          stateTone: "idle",
          icon: "mdi:outdoor-lamp",
          totalLabel: "1:05",
          eventLabel: "2 אירועים",
          segments: [
            { leftPct: 71, widthPct: 8, tone: "on", label: "תאורת ערב" }
          ]
        }
      ],
      inventoryItems: [
        {
          id: "balcony-cover-chip",
          entityId: "cover.balcony",
          label: "תריס מרפסת",
          secondary: "כיסוי",
          state: "סגור",
          stateTone: "idle",
          icon: "mdi:window-shutter",
          hadActivity: !0
        },
        {
          id: "balcony-light-chip",
          entityId: "light.balcony",
          label: "תאורת מרפסת",
          secondary: "תאורה",
          state: "כבוי",
          stateTone: "idle",
          icon: "mdi:outdoor-lamp",
          hadActivity: !0
        }
      ],
      inventoryTotal: 4,
      hiddenInventoryCount: 2
    },
    {
      id: "pool",
      title: "בריכה",
      icon: "mdi:pool",
      meta: "9 רכיבים · 0 דקות",
      activityLabel: "אין פעילות בטווח",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [],
      rows: [],
      inventoryItems: [
        {
          id: "pool-pump-chip",
          entityId: "switch.pool_pump",
          label: "משאבת בריכה",
          secondary: "מתג",
          state: "כבוי",
          stateTone: "idle",
          icon: "mdi:pump"
        },
        {
          id: "pool-light-chip",
          entityId: "light.pool",
          label: "תאורת בריכה",
          secondary: "תאורה",
          state: "כבוי",
          stateTone: "idle",
          icon: "mdi:lightbulb-outline"
        }
      ],
      inventoryTotal: 9,
      hiddenInventoryCount: 7
    },
    {
      id: "laundry",
      title: "כביסה",
      icon: "mdi:washing-machine",
      meta: "4 רכיבים · 0 דקות",
      activityLabel: "אין פעילות בטווח",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [],
      rows: [],
      inventoryItems: [],
      inventoryTotal: 4,
      hiddenInventoryCount: 4
    },
    {
      id: "storage",
      title: "מחסן",
      icon: "mdi:garage",
      meta: "3 רכיבים · 0 דקות",
      activityLabel: "אין פעילות בטווח",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [],
      rows: [],
      inventoryItems: [],
      inventoryTotal: 3,
      hiddenInventoryCount: 3
    },
    {
      id: "guest-room",
      title: "חדר אורחים",
      icon: "mdi:bed-outline",
      meta: "5 רכיבים · 0 דקות",
      activityLabel: "אין פעילות בטווח",
      inventoryLabel: "כל האביזרים",
      aggregateSegments: [],
      rows: [],
      inventoryItems: [],
      inventoryTotal: 5,
      hiddenInventoryCount: 5
    }
  ],
  insights: [
    {
      id: "most-active-entity",
      title: "הרכיב הפעיל ביותר",
      value: "מנורת לילה",
      caption: "חדרי ילדים · 5:22 שעות",
      icon: "mdi:star-four-points"
    },
    {
      id: "most-active-area",
      title: "האזור הפעיל ביותר",
      value: "סלון",
      caption: "7 רכיבים · 12:35 שעות",
      icon: "mdi:home-lightning-bolt-outline"
    },
    {
      id: "peak-hours",
      title: "שעות שיא",
      value: "07:00 - 09:00",
      caption: "צפיפות פעילות גבוהה",
      icon: "mdi:chart-bar"
    },
    {
      id: "short-pattern",
      title: "דפוס שימוש קצר",
      value: "ערב ובוקר",
      caption: "רוב הפעילות סביב תאורה ואקלים",
      icon: "mdi:lightning-bolt-outline"
    }
  ]
}, Yi = {
  on: "ahc-dashboard-segment--on",
  cooling: "ahc-dashboard-segment--cooling",
  heating: "ahc-dashboard-segment--heating",
  playing: "ahc-dashboard-segment--playing",
  open: "ahc-dashboard-segment--open",
  fan: "ahc-dashboard-segment--fan"
};
function Xi(t, e = {}) {
  return h`
    <section class="ahc__hero" dir="rtl">
      <div class="ahc__hero-main">
        <span class="ahc__hero-icon" aria-hidden="true">
          <ha-icon icon=${t.icon}></ha-icon>
        </span>
        <div>
          <h2 class="ahc__hero-title">${t.title}</h2>
          <p class="ahc__hero-subtitle">${t.subtitle}</p>
        </div>
      </div>
      <div class="ahc__hero-actions">
        ${t.status ? h`<span class="ahc__status-pill">${t.status}</span>` : _}
        ${e.onRefresh ? h`<button
              class="ahc__button ahc__button--ghost"
              type="button"
              @click=${e.onRefresh}
            >
              <ha-icon icon="mdi:refresh"></ha-icon>
              <span>רענן</span>
            </button>` : _}
        ${e.onFullscreen ? h`<button
              class="ahc__button ahc__button--icon"
              type="button"
              aria-label="מסך מלא"
              @click=${e.onFullscreen}
            >
              <ha-icon icon="mdi:fullscreen"></ha-icon>
            </button>` : _}
      </div>
    </section>
  `;
}
function Ji(t) {
  return h`
    <section class="ahc__toolbar" dir="rtl" aria-label="סינון פעילות">
      <div class="ahc__toolbar-group" role="group" aria-label="טווח זמן">
        <span class="ahc__toolbar-label">טווח זמן</span>
        ${t.timePresets.map(
    (e) => ot(e.label, e.active)
  )}
      </div>
      <div class="ahc__toolbar-group" role="group" aria-label="קיבוץ לפי">
        <span class="ahc__toolbar-label">קבץ לפי</span>
        ${t.groupBy.map(
    (e) => ot(e.label, e.active)
  )}
      </div>
      <label class="ahc__search" aria-label="חיפוש">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input type="search" placeholder=${t.searchPlaceholder} />
      </label>
      <button class="ahc__button ahc__filter-chip" type="button">
        <ha-icon icon="mdi:tune-variant"></ha-icon>
        <span>${t.filtersLabel}</span>
      </button>
    </section>
  `;
}
function rt(t) {
  return h`
    <section class="ahc__summary-strip" dir="rtl" aria-label="סיכום פעילות">
      ${t.map(
    (e) => h`
          <article
            class="ahc__metric ahc__summary-card"
            data-tone=${e.tone ?? "idle"}
          >
            <span
              class="ahc__metric-icon ahc__summary-card-icon"
              aria-hidden="true"
            >
              <ha-icon icon=${e.icon}></ha-icon>
            </span>
            <div class="ahc__metric-copy">
              <span>${e.label}</span>
              <strong>${e.value}</strong>
              <small>${e.caption}</small>
            </div>
          </article>
        `
  )}
    </section>
  `;
}
function Dt(t, e = {}) {
  if (!t.groups.length) return on();
  const a = { ...e, nowPercent: t.nowPercent }, i = t.groups.filter((o) => o.rows.length > 0), n = t.groups.filter(
    (o) => o.rows.length === 0
  ), r = n.slice(0, 3), s = Math.max(
    0,
    n.length - r.length
  ), c = e.openInventoryGroupId ? t.groups.find((o) => o.id === e.openInventoryGroupId) : void 0;
  return h`
    <section
      class="ahc-dashboard"
      dir="rtl"
      aria-label="ציר זמן פעילות"
      style=${cn(e.config)}
    >
      <header class="ahc-dashboard__header">
        <div class="ahc-dashboard__title-block">
          <h3>ציר זמן פעילות</h3>
          <p>${t.groups.length} אזורים · ${t.rangeLabel}</p>
        </div>
        <div class="ahc-dashboard__range-pill">${t.rangeLabel}</div>
      </header>

      ${e.config?.show_activity_density === !1 ? _ : Zi(t.density)}

      <section
        class="ahc-dashboard__timeline"
        aria-label="פעילות לפי אזור ורכיב"
      >
        ${sn(t.axisLabels, e.config, t.nowPercent)}
        <div class="ahc-dashboard__scroll">
          <div class="ahc-dashboard__groups ahc-dashboard__lanes">
            ${i.map(
    (o) => Qi(o, t.axisLabels, a)
  )}
            ${r.map(
    (o) => en(o, a)
  )}
            ${s > 0 ? tn(s) : _}
          </div>
        </div>
        ${c ? rn(c, a) : _}
      </section>
    </section>
  `;
}
function Zi(t) {
  const e = t.length ? t : dn();
  return h`
    <section
      class="ahc-dashboard__density"
      dir="ltr"
      aria-label="צפיפות פעילות"
    >
      <div class="ahc-timegrid ahc-timegrid--density" dir="ltr">
        <div
          class="ahc-dashboard__density-bars"
          style=${`--bucket-count:${e.length}`}
        >
          ${e.map(
    (a) => h`
              <span
                class="ahc-dashboard-density-bucket"
                data-active=${a.active ? "true" : "false"}
                title=${`${a.label} · ${a.value}`}
              >
                <i
                  class="ahc-dashboard-density-fill"
                  style=${`--intensity:${a.intensity}`}
                ></i>
              </span>
            `
  )}
        </div>
      </div>
    </section>
  `;
}
function Qi(t, e = [], a = {}) {
  const i = t.expandedInventory === !0, n = t.rows.length > 0, r = t.inventoryItems.length > 0, s = a.config?.desktop_density === "ultra_compact" ? 3 : 4, c = t.rows.slice(0, s), o = Math.max(0, t.rows.length - c.length), l = i && r;
  return h`
    <section
      class="ahc-area-lane ahc-area-lane--active ahc-area-card ahc-dashboard-group"
      data-has-activity=${n ? "true" : "false"}
      data-inventory-expanded=${i ? "true" : "false"}
    >
      <header
        class="ahc-area-lane__header ahc-area-card__header ahc-dashboard-group__header"
      >
        <div
          class="ahc-area-lane__title ahc-area-card__title ahc-dashboard-group__title"
        >
          ${ce(t.icon, "ahc-dashboard-icon")}
          <div class="ahc-area-card__title-copy">
            <strong>${t.title}</strong>
            <span class="ahc-area-lane__meta">${t.meta}</span>
          </div>
        </div>
        <div class="ahc-area-card__actions">
          <div class="ahc-area-card__meta ahc-dashboard-group__meta">
            ${t.activityLabel}
          </div>
          ${r ? h`<button
                class="ahc-area-lane__inventory-trigger ahc-area-card__inventory-button"
                type="button"
                aria-expanded=${i ? "true" : "false"}
                @click=${() => a.onInventoryToggle?.(t.id)}
              >
                ${i ? "צמצם" : t.inventoryLabel}
              </button>` : _}
        </div>
      </header>

      ${n || t.aggregateSegments.length ? h`<div
            class="ahc-area-lane__aggregate ahc-area-card__aggregate ahc-dashboard-group__aggregate"
            dir="ltr"
            aria-label=${`פעילות מצטברת עבור ${t.title}`}
          >
            ${Bt(
    e,
    "aggregate",
    t.aggregateSegments.map(
      (d) => Ft(d, "aggregate", a.config)
    ),
    a.config,
    a.nowPercent
  )}
          </div>` : _}

      <div
        class="ahc-area-lane__content ahc-area-card__content ahc-dashboard-group__body"
      >
        ${n ? h`<section
              class="ahc-area-card__activity"
              aria-label=${`פעילות באזור ${t.title}`}
            >
              <div class="ahc-area-lane__rows ahc-dashboard-group__rows">
                ${c.map(
    (d) => an(d, e, a)
  )}
                ${o > 0 ? h`<div
                      class="ahc-area-lane__empty-summary ahc-dashboard-group__more"
                    >
                      עוד ${o} רכיבים פעילים
                    </div>` : _}
              </div>
            </section>` : _}
        ${l ? nn(t, a) : _}
      </div>
    </section>
  `;
}
function en(t, e) {
  const a = t.inventoryItems.length > 0;
  return h`
    <section
      class="ahc-area-lane ahc-area-lane--inactive ahc-area-card ahc-dashboard-group"
      data-has-activity="false"
      data-inventory-expanded="false"
    >
      <header
        class="ahc-area-lane__header ahc-area-card__header ahc-dashboard-group__header"
      >
        <div
          class="ahc-area-lane__title ahc-area-card__title ahc-dashboard-group__title"
        >
          ${ce(t.icon, "ahc-dashboard-icon")}
          <div class="ahc-area-card__title-copy">
            <strong>${t.title}</strong>
            <span class="ahc-area-lane__meta">${t.meta}</span>
          </div>
        </div>
        <div class="ahc-area-card__actions">
          <div
            class="ahc-area-lane__empty-summary ahc-area-card__meta ahc-dashboard-group__meta"
          >
            אין פעילות בטווח
          </div>
          ${a ? h`<button
                class="ahc-area-lane__inventory-trigger ahc-area-card__inventory-button"
                type="button"
                aria-expanded="false"
                @click=${() => e.onInventoryToggle?.(t.id)}
              >
                ${t.inventoryLabel}
              </button>` : _}
        </div>
      </header>
    </section>
  `;
}
function tn(t) {
  return h`
    <section
      class="ahc-area-lane ahc-area-lane--inactive ahc-area-lane--more ahc-area-card ahc-dashboard-group"
      data-has-activity="false"
      data-inventory-expanded="false"
    >
      <div class="ahc-area-lane__empty-summary">
        עוד ${t} אזורים ללא פעילות
      </div>
    </section>
  `;
}
function an(t, e = [], a = {}) {
  return h`
    <div class="ahc-lane-row ahc-dashboard-row" dir="rtl">
      <div class="ahc-lane-row__label ahc-dashboard-row__label" dir="rtl">
        ${ce(t.icon, "ahc-dashboard-row__label-icon")}
        <div class="ahc-dashboard-row__label-copy">
          <strong class="ahc-lane-row__name" title=${t.label}>
            ${t.label}
          </strong>
          ${t.secondary ? h`<span title=${t.secondary}>${t.secondary}</span>` : _}
          ${t.totalLabel ? h`<small class="ahc-lane-row__duration">
                ${t.totalLabel}
              </small>` : _}
          <span
            class="ahc-dashboard-row__state"
            data-state-tone=${t.stateTone ?? "idle"}
          >
            ${t.state}
          </span>
        </div>
      </div>

      <div
        class="ahc-lane-row__plot ahc-dashboard-row__plot"
        dir="ltr"
        role="img"
        aria-label=${`פעילות עבור ${t.label}`}
      >
        ${Bt(
    e,
    "row",
    t.segments.map(
      (i, n) => Ft(i, "row", a.config, (r) => {
        t.entityId && a.onSegmentClick?.(
          r,
          t.entityId,
          i.sourceIndex ?? n
        );
      })
    ),
    a.config,
    a.nowPercent
  )}
      </div>
    </div>
  `;
}
function st(t) {
  return h`
    <section class="ahc__insights" dir="rtl" aria-label="תובנות חכמות">
      <header class="ahc__insights-header">
        <h3>תובנות חכמות</h3>
        <ha-icon icon="mdi:star-four-points"></ha-icon>
      </header>
      ${t.map(
    (e) => h`
          <article class="ahc__insight-card ahc-insight-card">
            <div class="ahc-insight-card__title">
              ${e.icon ? h`<ha-icon icon=${e.icon}></ha-icon>` : _}
              <span>${e.title}</span>
            </div>
            <strong class="ahc-insight-card__value">${e.value}</strong>
            <small class="ahc-insight-card__caption">${e.caption}</small>
          </article>
        `
  )}
    </section>
  `;
}
function ot(t, e = !1) {
  return h`
    <button
      class=${e ? "ahc__filter-chip ahc__filter-chip--active" : "ahc__filter-chip"}
      type="button"
      aria-pressed=${e ? "true" : "false"}
    >
      ${t}
    </button>
  `;
}
function nn(t, e) {
  const a = t.expandedInventory === !0, i = a ? t.inventoryItems : t.inventoryItems.slice(0, 4), n = t.hiddenInventoryCount ?? Math.max(0, t.inventoryTotal - t.inventoryItems.length);
  return h`
    <section
      class="ahc-area-card__inventory-preview ahc-area-inventory"
      aria-label=${`אביזרים באזור ${t.title}`}
    >
      <header class="ahc-area-inventory__header">
        <span>${t.inventoryLabel}</span>
        <small>${t.inventoryTotal} אביזרים</small>
      </header>
      <div class="ahc-area-inventory__groups">
        <div class="ahc-area-inventory__domain">
          <div class="ahc-area-inventory__chips">
            ${i.map((r) => Nt(r, e))}
          </div>
        </div>
      </div>
      ${!a && n > 0 ? h`<button
            class="ahc-area-inventory__more"
            type="button"
            @click=${() => e.onInventoryToggle?.(t.id)}
          >
            עוד ${n} אביזרים
          </button>` : _}
    </section>
  `;
}
function rn(t, e) {
  const a = t.inventoryItems;
  return h`
    <aside
      class="ahc-inventory-drawer"
      dir="rtl"
      aria-label=${`כל האביזרים · ${t.title}`}
    >
      <header class="ahc-inventory-drawer__header">
        <div>
          <strong class="ahc-inventory-drawer__title">
            כל האביזרים · ${t.title}
          </strong>
          <span class="ahc-inventory-drawer__meta">
            ${t.inventoryTotal} רכיבים באזור
          </span>
        </div>
        <button
          class="ahc-inventory-drawer__close"
          type="button"
          aria-label="סגור"
          @click=${() => e.onInventoryClose?.()}
        >
          ×
        </button>
      </header>
      <div class="ahc-inventory-drawer__items">
        ${a.map((i) => Nt(i, e))}
      </div>
    </aside>
  `;
}
function Nt(t, e) {
  const a = [t.label, t.secondary, t.state].filter(Boolean).join(" · ");
  return h`
    <button
      class="ahc-inventory-chip"
      type="button"
      data-active-now=${t.activeNow ? "true" : "false"}
      data-had-activity=${t.hadActivity ? "true" : "false"}
      data-state-tone=${t.stateTone ?? "idle"}
      title=${a}
      aria-label=${a}
      @click=${(i) => t.entityId ? e.onInventoryItemClick?.(i, t.entityId) : void 0}
    >
      ${ce(t.icon, "ahc-inventory-chip__icon")}
      <span class="ahc-inventory-chip__copy">
        <strong>${t.label}</strong>
        <small class="ahc-inventory-chip__state">${t.state}</small>
      </span>
    </button>
  `;
}
function Ft(t, e, a, i) {
  const n = [
    "ahc-dashboard-segment",
    `ahc-dashboard-segment--${e}`,
    Yi[t.tone],
    t.minVisible ? "ahc-dashboard-segment--min" : ""
  ].filter(Boolean).join(" "), r = `left:${t.leftPct}%;width:${t.widthPct}%`, s = a?.debug_timeline_geometry === !0 ? `${t.label} · left ${t.leftPct.toFixed(2)}% · width ${t.widthPct.toFixed(2)}%` : t.label;
  return i ? h`
    <button
      class=${n}
      type="button"
      data-category=${t.tone}
      style=${r}
      title=${s}
      aria-label=${s}
      @click=${i}
    >
      <span>${t.label}</span>
    </button>
  ` : h`<span
      class=${n}
      data-category=${t.tone}
      style=${r}
      title=${s}
    ></span>`;
}
function Bt(t, e, a, i, n) {
  return h`
    <div class=${`ahc-timegrid ahc-timegrid--${e}`} dir="ltr">
      ${Ot(t)}
      ${i?.show_now_line === !1 ? _ : jt(t, "line", n)}
      <div class="ahc-timegrid__segments">${a}</div>
    </div>
  `;
}
function sn(t, e, a) {
  return h`
    <div class="ahc-dashboard__axis" dir="ltr" aria-hidden="true">
      ${Ot(t)}
      <div class="ahc-dashboard__axis-labels">
        ${t.filter((i) => i.label.trim()).map(
    (i) => h`
              <span
                class="ahc-dashboard__tick ahc-dashboard__axis-label"
                data-edge=${hn(i.percent)}
                style=${`left:${i.percent}%`}
                >${i.label}</span
              >
            `
  )}
        ${e?.show_now_line === !1 ? _ : jt(t, "label", a)}
      </div>
    </div>
  `;
}
function Ot(t) {
  const e = t.length ? t : ln();
  return h`
    <div class="ahc-timegrid__grid" aria-hidden="true">
      ${e.map(
    (a) => h`
          <span
            class=${a.major === !1 ? "ahc-timegrid__line ahc-timegrid__line--minor" : "ahc-timegrid__line ahc-timegrid__line--major"}
            style=${`left:${a.percent}%`}
          ></span>
        `
  )}
    </div>
  `;
}
function jt(t, e = "line", a) {
  if (!t.length || a === null) return _;
  const i = t.at(-1)?.percent ?? 86, n = Math.min(98, Math.max(2, a ?? i));
  return h`<span
    class=${e === "label" ? "ahc-timegrid__now ahc-timegrid__now--label" : "ahc-timegrid__now"}
    style=${`left:${n}%`}
    title="עכשיו"
    >${e === "label" ? h`<span class="ahc-timegrid__now-label">עכשיו</span>` : _}</span
  >`;
}
function ce(t, e = "") {
  return h`<span
    class=${["ahc-dashboard-icon", e].filter(Boolean).join(" ")}
    aria-hidden="true"
    ><ha-icon icon=${t}></ha-icon
  ></span>`;
}
function on() {
  return h`
    <section class="ahc-dashboard ahc-dashboard-empty" dir="rtl">
      <h3>לא נמצאה פעילות משמעותית בטווח הזה</h3>
      <p>
        נסה להגדיל את טווח הזמן, להציג את כל האביזרים, או לפתוח סינון מתקדם.
      </p>
    </section>
  `;
}
function cn(t) {
  return t?.timeline_height ? `--ahc-dashboard-height:${t.timeline_height};--ahc-timeline-height:${t.timeline_height}` : "";
}
function ln() {
  return [
    { label: "00:00", percent: 0 },
    { label: "04:00", percent: 20 },
    { label: "08:00", percent: 40 },
    { label: "12:00", percent: 60 },
    { label: "16:00", percent: 80 },
    { label: "20:00", percent: 100 }
  ];
}
function dn() {
  return Array.from({ length: 24 }, (t, e) => ({
    id: `empty-density-${e}`,
    label: `${e}:00`,
    value: "אין פעילות",
    intensity: 0,
    active: !1
  }));
}
function hn(t) {
  return t <= 0.5 ? "start" : t >= 99.5 ? "end" : "middle";
}
const F = 60 * 60 * 1e3, pn = [1, 2, 3, 4, 6, 8, 12, 24], un = [6, 12, 24, 48, 72, 96, 168];
function _n(t, e = {}) {
  const a = $n(e.maxMajorTicks ?? 8, 2, 10), i = gn(t, a), r = [...xn(t, i.stepMs, i.ticks), ...i.ticks].sort(
    (l, d) => l.percent - d.percent || Number(d.major) - Number(l.major)
  ), s = e.now ?? /* @__PURE__ */ new Date(), c = s.getTime(), o = c >= t.start.getTime() && c <= t.end.getTime() ? I(s, t) : void 0;
  return { ticks: r, nowPercent: o };
}
function gn(t, e) {
  const i = Math.max(1, t.end.getTime() - t.start.getTime()) / F, n = mn(i, e), r = [
    t.start,
    ...Gt(t, n),
    t.end
  ];
  return { ticks: yn(
    r,
    t,
    e,
    wn(i)
  ), stepMs: n };
}
function mn(t, e) {
  const a = t <= 30 ? pn : t <= 96 ? un : [24, 48, 72, 96, 168, 336], i = Math.max(0, e - 2);
  for (const n of a)
    if (Math.ceil(t / n) - 1 <= i) return n * F;
  return (a[a.length - 1] ?? 24) * F;
}
function Gt(t, e) {
  const a = t.start.getTime(), i = t.end.getTime(), n = [];
  for (let r = bn(t.start, e); r.getTime() < i; r = vn(r, e))
    r.getTime() > a && n.push(new Date(r));
  return n;
}
function bn(t, e) {
  const a = e / F;
  if (!Number.isInteger(a) || a < 1)
    return new Date(Math.ceil(t.getTime() / e) * e);
  if (a >= 24 && a % 24 === 0) {
    const r = a / 24, s = new Date(t);
    for (s.setHours(0, 0, 0, 0), s.getTime() <= t.getTime() && s.setDate(s.getDate() + 1); fn(s) % r !== 0; )
      s.setDate(s.getDate() + 1);
    return s;
  }
  const i = new Date(t);
  i.setMinutes(0, 0, 0), i.getTime() <= t.getTime() && i.setHours(i.getHours() + 1);
  const n = i.getHours() % a;
  return n !== 0 && i.setHours(i.getHours() + a - n), i.setMinutes(0, 0, 0), i;
}
function vn(t, e) {
  const a = e / F, i = new Date(t);
  return Number.isInteger(a) && a >= 24 && a % 24 === 0 ? (i.setDate(i.getDate() + a / 24), i) : (i.setHours(i.getHours() + a), i);
}
function fn(t) {
  return Math.floor(
    Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()) / (24 * F)
  );
}
function yn(t, e, a, i) {
  const n = kn(t).sort(
    (c, o) => c.getTime() - o.getTime()
  ), r = Math.max(7, Math.min(14, 72 / a)), s = [];
  for (const c of n) {
    const o = I(c, e), l = {
      time: c,
      label: i(c),
      percent: o,
      major: !0
    }, d = c.getTime() === e.start.getTime(), p = c.getTime() === e.end.getTime();
    if (d) {
      s.push(l);
      continue;
    }
    if (p) {
      for (; s.length > 1 && o - s[s.length - 1].percent < r; )
        s.pop();
      s.push(l);
      continue;
    }
    const u = s[s.length - 1];
    (!u || o - u.percent >= r) && s.push(l);
  }
  for (; s.length > a && s.length > 2; )
    s.splice(Math.floor(s.length / 2), 1);
  return s;
}
function xn(t, e, a) {
  const i = e / 2;
  if (i < F || a.length < 2) return [];
  const n = new Set(
    a.map((r) => Math.round(r.time.getTime() / 1e3))
  );
  return Gt(t, i).filter((r) => !n.has(Math.round(r.getTime() / 1e3))).map((r) => ({
    time: r,
    label: "",
    percent: I(r, t),
    major: !1
  }));
}
function wn(t) {
  return t <= 48 ? v : (e) => new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit"
  }).format(e);
}
function kn(t) {
  const e = /* @__PURE__ */ new Set(), a = [];
  for (const i of t) {
    const n = i.getTime();
    e.has(n) || (e.add(n), a.push(i));
  }
  return a;
}
function $n(t, e, a) {
  return Number.isFinite(t) ? Math.min(a, Math.max(e, Math.floor(t))) : e;
}
function zn(t) {
  return Dt(
    xe(t.model, t.config, t),
    Mn(t)
  );
}
function xe(t, e, a = {}) {
  const i = An(t.range, e), n = t.groups.map((s) => Sn(s, t, e, a)).filter((s) => !!s), r = Cn(t);
  return {
    hero: {
      ...S.hero,
      subtitle: `Home Assistant · ${lt(t.range)} · ${t.totalInventoryItemCount} רכיבים`
    },
    toolbar: S.toolbar,
    summary: r,
    rangeLabel: lt(t.range),
    axisLabels: i.labels,
    nowPercent: i.nowPercent,
    density: Rn(t.densityBuckets),
    groups: n,
    insights: En(t)
  };
}
function An(t, e = { type: "custom:activity-history-card" }, a = /* @__PURE__ */ new Date()) {
  const i = _n(t, {
    maxMajorTicks: Fn(e),
    now: a
  });
  return {
    labels: i.ticks.map((n) => ({
      label: n.major ? we(n.time, t, a) : "",
      percent: n.percent,
      major: n.major
    })),
    nowPercent: i.nowPercent ?? null
  };
}
function Mn(t) {
  return {
    config: t.config,
    onSegmentClick: t.onSegmentClick,
    onInventoryToggle: t.onInventoryToggle,
    onInventoryClose: t.onInventoryClose,
    onInventoryItemClick: t.onInventoryItemClick,
    openInventoryGroupId: t.openInventoryGroupId
  };
}
function Cn(t) {
  const e = Pn(t.groups), a = e ? [
    qt(e.segment.category),
    e.row.area,
    v(e.segment.end)
  ].filter(Boolean).join(" · ") : "לא נמצאו אירועים";
  return [
    {
      id: "active-now",
      label: "פעילים עכשיו",
      value: String(t.activeNowCount),
      caption: "רכיבים במצב פעיל",
      icon: "mdi:circle-medium",
      tone: t.activeNowCount ? "on" : "idle"
    },
    {
      id: "active-components",
      label: "רכיבים שפעלו",
      value: String(t.visibleRowsCount),
      caption: `מתוך ${t.totalInventoryItemCount || t.totalRowsBeforeCuration} רכיבים שנבחרו`,
      icon: "mdi:toggle-switch-outline",
      tone: "cooling"
    },
    {
      id: "events",
      label: "אירועים",
      value: String(t.visibleEventCount),
      caption: "שינויי מצב פעילים",
      icon: "mdi:timeline-clock-outline",
      tone: "playing"
    },
    {
      id: "component-hours",
      label: "סה״כ שעות־רכיב",
      value: y(t.totalVisibleActiveMs),
      caption: "סכום פעילות על פני כל הרכיבים",
      icon: "mdi:clock-outline",
      tone: "heating"
    },
    {
      id: "last-event",
      label: "אירוע אחרון",
      value: e?.row.name ?? "אין",
      caption: a,
      icon: "mdi:music-note-eighth",
      tone: e ? Re(e.segment.category) : "idle"
    }
  ];
}
function Rn(t) {
  return t.length ? t.map((e, a) => ({
    id: `density-${a}`,
    label: v(e.start),
    value: `${y(e.totalActiveMs)} · ${e.activeEntityCount} רכיבים`,
    intensity: e.intensity,
    active: e.totalActiveMs > 0
  })) : Array.from({ length: 24 }, (e, a) => ({
    id: `density-${a}`,
    label: `${a}:00`,
    value: "אין פעילות",
    intensity: 0,
    active: !1
  }));
}
function Sn(t, e, a, i) {
  const n = a.show_area_inventory !== !1 && a.area_inventory_mode !== "off", r = t.activityRows.length > 0, s = n && t.inventoryItems.length > 0;
  if (!r && !s) return;
  const c = a.area_inventory_mode === "expanded" || e.singleAreaFocused || i.showAllInventory === !0, o = i.collapsedInventoryGroups?.has(t.id) === !0 ? !1 : c || i.expandedInventoryGroups?.has(t.id) === !0, l = s ? t.inventoryItems.map(In) : [], d = Dn(a), p = o ? l.length : Math.min(4, d, l.length), u = Math.max(
    0,
    t.inventoryItemCount - p
  );
  return {
    id: t.id,
    title: t.title,
    icon: t.icon ?? "mdi:home-outline",
    meta: `${t.inventoryItemCount} רכיבים · ${y(t.totalActiveMs)}`,
    activityLabel: r ? `${t.visibleActivityRowCount} פעילים · ${t.eventCount} אירועים` : "אין פעילות בטווח",
    inventoryLabel: "כל האביזרים",
    aggregateSegments: t.aggregateSegments.map(Ut),
    rows: t.activityRows.map(Tn),
    inventoryItems: l,
    inventoryTotal: t.inventoryItemCount,
    hiddenInventoryCount: u,
    expandedInventory: o
  };
}
function Tn(t) {
  const e = Hn(t), a = e ? Re(e.category) : t.activeNow ? "on" : "idle";
  return {
    id: t.entityId,
    entityId: t.entityId,
    label: t.name,
    secondary: t.secondary,
    state: e ? qt(e.category) : t.activeNow ? "פעיל" : "לא פעיל",
    stateTone: a,
    icon: t.icon ?? Kt(t.domain),
    totalLabel: y(t.totalActiveMs),
    eventLabel: `${t.eventCount} אירועים`,
    segments: t.segments.map(Ut)
  };
}
function Ut(t) {
  return {
    leftPct: t.leftPct,
    widthPct: t.widthPct,
    tone: Vt(t.category),
    label: t.label,
    minVisible: t.minVisible,
    sourceIndex: t.sourceIndex
  };
}
function In(t) {
  return {
    id: t.entityId,
    entityId: t.entityId,
    label: t.name,
    secondary: ct(t.domain),
    state: t.currentStateLabel ?? ct(t.domain),
    stateTone: Ln(t),
    icon: t.icon ?? Kt(t.domain),
    activeNow: t.activeNow,
    hadActivity: t.hadActivityInRange
  };
}
function En(t) {
  const e = t.insights.mostActiveEntity, a = t.insights.mostActiveArea;
  return [
    {
      id: "most-active-entity",
      title: "הרכיב הפעיל ביותר",
      value: e?.name ?? "אין נתונים",
      caption: e ? `${e.secondary ?? "רכיב"} · ${y(e.totalActiveMs)} · ${e.eventCount} אירועים` : "לא נמצאה פעילות בטווח הנוכחי",
      icon: "mdi:star-four-points"
    },
    {
      id: "most-active-area",
      title: "האזור הפעיל ביותר",
      value: a?.title ?? "אין נתונים",
      caption: a ? `${a.rowCount} רכיבים · ${y(a.totalActiveMs)} · ${a.eventCount} אירועים` : "לא נמצאו אזורים פעילים",
      icon: "mdi:home-lightning-bolt-outline"
    },
    {
      id: "peak-hours",
      title: "שעות שיא",
      value: t.insights.peakBucketLabel ?? "אין נתונים",
      caption: "לפי משך פעילות",
      icon: "mdi:chart-bar"
    },
    {
      id: "short-pattern",
      title: "דפוס שימוש קצר",
      value: t.insights.shortUsePattern ?? "אין נתונים",
      caption: t.insights.inventoryPattern ?? "לפי התצוגה הנוכחית",
      icon: "mdi:lightning-bolt-outline"
    }
  ];
}
function Pn(t) {
  return t.flatMap(
    (e) => e.activityRows.flatMap(
      (a) => a.segments.map((i) => ({ row: a, segment: i }))
    )
  ).sort((e, a) => a.segment.end.getTime() - e.segment.end.getTime())[0];
}
function Hn(t) {
  return [...t.segments].sort((e, a) => a.end.getTime() - e.end.getTime())[0];
}
function Vt(t) {
  return t === "cooling" ? "cooling" : t === "heating" ? "heating" : t === "playing" ? "playing" : t === "fan" || t === "drying" ? "fan" : t === "opening" || t === "closing" ? "open" : "on";
}
function Re(t) {
  return t === "off" || t === "idle" ? "idle" : t === "unknown" || t === "unavailable" ? "unavailable" : Vt(t);
}
function Ln(t) {
  return t.stateTone === "unavailable" ? "unavailable" : t.currentCategory ? Re(t.currentCategory) : t.activeNow ? "on" : (t.hadActivityInRange, "idle");
}
function qt(t) {
  return A[t] ?? t;
}
function ct(t) {
  return R[t] ?? t;
}
function Dn(t) {
  const e = t.area_inventory_max_items;
  return typeof e == "number" && Number.isFinite(e) ? Math.max(1, Math.floor(e)) : b.area_inventory_max_items;
}
function Kt(t) {
  return t === "light" ? "mdi:lightbulb-outline" : t === "climate" ? "mdi:thermostat" : t === "media_player" ? "mdi:music" : t === "cover" ? "mdi:window-shutter" : t === "fan" ? "mdi:fan" : "mdi:toggle-switch-outline";
}
function lt(t) {
  const e = /* @__PURE__ */ new Date(), a = Math.max(
    1,
    Math.round((t.end.getTime() - t.start.getTime()) / 36e5)
  );
  return `${we(t.start, t, e)} - ${we(t.end, t, e)} · ${Nn(a)}`;
}
function Nn(t) {
  return t >= 24 ? `${Math.round(t / 24)} ימים` : `${t} שעות`;
}
function Fn(t) {
  return t.desktop_density === "compact" || t.desktop_density === "ultra_compact" || t.timeline_axis_density === "compact" ? 6 : (t.timeline_axis_density === "comfortable", 8);
}
function we(t, e, a) {
  return me(t, e.end) && Bn(e, a) ? "עכשיו" : Math.max(
    1,
    (e.end.getTime() - e.start.getTime()) / 36e5
  ) > 48 ? new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit"
  }).format(t) : On(e.start, e.end) && (me(t, e.start) || me(t, e.end)) ? new Intl.DateTimeFormat("he-IL", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(t) : v(t);
}
function Bn(t, e) {
  return Math.abs(e.getTime() - t.end.getTime()) <= 5 * 60 * 1e3;
}
function On(t, e) {
  return t.getHours() === e.getHours() && t.getMinutes() === e.getMinutes();
}
function me(t, e) {
  return Math.abs(t.getTime() - e.getTime()) < 6e4;
}
const Wt = {
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
}, jn = [
  [/סלון|living/i, "mdi:sofa"],
  [/מטבח|kitchen/i, "mdi:countertop"],
  [/שינה|הורים|bed/i, "mdi:bed"],
  [/ילד|ילדים|kids|child/i, "mdi:bunk-bed"],
  [/מרפסת|גינה|garden|balcony/i, "mdi:flower"],
  [/כניסה|entry|door/i, "mdi:door"]
];
function Gn(t) {
  if (t.icon?.startsWith("mdi:") || t.icon && !t.icon.includes(":")) return t.icon;
  const e = t.domain || q(t.entity_id);
  return Wt[e] ?? "mdi:circle-medium";
}
function Un(t) {
  if (t.icon?.startsWith("mdi:") || t.icon && !t.icon.includes(":")) return t.icon;
  const e = Wt[t.id];
  return e || (jn.find(([i]) => i.test(t.title))?.[1] ?? "mdi:home-outline");
}
function Yt(t, e) {
  return t.startsWith("mdi:") ? h`<ha-icon class=${e} icon=${t}></ha-icon>` : h`<span class=${e} aria-hidden="true">${t}</span>`;
}
function Xt(t, e = "ahc-entity-icon") {
  return Yt(Gn(t), e);
}
function Jt(t, e = "ahc-group-icon") {
  return Yt(Un(t), e);
}
function Vn(t) {
  const e = qn(
    t.groups,
    t.range,
    t.config
  ), a = Zn(t.range), i = G(t.curation), n = Qn(t.range);
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

      ${t.config.show_activity_density === !1 ? null : Yn(e.density)}

      <div class="ahc-activity__axis" dir="ltr" aria-hidden="true">
        ${a.map(
    (r) => h`<span class="ahc-activity__tick" style="left:${r.percent}%"
              >${r.label}</span
            >`
  )}
      </div>

      <div class="ahc-activity__groups">
        ${e.groups.map(
    (r) => Kn(r, t.range, t)
  )}
      </div>

      ${e.hiddenRowCount ? h`<p class="ahc-activity__more">
            + ${e.hiddenRowCount} רכיבים נוספים הוסתרו. אפשר ללחוץ “הצג
            הכל” למצב legacy/debug.
          </p>` : null}
    </section>
  ` : Xn();
}
function qn(t, e, a) {
  const i = t.map((c) => {
    const o = c.rows.filter(Jn), l = o.reduce(
      (d, p) => d + p.totalActiveMs,
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
  ), n = Ce(
    i,
    a.max_visible_rows ?? a.max_total_rows
  ), r = n.groups.filter((c) => c.rows.length > 0), s = r.flatMap((c) => c.rows);
  return {
    groups: r,
    density: vt(s, e, a),
    totalRowCount: n.totalRowCount,
    visibleRowCount: s.length,
    hiddenRowCount: Math.max(0, n.totalRowCount - s.length)
  };
}
function Kn(t, e, a) {
  return h`
    <article class="ahc-activity-group" aria-label=${t.title}>
      <header class="ahc-activity-group__header">
        <span class="ahc-activity-group__title">
          ${Jt(t)}<strong>${t.title}</strong>
        </span>
        <span class="ahc-activity-group__meta">
          ${t.rows.length} רכיבים · ${y(t.totalActiveMs)}
        </span>
      </header>
      <div class="ahc-activity-group__rows">
        ${t.rows.map((i) => Wn(i, e, a))}
      </div>
    </article>
  `;
}
function Wn(t, e, a) {
  return h`
    <div class="ahc-activity-row">
      <div class="ahc-activity-row__label" dir="rtl">
        ${Xt(t.entity)}
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
    const r = Ct(i, e);
    if (r.widthPct <= 0) return null;
    const s = `${t.entity.name}, ${A[i.category]}, ${v(i.start)} עד ${v(i.end)}, ${y(
      i.durationMs
    )}`;
    return h`
            <button
              class="ahc-activity-segment"
              type="button"
              data-category=${i.category}
              data-min-visible=${r.minVisible ? "true" : "false"}
              style=${`left:${r.leftPct}%;width:max(var(--ahc-activity-segment-min-width), ${r.widthPct}%);`}
              aria-label=${s}
              @click=${(c) => a.onSegmentClick?.(c, t.entity.entity_id, n)}
            >
              <span>${A[i.category]}</span>
            </button>
          `;
  })}
      </div>
    </div>
  `;
}
function Yn(t) {
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
function Xn() {
  return h`
    <section class="ahc-activity ahc-activity-empty">
      <h3>לא נמצאה פעילות משמעותית בטווח הזה</h3>
      <p>נסה להגדיל את טווח הזמן, להציג את כל הרכיבים, או לפתוח סינון מתקדם.</p>
    </section>
  `;
}
function Jn(t) {
  return t.segments.some((e) => e.active);
}
function Zn(t) {
  const e = Math.max(
    1,
    (t.end.getTime() - t.start.getTime()) / 36e5
  ), a = e <= 24 ? 3 : e <= 72 ? 6 : 24, i = [], n = new Date(t.start);
  for (n.setMinutes(0, 0, 0); n < t.end; )
    n >= t.start && i.push({
      label: v(n),
      percent: I(n, t)
    }), n.setHours(n.getHours() + a);
  return i.push({ label: v(t.end), percent: 100 }), i;
}
function Qn(t) {
  const e = Math.round(
    (t.end.getTime() - t.start.getTime()) / 36e5
  );
  return e >= 24 * 7 ? "7 ימים" : e >= 24 ? `${Math.round(e / 24)} ימים` : `${e} שעות`;
}
function er(t) {
  const e = Ce(
    t.groups,
    t.config.max_visible_rows
  ), a = nr(t.range), i = G(t.curation), n = /* @__PURE__ */ new Date(), r = I(n, t.range), s = t.config.show_inactive_baselines === !0, c = t.config.show_now_line !== !1 && n.getTime() >= t.range.start.getTime() && n.getTime() <= t.range.end.getTime() + 9e4;
  return h`
    <section
      class=${`ahc-timeline-card ahc-timeline-card--${e.density}${s ? " ahc-timeline-card--baselines" : ""}`}
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
    const l = tr(
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
                      >${Jt(o)}<span
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
                            ${s ? h`<line
                                  class="ahc-row__svg-track"
                                  x1="1"
                                  x2="99"
                                  y1="16"
                                  y2="16"
                                ></line>` : null}
                            ${d.segments.map((p, u) => {
        const g = I(
          p.start,
          t.range
        ), f = I(
          p.end,
          t.range
        ), w = Math.max(0.65, f - g);
        if (!ar(
          p,
          t.config
        ))
          return null;
        const x = `${d.entity.name}, ${A[p.category]}, ${v(p.start)} עד ${v(p.end)}, ${y(p.durationMs)}`;
        return h`
                                <rect
                                  class=${p.active ? "ahc-segment-svg" : "ahc-segment-svg ahc-segment-svg--inactive"}
                                  data-category=${p.category}
                                  data-active=${p.active ? "true" : "false"}
                                  x=${g}
                                  y=${p.active ? "12" : "15"}
                                  width=${w}
                                  height=${p.active ? "8" : "2"}
                                  rx=${p.active ? "4" : "1"}
                                  tabindex="0"
                                  role="button"
                                  aria-label=${x}
                                  @click=${(m) => t.onSegmentClick?.(
          m,
          d.entity.entity_id,
          u
        )}
                                  @keydown=${(m) => {
          (m.key === "Enter" || m.key === " ") && (m.preventDefault(), t.onSegmentClick?.(
            m,
            d.entity.entity_id,
            u
          ));
        }}
                                >
                                  <title>${x}</title>
                                </rect>
                              `;
      })}
                          </svg>
                        </div>
                        <div class="ahc-row__label" dir="rtl">
                          ${Xt(d.entity)}
                          <span
                            class="ahc-row__name"
                            title=${t.config.debug ? d.entity.entity_id : d.entity.name}
                            >${d.entity.name}</span
                          >
                          ${d.currentCategory ? h`<span
                                class="ahc-row__state-chip"
                                data-state=${d.currentCategory}
                                >${A[d.currentCategory]}</span
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
          ${c ? h`<div class="ahc-now-line" style="left:${r}%">
                <span class="ahc-now-line__label">עכשיו</span>
              </div>` : null}
        </div>
      </div>
      ${t.config.show_legend === !1 ? null : ir()}
    </section>
  `;
}
function tr(t, e) {
  const a = new Set(e.default_collapsed_groups ?? []);
  return a.has(t.id) || a.has(t.title) ? !0 : !!(e.collapse_groups && t.totalActiveMs <= 0);
}
function ar(t, e) {
  return t.active || e.show_inactive_baselines === !0;
}
function ir() {
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
          >${A[e]}</span
        >`
  )}
  </div>`;
}
function nr(t) {
  const e = Math.max(
    1,
    (t.end.getTime() - t.start.getTime()) / 36e5
  ), a = e <= 24 ? 3 : e <= 72 ? 6 : 24, i = [], n = new Date(t.start);
  for (n.setMinutes(0, 0, 0); n < t.end; )
    n >= t.start && i.push({
      label: v(n),
      percent: I(n, t)
    }), n.setHours(n.getHours() + a);
  return i.push({ label: v(t.end), percent: 100 }), i;
}
const rr = pt`
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
    --ahc-bg: #0b1020;
    --ahc-surface: #11182b;
    --ahc-surface-2: #17223a;
    --ahc-blue: #6fb6ff;
    --ahc-green: #b5eea2;
    --ahc-purple: #b8a2ff;
    --ahc-yellow: #f5d84f;
    --ahc-orange: #ffa45c;
    --ahc-teal: #7dd3fc;
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
    --ahc-dashboard-label-width: 250px;
    --ahc-dashboard-segment-height: 11px;
    --ahc-dashboard-aggregate-height: 13px;
    --ahc-dashboard-segment-min-width: 6px;
    --ahc-dashboard-group-header-height: 42px;
    --ahc-dashboard-group-gap: 10px;
    --ahc-axis-label-color: rgba(235, 242, 255, 0.92);
    --ahc-axis-grid-color: rgba(148, 163, 184, 0.22);
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

  /* Mockup 05 visual shell */
  .ahc--mockup05-shell {
    --ahc-bg: #0b1020;
    --ahc-surface: rgba(17, 24, 43, 0.96);
    --ahc-surface-2: rgba(23, 34, 58, 0.92);
    --ahc-border: rgba(125, 211, 252, 0.16);
    --ahc-text: #eff6ff;
    --ahc-muted: rgba(226, 232, 240, 0.72);
    --ahc-blue: #6fb6ff;
    --ahc-green: #b5eea2;
    --ahc-purple: #b8a2ff;
    --ahc-yellow: #f5d84f;
    --ahc-orange: #ffa45c;
    --ahc-teal: #7dd3fc;
    --ahc-insights-width: 340px;
    --ahc-dashboard-label-width: 250px;
    --ahc-dashboard-row-height: 34px;
    --ahc-dashboard-segment-height: 11px;
    --ahc-dashboard-aggregate-height: 13px;
    --ahc-dashboard-segment-min-width: 6px;
    gap: 12px;
    padding: 14px;
    border-radius: 22px;
    background:
      linear-gradient(120deg, rgba(40, 31, 76, 0.78), transparent 26%),
      linear-gradient(110deg, rgba(37, 99, 235, 0.2), transparent 54%),
      var(--ahc-bg);
  }

  .ahc--mockup05-shell.ahc--panel,
  .ahc--mockup05-shell.ahc--fullscreen {
    grid-template-rows: minmax(0, 88px) minmax(0, 56px) minmax(0, 86px) minmax(
        0,
        1fr
      );
    block-size: min(100svh, 980px);
  }

  .ahc--mockup05-shell .ahc__hero,
  .ahc__hero {
    min-block-size: 72px;
    max-block-size: 88px;
  }

  .ahc--mockup05-shell .ahc__hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding-block: 10px;
    padding-inline: 16px;
    border: 1px solid rgba(125, 211, 252, 0.12);
    border-radius: 16px;
    background:
      linear-gradient(90deg, rgba(39, 54, 86, 0.9), rgba(17, 24, 43, 0.9)),
      rgba(15, 23, 42, 0.84);
    overflow: hidden;
  }

  .ahc__hero.ahc__topbar {
    align-items: center;
    padding-block: 10px;
    padding-inline: 14px;
  }

  .ahc__hero-main {
    min-inline-size: 0;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .ahc__hero .ahc__title-block {
    justify-items: start;
  }

  .ahc__hero-icon {
    flex: 0 0 46px;
    inline-size: 46px;
    block-size: 46px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(125, 211, 252, 0.22);
    border-radius: 13px;
    color: var(--ahc-blue);
    background: rgba(96, 165, 250, 0.14);
  }

  .ahc__hero-title {
    margin: 0;
    color: var(--ahc-text);
    font-size: clamp(1.1rem, 1.25vw, 1.45rem);
    font-weight: 900;
    line-height: 1.1;
  }

  .ahc__hero-subtitle {
    margin: 6px 0 0;
    color: var(--ahc-muted);
    font-size: 0.78rem;
    font-weight: 700;
  }

  .ahc__hero-actions {
    justify-content: flex-start;
    min-inline-size: 0;
  }

  .ahc__hero-actions .ahc__button {
    min-block-size: 38px;
    padding-inline: 12px;
  }

  .ahc__button--icon {
    inline-size: 42px;
    padding-inline: 0;
  }

  .ahc__status-pill {
    min-block-size: 34px;
    display: inline-flex;
    align-items: center;
    padding-inline: 10px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 999px;
    color: var(--ahc-muted);
    background: rgba(15, 23, 42, 0.52);
    font-size: 0.72rem;
    font-weight: 850;
    white-space: nowrap;
  }

  .ahc--mockup05-shell .ahc__toolbar,
  .ahc__toolbar.ahc__filters {
    display: flex;
    align-items: center;
    gap: 10px;
    max-block-size: 56px;
    min-block-size: 56px;
    padding: 8px 10px;
  }

  .ahc--mockup05-shell .ahc__toolbar {
    border: 1px solid rgba(125, 211, 252, 0.1);
    border-radius: 14px;
    background: rgba(17, 24, 43, 0.76);
    overflow: hidden;
  }

  .ahc__toolbar-group {
    min-inline-size: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 0 0 auto;
  }

  .ahc__toolbar-label {
    color: var(--ahc-muted);
    font-size: 0.72rem;
    font-weight: 850;
    white-space: nowrap;
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

  .ahc__search {
    min-inline-size: min(320px, 30vw);
  }

  .ahc__toolbar .ahc-curation-note {
    max-inline-size: min(320px, 24vw);
  }

  .ahc__toolbar .ahc__chip,
  .ahc__toolbar .ahc__button,
  .ahc__toolbar .ahc__segmented-button {
    min-block-size: 40px;
  }

  .ahc__filter-chip {
    min-block-size: 40px;
    padding-inline: 14px;
    border: 1px solid rgba(148, 163, 184, 0.14);
    border-radius: 10px;
    color: rgba(226, 232, 240, 0.86);
    background: rgba(15, 23, 42, 0.68);
    font-weight: 850;
    white-space: nowrap;
  }

  .ahc__filter-chip--active,
  .ahc__filter-chip[aria-pressed="true"] {
    border-color: rgba(111, 182, 255, 0.5);
    color: #eff6ff;
    background: linear-gradient(
      180deg,
      rgba(96, 165, 250, 0.38),
      rgba(37, 99, 235, 0.2)
    );
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }

  .ahc--mockup05-shell .ahc__summary-strip,
  .ahc__summary-strip {
    min-block-size: 82px;
    max-block-size: 86px;
  }

  .ahc--mockup05-shell .ahc__summary-strip {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
    gap: 10px;
    overflow: hidden;
  }

  .ahc__summary-strip .ahc__metric,
  .ahc__summary-card {
    min-block-size: 82px;
    padding-block: 10px;
    padding-inline: 14px;
  }

  .ahc__summary-card {
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 14px;
    background:
      linear-gradient(180deg, rgba(19, 29, 50, 0.92), rgba(10, 16, 32, 0.94)),
      rgba(15, 23, 42, 0.74);
  }

  .ahc__summary-card-icon {
    color: var(--ahc-blue);
  }

  .ahc__summary-card[data-tone="on"] .ahc__summary-card-icon {
    color: var(--ahc-green);
  }

  .ahc__summary-card[data-tone="heating"] .ahc__summary-card-icon {
    color: var(--ahc-orange);
  }

  .ahc__summary-card[data-tone="playing"] .ahc__summary-card-icon {
    color: var(--ahc-purple);
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

  .ahc--mockup05-shell .ahc__body {
    grid-template-columns: minmax(0, 1fr) var(--ahc-insights-width, 340px);
    gap: 16px;
    min-block-size: 0;
    overflow: hidden;
  }

  .ahc--mockup05-shell .ahc__body--no-insights {
    grid-template-columns: minmax(0, 1fr);
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
    position: relative;
    inline-size: 100%;
    min-inline-size: 0;
    block-size: var(
      --ahc-dashboard-height,
      var(--ahc-timeline-height, calc(100svh - 310px))
    );
    min-block-size: min(540px, calc(100svh - 260px));
    max-block-size: none;
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    gap: 12px;
    padding: 14px;
    border: 1px solid rgba(125, 211, 252, 0.16);
    border-radius: 18px;
    background:
      linear-gradient(180deg, rgba(20, 31, 54, 0.94), rgba(8, 13, 29, 0.96)),
      rgba(15, 23, 42, 0.88);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.045),
      0 18px 46px rgba(2, 6, 23, 0.22);
    overflow: hidden;
  }

  .ahc--mockup05-shell .ahc-dashboard {
    block-size: var(
      --ahc-dashboard-height,
      var(--ahc-timeline-height, calc(100svh - 310px))
    );
    min-block-size: min(540px, calc(100svh - 260px));
    padding: 12px;
    border-radius: 16px;
  }

  .ahc-dashboard__header {
    min-block-size: 48px;
    padding-block: 0;
    padding-inline: 4px;
    border-block-end: 1px solid rgba(148, 163, 184, 0.11);
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
    grid-template-rows: 1fr;
    gap: 4px;
    block-size: 46px;
    min-block-size: 46px;
    padding-block: 7px;
    padding-inline: 14px calc(var(--ahc-dashboard-label-width) + 14px);
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 14px;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.7), rgba(2, 6, 23, 0.42)),
      rgba(15, 23, 42, 0.34);
    overflow: hidden;
  }

  .ahc-dashboard__density-bars {
    position: relative;
    z-index: 2;
    direction: ltr;
    display: grid;
    grid-template-columns: repeat(var(--bucket-count, 24), minmax(5px, 1fr));
    align-items: end;
    gap: 3px;
    min-block-size: 0;
  }

  .ahc-dashboard-density-bucket {
    position: relative;
    display: block;
    block-size: 32px;
    min-inline-size: 0;
    border-radius: 5px;
    background: rgba(148, 163, 184, 0.055);
    overflow: hidden;
  }

  .ahc-dashboard-density-fill {
    position: absolute;
    inset-inline: 0;
    inset-block-end: 0;
    inline-size: 100%;
    block-size: 4px;
    max-block-size: 28px;
    border-radius: 6px 6px 2px 2px;
    background: linear-gradient(180deg, #93c5fd 0%, #38bdf8 48%, #22c55e 100%);
    opacity: 0.18;
  }

  .ahc-dashboard-density-bucket[data-active="true"]
    .ahc-dashboard-density-fill {
    block-size: max(5px, calc(var(--intensity, 0) * 28px));
    opacity: max(0.44, calc(var(--intensity, 0) * 0.98));
    box-shadow: 0 0 14px rgba(56, 189, 248, 0.18);
  }

  .ahc-dashboard__density-labels {
    position: relative;
    direction: ltr;
    color: var(--ahc-axis-label-color);
    font-size: 0.68rem;
    font-weight: 700;
    line-height: 1;
  }

  .ahc-dashboard__density-labels span {
    position: absolute;
    inset-block-start: 0;
    transform: translateX(-50%);
    min-inline-size: 40px;
    text-align: center;
    white-space: nowrap;
  }

  .ahc-dashboard__density-labels span[data-edge="start"],
  .ahc-dashboard__axis-label[data-edge="start"] {
    transform: none;
    text-align: start;
  }

  .ahc-dashboard__density-labels span[data-edge="end"],
  .ahc-dashboard__axis-label[data-edge="end"] {
    transform: translateX(-100%);
    text-align: end;
  }

  .ahc-timegrid {
    direction: ltr;
    position: relative;
    inline-size: 100%;
    min-inline-size: 0;
    block-size: 100%;
    min-block-size: 30px;
    overflow: hidden;
  }

  .ahc-timegrid--density {
    block-size: 32px;
    min-block-size: 32px;
  }

  .ahc-timegrid--aggregate {
    block-size: 100%;
  }

  .ahc-timegrid--row {
    block-size: var(--ahc-dashboard-row-height);
  }

  .ahc-timegrid--row::before,
  .ahc-timegrid--aggregate::before {
    content: "";
    position: absolute;
    inset-inline: 0;
    inset-block-start: 50%;
    transform: translateY(-50%);
    block-size: 1px;
    border-radius: 999px;
    background: rgba(148, 163, 184, 0.035);
  }

  .ahc-timegrid__grid,
  .ahc-timegrid__segments {
    position: absolute;
    inset: 0;
  }

  .ahc-timegrid__grid {
    z-index: 0;
    pointer-events: none;
  }

  .ahc-timegrid__segments {
    z-index: 2;
    pointer-events: auto;
  }

  .ahc-timegrid__line {
    position: absolute;
    inset-block: 0;
    inline-size: 1px;
    transform: translateX(-0.5px);
    pointer-events: none;
  }

  .ahc-timegrid__line--major {
    background: var(--ahc-axis-grid-color);
  }

  .ahc-timegrid__line--minor {
    background: rgba(148, 163, 184, 0.055);
  }

  .ahc-timegrid__now {
    position: absolute;
    inset-block: 0;
    z-index: 3;
    inline-size: 2px;
    transform: translateX(-1px);
    border-radius: 999px;
    background: rgba(125, 211, 252, 0.9);
    box-shadow: 0 0 12px rgba(125, 211, 252, 0.3);
    pointer-events: none;
  }

  .ahc-timegrid__now--label {
    inset-block: 0;
    block-size: auto;
  }

  .ahc-timegrid__now-label {
    position: absolute;
    inset-block-start: 5px;
    transform: translateX(-50%);
    padding-block: 2px;
    padding-inline: 6px;
    border-radius: 999px;
    background: rgba(37, 99, 235, 0.72);
    color: #eff6ff;
    font-size: 0.66rem;
    font-weight: 850;
    line-height: 1;
    white-space: nowrap;
  }

  .ahc-dashboard__timeline {
    min-inline-size: 0;
    min-block-size: 0;
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 0;
    overflow: hidden;
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 16px;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.74), rgba(2, 6, 23, 0.38)),
      rgba(15, 23, 42, 0.28);
  }

  .ahc-dashboard__axis {
    position: relative;
    direction: ltr;
    margin-inline-start: 0;
    margin-inline-end: calc(var(--ahc-dashboard-label-width) + 12px);
    block-size: 34px;
    min-block-size: 34px;
    border-block-end: 1px solid rgba(148, 163, 184, 0.12);
    background: rgba(15, 23, 42, 0.34);
    overflow: hidden;
  }

  .ahc-dashboard__axis .ahc-timegrid__grid {
    inset-block: auto 0;
    block-size: 100%;
  }

  .ahc-dashboard__axis-labels {
    position: absolute;
    inset: 0;
    z-index: 2;
  }

  .ahc-dashboard__tick,
  .ahc-dashboard__axis-label {
    position: absolute;
    inset-block-start: 10px;
    transform: translateX(-50%);
    min-inline-size: 48px;
    color: var(--ahc-axis-label-color);
    font-size: 0.75rem;
    font-weight: 800;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    text-shadow: 0 1px 6px rgba(2, 6, 23, 0.55);
  }

  .ahc-dashboard__tick::after {
    display: none;
  }

  .ahc-dashboard__scroll {
    min-inline-size: 0;
    min-block-size: 0;
    overflow: auto;
    padding-block: 10px 12px;
    padding-inline: 6px;
    overscroll-behavior: contain;
    scrollbar-color: rgba(56, 189, 248, 0.48) rgba(15, 23, 42, 0.24);
  }

  .ahc-dashboard__groups {
    display: contents;
  }

  .ahc-dashboard-group,
  .ahc-area-card {
    display: grid;
    gap: 8px;
    padding: 10px 12px 12px;
    border: 1px solid rgba(148, 163, 184, 0.1);
    border-radius: 16px;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.64), rgba(2, 6, 23, 0.3)),
      rgba(15, 23, 42, 0.28);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
    overflow: hidden;
  }

  .ahc-area-card[data-has-activity="false"] {
    gap: 6px;
    padding-block: 8px;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.48), rgba(2, 6, 23, 0.24)),
      rgba(15, 23, 42, 0.2);
  }

  .ahc-dashboard-group + .ahc-dashboard-group {
    margin-block-start: 10px;
  }

  .ahc-dashboard-group__header,
  .ahc-area-card__header {
    min-block-size: var(--ahc-dashboard-group-header-height);
    padding-block: 0;
    padding-inline: 0;
    background: transparent;
  }

  .ahc-dashboard-group__title,
  .ahc-area-card__title {
    min-inline-size: 0;
  }

  .ahc-area-card__title-copy {
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

  .ahc-area-card__actions {
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 8px;
    min-inline-size: 0;
  }

  .ahc-area-card__inventory-button,
  .ahc-area-inventory__more {
    min-block-size: 32px;
    border-radius: 8px;
  }

  .ahc-dashboard-group__aggregate,
  .ahc-area-card__aggregate {
    min-block-size: 28px;
    block-size: 28px;
    margin-inline: 0 calc(var(--ahc-dashboard-label-width) + 12px);
    border-radius: 0;
    background-color: transparent;
    overflow: hidden;
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
    direction: rtl;
    display: grid;
    grid-template-columns: minmax(0, 1fr) var(--ahc-dashboard-label-width);
    gap: 12px;
    min-block-size: var(--ahc-dashboard-row-height);
    padding-block: 0;
    padding-inline: 0;
    border-radius: 8px;
    border-block-start: 1px solid rgba(148, 163, 184, 0.07);
  }

  .ahc-dashboard-row:hover {
    background: rgba(56, 189, 248, 0.045);
  }

  .ahc-dashboard-row__plot {
    grid-column: 1;
    direction: ltr;
    position: relative;
    min-block-size: var(--ahc-dashboard-row-height);
    border-radius: 0;
    background-image: none;
    background-color: transparent;
    overflow: hidden;
  }

  .ahc-dashboard-row__plot::before {
    display: none;
  }

  .ahc-dashboard-row__label {
    grid-column: 2;
    direction: rtl;
    align-self: stretch;
    display: grid;
    grid-template-columns: 34px minmax(0, 1fr);
    align-items: center;
    gap: 8px;
    padding-inline: 0 10px;
    min-inline-size: 0;
    border-inline-start: 1px solid rgba(148, 163, 184, 0.1);
  }

  .ahc-dashboard-row__label-icon {
    color: rgba(203, 213, 225, 0.92);
  }

  .ahc-dashboard-row__label-copy {
    min-inline-size: 0;
    display: grid;
    gap: 2px;
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

  .ahc-dashboard-row__state {
    color: var(--ahc-muted);
    font-size: 0.66rem;
    font-weight: 800;
  }

  .ahc-dashboard-row__state[data-state-tone="on"] {
    color: var(--ahc-green);
  }

  .ahc-dashboard-row__state[data-state-tone="cooling"] {
    color: var(--ahc-blue);
  }

  .ahc-dashboard-row__state[data-state-tone="heating"] {
    color: var(--ahc-orange);
  }

  .ahc-dashboard-row__state[data-state-tone="playing"] {
    color: var(--ahc-purple);
  }

  .ahc-dashboard-row__inline-meta,
  .ahc-dashboard-row__meta {
    display: none;
  }

  .ahc-dashboard-segment {
    position: absolute;
    inset-block-start: 50%;
    transform: translateY(-50%);
    block-size: var(--ahc-dashboard-segment-height);
    min-inline-size: 0;
    border: 0;
    border-radius: 999px;
    background: var(--segment-color, #38bdf8);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.24),
      0 3px 12px rgba(0, 0, 0, 0.22),
      0 0 14px
        color-mix(in srgb, var(--segment-color, #38bdf8) 38%, transparent);
    opacity: 0.96;
  }

  .ahc-dashboard-segment--row {
    block-size: var(--ahc-dashboard-segment-height);
  }

  .ahc-dashboard-segment--min {
    min-inline-size: var(--ahc-dashboard-segment-min-width);
  }

  .ahc-dashboard-segment--aggregate {
    block-size: var(--ahc-dashboard-aggregate-height);
    opacity: 0.92;
  }

  .ahc-dashboard-segment--on {
    --segment-color: var(--ahc-green);
  }

  .ahc-dashboard-segment--cooling {
    --segment-color: var(--ahc-blue);
  }

  .ahc-dashboard-segment--heating {
    --segment-color: var(--ahc-orange);
  }

  .ahc-dashboard-segment--playing {
    --segment-color: var(--ahc-purple);
  }

  .ahc-dashboard-segment--open {
    --segment-color: var(--ahc-yellow);
  }

  .ahc-dashboard-segment--fan {
    --segment-color: var(--ahc-teal);
  }

  button.ahc-dashboard-segment span {
    display: none;
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
    margin-inline: 0;
    border-radius: 10px;
  }

  .ahc-area-card__inventory-preview,
  .ahc-area-inventory {
    max-block-size: 130px;
    overflow: auto;
    margin: 2px 0 0;
    padding: 8px;
    border: 1px solid rgba(148, 163, 184, 0.09);
    border-radius: 14px;
    background:
      linear-gradient(180deg, rgba(15, 23, 42, 0.62), rgba(2, 6, 23, 0.3)),
      rgba(2, 6, 23, 0.22);
  }

  .ahc-area-card[data-has-activity="false"] .ahc-area-inventory {
    max-block-size: 82px;
    margin-block-start: 0;
  }

  .ahc-area-card[data-inventory-expanded="true"] .ahc-area-inventory {
    max-block-size: 260px;
  }

  .ahc-area-inventory__header {
    min-block-size: 22px;
    font-size: 0.76rem;
  }

  .ahc-area-inventory__groups {
    gap: 6px;
  }

  .ahc-area-inventory__domain {
    display: grid;
    gap: 5px;
    min-inline-size: 0;
  }

  .ahc-area-inventory__domain-title {
    color: rgba(226, 232, 240, 0.72);
    font-size: 0.68rem;
    font-weight: 800;
  }

  .ahc-area-inventory__chips {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 6px;
  }

  .ahc-inventory-chip {
    min-block-size: 36px;
    block-size: 36px;
    grid-template-columns: 28px minmax(0, 1fr);
    padding-block: 4px;
    padding-inline: 7px;
    border-radius: 10px;
  }

  .ahc-inventory-chip .ahc-dashboard-icon {
    inline-size: 24px;
    block-size: 24px;
  }

  .ahc-inventory-chip__icon {
    color: rgba(203, 213, 225, 0.88);
  }

  .ahc-inventory-chip__copy {
    min-inline-size: 0;
  }

  .ahc-inventory-chip__copy strong {
    font-size: 0.76rem;
  }

  .ahc-inventory-chip__copy small {
    font-size: 0.68rem;
  }

  .ahc-inventory-chip__state {
    color: var(--ahc-muted);
  }

  .ahc-insight-card {
    border: 1px solid rgba(148, 163, 184, 0.11);
    border-radius: 14px;
    background:
      linear-gradient(180deg, rgba(19, 29, 50, 0.88), rgba(9, 14, 29, 0.94)),
      rgba(15, 23, 42, 0.74);
  }

  .ahc__insights-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-block-end: 10px;
    color: var(--ahc-text);
  }

  .ahc__insights-header h3 {
    margin: 0;
    font-size: 0.95rem;
  }

  .ahc-insight-card__title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--ahc-muted);
    font-size: 0.76rem;
    font-weight: 850;
  }

  .ahc-insight-card__value {
    display: block;
    margin-block-start: 10px;
    color: var(--ahc-text);
    font-size: 1.08rem;
    font-weight: 900;
  }

  .ahc-insight-card__caption {
    display: block;
    margin-block-start: 8px;
    color: rgba(226, 232, 240, 0.72);
    font-size: 0.74rem;
    line-height: 1.45;
  }

  .ahc-dashboard__notice {
    position: absolute;
    inset-inline: 18px;
    inset-block-end: 10px;
    margin: 0;
    padding-block: 6px;
    padding-inline: 10px;
    border: 1px solid rgba(148, 163, 184, 0.12);
    border-radius: 10px;
    background: rgba(2, 6, 23, 0.72);
    color: rgba(226, 232, 240, 0.78);
    font-size: 0.72rem;
    text-align: center;
  }

  .ahc--density-comfortable {
    --ahc-dashboard-label-width: 250px;
    --ahc-dashboard-row-height: 34px;
    --ahc-dashboard-segment-height: 11px;
    --ahc-dashboard-aggregate-height: 13px;
    --ahc-dashboard-group-header-height: 42px;
    --ahc-dashboard-group-gap: 10px;
    --ahc-insights-width: 340px;
  }

  .ahc--density-compact {
    --ahc-dashboard-label-width: 212px;
    --ahc-dashboard-row-height: 24px;
    --ahc-dashboard-segment-height: 9px;
    --ahc-dashboard-aggregate-height: 11px;
    --ahc-dashboard-group-header-height: 32px;
    --ahc-dashboard-group-gap: 5px;
    --ahc-chip-height: 36px;
    --ahc-insights-width: 330px;
  }

  .ahc--density-ultra-compact {
    --ahc-dashboard-label-width: 194px;
    --ahc-dashboard-row-height: 20px;
    --ahc-dashboard-segment-height: 8px;
    --ahc-dashboard-aggregate-height: 10px;
    --ahc-dashboard-group-header-height: 28px;
    --ahc-dashboard-group-gap: 4px;
    --ahc-chip-height: 34px;
    --ahc-insights-width: 320px;
  }

  .ahc--fixed-overlay {
    position: fixed;
    inset: 0;
    z-index: 2147483640;
    inline-size: 100vw;
    block-size: 100svh;
    max-inline-size: none;
    max-block-size: none;
  }

  .ahc--mockup05-shell.ahc--density-compact.ahc--panel,
  .ahc--mockup05-shell.ahc--density-compact.ahc--fullscreen {
    grid-template-rows: minmax(0, 72px) minmax(0, 52px) minmax(0, 78px) minmax(
        0,
        1fr
      );
  }

  .ahc--mockup05-shell.ahc--density-ultra-compact.ahc--panel,
  .ahc--mockup05-shell.ahc--density-ultra-compact.ahc--fullscreen {
    grid-template-rows: minmax(0, 66px) minmax(0, 48px) minmax(0, 70px) minmax(
        0,
        1fr
      );
  }

  .ahc--mockup05-shell.ahc--density-compact .ahc__hero {
    min-block-size: 68px;
    max-block-size: 72px;
  }

  .ahc--mockup05-shell.ahc--density-compact .ahc__toolbar,
  .ahc--density-compact .ahc__toolbar.ahc__filters {
    min-block-size: 52px;
    max-block-size: 52px;
    padding-block: 6px;
  }

  .ahc--mockup05-shell.ahc--density-compact .ahc__summary-strip,
  .ahc--density-compact .ahc__summary-strip {
    min-block-size: 74px;
    max-block-size: 78px;
  }

  .ahc--density-compact .ahc__summary-strip .ahc__metric,
  .ahc--density-compact .ahc__summary-card {
    min-block-size: 74px;
    padding-block: 8px;
  }

  .ahc--density-compact .ahc-dashboard {
    gap: 8px;
    padding: 10px;
    min-block-size: min(460px, calc(100svh - 240px));
  }

  .ahc--density-ultra-compact .ahc-dashboard {
    gap: 6px;
    padding: 8px;
  }

  .ahc--density-compact .ahc-dashboard__header {
    min-block-size: 40px;
  }

  .ahc--density-compact .ahc-dashboard__density {
    block-size: 34px;
    min-block-size: 34px;
    padding-block: 5px;
  }

  .ahc--density-compact .ahc-dashboard-density-bucket {
    block-size: 24px;
  }

  .ahc--density-compact .ahc-dashboard-density-fill {
    max-block-size: 22px;
  }

  .ahc--density-compact .ahc-dashboard__axis {
    block-size: 30px;
    min-block-size: 30px;
  }

  .ahc--density-compact .ahc-dashboard__tick,
  .ahc--density-compact .ahc-dashboard__axis-label {
    inset-block-start: 9px;
    font-size: 0.7rem;
  }

  .ahc-dashboard__lanes {
    display: grid;
    gap: var(--ahc-dashboard-group-gap);
  }

  .ahc-area-lane {
    display: grid;
    gap: 4px;
    min-inline-size: 0;
    padding-block: 6px;
    padding-inline: 8px 10px;
    border-radius: 12px;
  }

  .ahc-area-lane--active {
    max-block-size: 130px;
  }

  .ahc--density-ultra-compact .ahc-area-lane--active {
    max-block-size: 112px;
  }

  .ahc-area-lane--inactive {
    min-block-size: 38px;
    max-block-size: 42px;
    padding-block: 4px;
    opacity: 0.82;
  }

  .ahc-area-lane--more {
    min-block-size: 36px;
    display: grid;
    place-items: center;
  }

  .ahc-area-lane__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-block-size: var(--ahc-dashboard-group-header-height);
  }

  .ahc-area-lane__title {
    min-inline-size: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ahc-area-lane__meta {
    color: var(--ahc-muted);
    font-size: 0.7rem;
    font-weight: 750;
  }

  .ahc-area-lane__inventory-trigger {
    min-block-size: 28px;
    padding-inline: 9px;
    font-size: 0.7rem;
  }

  .ahc-area-lane__aggregate {
    block-size: var(--ahc-dashboard-aggregate-height);
    min-block-size: var(--ahc-dashboard-aggregate-height);
    margin-inline: 0 calc(var(--ahc-dashboard-label-width) + 12px);
  }

  .ahc-area-lane__content,
  .ahc-area-lane__rows {
    min-inline-size: 0;
    display: grid;
    gap: 0;
  }

  .ahc-area-lane__empty-summary {
    min-inline-size: 0;
    color: var(--ahc-muted);
    font-size: 0.72rem;
    font-weight: 800;
    text-align: center;
  }

  .ahc-lane-row {
    min-block-size: var(--ahc-dashboard-row-height);
    grid-template-columns: minmax(0, 1fr) var(--ahc-dashboard-label-width);
    gap: 10px;
  }

  .ahc-lane-row__label {
    grid-template-columns: 24px minmax(0, 1fr);
    gap: 6px;
    padding-inline: 0 8px;
  }

  .ahc--density-compact .ahc-lane-row__label,
  .ahc--density-ultra-compact .ahc-lane-row__label {
    grid-template-columns: 18px minmax(0, 1fr);
    gap: 5px;
  }

  .ahc--density-compact .ahc-lane-row__label .ahc-dashboard-icon,
  .ahc--density-ultra-compact .ahc-lane-row__label .ahc-dashboard-icon {
    inline-size: 18px;
    block-size: 18px;
  }

  .ahc--density-compact .ahc-lane-row__label ha-icon,
  .ahc--density-ultra-compact .ahc-lane-row__label ha-icon {
    --mdc-icon-size: 16px;
  }

  .ahc--density-compact .ahc-lane-row__label .ahc-dashboard-row__label-copy,
  .ahc--density-ultra-compact
    .ahc-lane-row__label
    .ahc-dashboard-row__label-copy {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 5px;
  }

  .ahc--density-compact
    .ahc-lane-row__label
    .ahc-dashboard-row__label-copy
    > span:not(.ahc-dashboard-row__state),
  .ahc--density-ultra-compact
    .ahc-lane-row__label
    .ahc-dashboard-row__label-copy
    > span:not(.ahc-dashboard-row__state),
  .ahc--density-compact .ahc-lane-row__label .ahc-dashboard-row__state,
  .ahc--density-ultra-compact .ahc-lane-row__label .ahc-dashboard-row__state {
    display: none;
  }

  .ahc-lane-row__name {
    color: rgba(241, 245, 249, 0.92);
    font-size: 0.76rem;
    line-height: 1.05;
  }

  .ahc-lane-row__duration {
    color: rgba(203, 213, 225, 0.72);
    font-size: 0.64rem;
    font-weight: 800;
    line-height: 1;
  }

  .ahc--density-compact .ahc-lane-row__duration {
    display: block;
    white-space: nowrap;
  }

  .ahc-lane-row__plot {
    min-block-size: var(--ahc-dashboard-row-height);
  }

  .ahc--density-ultra-compact .ahc-lane-row__name {
    font-size: 0.72rem;
  }

  .ahc--density-ultra-compact .ahc-lane-row__duration,
  .ahc--density-ultra-compact .ahc-dashboard-row__state {
    display: none;
  }

  .ahc-inventory-drawer {
    position: absolute;
    inset-block: 48px 12px;
    inset-inline-start: 12px;
    z-index: 12;
    inline-size: min(360px, calc(100% - 24px));
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 10px;
    padding: 12px;
    border: 1px solid rgba(125, 211, 252, 0.22);
    border-radius: 16px;
    background:
      linear-gradient(180deg, rgba(20, 31, 54, 0.98), rgba(8, 13, 29, 0.98)),
      rgba(15, 23, 42, 0.96);
    box-shadow: 0 22px 52px rgba(2, 6, 23, 0.46);
    overflow: hidden;
  }

  .ahc-inventory-drawer__header {
    display: flex;
    align-items: start;
    justify-content: space-between;
    gap: 10px;
    min-inline-size: 0;
    padding-block-end: 8px;
    border-block-end: 1px solid rgba(148, 163, 184, 0.12);
  }

  .ahc-inventory-drawer__title {
    display: block;
    color: var(--ahc-text);
    font-size: 0.9rem;
    font-weight: 900;
  }

  .ahc-inventory-drawer__meta {
    display: block;
    margin-block-start: 4px;
    color: var(--ahc-muted);
    font-size: 0.72rem;
    font-weight: 800;
  }

  .ahc-inventory-drawer__close {
    flex: 0 0 34px;
    inline-size: 34px;
    block-size: 34px;
    display: grid;
    place-items: center;
    border: 1px solid rgba(148, 163, 184, 0.16);
    border-radius: 10px;
    color: var(--ahc-text);
    background: rgba(15, 23, 42, 0.72);
    font-size: 1.2rem;
    line-height: 1;
    cursor: pointer;
  }

  .ahc-inventory-drawer__items {
    min-block-size: 0;
    overflow: auto;
    display: grid;
    align-content: start;
    gap: 7px;
    padding-inline-end: 2px;
  }

  @media (max-width: 1100px) {
    .ahc:not(.ahc--mockup05-shell) .ahc__insights-panel {
      display: none;
    }

    .ahc--mockup05-shell .ahc__body {
      grid-template-columns: minmax(0, 1fr);
    }

    .ahc--mockup05-shell .ahc__main,
    .ahc--mockup05-shell .ahc__insights-panel {
      grid-column: 1;
    }

    .ahc--mockup05-shell[dir="rtl"] .ahc__main,
    .ahc--mockup05-shell[dir="rtl"] .ahc__insights-panel,
    .ahc--mockup05-shell[dir="ltr"] .ahc__main,
    .ahc--mockup05-shell[dir="ltr"] .ahc__insights-panel {
      grid-column: 1;
    }

    .ahc--mockup05-shell .ahc__insights-panel {
      display: block;
      max-inline-size: none;
      overflow: visible;
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

    .ahc--mockup05-shell {
      inline-size: 100%;
      max-inline-size: 100%;
      overflow: hidden;
    }

    .ahc--mockup05-shell .ahc__hero {
      flex-direction: column;
      align-items: stretch;
      max-block-size: none;
    }

    .ahc--mockup05-shell .ahc__hero-main {
      justify-content: space-between;
    }

    .ahc--mockup05-shell .ahc__hero-actions {
      justify-content: flex-start;
      overflow-x: auto;
      scrollbar-width: none;
    }

    .ahc--mockup05-shell .ahc__toolbar {
      max-block-size: none;
      min-block-size: 0;
      overflow-x: auto;
      scrollbar-width: none;
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

    .ahc--mockup05-shell .ahc__summary-strip {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      max-block-size: none;
    }

    .ahc__body {
      min-block-size: 0;
    }

    .ahc--mockup05-shell .ahc__body {
      overflow: visible;
    }

    .ahc__main {
      overflow: visible;
    }

    .ahc-dashboard {
      min-block-size: 560px;
      max-block-size: none;
      block-size: auto;
      gap: 10px;
      padding: 10px;
      border-radius: 16px;
    }

    .ahc--mockup05-shell .ahc-dashboard {
      block-size: min(72svh, 720px);
      min-block-size: 560px;
    }

    .ahc-dashboard__density {
      grid-template-rows: 32px;
      block-size: 42px;
      min-block-size: 42px;
      padding-inline: 10px calc(var(--ahc-dashboard-label-width) + 10px);
    }

    .ahc-dashboard__density-labels {
      display: none;
    }

    .ahc-dashboard__axis {
      margin-inline-end: calc(var(--ahc-dashboard-label-width) + 10px);
    }

    .ahc-dashboard__axis-label {
      min-inline-size: 40px;
      font-size: 0.66rem;
    }

    .ahc--mockup05-shell .ahc-dashboard__axis-label {
      display: none;
    }

    .ahc--mockup05-shell .ahc-dashboard__axis-label:nth-of-type(1),
    .ahc--mockup05-shell .ahc-dashboard__axis-label:nth-of-type(3),
    .ahc--mockup05-shell .ahc-dashboard__axis-label:nth-of-type(5) {
      display: block;
    }

    .ahc-dashboard__scroll {
      max-block-size: min(66svh, 720px);
      padding-inline: 4px;
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
      margin-inline: 0;
    }

    .ahc-area-card[data-inventory-expanded="true"] .ahc-area-inventory {
      max-block-size: 260px;
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
function sr(t, e = !1) {
  const a = t.view_mode ?? t.default_view ?? b.view_mode;
  return a === "activity_legacy" ? "activity_legacy" : a === "legacy_swimlane" || a === "swimlane" || t.timeline_style === "legacy" ? "legacy_swimlane" : a === "heatmap" ? "heatmap" : a === "detail" ? "detail" : a === "correlation" ? "correlation" : "activity";
}
class or extends j {
  constructor() {
    super(...arguments), this._config = {
      type: "custom:activity-history-card"
    }, this._areas = [], this._labels = [], this._domains = ie, this._loadedOptions = !1;
  }
  static {
    this.styles = pt`
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
    const e = this._config, a = e.domains?.length ? e.domains : ie;
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
                @input=${(i) => this._setValue("title", M(i))}
              />
            </label>
            <label>
              טווח שעות
              <input
                type="number"
                min="1"
                max="168"
                .value=${String(e.hours_to_show ?? 24)}
                @input=${(i) => this._setNumber("hours_to_show", M(i))}
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
      M(i)
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
                @change=${(i) => this._setValue("view_mode", M(i))}
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
      M(i)
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
      M(i)
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
      M(i)
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
                @input=${(i) => this._setNumber("min_row_active_seconds", M(i))}
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
                @input=${(i) => this._setNumber("max_rows_per_group", M(i))}
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
                @input=${(i) => this._setNumber("max_total_rows", M(i))}
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
        R[i] ?? i,
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
          @change=${(r) => this._toggleArrayValue(e, a, r)}
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
      ...new Set(Object.keys(this._hass.states).map(q))
    ].filter(Boolean).sort();
    this._areas = e.sort((n, r) => n.name.localeCompare(r.name, "he")), this._labels = a.sort((n, r) => n.name.localeCompare(r.name, "he")), this._domains = [
      .../* @__PURE__ */ new Set([...ie, ...i])
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
    const n = i.target.checked, r = new Set(this._config[e] ?? []);
    n ? r.add(a) : r.delete(a);
    const s = [...r];
    this._emitConfig({
      ...this._config,
      [e]: s.length ? s : void 0
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
function M(t) {
  return t.target.value;
}
customElements.get("activity-history-card-editor") || customElements.define(
  "activity-history-card-editor",
  or
);
class cr extends j {
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
      const n = this._visibleRows.find((l) => l.entity.entity_id === a) ?? this._rows.find((l) => l.entity.entity_id === a), r = n?.segments[i], s = e.currentTarget instanceof Element ? e.currentTarget : void 0;
      if (!n || !r || !s) return;
      const c = s.getBoundingClientRect(), o = Oi(c, {
        width: window.innerWidth,
        height: window.innerHeight
      });
      this._segmentPopover = {
        row: n,
        segment: r,
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
      this._showAllRows = !1, this._expandedInventoryGroups.clear(), this._collapsedInventoryGroups.clear(), this._openInventoryAreaId = void 0, this._filter = {
        search: "",
        areas: [],
        domains: [],
        stateMode: "all",
        groupBy: this._config.group_by ?? "area",
        timePreset: a
      }, this._rebuildGroups(), e !== a && (this._lastFetchKey = "", this._requestHistoryRefresh("range", { force: !0 }));
    }, this._toggleShowAllRows = () => {
      this._showAllRows = !this._showAllRows, this._expandedInventoryGroups.clear(), this._collapsedInventoryGroups.clear(), this._openInventoryAreaId = void 0, this._rebuildGroups();
    }, this._toggleDebugLegacyView = () => {
      this._config.debug && (this._debugLegacyView = !this._debugLegacyView, this._rebuildGroups());
    }, this._toggleInventoryGroup = (e) => {
      if (this._shouldUseInventoryDrawer()) {
        this._openInventoryAreaId = this._openInventoryAreaId === e ? void 0 : e, this.requestUpdate();
        return;
      }
      const a = this._isInventoryGroupDefaultExpanded();
      this._collapsedInventoryGroups.has(e) ? (this._collapsedInventoryGroups.delete(e), this._expandedInventoryGroups.add(e)) : a || this._expandedInventoryGroups.has(e) ? (this._expandedInventoryGroups.delete(e), this._collapsedInventoryGroups.add(e)) : this._expandedInventoryGroups.add(e), this.requestUpdate();
    }, this._closeInventoryDrawer = () => {
      this._openInventoryAreaId = void 0, this.requestUpdate();
    }, this._openInventoryMoreInfo = (e, a) => {
      e.stopPropagation(), this.dispatchEvent(Mi(a));
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
    this.styles = rr;
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
    const a = this._initialTimePreset(e), i = e.view_mode ?? e.default_view ?? b.view_mode, n = e.display_mode ?? b.display_mode, r = e.desktop_density ?? (n === "panel" || i === "activity" ? "compact" : b.desktop_density);
    this._config = {
      ...b,
      ...e,
      display_mode: n,
      desktop_density: r,
      fullscreen_behavior: e.fullscreen_behavior ?? b.fullscreen_behavior,
      view_mode: i,
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
    }, this._lastFetchKey = "", this._lastResolvedEntityKey = "", this._loadedRange = void 0, this._showAllRows = !1, this._debugLegacyView = !1, this._expandedInventoryGroups.clear(), this._collapsedInventoryGroups.clear(), this._openInventoryAreaId = void 0, this._historyCache.clear(), this._syncRefreshTimer(), this._requestHistoryRefresh(this._hasFetchedOnce ? "config" : "initial", {
      force: !0
    });
  }
  set hass(e) {
    this._hass = e, ji({
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
    const e = this._hass?.locale?.language ?? this._hass?.language, a = Oa(
      this._config.direction ?? this._config.rtl ?? "auto",
      e
    ), i = [
      "ahc",
      this._currentRendererMode() === "activity" ? "ahc--mockup05-shell" : "",
      this._isMockup05VisualPreview() ? "ahc--mockup05-preview" : "",
      this._config.display_mode === "panel" ? "ahc--panel" : "",
      `ahc--density-${this._desktopDensityClass()}`,
      this._usesFullscreenShell() ? "ahc--fullscreen" : "",
      this._fullscreen && this._config.fullscreen_behavior === "fixed_overlay" ? "ahc--fixed-overlay" : "",
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
  _isMockup05VisualPreview() {
    return this._config?.mock_data === !0 && this._config.mock_profile === "mockup05_visual" && this._currentRendererMode() === "activity";
  }
  _desktopDensity() {
    return this._config.desktop_density ?? b.desktop_density;
  }
  _desktopDensityClass() {
    return this._desktopDensity().replace("_", "-");
  }
  _usesFullscreenShell() {
    return this._config.display_mode === "fullscreen" || this._fullscreen && this._config.fullscreen_behavior !== "card";
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
    if (this._isMockup05VisualPreview())
      return Xi(
        {
          ...S.hero,
          title: this._config.title ?? S.hero.title
        },
        {
          onRefresh: this._manualRefresh,
          onFullscreen: this._config.show_fullscreen_button === !1 ? void 0 : this._toggleFullscreen
        }
      );
    const e = `${this._timePresetLabel(this._filter.timePreset)} · ${this._usingMockData ? "נתוני דוגמה" : "נתוני Home Assistant"}`;
    return h`
      <section class="ahc__hero ahc__topbar">
        <div class="ahc__title-block ahc__hero-main">
          <div class="ahc__title-row">
            <span class="ahc__icon-badge ahc__hero-icon" aria-hidden="true"
              ><ha-icon icon="mdi:chart-timeline-variant"></ha-icon
            ></span>
            <h2 class="ahc__title ahc__hero-title">
              ${this._config.title ?? b.title}
            </h2>
          </div>
          <p class="ahc__subtitle ahc__hero-subtitle">${e}</p>
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
      </section>
    `;
  }
  _renderLastEventPill() {
    const e = this._summary, a = e?.lastEventRow, i = e?.lastEvent;
    return !a || !i ? _ : h`
      <div class="ahc-last-event">
        <span class="ahc-last-event__label">אירוע אחרון</span>
        <strong>${a.entity.name}</strong>
        <span
          >${v(i.start)} · ${A[i.category]} ·
          ${ue(a, this._config.debug === !0)}</span
        >
      </div>
    `;
  }
  _renderFilters() {
    if (this._config.filters?.show === !1) return _;
    if (this._isMockup05VisualPreview())
      return Ji(S.toolbar);
    const e = G(this._curation), i = this._currentRendererMode() === "activity", n = !!(i ? this._canToggleAreaInventory() : this._curation?.hiddenRows || this._showAllRows), r = i ? this._showAllRows ? "פעילות בלבד" : "כל האביזרים" : this._showAllRows ? "הצג רק פעילות" : "הצג הכל";
    return h`
      <section class="ahc__toolbar ahc__filters" aria-label="מסננים">
        <div
          class="ahc__filter-row ahc__filter-row--primary ahc__toolbar-group"
        >
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
                ${r}
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
    const n = [
      "ahc__chip",
      "ahc__filter-chip",
      a ? "ahc__filter-chip--active" : ""
    ].filter(Boolean).join(" ");
    return h`<button
      class=${n}
      type="button"
      aria-pressed=${a ? "true" : "false"}
      @click=${i}
    >
      ${e}
    </button>`;
  }
  _renderSummary() {
    if (this._config.show_summary === !1) return _;
    if (this._isMockup05VisualPreview())
      return rt(S.summary);
    if (this._dashboardModel && this._config.summary_scope !== "all")
      return rt(
        xe(this._dashboardModel, this._config, {
          expandedInventoryGroups: this._expandedInventoryGroups,
          collapsedInventoryGroups: this._collapsedInventoryGroups,
          showAllInventory: this._showAllRows
        }).summary
      );
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
              ${i && a ? `${v(i.start)} · ${A[i.category]} · ${ue(a, this._config.debug === !0)}` : "לא נמצאו אירועים בטווח"}
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
    if (this._isMockup05VisualPreview())
      return Dt(S, {
        config: this._config,
        onInventoryToggle: this._toggleInventoryGroup,
        onInventoryClose: this._closeInventoryDrawer,
        onInventoryItemClick: this._openInventoryMoreInfo,
        openInventoryGroupId: this._openInventoryAreaId
      });
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
    const a = this._displayRange();
    switch (this._currentRendererMode()) {
      case "heatmap":
        return Vi();
      case "detail":
        return Ui();
      case "correlation":
        return Gi();
      case "legacy_swimlane":
        return h`
          ${this._showAllRows && this._config.view_mode === "activity" ? h`<div class="ahc-legacy-warning">
                מצב הצגת הכל מיועד לבדיקה. התצוגה מציגה שורות גולמיות יותר
                ועלולה לכלול רכיבים רועשים.
              </div>` : _}
          ${er({
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
          summary: this._summary ?? O(this._groups),
          curation: this._curation,
          onSegmentClick: this._openSegmentPopover
        })}
        `;
      case "activity_legacy":
        return Vn({
          groups: this._groups,
          range: a,
          config: this._config,
          summary: this._summary ?? O(this._groups),
          curation: this._curation,
          onSegmentClick: this._openSegmentPopover
        });
      case "activity":
      default:
        return zn({
          model: this._dashboardModel ?? Ve(
            this._groups,
            a,
            this._config,
            this._curation,
            {
              inventoryRows: Ye(this._rows, this._filter),
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
          onInventoryClose: this._closeInventoryDrawer,
          onInventoryItemClick: this._openInventoryMoreInfo,
          openInventoryGroupId: this._openInventoryAreaId
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
        (n, r) => h`<i
                      style="--delay:${i + r}; --width:${42 + (i + r) % 4 * 12}%"
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
    const a = pi(
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
                ${G(this._curation)}
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
          ${this._config.debug_timeline_geometry === !0 ? h`<div>
                <dt>plot width</dt>
                <dd>${this._timelinePlotWidthLabel()}</dd>
              </div>` : _}
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
  _timelinePlotWidthLabel() {
    const e = this.renderRoot?.querySelector(
      ".ahc-dashboard-row__plot"
    );
    return e?.clientWidth ? `${e.clientWidth}px` : "pending";
  }
  _renderInsights() {
    if (this._isMockup05VisualPreview())
      return st(S.insights);
    if (this._dashboardModel && this._config.summary_scope !== "all")
      return st(
        xe(this._dashboardModel, this._config, {
          expandedInventoryGroups: this._expandedInventoryGroups,
          collapsedInventoryGroups: this._collapsedInventoryGroups,
          showAllInventory: this._showAllRows
        }).insights
      );
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
            >${a ? `${y(a.totalActiveMs)} · ${ue(a, this._config.debug === !0)}` : "צריך היסטוריה פעילה בטווח"}</span
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
      (r) => h`<i style="--bar:${n ? r : 12}%"></i>`
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
        R[n] ?? n,
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
              >${G(this._curation) || "הסתר שורות ריקות, טכניות וקצרות מאוד"}</small
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
        R[n.entity.domain] ?? n.entity.domain
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
    const r = ++this._fetchToken, s = !this._hasFetchedOnce && !this._rows.length;
    this._initialLoad = s, this._loading = s, this._backgroundLoading = !s, this._error = void 0, this._rows.length || (this._emptyReason = void 0), this._usingMockData = n, this.requestUpdate();
    const c = n ? {
      entities: Li(this._config.mock_profile),
      diagnostics: void 0
    } : await ui(this._config, this._hass);
    if (r !== this._fetchToken) return;
    const o = c.entities, l = lr(o), d = this._resolveRange(), p = Pt(o), u = Ci({
      mock: n,
      start: d.start.toISOString(),
      end: d.end.toISOString(),
      entityIds: o.map((m) => m.entity_id),
      withAttributes: p.withAttributes.map(
        (m) => m.entity_id
      ),
      withoutAttributes: p.withoutAttributes.map(
        (m) => m.entity_id
      ),
      includeLabels: this._config.include_labels ?? [],
      excludeLabels: this._config.exclude_labels ?? [],
      significant: this._config.significant_changes_only,
      minimal: this._config.minimal_response
    }), g = a && ["manual", "timer", "interval", "config"].includes(e), w = !!(this._lastResolvedEntityKey && this._lastResolvedEntityKey !== l) && e === "interval" ? "entities" : e, x = (m, k, ee = c.diagnostics) => {
      this._loadedRange = d, this._lastResolvedEntityKey = l, this._lastHistoryFetchAt = Date.now(), this._hasFetchedOnce = !0, this._setPostLoadState(
        k,
        d,
        p,
        m,
        n,
        ee,
        {
          reason: w,
          key: u,
          durationMs: Date.now() - i
        }
      ), this._syncRefreshTimer();
    };
    if (!o.length) {
      this._loadedRange = d, this._usingMockData = !1, this._rows = [], this._visibleRows = [], this._groups = [], this._dashboardModel = void 0, this._summary = O([]), this._curation = de([], this._config).diagnostics, this._emptyReason = this._config.auto_discover === !1 && !this._config.entities?.length ? "no_entities_selected" : "no_resolved_entities", this._setDiagnostics({
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
        fetchReason: w,
        currentHistoryKey: u,
        refreshIntervalSeconds: this._refreshIntervalSeconds(),
        initialLoad: s,
        backgroundLoading: !1
      }), this._hasFetchedOnce = !0, this._lastResolvedEntityKey = l, this._lastHistoryFetchAt = Date.now(), this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this._error = void 0, this._syncRefreshTimer(), this.requestUpdate();
      return;
    }
    if (!g && u === this._lastFetchKey) {
      const m = this._historyCache.get(u);
      if (m) {
        const k = dt(m);
        this._rows = at(
          m,
          o,
          d,
          this._config,
          this._hass?.states ?? {}
        ), x(!0, k), this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this._error = void 0, this._rebuildGroups();
        return;
      }
    }
    try {
      let m = g ? void 0 : this._historyCache.get(u);
      if (m || (m = n ? Di(d, this._config.mock_profile) : await Ri(
        this._hass,
        o,
        d,
        this._config
      ), this._historyCache.set(u, m)), r !== this._fetchToken) return;
      const k = dt(m);
      this._rows = at(
        m,
        o,
        d,
        this._config,
        this._hass?.states ?? {}
      ), x(!1, k), this._lastFetchKey = u, this._rebuildGroups();
    } catch (m) {
      this._error = m instanceof Error ? m.message : String(m), this._rows.length || (this._visibleRows = [], this._groups = [], this._dashboardModel = void 0, this._summary = O([]), this._curation = de([], this._config).diagnostics, this._emptyReason = void 0);
    } finally {
      r === this._fetchToken && (this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this.requestUpdate());
    }
  }
  _rebuildGroups() {
    const e = Ye(this._rows, this._filter), a = this._displayRange(), i = this._currentRendererMode(), n = i !== "activity" && this._showAllRows, r = de(e, this._config, {
      showAll: n,
      groupBy: this._filter.groupBy
    });
    this._visibleRows = r.rows, this._curation = r.diagnostics, this._groups = Xe(r.rows, this._filter.groupBy).filter(
      (s) => this._config.hide_empty_groups === !1 || s.rows.length > 0
    ), this._dashboardModel = i === "activity" ? Ve(
      this._groups,
      a,
      this._config,
      r.diagnostics,
      {
        inventoryRows: e,
        selectedAreas: this._filter.areas,
        groupBy: this._filter.groupBy
      }
    ) : void 0, this._summary = i === "activity" && this._dashboardModel && this._config.summary_scope !== "all" ? Wa(this._dashboardModel) : O(
      this._config.summary_scope === "all" ? Xe(e, this._filter.groupBy) : this._groups
    ), this._rows.length && !e.length ? this._emptyReason = "all_entities_filtered" : e.length && !r.rows.length ? this._emptyReason = "no_meaningful_activity" : (this._emptyReason === "all_entities_filtered" || this._emptyReason === "no_meaningful_activity") && (this._emptyReason = void 0), this._diagnostics && this._setDiagnostics({
      ...this._diagnostics,
      filteredRowCount: e.length,
      renderedGroupCount: this._dashboardModel?.groups.length ?? this._groups.length,
      curation: r.diagnostics,
      activeFilters: { ...this._filter }
    }), this.requestUpdate();
  }
  _setPostLoadState(e, a, i, n, r, s, c) {
    const o = this._rows.reduce(
      (d, p) => d + p.segments.length,
      0
    ), l = this._rows.reduce(
      (d, p) => d + p.segments.filter((u) => u.active).length,
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
      mockData: r,
      discovery: s,
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
    return Lt(
      this._config?.refresh_interval_seconds
    );
  }
  _displayRange() {
    return this._loadedRange ?? this._resolveRange();
  }
  _resolveRange() {
    const e = this._roundedNow();
    return this._filter.timePreset === "24h" ? pe(
      {
        ...this._config,
        start_time: void 0,
        end_time: e.toISOString(),
        hours_to_show: 24
      },
      e
    ) : this._filter.timePreset === "7d" ? pe(
      {
        ...this._config,
        start_time: void 0,
        end_time: e.toISOString(),
        hours_to_show: 24 * 7
      },
      e
    ) : pe(this._config, e);
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
    return this._config.debug && this._debugLegacyView ? "legacy_swimlane" : sr(this._config, this._showAllRows);
  }
  _shouldUseInventoryDrawer() {
    return this._currentRendererMode() === "activity" && this._showAllRows === !1 && this._config.area_inventory_mode !== "expanded" && this._dashboardModel?.singleAreaFocused !== !0;
  }
  _resetInventoryExpansion() {
    this._showAllRows = !1, this._expandedInventoryGroups.clear(), this._collapsedInventoryGroups.clear(), this._openInventoryAreaId = void 0;
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
function dt(t) {
  return Object.values(t).reduce(
    (e, a) => e + a.length,
    0
  );
}
function lr(t) {
  return t.map((e) => "entity" in e ? e.entity.entity_id : e.entity_id).sort().join("|");
}
customElements.get("activity-history-card") || customElements.define("activity-history-card", cr);
window.customCards = window.customCards || [];
window.customCards.some((t) => t.type === "activity-history-card") || window.customCards.push({
  type: "activity-history-card",
  name: "Activity History Card",
  description: "RTL/mobile-friendly Home Assistant activity history timeline",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/activity-history-card"
});
export {
  cr as ActivityHistoryCard
};
//# sourceMappingURL=activity-history-card.js.map
