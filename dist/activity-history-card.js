/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const V = globalThis, ne = V.ShadowRoot && (V.ShadyCSS === void 0 || V.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, oe = Symbol(), he = /* @__PURE__ */ new WeakMap();
let Le = class {
  constructor(e, i, a) {
    if (this._$cssResult$ = !0, a !== oe) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ne && e === void 0) {
      const a = i !== void 0 && i.length === 1;
      a && (e = he.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), a && he.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const Je = (t) => new Le(typeof t == "string" ? t : t + "", void 0, oe), Oe = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((a, s, r) => a + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + t[r + 1], t[0]);
  return new Le(i, t, oe);
}, Xe = (t, e) => {
  if (ne) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const a = document.createElement("style"), s = V.litNonce;
    s !== void 0 && a.setAttribute("nonce", s), a.textContent = i.cssText, t.appendChild(a);
  }
}, ue = ne ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const a of e.cssRules) i += a.cssText;
  return Je(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Ze, defineProperty: Qe, getOwnPropertyDescriptor: et, getOwnPropertyNames: tt, getOwnPropertySymbols: it, getPrototypeOf: at } = Object, X = globalThis, _e = X.trustedTypes, st = _e ? _e.emptyScript : "", rt = X.reactiveElementPolyfillSupport, O = (t, e) => t, se = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? st : null;
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
} }, Fe = (t, e) => !Ze(t, e), pe = { attribute: !0, type: String, converter: se, reflect: !1, useDefault: !1, hasChanged: Fe };
Symbol.metadata ??= Symbol("metadata"), X.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let z = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ??= []).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = pe) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const a = Symbol(), s = this.getPropertyDescriptor(e, a, i);
      s !== void 0 && Qe(this.prototype, e, s);
    }
  }
  static getPropertyDescriptor(e, i, a) {
    const { get: s, set: r } = et(this.prototype, e) ?? { get() {
      return this[i];
    }, set(n) {
      this[i] = n;
    } };
    return { get: s, set(n) {
      const c = s?.call(this);
      r?.call(this, n), this.requestUpdate(e, c, a);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? pe;
  }
  static _$Ei() {
    if (this.hasOwnProperty(O("elementProperties"))) return;
    const e = at(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(O("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(O("properties"))) {
      const i = this.properties, a = [...tt(i), ...it(i)];
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
      for (const s of a) i.unshift(ue(s));
    } else e !== void 0 && i.push(ue(e));
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
    return Xe(e, this.constructor.elementStyles), e;
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
      const r = (a.converter?.toAttribute !== void 0 ? a.converter : se).toAttribute(i, a.type);
      this._$Em = e, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(e, i) {
    const a = this.constructor, s = a._$Eh.get(e);
    if (s !== void 0 && this._$Em !== s) {
      const r = a.getPropertyOptions(s), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : se;
      this._$Em = s;
      const c = n.fromAttribute(i, r.type);
      this[s] = c ?? this._$Ej?.get(s) ?? c, this._$Em = null;
    }
  }
  requestUpdate(e, i, a, s = !1, r) {
    if (e !== void 0) {
      const n = this.constructor;
      if (s === !1 && (r = this[e]), a ??= n.getPropertyOptions(e), !((a.hasChanged ?? Fe)(r, i) || a.useDefault && a.reflect && r === this._$Ej?.get(e) && !this.hasAttribute(n._$Eu(e, a)))) return;
      this.C(e, i, a);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: a, reflect: s, wrapped: r }, n) {
    a && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, n ?? i ?? this[e]), r !== !0 || n !== void 0) || (this._$AL.has(e) || (this.hasUpdated || a || (i = void 0), this._$AL.set(e, i)), s === !0 && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
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
      const a = this.constructor.elementProperties;
      if (a.size > 0) for (const [s, r] of a) {
        const { wrapped: n } = r, c = this[s];
        n !== !0 || this._$AL.has(s) || c === void 0 || this.C(s, void 0, r, c);
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
z.elementStyles = [], z.shadowRootOptions = { mode: "open" }, z[O("elementProperties")] = /* @__PURE__ */ new Map(), z[O("finalized")] = /* @__PURE__ */ new Map(), rt?.({ ReactiveElement: z }), (X.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ce = globalThis, ge = (t) => t, J = ce.trustedTypes, me = J ? J.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, Ue = "$lit$", $ = `lit$${Math.random().toFixed(9).slice(2)}$`, Ie = "?" + $, nt = `<${Ie}>`, C = document, U = () => C.createComment(""), I = (t) => t === null || typeof t != "object" && typeof t != "function", le = Array.isArray, ot = (t) => le(t) || typeof t?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, L = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, fe = /-->/g, be = />/g, A = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ve = /'/g, ye = /"/g, Be = /^(?:script|style|textarea|title)$/i, ct = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), _ = ct(1), H = Symbol.for("lit-noChange"), g = Symbol.for("lit-nothing"), xe = /* @__PURE__ */ new WeakMap(), S = C.createTreeWalker(C, 129);
function Ne(t, e) {
  if (!le(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return me !== void 0 ? me.createHTML(e) : e;
}
const lt = (t, e) => {
  const i = t.length - 1, a = [];
  let s, r = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", n = L;
  for (let c = 0; c < i; c++) {
    const o = t[c];
    let l, d, u = -1, h = 0;
    for (; h < o.length && (n.lastIndex = h, d = n.exec(o), d !== null); ) h = n.lastIndex, n === L ? d[1] === "!--" ? n = fe : d[1] !== void 0 ? n = be : d[2] !== void 0 ? (Be.test(d[2]) && (s = RegExp("</" + d[2], "g")), n = A) : d[3] !== void 0 && (n = A) : n === A ? d[0] === ">" ? (n = s ?? L, u = -1) : d[1] === void 0 ? u = -2 : (u = n.lastIndex - d[2].length, l = d[1], n = d[3] === void 0 ? A : d[3] === '"' ? ye : ve) : n === ye || n === ve ? n = A : n === fe || n === be ? n = L : (n = A, s = void 0);
    const p = n === A && t[c + 1].startsWith("/>") ? " " : "";
    r += n === L ? o + nt : u >= 0 ? (a.push(l), o.slice(0, u) + Ue + o.slice(u) + $ + p) : o + $ + (u === -2 ? c : p);
  }
  return [Ne(t, r + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), a];
};
class B {
  constructor({ strings: e, _$litType$: i }, a) {
    let s;
    this.parts = [];
    let r = 0, n = 0;
    const c = e.length - 1, o = this.parts, [l, d] = lt(e, i);
    if (this.el = B.createElement(l, a), S.currentNode = this.el.content, i === 2 || i === 3) {
      const u = this.el.content.firstChild;
      u.replaceWith(...u.childNodes);
    }
    for (; (s = S.nextNode()) !== null && o.length < c; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const u of s.getAttributeNames()) if (u.endsWith(Ue)) {
          const h = d[n++], p = s.getAttribute(u).split($), f = /([.?@])?(.*)/.exec(h);
          o.push({ type: 1, index: r, name: f[2], strings: p, ctor: f[1] === "." ? ht : f[1] === "?" ? ut : f[1] === "@" ? _t : Z }), s.removeAttribute(u);
        } else u.startsWith($) && (o.push({ type: 6, index: r }), s.removeAttribute(u));
        if (Be.test(s.tagName)) {
          const u = s.textContent.split($), h = u.length - 1;
          if (h > 0) {
            s.textContent = J ? J.emptyScript : "";
            for (let p = 0; p < h; p++) s.append(u[p], U()), S.nextNode(), o.push({ type: 2, index: ++r });
            s.append(u[h], U());
          }
        }
      } else if (s.nodeType === 8) if (s.data === Ie) o.push({ type: 2, index: r });
      else {
        let u = -1;
        for (; (u = s.data.indexOf($, u + 1)) !== -1; ) o.push({ type: 7, index: r }), u += $.length - 1;
      }
      r++;
    }
  }
  static createElement(e, i) {
    const a = C.createElement("template");
    return a.innerHTML = e, a;
  }
}
function M(t, e, i = t, a) {
  if (e === H) return e;
  let s = a !== void 0 ? i._$Co?.[a] : i._$Cl;
  const r = I(e) ? void 0 : e._$litDirective$;
  return s?.constructor !== r && (s?._$AO?.(!1), r === void 0 ? s = void 0 : (s = new r(t), s._$AT(t, i, a)), a !== void 0 ? (i._$Co ??= [])[a] = s : i._$Cl = s), s !== void 0 && (e = M(t, s._$AS(t, e.values), s, a)), e;
}
class dt {
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
    const { el: { content: i }, parts: a } = this._$AD, s = (e?.creationScope ?? C).importNode(i, !0);
    S.currentNode = s;
    let r = S.nextNode(), n = 0, c = 0, o = a[0];
    for (; o !== void 0; ) {
      if (n === o.index) {
        let l;
        o.type === 2 ? l = new q(r, r.nextSibling, this, e) : o.type === 1 ? l = new o.ctor(r, o.name, o.strings, this, e) : o.type === 6 && (l = new pt(r, this, e)), this._$AV.push(l), o = a[++c];
      }
      n !== o?.index && (r = S.nextNode(), n++);
    }
    return S.currentNode = C, s;
  }
  p(e) {
    let i = 0;
    for (const a of this._$AV) a !== void 0 && (a.strings !== void 0 ? (a._$AI(e, a, i), i += a.strings.length - 2) : a._$AI(e[i])), i++;
  }
}
class q {
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
    e = M(this, e, i), I(e) ? e === g || e == null || e === "" ? (this._$AH !== g && this._$AR(), this._$AH = g) : e !== this._$AH && e !== H && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : ot(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== g && I(this._$AH) ? this._$AA.nextSibling.data = e : this.T(C.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    const { values: i, _$litType$: a } = e, s = typeof a == "number" ? this._$AC(e) : (a.el === void 0 && (a.el = B.createElement(Ne(a.h, a.h[0]), this.options)), a);
    if (this._$AH?._$AD === s) this._$AH.p(i);
    else {
      const r = new dt(s, this), n = r.u(this.options);
      r.p(i), this.T(n), this._$AH = r;
    }
  }
  _$AC(e) {
    let i = xe.get(e.strings);
    return i === void 0 && xe.set(e.strings, i = new B(e)), i;
  }
  k(e) {
    le(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let a, s = 0;
    for (const r of e) s === i.length ? i.push(a = new q(this.O(U()), this.O(U()), this, this.options)) : a = i[s], a._$AI(r), s++;
    s < i.length && (this._$AR(a && a._$AB.nextSibling, s), i.length = s);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    for (this._$AP?.(!1, !0, i); e !== this._$AB; ) {
      const a = ge(e).nextSibling;
      ge(e).remove(), e = a;
    }
  }
  setConnected(e) {
    this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
  }
}
class Z {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, a, s, r) {
    this.type = 1, this._$AH = g, this._$AN = void 0, this.element = e, this.name = i, this._$AM = s, this.options = r, a.length > 2 || a[0] !== "" || a[1] !== "" ? (this._$AH = Array(a.length - 1).fill(new String()), this.strings = a) : this._$AH = g;
  }
  _$AI(e, i = this, a, s) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) e = M(this, e, i, 0), n = !I(e) || e !== this._$AH && e !== H, n && (this._$AH = e);
    else {
      const c = e;
      let o, l;
      for (e = r[0], o = 0; o < r.length - 1; o++) l = M(this, c[a + o], i, o), l === H && (l = this._$AH[o]), n ||= !I(l) || l !== this._$AH[o], l === g ? e = g : e !== g && (e += (l ?? "") + r[o + 1]), this._$AH[o] = l;
    }
    n && !s && this.j(e);
  }
  j(e) {
    e === g ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class ht extends Z {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === g ? void 0 : e;
  }
}
class ut extends Z {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== g);
  }
}
class _t extends Z {
  constructor(e, i, a, s, r) {
    super(e, i, a, s, r), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = M(this, e, i, 0) ?? g) === H) return;
    const a = this._$AH, s = e === g && a !== g || e.capture !== a.capture || e.once !== a.once || e.passive !== a.passive, r = e !== g && (a === g || s);
    s && this.element.removeEventListener(this.name, this, a), r && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class pt {
  constructor(e, i, a) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = a;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    M(this, e);
  }
}
const gt = ce.litHtmlPolyfillSupport;
gt?.(B, q), (ce.litHtmlVersions ??= []).push("3.3.3");
const mt = (t, e, i) => {
  const a = i?.renderBefore ?? e;
  let s = a._$litPart$;
  if (s === void 0) {
    const r = i?.renderBefore ?? null;
    a._$litPart$ = s = new q(e.insertBefore(U(), r), r, void 0, i ?? {});
  }
  return s._$AI(t), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const de = globalThis;
class R extends z {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const e = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= e.firstChild, e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = mt(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return H;
  }
}
R._$litElement$ = !0, R.finalized = !0, de.litElementHydrateSupport?.({ LitElement: R });
const ft = de.litElementPolyfillSupport;
ft?.({ LitElement: R });
(de.litElementVersions ??= []).push("4.2.2");
const bt = {
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
}, vt = {
  climate: {
    hvac_action: ["cooling", "heating", "drying", "fan"]
  }
}, k = {
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
  refresh_interval_seconds: 300,
  min_duration_seconds: 20,
  merge_gap_seconds: 15,
  max_visible_rows: 80,
  collapse_groups: !1,
  timeline_height: "min(62svh, 680px)",
  mobile_breakpoint: 760
}, D = {
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
}, W = [
  "light",
  "switch",
  "climate",
  "media_player",
  "cover",
  "fan"
], N = {
  on: "דלוק",
  off: "כבוי",
  cooling: "קירור",
  heating: "חימום",
  playing: "מנגן",
  opening: "פתוח",
  closing: "נסגר",
  idle: "המתנה",
  unknown: "לא ידוע"
}, yt = ["ar", "fa", "he", "iw", "ur"];
function j(t) {
  return t.includes(".") ? t.split(".")[0] ?? t : t;
}
function ee(t, e = /* @__PURE__ */ new Date()) {
  if (t.start_time) {
    const r = new Date(t.start_time), n = t.end_time ? new Date(t.end_time) : e;
    return { start: r, end: n };
  }
  const i = t.hours_to_show ?? 24, a = t.end_time ? new Date(t.end_time) : e;
  return { start: new Date(a.getTime() - i * 60 * 60 * 1e3), end: a };
}
function xt(t, e) {
  if (t === !0 || t === "rtl") return !0;
  if (t === !1 || t === "ltr") return !1;
  const i = (e || document.documentElement.lang || navigator.language || "").toLowerCase();
  return yt.some((a) => i === a || i.startsWith(`${a}-`));
}
function T(t) {
  if (!Number.isFinite(t) || t <= 0) return "0 דק׳";
  const e = Math.round(t / 6e4), i = Math.floor(e / 60), a = e % 60;
  return i && a ? `${i}:${String(a).padStart(2, "0")} שעות` : i ? `${i} שעות` : `${a} דק׳`;
}
function w(t) {
  return new Intl.DateTimeFormat("he-IL", { hour: "2-digit", minute: "2-digit" }).format(t);
}
function wt(t, e, i) {
  return Math.min(i, Math.max(e, t));
}
function Y(t, e) {
  const i = e.end.getTime() - e.start.getTime();
  return i <= 0 ? 0 : wt((t.getTime() - e.start.getTime()) / i * 100, 0, 100);
}
function $t(t) {
  const [, e = t] = t.split(".");
  return e.replace(/_/g, " ");
}
function we(t, e = !1) {
  return t ? [t.entity.area, D[t.entity.domain] ?? t.entity.domain, e ? t.entity.entity_id : void 0].filter(Boolean).join(" · ") : "אין מספיק נתונים";
}
function kt(t, e, i = !1) {
  const a = [
    ["רכיב", t.entity.name],
    ["אזור", t.entity.area ?? "ללא אזור"],
    ["סוג", D[t.entity.domain] ?? t.entity.domain],
    ["מצב", N[e.category] ?? e.state],
    ["התחלה", w(e.start)],
    ["סיום", w(e.end)],
    ["משך", T(e.durationMs)]
  ];
  return i && a.push(["entity_id", t.entity.entity_id]), a;
}
const $e = /* @__PURE__ */ new WeakMap();
async function At(t, e) {
  const i = t.entities ?? [], a = e ? await zt(e) : Rt(), s = i.map((c) => typeof c == "string" ? { entity: c } : c);
  let r = !1;
  if (!s.length && e && t.auto_discover !== !1) {
    const c = St(t, e, a);
    r = c.fallbackUsed, s.push(...c.entities);
  }
  return {
    entities: s.filter((c) => c.entity && !c.hidden).map((c) => Ct(c, t, e, a)).filter((c) => !!c).filter((c) => qe(c.labels ?? [], t, a.labels)),
    diagnostics: Tt(a, r, t)
  };
}
function St(t, e, i) {
  const a = t.domains?.length ? t.domains : W, s = E(t.exclude_domains ?? []), r = E(t.areas ?? []), n = [];
  if (i.entities.length) {
    const c = Ae(i.areas, "area_id"), o = Ae(i.devices, "id");
    for (const l of i.entities) {
      if (l.disabled_by || l.hidden_by || !e.states[l.entity_id] || je(l)) continue;
      const d = j(l.entity_id);
      if (s.has(v(d)) || a.length && !a.includes(d) || !re(l.entity_id, t)) continue;
      const u = l.device_id ? o.get(l.device_id) : void 0;
      if (u?.disabled_by) continue;
      const h = l.area_id || u?.area_id || void 0;
      if (!h) continue;
      const p = c.get(h), f = p?.name ?? h;
      if (r.size && !r.has(v(h)) && !r.has(v(f))) continue;
      const b = Ke(l.labels, u?.labels, p?.labels);
      qe(b, t, i.labels) && n.push({
        entity: l.entity_id,
        name: l.name ?? l.original_name ?? void 0,
        area: f,
        domain: d
      });
    }
    return { entities: n, fallbackUsed: !1 };
  }
  for (const [c, o] of Object.entries(e.states)) {
    const l = j(c);
    if (s.has(v(l)) || a.length && !a.includes(l) || !re(c, t)) continue;
    const d = F(o.attributes.area) ?? F(o.attributes.area_id);
    d && (r.size && !r.has(v(d)) || n.push({ entity: c, area: d, domain: l }));
  }
  return { entities: n, fallbackUsed: !0 };
}
function Ct(t, e, i, a) {
  const s = i?.states[t.entity], r = a.entities.find((y) => y.entity_id === t.entity);
  if (r?.disabled_by || r?.hidden_by || r && je(r)) return;
  const n = r?.device_id ? a.devices.find((y) => y.id === r.device_id) : void 0;
  if (n?.disabled_by) return;
  const c = t.area ? void 0 : r?.area_id || n?.area_id || void 0, o = t.area ?? Ht(c, a) ?? F(s?.attributes?.area) ?? F(s?.attributes?.area_id);
  if (e.areas?.length && (!o || !Mt(o, c, e.areas))) return;
  const l = t.domain ?? j(t.entity);
  if (!Et(t.entity, l, e)) return;
  const d = Ke(
    r?.labels,
    n?.labels,
    c ? a.areas.find((y) => y.area_id === c)?.labels : void 0
  ), u = s ? i?.formatEntityName?.(s) : void 0, h = s?.attributes?.friendly_name, p = r?.name ?? r?.original_name ?? void 0, f = typeof u == "string" && u.trim() ? u : void 0, b = typeof h == "string" && h.trim() ? h : void 0;
  return {
    entity_id: t.entity,
    name: t.name ?? f ?? b ?? p ?? $t(t.entity),
    area: o,
    area_id: c,
    domain: l,
    icon: t.icon ?? F(s?.attributes?.icon),
    labels: d,
    config: t
  };
}
function Et(t, e, i) {
  return i.domains?.length && !E(i.domains).has(v(e)) || E(i.exclude_domains ?? []).has(v(e)) ? !1 : re(t, i);
}
function re(t, e) {
  const i = e.include_entity_globs ?? [], a = [...e.exclude_entities ?? [], ...e.exclude_entity_globs ?? []];
  return !(i.length && !i.some((s) => ke(s).test(t)) || a.length && a.some((s) => ke(s).test(t)));
}
function je(t) {
  return t.entity_category === "config" || t.entity_category === "diagnostic";
}
function qe(t, e, i) {
  const a = Dt(t, i), s = E(e.include_labels ?? []), r = E(e.exclude_labels ?? []);
  return !(r.size && [...r].some((n) => a.has(n)) || s.size && ![...s].some((n) => a.has(n)));
}
async function zt(t) {
  const e = $e.get(t);
  if (e) return e;
  const i = Promise.all([
    K(t, "config/area_registry/list"),
    K(t, "config/device_registry/list"),
    K(t, "config/entity_registry/list"),
    K(t, "config/label_registry/list")
  ]).then(([a, s, r, n]) => ({
    areas: a.items,
    devices: s.items,
    entities: r.items,
    labels: n.items,
    areaRegistryAvailable: a.available,
    deviceRegistryAvailable: s.available,
    entityRegistryAvailable: r.available,
    labelRegistryAvailable: n.available
  }));
  return $e.set(t, i), i;
}
async function K(t, e) {
  try {
    const i = await t.callWS({ type: e });
    return { items: Array.isArray(i) ? i : [], available: Array.isArray(i) };
  } catch {
    return { items: [], available: !1 };
  }
}
function Rt() {
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
function Tt(t, e, i) {
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
function Ht(t, e) {
  if (t)
    return e.areas.find((i) => i.area_id === t)?.name ?? t;
}
function Mt(t, e, i) {
  const a = E(i);
  return a.has(v(t)) || !!(e && a.has(v(e)));
}
function Dt(t, e) {
  const i = new Map(e.map((s) => [s.label_id, s.name])), a = /* @__PURE__ */ new Set();
  for (const s of t) {
    a.add(v(s));
    const r = i.get(s);
    r && a.add(v(r));
  }
  return a;
}
function Ke(...t) {
  return [...new Set(t.flatMap((e) => e ?? []))];
}
function ke(t) {
  const e = t.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*");
  return new RegExp(`^${e}$`);
}
function Ae(t, e) {
  return new Map(t.map((i) => [i[e], i]));
}
function E(t) {
  return new Set(t.map(v).filter(Boolean));
}
function v(t) {
  return t.trim().toLowerCase();
}
function F(t) {
  return typeof t == "string" && t.trim() ? t : void 0;
}
function Se(t, e) {
  const i = e.search.trim().toLowerCase();
  return t.filter((a) => {
    const { entity: s } = a;
    if (e.areas.length && (!s.area || !e.areas.includes(s.area)) || e.domains.length && !e.domains.includes(s.domain) || i && ![s.entity_id, s.name, s.area, s.domain].filter(Boolean).join(" ").toLowerCase().includes(i) || e.stateMode === "active_only" && a.totalActiveMs <= 0) return !1;
    if (e.stateMode === "currently_active") {
      const r = Date.now();
      if (!a.segments.some((n) => n.active && n.start.getTime() <= r && n.end.getTime() >= r - 9e4)) return !1;
    }
    return !0;
  });
}
function Pt(t, e) {
  if (e === "none" || e === "entity")
    return [Ce("all", "כל הרכיבים", t)];
  const i = /* @__PURE__ */ new Map();
  for (const a of t) {
    const s = e === "area" ? a.entity.area || "ללא אזור" : a.entity.domain || "other", r = i.get(s) ?? [];
    r.push(a), i.set(s, r);
  }
  return [...i.entries()].map(([a, s]) => Ce(a, e === "domain" ? D[a] ?? a : a, s));
}
function Ce(t, e, i) {
  const a = i.reduce((s, r) => s + r.totalActiveMs, 0);
  return {
    id: t,
    title: e,
    subtitle: `${i.length} רכיבים`,
    rows: i,
    totalActiveMs: a
  };
}
function Lt(t) {
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
function Ee(t) {
  return t.config?.attributes?.length || t.config?.active_attributes && Object.keys(t.config.active_attributes).length ? !0 : ["climate", "humidifier", "water_heater"].includes(t.domain);
}
async function Ot(t, e, i, a) {
  const { withAttributes: s, withoutAttributes: r } = Ge(e), n = await Promise.all([
    r.length ? ze(t, r, i, a, !0) : Promise.resolve({}),
    s.length ? ze(t, s, i, a, !1) : Promise.resolve({})
  ]);
  return Object.assign({}, ...n);
}
function Ge(t) {
  return {
    withAttributes: t.filter(Ee),
    withoutAttributes: t.filter((e) => !Ee(e))
  };
}
async function ze(t, e, i, a, s) {
  const r = e.map((c) => c.entity_id), n = await t.callWS({
    type: "history/history_during_period",
    entity_ids: r,
    start_time: i.start.toISOString(),
    end_time: i.end.toISOString(),
    minimal_response: a.minimal_response ?? !0,
    significant_changes_only: a.significant_changes_only ?? !0,
    no_attributes: s
  });
  return Ft(n, r);
}
function Ft(t, e) {
  const i = {};
  if (Array.isArray(t))
    return t.forEach((a, s) => {
      if (!Array.isArray(a)) return;
      const r = e[s], n = Re(a, r), c = n[0]?.entity_id ?? r;
      c && (i[c] = n);
    }), i;
  if (t && typeof t == "object")
    for (const [a, s] of Object.entries(t))
      Array.isArray(s) && (i[a] = Re(s, a));
  return i;
}
function Re(t, e) {
  let i = e;
  return t.map((a) => {
    if (!a || typeof a != "object") return;
    const s = a, r = x(s.entity_id) ?? i;
    r && (i = r);
    const n = x(s.last_changed) ?? x(s.lc) ?? x(s.last_updated) ?? x(s.lu), c = x(s.state) ?? x(s.s);
    if (!r || !c || !n) return;
    const o = Te(s.attributes) ?? Te(s.a), l = {
      entity_id: r,
      state: c,
      last_changed: n
    };
    o && (l.attributes = o);
    const d = x(s.last_updated) ?? x(s.lu);
    return d && (l.last_updated = d), l;
  }).filter((a) => a !== void 0);
}
function x(t) {
  return typeof t == "string" ? t : void 0;
}
function Te(t) {
  return t && typeof t == "object" && !Array.isArray(t) ? t : void 0;
}
function He(t, e, i, a, s = {}) {
  return e.map((r) => {
    const n = Ut(t[r.entity_id] ?? [], s[r.entity_id], i, r.entity_id).filter((d) => d.state != null && d.last_changed).sort((d, u) => new Date(d.last_changed).getTime() - new Date(u.last_changed).getTime()), c = Nt(n), o = Bt(c, r, i, a), l = o.filter((d) => d.active);
    return {
      entity: r,
      segments: o,
      totalActiveMs: l.reduce((d, u) => d + u.durationMs, 0),
      eventCount: l.length,
      currentState: o.at(-1)?.state,
      currentCategory: o.at(-1)?.category
    };
  });
}
function Ut(t, e, i, a) {
  const s = [...t];
  if (!e) return s;
  const r = new Date(e.last_changed || e.last_updated).getTime(), n = Number.isFinite(r) ? Math.min(Math.max(r, i.start.getTime()), i.end.getTime()) : i.start.getTime(), c = s.filter((o) => o.entity_id === a).sort((o, l) => new Date(o.last_changed).getTime() - new Date(l.last_changed).getTime()).at(-1);
  return (!c || new Date(c.last_changed).getTime() < n || c.state !== e.state) && s.push({
    entity_id: a,
    state: e.state,
    attributes: e.attributes,
    last_changed: new Date(n).toISOString(),
    last_updated: e.last_updated
  }), s;
}
function It(t, e, i) {
  if (e === "unknown" || e === "unavailable") return { category: "unknown", active: !1 };
  const a = t.domain || j(t.entity_id), r = t.config?.active_states ?? bt[a] ?? ["on"], n = t.config?.active_attributes ?? vt[a] ?? {};
  if (a === "climate" && !t.config?.active_states) {
    const o = i?.hvac_action;
    if (typeof o == "string" && o.trim()) {
      const l = n.hvac_action ?? [];
      return { category: te(a, o), active: l.includes(o) };
    }
  }
  for (const [o, l] of Object.entries(n)) {
    const d = i?.[o];
    if (typeof d == "string" && l.includes(d))
      return { category: te(a, d), active: !0 };
  }
  const c = r.includes(e);
  return { category: te(a, e), active: c };
}
function Bt(t, e, i, a) {
  if (!t.length) return [];
  const s = [], r = i.start.getTime(), n = i.end.getTime();
  for (let o = 0; o < t.length; o += 1) {
    const l = t[o];
    if (!l) continue;
    const d = t[o + 1], u = new Date(l.last_changed).getTime(), h = d ? new Date(d.last_changed).getTime() : n, p = Math.max(u, r), f = Math.min(h, n);
    if (f <= p) continue;
    const b = It(e, l.state, l.attributes), y = f - p;
    s.push({
      entity_id: e.entity_id,
      state: l.state,
      category: b.category,
      active: b.active,
      start: new Date(p),
      end: new Date(f),
      durationMs: y,
      attributes: l.attributes
    });
  }
  return jt(s, a.merge_gap_seconds ?? 0).filter((o) => !o.active || !a.min_duration_seconds || o.durationMs >= a.min_duration_seconds * 1e3);
}
function Nt(t) {
  const e = [];
  for (const i of t) {
    const a = e.at(-1);
    a && a.state === i.state && Me(a) === Me(i) || e.push(i);
  }
  return e;
}
function Me(t) {
  const e = t.attributes ?? {}, i = {
    hvac_action: e.hvac_action,
    temperature: e.temperature,
    current_temperature: e.current_temperature,
    media_title: e.media_title
  };
  return JSON.stringify(i);
}
function jt(t, e) {
  if (!t.length) return t;
  const i = Math.max(0, e) * 1e3, a = [];
  for (const s of t) {
    const r = a.at(-1);
    r && r.entity_id === s.entity_id && r.category === s.category && r.state === s.state && s.start.getTime() - r.end.getTime() <= i ? (r.end = s.end, r.durationMs = r.end.getTime() - r.start.getTime()) : a.push({ ...s });
  }
  return a;
}
function te(t, e) {
  return e === "unknown" || e === "unavailable" ? "unknown" : ["off", "closed", "idle", "paused", "standby"].includes(e) ? e === "idle" ? "idle" : "off" : ["cool", "cooling"].includes(e) ? "cooling" : ["heat", "heating"].includes(e) ? "heating" : ["playing"].includes(e) ? "playing" : ["opening", "open"].includes(e) ? "opening" : ["closing"].includes(e) ? "closing" : t === "climate" && ["drying", "fan", "fan_only", "dry"].includes(e) ? "idle" : "on";
}
const Ve = [
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
function qt() {
  return Ve.map((t) => ({
    entity_id: t.entity_id,
    name: t.name,
    area: t.area,
    domain: t.domain,
    icon: t.icon,
    config: { entity: t.entity_id, name: t.name, area: t.area }
  }));
}
function Kt(t) {
  const e = {}, i = t.end.getTime();
  for (const a of Ve) {
    const s = [
      ie(a.entity_id, "off", t.start.getTime(), void 0)
    ];
    for (const r of a.pattern) {
      const n = i + r.startHour * 36e5, c = i + r.endHour * 36e5;
      c <= t.start.getTime() || n >= t.end.getTime() || (s.push(ie(a.entity_id, r.state, Math.max(n, t.start.getTime()), r.attributes)), s.push(ie(a.entity_id, "off", Math.min(c, t.end.getTime()), void 0)));
    }
    e[a.entity_id] = s.sort((r, n) => new Date(r.last_changed).getTime() - new Date(n.last_changed).getTime()).filter((r, n, c) => n === 0 || r.last_changed !== c[n - 1]?.last_changed);
  }
  return e;
}
function ie(t, e, i, a) {
  return {
    entity_id: t,
    state: e,
    attributes: a,
    last_changed: new Date(i).toISOString(),
    last_updated: new Date(i).toISOString()
  };
}
function Gt(t, e, i = 320, a = 220) {
  if (e.width <= 640)
    return { x: 12, y: Math.max(12, e.height - a - 12), placement: "bottom" };
  const s = 16, r = t.left + t.width / 2 - i / 2, n = t.top + t.height + 12, c = De(r, s, e.width - i - s), o = De(n, s, e.height - a - s);
  return { x: c, y: o, placement: "floating" };
}
function De(t, e, i) {
  return i < e ? e : Math.min(i, Math.max(e, t));
}
function We(t) {
  return !Number.isFinite(t) || !t ? 300 : Math.max(30, Math.floor(t));
}
function Vt(t) {
  if (!t.hasFetchedOnce) return !0;
  if (!t.live) return !1;
  const e = We(t.refreshIntervalSeconds) * 1e3;
  return t.now - t.lastHistoryFetchAt >= e;
}
function Wt() {
  return _`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">קורלציות</h3><p>מצב קורלציה ויומן אירועים יפותח בשלב הבא.</p></div></div>`;
}
function Yt() {
  return _`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">פירוט רכיב</h3><p>מסך Drill-down לרכיב יפותח אחרי תצוגת Swimlane.</p></div></div>`;
}
function Jt() {
  return _`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">Heatmap</h3><p>מצב זה יפותח אחרי ה-MVP.</p></div></div>`;
}
function Xt(t) {
  return t > 70 ? "ultra-dense" : t > 30 ? "dense" : "normal";
}
function Zt(t, e) {
  const i = t.reduce((c, o) => c + o.rows.length, 0);
  let s = Number.isFinite(e) && e && e > 0 ? Math.floor(e) : i;
  const r = [];
  for (const c of t) {
    if (s <= 0) {
      r.push({ ...c, rows: [] });
      continue;
    }
    const o = c.rows.slice(0, s);
    s -= o.length, r.push({ ...c, rows: o });
  }
  const n = r.reduce((c, o) => c + o.rows.length, 0);
  return {
    groups: r,
    totalRowCount: i,
    visibleRowCount: n,
    hiddenRowCount: Math.max(0, i - n),
    density: Xt(n)
  };
}
function Qt(t) {
  const e = Zt(t.groups, t.config.max_visible_rows), i = ii(t.range), a = /* @__PURE__ */ new Date(), s = Y(a, t.range), r = t.config.show_now_line !== !1 && a.getTime() >= t.range.start.getTime() && a.getTime() <= t.range.end.getTime() + 9e4;
  return _`
    <section
      class=${`ahc-timeline-card ahc-timeline-card--${e.density}`}
      aria-label="ציר זמן פעילות"
      style=${t.config.timeline_height ? `--ahc-timeline-height:${t.config.timeline_height}` : ""}
    >
      <div class="ahc-timeline-toolbar">
        <h3 class="ahc-timeline-title">ציר זמן פעילות</h3>
        <span class="ahc__metric-subtitle">
          ${w(t.range.start)} – ${w(t.range.end)}
          ${e.hiddenRowCount ? ` · מציג ${e.visibleRowCount} מתוך ${e.totalRowCount}` : ""}
        </span>
      </div>
      <div class="ahc-timeline-scroll">
        <div class="ahc-timeline">
          <div class="ahc-timeline__axis" aria-hidden="true">
            <div class="ahc-timeline__axis-spacer">רכיב / אזור</div>
            <div class="ahc-timeline__ticks">
              ${i.map(
    (n) => _`<span class="ahc-timeline__tick" style="left:${n.percent}%">${n.label}</span>`
  )}
            </div>
          </div>
          <div class="ahc-timeline__groups">
            ${e.groups.map((n) => {
    const c = ei(n, t.config);
    return _`
                <details class="ahc-group" aria-label=${n.title} ?open=${!c}>
                  <summary class="ahc-group__header">
                    <span class="ahc-group__title">${n.icon ? _`<span>${n.icon}</span>` : null}${n.title}</span>
                    <span class="ahc-group__meta">${T(n.totalActiveMs)} • ${n.subtitle ?? ""}</span>
                  </summary>
                  ${n.rows.map(
      (o) => _`
                      <div class="ahc-row">
                        <div class="ahc-row__label">
                          <span class="ahc-row__icon" aria-hidden="true">${o.entity.icon ?? "●"}</span>
                          <span class="ahc-row__name" title=${t.config.debug ? o.entity.entity_id : o.entity.name}>${o.entity.name}</span>
                          ${o.currentCategory ? _`<span class="ahc-row__state-chip" data-state=${o.currentCategory}>${N[o.currentCategory]}</span>` : null}
                        </div>
                        <div class="ahc-row__track">
                          <svg
                            class="ahc-row__svg"
                            viewBox="0 0 100 32"
                            preserveAspectRatio="none"
                            role="img"
                            aria-label=${`ציר זמן עבור ${o.entity.name}`}
                          >
                            <line class="ahc-row__svg-track" x1="1" x2="99" y1="16" y2="16"></line>
                            ${o.segments.map((l, d) => {
        const u = Y(l.start, t.range), h = Y(l.end, t.range), p = Math.max(0.35, h - u);
        if (!l.active && l.category !== "unknown") return null;
        const f = `${o.entity.name}, ${N[l.category]}, ${w(l.start)} עד ${w(l.end)}, ${T(l.durationMs)}`;
        return _`
                                <rect
                                  class="ahc-segment-svg"
                                  data-category=${l.category}
                                  x=${u}
                                  y="10"
                                  width=${p}
                                  height="12"
                                  rx="6"
                                  tabindex="0"
                                  role="button"
                                  aria-label=${f}
                                  @click=${(b) => t.onSegmentClick?.(b, o.entity.entity_id, d)}
                                  @keydown=${(b) => {
          (b.key === "Enter" || b.key === " ") && (b.preventDefault(), t.onSegmentClick?.(b, o.entity.entity_id, d));
        }}
                                >
                                  <title>${f}</title>
                                </rect>
                              `;
      })}
                          </svg>
                        </div>
                      </div>
                    `
    )}
                  ${n.rows.length ? null : _`<div class="ahc-group__empty">אין שורות גלויות בקבוצה הזו</div>`}
                </details>
              `;
  })}
          </div>
          ${r ? _`<div class="ahc-now-line" style="left:${s}%"><span class="ahc-now-line__label">עכשיו</span></div>` : null}
        </div>
      </div>
      ${t.config.show_legend === !1 ? null : ti()}
    </section>
  `;
}
function ei(t, e) {
  const i = new Set(e.default_collapsed_groups ?? []);
  return i.has(t.id) || i.has(t.title) ? !0 : !!(e.collapse_groups && t.totalActiveMs <= 0);
}
function ti() {
  return _`<div class="ahc-legend" aria-label="מקרא">
    ${[
    ["on", "var(--ahc-on)"],
    ["cooling", "var(--ahc-cooling)"],
    ["heating", "var(--ahc-heating)"],
    ["playing", "var(--ahc-playing)"],
    ["opening", "var(--ahc-opening)"],
    ["off", "var(--ahc-off)"],
    ["unknown", "var(--ahc-unknown)"]
  ].map(
    ([e, i]) => _`<span class="ahc-legend__item"><span class="ahc-legend__swatch" style="--swatch:${i}"></span>${N[e]}</span>`
  )}
  </div>`;
}
function ii(t) {
  const e = Math.max(1, (t.end.getTime() - t.start.getTime()) / 36e5), i = e <= 24 ? 3 : e <= 72 ? 6 : 24, a = [], s = new Date(t.start);
  for (s.setMinutes(0, 0, 0); s < t.end; )
    s >= t.start && a.push({ label: w(s), percent: Y(s, t) }), s.setHours(s.getHours() + i);
  return a.push({ label: w(t.end), percent: 100 }), a;
}
const ai = Oe`
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
  gap: var(--ahc-gap-sm);
  padding: clamp(14px, 1.6vw, 22px);
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
  background: rgba(14, 165, 233, 0.10);
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

/* Summary */
.ahc__summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--ahc-gap-sm);
}

.ahc__metric {
  min-block-size: 82px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--ahc-gap-sm);
  padding: 12px 14px;
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
  font-size: 1.95rem;
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
  grid-template-columns: minmax(0, 1fr) minmax(250px, 300px);
  gap: var(--ahc-gap-md);
  align-items: start;
  max-inline-size: 1920px;
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
  padding: var(--ahc-gap-sm);
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
  background: linear-gradient(180deg, var(--ahc-accent), rgba(37, 99, 235, 0.38));
}

/* Timeline */
.ahc-timeline-card {
  min-inline-size: 0;
  min-block-size: 420px;
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
  max-block-size: var(--ahc-timeline-height, min(62svh, 680px));
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
  position: sticky;
  inset-inline-start: 0;
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
  border-block-end: 1px solid rgba(148, 163, 184, 0.10);
}

.ahc-group:nth-child(even) {
  background: rgba(15, 23, 42, 0.18);
}

.ahc-group__header {
  position: sticky;
  inset-inline-start: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--ahc-gap-sm);
  min-block-size: 56px;
  padding-block: 0;
  padding-inline: var(--ahc-gap-md);
  background: linear-gradient(90deg, rgba(15, 23, 42, 0.78), rgba(30, 41, 59, 0.70));
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
  grid-template-columns: 220px minmax(0, 1fr);
  min-block-size: 40px;
  border-block-start: 1px solid rgba(148, 163, 184, 0.09);
}

.ahc-row:hover {
  background: var(--ahc-row-hover);
}

.ahc-row__label {
  position: sticky;
  inset-inline-start: 0;
  z-index: 2;
  direction: rtl;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: var(--ahc-gap-xs);
  padding-inline: var(--ahc-gap-md) var(--ahc-gap-sm);
  border-inline-end: 1px solid rgba(148, 163, 184, 0.12);
  background: rgba(4, 10, 24, 0.88);
  backdrop-filter: blur(10px);
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
  inline-size: 1px;
  background: linear-gradient(180deg, transparent, var(--ahc-now) 12%, var(--ahc-now) 88%, transparent);
  box-shadow: 0 0 0 1px rgba(96,165,250,0.14), 0 0 18px rgba(96,165,250,0.30);
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
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.14);
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
.ahc-loading {
  display: grid;
  gap: var(--ahc-gap-lg);
  min-block-size: 420px;
  padding: var(--ahc-gap-lg);
  border: 1px solid var(--ahc-border-soft);
  border-radius: var(--ahc-radius-md);
  background: linear-gradient(180deg, rgba(15, 23, 42, 0.64), rgba(2, 6, 23, 0.34));
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
  background: linear-gradient(90deg, rgba(148, 163, 184, 0.12), rgba(56, 189, 248, 0.22), rgba(148, 163, 184, 0.12));
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
  100% { opacity: 0.44; }
  50% { opacity: 1; }
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

.ahc-debug summary {
  cursor: pointer;
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

  .ahc__filter-label {
    min-inline-size: max-content;
  }

  .ahc__summary-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x proximity;
    gap: var(--ahc-gap-sm);
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
    border-radius: 24px;
  }

  .ahc-filter-sheet {
    inset-inline: max(10px, env(safe-area-inset-left)) max(10px, env(safe-area-inset-right));
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

@media (max-width: 420px) {
  .ahc__summary-grid {
    margin-inline: -2px;
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
function G(t) {
  const e = t.flatMap((h) => h.rows), i = e.flatMap((h) => h.segments.filter((p) => p.active)), a = i.reduce((h, p) => h + p.durationMs, 0), s = e.filter((h) => h.totalActiveMs > 0), r = i.length, n = Date.now(), c = e.filter((h) => h.segments.some((p) => p.active && p.start.getTime() <= n && p.end.getTime() >= n - 9e4)).length, o = [...i].sort((h, p) => p.start.getTime() - h.start.getTime())[0], l = o ? e.find((h) => h.entity.entity_id === o.entity_id) : void 0, d = [...s].sort((h, p) => p.totalActiveMs - h.totalActiveMs)[0], u = [...t].filter((h) => h.totalActiveMs > 0).sort((h, p) => p.totalActiveMs - h.totalActiveMs)[0];
  return {
    totalActiveMs: a,
    activeEntityCount: s.length,
    eventCount: r,
    activeNowCount: c,
    lastEvent: o,
    lastEventRow: l,
    mostActiveEntity: d,
    mostActiveArea: u,
    peakBucketLabel: si(i)
  };
}
function si(t) {
  if (!t.length) return;
  const e = new Array(24).fill(0);
  for (const s of t) {
    const r = s.start.getHours();
    e[r] = (e[r] ?? 0) + s.durationMs;
  }
  const i = Math.max(...e), a = e.indexOf(i);
  if (!(a < 0))
    return `${String(a).padStart(2, "0")}:00 – ${String((a + 1) % 24).padStart(2, "0")}:00`;
}
class ri extends R {
  constructor() {
    super(...arguments), this._config = { type: "custom:activity-history-card" }, this._areas = [], this._labels = [], this._domains = W, this._loadedOptions = !1;
  }
  static {
    this.styles = Oe`
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
      hours_to_show: e.hours_to_show ?? k.hours_to_show,
      display_mode: e.display_mode ?? k.display_mode,
      group_by: e.group_by ?? k.group_by
    }, this.requestUpdate();
  }
  set hass(e) {
    this._hass = e, this._loadedOptions || (this._loadedOptions = !0, this._loadOptions());
  }
  render() {
    const e = this._config, i = e.domains?.length ? e.domains : W;
    return _`
      <div class="editor">
        <section class="section">
          <h3>הגדרות כלליות</h3>
          <div class="row">
            <label>
              כותרת
              <input type="text" .value=${e.title ?? k.title} @input=${(a) => this._setValue("title", ae(a))} />
            </label>
            <label>
              טווח שעות
              <input type="number" min="1" max="168" .value=${String(e.hours_to_show ?? 24)} @input=${(a) => this._setNumber("hours_to_show", ae(a))} />
            </label>
          </div>
          <div class="row">
            <label>
              מצב תצוגה
              <select .value=${e.display_mode ?? "panel"} @change=${(a) => this._setValue("display_mode", ae(a))}>
                <option value="card">כרטיס רגיל</option>
                <option value="panel">פאנל</option>
                <option value="fullscreen">מסך מלא</option>
              </select>
            </label>
            <label class="check">
              <input type="checkbox" .checked=${e.mock_data === !0} @change=${(a) => this._setChecked("mock_data", a)} />
              נתוני דוגמה
            </label>
          </div>
          <label class="check">
            <input type="checkbox" .checked=${e.debug === !0} @change=${(a) => this._setChecked("debug", a)} />
            הצג דיאגנוסטיקה
          </label>
          <label class="check">
            <input type="checkbox" .checked=${e.auto_discover !== !1} @change=${(a) => this._setChecked("auto_discover", a)} />
            משוך אוטומטית רכיבים שמשויכים לאזורים
          </label>
          <p class="hint">כאשר האפשרות פעילה ואין רשימת entities ידנית, הכרטיס מאתר ישויות לפי אזורי Home Assistant ומסנן לפי הדומיינים והלייבלים שבחרת.</p>
        </section>

        <section class="section">
          <h3>דומיינים להצגה</h3>
          <div class="check-grid">
            ${this._domains.map((a) => this._renderArrayCheckbox("domains", a, D[a] ?? a, i.includes(a)))}
          </div>
          <p class="hint">אם לא תבחר ידנית, הכרטיס משתמש בדומיינים שימושיים לפעילות כמו תאורה, מתגים, מזגנים, תריסים וחיישנים בינאריים.</p>
        </section>

        <section class="section">
          <h3>אזורים</h3>
          ${this._areas.length ? _`<div class="check-grid">
                ${this._areas.map((a) => this._renderArrayCheckbox("areas", a.name, a.name, (e.areas ?? []).includes(a.name) || (e.areas ?? []).includes(a.area_id)))}
              </div>` : _`<p class="hint">לא נטענו אזורים מה־registry. אפשר עדיין לערוך YAML ידנית.</p>`}
          <p class="hint">אם לא נבחר אזור, יוצגו כל האזורים שיש להם רכיבים מתאימים.</p>
        </section>

        <section class="section">
          <h3>לייבלים</h3>
          ${this._labels.length ? this._renderLabelControls(e) : _`<p class="hint">לא נמצאו labels ב־Home Assistant, או שהגרסה לא תומכת ב־label registry.</p>`}
        </section>
      </div>
    `;
  }
  _renderLabelControls(e) {
    return _`
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
  _renderArrayCheckbox(e, i, a, s) {
    return _`
      <label class="check">
        <input type="checkbox" .checked=${s} @change=${(r) => this._toggleArrayValue(e, i, r)} />
        ${a}
      </label>
    `;
  }
  async _loadOptions() {
    if (!this._hass) return;
    const [e, i] = await Promise.all([this._safeRegistryCall("config/area_registry/list"), this._safeRegistryCall("config/label_registry/list")]), a = [...new Set(Object.keys(this._hass.states).map(j))].filter(Boolean).sort();
    this._areas = e.sort((s, r) => s.name.localeCompare(r.name, "he")), this._labels = i.sort((s, r) => s.name.localeCompare(r.name, "he")), this._domains = [.../* @__PURE__ */ new Set([...W, ...a])].sort(), this.requestUpdate();
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
    Number.isFinite(a) && a > 0 && this._emitConfig({ ...this._config, [e]: a });
  }
  _setChecked(e, i) {
    const a = i.target.checked;
    this._emitConfig({ ...this._config, [e]: a });
  }
  _toggleArrayValue(e, i, a) {
    const s = a.target.checked, r = new Set(this._config[e] ?? []);
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
function ae(t) {
  return t.target.value;
}
customElements.get("activity-history-card-editor") || customElements.define("activity-history-card-editor", ri);
class ni extends R {
  constructor() {
    super(...arguments), this._rows = [], this._groups = [], this._loading = !1, this._fullscreen = !1, this._filterSheetOpen = !1, this._usingMockData = !1, this._fetchToken = 0, this._lastFetchKey = "", this._hasFetchedOnce = !1, this._initialLoad = !1, this._backgroundLoading = !1, this._lastResolvedEntityKey = "", this._lastHistoryFetchAt = 0, this._historyCache = /* @__PURE__ */ new Map(), this._filter = {
      search: "",
      areas: [],
      domains: [],
      stateMode: "all",
      groupBy: "area",
      timePreset: "24h"
    }, this._openSegmentPopover = (e, i, a) => {
      e.preventDefault(), e.stopPropagation();
      const s = this._rows.find((l) => l.entity.entity_id === i), r = s?.segments[a], n = e.currentTarget instanceof Element ? e.currentTarget : void 0;
      if (!s || !r || !n) return;
      const c = n.getBoundingClientRect(), o = Gt(c, { width: window.innerWidth, height: window.innerHeight });
      this._segmentPopover = {
        row: s,
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
      const i = e.target;
      this._filter = { ...this._filter, search: i.value }, this._rebuildGroups();
    }, this._clearFilters = () => {
      const e = this._filter.timePreset, i = this._initialTimePreset(this._config);
      this._filter = {
        search: "",
        areas: [],
        domains: [],
        stateMode: "all",
        groupBy: this._config.group_by ?? "area",
        timePreset: i
      }, this._rebuildGroups(), e !== i && (this._lastFetchKey = "", this._requestHistoryRefresh("range", { force: !0 }));
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
        document.removeEventListener("fullscreenchange", this._onFullscreenChange), this._filterSheetOpen || document.removeEventListener("keydown", this._onDocumentKeyDown), document.fullscreenElement && await document.exitFullscreen().catch(() => {
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
      e.composedPath().some((a) => a instanceof HTMLElement && a.classList.contains("ahc-popover")) || this._segmentPopover && this._closeSegmentPopover();
    }, this._onFullscreenChange = () => {
      !document.fullscreenElement && this._fullscreen && (this._fullscreen = !1, document.removeEventListener("fullscreenchange", this._onFullscreenChange), this._filterSheetOpen || document.removeEventListener("keydown", this._onDocumentKeyDown), this.requestUpdate());
    };
  }
  static {
    this.styles = ai;
  }
  static getConfigElement() {
    return document.createElement("activity-history-card-editor");
  }
  static getStubConfig() {
    return {
      type: "custom:activity-history-card",
      title: k.title,
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
      ...k,
      ...e,
      view_mode: e.view_mode ?? e.default_view ?? "swimlane",
      group_by: e.group_by ?? k.group_by,
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
    }, this._lastFetchKey = "", this._lastResolvedEntityKey = "", this._historyCache.clear(), this._syncRefreshTimer(), this._requestHistoryRefresh(this._hasFetchedOnce ? "config" : "initial", { force: !0 });
  }
  set hass(e) {
    this._hass = e, Vt({
      hasFetchedOnce: this._hasFetchedOnce,
      live: this._config?.live !== !1,
      lastHistoryFetchAt: this._lastHistoryFetchAt,
      now: Date.now(),
      refreshIntervalSeconds: this._refreshIntervalSeconds()
    }) ? this._requestHistoryRefresh(this._hasFetchedOnce ? "interval" : "initial") : this.requestUpdate();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._unsubscribeHistory?.(), this._unsubscribeHistory = void 0, this._fetchToken += 1, this._refreshTimer && window.clearTimeout(this._refreshTimer), this._refreshTimer = void 0, this._inFlightHistoryRequest = void 0, document.removeEventListener("keydown", this._onDocumentKeyDown), document.removeEventListener("fullscreenchange", this._onFullscreenChange), document.removeEventListener("pointerdown", this._onDocumentPointerDown);
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
    if (!this._config) return _``;
    const e = this._hass?.locale?.language ?? this._hass?.language, i = xt(this._config.direction ?? this._config.rtl ?? "auto", e), a = [
      "ahc",
      this._config.display_mode === "panel" ? "ahc--panel" : "",
      this._fullscreen || this._config.display_mode === "fullscreen" ? "ahc--fullscreen" : "",
      this._filterSheetOpen ? "ahc--sheet-open" : "",
      this._usingMockData ? "ahc--mock" : "",
      this._backgroundLoading ? "ahc--background-loading" : "",
      this._rows.length > 70 ? "ahc--ultra-dense" : this._rows.length > 30 ? "ahc--dense" : ""
    ].filter(Boolean).join(" ");
    return _`
      <ha-card class=${a} dir=${i ? "rtl" : "ltr"} tabindex=${this._fullscreen ? "0" : "-1"} aria-busy=${this._initialLoad ? "true" : "false"}>
        ${this._renderHeader()} ${this._renderFilters()} ${this._renderSummary()}
        ${this._config.debug ? this._renderDiagnostics() : g}
        ${this._renderBody()}
        ${this._segmentPopover ? this._renderSegmentPopover() : g}
        ${this._filterSheetOpen ? this._renderFilterSheet() : g}
      </ha-card>
    `;
  }
  _renderBody() {
    const e = this._config.show_insights !== !1;
    return _`
      <div class=${e ? "ahc__body" : "ahc__body ahc__body--no-insights"}>
        <main class="ahc__main">${this._renderMainContent()}</main>
        ${e ? this._renderInsights() : g}
      </div>
    `;
  }
  _renderHeader() {
    const e = `${this._timePresetLabel(this._filter.timePreset)} · ${this._usingMockData ? "נתוני דוגמה" : "נתוני Home Assistant"}`;
    return _`
      <header class="ahc__topbar">
        <div class="ahc__toolbar">
          ${this._config.show_fullscreen_button === !1 ? g : _`
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
          <button class="ahc__button ahc__button--ghost" type="button" @click=${this._manualRefresh} ?disabled=${this._initialLoad || this._backgroundLoading}>
            <span aria-hidden="true">↻</span><span>רענן</span>
          </button>
          ${this._backgroundLoading ? _`<span class="ahc__refresh-indicator" role="status">מעדכן...</span>` : g}
        </div>
        <div class="ahc__title-block">
          <div class="ahc__title-row">
            <span class="ahc__icon-badge" aria-hidden="true">▥</span>
            <h2 class="ahc__title">${this._config.title ?? k.title}</h2>
          </div>
          <p class="ahc__subtitle">${e}</p>
          ${this._renderLastEventPill()}
        </div>
      </header>
    `;
  }
  _renderLastEventPill() {
    const e = this._summary, i = e?.lastEventRow, a = e?.lastEvent;
    return !i || !a ? g : _`
      <div class="ahc-last-event">
        <span class="ahc-last-event__label">אירוע אחרון</span>
        <strong>${i.entity.name}</strong>
        <span>${w(a.start)} · ${N[a.category]} · ${we(i, this._config.debug === !0)}</span>
      </div>
    `;
  }
  _renderFilters() {
    return this._config.filters?.show === !1 ? g : _`
      <section class="ahc__filters" aria-label="מסננים">
        <div class="ahc__filter-row ahc__filter-row--primary">
          <span class="ahc__filter-label">טווח זמן</span>
          ${this._renderChip("24 שעות", this._filter.timePreset === "24h", () => this._setTimePreset("24h"))}
          ${this._renderChip("7 ימים", this._filter.timePreset === "7d", () => this._setTimePreset("7d"))}
          ${this._renderChip("מותאם", this._filter.timePreset === "custom", () => this._setTimePreset("custom"))}
          <span class="ahc__filter-label">קבץ לפי</span>
          <div class="ahc__segmented" aria-label="קיבוץ לפי">
            <button class="ahc__segmented-button" type="button" aria-pressed=${this._filter.groupBy === "area"} @click=${() => this._setGroupBy("area")}>אזור</button>
            <button class="ahc__segmented-button" type="button" aria-pressed=${this._filter.groupBy === "domain"} @click=${() => this._setGroupBy("domain")}>סוג</button>
            <button class="ahc__segmented-button" type="button" aria-pressed=${this._filter.groupBy === "none"} @click=${() => this._setGroupBy("none")}>ללא</button>
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
          <button class="ahc__button ahc__button--primary" type="button" @click=${this._openFilterSheet} aria-expanded=${this._filterSheetOpen ? "true" : "false"}>
            <span aria-hidden="true">▾</span><span>סינון</span>
          </button>
        </div>
      </section>
    `;
  }
  _renderChip(e, i, a) {
    return _`<button class="ahc__chip" type="button" aria-pressed=${i ? "true" : "false"} @click=${a}>${e}</button>`;
  }
  _renderSummary() {
    if (this._config.show_summary === !1) return g;
    const e = this._summary;
    return _`
      <section class="ahc__summary-grid" aria-label="סיכום פעילות">
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">סה״כ שעות־רכיב</span>
            <span class="ahc__metric-value ahc__metric-value--positive">${T(e?.totalActiveMs ?? 0)}</span>
            <span class="ahc__metric-subtitle">סכום פעילות על פני כל הרכיבים</span>
          </div>
          <span class="ahc__metric-icon" aria-hidden="true">◷</span>
        </article>
        <article class="ahc__metric">
          <div class="ahc__metric-copy">
            <span class="ahc__metric-label">רכיבים שפעלו</span>
            <span class="ahc__metric-value">${e?.activeEntityCount ?? 0}</span>
            <span class="ahc__metric-subtitle">מתוך ${this._rows.length} רכיבים שנבחרו</span>
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
            <span class="ahc__metric-label">פעילים עכשיו</span>
            <span class="ahc__metric-value">${e?.activeNowCount ?? 0}</span>
            <span class="ahc__metric-subtitle">רכיבים פעילים</span>
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
      return _`<div class="ahc-state-card"><div><h3 class="ahc-state-card__title">שגיאה בטעינת ההיסטוריה</h3><p>${this._error}</p></div></div>`;
    if (this._emptyReason || !this._groups.length)
      return this._renderEmptyState(this._emptyReason ?? "no_resolved_entities");
    const e = this._resolveRange();
    switch (this._config.view_mode ?? this._config.default_view ?? "swimlane") {
      case "heatmap":
        return Jt();
      case "detail":
        return Yt();
      case "correlation":
        return Wt();
      case "swimlane":
      default:
        return Qt({
          groups: this._groups,
          range: e,
          config: this._config,
          summary: this._summary ?? G(this._groups),
          onSegmentClick: this._openSegmentPopover
        });
    }
  }
  _renderInitialLoading() {
    const e = !this._hass && !this._usingMockData ? "ממתין לחיבור Home Assistant." : "מושך היסטוריה מה-Recorder.";
    return _`
      <section class="ahc-loading" aria-label="טעינת היסטוריה" aria-busy="true">
        <div class="ahc-loading__copy">
          <h3>טוען ציר זמן...</h3>
          <p>${e}</p>
        </div>
        <div class="ahc-loading__timeline" aria-hidden="true">
          ${Array.from({ length: 4 }).map(
      (i, a) => _`
              <div class="ahc-loading__group">
                <span></span>
                ${Array.from({ length: 5 }).map((s, r) => _`<i style="--delay:${a + r}; --width:${42 + (a + r) % 4 * 12}%"></i>`)}
              </div>
            `
    )}
        </div>
      </section>
    `;
  }
  _renderSegmentPopover() {
    const e = this._segmentPopover;
    if (!e) return _``;
    const i = kt(e.row, e.segment, this._config.debug === !0);
    return _`
      <aside
        class="ahc-popover"
        data-placement=${e.placement}
        role="dialog"
        aria-label="פרטי מקטע פעילות"
        style=${`--ahc-popover-x:${e.x}px; --ahc-popover-y:${e.y}px`}
      >
        <button class="ahc-popover__close" type="button" aria-label="סגור" @click=${this._closeSegmentPopover}>×</button>
        <h3 class="ahc-popover__title">${e.row.entity.name}</h3>
        <dl class="ahc-popover__dl">
          ${i.map(([a, s]) => _`<dt class="ahc-popover__dt">${a}</dt><dd class="ahc-popover__dd">${s}</dd>`)}
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
      }
    }[e], s = e === "no_resolved_entities" && this._diagnostics?.discovery?.unavailableReasons.length ? this._diagnostics.discovery.unavailableReasons.join(", ") : "";
    return _`
      <div class="ahc-state-card">
        <div>
          <h3 class="ahc-state-card__title">${a.title}</h3>
          <p>${a.body}</p>
          ${s ? _`<p>אזהרת discovery: ${s}. אם האזורים לא זמינים, נסה להגדיר entities ידנית או להפעיל debug.</p>` : g}
          <pre class="ahc-state-card__yaml" dir="ltr"><code>${a.yaml}</code></pre>
        </div>
      </div>
    `;
  }
  _renderDiagnostics() {
    const e = this._diagnostics;
    return e ? _`
      <details class="ahc-debug" aria-label="אבחון">
        <summary class="ahc-debug__header">
          <strong>Debug</strong>
          <span>${e.fetchReason ?? "loaded"} · ${e.cacheHit ? "cache hit" : "cache miss"}</span>
        </summary>
        <dl class="ahc-debug__grid">
          <div><dt>רכיבים</dt><dd>${e.resolvedEntityCount}</dd></div>
          <div><dt>רשומות</dt><dd>${e.historyRecordCount}</dd></div>
          <div><dt>מקטעים</dt><dd>${e.timelineSegmentCount}</dd></div>
          <div><dt>פעילים</dt><dd>${e.activeTimelineSegmentCount}</dd></div>
          <div><dt>אחרי סינון</dt><dd>${e.filteredRowCount}</dd></div>
          <div><dt>קבוצות</dt><dd>${e.renderedGroupCount}</dd></div>
          <div><dt>attributes</dt><dd>${e.attributesRequested.withAttributes}/${e.attributesRequested.withoutAttributes}</dd></div>
          <div><dt>registry</dt><dd>${e.discovery?.registryAvailable ? "זמין" : "fallback"}</dd></div>
          <div><dt>refresh</dt><dd>${e.refreshIntervalSeconds ?? this._refreshIntervalSeconds()}s</dd></div>
          <div><dt>duration</dt><dd>${e.fetchDurationMs ?? 0}ms</dd></div>
          <div><dt>mode</dt><dd>${e.initialLoad ? "initial" : e.backgroundLoading ? "background" : "idle"}</dd></div>
        </dl>
        <p class="ahc-debug__meta" dir="ltr">
          ${e.historyRange ? `${e.historyRange.start.toISOString()} → ${e.historyRange.end.toISOString()}` : "no range"}
        </p>
        <p class="ahc-debug__meta" dir="ltr">last fetch: ${e.lastFetchTime?.toISOString() ?? "never"}</p>
        <p class="ahc-debug__meta" dir="ltr">history key: ${e.currentHistoryKey ?? "none"}</p>
        <p class="ahc-debug__meta">מסננים: ${JSON.stringify(e.activeFilters)}</p>
        ${e.discovery?.unavailableReasons.length ? _`<p class="ahc-debug__meta">Registry warnings: ${e.discovery.unavailableReasons.join(", ")}</p>` : g}
      </details>
    ` : _`<details class="ahc-debug" aria-label="אבחון"><summary>Debug · ממתין לטעינת נתונים...</summary></details>`;
  }
  _renderInsights() {
    const e = this._summary, i = e?.mostActiveEntity, a = e?.mostActiveArea, s = !!(e && e.eventCount > 0);
    return _`
      <aside class="ahc__insights" aria-label="תובנות חכמות">
        <h3 class="ahc__insights-title"><span>תובנות חכמות</span><span aria-hidden="true">✦</span></h3>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">הרכיב הפעיל ביותר</span>
          <span class="ahc__insight-value">${i?.entity.name ?? "אין מספיק נתונים"}</span>
          <span class="ahc__insight-subtitle">${i ? `${T(i.totalActiveMs)} · ${we(i, this._config.debug === !0)}` : "צריך היסטוריה פעילה בטווח"}</span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">האזור הפעיל ביותר</span>
          <span class="ahc__insight-value">${a?.title ?? "אין מספיק נתונים"}</span>
          <span class="ahc__insight-subtitle">${a ? `${T(a.totalActiveMs)} · ${a.subtitle ?? ""}` : "אין אזור עם פעילות משמעותית"}</span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">שעות שיא</span>
          <span class="ahc__insight-value">${e?.peakBucketLabel ?? "אין מספיק נתונים"}</span>
          <span class="ahc__insight-subtitle">לפי משך פעילות</span>
          <span class="ahc__spark" aria-hidden="true">${[35, 48, 62, 44, 72, 54, 38].map((r) => _`<i style="--bar:${s ? r : 12}%"></i>`)}</span>
        </article>
        <article class="ahc__insight-card">
          <span class="ahc__insight-kicker">דפוס שימוש קצר</span>
          <span class="ahc__insight-value">${s ? `${e?.activeEntityCount ?? 0} רכיבים` : "אין מספיק נתונים"}</span>
          <span class="ahc__insight-subtitle">${s ? `נרשמו ${e?.eventCount ?? 0} אירועים בטווח הנוכחי` : "נסה טווח זמן ארוך יותר או ודא שה-Recorder פעיל"}</span>
        </article>
      </aside>
    `;
  }
  _renderFilterSheet() {
    const e = this._availableAreas(), i = this._availableDomains(), a = Se(this._rows, this._filter);
    return _`
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
            ${e.map((s) => this._renderChip(s, this._filter.areas.includes(s), () => this._toggleArea(s)))}
          </div>
        </div>

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>סוגי רכיבים</span><span aria-hidden="true">▦</span></div>
          <div class="ahc-filter-section__chips">
            ${this._renderChip("כל הסוגים", !this._filter.domains.length, () => this._setDomains([]))}
            ${i.map((s) => this._renderChip(D[s] ?? s, this._filter.domains.includes(s), () => this._toggleDomain(s)))}
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

        <div class="ahc-filter-section">
          <div class="ahc-filter-section__title"><span>רכיבים נבחרים</span><span>${a.length}</span></div>
          <div class="ahc-entity-list">
            ${a.slice(0, 32).map(
      (s) => _`
                <span class="ahc-entity-list__item">
                  <span>${s.entity.name}</span>
                  <small>${[s.entity.area, D[s.entity.domain] ?? s.entity.domain].filter(Boolean).join(" · ")}</small>
                </span>
              `
    )}
            ${a.length > 32 ? _`<span class="ahc-entity-list__more">ועוד ${a.length - 32} רכיבים</span>` : g}
          </div>
        </div>

        <footer class="ahc-filter-sheet__footer">
          <button class="ahc__button ahc__button--ghost" type="button" @click=${this._clearFilters}>נקה סינון</button>
          <button class="ahc__button ahc__button--primary" type="button" @click=${this._closeFilterSheet}>החל סינון</button>
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
    const r = ++this._fetchToken, n = !this._hasFetchedOnce && !this._rows.length;
    this._initialLoad = n, this._loading = n, this._backgroundLoading = !n, this._error = void 0, this._rows.length || (this._emptyReason = void 0), this._usingMockData = s, this.requestUpdate();
    const c = s ? { entities: qt(), diagnostics: void 0 } : await At(this._config, this._hass);
    if (r !== this._fetchToken) return;
    const o = c.entities, l = oi(o), d = this._resolveRange(), u = Ge(o), h = Lt({
      mock: s,
      start: d.start.toISOString(),
      end: d.end.toISOString(),
      entityIds: o.map((m) => m.entity_id),
      withAttributes: u.withAttributes.map((m) => m.entity_id),
      withoutAttributes: u.withoutAttributes.map((m) => m.entity_id),
      includeLabels: this._config.include_labels ?? [],
      excludeLabels: this._config.exclude_labels ?? [],
      significant: this._config.significant_changes_only,
      minimal: this._config.minimal_response
    }), p = i && ["manual", "timer", "interval", "config"].includes(e), b = !!(this._lastResolvedEntityKey && this._lastResolvedEntityKey !== l) && e === "interval" ? "entities" : e, y = (m, P, Ye = c.diagnostics) => {
      this._lastResolvedEntityKey = l, this._lastHistoryFetchAt = Date.now(), this._hasFetchedOnce = !0, this._setPostLoadState(P, d, u, m, s, Ye, {
        reason: b,
        key: h,
        durationMs: Date.now() - a
      }), this._syncRefreshTimer();
    };
    if (!o.length) {
      this._usingMockData = !1, this._rows = [], this._groups = [], this._summary = G([]), this._emptyReason = this._config.auto_discover === !1 && !this._config.entities?.length ? "no_entities_selected" : "no_resolved_entities", this._setDiagnostics({
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
        mockData: s,
        discovery: c.diagnostics,
        lastFetchTime: /* @__PURE__ */ new Date(),
        fetchDurationMs: Date.now() - a,
        fetchReason: b,
        currentHistoryKey: h,
        refreshIntervalSeconds: this._refreshIntervalSeconds(),
        initialLoad: n,
        backgroundLoading: !1
      }), this._hasFetchedOnce = !0, this._lastResolvedEntityKey = l, this._lastHistoryFetchAt = Date.now(), this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this._error = void 0, this._syncRefreshTimer(), this.requestUpdate();
      return;
    }
    if (!p && h === this._lastFetchKey) {
      const m = this._historyCache.get(h);
      if (m) {
        const P = Pe(m);
        this._rows = He(m, o, d, this._config, this._hass?.states ?? {}), y(!0, P), this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this._error = void 0, this._rebuildGroups();
        return;
      }
    }
    try {
      let m = p ? void 0 : this._historyCache.get(h);
      if (m || (m = s ? Kt(d) : await Ot(this._hass, o, d, this._config), this._historyCache.set(h, m)), r !== this._fetchToken) return;
      const P = Pe(m);
      this._rows = He(m, o, d, this._config, this._hass?.states ?? {}), y(!1, P), this._lastFetchKey = h, this._rebuildGroups();
    } catch (m) {
      this._error = m instanceof Error ? m.message : String(m), this._rows.length || (this._groups = [], this._summary = G([]), this._emptyReason = void 0);
    } finally {
      r === this._fetchToken && (this._initialLoad = !1, this._loading = !1, this._backgroundLoading = !1, this.requestUpdate());
    }
  }
  _rebuildGroups() {
    const e = Se(this._rows, this._filter);
    this._groups = Pt(e, this._filter.groupBy), this._summary = G(this._groups), this._rows.length && !e.length ? this._emptyReason = "all_entities_filtered" : this._emptyReason === "all_entities_filtered" && (this._emptyReason = void 0), this._diagnostics && this._setDiagnostics({
      ...this._diagnostics,
      filteredRowCount: e.length,
      renderedGroupCount: this._groups.length,
      activeFilters: { ...this._filter }
    }), this.requestUpdate();
  }
  _setPostLoadState(e, i, a, s, r, n, c) {
    const o = this._rows.reduce((d, u) => d + u.segments.length, 0), l = this._rows.reduce((d, u) => d + u.segments.filter((h) => h.active).length, 0);
    e === 0 && l === 0 ? this._emptyReason = "no_history_returned" : e > 0 && o === 0 ? this._emptyReason = "history_unusable" : this._emptyReason = void 0, this._setDiagnostics({
      resolvedEntityCount: this._rows.length,
      historyRecordCount: e,
      timelineSegmentCount: o,
      activeTimelineSegmentCount: l,
      filteredRowCount: this._rows.length,
      renderedGroupCount: 0,
      activeFilters: { ...this._filter },
      historyRange: i,
      attributesRequested: {
        withAttributes: a.withAttributes.length,
        withoutAttributes: a.withoutAttributes.length
      },
      cacheHit: s,
      mockData: r,
      discovery: n,
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
    return We(this._config?.refresh_interval_seconds);
  }
  _resolveRange() {
    const e = this._roundedNow();
    return this._filter.timePreset === "24h" ? ee({ ...this._config, start_time: void 0, end_time: e.toISOString(), hours_to_show: 24 }, e) : this._filter.timePreset === "7d" ? ee({ ...this._config, start_time: void 0, end_time: e.toISOString(), hours_to_show: 24 * 7 }, e) : ee(this._config, e);
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
function Pe(t) {
  return Object.values(t).reduce((e, i) => e + i.length, 0);
}
function oi(t) {
  return t.map((e) => "entity" in e ? e.entity.entity_id : e.entity_id).sort().join("|");
}
customElements.get("activity-history-card") || customElements.define("activity-history-card", ni);
window.customCards = window.customCards || [];
window.customCards.some((t) => t.type === "activity-history-card") || window.customCards.push({
  type: "activity-history-card",
  name: "Activity History Card",
  description: "RTL/mobile-friendly Home Assistant activity history timeline",
  preview: !0,
  documentationURL: "https://github.com/jonioliel/activity-history-card"
});
export {
  ni as ActivityHistoryCard
};
//# sourceMappingURL=activity-history-card.js.map
