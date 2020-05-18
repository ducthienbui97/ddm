// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

// This is a specialised implementation of a System module loader.

// @ts-nocheck
/* eslint-disable */
let System, __instantiateAsync, __instantiate;

(() => {
  const r = new Map();

  System = {
    register(id, d, f) {
      r.set(id, { d, f, exp: {} });
    },
  };

  async function dI(mid, src) {
    let id = mid.replace(/\.\w+$/i, "");
    if (id.includes("./")) {
      const [o, ...ia] = id.split("/").reverse(),
        [, ...sa] = src.split("/").reverse(),
        oa = [o];
      let s = 0,
        i;
      while ((i = ia.shift())) {
        if (i === "..") s++;
        else if (i === ".") break;
        else oa.push(i);
      }
      if (s < sa.length) oa.push(...sa.slice(s));
      id = oa.reverse().join("/");
    }
    return r.has(id) ? gExpA(id) : import(mid);
  }

  function gC(id, main) {
    return {
      id,
      import: (m) => dI(m, id),
      meta: { url: id, main },
    };
  }

  function gE(exp) {
    return (id, v) => {
      v = typeof id === "string" ? { [id]: v } : id;
      for (const [id, value] of Object.entries(v)) {
        Object.defineProperty(exp, id, {
          value,
          writable: true,
          enumerable: true,
        });
      }
    };
  }

  function rF(main) {
    for (const [id, m] of r.entries()) {
      const { f, exp } = m;
      const { execute: e, setters: s } = f(gE(exp), gC(id, id === main));
      delete m.f;
      m.e = e;
      m.s = s;
    }
  }

  async function gExpA(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](await gExpA(d[i]));
      const r = e();
      if (r) await r;
    }
    return m.exp;
  }

  function gExp(id) {
    if (!r.has(id)) return;
    const m = r.get(id);
    if (m.s) {
      const { d, e, s } = m;
      delete m.s;
      delete m.e;
      for (let i = 0; i < s.length; i++) s[i](gExp(d[i]));
      e();
    }
    return m.exp;
  }

  __instantiateAsync = async (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExpA(m);
  };

  __instantiate = (m) => {
    System = __instantiateAsync = __instantiate = undefined;
    rF(m);
    return gExp(m);
  };
})();

System.register(
  "https://deno.land/std@v0.50.0/encoding/utf8",
  [],
  function (exports_1, context_1) {
    "use strict";
    var encoder, decoder;
    var __moduleName = context_1 && context_1.id;
    /** Shorthand for new TextEncoder().encode() */
    function encode(input) {
      return encoder.encode(input);
    }
    exports_1("encode", encode);
    /** Shorthand for new TextDecoder().decode() */
    function decode(input) {
      return decoder.decode(input);
    }
    exports_1("decode", decode);
    return {
      setters: [],
      execute: function () {
        /** A default TextEncoder instance */
        exports_1("encoder", encoder = new TextEncoder());
        /** A default TextDecoder instance */
        exports_1("decoder", decoder = new TextDecoder());
      },
    };
  },
);
System.register(
  "https://deno.land/std@v0.50.0/fmt/colors",
  [],
  function (exports_2, context_2) {
    "use strict";
    var noColor, enabled;
    var __moduleName = context_2 && context_2.id;
    function setColorEnabled(value) {
      if (noColor) {
        return;
      }
      enabled = value;
    }
    exports_2("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
      return enabled;
    }
    exports_2("getColorEnabled", getColorEnabled);
    function code(open, close) {
      return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
      };
    }
    function run(str, code) {
      return enabled
        ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
        : str;
    }
    function reset(str) {
      return run(str, code([0], 0));
    }
    exports_2("reset", reset);
    function bold(str) {
      return run(str, code([1], 22));
    }
    exports_2("bold", bold);
    function dim(str) {
      return run(str, code([2], 22));
    }
    exports_2("dim", dim);
    function italic(str) {
      return run(str, code([3], 23));
    }
    exports_2("italic", italic);
    function underline(str) {
      return run(str, code([4], 24));
    }
    exports_2("underline", underline);
    function inverse(str) {
      return run(str, code([7], 27));
    }
    exports_2("inverse", inverse);
    function hidden(str) {
      return run(str, code([8], 28));
    }
    exports_2("hidden", hidden);
    function strikethrough(str) {
      return run(str, code([9], 29));
    }
    exports_2("strikethrough", strikethrough);
    function black(str) {
      return run(str, code([30], 39));
    }
    exports_2("black", black);
    function red(str) {
      return run(str, code([31], 39));
    }
    exports_2("red", red);
    function green(str) {
      return run(str, code([32], 39));
    }
    exports_2("green", green);
    function yellow(str) {
      return run(str, code([33], 39));
    }
    exports_2("yellow", yellow);
    function blue(str) {
      return run(str, code([34], 39));
    }
    exports_2("blue", blue);
    function magenta(str) {
      return run(str, code([35], 39));
    }
    exports_2("magenta", magenta);
    function cyan(str) {
      return run(str, code([36], 39));
    }
    exports_2("cyan", cyan);
    function white(str) {
      return run(str, code([37], 39));
    }
    exports_2("white", white);
    function gray(str) {
      return run(str, code([90], 39));
    }
    exports_2("gray", gray);
    function bgBlack(str) {
      return run(str, code([40], 49));
    }
    exports_2("bgBlack", bgBlack);
    function bgRed(str) {
      return run(str, code([41], 49));
    }
    exports_2("bgRed", bgRed);
    function bgGreen(str) {
      return run(str, code([42], 49));
    }
    exports_2("bgGreen", bgGreen);
    function bgYellow(str) {
      return run(str, code([43], 49));
    }
    exports_2("bgYellow", bgYellow);
    function bgBlue(str) {
      return run(str, code([44], 49));
    }
    exports_2("bgBlue", bgBlue);
    function bgMagenta(str) {
      return run(str, code([45], 49));
    }
    exports_2("bgMagenta", bgMagenta);
    function bgCyan(str) {
      return run(str, code([46], 49));
    }
    exports_2("bgCyan", bgCyan);
    function bgWhite(str) {
      return run(str, code([47], 49));
    }
    exports_2("bgWhite", bgWhite);
    /* Special Color Sequences */
    function clampAndTruncate(n, max = 255, min = 0) {
      return Math.trunc(Math.max(Math.min(n, max), min));
    }
    /** Set text color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function rgb8(str, color) {
      return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports_2("rgb8", rgb8);
    /** Set background color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function bgRgb8(str, color) {
      return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports_2("bgRgb8", bgRgb8);
    /** Set text color using 24bit rgb. */
    function rgb24(str, color) {
      return run(
        str,
        code([
          38,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 39),
      );
    }
    exports_2("rgb24", rgb24);
    /** Set background color using 24bit rgb. */
    function bgRgb24(str, color) {
      return run(
        str,
        code([
          48,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 49),
      );
    }
    exports_2("bgRgb24", bgRgb24);
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        /**
             * A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
             * on npm.
             *
             * ```
             * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
             * console.log(bgBlue(red(bold("Hello world!"))));
             * ```
             *
             * This module supports `NO_COLOR` environmental variable disabling any coloring
             * if `NO_COLOR` is set.
             */
        noColor = Deno.noColor;
        enabled = !noColor;
      },
    };
  },
);
System.register(
  "https://deno.land/x/case/vendor/camelCaseRegexp",
  [],
  function (exports_3, context_3) {
    "use strict";
    var camelCaseRegexp;
    var __moduleName = context_3 && context_3.id;
    return {
      setters: [],
      execute: function () {
        camelCaseRegexp =
          /([a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])/g;
        exports_3("default", camelCaseRegexp);
      },
    };
  },
);
System.register(
  "https://deno.land/x/case/vendor/camelCaseUpperRegexp",
  [],
  function (exports_4, context_4) {
    "use strict";
    var camelCaseUpperRegexp;
    var __moduleName = context_4 && context_4.id;
    return {
      setters: [],
      execute: function () {
        camelCaseUpperRegexp =
          /([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A])([A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178\u0179\u017B\u017D\u0181\u0182\u0184\u0186\u0187\u0189-\u018B\u018E-\u0191\u0193\u0194\u0196-\u0198\u019C\u019D\u019F\u01A0\u01A2\u01A4\u01A6\u01A7\u01A9\u01AC\u01AE\u01AF\u01B1-\u01B3\u01B5\u01B7\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A\u023B\u023D\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u037F\u0386\u0388-\u038A\u038C\u038E\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0528\u052A\u052C\u052E\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u13A0-\u13F5\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA698\uA69A\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA796\uA798\uA79A\uA79C\uA79E\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA-\uA7AD\uA7B0-\uA7B4\uA7B6\uFF21-\uFF3A][a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0529\u052B\u052D\u052F\u0561-\u0587\u13F8-\u13FD\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6\u1FC7\u1FD0-\u1FD3\u1FD6\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6\u1FF7\u210A\u210E\u210F\u2113\u212F\u2134\u2139\u213C\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA699\uA69B\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793-\uA795\uA797\uA799\uA79B\uA79D\uA79F\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7B5\uA7B7\uA7FA\uAB30-\uAB5A\uAB60-\uAB65\uAB70-\uABBF\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A])/g;
        exports_4("default", camelCaseUpperRegexp);
      },
    };
  },
);
System.register(
  "https://deno.land/x/case/vendor/nonWordRegexp",
  [],
  function (exports_5, context_5) {
    "use strict";
    var nonWordRegexp;
    var __moduleName = context_5 && context_5.id;
    return {
      setters: [],
      execute: function () {
        nonWordRegexp =
          /[^A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B4\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FD5\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AD\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0DE6-\u0DEF\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uA9F0-\uA9F9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]+/g;
        exports_5("default", nonWordRegexp);
      },
    };
  },
);
System.register(
  "https://deno.land/x/case/types",
  [],
  function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
/**
 * via: https://github.com/blakeembrey/lower-case
 */
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/x/lowerCase",
  [],
  function (exports_7, context_7) {
    "use strict";
    var LANGUAGES;
    var __moduleName = context_7 && context_7.id;
    /**
     * Lowercase a string.
     *
     * @param  {String} str
     * @return {String}
     */
    function default_1(str, locale) {
      const lang = locale && LANGUAGES[locale];
      str = str == null ? "" : String(str);
      if (lang) {
        str = str.replace(lang.regexp, (m) => lang.map[m]);
      }
      return str.toLowerCase();
    }
    exports_7("default", default_1);
    return {
      setters: [],
      execute: function () {
        /**
             * Special language-specific overrides.
             * Source: ftp://ftp.unicode.org/Public/UCD/latest/ucd/SpecialCasing.txt
             */
        LANGUAGES = {
          tr: {
            regexp: /\u0130|\u0049|\u0049\u0307/g,
            map: {
              İ: "\u0069",
              I: "\u0131",
              // İ: '\u0069'
            },
          },
          az: {
            regexp: /[\u0130]/g,
            map: {
              İ: "\u0069",
              I: "\u0131",
              // İ: '\u0069'
            },
          },
          lt: {
            regexp: /[\u0049\u004A\u012E\u00CC\u00CD\u0128]/g,
            map: {
              I: "\u0069\u0307",
              J: "\u006A\u0307",
              Į: "\u012F\u0307",
              Ì: "\u0069\u0307\u0300",
              Í: "\u0069\u0307\u0301",
              Ĩ: "\u0069\u0307\u0303",
            },
          },
        };
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/x/normalCase",
  [
    "https://deno.land/x/case/vendor/camelCaseRegexp",
    "https://deno.land/x/case/vendor/camelCaseUpperRegexp",
    "https://deno.land/x/case/vendor/nonWordRegexp",
    "https://deno.land/x/cliffy@v0.6.1/packages/x/lowerCase",
  ],
  function (exports_8, context_8) {
    "use strict";
    var camelCaseRegexp_ts_1,
      camelCaseUpperRegexp_ts_1,
      nonWordRegexp_ts_1,
      lowerCase_ts_1;
    var __moduleName = context_8 && context_8.id;
    function normalCase(str, locale, replacement) {
      if (str == null) {
        return "";
      }
      replacement = typeof replacement !== "string" ? " " : replacement;
      function replace(match, index, value) {
        if (index === 0 || index === value.length - match.length) {
          return "";
        }
        return replacement || "";
      }
      str = String(str)
        // Support camel case ("camelCase" -> "camel Case").
        .replace(camelCaseRegexp_ts_1.default, "$1 $2")
        // Support odd camel case ("CAMELCase" -> "CAMEL Case").
        .replace(camelCaseUpperRegexp_ts_1.default, "$1 $2")
        // Remove all non-word characters and replace with a single space.
        .replace(nonWordRegexp_ts_1.default, replace);
      // Lower case the entire string.
      return lowerCase_ts_1.default(str, locale);
    }
    exports_8("default", normalCase);
    return {
      setters: [
        function (camelCaseRegexp_ts_1_1) {
          camelCaseRegexp_ts_1 = camelCaseRegexp_ts_1_1;
        },
        function (camelCaseUpperRegexp_ts_1_1) {
          camelCaseUpperRegexp_ts_1 = camelCaseUpperRegexp_ts_1_1;
        },
        function (nonWordRegexp_ts_1_1) {
          nonWordRegexp_ts_1 = nonWordRegexp_ts_1_1;
        },
        function (lowerCase_ts_1_1) {
          lowerCase_ts_1 = lowerCase_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/x/upperCase",
  [],
  function (exports_9, context_9) {
    "use strict";
    var LANGUAGES;
    var __moduleName = context_9 && context_9.id;
    function default_2(str, locale) {
      const lang = locale && LANGUAGES[locale];
      str = str == null ? "" : String(str);
      if (lang) {
        str = str.replace(lang.regexp, function (m) {
          return lang.map[m];
        });
      }
      return str.toUpperCase();
    }
    exports_9("default", default_2);
    return {
      setters: [],
      execute: function () {
        LANGUAGES = {
          tr: {
            regexp: /[\u0069]/g,
            map: {
              i: "\u0130",
            },
          },
          az: {
            regexp: /[\u0069]/g,
            map: {
              i: "\u0130",
            },
          },
          lt: {
            regexp:
              /[\u0069\u006A\u012F]\u0307|\u0069\u0307[\u0300\u0301\u0303]/g,
            map: {
              i̇: "\u0049",
              j̇: "\u004A",
              į̇: "\u012E",
              i̇̀: "\u00CC",
              i̇́: "\u00CD",
              i̇̃: "\u0128",
            },
          },
        };
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/x/camelCase",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/x/normalCase",
    "https://deno.land/x/cliffy@v0.6.1/packages/x/upperCase",
  ],
  function (exports_10, context_10) {
    "use strict";
    var normalCase_ts_1, upperCase_ts_1;
    var __moduleName = context_10 && context_10.id;
    function camelCase(value, locale, mergeNumbers) {
      let result = normalCase_ts_1.default(value, locale);
      // Replace periods between numeric entities with an underscore.
      if (!mergeNumbers) {
        result = result.replace(/ (?=\d)/g, "_");
      }
      // Replace spaces between words with an upper cased character.
      return result.replace(/ (.)/g, function (m, $1) {
        return upperCase_ts_1.default($1, locale);
      });
    }
    exports_10("default", camelCase);
    return {
      setters: [
        function (normalCase_ts_1_1) {
          normalCase_ts_1 = normalCase_ts_1_1;
        },
        function (upperCase_ts_1_1) {
          upperCase_ts_1 = upperCase_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/normalize",
  [],
  function (exports_11, context_11) {
    "use strict";
    var __moduleName = context_11 && context_11.id;
    /**
     * Normalize command line arguments.
     *
     * @param args Command line arguments e.g: `Deno.args`
     */
    function normalize(args) {
      const normalized = [];
      let inLiteral = false;
      for (const arg of args) {
        if (inLiteral) {
          normalized.push(arg);
        } else if (arg === "--") {
          inLiteral = true;
          normalized.push(arg);
        } else if (arg[0] === "-" && arg[1] !== "-") {
          arg.slice(1).split("").forEach((val) => normalized.push(`-${val}`));
        } else {
          normalized.push(arg);
        }
      }
      return normalized;
    }
    exports_11("normalize", normalize);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types",
  [],
  function (exports_12, context_12) {
    "use strict";
    var OptionType;
    var __moduleName = context_12 && context_12.id;
    return {
      setters: [],
      execute: function () {
        (function (OptionType) {
          OptionType["STRING"] = "string";
          OptionType["NUMBER"] = "number";
          OptionType["BOOLEAN"] = "boolean";
        })(OptionType || (OptionType = {}));
        exports_12("OptionType", OptionType);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types/boolean",
  [],
  function (exports_13, context_13) {
    "use strict";
    var boolean;
    var __moduleName = context_13 && context_13.id;
    return {
      setters: [],
      execute: function () {
        exports_13(
          "boolean",
          boolean = (option, arg, value) => {
            if (~["1", "true"].indexOf(value)) {
              return true;
            }
            if (~["0", "false"].indexOf(value)) {
              return false;
            }
            throw new Error(
              `Option --${option.name} must be of type boolean but got: ${value}`,
            );
          },
        );
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types/number",
  [],
  function (exports_14, context_14) {
    "use strict";
    var number;
    var __moduleName = context_14 && context_14.id;
    return {
      setters: [],
      execute: function () {
        exports_14(
          "number",
          number = (option, arg, value) => {
            if (isNaN(value)) {
              throw new Error(
                `Option --${option.name} must be of type number but got: ${value}`,
              );
            }
            return parseFloat(value);
          },
        );
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types/string",
  [],
  function (exports_15, context_15) {
    "use strict";
    var string;
    var __moduleName = context_15 && context_15.id;
    return {
      setters: [],
      execute: function () {
        exports_15(
          "string",
          string = (option, arg, value) => {
            return value;
          },
        );
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/x/paramCase",
  ["https://deno.land/x/cliffy@v0.6.1/packages/x/normalCase"],
  function (exports_16, context_16) {
    "use strict";
    var normalCase_ts_2;
    var __moduleName = context_16 && context_16.id;
    function paramCase(value, locale) {
      return normalCase_ts_2.default(value, locale, "-");
    }
    exports_16("default", paramCase);
    return {
      setters: [
        function (normalCase_ts_2_1) {
          normalCase_ts_2 = normalCase_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/validate-flags",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/x/camelCase",
    "https://deno.land/x/cliffy@v0.6.1/packages/x/paramCase",
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/flags",
  ],
  function (exports_17, context_17) {
    "use strict";
    var camelCase_ts_1, paramCase_ts_1, flags_ts_1;
    var __moduleName = context_17 && context_17.id;
    /**
     * Validate flags.
     *
     * @param flags         Available flag options.
     * @param values        Flag to validate.
     * @param defaultValues Values marked as default value.
     * @param knownFlaks    Don't throw an error if a missing flag is defined in knownFlags (currently not implemented).
     * @param allowEmpty    Don't throw an error if values is empty.
     */
    function validateFlags(
      flags,
      values,
      defaultValues = {},
      knownFlaks,
      allowEmpty,
    ) {
      // Set default value's
      for (const option of flags) {
        const name = camelCase_ts_1.default(option.name);
        if (
          typeof values[name] === "undefined" &&
          typeof option.default !== "undefined"
        ) {
          values[name] = typeof option.default === "function"
            ? option.default()
            : option.default;
          defaultValues[name] = true;
        }
      }
      const keys = Object.keys(values);
      if (keys.length === 0 && allowEmpty) {
        return;
      }
      const options = keys.map((name) => ({
        name,
        option: flags_ts_1.getOption(flags, paramCase_ts_1.default(name)),
      }));
      for (const { name, option } of options) {
        if (!option) {
          throw new Error("Unknown option: --" + name);
        }
        if (option.standalone) {
          if (keys.length > 1) {
            // dont't throw an error if all values are coming from the default option.
            if (
              options.every(({ option }) =>
                option && (option.standalone || defaultValues[option.name])
              )
            ) {
              return;
            }
            throw new Error(
              `Option --${option.name} cannot be combined with other options.`,
            );
          }
          return;
        }
        option.conflicts?.forEach((flag) => {
          if (isset(flag)) {
            throw new Error(
              `Option --${option.name} conflicts with option: --${flag}`,
            );
          }
        });
        option.depends?.forEach((flag) => {
          // dont't throw an error if the value is coming from the default option.
          if (!isset(flag) && !defaultValues[option.name]) {
            throw new Error(
              `Option --${option.name} depends on option: --${flag}`,
            );
          }
        });
        const isArray = (option.args?.length || 0) > 1;
        option.args?.forEach((arg, i) => {
          if (
            !arg.optionalValue &&
            (typeof values[name] === "undefined" ||
              (isArray && typeof values[name][i] === "undefined"))
          ) {
            throw new Error(`Missing value for option: --${option.name}`);
          }
        });
        function isset(flag) {
          const name = camelCase_ts_1.default(flag);
          // return typeof values[ name ] !== 'undefined' && values[ name ] !== false;
          return typeof values[name] !== "undefined";
        }
      }
      for (const option of flags) {
        if (
          option.required && !(camelCase_ts_1.default(option.name) in values)
        ) {
          if (
            (!option.conflicts ||
              !option.conflicts.find((flag) => !!values[flag])) &&
            !options.find((opt) =>
              opt.option?.conflicts?.find((flag) => flag === option.name)
            )
          ) {
            throw new Error(`Missing required option: --${option.name}`);
          }
        }
        // console.log( 'args:', JSON.stringify( option.args, null, 2 ) );
      }
      if (keys.length === 0 && !allowEmpty) {
        throw new Error("No arguments.");
      }
    }
    exports_17("validateFlags", validateFlags);
    return {
      setters: [
        function (camelCase_ts_1_1) {
          camelCase_ts_1 = camelCase_ts_1_1;
        },
        function (paramCase_ts_1_1) {
          paramCase_ts_1 = paramCase_ts_1_1;
        },
        function (flags_ts_1_1) {
          flags_ts_1 = flags_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/flags",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/x/camelCase",
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/normalize",
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types",
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types/boolean",
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types/number",
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types/string",
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/validate-flags",
  ],
  function (exports_18, context_18) {
    "use strict";
    var camelCase_ts_2,
      normalize_ts_1,
      types_ts_1,
      boolean_ts_1,
      number_ts_1,
      string_ts_1,
      validate_flags_ts_1,
      Types;
    var __moduleName = context_18 && context_18.id;
    /**
     * Parse command line arguments.
     *
     * @param args  Command line arguments e.g: `Deno.args`
     * @param opts  Parse options.
     */
    function parseFlags(args, opts = {}) {
      !opts.flags && (opts.flags = []);
      const normalized = normalize_ts_1.normalize(args);
      let option;
      let inLiteral = false;
      let negate = false;
      const flags = {};
      const defaultValues = {};
      const literal = [];
      const unknown = [];
      opts.flags.forEach((opt) => {
        opt.depends?.forEach((flag) => {
          if (!opts.flags || !getOption(opts.flags, flag)) {
            throw new Error(`Unknown required option: ${flag}`);
          }
        });
        opt.conflicts?.forEach((flag) => {
          if (!opts.flags || !getOption(opts.flags, flag)) {
            throw new Error(`Unknown conflicting option: ${flag}`);
          }
        });
      });
      for (let i = 0; i < normalized.length; i++) {
        const current = normalized[i];
        // literal args after --
        if (inLiteral) {
          literal.push(current);
          continue;
        }
        if (current === "--") {
          inLiteral = true;
          continue;
        }
        const isFlag = current.length > 1 && current[0] === "-";
        const next = () => normalized[i + 1];
        if (isFlag) {
          if (
            current[2] === "-" || (current[1] === "-" && current.length === 3)
          ) {
            throw new Error(`Invalid flag name: ${current}`);
          }
          negate = current.indexOf("--no-") === 0;
          const name = current.replace(/^-+(no-)?/, "");
          option = getOption(opts.flags, name);
          if (!option) {
            if (opts.flags.length) {
              throw new Error(`Unknown option: ${current}`);
            }
            option = {
              name,
              optionalValue: true,
              type: types_ts_1.OptionType.STRING,
            };
          }
          if (!option.args || !option.args.length) {
            option.args = [option];
          }
          if (!option.name) {
            throw new Error(`Missing name for option: ${current}`);
          }
          const friendlyName = camelCase_ts_2.default(option.name);
          if (typeof flags[friendlyName] !== "undefined" && !option.collect) {
            throw new Error(`Duplicate option: ${current}`);
          }
          let argIndex = 0;
          const previous = flags[friendlyName];
          parseNext();
          if (typeof flags[friendlyName] === "undefined") {
            if (typeof option.default !== "undefined") {
              flags[friendlyName] = typeof option.default === "function"
                ? option.default()
                : option.default;
              defaultValues[friendlyName] = true;
            } else if (option.args && option.args[0].optionalValue) {
              flags[friendlyName] = true;
            } else {
              throw new Error(`Missing value for option: --${option.name}`);
            }
          }
          if (typeof option.value !== "undefined") {
            flags[friendlyName] = option.value(flags[friendlyName], previous);
          } else if (option.collect) {
            const value = (previous || []);
            value.push(flags[friendlyName]);
            flags[friendlyName] = value;
          }
          function parseNext() {
            if (!option) {
              throw new Error("Wrongly used parseNext.");
            }
            if (!option.args || !option.args[argIndex]) {
              throw new Error("Unknown option: " + next());
            }
            let arg = option.args[argIndex];
            if (negate) {
              if (
                arg.type !== types_ts_1.OptionType.BOOLEAN &&
                !arg.optionalValue
              ) {
                throw new Error(
                  `Negate not supported by --${option.name}. Only optional option or options of type boolean can be negated.`,
                );
              }
              flags[friendlyName] = false;
              return;
            }
            // make boolean value optional per default
            if (
              option.type === types_ts_1.OptionType.BOOLEAN &&
              typeof option.optionalValue === "undefined"
            ) {
              option.optionalValue = true;
            }
            let result;
            let increase = false;
            if (arg.list && hasNext()) {
              const parsed = next()
                .split(arg.separator || ",")
                .map((nextValue) => {
                  const value = parseValue(nextValue);
                  if (typeof value === "undefined") {
                    throw new Error(
                      `List item of option --${option
                        ?.name} must be of type ${option
                        ?.type} but got: ${nextValue}`,
                    );
                  }
                  return value;
                });
              if (parsed?.length) {
                result = parsed;
              }
            } else {
              if (hasNext()) {
                result = parseValue(next());
              } else if (
                arg.optionalValue && arg.type === types_ts_1.OptionType.BOOLEAN
              ) {
                result = true;
              }
            }
            if (increase) {
              i++;
              if (!arg.variadic) {
                argIndex++;
              } else if (option.args && option.args[argIndex + 1]) {
                throw new Error(
                  "An argument cannot follow an variadic argument: " + next(),
                );
              }
            }
            if (
              typeof result !== "undefined" &&
              ((option.args && option.args.length > 1) || arg.variadic)
            ) {
              if (!flags[friendlyName]) {
                flags[friendlyName] = [];
              }
              flags[friendlyName].push(result);
              if (hasNext()) {
                parseNext();
              }
            } else {
              flags[friendlyName] = result;
            }
            function hasNext() {
              return typeof normalized[i + 1] !== "undefined" &&
                (normalized[i + 1][0] !== "-" ||
                  (arg.type === types_ts_1.OptionType.NUMBER &&
                    !isNaN(normalized[i + 1]))) &&
                // ( arg.type !== OptionType.BOOLEAN || [ 'true', 'false', '1', '0' ].indexOf( normalized[ i + 1 ] ) !== -1 ) &&
                typeof arg !== "undefined";
            }
            function parseValue(nextValue) {
              if (!option) {
                throw new Error("Wrongly used parseValue.");
              }
              let result = opts.parse
                ? opts.parse(
                  arg.type || types_ts_1.OptionType.STRING,
                  option,
                  arg,
                  nextValue,
                )
                : parseFlagValue(option, arg, nextValue);
              if (typeof result !== "undefined") {
                increase = true;
              }
              return result;
            }
          }
        } else {
          unknown.push(current);
        }
      }
      if (opts.flags && opts.flags.length) {
        validate_flags_ts_1.validateFlags(
          opts.flags,
          flags,
          defaultValues,
          opts.knownFlaks,
          opts.allowEmpty,
        );
      }
      return { flags, unknown, literal };
    }
    exports_18("parseFlags", parseFlags);
    function parseFlagValue(option, arg, nextValue) {
      const type = Types[arg.type || types_ts_1.OptionType.STRING];
      if (!type) {
        throw new Error(`Unknown type ${arg.type}`);
      }
      return type(option, arg, nextValue);
    }
    exports_18("parseFlagValue", parseFlagValue);
    /**
     * Find option by name.
     *
     * @param flags Source option's array.
     * @param name  Name of the option.
     */
    function getOption(flags, name) {
      while (name[0] === "-") {
        name = name.slice(1);
      }
      for (const flag of flags) {
        if (isOption(flag, name)) {
          return flag;
        }
      }
      return;
    }
    exports_18("getOption", getOption);
    /**
     * Check if option has name or alias.
     *
     * @param option    The option to check.
     * @param name      The option name or alias.
     */
    function isOption(option, name) {
      return option.name === name ||
        (option.aliases && option.aliases.indexOf(name) !== -1);
    }
    exports_18("isOption", isOption);
    return {
      setters: [
        function (camelCase_ts_2_1) {
          camelCase_ts_2 = camelCase_ts_2_1;
        },
        function (normalize_ts_1_1) {
          normalize_ts_1 = normalize_ts_1_1;
        },
        function (types_ts_1_1) {
          types_ts_1 = types_ts_1_1;
        },
        function (boolean_ts_1_1) {
          boolean_ts_1 = boolean_ts_1_1;
        },
        function (number_ts_1_1) {
          number_ts_1 = number_ts_1_1;
        },
        function (string_ts_1_1) {
          string_ts_1 = string_ts_1_1;
        },
        function (validate_flags_ts_1_1) {
          validate_flags_ts_1 = validate_flags_ts_1_1;
        },
      ],
      execute: function () {
        Types = {
          [types_ts_1.OptionType.STRING]: string_ts_1.string,
          [types_ts_1.OptionType.NUMBER]: number_ts_1.number,
          [types_ts_1.OptionType.BOOLEAN]: boolean_ts_1.boolean,
        };
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/utils",
  [],
  function (exports_19, context_19) {
    "use strict";
    var __moduleName = context_19 && context_19.id;
    /**
     * Fill string with given char until the string has a specified length.
     *
     * @param count The length until the string will be filled.
     * @param str   The string to fill.
     * @param char  The char to fill the string with.
     */
    function fill(count, str = "", char = " ") {
      while (str.length < count) {
        str += char;
      }
      return str;
    }
    exports_19("fill", fill);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/x/format",
  [],
  function (exports_20, context_20) {
    "use strict";
    var inspect, formatRegExp;
    var __moduleName = context_20 && context_20.id;
    function format(...args) {
      if (typeof args[0] !== "string") {
        let objects = [];
        for (let i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(" ");
      }
      let i = 1;
      const f = args[0];
      const len = args.length;
      let str = String(f).replace(formatRegExp, function (x) {
        if (x === "%%") {
          return "%";
        }
        if (i >= len) {
          return x;
        }
        switch (x) {
          case "%s":
            return String(args[i++]);
          case "%d":
            return String(Number(args[i++]));
          case "%j":
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return "[Circular]";
            }
          case "%o":
          case "%O":
            return inspect(args[i++]);
          default:
            return x;
        }
      });
      for (let x = args[i]; i < len; x = args[++i]) {
        if (x == null || typeof x !== "object") {
          str += " " + x;
        } else {
          str += " " + inspect(x);
        }
      }
      return str;
    }
    exports_20("default", format);
    return {
      setters: [],
      execute: function () {
        // Copied from https://github.com/defunctzombie/node-util/blob/master/util.ts
        // Modified to format %o and %O as deno objects
        inspect = Deno.inspect;
        formatRegExp = /%[sdjoO%]/g;
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/types/type",
  [],
  function (exports_21, context_21) {
    "use strict";
    var Type;
    var __moduleName = context_21 && context_21.id;
    return {
      setters: [],
      execute: function () {
        Type = class Type {
          complete() {
            return [];
          }
        };
        exports_21("Type", Type);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/types/boolean",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types/boolean",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/type",
  ],
  function (exports_22, context_22) {
    "use strict";
    var boolean_ts_2, type_ts_1, BooleanType;
    var __moduleName = context_22 && context_22.id;
    return {
      setters: [
        function (boolean_ts_2_1) {
          boolean_ts_2 = boolean_ts_2_1;
        },
        function (type_ts_1_1) {
          type_ts_1 = type_ts_1_1;
        },
      ],
      execute: function () {
        BooleanType = class BooleanType extends type_ts_1.Type {
          parse(option, arg, value) {
            return boolean_ts_2.boolean(option, arg, value);
          }
          complete() {
            return ["true", "false"];
          }
        };
        exports_22("BooleanType", BooleanType);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/types/number",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types/number",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/type",
  ],
  function (exports_23, context_23) {
    "use strict";
    var number_ts_2, type_ts_2, NumberType;
    var __moduleName = context_23 && context_23.id;
    return {
      setters: [
        function (number_ts_2_1) {
          number_ts_2 = number_ts_2_1;
        },
        function (type_ts_2_1) {
          type_ts_2 = type_ts_2_1;
        },
      ],
      execute: function () {
        NumberType = class NumberType extends type_ts_2.Type {
          parse(option, arg, value) {
            return number_ts_2.number(option, arg, value);
          }
          complete() {
            return [];
          }
        };
        exports_23("NumberType", NumberType);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/types/string",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types/string",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/type",
  ],
  function (exports_24, context_24) {
    "use strict";
    var string_ts_2, type_ts_3, StringType;
    var __moduleName = context_24 && context_24.id;
    return {
      setters: [
        function (string_ts_2_1) {
          string_ts_2 = string_ts_2_1;
        },
        function (type_ts_3_1) {
          type_ts_3 = type_ts_3_1;
        },
      ],
      execute: function () {
        StringType = class StringType extends type_ts_3.Type {
          parse(option, arg, value) {
            return string_ts_2.string(option, arg, value);
          }
          complete() {
            return [];
          }
        };
        exports_24("StringType", StringType);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/base-command",
  [
    "https://deno.land/std@v0.50.0/encoding/utf8",
    "https://deno.land/std@v0.50.0/fmt/colors",
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/flags",
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/types",
    "https://deno.land/x/cliffy@v0.6.1/packages/flags/lib/utils",
    "https://deno.land/x/cliffy@v0.6.1/packages/x/format",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/boolean",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/number",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/string",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/type",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/types",
  ],
  function (exports_25, context_25) {
    "use strict";
    var stdout,
      stderr,
      utf8_ts_1,
      colors_ts_1,
      flags_ts_2,
      types_ts_2,
      utils_ts_1,
      format_ts_1,
      boolean_ts_3,
      number_ts_3,
      string_ts_3,
      type_ts_4,
      types_ts_3,
      permissions,
      envPermissionStatus,
      hasEnvPermissions,
      BaseCommand;
    var __moduleName = context_25 && context_25.id;
    return {
      setters: [
        function (utf8_ts_1_1) {
          utf8_ts_1 = utf8_ts_1_1;
        },
        function (colors_ts_1_1) {
          colors_ts_1 = colors_ts_1_1;
        },
        function (flags_ts_2_1) {
          flags_ts_2 = flags_ts_2_1;
        },
        function (types_ts_2_1) {
          types_ts_2 = types_ts_2_1;
        },
        function (utils_ts_1_1) {
          utils_ts_1 = utils_ts_1_1;
        },
        function (format_ts_1_1) {
          format_ts_1 = format_ts_1_1;
        },
        function (boolean_ts_3_1) {
          boolean_ts_3 = boolean_ts_3_1;
        },
        function (number_ts_3_1) {
          number_ts_3 = number_ts_3_1;
        },
        function (string_ts_3_1) {
          string_ts_3 = string_ts_3_1;
        },
        function (type_ts_4_1) {
          type_ts_4 = type_ts_4_1;
        },
        function (types_ts_3_1) {
          types_ts_3 = types_ts_3_1;
        },
      ],
      execute: async function () {
        stdout = Deno.stdout, stderr = Deno.stderr;
        permissions = Deno.PermissionStatus;
        envPermissionStatus = permissions && permissions.query &&
          await permissions.query({ name: "env" });
        hasEnvPermissions = !!envPermissionStatus &&
          envPermissionStatus.state === "granted";
        /**
             * Base command implementation without pre configured command's and option's.
             */
        BaseCommand = class BaseCommand {
          constructor() {
            this.types = {
              string: new string_ts_3.StringType(),
              number: new number_ts_3.NumberType(),
              boolean: new boolean_ts_3.BooleanType(),
            };
            this.rawArgs = [];
            // @TODO: get script name: https://github.com/denoland/deno/pull/5034
            // protected name: string = location.pathname.split( '/' ).pop() as string;
            this.name = "COMMAND";
            this.path = this.name;
            this.ver = "0.0.0";
            this.desc = "No description ...";
            this.options = [];
            this.commands = new Map();
            this.examples = [];
            this.envVars = [];
            this.completions = {};
            this.cmd = this;
            this.isExecutable = false;
            this.throwOnError = false;
            this._allowEmpty = true;
            this._useRawArgs = false;
            this.args = [];
          }
          /**
                 * Add new sub-command.
                 */
          command(nameAndArguments, cmd, override) {
            let executableDescription;
            if (typeof cmd === "string") {
              executableDescription = cmd;
              cmd = undefined;
            }
            const result = this.splitArguments(nameAndArguments);
            const name = result.args.shift();
            const aliases = result.args;
            if (!name) {
              throw this.error(new Error("Missing command name."));
            }
            if (this.hasCommand(name)) {
              if (!override) {
                throw this.error(new Error(`Duplicate command: ${name}`));
              }
              this.removeCommand(name);
            }
            const subCommand = (cmd || new BaseCommand()).reset();
            subCommand.name = name;
            subCommand.setPath(this.path);
            this.throwOnError && subCommand.throwErrors();
            if (this.ver) {
              subCommand.version(this.ver);
            }
            if (executableDescription) {
              subCommand.isExecutable = true;
              subCommand.description(executableDescription);
            }
            if (result.typeDefinition) {
              subCommand.arguments(result.typeDefinition);
            }
            // if ( name === '*' && !subCommand.isExecutable ) {
            //     subCommand.isExecutable = true;
            // }
            this.commands.set(name, { name, cmd: subCommand, aliases });
            this.select(name);
            return this;
          }
          // public static async exists( name: string ) {
          //
          //     const proc = Deno.run( {
          //         cmd: [ 'sh', '-c', 'compgen -c' ],
          //         stdout: 'piped',
          //         stderr: 'piped'
          //     } );
          //     const output: Uint8Array = await proc.output();
          //     const commands = new TextDecoder().decode( output )
          //                                       .trim()
          //                                       .split( '\n' );
          //
          //     return commands.indexOf( name ) !== -1;
          // }
          /**
                 * Add new command alias.
                 *
                 * @param alias Alias name
                 */
          alias(alias) {
            if (!this.cmdName) {
              throw this.error(
                new Error(
                  `Failed to add alias '${alias}'. No sub command selected.`,
                ),
              );
            }
            if (this.hasCommand(alias)) {
              throw this.error(new Error(`Duplicate alias: ${alias}`));
            }
            this.getCommandMap(this.cmdName).aliases.push(alias);
            return this;
          }
          /**
                 * Reset internal command reference to main command.
                 */
          reset() {
            this.cmd = this;
            this.getCommands().forEach((cmd) => cmd.reset());
            return this;
          }
          /**
                 * Reset internal command reference to child command with given name.
                 *
                 * @param name Sub-command name.
                 */
          select(name) {
            this.cmd = this.getCommand(name);
            this.cmdName = name;
            return this;
          }
          /********************************************************************************
                 **** SUB HANDLER ***************************************************************
                 ********************************************************************************/
          /**
                 * Set command version.
                 *
                 * @param version Semantic version string.
                 */
          version(version) {
            this.cmd.ver = version;
            return this;
          }
          /**
                 * Set command description.
                 *
                 * @param description Short command description.
                 */
          description(description) {
            this.cmd.desc = description;
            return this;
          }
          /**
                 * Set command arguments.
                 *
                 * @param args Define required and optional commands like: <requiredArg:string> [optionalArg: number] [...restArgs:string]
                 */
          arguments(args) {
            this.cmd.argsDefinition = args;
            return this;
          }
          /**
                 * Set command handler.
                 *
                 * @param fn Callback method.
                 */
          action(fn) {
            this.cmd.fn = fn;
            this.reset();
            return this;
          }
          /**
                 * Don't throw an error if the command was called without arguments.
                 *
                 * @param allowEmpty
                 */
          allowEmpty(allowEmpty = true) {
            this.cmd._allowEmpty = allowEmpty;
            return this;
          }
          /**
                 * Disable parsing arguments. If enabled the raw arguments will be passed to the action handler.
                 * This has no effect for parent or child commands. Only for the command on which this method was called.
                 */
          useRawArgs(useRawArgs = true) {
            this.cmd._useRawArgs = useRawArgs;
            return this;
          }
          /**
                 * Set default command. The default command will be called if no action handler is registered.
                 */
          default(name) {
            this.cmd.defaultCommand = name;
            return this;
          }
          /**
                 * Register command specific custom type.
                 */
          type(type, typeHandler, override) {
            if (this.cmd.types[type] && !override) {
              throw this.error(new Error(`Type '${type}' already exists.`));
            }
            this.cmd.types[type] = typeHandler;
            return this;
          }
          /**
                 * Register command specific custom type.
                 */
          complete(action, completeHandler) {
            if (this.cmd.completions[action]) {
              throw this.error(
                new Error(`Completion '${action}' already exists.`),
              );
            }
            this.cmd.completions[action] = completeHandler;
            return this;
          }
          getActionNames() {
            return [
              ...Object.keys(this.cmd.completions),
              ...Object.keys(this.cmd.types),
            ];
          }
          /**
                 * Throw error's instead of calling `Deno.exit()` to handle error's manually.
                 * This has no effect for parent commands. Only for the command on which this method was called and all child commands.
                 */
          throwErrors() {
            this.cmd.throwOnError = true;
            this.getCommands().forEach((cmd) => cmd.throwErrors());
            return this;
          }
          async getCompletion(action) {
            if (this.cmd.completions[action]) {
              return this.cmd.completions[action]();
            }
            const type = this.cmd.types[action];
            if (type instanceof type_ts_4.Type) {
              return type.complete();
            }
            return undefined;
          }
          option(flags, desc, opts) {
            if (typeof opts === "function") {
              return this.option(flags, desc, { value: opts });
            }
            const result = this.splitArguments(flags);
            if (!result.typeDefinition) {
              result.typeDefinition = "[value:boolean]";
            }
            const args = result.typeDefinition
              ? this.parseArgsDefinition(result.typeDefinition)
              : [];
            const option = {
              name: "",
              description: desc,
              args,
              flags: result.args.join(", "),
              typeDefinition: result.typeDefinition || "[value:boolean]",
              ...opts,
            };
            for (const part of result.args) {
              const arg = part.trim();
              const isLong = /^--/.test(arg);
              const name = isLong ? arg.slice(2) : arg.slice(1);
              if (
                option.name === name ||
                option.aliases && ~option.aliases.indexOf(name)
              ) {
                throw this.error(new Error(`Duplicate command name: ${name}`));
              }
              if (!option.name && isLong) {
                option.name = name;
              } else if (!option.aliases) {
                option.aliases = [name];
              } else {
                option.aliases.push(name);
              }
              if (this.cmd.getOption(name)) {
                if (opts?.override) {
                  this.removeOption(name);
                } else {
                  throw this.error(new Error(`Duplicate option name: ${name}`));
                }
              }
            }
            this.cmd.options.push(option);
            return this;
          }
          /**
                 * Add new command example.
                 *
                 * @param name          Name of the example.
                 * @param description   The content of the example.
                 */
          example(name, description) {
            if (this.cmd.hasExample(name)) {
              throw this.error(new Error("Example already exists."));
            }
            this.cmd.examples.push({ name, description });
            return this;
          }
          /**
                 * Add new environment variable.
                 *
                 * @param name          Name of the environment variable.
                 * @param description   The description of the environment variable.
                 */
          env(name, description) {
            const result = this.splitArguments(name);
            if (!result.typeDefinition) {
              result.typeDefinition = "<value:boolean>";
            }
            if (result.args.some((envName) => this.cmd.hasEnvVar(envName))) {
              throw this.error(
                new Error(`Environment variable already exists: ${name}`),
              );
            }
            const details = this.parseArgsDefinition(result.typeDefinition);
            if (details.length > 1) {
              throw this.error(
                new Error(
                  `An environment variable can only have one value but got: ${name}`,
                ),
              );
            } else if (details.length && details[0].optionalValue) {
              throw this.error(
                new Error(
                  `An environment variable can not have an optional value but '${name}' is defined as optional.`,
                ),
              );
            } else if (details.length && details[0].variadic) {
              throw this.error(
                new Error(
                  `An environment variable can not have an variadic value but '${name}' is defined as variadic.`,
                ),
              );
            }
            this.cmd.envVars.push({
              names: result.args,
              description,
              type: result.typeDefinition,
              details: details.shift(),
            });
            return this;
          }
          /********************************************************************************
                 **** MAIN HANDLER **************************************************************
                 ********************************************************************************/
          /**
                 * Parse command line arguments and execute matched command.
                 *
                 * @param args Command line args to parse. Ex: `cmd.parse( Deno.args )`
                 * @param dry Execute command after parsed.
                 */
          async parse(args, dry) {
            // if ( !this.name ) {
            //     throw new Error( 'Missing command name' );
            // }
            this.reset();
            this.rawArgs = args;
            const subCommand = this.rawArgs.length &&
              this.hasCommand(this.rawArgs[0]) &&
              this.getCommand(this.rawArgs[0]);
            if (subCommand) {
              return await subCommand.parse(this.rawArgs.slice(1), dry);
            }
            if (this.isExecutable) {
              if (!dry) {
                await this.executeExecutable(this.rawArgs);
              }
              return { options: {}, args: this.rawArgs, cmd: this };
            } else if (this._useRawArgs) {
              if (dry) {
                return { options: {}, args: this.rawArgs, cmd: this };
              }
              return await this.execute({}, ...this.rawArgs);
            } else {
              const { flags, unknown } = this.parseFlags(this.rawArgs, true);
              const params = this.parseArguments(unknown, flags);
              this.validateEnvVars();
              if (dry) {
                return { options: flags, args: params, cmd: this };
              }
              return await this.execute(flags, ...params);
            }
          }
          /**
                 * Execute command.
                 *
                 * @param options A map of options.
                 * @param args Command arguments.
                 */
          async execute(options = {}, ...args) {
            const actionOption = this.findActionFlag(options, args);
            if (actionOption && actionOption.action) {
              await actionOption.action(options, ...args);
              return { options, args, cmd: this };
            }
            if (this.fn) {
              try {
                await this.fn(options, ...args);
              } catch (e) {
                throw this.error(e);
              }
            } else if (this.defaultCommand) {
              if (!this.hasCommand(this.defaultCommand)) {
                throw this.error(
                  new Error(
                    `Default command '${this.defaultCommand}' not found.`,
                  ),
                );
              }
              try {
                await this.getCommand(this.defaultCommand).execute(
                  options,
                  ...args,
                );
              } catch (e) {
                throw this.error(e);
              }
            }
            return { options, args, cmd: this };
          }
          /**
                 * Execute external sub-command.
                 *
                 * @param args Raw command line arguments.
                 */
          async executeExecutable(args) {
            const [main, ...names] = this.path.split(" ");
            names.unshift(main.replace(/\.ts$/, ""));
            const executable = names.join("-");
            try {
              // @TODO: create getEnv() method which should return all known environment variables and pass it to Deno.run({env})
              await Deno.run({
                cmd: [executable, ...args],
              });
              return;
            } catch (e) {
              if (!e.message.match(/No such file or directory/)) {
                throw e;
              }
            }
            try {
              await Deno.run({
                cmd: [executable + ".ts", ...args],
              });
              return;
            } catch (e) {
              if (!e.message.match(/No such file or directory/)) {
                throw e;
              }
            }
            throw this.error(
              new Error(
                `Sub-command executable not found: ${executable}${
                  colors_ts_1.dim("(.ts)")
                }`,
              ),
            );
          }
          /**
                 * Parse command line args.
                 *
                 * @param args          Command line args.
                 * @param stopEarly     Stop early.
                 * @param knownFlaks    Known command line args.
                 */
          parseFlags(args, stopEarly, knownFlaks) {
            try {
              return flags_ts_2.parseFlags(args, {
                stopEarly,
                knownFlaks,
                allowEmpty: this._allowEmpty,
                flags: this.options,
                parse: (type, option, arg, nextValue) => {
                  const parser = this.types[type];
                  return parser instanceof type_ts_4.Type
                    ? parser.parse(option, arg, nextValue)
                    : parser(option, arg, nextValue);
                },
              });
            } catch (e) {
              throw this.error(e);
            }
          }
          /**
                 * Validate environment variables.
                 */
          validateEnvVars() {
            if (!this.envVars.length) {
              return;
            }
            if (hasEnvPermissions) {
              this.envVars.forEach((env) => {
                const name = env.names.find((name) => !!Deno.env.get(name));
                if (name) {
                  const value = Deno.env.get(name);
                  try {
                    // @TODO: optimize handling for environment variable error message: parseFlag & parseEnv ?
                    const parser = this.types[env.type];
                    parser instanceof type_ts_4.Type
                      ? parser.parse({ name }, env, value || "")
                      : parser({ name }, env, value || "");
                  } catch (e) {
                    throw new Error(
                      `Environment variable '${name}' must be of type ${env.type} but got: ${value}`,
                    );
                  }
                }
              });
            }
          }
          /**
                 * Split arguments string into args and types: -v, --verbose [arg:boolean]
                 *
                 * @param args Arguments definition.
                 */
          splitArguments(args) {
            // const parts = args.trim().split( /[,<\[]/g ).map( ( arg: string ) => arg.trim() );
            // const typeParts: string[] = [];
            //
            // while ( parts[ parts.length - 1 ] && parts[ parts.length - 1 ].match( /[\]>]$/ ) ) {
            //     let arg = parts.pop() as string;
            //     const lastPart = arg.slice( 0, -1 );
            //     arg = lastPart === ']' ? `[${ arg }` : `<${ arg }`;
            //     typeParts.unshift( arg );
            // }
            //
            // const typeDefinition: string | undefined = typeParts.join( ' ' ) || undefined;
            //
            // return { args: parts, typeDefinition };
            const parts = args.trim().split(/[, =] */g);
            const typeParts = [];
            while (
              parts[parts.length - 1] &&
              parts[parts.length - 1].match(/^[<\[].+[\]>]$/)
            ) {
              typeParts.unshift(parts.pop());
            }
            const typeDefinition = typeParts.join(" ") || undefined;
            return { args: parts, typeDefinition };
          }
          /**
                 * Match commands and arguments from command line arguments.
                 *
                 * @param args
                 */
          parseArguments(args, flags) {
            const params = [];
            // remove array reference
            args = args.slice(0);
            if (!this.hasArguments()) {
              if (args.length) {
                if (this.hasCommands()) {
                  throw this.error(
                    new Error(`Unknown command: ${args.join(" ")}`),
                  );
                } else {
                  throw this.error(
                    new Error(`No arguments allowed for command: ${this.name}`),
                  );
                }
              }
            } else {
              if (!args.length) {
                const required = this.getArguments()
                  .filter((expectedArg) => !expectedArg.optionalValue)
                  .map((expectedArg) => expectedArg.name);
                if (required.length) {
                  const flagNames = Object.keys(flags);
                  const isStandaloneOption = flagNames.length === 1 &&
                    this.getOption(flagNames[0])?.standalone;
                  if (required.length && !isStandaloneOption) {
                    throw this.error(
                      new Error("Missing argument(s): " + required.join(", ")),
                    );
                  }
                }
                return params;
              }
              for (const expectedArg of this.getArguments()) {
                if (!expectedArg.optionalValue && !args.length) {
                  throw this.error(
                    new Error(`Missing argument: ${expectedArg.name}`),
                  );
                }
                let arg;
                if (expectedArg.variadic) {
                  arg = args.splice(0, args.length);
                } else {
                  arg = args.shift();
                }
                if (arg) {
                  params.push(arg);
                }
              }
              if (args.length) {
                throw this.error(
                  new Error(`To many arguments: ${args.join(" ")}`),
                );
              }
            }
            return params;
          }
          /**
                 * Parse command line args definition.
                 *
                 * @param argsDefinition Arguments definition: <arg1:string> [arg2:number]
                 */
          parseArgsDefinition(argsDefinition) {
            const args = [];
            let hasOptional = false;
            let hasVariadic = false;
            const parts = argsDefinition.split(/ +/);
            for (const arg of parts) {
              if (hasVariadic) {
                throw this.error(
                  new Error("An argument can not follow an variadic argument."),
                );
              }
              const parts = arg.split(/[<\[:>\]]/);
              const type = parts[2] ? parts[2] : types_ts_2.OptionType.STRING;
              let details = {
                optionalValue: arg[0] !== "<",
                name: parts[1],
                action: parts[3] || type,
                variadic: false,
                list: type ? arg.indexOf(type + "[]") !== -1 : false,
                type,
              };
              if (!details.optionalValue && hasOptional) {
                throw this.error(
                  new Error(
                    "An required argument can not follow an optional argument.",
                  ),
                );
              }
              if (arg[0] === "[") {
                hasOptional = true;
              }
              if (details.name.length > 3) {
                const istVariadicLeft = details.name.slice(0, 3) === "...";
                const istVariadicRight = details.name.slice(-3) === "...";
                hasVariadic = details.variadic = istVariadicLeft ||
                  istVariadicRight;
                if (istVariadicLeft) {
                  details.name = details.name.slice(3);
                } else if (istVariadicRight) {
                  details.name = details.name.slice(0, -3);
                }
              }
              if (details.name) {
                args.push(details);
              }
            }
            return args;
          }
          /**
                 * Execute help command if help flag is set.
                 *
                 * @param flags Command options.
                 * @param args Command arguments.
                 */
          findActionFlag(flags, args) {
            const flagNames = Object.keys(flags);
            for (const flag of flagNames) {
              const option = this.getOption(flag);
              if (option?.action) {
                return option;
              }
            }
            return;
          }
          /********************************************************************************
                 **** GETTER ********************************************************************
                 ********************************************************************************/
          /**
                 * Get command name.
                 */
          getName() {
            return this.name;
          }
          /**
                 * Get full command path of all parent command names's and current command name.
                 */
          getPath() {
            return this.path;
          }
          /**
                 * Set command path.
                 *
                 * @param path Command path.
                 */
          setPath(path) {
            this.path = `${path} ${this.name}`;
            this.getCommands().forEach((command) => command.setPath(this.path));
            return this;
          }
          /**
                 * Get arguments definition.
                 */
          getArgsDefinition() {
            return this.argsDefinition;
          }
          /**
                 * Get argument.
                 */
          getArgument(name) {
            return this.getArguments().find((arg) => arg.name === name);
          }
          /**
                 * Get arguments.
                 */
          getArguments() {
            if (!this.args.length && this.argsDefinition) {
              this.args = this.parseArgsDefinition(this.argsDefinition);
            }
            return this.args;
          }
          /**
                 * Check if command has arguments.
                 */
          hasArguments() {
            return !!this.argsDefinition;
          }
          /**
                 * Get command arguments.
                 */
          getVersion() {
            return this.ver;
          }
          /**
                 * Get command description.
                 */
          getDescription() {
            return this.desc;
          }
          getShortDescription() {
            return this.getDescription()
              .trim()
              .split("\n")
              .shift();
          }
          /**
                 * Checks whether the command has options or not.
                 */
          hasOptions() {
            return this.options.length > 0;
          }
          getOptions() {
            return this.options;
          }
          /**
                 * Checks whether the command has an option with given name not.
                 */
          hasOption(name) {
            return !!this.getOption(name);
          }
          /**
                 * Get option by name.
                 *
                 * @param name Name of the option. Must be in param-case.
                 */
          getOption(name) {
            return this.options.find((option) => option.name === name);
          }
          /**
                 * Remove option by name.
                 *
                 * @param name Name of the option. Must be in param-case.
                 */
          removeOption(name) {
            const index = this.options.findIndex((option) =>
              option.name === name
            );
            if (index === -1) {
              return;
            }
            return this.options.splice(index, 1)[0];
          }
          /**
                 * Checks whether the command has sub-commands or not.
                 */
          hasCommands() {
            return this.commands.size > 0;
          }
          /**
                 * Get sub-command maps.
                 */
          getCommandMaps() {
            return Array.from(this.commands.values());
          }
          /**
                 * Get sub-commands.
                 */
          getCommands() {
            return this.getCommandMaps().map((cmd) => cmd.cmd);
          }
          /**
                 * Checks whether the command has a sub-command with given name or not.
                 *
                 * @param name Name of the command.
                 */
          hasCommand(name) {
            return this.commands.has(name);
          }
          /**
                 * Get sub-command with given name.
                 *
                 * @param name Name of the sub-command.
                 */
          getCommand(name) {
            return this.getCommandMap(name).cmd;
          }
          /**
                 * Get sub-command map with given name.
                 *
                 * @param name Name of the sub-command.
                 */
          getCommandMap(name) {
            const cmd = this.commands.get(name);
            // || this.commands.get( '*' );
            if (!cmd) {
              throw this.error(new Error(`Sub-command not found: ${name}`));
            }
            return cmd;
          }
          /**
                 * Remove sub-command with given name.
                 *
                 * @param name Name of the command.
                 */
          removeCommand(name) {
            const command = this.getCommand(name);
            this.commands.delete(name);
            return command;
          }
          /**
                 * Checks whether the command has environment variables or not.
                 */
          hasEnvVars() {
            return this.envVars.length > 0;
          }
          /**
                 * Get environment variables.
                 */
          getEnvVars() {
            return this.envVars;
          }
          /**
                 * Checks whether the command has an environment variable with given name or not.
                 *
                 * @param name Name of the environment variable.
                 */
          hasEnvVar(name) {
            return !!this.getEnvVar(name);
          }
          /**
                 * Get environment variable with given name.
                 *
                 * @param name Name of the example.
                 */
          getEnvVar(name) {
            return this.envVars.find((env) => env.names.indexOf(name) !== -1)
              ?.description;
          }
          /**
                 * Checks whether the command has examples or not.
                 */
          hasExamples() {
            return this.examples.length > 0;
          }
          /**
                 * Get examples.
                 */
          getExamples() {
            return this.examples;
          }
          /**
                 * Checks whether the command has an example with given name or not.
                 *
                 * @param name Name of the example.
                 */
          hasExample(name) {
            return !!this.getExample(name);
          }
          /**
                 * Get example with given name.
                 *
                 * @param name Name of the example.
                 */
          getExample(name) {
            return this.examples.find((example) => example.name === name);
          }
          /********************************************************************************
                 **** HELPER ********************************************************************
                 ********************************************************************************/
          /**
                 * Write line to stdout without line break.
                 *
                 * @param args Data to write to stdout.
                 */
          write(...args) {
            stdout.writeSync(
              utf8_ts_1.encode(
                utils_ts_1.fill(2) + format_ts_1.default(...args),
              ),
            );
          }
          /**
                 * Write line to stderr without line break.
                 *
                 * @param args Data to write to stdout.
                 */
          writeError(...args) {
            stderr.writeSync(
              utf8_ts_1.encode(
                utils_ts_1.fill(2) +
                  colors_ts_1.red(
                    format_ts_1.default(`[ERROR:${this.name}]`, ...args),
                  ),
              ),
            );
          }
          /**
                 * Write line to stdout.
                 *
                 * @param args Data to write to stdout.
                 */
          log(...args) {
            this.write(...args, "\n");
          }
          /**
                 * Write line to stderr.
                 *
                 * @param args Data to write to stderr.
                 */
          logError(...args) {
            this.writeError(...args, "\n");
          }
          /**
                 * Handle error. If throwOnError is enabled all error's will be thrown, if not `Deno.exit(1)` will be called.
                 *
                 * @param error Error to handle.
                 * @param showHelp Show help.
                 */
          error(error, showHelp = true) {
            if (this.throwOnError) {
              return error;
            }
            const CLIFFY_DEBUG = hasEnvPermissions
              ? !!Deno.env.get("CLIFFY_DEBUG")
              : false;
            showHelp && this.help();
            this.logError(CLIFFY_DEBUG ? error : error.message);
            this.log();
            Deno.exit(1);
          }
          /**
                 * Execute help command.
                 */
          help() {
            this.getHelpCommand().show();
          }
          getHelpCommand() {
            if (!this.hasCommand("help")) {
              throw this.error(new Error(`No help command registered.`), false);
            }
            const helpCommand = this.getCommand("help");
            if (!types_ts_3.isHelpCommand(helpCommand)) {
              throw this.error(
                new Error(
                  `The registered help command does not correctly implement interface IHelpCommand.`,
                ),
                false,
              );
            }
            return helpCommand;
          }
        };
        exports_25("BaseCommand", BaseCommand);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/types",
  [],
  function (exports_26, context_26) {
    "use strict";
    var __moduleName = context_26 && context_26.id;
    function isHelpCommand(cmd) {
      return typeof cmd.show === "function";
    }
    exports_26("isHelpCommand", isHelpCommand);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/border",
  [],
  function (exports_27, context_27) {
    "use strict";
    var border;
    var __moduleName = context_27 && context_27.id;
    return {
      setters: [],
      execute: function () {
        exports_27(
          "border",
          border = {
            top: "─",
            topMid: "┬",
            topLeft: "┌",
            topRight: "┐",
            bottom: "─",
            bottomMid: "┴",
            bottomLeft: "└",
            bottomRight: "┘",
            left: "│",
            leftMid: "├",
            mid: "─",
            midMid: "┼",
            right: "│",
            rightMid: "┤",
            middle: "│",
          },
        );
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/cell",
  [],
  function (exports_28, context_28) {
    "use strict";
    var Cell;
    var __moduleName = context_28 && context_28.id;
    return {
      setters: [],
      execute: function () {
        Cell = class Cell extends String {
          constructor() {
            super(...arguments);
            this.options = {};
          }
          static from(cell) {
            if (cell instanceof Cell) {
              return cell.clone();
            }
            return new this(cell);
          }
          clone(value) {
            const clone = new Cell(value ?? this);
            clone.options = Object.create(this.options);
            return clone;
          }
          /**
                 * Setter:
                 */
          border(enable, override = true) {
            if (override || typeof this.options.border === "undefined") {
              this.options.border = enable;
            }
            return this;
          }
          /**
                 * Getter:
                 */
          getBorder(defaultValue) {
            return this.options.border ?? defaultValue;
          }
        };
        exports_28("Cell", Cell);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/const",
  [],
  function (exports_29, context_29) {
    "use strict";
    var MIN_CELL_WIDTH, MAX_CELL_WIDTH, CELL_PADDING;
    var __moduleName = context_29 && context_29.id;
    return {
      setters: [],
      execute: function () {
        exports_29("MIN_CELL_WIDTH", MIN_CELL_WIDTH = 0);
        exports_29("MAX_CELL_WIDTH", MAX_CELL_WIDTH = Infinity);
        exports_29("CELL_PADDING", CELL_PADDING = 0);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/row",
  [],
  function (exports_30, context_30) {
    "use strict";
    var Row;
    var __moduleName = context_30 && context_30.id;
    return {
      setters: [],
      execute: function () {
        Row = class Row extends Array {
          constructor() {
            super(...arguments);
            this.options = {};
          }
          static from(row) {
            if (row instanceof Row) {
              return row.clone();
            }
            return new Row(...row);
          }
          clone() {
            const clone = new Row(...this);
            clone.options = Object.create(this.options);
            return clone;
          }
          /**
                 * Setter:
                 */
          border(enable, override = true) {
            if (override || typeof this.options.border === "undefined") {
              this.options.border = enable;
            }
            return this;
          }
          /**
                 * Getter:
                 */
          getBorder(defaultValue) {
            return this.options.border ?? defaultValue;
          }
        };
        exports_30("Row", Row);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/utils",
  [],
  function (exports_31, context_31) {
    "use strict";
    var COLOR_REGEX;
    var __moduleName = context_31 && context_31.id;
    /**
     * Get next words from the beginning of [content] until all words have a length lower or equal then [length].
     *
     * @param length    Max length of all words.
     * @param content   The text content.
     */
    function consumeWords(length, content) {
      let consumed = "";
      const words = content.split(/ /g);
      for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let hasLineBreak = word.indexOf("\n") !== -1;
        if (hasLineBreak) {
          word = word.split("\n").shift();
        }
        // consume minimum one word
        if (consumed) {
          const nextLength = stripeColors(word).length;
          const consumedLength = stripeColors(consumed).length;
          if (consumedLength + nextLength >= length) {
            break;
          }
        }
        consumed += (i > 0 ? " " : "") + word;
        if (hasLineBreak) {
          break;
        }
      }
      return consumed;
    }
    exports_31("consumeWords", consumeWords);
    /**
     * Remove color codes from string.
     *
     * @param str
     */
    function stripeColors(str) {
      return str.replace(COLOR_REGEX, "");
    }
    exports_31("stripeColors", stripeColors);
    /**
     * Fill string with given char until the string has a specified length.
     *
     * @param count The length until the string will be filled.
     * @param str   The string to fill.
     * @param char  The char to fill the string with.
     */
    function fill(count, str = "", char = " ") {
      let length = stripeColors(str).length;
      while (length < count) {
        str += char;
        length += char.length;
      }
      return str;
    }
    exports_31("fill", fill);
    /**
     * Get longest cell from given row index.
     *
     */
    function longest(index, rows, maxWidth) {
      return Math.max(
        ...rows.map((row) =>
          (row[index] || "")
            .split("\n")
            .map((r) => {
              const str = typeof maxWidth === "undefined"
                ? r
                : consumeWords(maxWidth, r);
              return stripeColors(str).length || 0;
            })
        ).flat(),
      );
    }
    exports_31("longest", longest);
    return {
      setters: [],
      execute: function () {
        COLOR_REGEX = /(\x1b|\e|\033)\[([0-9]{1,3}(;[0-9]{1,2})?)?[mGK]/g;
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/table",
  [
    "https://deno.land/std@v0.50.0/encoding/utf8",
    "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/border",
    "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/cell",
    "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/const",
    "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/row",
    "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/utils",
  ],
  function (exports_32, context_32) {
    "use strict";
    var utf8_ts_2,
      border_ts_1,
      cell_ts_1,
      const_ts_1,
      row_ts_1,
      utils_ts_2,
      Table;
    var __moduleName = context_32 && context_32.id;
    return {
      setters: [
        function (utf8_ts_2_1) {
          utf8_ts_2 = utf8_ts_2_1;
        },
        function (border_ts_1_1) {
          border_ts_1 = border_ts_1_1;
        },
        function (cell_ts_1_1) {
          cell_ts_1 = cell_ts_1_1;
        },
        function (const_ts_1_1) {
          const_ts_1 = const_ts_1_1;
        },
        function (row_ts_1_1) {
          row_ts_1 = row_ts_1_1;
        },
        function (utils_ts_2_1) {
          utils_ts_2 = utils_ts_2_1;
        },
      ],
      execute: function () {
        Table = class Table extends Array {
          constructor() {
            super(...arguments);
            this.options = {};
          }
          static from(rows) {
            const table = new Table(...rows.map((cells) => [...cells]));
            if (rows instanceof Table) {
              table.options = Object.create(rows.options);
            }
            return table;
          }
          static render(rows) {
            Table.from(rows).render();
          }
          render() {
            Deno.stdout.writeSync(utf8_ts_2.encode(this.toString()));
          }
          /**
                 * Calc:
                 */
          calc() {
            const padding = [];
            const width = [];
            const columns = Math.max(
              ...this.map((row) => Object.keys(row).length),
            );
            for (let colIndex = 0; colIndex < columns; colIndex++) {
              let minCellWidth = Array.isArray(this.options.minCellWidth)
                ? this.options.minCellWidth[colIndex]
                : (typeof this.options.minCellWidth === "undefined"
                  ? const_ts_1.MIN_CELL_WIDTH
                  : this.options.minCellWidth);
              let maxCellWidth = Array.isArray(this.options.maxCellWidth)
                ? this.options.maxCellWidth[colIndex]
                : (typeof this.options.maxCellWidth === "undefined"
                  ? const_ts_1.MAX_CELL_WIDTH
                  : this.options.maxCellWidth);
              padding[colIndex] = Array.isArray(this.options.padding)
                ? this.options.padding[colIndex]
                : (typeof this.options.padding === "undefined"
                  ? const_ts_1.CELL_PADDING
                  : this.options.padding);
              let cellWidth = utils_ts_2.longest(colIndex, this, maxCellWidth);
              // let cellWidth: number = longest( colIndex, this );
              width[colIndex] = Math.min(
                maxCellWidth,
                Math.max(minCellWidth, cellWidth),
              );
            }
            return { padding, width, columns };
          }
          getRows() {
            return this.map((iRow) => {
              const row = row_ts_1.Row.from(iRow);
              if (this.options.border) {
                row.border(this.options.border, false);
              }
              row.forEach((iCell, i) => {
                const cell = cell_ts_1.Cell.from(iCell);
                if (row.getBorder()) {
                  cell.border(row.getBorder(), false);
                }
                row[i] = cell;
              });
              return row;
            });
          }
          /**
                 * Render:
                 */
          toString() {
            const calc = this.calc();
            const rows = this.getRows();
            return this.renderRows(calc, rows);
          }
          renderRows(opts, rows, _rowGroupIndex = 0) {
            let result = "";
            result += this.renderRow(
              rows[_rowGroupIndex],
              rows[_rowGroupIndex - 1],
              rows[_rowGroupIndex + 1],
              opts,
              _rowGroupIndex,
            );
            if (_rowGroupIndex < this.length - 1) {
              result += this.renderRows(opts, rows, ++_rowGroupIndex);
            }
            return result;
          }
          renderRow(
            row,
            prevRow,
            nextRow,
            opts,
            _rowGroupIndex = 0,
            _rowIndex = 0,
          ) {
            let result = "";
            if (row.getBorder() && _rowGroupIndex === 0 && _rowIndex === 0) {
              result += this.renderBorderTopRow(row, prevRow, nextRow, opts);
            }
            const { cells, isMultilineRow } = this.renderCells(row, opts);
            result += cells;
            if (isMultilineRow) {
              result += this.renderRow(
                row,
                prevRow,
                nextRow,
                opts,
                _rowGroupIndex,
                ++_rowIndex,
              );
            } else if (_rowGroupIndex < this.length - 1) {
              if (row.getBorder()) {
                result += this.renderBorderMidRow(row, prevRow, nextRow, opts);
              }
            } else if (_rowGroupIndex === this.length - 1) {
              if (row.getBorder()) {
                result += this.renderBorderBottomRow(
                  row,
                  prevRow,
                  nextRow,
                  opts,
                );
              }
            } else {
              throw new Error(`Invalid row index: ${_rowGroupIndex}`);
            }
            return result;
          }
          renderCells(row, opts) {
            let cells = " ".repeat(this.options.indent || 0);
            let isMultilineRow = false;
            const rowCount = row.length;
            let prev;
            for (let i = 0; i < rowCount; i++) {
              const cell = row[i];
              if (i === 0) {
                if (cell.getBorder()) {
                  cells += border_ts_1.border.left;
                } else {
                  // cells += ' ';
                }
              }
              const { current, next } = this.renderCell(cell, opts.width[i]);
              // it's required to call explicilty .length because next is a String class and not a string type.
              next.length && (isMultilineRow = true);
              row[i] = next;
              if (i > 0) {
                if (cell.getBorder() && (!prev || prev.getBorder())) {
                  cells += border_ts_1.border.middle;
                } else {
                  // cells += ' ';
                }
              }
              if (cell.getBorder()) {
                cells += " ".repeat(opts.padding[i]);
              }
              cells += current;
              if (cell.getBorder() || i < rowCount - 1) {
                cells += " ".repeat(opts.padding[i]);
              }
              if (i === rowCount - 1) {
                if (cell.getBorder()) {
                  cells += border_ts_1.border.right;
                } else {
                  // cells += ' ';
                }
              }
              prev = cell;
            }
            cells += "\n";
            return { cells, isMultilineRow };
          }
          renderCell(cell, maxLength) {
            const length = Math.min(
              maxLength,
              utils_ts_2.stripeColors(cell.toString()).length,
            );
            const words = utils_ts_2.consumeWords(length, cell.toString());
            const next = cell.slice(words.length + 1);
            const fillLength = maxLength -
              utils_ts_2.stripeColors(words).length;
            const current = words + " ".repeat(fillLength);
            return {
              current,
              next: cell.clone(next),
            };
          }
          /**
                 * Border:
                 */
          renderBorderTopRow(row, prevRow, nextRow, opts) {
            let cells = [];
            for (let i = 0; i < opts.columns; i++) {
              const cell = row[i];
              cells.push(
                (cell.getBorder() ? border_ts_1.border.top : " ").repeat(
                  opts.padding[i] + opts.width[i] + opts.padding[i],
                ),
              );
            }
            return " ".repeat(this.options.indent || 0) +
              border_ts_1.border.topLeft +
              cells.join(border_ts_1.border.topMid) +
              (border_ts_1.border.topRight) + "\n";
          }
          renderBorderMidRow(row, prevRow, nextRow, opts) {
            let cells = [];
            for (let i = 0; i < opts.columns; i++) {
              const cell = row[i];
              const nextCell = nextRow && nextRow[i];
              cells.push(
                (cell.getBorder() && nextCell?.getBorder() !== false
                  ? border_ts_1.border.mid
                  : " ").repeat(
                    opts.padding[i] + opts.width[i] + opts.padding[i],
                  ),
              );
            }
            return " ".repeat(this.options.indent || 0) +
              border_ts_1.border.leftMid +
              cells.join(border_ts_1.border.midMid) +
              (border_ts_1.border.rightMid) + "\n";
          }
          renderBorderBottomRow(row, prevRow, nextRow, opts) {
            let cells = [];
            for (let i = 0; i < opts.columns; i++) {
              const cell = row[i];
              cells.push(
                (cell.getBorder() ? border_ts_1.border.bottom : " ").repeat(
                  opts.padding[i] + opts.width[i] + opts.padding[i],
                ),
              );
            }
            return " ".repeat(this.options.indent || 0) +
              border_ts_1.border.bottomLeft +
              cells.join(border_ts_1.border.bottomMid) +
              (border_ts_1.border.bottomRight) + "\n";
          }
          /**
                 * Setter:
                 */
          indent(width, override = true) {
            if (override || typeof this.options.indent === "undefined") {
              this.options.indent = width;
            }
            return this;
          }
          maxCellWidth(width, override = true) {
            if (override || typeof this.options.maxCellWidth === "undefined") {
              this.options.maxCellWidth = width;
            }
            return this;
          }
          minCellWidth(width, override = true) {
            if (override || typeof this.options.minCellWidth === "undefined") {
              this.options.minCellWidth = width;
            }
            return this;
          }
          padding(padding, override = true) {
            if (override || typeof this.options.padding === "undefined") {
              this.options.padding = padding;
            }
            return this;
          }
          border(enable, override = true) {
            if (override || typeof this.options.border === "undefined") {
              this.options.border = enable;
            }
            return this;
          }
          /**
                 * Getter:
                 */
          getIndent(defaultValue) {
            return this.options.indent ?? defaultValue;
          }
          getMaxCellWidth(defaultValue) {
            return this.options.maxCellWidth ?? defaultValue;
          }
          getMinCellWidth(defaultValue) {
            return this.options.minCellWidth ?? defaultValue;
          }
          getPadding(defaultValue) {
            return this.options.padding ?? defaultValue;
          }
          getBorder(defaultValue) {
            return this.options.border ?? defaultValue;
          }
        };
        exports_32("Table", Table);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/types/command-list",
  ["https://deno.land/x/cliffy@v0.6.1/packages/command/types/string"],
  function (exports_33, context_33) {
    "use strict";
    var string_ts_4, CommandListType;
    var __moduleName = context_33 && context_33.id;
    return {
      setters: [
        function (string_ts_4_1) {
          string_ts_4 = string_ts_4_1;
        },
      ],
      execute: function () {
        CommandListType = class CommandListType extends string_ts_4.StringType {
          constructor(cmd) {
            super();
            this.cmd = cmd;
          }
          complete() {
            return this.cmd.getCommands().map(((cmd) => cmd.getName()));
          }
        };
        exports_33("CommandListType", CommandListType);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/commands/help",
  [
    "https://deno.land/std@v0.50.0/fmt/colors",
    "https://deno.land/x/cliffy@v0.6.1/packages/table/lib/table",
    "https://deno.land/x/cliffy@v0.6.1/packages/x/format",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/base-command",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/command-list",
  ],
  function (exports_34, context_34) {
    "use strict";
    var colors_ts_2,
      table_ts_1,
      format_ts_2,
      base_command_ts_1,
      command_list_ts_1,
      HelpCommand;
    var __moduleName = context_34 && context_34.id;
    function capitalize(string) {
      if (!string) {
        return "";
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return {
      setters: [
        function (colors_ts_2_1) {
          colors_ts_2 = colors_ts_2_1;
        },
        function (table_ts_1_1) {
          table_ts_1 = table_ts_1_1;
        },
        function (format_ts_2_1) {
          format_ts_2 = format_ts_2_1;
        },
        function (base_command_ts_1_1) {
          base_command_ts_1 = base_command_ts_1_1;
        },
        function (command_list_ts_1_1) {
          command_list_ts_1 = command_list_ts_1_1;
        },
      ],
      execute: function () {
        /**
             * Generates well formatted and colored help output for specified command.
             */
        HelpCommand = class HelpCommand extends base_command_ts_1.BaseCommand {
          constructor(parent) {
            super();
            this.parent = parent;
            this
              .type(
                "command",
                new command_list_ts_1.CommandListType(this.parent),
              )
              .arguments("[command:command]")
              .description("Show this help or the help of a sub-command.")
              .action((flags, name) => {
                this.show(name);
                Deno.exit(0);
              });
          }
          /**
                 * Render help output.
                 */
          show(name) {
            const cmd = name ? this.parent.getCommand(name) : this.parent;
            const indent = 2;
            const renderHelp = () => {
              // Header
              renderLine();
              table_ts_1.Table.from(getHeader())
                .indent(indent)
                .padding(1)
                .render();
              // Description
              if (cmd.getDescription()) {
                renderLabel("Description");
                table_ts_1.Table.from(getDescription())
                  .indent(indent * 2)
                  .maxCellWidth(140)
                  .padding(1)
                  .render();
              }
              // Options
              if (cmd.hasOptions()) {
                renderLabel("Options");
                table_ts_1.Table.from(getOptions())
                  .padding([2, 2, 1, 2])
                  .indent(indent * 2)
                  .maxCellWidth([60, 60, 80, 60])
                  .render();
              }
              // Commands
              if (cmd.hasCommands()) {
                renderLabel("Commands");
                table_ts_1.Table.from(getCommands())
                  .padding([2, 2, 1, 2])
                  .indent(indent * 2)
                  .render();
              }
              // Environment variables
              if (cmd.hasEnvVars()) {
                renderLabel("Environment variables");
                table_ts_1.Table.from(getEnvVars())
                  .padding(2)
                  .indent(indent * 2)
                  .render();
              }
              // Examples
              if (cmd.hasExamples()) {
                renderLabel("Examples");
                table_ts_1.Table.from(getExamples())
                  .padding(1)
                  .indent(indent * 2)
                  .maxCellWidth(150)
                  .render();
              }
              renderLine();
            };
            const renderLine = (...args) => this.log(...args);
            const renderLabel = (label) => {
              renderLine();
              renderLine(colors_ts_2.bold(`${label}:`));
              renderLine();
            };
            const getHeader = () => {
              return [
                [
                  colors_ts_2.bold("Usage:"),
                  colors_ts_2.magenta(
                    `${cmd.getName()}${
                      cmd.getArgsDefinition()
                        ? " " + cmd.getArgsDefinition()
                        : ""
                    }`,
                  ),
                ],
                [
                  colors_ts_2.bold("Version:"),
                  colors_ts_2.yellow(`v${cmd.getVersion()}`),
                ],
              ];
            };
            const getDescription = () => {
              return [
                [cmd.getDescription()],
              ];
            };
            const getOptions = () => {
              return [
                ...cmd.getOptions().map((option) => [
                  option.flags.split(/,? +/g).map((flag) =>
                    colors_ts_2.blue(flag)
                  ).join(", "),
                  this.highlight(option.typeDefinition || ""),
                  colors_ts_2.red(colors_ts_2.bold("-")),
                  option.description.split("\n").shift(),
                  getHints(option),
                ]),
              ];
            };
            const getCommands = () => {
              return [
                ...cmd.getCommandMaps().map((command) => [
                  [command.name, ...command.aliases].map((name) =>
                    colors_ts_2.blue(name)
                  ).join(", "),
                  this.highlight(command.cmd.getArgsDefinition() || ""),
                  colors_ts_2.red(colors_ts_2.bold("-")),
                  command.cmd.getDescription().split("\n").shift(),
                ]),
              ];
            };
            const getEnvVars = () => {
              return [
                ...cmd.getEnvVars().map((envVar) => [
                  envVar.names.map((name) => colors_ts_2.blue(name)).join(", "),
                  this.highlight(envVar.type),
                  `${
                    colors_ts_2.red(colors_ts_2.bold("-"))
                  } ${envVar.description}`,
                ]),
              ];
            };
            const getExamples = () => {
              let first = true;
              const rows = [];
              cmd.getExamples().map((example) => {
                if (!first) {
                  rows.push([]);
                }
                first = false;
                rows.push([
                  colors_ts_2.dim(
                    colors_ts_2.bold(`${capitalize(example.name)}:`),
                  ),
                  `\n${example.description}`,
                ]);
              });
              return rows;
            };
            const getHints = (option) => {
              const hints = [];
              if (option.required || option.conflicts) {
                option.required && hints.push(colors_ts_2.yellow(`required`));
                typeof option.default !== "undefined" &&
                  hints.push(
                    colors_ts_2.blue(colors_ts_2.bold(`Default: `)) +
                      colors_ts_2.blue(format_ts_2.default(option.default)),
                  );
                option.conflicts &&
                  hints.push(
                    colors_ts_2.red(colors_ts_2.bold(`conflicts: `)) +
                      option.conflicts.map((conflict) =>
                        colors_ts_2.red(conflict)
                      ).join(", "),
                  );
              }
              if (hints.length) {
                return `(${hints.join(", ")})`;
              }
              return "";
            };
            renderHelp();
          }
          /**
                 * Colorize argument type's.
                 */
          highlight(type = "") {
            if (!type) {
              return type;
            }
            return this.parseArgsDefinition(type).map((arg) => {
              let str = "";
              str += colors_ts_2.yellow(arg.optionalValue ? "[" : "<");
              let name = "";
              name += arg.name;
              if (arg.variadic) {
                name += "...";
              }
              name = colors_ts_2.magenta(name);
              str += name;
              str += colors_ts_2.yellow(":");
              str += colors_ts_2.red(arg.type);
              if (arg.list) {
                str += colors_ts_2.green("[]");
              }
              str += colors_ts_2.yellow(arg.optionalValue ? "]" : ">");
              return str;
            }).join(" ");
          }
        };
        exports_34("HelpCommand", HelpCommand);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/default-command",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/command/commands/help",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/base-command",
  ],
  function (exports_35, context_35) {
    "use strict";
    var help_ts_1, base_command_ts_2, DefaultCommand;
    var __moduleName = context_35 && context_35.id;
    return {
      setters: [
        function (help_ts_1_1) {
          help_ts_1 = help_ts_1_1;
        },
        function (base_command_ts_2_1) {
          base_command_ts_2 = base_command_ts_2_1;
        },
      ],
      execute: function () {
        /**
             * A command with pre configured command's and option's:
             *
             *  - command's:
             *      help            Output's autogenerated help.
             *  - option's:
             *      -h, --help      Output's autogenerated help.
             *      -V, --version   Output's version number
             */
        DefaultCommand = class DefaultCommand
          extends base_command_ts_2.BaseCommand {
          constructor() {
            super();
            this.option("-h, --help [arg:boolean]", "Show this help.", {
              standalone: true,
              action: () => {
                this.help();
                Deno.exit(0);
              },
            })
              .option(
                "-V, --version [arg:boolean]",
                "Show the version number for this program.",
                {
                  standalone: true,
                  action: () => {
                    this.log(this.ver);
                    Deno.exit(0);
                  },
                },
              )
              // .option( '-v, --verbose [arg:number]', 'Increase debug output.', {
              //     collect: true,
              //     value: ( val: boolean, prev: number = 0 ) => val ? prev + 1 : prev - 1
              // } )
              .command("help", new help_ts_1.HelpCommand(this))
              .reset();
          }
          command(nameAndArguments, cmd, override) {
            return super.command(
              nameAndArguments,
              cmd || new DefaultCommand(),
              override,
            );
          }
        };
        exports_35("DefaultCommand", DefaultCommand);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/commands/completions/bash",
  ["https://deno.land/x/cliffy@v0.6.1/packages/command/lib/default-command"],
  function (exports_36, context_36) {
    "use strict";
    var default_command_ts_1, BashCompletionsCommand;
    var __moduleName = context_36 && context_36.id;
    return {
      setters: [
        function (default_command_ts_1_1) {
          default_command_ts_1 = default_command_ts_1_1;
        },
      ],
      execute: function () {
        /**
             * Generates bash completion code.
             */
        BashCompletionsCommand = class BashCompletionsCommand
          extends default_command_ts_1.DefaultCommand {
          constructor(parent) {
            super();
            this.parent = parent;
            this.description("Generate bash shell completions.")
              .action(() => {
                throw new Error(
                  "Bash completions not supported at this moment.",
                );
              });
          }
          /**
                 * @inheritDoc
                 */
          command(nameAndArguments, cmd, override) {
            return super.command(
              nameAndArguments,
              cmd || new default_command_ts_1.DefaultCommand(),
              override,
            );
          }
        };
        exports_36("BashCompletionsCommand", BashCompletionsCommand);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/types/action-list",
  ["https://deno.land/x/cliffy@v0.6.1/packages/command/types/string"],
  function (exports_37, context_37) {
    "use strict";
    var string_ts_5, ActionListType;
    var __moduleName = context_37 && context_37.id;
    return {
      setters: [
        function (string_ts_5_1) {
          string_ts_5 = string_ts_5_1;
        },
      ],
      execute: function () {
        ActionListType = class ActionListType extends string_ts_5.StringType {
          constructor(cmd) {
            super();
            this.cmd = cmd;
          }
          complete() {
            return this.getActionNames(this.cmd)
              .filter((value, index, self) => self.indexOf(value) === index); // filter unique values
          }
          getActionNames(cmd) {
            const actions = cmd.getActionNames();
            for (const command of cmd.getCommands()) {
              actions.push(...this.getActionNames(command));
            }
            return actions;
          }
        };
        exports_37("ActionListType", ActionListType);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/commands/completions/complete",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/default-command",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/action-list",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/command-list",
  ],
  function (exports_38, context_38) {
    "use strict";
    var default_command_ts_2,
      action_list_ts_1,
      command_list_ts_2,
      CompleteCommand;
    var __moduleName = context_38 && context_38.id;
    return {
      setters: [
        function (default_command_ts_2_1) {
          default_command_ts_2 = default_command_ts_2_1;
        },
        function (action_list_ts_1_1) {
          action_list_ts_1 = action_list_ts_1_1;
        },
        function (command_list_ts_2_1) {
          command_list_ts_2 = command_list_ts_2_1;
        },
      ],
      execute: function () {
        /**
             * Execute complete method for specific action and command.
             */
        CompleteCommand = class CompleteCommand
          extends default_command_ts_2.DefaultCommand {
          constructor(parent) {
            super();
            this.parent = parent;
            this.arguments("<action:action> [command...:command]")
              .type("action", new action_list_ts_1.ActionListType(this.parent))
              .type(
                "command",
                new command_list_ts_2.CommandListType(this.parent),
              )
              .action(async (options, action, commandNames) => {
                let cmd = commandNames
                  .reduce((cmd, name) => cmd.getCommand(name), parent);
                if (!cmd) {
                  console.error(
                    `Auto-completion failed. Command not found: ${
                      commandNames.join(" ")
                    }`,
                  );
                  return;
                }
                const result = await cmd.getCompletion(action) || [];
                if (result && result.length) {
                  Deno.stdout.writeSync(
                    new TextEncoder().encode(result.join(" ")),
                  );
                }
              })
              .default("help")
              .reset();
          }
          /**
                 * @inheritDoc
                 */
          command(nameAndArguments, cmd, override) {
            return super.command(
              nameAndArguments,
              cmd || new default_command_ts_2.DefaultCommand(),
              override,
            );
          }
        };
        exports_38("CompleteCommand", CompleteCommand);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/x/snakeCase",
  ["https://deno.land/x/cliffy@v0.6.1/packages/x/normalCase"],
  function (exports_39, context_39) {
    "use strict";
    var normalCase_ts_3;
    var __moduleName = context_39 && context_39.id;
    function snakeCase(value, locale) {
      return normalCase_ts_3.default(value, locale, "_");
    }
    exports_39("default", snakeCase);
    return {
      setters: [
        function (normalCase_ts_3_1) {
          normalCase_ts_3 = normalCase_ts_3_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/commands/completions/zsh",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/x/snakeCase",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/default-command",
  ],
  function (exports_40, context_40) {
    "use strict";
    var snakeCase_ts_1, default_command_ts_3, ZshCompletionsCommand;
    var __moduleName = context_40 && context_40.id;
    return {
      setters: [
        function (snakeCase_ts_1_1) {
          snakeCase_ts_1 = snakeCase_ts_1_1;
        },
        function (default_command_ts_3_1) {
          default_command_ts_3 = default_command_ts_3_1;
        },
      ],
      execute: function () {
        /**
             * Generates zsh completion code.
             */
        ZshCompletionsCommand = class ZshCompletionsCommand
          extends default_command_ts_3.DefaultCommand {
          constructor(parent) {
            super();
            this.parent = parent;
            /**
                     * Actions from the command which is currently parsing.
                     */
            this.actions = new Map();
            this.description("Generate zsh shell completions.")
              .action(() => console.log(this.generate()));
          }
          /**
                 * @inheritDoc
                 */
          command(nameAndArguments, cmd, override) {
            return super.command(
              nameAndArguments,
              cmd || new default_command_ts_3.DefaultCommand(),
              override,
            );
          }
          /**
                 * Generates zsh completions code.
                 */
          generate() {
            return `
# compdef _${
              snakeCase_ts_1.default(this.parent.getPath())
            } ${this.parent.getPath()}
#
# zsh completion for ${this.parent.getPath()}
#
# version: ${this.parent.getVersion()}
#

autoload -U is-at-least

(( $+functions[__${snakeCase_ts_1.default(this.parent.getName())}_script] )) ||
function __${snakeCase_ts_1.default(this.parent.getName())}_script {
    local name="$1"; shift
    local action="$1"; shift
    integer ret=1
    local -a values
    local expl
    _tags "$name"
    while _tags; do
        if _requested "$name"; then
            values=( \$( ${this.parent.getName()} completions complete $action $@) )
            if (( \${#values[@]} )); then
                while _next_label "$name" expl "$action"; do
                    compadd -S '' "\$expl[@]" $values[@]
                done
            fi
        fi
    done
}

${this.generateCompletions(this.parent, true).trim()}

# _${snakeCase_ts_1.default(this.parent.getPath())} "\${@}"

compdef _${
              snakeCase_ts_1.default(this.parent.getPath())
            } ${this.parent.getPath()}

#
# Local Variables:
# mode: Shell-Script
# sh-indentation: 4
# indent-tabs-mode: nil
# sh-basic-offset: 4
# End:
# vim: ft=zsh sw=4 ts=4 et
`.trim();
          }
          /**
                 * Generates zsh completions method for given command and child commands.
                 */
          generateCompletions(command, root) {
            if (
              !command.hasCommands() && !command.hasOptions() &&
              !command.hasArguments()
            ) {
              return "";
            }
            return `(( $+functions[_${
              snakeCase_ts_1.default(command.getPath())
            }] )) ||
function _${snakeCase_ts_1.default(command.getPath())}() {` +
              (root
                ? `\n\n    local context state state_descr line\n    typeset -A opt_args`
                : "") +
              this.generateCommandCompletions(command) +
              this.generateSubCommandCompletions(command) +
              this.generateArgumentCompletions(command) +
              this.generateActions(command) +
              `\n}\n\n` +
              command.getCommands()
                .map((subCommand) => this.generateCompletions(subCommand))
                .join("");
          }
          generateCommandCompletions(command) {
            const commands = command.getCommands();
            let completions = commands
              .map((subCommand) =>
                `'${subCommand.getName()}:${subCommand.getShortDescription()}'`
              )
              .join("\n            ");
            if (completions) {
              completions = `
        local -a commands
        commands=(
            ${completions}
        )
        _describe 'command' commands`;
            }
            if (command.hasArguments()) {
              const completionsPath = command.getPath().split(" ").slice(1)
                .join(" ");
              const arg = command.getArguments()[0];
              const action = this.addAction(arg, completionsPath);
              if (action) {
                completions += `\n        __${
                  snakeCase_ts_1.default(this.parent.getName())
                }_script ${action.arg.name} ${action.arg.action} ${action.cmd}`;
              }
            }
            if (completions) {
              completions =
                `\n\n    function _commands() {${completions}\n    }`;
            }
            return completions;
          }
          generateSubCommandCompletions(command) {
            if (command.hasCommands()) {
              const actions = command
                .getCommands()
                .map((command) =>
                  `${command.getName()}) _${
                    snakeCase_ts_1.default(command.getPath())
                  } ;;`
                )
                .join("\n            ");
              return `\n
    function _command_args() {
        case "$words[1]" in\n            ${actions}\n        esac
    }`;
            }
            return "";
          }
          generateArgumentCompletions(command) {
            /* clear actions from previously parsed command. */
            this.actions.clear();
            const options = this.generateOptions(command);
            let argIndex = 0;
            let argsCommand = "\n\n    _arguments -w -s -S -C";
            if (command.hasOptions()) {
              argsCommand += ` \\\n        ${options.join(" \\\n        ")}`;
            }
            if (command.hasCommands() || command.hasArguments()) {
              argsCommand += ` \\\n        '${++argIndex}: :_commands'`;
            }
            if (command.hasArguments() || command.hasCommands()) {
              const args = [];
              for (const arg of command.getArguments().slice(1)) {
                const completionsPath = command.getPath().split(" ").slice(1)
                  .join(" ");
                const action = this.addAction(arg, completionsPath);
                args.push(
                  `${++argIndex}${
                    arg.optionalValue ? "::" : ":"
                  }${action.name}`,
                );
              }
              argsCommand += args.map((arg) => `\\\n        '${arg}'`).join("");
              if (command.hasCommands()) {
                argsCommand += ` \\\n        '*:: :->command_args'`;
              }
            }
            return argsCommand;
          }
          generateOptions(command) {
            const options = [];
            const cmdArgs = command.getPath().split(" ");
            const baseName = cmdArgs.shift();
            const completionsPath = cmdArgs.join(" ");
            const excluded = command.getOptions()
              .map((option) =>
                option.standalone ? option.flags.split(/[, ] */g) : false
              )
              .flat()
              .filter((flag) => typeof flag === "string");
            for (const option of command.getOptions()) {
              const optExcluded = option.conflicts
                ? [...excluded, ...option.conflicts]
                : excluded;
              const flags = option.flags.split(/[, ] */g);
              const flagExcluded = option.collect ? optExcluded : [
                ...optExcluded,
                ...flags,
              ];
              options.push(
                this.generateOption(
                  option,
                  baseName,
                  completionsPath,
                  flagExcluded,
                ),
              );
            }
            return options;
          }
          generateOption(option, baseName, completionsPath, excludedFlags) {
            let args = "";
            for (const arg of option.args) {
              const action = this.addAction(arg, completionsPath);
              if (arg.variadic) {
                args += `${
                  arg.optionalValue ? "::" : ":"
                }${arg.name}:->${action.name}`;
              } else {
                args += `${
                  arg.optionalValue ? "::" : ":"
                }${arg.name}:->${action.name}`;
              }
            }
            const description = option.description.trim().split("\n").shift();
            const collect = option.collect ? "*" : "";
            const flags = option.flags.replace(/ +/g, "");
            if (option.standalone) {
              return `'(- *)'{${collect}${flags}}'[${description}]${args}'`;
            } else {
              const excluded = excludedFlags.length
                ? `(${excludedFlags.join(" ")})`
                : "";
              return `'${excluded}'{${collect}${flags}}'[${description}]${args}'`;
            }
          }
          addAction(arg, cmd) {
            const action = `${arg.name}-${arg.action}`;
            if (!this.actions.has(action)) {
              this.actions.set(action, {
                arg: arg,
                label: `${arg.name}: ${arg.action}`,
                name: action,
                cmd,
              });
            }
            return this.actions.get(action);
          }
          generateActions(command) {
            let actions = [];
            if (this.actions.size) {
              actions = Array
                .from(this.actions)
                .map(([name, action]) =>
                  `${name}) __${
                    snakeCase_ts_1.default(this.parent.getName())
                  }_script ${action.arg.name} ${action.arg.action} ${action.cmd} ;;`
                );
            }
            if (command.hasCommands()) {
              actions.unshift(`command_args) _command_args ;;`);
            }
            if (actions.length) {
              return `\n\n    case "$state" in\n        ${
                actions.join("\n        ")
              }\n    esac`;
            }
            return "";
          }
        };
        exports_40("ZshCompletionsCommand", ZshCompletionsCommand);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/commands/completions",
  [
    "https://deno.land/std@v0.50.0/fmt/colors",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/default-command",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/commands/completions/bash",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/commands/completions/complete",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/commands/completions/zsh",
  ],
  function (exports_41, context_41) {
    "use strict";
    var colors_ts_3,
      default_command_ts_4,
      bash_ts_1,
      complete_ts_1,
      zsh_ts_1,
      CompletionsCommand;
    var __moduleName = context_41 && context_41.id;
    return {
      setters: [
        function (colors_ts_3_1) {
          colors_ts_3 = colors_ts_3_1;
        },
        function (default_command_ts_4_1) {
          default_command_ts_4 = default_command_ts_4_1;
        },
        function (bash_ts_1_1) {
          bash_ts_1 = bash_ts_1_1;
        },
        function (complete_ts_1_1) {
          complete_ts_1 = complete_ts_1_1;
        },
        function (zsh_ts_1_1) {
          zsh_ts_1 = zsh_ts_1_1;
        },
      ],
      execute: function () {
        /**
             * Generates source code for interactive shell completions used in multiple shell's.
             */
        CompletionsCommand = class CompletionsCommand
          extends default_command_ts_4.DefaultCommand {
          constructor(parent) {
            super();
            this.parent = parent;
            this.description(`Generate shell completions for zsh and bash.

${colors_ts_3.dim(colors_ts_3.bold("Bash completions:"))}

To enable bash completions for this program add following line to your ${
              colors_ts_3.dim(colors_ts_3.italic("~/.bashrc"))
            }:

    ${
              colors_ts_3.dim(
                colors_ts_3.italic("source <(command-name completions bash)"),
              )
            }

or create a separate file in the ${
              colors_ts_3.dim(colors_ts_3.italic("bash_completion.d"))
            } directory:

    ${
              colors_ts_3.dim(
                colors_ts_3.italic(
                  `${parent.getPath()} completions bash > /usr/local/etc/bash_completion.d/${parent.getPath()}.bash`,
                ),
              )
            }
    ${
              colors_ts_3.dim(
                colors_ts_3.italic(
                  `source /usr/local/etc/bash_completion.d/${parent.getPath()}.bash`,
                ),
              )
            }

${colors_ts_3.dim(colors_ts_3.bold("Zsh completions:"))}

To enable zsh completions for this program add following line to your ${
              colors_ts_3.dim(colors_ts_3.italic("~/.zshrc"))
            }:

    ${
              colors_ts_3.dim(
                colors_ts_3.italic("source <(command-name completions zsh)"),
              )
            }

or create a separate file in the ${
              colors_ts_3.dim(colors_ts_3.italic("zsh_completion.d"))
            } directory:

    ${
              colors_ts_3.dim(
                colors_ts_3.italic(
                  `${parent.getPath()} completions zsh > /usr/local/etc/zsh_completion.d/${parent.getPath()}.zsh`,
                ),
              )
            }
    ${
              colors_ts_3.dim(
                colors_ts_3.italic(
                  `source /usr/local/etc/zsh_completion.d/${parent.getPath()}.zsh`,
                ),
              )
            }
`)
              .default("help")
              .command("zsh", new zsh_ts_1.ZshCompletionsCommand(this.parent))
              .command(
                "bash",
                new bash_ts_1.BashCompletionsCommand(this.parent),
              )
              .command(
                "complete",
                new complete_ts_1.CompleteCommand(this.parent),
              )
              .reset();
          }
          /**
                 * @inheritDoc
                 */
          command(nameAndArguments, cmd, override) {
            return super.command(
              nameAndArguments,
              cmd || new default_command_ts_4.DefaultCommand(),
              override,
            );
          }
        };
        exports_41("CompletionsCommand", CompletionsCommand);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/command",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/command/commands/completions",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/default-command",
  ],
  function (exports_42, context_42) {
    "use strict";
    var completions_ts_1, default_command_ts_5, Command;
    var __moduleName = context_42 && context_42.id;
    return {
      setters: [
        function (completions_ts_1_1) {
          completions_ts_1 = completions_ts_1_1;
        },
        function (default_command_ts_5_1) {
          default_command_ts_5 = default_command_ts_5_1;
        },
      ],
      execute: function () {
        /**
             * A command with pre configured command's and option's:
             *
             *  - command's:
             *      help            Output's autogenerated help.
             *      completions     Output's autogenerated shell completion script for bash and zsh.
             *  - option's:
             *      -h, --help      Output's autogenerated help.
             *      -V, --version   Output's version number
             */
        Command = class Command extends default_command_ts_5.DefaultCommand {
          constructor() {
            super();
            this.command(
              "completions",
              new completions_ts_1.CompletionsCommand(this),
            )
              .reset();
          }
          command(nameAndArguments, cmd, override) {
            return super.command(
              nameAndArguments,
              cmd || new Command(),
              override,
            );
          }
        };
        exports_42("Command", Command);
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/packages/command/mod",
  [
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/types",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/base-command",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/default-command",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/lib/command",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/action-list",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/boolean",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/command-list",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/number",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/string",
    "https://deno.land/x/cliffy@v0.6.1/packages/command/types/type",
  ],
  function (exports_43, context_43) {
    "use strict";
    var __moduleName = context_43 && context_43.id;
    function exportStar_1(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_43(exports);
    }
    return {
      setters: [
        function (types_ts_4_1) {
          exportStar_1(types_ts_4_1);
        },
        function (base_command_ts_3_1) {
          exportStar_1(base_command_ts_3_1);
        },
        function (default_command_ts_6_1) {
          exportStar_1(default_command_ts_6_1);
        },
        function (command_ts_1_1) {
          exportStar_1(command_ts_1_1);
        },
        function (action_list_ts_2_1) {
          exportStar_1(action_list_ts_2_1);
        },
        function (boolean_ts_4_1) {
          exportStar_1(boolean_ts_4_1);
        },
        function (command_list_ts_3_1) {
          exportStar_1(command_list_ts_3_1);
        },
        function (number_ts_4_1) {
          exportStar_1(number_ts_4_1);
        },
        function (string_ts_6_1) {
          exportStar_1(string_ts_6_1);
        },
        function (type_ts_5_1) {
          exportStar_1(type_ts_5_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/x/cliffy@v0.6.1/command",
  ["https://deno.land/x/cliffy@v0.6.1/packages/command/mod"],
  function (exports_44, context_44) {
    "use strict";
    var __moduleName = context_44 && context_44.id;
    function exportStar_2(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default") exports[n] = m[n];
      }
      exports_44(exports);
    }
    return {
      setters: [
        function (mod_ts_1_1) {
          exportStar_2(mod_ts_1_1);
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "file:///home/thienbui/Dev/ddm/src/constants",
  [],
  function (exports_45, context_45) {
    "use strict";
    var DENO_STD, DEFAULT_IMPORT_MAP, DENO_IMPORT_MAP, VERSION;
    var __moduleName = context_45 && context_45.id;
    return {
      setters: [],
      execute: function () {
        DENO_STD = [
          "archive",
          "async",
          "bytes",
          "datetime",
          "encoding",
          "examples",
          "flags",
          "fmt",
          "fs",
          "hash",
          "http",
          "io",
          "log",
          "mime",
          "node",
          "path",
          "permissions",
          "signal",
          "testing",
          "textproto",
          "uuid",
          "ws",
        ];
        exports_45("DENO_STD", DENO_STD);
        DEFAULT_IMPORT_MAP = ".deno/import_map.json";
        exports_45("DEFAULT_IMPORT_MAP", DEFAULT_IMPORT_MAP);
        DENO_IMPORT_MAP = ["run", "cache", "test", "bundle"];
        exports_45("DENO_IMPORT_MAP", DENO_IMPORT_MAP);
        VERSION = "0.0.1";
        exports_45("VERSION", VERSION);
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.51.0/fs/read_json",
  [],
  function (exports_46, context_46) {
    "use strict";
    var __moduleName = context_46 && context_46.id;
    /** Reads a JSON file and then parses it into an object */
    async function readJson(filePath) {
      const decoder = new TextDecoder("utf-8");
      const content = decoder.decode(await Deno.readFile(filePath));
      try {
        return JSON.parse(content);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
    }
    exports_46("readJson", readJson);
    /** Reads a JSON file and then parses it into an object */
    function readJsonSync(filePath) {
      const decoder = new TextDecoder("utf-8");
      const content = decoder.decode(Deno.readFileSync(filePath));
      try {
        return JSON.parse(content);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
    }
    exports_46("readJsonSync", readJsonSync);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.51.0/fs/write_json",
  [],
  function (exports_47, context_47) {
    "use strict";
    var __moduleName = context_47 && context_47.id;
    /* Writes an object to a JSON file. */
    async function writeJson(filePath, object, options = {}) {
      let contentRaw = "";
      try {
        contentRaw = JSON.stringify(object, options.replacer, options.spaces);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
      await Deno.writeFile(filePath, new TextEncoder().encode(contentRaw));
    }
    exports_47("writeJson", writeJson);
    /* Writes an object to a JSON file. */
    function writeJsonSync(filePath, object, options = {}) {
      let contentRaw = "";
      try {
        contentRaw = JSON.stringify(object, options.replacer, options.spaces);
      } catch (err) {
        err.message = `${filePath}: ${err.message}`;
        throw err;
      }
      Deno.writeFileSync(filePath, new TextEncoder().encode(contentRaw));
    }
    exports_47("writeJsonSync", writeJsonSync);
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.51.0/path/interface",
  [],
  function (exports_48, context_48) {
    "use strict";
    var __moduleName = context_48 && context_48.id;
    return {
      setters: [],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std@0.51.0/path/_constants",
  [],
  function (exports_49, context_49) {
    "use strict";
    var build,
      CHAR_UPPERCASE_A,
      CHAR_LOWERCASE_A,
      CHAR_UPPERCASE_Z,
      CHAR_LOWERCASE_Z,
      CHAR_DOT,
      CHAR_FORWARD_SLASH,
      CHAR_BACKWARD_SLASH,
      CHAR_VERTICAL_LINE,
      CHAR_COLON,
      CHAR_QUESTION_MARK,
      CHAR_UNDERSCORE,
      CHAR_LINE_FEED,
      CHAR_CARRIAGE_RETURN,
      CHAR_TAB,
      CHAR_FORM_FEED,
      CHAR_EXCLAMATION_MARK,
      CHAR_HASH,
      CHAR_SPACE,
      CHAR_NO_BREAK_SPACE,
      CHAR_ZERO_WIDTH_NOBREAK_SPACE,
      CHAR_LEFT_SQUARE_BRACKET,
      CHAR_RIGHT_SQUARE_BRACKET,
      CHAR_LEFT_ANGLE_BRACKET,
      CHAR_RIGHT_ANGLE_BRACKET,
      CHAR_LEFT_CURLY_BRACKET,
      CHAR_RIGHT_CURLY_BRACKET,
      CHAR_HYPHEN_MINUS,
      CHAR_PLUS,
      CHAR_DOUBLE_QUOTE,
      CHAR_SINGLE_QUOTE,
      CHAR_PERCENT,
      CHAR_SEMICOLON,
      CHAR_CIRCUMFLEX_ACCENT,
      CHAR_GRAVE_ACCENT,
      CHAR_AT,
      CHAR_AMPERSAND,
      CHAR_EQUAL,
      CHAR_0,
      CHAR_9,
      isWindows,
      SEP,
      SEP_PATTERN;
    var __moduleName = context_49 && context_49.id;
    return {
      setters: [],
      execute: function () {
        build = Deno.build;
        // Alphabet chars.
        exports_49("CHAR_UPPERCASE_A", CHAR_UPPERCASE_A = 65); /* A */
        exports_49("CHAR_LOWERCASE_A", CHAR_LOWERCASE_A = 97); /* a */
        exports_49("CHAR_UPPERCASE_Z", CHAR_UPPERCASE_Z = 90); /* Z */
        exports_49("CHAR_LOWERCASE_Z", CHAR_LOWERCASE_Z = 122); /* z */
        // Non-alphabetic chars.
        exports_49("CHAR_DOT", CHAR_DOT = 46); /* . */
        exports_49("CHAR_FORWARD_SLASH", CHAR_FORWARD_SLASH = 47); /* / */
        exports_49("CHAR_BACKWARD_SLASH", CHAR_BACKWARD_SLASH = 92); /* \ */
        exports_49("CHAR_VERTICAL_LINE", CHAR_VERTICAL_LINE = 124); /* | */
        exports_49("CHAR_COLON", CHAR_COLON = 58); /* : */
        exports_49("CHAR_QUESTION_MARK", CHAR_QUESTION_MARK = 63); /* ? */
        exports_49("CHAR_UNDERSCORE", CHAR_UNDERSCORE = 95); /* _ */
        exports_49("CHAR_LINE_FEED", CHAR_LINE_FEED = 10); /* \n */
        exports_49("CHAR_CARRIAGE_RETURN", CHAR_CARRIAGE_RETURN = 13); /* \r */
        exports_49("CHAR_TAB", CHAR_TAB = 9); /* \t */
        exports_49("CHAR_FORM_FEED", CHAR_FORM_FEED = 12); /* \f */
        exports_49("CHAR_EXCLAMATION_MARK", CHAR_EXCLAMATION_MARK = 33); /* ! */
        exports_49("CHAR_HASH", CHAR_HASH = 35); /* # */
        exports_49("CHAR_SPACE", CHAR_SPACE = 32); /*   */
        exports_49(
          "CHAR_NO_BREAK_SPACE",
          CHAR_NO_BREAK_SPACE = 160,
        ); /* \u00A0 */
        exports_49(
          "CHAR_ZERO_WIDTH_NOBREAK_SPACE",
          CHAR_ZERO_WIDTH_NOBREAK_SPACE = 65279,
        ); /* \uFEFF */
        exports_49(
          "CHAR_LEFT_SQUARE_BRACKET",
          CHAR_LEFT_SQUARE_BRACKET = 91,
        ); /* [ */
        exports_49(
          "CHAR_RIGHT_SQUARE_BRACKET",
          CHAR_RIGHT_SQUARE_BRACKET = 93,
        ); /* ] */
        exports_49(
          "CHAR_LEFT_ANGLE_BRACKET",
          CHAR_LEFT_ANGLE_BRACKET = 60,
        ); /* < */
        exports_49(
          "CHAR_RIGHT_ANGLE_BRACKET",
          CHAR_RIGHT_ANGLE_BRACKET = 62,
        ); /* > */
        exports_49(
          "CHAR_LEFT_CURLY_BRACKET",
          CHAR_LEFT_CURLY_BRACKET = 123,
        ); /* { */
        exports_49(
          "CHAR_RIGHT_CURLY_BRACKET",
          CHAR_RIGHT_CURLY_BRACKET = 125,
        ); /* } */
        exports_49("CHAR_HYPHEN_MINUS", CHAR_HYPHEN_MINUS = 45); /* - */
        exports_49("CHAR_PLUS", CHAR_PLUS = 43); /* + */
        exports_49("CHAR_DOUBLE_QUOTE", CHAR_DOUBLE_QUOTE = 34); /* " */
        exports_49("CHAR_SINGLE_QUOTE", CHAR_SINGLE_QUOTE = 39); /* ' */
        exports_49("CHAR_PERCENT", CHAR_PERCENT = 37); /* % */
        exports_49("CHAR_SEMICOLON", CHAR_SEMICOLON = 59); /* ; */
        exports_49(
          "CHAR_CIRCUMFLEX_ACCENT",
          CHAR_CIRCUMFLEX_ACCENT = 94,
        ); /* ^ */
        exports_49("CHAR_GRAVE_ACCENT", CHAR_GRAVE_ACCENT = 96); /* ` */
        exports_49("CHAR_AT", CHAR_AT = 64); /* @ */
        exports_49("CHAR_AMPERSAND", CHAR_AMPERSAND = 38); /* & */
        exports_49("CHAR_EQUAL", CHAR_EQUAL = 61); /* = */
        // Digits
        exports_49("CHAR_0", CHAR_0 = 48); /* 0 */
        exports_49("CHAR_9", CHAR_9 = 57); /* 9 */
        isWindows = build.os == "windows";
        exports_49("SEP", SEP = isWindows ? "\\" : "/");
        exports_49("SEP_PATTERN", SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/);
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std@0.51.0/path/_util",
  ["https://deno.land/std@0.51.0/path/_constants"],
  function (exports_50, context_50) {
    "use strict";
    var _constants_ts_1;
    var __moduleName = context_50 && context_50.id;
    function assertPath(path) {
      if (typeof path !== "string") {
        throw new TypeError(
          `Path must be a string. Received ${JSON.stringify(path)}`,
        );
      }
    }
    exports_50("assertPath", assertPath);
    function isPosixPathSeparator(code) {
      return code === _constants_ts_1.CHAR_FORWARD_SLASH;
    }
    exports_50("isPosixPathSeparator", isPosixPathSeparator);
    function isPathSeparator(code) {
      return isPosixPathSeparator(code) ||
        code === _constants_ts_1.CHAR_BACKWARD_SLASH;
    }
    exports_50("isPathSeparator", isPathSeparator);
    function isWindowsDeviceRoot(code) {
      return ((code >= _constants_ts_1.CHAR_LOWERCASE_A &&
        code <= _constants_ts_1.CHAR_LOWERCASE_Z) ||
        (code >= _constants_ts_1.CHAR_UPPERCASE_A &&
          code <= _constants_ts_1.CHAR_UPPERCASE_Z));
    }
    exports_50("isWindowsDeviceRoot", isWindowsDeviceRoot);
    // Resolves . and .. elements in a path with directory names
    function normalizeString(path, allowAboveRoot, separator, isPathSeparator) {
      let res = "";
      let lastSegmentLength = 0;
      let lastSlash = -1;
      let dots = 0;
      let code;
      for (let i = 0, len = path.length; i <= len; ++i) {
        if (i < len) {
          code = path.charCodeAt(i);
        } else if (isPathSeparator(code)) {
          break;
        } else {
          code = _constants_ts_1.CHAR_FORWARD_SLASH;
        }
        if (isPathSeparator(code)) {
          if (lastSlash === i - 1 || dots === 1) {
            // NOOP
          } else if (lastSlash !== i - 1 && dots === 2) {
            if (
              res.length < 2 ||
              lastSegmentLength !== 2 ||
              res.charCodeAt(res.length - 1) !== _constants_ts_1.CHAR_DOT ||
              res.charCodeAt(res.length - 2) !== _constants_ts_1.CHAR_DOT
            ) {
              if (res.length > 2) {
                const lastSlashIndex = res.lastIndexOf(separator);
                if (lastSlashIndex === -1) {
                  res = "";
                  lastSegmentLength = 0;
                } else {
                  res = res.slice(0, lastSlashIndex);
                  lastSegmentLength = res.length - 1 -
                    res.lastIndexOf(separator);
                }
                lastSlash = i;
                dots = 0;
                continue;
              } else if (res.length === 2 || res.length === 1) {
                res = "";
                lastSegmentLength = 0;
                lastSlash = i;
                dots = 0;
                continue;
              }
            }
            if (allowAboveRoot) {
              if (res.length > 0) {
                res += `${separator}..`;
              } else {
                res = "..";
              }
              lastSegmentLength = 2;
            }
          } else {
            if (res.length > 0) {
              res += separator + path.slice(lastSlash + 1, i);
            } else {
              res = path.slice(lastSlash + 1, i);
            }
            lastSegmentLength = i - lastSlash - 1;
          }
          lastSlash = i;
          dots = 0;
        } else if (code === _constants_ts_1.CHAR_DOT && dots !== -1) {
          ++dots;
        } else {
          dots = -1;
        }
      }
      return res;
    }
    exports_50("normalizeString", normalizeString);
    function _format(sep, pathObject) {
      const dir = pathObject.dir || pathObject.root;
      const base = pathObject.base ||
        (pathObject.name || "") + (pathObject.ext || "");
      if (!dir) {
        return base;
      }
      if (dir === pathObject.root) {
        return dir + base;
      }
      return dir + sep + base;
    }
    exports_50("_format", _format);
    return {
      setters: [
        function (_constants_ts_1_1) {
          _constants_ts_1 = _constants_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.51.0/fmt/colors",
  [],
  function (exports_51, context_51) {
    "use strict";
    var noColor, enabled;
    var __moduleName = context_51 && context_51.id;
    function setColorEnabled(value) {
      if (noColor) {
        return;
      }
      enabled = value;
    }
    exports_51("setColorEnabled", setColorEnabled);
    function getColorEnabled() {
      return enabled;
    }
    exports_51("getColorEnabled", getColorEnabled);
    function code(open, close) {
      return {
        open: `\x1b[${open.join(";")}m`,
        close: `\x1b[${close}m`,
        regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
      };
    }
    function run(str, code) {
      return enabled
        ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
        : str;
    }
    function reset(str) {
      return run(str, code([0], 0));
    }
    exports_51("reset", reset);
    function bold(str) {
      return run(str, code([1], 22));
    }
    exports_51("bold", bold);
    function dim(str) {
      return run(str, code([2], 22));
    }
    exports_51("dim", dim);
    function italic(str) {
      return run(str, code([3], 23));
    }
    exports_51("italic", italic);
    function underline(str) {
      return run(str, code([4], 24));
    }
    exports_51("underline", underline);
    function inverse(str) {
      return run(str, code([7], 27));
    }
    exports_51("inverse", inverse);
    function hidden(str) {
      return run(str, code([8], 28));
    }
    exports_51("hidden", hidden);
    function strikethrough(str) {
      return run(str, code([9], 29));
    }
    exports_51("strikethrough", strikethrough);
    function black(str) {
      return run(str, code([30], 39));
    }
    exports_51("black", black);
    function red(str) {
      return run(str, code([31], 39));
    }
    exports_51("red", red);
    function green(str) {
      return run(str, code([32], 39));
    }
    exports_51("green", green);
    function yellow(str) {
      return run(str, code([33], 39));
    }
    exports_51("yellow", yellow);
    function blue(str) {
      return run(str, code([34], 39));
    }
    exports_51("blue", blue);
    function magenta(str) {
      return run(str, code([35], 39));
    }
    exports_51("magenta", magenta);
    function cyan(str) {
      return run(str, code([36], 39));
    }
    exports_51("cyan", cyan);
    function white(str) {
      return run(str, code([37], 39));
    }
    exports_51("white", white);
    function gray(str) {
      return run(str, code([90], 39));
    }
    exports_51("gray", gray);
    function bgBlack(str) {
      return run(str, code([40], 49));
    }
    exports_51("bgBlack", bgBlack);
    function bgRed(str) {
      return run(str, code([41], 49));
    }
    exports_51("bgRed", bgRed);
    function bgGreen(str) {
      return run(str, code([42], 49));
    }
    exports_51("bgGreen", bgGreen);
    function bgYellow(str) {
      return run(str, code([43], 49));
    }
    exports_51("bgYellow", bgYellow);
    function bgBlue(str) {
      return run(str, code([44], 49));
    }
    exports_51("bgBlue", bgBlue);
    function bgMagenta(str) {
      return run(str, code([45], 49));
    }
    exports_51("bgMagenta", bgMagenta);
    function bgCyan(str) {
      return run(str, code([46], 49));
    }
    exports_51("bgCyan", bgCyan);
    function bgWhite(str) {
      return run(str, code([47], 49));
    }
    exports_51("bgWhite", bgWhite);
    /* Special Color Sequences */
    function clampAndTruncate(n, max = 255, min = 0) {
      return Math.trunc(Math.max(Math.min(n, max), min));
    }
    /** Set text color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function rgb8(str, color) {
      return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports_51("rgb8", rgb8);
    /** Set background color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit */
    function bgRgb8(str, color) {
      return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports_51("bgRgb8", bgRgb8);
    /** Set text color using 24bit rgb. */
    function rgb24(str, color) {
      return run(
        str,
        code([
          38,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 39),
      );
    }
    exports_51("rgb24", rgb24);
    /** Set background color using 24bit rgb. */
    function bgRgb24(str, color) {
      return run(
        str,
        code([
          48,
          2,
          clampAndTruncate(color.r),
          clampAndTruncate(color.g),
          clampAndTruncate(color.b),
        ], 49),
      );
    }
    exports_51("bgRgb24", bgRgb24);
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        /**
             * A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
             * on npm.
             *
             * ```
             * import { bgBlue, red, bold } from "https://deno.land/std/fmt/colors.ts";
             * console.log(bgBlue(red(bold("Hello world!"))));
             * ```
             *
             * This module supports `NO_COLOR` environmental variable disabling any coloring
             * if `NO_COLOR` is set.
             */
        noColor = Deno.noColor;
        enabled = !noColor;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.51.0/testing/diff",
  [],
  function (exports_52, context_52) {
    "use strict";
    var DiffType, REMOVED, COMMON, ADDED;
    var __moduleName = context_52 && context_52.id;
    function createCommon(A, B, reverse) {
      const common = [];
      if (A.length === 0 || B.length === 0) {
        return [];
      }
      for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
        if (
          A[reverse ? A.length - i - 1 : i] ===
            B[reverse ? B.length - i - 1 : i]
        ) {
          common.push(A[reverse ? A.length - i - 1 : i]);
        } else {
          return common;
        }
      }
      return common;
    }
    function diff(A, B) {
      const prefixCommon = createCommon(A, B);
      const suffixCommon = createCommon(
        A.slice(prefixCommon.length),
        B.slice(prefixCommon.length),
        true,
      ).reverse();
      A = suffixCommon.length
        ? A.slice(prefixCommon.length, -suffixCommon.length)
        : A.slice(prefixCommon.length);
      B = suffixCommon.length
        ? B.slice(prefixCommon.length, -suffixCommon.length)
        : B.slice(prefixCommon.length);
      const swapped = B.length > A.length;
      [A, B] = swapped ? [B, A] : [A, B];
      const M = A.length;
      const N = B.length;
      if (!M && !N && !suffixCommon.length && !prefixCommon.length) {
        return [];
      }
      if (!N) {
        return [
          ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
          ...A.map((a) => ({
            type: swapped ? DiffType.added : DiffType.removed,
            value: a,
          })),
          ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ];
      }
      const offset = N;
      const delta = M - N;
      const size = M + N + 1;
      const fp = new Array(size).fill({ y: -1 });
      /**
         * INFO:
         * This buffer is used to save memory and improve performance.
         * The first half is used to save route and last half is used to save diff
         * type.
         * This is because, when I kept new uint8array area to save type,performance
         * worsened.
         */
      const routes = new Uint32Array((M * N + size + 1) * 2);
      const diffTypesPtrOffset = routes.length / 2;
      let ptr = 0;
      let p = -1;
      function backTrace(A, B, current, swapped) {
        const M = A.length;
        const N = B.length;
        const result = [];
        let a = M - 1;
        let b = N - 1;
        let j = routes[current.id];
        let type = routes[current.id + diffTypesPtrOffset];
        while (true) {
          if (!j && !type) {
            break;
          }
          const prev = j;
          if (type === REMOVED) {
            result.unshift({
              type: swapped ? DiffType.removed : DiffType.added,
              value: B[b],
            });
            b -= 1;
          } else if (type === ADDED) {
            result.unshift({
              type: swapped ? DiffType.added : DiffType.removed,
              value: A[a],
            });
            a -= 1;
          } else {
            result.unshift({ type: DiffType.common, value: A[a] });
            a -= 1;
            b -= 1;
          }
          j = routes[prev];
          type = routes[prev + diffTypesPtrOffset];
        }
        return result;
      }
      function createFP(slide, down, k, M) {
        if (slide && slide.y === -1 && down && down.y === -1) {
          return { y: 0, id: 0 };
        }
        if (
          (down && down.y === -1) ||
          k === M ||
          (slide && slide.y) > (down && down.y) + 1
        ) {
          const prev = slide.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = ADDED;
          return { y: slide.y, id: ptr };
        } else {
          const prev = down.id;
          ptr++;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = REMOVED;
          return { y: down.y + 1, id: ptr };
        }
      }
      function snake(k, slide, down, _offset, A, B) {
        const M = A.length;
        const N = B.length;
        if (k < -N || M < k) {
          return { y: -1, id: -1 };
        }
        const fp = createFP(slide, down, k, M);
        while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
          const prev = fp.id;
          ptr++;
          fp.id = ptr;
          fp.y += 1;
          routes[ptr] = prev;
          routes[ptr + diffTypesPtrOffset] = COMMON;
        }
        return fp;
      }
      while (fp[delta + offset].y < N) {
        p = p + 1;
        for (let k = -p; k < delta; ++k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        for (let k = delta + p; k > delta; --k) {
          fp[k + offset] = snake(
            k,
            fp[k - 1 + offset],
            fp[k + 1 + offset],
            offset,
            A,
            B,
          );
        }
        fp[delta + offset] = snake(
          delta,
          fp[delta - 1 + offset],
          fp[delta + 1 + offset],
          offset,
          A,
          B,
        );
      }
      return [
        ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ...backTrace(A, B, fp[delta + offset], swapped),
        ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
      ];
    }
    exports_52("default", diff);
    return {
      setters: [],
      execute: function () {
        (function (DiffType) {
          DiffType["removed"] = "removed";
          DiffType["common"] = "common";
          DiffType["added"] = "added";
        })(DiffType || (DiffType = {}));
        exports_52("DiffType", DiffType);
        REMOVED = 1;
        COMMON = 2;
        ADDED = 3;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.51.0/testing/asserts",
  [
    "https://deno.land/std@0.51.0/fmt/colors",
    "https://deno.land/std@0.51.0/testing/diff",
  ],
  function (exports_53, context_53) {
    "use strict";
    var colors_ts_4, diff_ts_1, CAN_NOT_DISPLAY, AssertionError;
    var __moduleName = context_53 && context_53.id;
    function format(v) {
      let string = Deno.inspect(v);
      if (typeof v == "string") {
        string = `"${string.replace(/(?=["\\])/g, "\\")}"`;
      }
      return string;
    }
    function createColor(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return (s) => colors_ts_4.green(colors_ts_4.bold(s));
        case diff_ts_1.DiffType.removed:
          return (s) => colors_ts_4.red(colors_ts_4.bold(s));
        default:
          return colors_ts_4.white;
      }
    }
    function createSign(diffType) {
      switch (diffType) {
        case diff_ts_1.DiffType.added:
          return "+   ";
        case diff_ts_1.DiffType.removed:
          return "-   ";
        default:
          return "    ";
      }
    }
    function buildMessage(diffResult) {
      const messages = [];
      messages.push("");
      messages.push("");
      messages.push(
        `    ${colors_ts_4.gray(colors_ts_4.bold("[Diff]"))} ${
          colors_ts_4.red(colors_ts_4.bold("Actual"))
        } / ${colors_ts_4.green(colors_ts_4.bold("Expected"))}`,
      );
      messages.push("");
      messages.push("");
      diffResult.forEach((result) => {
        const c = createColor(result.type);
        messages.push(c(`${createSign(result.type)}${result.value}`));
      });
      messages.push("");
      return messages;
    }
    function isKeyedCollection(x) {
      return [Symbol.iterator, "size"].every((k) => k in x);
    }
    function equal(c, d) {
      const seen = new Map();
      return (function compare(a, b) {
        // Have to render RegExp & Date for string comparison
        // unless it's mistreated as object
        if (
          a &&
          b &&
          ((a instanceof RegExp && b instanceof RegExp) ||
            (a instanceof Date && b instanceof Date))
        ) {
          return String(a) === String(b);
        }
        if (Object.is(a, b)) {
          return true;
        }
        if (a && typeof a === "object" && b && typeof b === "object") {
          if (seen.get(a) === b) {
            return true;
          }
          if (Object.keys(a || {}).length !== Object.keys(b || {}).length) {
            return false;
          }
          if (isKeyedCollection(a) && isKeyedCollection(b)) {
            if (a.size !== b.size) {
              return false;
            }
            let unmatchedEntries = a.size;
            for (const [aKey, aValue] of a.entries()) {
              for (const [bKey, bValue] of b.entries()) {
                /* Given that Map keys can be references, we need
                             * to ensure that they are also deeply equal */
                if (
                  (aKey === aValue && bKey === bValue && compare(aKey, bKey)) ||
                  (compare(aKey, bKey) && compare(aValue, bValue))
                ) {
                  unmatchedEntries--;
                }
              }
            }
            return unmatchedEntries === 0;
          }
          const merged = { ...a, ...b };
          for (const key in merged) {
            if (!compare(a && a[key], b && b[key])) {
              return false;
            }
          }
          seen.set(a, b);
          return true;
        }
        return false;
      })(c, d);
    }
    exports_53("equal", equal);
    /** Make an assertion, if not `true`, then throw. */
    function assert(expr, msg = "") {
      if (!expr) {
        throw new AssertionError(msg);
      }
    }
    exports_53("assert", assert);
    /**
     * Make an assertion that `actual` and `expected` are equal, deeply. If not
     * deeply equal, then throw.
     */
    function assertEquals(actual, expected, msg) {
      if (equal(actual, expected)) {
        return;
      }
      let message = "";
      const actualString = format(actual);
      const expectedString = format(expected);
      try {
        const diffResult = diff_ts_1.default(
          actualString.split("\n"),
          expectedString.split("\n"),
        );
        message = buildMessage(diffResult).join("\n");
      } catch (e) {
        message = `\n${colors_ts_4.red(CAN_NOT_DISPLAY)} + \n\n`;
      }
      if (msg) {
        message = msg;
      }
      throw new AssertionError(message);
    }
    exports_53("assertEquals", assertEquals);
    /**
     * Make an assertion that `actual` and `expected` are not equal, deeply.
     * If not then throw.
     */
    function assertNotEquals(actual, expected, msg) {
      if (!equal(actual, expected)) {
        return;
      }
      let actualString;
      let expectedString;
      try {
        actualString = String(actual);
      } catch (e) {
        actualString = "[Cannot display]";
      }
      try {
        expectedString = String(expected);
      } catch (e) {
        expectedString = "[Cannot display]";
      }
      if (!msg) {
        msg = `actual: ${actualString} expected: ${expectedString}`;
      }
      throw new AssertionError(msg);
    }
    exports_53("assertNotEquals", assertNotEquals);
    /**
     * Make an assertion that `actual` and `expected` are strictly equal.  If
     * not then throw.
     */
    function assertStrictEq(actual, expected, msg) {
      if (actual !== expected) {
        let actualString;
        let expectedString;
        try {
          actualString = String(actual);
        } catch (e) {
          actualString = "[Cannot display]";
        }
        try {
          expectedString = String(expected);
        } catch (e) {
          expectedString = "[Cannot display]";
        }
        if (!msg) {
          msg = `actual: ${actualString} expected: ${expectedString}`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_53("assertStrictEq", assertStrictEq);
    /**
     * Make an assertion that actual contains expected. If not
     * then thrown.
     */
    function assertStrContains(actual, expected, msg) {
      if (!actual.includes(expected)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to contains: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_53("assertStrContains", assertStrContains);
    /**
     * Make an assertion that `actual` contains the `expected` values
     * If not then thrown.
     */
    function assertArrayContains(actual, expected, msg) {
      const missing = [];
      for (let i = 0; i < expected.length; i++) {
        let found = false;
        for (let j = 0; j < actual.length; j++) {
          if (equal(expected[i], actual[j])) {
            found = true;
            break;
          }
        }
        if (!found) {
          missing.push(expected[i]);
        }
      }
      if (missing.length === 0) {
        return;
      }
      if (!msg) {
        msg = `actual: "${actual}" expected to contains: "${expected}"`;
        msg += "\n";
        msg += `missing: ${missing}`;
      }
      throw new AssertionError(msg);
    }
    exports_53("assertArrayContains", assertArrayContains);
    /**
     * Make an assertion that `actual` match RegExp `expected`. If not
     * then thrown
     */
    function assertMatch(actual, expected, msg) {
      if (!expected.test(actual)) {
        if (!msg) {
          msg = `actual: "${actual}" expected to match: "${expected}"`;
        }
        throw new AssertionError(msg);
      }
    }
    exports_53("assertMatch", assertMatch);
    /**
     * Forcefully throws a failed assertion
     */
    function fail(msg) {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      assert(false, `Failed assertion${msg ? `: ${msg}` : "."}`);
    }
    exports_53("fail", fail);
    /** Executes a function, expecting it to throw.  If it does not, then it
     * throws.  An error class and a string that should be included in the
     * error message can also be asserted.
     */
    function assertThrows(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but was "${e.constructor.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (msgIncludes && !e.message.includes(msgIncludes)) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_53("assertThrows", assertThrows);
    async function assertThrowsAsync(fn, ErrorClass, msgIncludes = "", msg) {
      let doesThrow = false;
      let error = null;
      try {
        await fn();
      } catch (e) {
        if (
          ErrorClass && !(Object.getPrototypeOf(e) === ErrorClass.prototype)
        ) {
          msg =
            `Expected error to be instance of "${ErrorClass.name}", but got "${e.name}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        if (msgIncludes && !e.message.includes(msgIncludes)) {
          msg =
            `Expected error message to include "${msgIncludes}", but got "${e.message}"${
              msg ? `: ${msg}` : "."
            }`;
          throw new AssertionError(msg);
        }
        doesThrow = true;
        error = e;
      }
      if (!doesThrow) {
        msg = `Expected function to throw${msg ? `: ${msg}` : "."}`;
        throw new AssertionError(msg);
      }
      return error;
    }
    exports_53("assertThrowsAsync", assertThrowsAsync);
    /** Use this to stub out methods that will throw when invoked. */
    function unimplemented(msg) {
      throw new AssertionError(msg || "unimplemented");
    }
    exports_53("unimplemented", unimplemented);
    /** Use this to assert unreachable code. */
    function unreachable() {
      throw new AssertionError("unreachable");
    }
    exports_53("unreachable", unreachable);
    return {
      setters: [
        function (colors_ts_4_1) {
          colors_ts_4 = colors_ts_4_1;
        },
        function (diff_ts_1_1) {
          diff_ts_1 = diff_ts_1_1;
        },
      ],
      execute: function () {
        CAN_NOT_DISPLAY = "[Cannot display]";
        AssertionError = class AssertionError extends Error {
          constructor(message) {
            super(message);
            this.name = "AssertionError";
          }
        };
        exports_53("AssertionError", AssertionError);
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std@0.51.0/path/win32",
  [
    "https://deno.land/std@0.51.0/path/_constants",
    "https://deno.land/std@0.51.0/path/_util",
    "https://deno.land/std@0.51.0/testing/asserts",
  ],
  function (exports_54, context_54) {
    "use strict";
    var cwd, env, _constants_ts_2, _util_ts_1, asserts_ts_1, sep, delimiter;
    var __moduleName = context_54 && context_54.id;
    function resolve(...pathSegments) {
      let resolvedDevice = "";
      let resolvedTail = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
        } else if (!resolvedDevice) {
          path = cwd();
        } else {
          // Windows has the concept of drive-specific current working
          // directories. If we've resolved a drive letter but not yet an
          // absolute path, get cwd for that drive, or the process cwd if
          // the drive cwd is not available. We're sure the device is not
          // a UNC path at this points, because UNC paths are always absolute.
          path = env.get(`=${resolvedDevice}`) || cwd();
          // Verify that a cwd was found and that it actually points
          // to our drive. If not, default to the drive's root.
          if (
            path === undefined ||
            path.slice(0, 3).toLowerCase() !==
              `${resolvedDevice.toLowerCase()}\\`
          ) {
            path = `${resolvedDevice}\\`;
          }
        }
        _util_ts_1.assertPath(path);
        const len = path.length;
        // Skip empty entries
        if (len === 0) {
          continue;
        }
        let rootEnd = 0;
        let device = "";
        let isAbsolute = false;
        const code = path.charCodeAt(0);
        // Try to match a root
        if (len > 1) {
          if (_util_ts_1.isPathSeparator(code)) {
            // Possible UNC root
            // If we started with a separator, we know we at least have an
            // absolute path of some kind (UNC or otherwise)
            isAbsolute = true;
            if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
              // Matched double path separator at beginning
              let j = 2;
              let last = j;
              // Match 1 or more non-path separators
              for (; j < len; ++j) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                const firstPart = path.slice(last, j);
                // Matched!
                last = j;
                // Match 1 or more path separators
                for (; j < len; ++j) {
                  if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j < len && j !== last) {
                  // Matched!
                  last = j;
                  // Match 1 or more non-path separators
                  for (; j < len; ++j) {
                    if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                      break;
                    }
                  }
                  if (j === len) {
                    // We matched a UNC root only
                    device = `\\\\${firstPart}\\${path.slice(last)}`;
                    rootEnd = j;
                  } else if (j !== last) {
                    // We matched a UNC root with leftovers
                    device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                    rootEnd = j;
                  }
                }
              }
            } else {
              rootEnd = 1;
            }
          } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
            // Possible device root
            if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
              device = path.slice(0, 2);
              rootEnd = 2;
              if (len > 2) {
                if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                  // Treat separator following drive name as an absolute path
                  // indicator
                  isAbsolute = true;
                  rootEnd = 3;
                }
              }
            }
          }
        } else if (_util_ts_1.isPathSeparator(code)) {
          // `path` contains just a path separator
          rootEnd = 1;
          isAbsolute = true;
        }
        if (
          device.length > 0 &&
          resolvedDevice.length > 0 &&
          device.toLowerCase() !== resolvedDevice.toLowerCase()
        ) {
          // This path points to another device so it is not applicable
          continue;
        }
        if (resolvedDevice.length === 0 && device.length > 0) {
          resolvedDevice = device;
        }
        if (!resolvedAbsolute) {
          resolvedTail = `${path.slice(rootEnd)}\\${resolvedTail}`;
          resolvedAbsolute = isAbsolute;
        }
        if (resolvedAbsolute && resolvedDevice.length > 0) {
          break;
        }
      }
      // At this point the path should be resolved to a full absolute path,
      // but handle relative paths to be safe (might happen when process.cwd()
      // fails)
      // Normalize the tail path
      resolvedTail = _util_ts_1.normalizeString(
        resolvedTail,
        !resolvedAbsolute,
        "\\",
        _util_ts_1.isPathSeparator,
      );
      return resolvedDevice + (resolvedAbsolute ? "\\" : "") + resolvedTail ||
        ".";
    }
    exports_54("resolve", resolve);
    function normalize(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = 0;
      let device;
      let isAbsolute = false;
      const code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          // If we started with a separator, we know we at least have an absolute
          // path of some kind (UNC or otherwise)
          isAbsolute = true;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              const firstPart = path.slice(last, j);
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  // Return the normalized version of the UNC root since there
                  // is nothing left to process
                  return `\\\\${firstPart}\\${path.slice(last)}\\`;
                } else if (j !== last) {
                  // We matched a UNC root with leftovers
                  device = `\\\\${firstPart}\\${path.slice(last, j)}`;
                  rootEnd = j;
                }
              }
            }
          } else {
            rootEnd = 1;
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            device = path.slice(0, 2);
            rootEnd = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                // Treat separator following drive name as an absolute path
                // indicator
                isAbsolute = true;
                rootEnd = 3;
              }
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid unnecessary
        // work
        return "\\";
      }
      let tail;
      if (rootEnd < len) {
        tail = _util_ts_1.normalizeString(
          path.slice(rootEnd),
          !isAbsolute,
          "\\",
          _util_ts_1.isPathSeparator,
        );
      } else {
        tail = "";
      }
      if (tail.length === 0 && !isAbsolute) {
        tail = ".";
      }
      if (
        tail.length > 0 &&
        _util_ts_1.isPathSeparator(path.charCodeAt(len - 1))
      ) {
        tail += "\\";
      }
      if (device === undefined) {
        if (isAbsolute) {
          if (tail.length > 0) {
            return `\\${tail}`;
          } else {
            return "\\";
          }
        } else if (tail.length > 0) {
          return tail;
        } else {
          return "";
        }
      } else if (isAbsolute) {
        if (tail.length > 0) {
          return `${device}\\${tail}`;
        } else {
          return `${device}\\`;
        }
      } else if (tail.length > 0) {
        return device + tail;
      } else {
        return device;
      }
    }
    exports_54("normalize", normalize);
    function isAbsolute(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return false;
      }
      const code = path.charCodeAt(0);
      if (_util_ts_1.isPathSeparator(code)) {
        return true;
      } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
        // Possible device root
        if (len > 2 && path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
          if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
            return true;
          }
        }
      }
      return false;
    }
    exports_54("isAbsolute", isAbsolute);
    function join(...paths) {
      const pathsCount = paths.length;
      if (pathsCount === 0) {
        return ".";
      }
      let joined;
      let firstPart = null;
      for (let i = 0; i < pathsCount; ++i) {
        const path = paths[i];
        _util_ts_1.assertPath(path);
        if (path.length > 0) {
          if (joined === undefined) {
            joined = firstPart = path;
          } else {
            joined += `\\${path}`;
          }
        }
      }
      if (joined === undefined) {
        return ".";
      }
      // Make sure that the joined path doesn't start with two slashes, because
      // normalize() will mistake it for an UNC path then.
      //
      // This step is skipped when it is very clear that the user actually
      // intended to point at an UNC path. This is assumed when the first
      // non-empty string arguments starts with exactly two slashes followed by
      // at least one more non-slash character.
      //
      // Note that for normalize() to treat a path as an UNC path it needs to
      // have at least 2 components, so we don't filter for that here.
      // This means that the user can use join to construct UNC paths from
      // a server name and a share name; for example:
      //   path.join('//server', 'share') -> '\\\\server\\share\\')
      let needsReplace = true;
      let slashCount = 0;
      asserts_ts_1.assert(firstPart != null);
      if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(0))) {
        ++slashCount;
        const firstLen = firstPart.length;
        if (firstLen > 1) {
          if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(1))) {
            ++slashCount;
            if (firstLen > 2) {
              if (_util_ts_1.isPathSeparator(firstPart.charCodeAt(2))) {
                ++slashCount;
              } else {
                // We matched a UNC path in the first part
                needsReplace = false;
              }
            }
          }
        }
      }
      if (needsReplace) {
        // Find any more consecutive slashes we need to replace
        for (; slashCount < joined.length; ++slashCount) {
          if (!_util_ts_1.isPathSeparator(joined.charCodeAt(slashCount))) {
            break;
          }
        }
        // Replace the slashes if needed
        if (slashCount >= 2) {
          joined = `\\${joined.slice(slashCount)}`;
        }
      }
      return normalize(joined);
    }
    exports_54("join", join);
    // It will solve the relative path from `from` to `to`, for instance:
    //  from = 'C:\\orandea\\test\\aaa'
    //  to = 'C:\\orandea\\impl\\bbb'
    // The output of the function should be: '..\\..\\impl\\bbb'
    function relative(from, to) {
      _util_ts_1.assertPath(from);
      _util_ts_1.assertPath(to);
      if (from === to) {
        return "";
      }
      const fromOrig = resolve(from);
      const toOrig = resolve(to);
      if (fromOrig === toOrig) {
        return "";
      }
      from = fromOrig.toLowerCase();
      to = toOrig.toLowerCase();
      if (from === to) {
        return "";
      }
      // Trim any leading backslashes
      let fromStart = 0;
      let fromEnd = from.length;
      for (; fromStart < fromEnd; ++fromStart) {
        if (
          from.charCodeAt(fromStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          break;
        }
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      for (; fromEnd - 1 > fromStart; --fromEnd) {
        if (
          from.charCodeAt(fromEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          break;
        }
      }
      const fromLen = fromEnd - fromStart;
      // Trim any leading backslashes
      let toStart = 0;
      let toEnd = to.length;
      for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== _constants_ts_2.CHAR_BACKWARD_SLASH) {
          break;
        }
      }
      // Trim trailing backslashes (applicable to UNC paths only)
      for (; toEnd - 1 > toStart; --toEnd) {
        if (to.charCodeAt(toEnd - 1) !== _constants_ts_2.CHAR_BACKWARD_SLASH) {
          break;
        }
      }
      const toLen = toEnd - toStart;
      // Compare paths to find the longest common path from root
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (
              to.charCodeAt(toStart + i) === _constants_ts_2.CHAR_BACKWARD_SLASH
            ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='C:\\foo\\bar'; to='C:\\foo\\bar\\baz'
              return toOrig.slice(toStart + i + 1);
            } else if (i === 2) {
              // We get here if `from` is the device root.
              // For example: from='C:\\'; to='C:\\foo'
              return toOrig.slice(toStart + i);
            }
          }
          if (fromLen > length) {
            if (
              from.charCodeAt(fromStart + i) ===
                _constants_ts_2.CHAR_BACKWARD_SLASH
            ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='C:\\foo\\bar'; to='C:\\foo'
              lastCommonSep = i;
            } else if (i === 2) {
              // We get here if `to` is the device root.
              // For example: from='C:\\foo\\bar'; to='C:\\'
              lastCommonSep = 3;
            }
          }
          break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) {
          break;
        } else if (fromCode === _constants_ts_2.CHAR_BACKWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      // We found a mismatch before the first common path separator was seen, so
      // return the original `to`.
      if (i !== length && lastCommonSep === -1) {
        return toOrig;
      }
      let out = "";
      if (lastCommonSep === -1) {
        lastCommonSep = 0;
      }
      // Generate the relative path based on the path difference between `to` and
      // `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (
          i === fromEnd ||
          from.charCodeAt(i) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          if (out.length === 0) {
            out += "..";
          } else {
            out += "\\..";
          }
        }
      }
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) {
        return out + toOrig.slice(toStart + lastCommonSep, toEnd);
      } else {
        toStart += lastCommonSep;
        if (
          toOrig.charCodeAt(toStart) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          ++toStart;
        }
        return toOrig.slice(toStart, toEnd);
      }
    }
    exports_54("relative", relative);
    function toNamespacedPath(path) {
      // Note: this will *probably* throw somewhere.
      if (typeof path !== "string") {
        return path;
      }
      if (path.length === 0) {
        return "";
      }
      const resolvedPath = resolve(path);
      if (resolvedPath.length >= 3) {
        if (
          resolvedPath.charCodeAt(0) === _constants_ts_2.CHAR_BACKWARD_SLASH
        ) {
          // Possible UNC root
          if (
            resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_BACKWARD_SLASH
          ) {
            const code = resolvedPath.charCodeAt(2);
            if (
              code !== _constants_ts_2.CHAR_QUESTION_MARK &&
              code !== _constants_ts_2.CHAR_DOT
            ) {
              // Matched non-long UNC root, convert the path to a long UNC path
              return `\\\\?\\UNC\\${resolvedPath.slice(2)}`;
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(resolvedPath.charCodeAt(0))) {
          // Possible device root
          if (
            resolvedPath.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
            resolvedPath.charCodeAt(2) === _constants_ts_2.CHAR_BACKWARD_SLASH
          ) {
            // Matched device root, convert the path to a long UNC path
            return `\\\\?\\${resolvedPath}`;
          }
        }
      }
      return path;
    }
    exports_54("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
      _util_ts_1.assertPath(path);
      const len = path.length;
      if (len === 0) {
        return ".";
      }
      let rootEnd = -1;
      let end = -1;
      let matchedSlash = true;
      let offset = 0;
      const code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          rootEnd = offset = 1;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  return path;
                }
                if (j !== last) {
                  // We matched a UNC root with leftovers
                  // Offset by 1 to include the separator after the UNC root to
                  // treat it as a "normal root" on top of a (UNC) root
                  rootEnd = offset = j + 1;
                }
              }
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            rootEnd = offset = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                rootEnd = offset = 3;
              }
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        return path;
      }
      for (let i = len - 1; i >= offset; --i) {
        if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
      if (end === -1) {
        if (rootEnd === -1) {
          return ".";
        } else {
          end = rootEnd;
        }
      }
      return path.slice(0, end);
    }
    exports_54("dirname", dirname);
    function basename(path, ext = "") {
      if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      _util_ts_1.assertPath(path);
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (path.length >= 2) {
        const drive = path.charCodeAt(0);
        if (_util_ts_1.isWindowsDeviceRoot(drive)) {
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            start = 2;
          }
        }
      }
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= start; --i) {
          const code = path.charCodeAt(i);
          if (_util_ts_1.isPathSeparator(code)) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= start; --i) {
          if (_util_ts_1.isPathSeparator(path.charCodeAt(i))) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) {
          return "";
        }
        return path.slice(start, end);
      }
    }
    exports_54("basename", basename);
    function extname(path) {
      _util_ts_1.assertPath(path);
      let start = 0;
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Check for a drive letter prefix so as not to mistake the following
      // path separator as an extra separator at the end of the path that can be
      // disregarded
      if (
        path.length >= 2 &&
        path.charCodeAt(1) === _constants_ts_2.CHAR_COLON &&
        _util_ts_1.isWindowsDeviceRoot(path.charCodeAt(0))
      ) {
        start = startPart = 2;
      }
      for (let i = path.length - 1; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (_util_ts_1.isPathSeparator(code)) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_2.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        return "";
      }
      return path.slice(startDot, end);
    }
    exports_54("extname", extname);
    function format(pathObject) {
      /* eslint-disable max-len */
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(
          `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`,
        );
      }
      return _util_ts_1._format("\\", pathObject);
    }
    exports_54("format", format);
    function parse(path) {
      _util_ts_1.assertPath(path);
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      const len = path.length;
      if (len === 0) {
        return ret;
      }
      let rootEnd = 0;
      let code = path.charCodeAt(0);
      // Try to match a root
      if (len > 1) {
        if (_util_ts_1.isPathSeparator(code)) {
          // Possible UNC root
          rootEnd = 1;
          if (_util_ts_1.isPathSeparator(path.charCodeAt(1))) {
            // Matched double path separator at beginning
            let j = 2;
            let last = j;
            // Match 1 or more non-path separators
            for (; j < len; ++j) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                break;
              }
            }
            if (j < len && j !== last) {
              // Matched!
              last = j;
              // Match 1 or more path separators
              for (; j < len; ++j) {
                if (!_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                  break;
                }
              }
              if (j < len && j !== last) {
                // Matched!
                last = j;
                // Match 1 or more non-path separators
                for (; j < len; ++j) {
                  if (_util_ts_1.isPathSeparator(path.charCodeAt(j))) {
                    break;
                  }
                }
                if (j === len) {
                  // We matched a UNC root only
                  rootEnd = j;
                } else if (j !== last) {
                  // We matched a UNC root with leftovers
                  rootEnd = j + 1;
                }
              }
            }
          }
        } else if (_util_ts_1.isWindowsDeviceRoot(code)) {
          // Possible device root
          if (path.charCodeAt(1) === _constants_ts_2.CHAR_COLON) {
            rootEnd = 2;
            if (len > 2) {
              if (_util_ts_1.isPathSeparator(path.charCodeAt(2))) {
                if (len === 3) {
                  // `path` contains just a drive root, exit early to avoid
                  // unnecessary work
                  ret.root = ret.dir = path;
                  return ret;
                }
                rootEnd = 3;
              }
            } else {
              // `path` contains just a drive root, exit early to avoid
              // unnecessary work
              ret.root = ret.dir = path;
              return ret;
            }
          }
        }
      } else if (_util_ts_1.isPathSeparator(code)) {
        // `path` contains just a path separator, exit early to avoid
        // unnecessary work
        ret.root = ret.dir = path;
        return ret;
      }
      if (rootEnd > 0) {
        ret.root = path.slice(0, rootEnd);
      }
      let startDot = -1;
      let startPart = rootEnd;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Get non-dir info
      for (; i >= rootEnd; --i) {
        code = path.charCodeAt(i);
        if (_util_ts_1.isPathSeparator(code)) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_2.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        if (end !== -1) {
          ret.base = ret.name = path.slice(startPart, end);
        }
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
        ret.ext = path.slice(startDot, end);
      }
      // If the directory is the root, use the entire root as the `dir` including
      // the trailing slash if any (`C:\abc` -> `C:\`). Otherwise, strip out the
      // trailing slash (`C:\abc\def` -> `C:\abc`).
      if (startPart > 0 && startPart !== rootEnd) {
        ret.dir = path.slice(0, startPart - 1);
      } else {
        ret.dir = ret.root;
      }
      return ret;
    }
    exports_54("parse", parse);
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///C:/Users/foo"); // "C:\\Users\\foo"
     *      fromFileUrl("file:///home/foo"); // "\\home\\foo"
     *
     * Note that non-file URLs are treated as file URLs and irrelevant components
     * are ignored.
     */
    function fromFileUrl(url) {
      return new URL(url).pathname
        .replace(/^\/*([A-Za-z]:)(\/|$)/, "$1/")
        .replace(/\//g, "\\");
    }
    exports_54("fromFileUrl", fromFileUrl);
    return {
      setters: [
        function (_constants_ts_2_1) {
          _constants_ts_2 = _constants_ts_2_1;
        },
        function (_util_ts_1_1) {
          _util_ts_1 = _util_ts_1_1;
        },
        function (asserts_ts_1_1) {
          asserts_ts_1 = asserts_ts_1_1;
        },
      ],
      execute: function () {
        cwd = Deno.cwd, env = Deno.env;
        exports_54("sep", sep = "\\");
        exports_54("delimiter", delimiter = ";");
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std@0.51.0/path/posix",
  [
    "https://deno.land/std@0.51.0/path/_constants",
    "https://deno.land/std@0.51.0/path/_util",
  ],
  function (exports_55, context_55) {
    "use strict";
    var cwd, _constants_ts_3, _util_ts_2, sep, delimiter;
    var __moduleName = context_55 && context_55.id;
    // path.resolve([from ...], to)
    function resolve(...pathSegments) {
      let resolvedPath = "";
      let resolvedAbsolute = false;
      for (let i = pathSegments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        let path;
        if (i >= 0) {
          path = pathSegments[i];
        } else {
          path = cwd();
        }
        _util_ts_2.assertPath(path);
        // Skip empty entries
        if (path.length === 0) {
          continue;
        }
        resolvedPath = `${path}/${resolvedPath}`;
        resolvedAbsolute =
          path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      }
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
      // Normalize the path
      resolvedPath = _util_ts_2.normalizeString(
        resolvedPath,
        !resolvedAbsolute,
        "/",
        _util_ts_2.isPosixPathSeparator,
      );
      if (resolvedAbsolute) {
        if (resolvedPath.length > 0) {
          return `/${resolvedPath}`;
        } else {
          return "/";
        }
      } else if (resolvedPath.length > 0) {
        return resolvedPath;
      } else {
        return ".";
      }
    }
    exports_55("resolve", resolve);
    function normalize(path) {
      _util_ts_2.assertPath(path);
      if (path.length === 0) {
        return ".";
      }
      const isAbsolute =
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      const trailingSeparator =
        path.charCodeAt(path.length - 1) === _constants_ts_3.CHAR_FORWARD_SLASH;
      // Normalize the path
      path = _util_ts_2.normalizeString(
        path,
        !isAbsolute,
        "/",
        _util_ts_2.isPosixPathSeparator,
      );
      if (path.length === 0 && !isAbsolute) {
        path = ".";
      }
      if (path.length > 0 && trailingSeparator) {
        path += "/";
      }
      if (isAbsolute) {
        return `/${path}`;
      }
      return path;
    }
    exports_55("normalize", normalize);
    function isAbsolute(path) {
      _util_ts_2.assertPath(path);
      return path.length > 0 &&
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
    }
    exports_55("isAbsolute", isAbsolute);
    function join(...paths) {
      if (paths.length === 0) {
        return ".";
      }
      let joined;
      for (let i = 0, len = paths.length; i < len; ++i) {
        const path = paths[i];
        _util_ts_2.assertPath(path);
        if (path.length > 0) {
          if (!joined) {
            joined = path;
          } else {
            joined += `/${path}`;
          }
        }
      }
      if (!joined) {
        return ".";
      }
      return normalize(joined);
    }
    exports_55("join", join);
    function relative(from, to) {
      _util_ts_2.assertPath(from);
      _util_ts_2.assertPath(to);
      if (from === to) {
        return "";
      }
      from = resolve(from);
      to = resolve(to);
      if (from === to) {
        return "";
      }
      // Trim any leading backslashes
      let fromStart = 1;
      const fromEnd = from.length;
      for (; fromStart < fromEnd; ++fromStart) {
        if (from.charCodeAt(fromStart) !== _constants_ts_3.CHAR_FORWARD_SLASH) {
          break;
        }
      }
      const fromLen = fromEnd - fromStart;
      // Trim any leading backslashes
      let toStart = 1;
      const toEnd = to.length;
      for (; toStart < toEnd; ++toStart) {
        if (to.charCodeAt(toStart) !== _constants_ts_3.CHAR_FORWARD_SLASH) {
          break;
        }
      }
      const toLen = toEnd - toStart;
      // Compare paths to find the longest common path from root
      const length = fromLen < toLen ? fromLen : toLen;
      let lastCommonSep = -1;
      let i = 0;
      for (; i <= length; ++i) {
        if (i === length) {
          if (toLen > length) {
            if (
              to.charCodeAt(toStart + i) === _constants_ts_3.CHAR_FORWARD_SLASH
            ) {
              // We get here if `from` is the exact base path for `to`.
              // For example: from='/foo/bar'; to='/foo/bar/baz'
              return to.slice(toStart + i + 1);
            } else if (i === 0) {
              // We get here if `from` is the root
              // For example: from='/'; to='/foo'
              return to.slice(toStart + i);
            }
          } else if (fromLen > length) {
            if (
              from.charCodeAt(fromStart + i) ===
                _constants_ts_3.CHAR_FORWARD_SLASH
            ) {
              // We get here if `to` is the exact base path for `from`.
              // For example: from='/foo/bar/baz'; to='/foo/bar'
              lastCommonSep = i;
            } else if (i === 0) {
              // We get here if `to` is the root.
              // For example: from='/foo'; to='/'
              lastCommonSep = 0;
            }
          }
          break;
        }
        const fromCode = from.charCodeAt(fromStart + i);
        const toCode = to.charCodeAt(toStart + i);
        if (fromCode !== toCode) {
          break;
        } else if (fromCode === _constants_ts_3.CHAR_FORWARD_SLASH) {
          lastCommonSep = i;
        }
      }
      let out = "";
      // Generate the relative path based on the path difference between `to`
      // and `from`
      for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
        if (
          i === fromEnd ||
          from.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH
        ) {
          if (out.length === 0) {
            out += "..";
          } else {
            out += "/..";
          }
        }
      }
      // Lastly, append the rest of the destination (`to`) path that comes after
      // the common path parts
      if (out.length > 0) {
        return out + to.slice(toStart + lastCommonSep);
      } else {
        toStart += lastCommonSep;
        if (to.charCodeAt(toStart) === _constants_ts_3.CHAR_FORWARD_SLASH) {
          ++toStart;
        }
        return to.slice(toStart);
      }
    }
    exports_55("relative", relative);
    function toNamespacedPath(path) {
      // Non-op on posix systems
      return path;
    }
    exports_55("toNamespacedPath", toNamespacedPath);
    function dirname(path) {
      _util_ts_2.assertPath(path);
      if (path.length === 0) {
        return ".";
      }
      const hasRoot = path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      let end = -1;
      let matchedSlash = true;
      for (let i = path.length - 1; i >= 1; --i) {
        if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
          // We saw the first non-path separator
          matchedSlash = false;
        }
      }
      if (end === -1) {
        return hasRoot ? "/" : ".";
      }
      if (hasRoot && end === 1) {
        return "//";
      }
      return path.slice(0, end);
    }
    exports_55("dirname", dirname);
    function basename(path, ext = "") {
      if (ext !== undefined && typeof ext !== "string") {
        throw new TypeError('"ext" argument must be a string');
      }
      _util_ts_2.assertPath(path);
      let start = 0;
      let end = -1;
      let matchedSlash = true;
      let i;
      if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
        if (ext.length === path.length && ext === path) {
          return "";
        }
        let extIdx = ext.length - 1;
        let firstNonSlashEnd = -1;
        for (i = path.length - 1; i >= 0; --i) {
          const code = path.charCodeAt(i);
          if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
            if (firstNonSlashEnd === -1) {
              // We saw the first non-path separator, remember this index in case
              // we need it if the extension ends up not matching
              matchedSlash = false;
              firstNonSlashEnd = i + 1;
            }
            if (extIdx >= 0) {
              // Try to match the explicit extension
              if (code === ext.charCodeAt(extIdx)) {
                if (--extIdx === -1) {
                  // We matched the extension, so mark this as the end of our path
                  // component
                  end = i;
                }
              } else {
                // Extension does not match, so our result is the entire path
                // component
                extIdx = -1;
                end = firstNonSlashEnd;
              }
            }
          }
        }
        if (start === end) {
          end = firstNonSlashEnd;
        } else if (end === -1) {
          end = path.length;
        }
        return path.slice(start, end);
      } else {
        for (i = path.length - 1; i >= 0; --i) {
          if (path.charCodeAt(i) === _constants_ts_3.CHAR_FORWARD_SLASH) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
            // We saw the first non-path separator, mark this as the end of our
            // path component
            matchedSlash = false;
            end = i + 1;
          }
        }
        if (end === -1) {
          return "";
        }
        return path.slice(start, end);
      }
    }
    exports_55("basename", basename);
    function extname(path) {
      _util_ts_2.assertPath(path);
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      for (let i = path.length - 1; i >= 0; --i) {
        const code = path.charCodeAt(i);
        if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_3.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        return "";
      }
      return path.slice(startDot, end);
    }
    exports_55("extname", extname);
    function format(pathObject) {
      /* eslint-disable max-len */
      if (pathObject === null || typeof pathObject !== "object") {
        throw new TypeError(
          `The "pathObject" argument must be of type Object. Received type ${typeof pathObject}`,
        );
      }
      return _util_ts_2._format("/", pathObject);
    }
    exports_55("format", format);
    function parse(path) {
      _util_ts_2.assertPath(path);
      const ret = { root: "", dir: "", base: "", ext: "", name: "" };
      if (path.length === 0) {
        return ret;
      }
      const isAbsolute =
        path.charCodeAt(0) === _constants_ts_3.CHAR_FORWARD_SLASH;
      let start;
      if (isAbsolute) {
        ret.root = "/";
        start = 1;
      } else {
        start = 0;
      }
      let startDot = -1;
      let startPart = 0;
      let end = -1;
      let matchedSlash = true;
      let i = path.length - 1;
      // Track the state of characters (if any) we see before our first dot and
      // after any path separator we find
      let preDotState = 0;
      // Get non-dir info
      for (; i >= start; --i) {
        const code = path.charCodeAt(i);
        if (code === _constants_ts_3.CHAR_FORWARD_SLASH) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
        if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // extension
          matchedSlash = false;
          end = i + 1;
        }
        if (code === _constants_ts_3.CHAR_DOT) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) {
            startDot = i;
          } else if (preDotState !== 1) {
            preDotState = 1;
          }
        } else if (startDot !== -1) {
          // We saw a non-dot and non-path separator before our dot, so we should
          // have a good chance at having a non-empty extension
          preDotState = -1;
        }
      }
      if (
        startDot === -1 ||
        end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        (preDotState === 1 && startDot === end - 1 &&
          startDot === startPart + 1)
      ) {
        if (end !== -1) {
          if (startPart === 0 && isAbsolute) {
            ret.base = ret.name = path.slice(1, end);
          } else {
            ret.base = ret.name = path.slice(startPart, end);
          }
        }
      } else {
        if (startPart === 0 && isAbsolute) {
          ret.name = path.slice(1, startDot);
          ret.base = path.slice(1, end);
        } else {
          ret.name = path.slice(startPart, startDot);
          ret.base = path.slice(startPart, end);
        }
        ret.ext = path.slice(startDot, end);
      }
      if (startPart > 0) {
        ret.dir = path.slice(0, startPart - 1);
      } else if (isAbsolute) {
        ret.dir = "/";
      }
      return ret;
    }
    exports_55("parse", parse);
    /** Converts a file URL to a path string.
     *
     *      fromFileUrl("file:///home/foo"); // "/home/foo"
     *
     * Note that non-file URLs are treated as file URLs and irrelevant components
     * are ignored.
     */
    function fromFileUrl(url) {
      return new URL(url).pathname;
    }
    exports_55("fromFileUrl", fromFileUrl);
    return {
      setters: [
        function (_constants_ts_3_1) {
          _constants_ts_3 = _constants_ts_3_1;
        },
        function (_util_ts_2_1) {
          _util_ts_2 = _util_ts_2_1;
        },
      ],
      execute: function () {
        cwd = Deno.cwd;
        exports_55("sep", sep = "/");
        exports_55("delimiter", delimiter = ":");
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.51.0/path/separator",
  [],
  function (exports_56, context_56) {
    "use strict";
    var isWindows, SEP, SEP_PATTERN;
    var __moduleName = context_56 && context_56.id;
    return {
      setters: [],
      execute: function () {
        // Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
        isWindows = Deno.build.os == "windows";
        exports_56("SEP", SEP = isWindows ? "\\" : "/");
        exports_56("SEP_PATTERN", SEP_PATTERN = isWindows ? /[\\/]+/ : /\/+/);
      },
    };
  },
);
// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
System.register(
  "https://deno.land/std@0.51.0/path/common",
  ["https://deno.land/std@0.51.0/path/separator"],
  function (exports_57, context_57) {
    "use strict";
    var separator_ts_1;
    var __moduleName = context_57 && context_57.id;
    /** Determines the common path from a set of paths, using an optional separator,
     * which defaults to the OS default separator.
     *
     *       import { common } from "https://deno.land/std/path/mod.ts";
     *       const p = common([
     *         "./deno/std/path/mod.ts",
     *         "./deno/std/fs/mod.ts",
     *       ]);
     *       console.log(p); // "./deno/std/"
     *
     */
    function common(paths, sep = separator_ts_1.SEP) {
      const [first = "", ...remaining] = paths;
      if (first === "" || remaining.length === 0) {
        return first.substring(0, first.lastIndexOf(sep) + 1);
      }
      const parts = first.split(sep);
      let endOfPrefix = parts.length;
      for (const path of remaining) {
        const compare = path.split(sep);
        for (let i = 0; i < endOfPrefix; i++) {
          if (compare[i] !== parts[i]) {
            endOfPrefix = i;
          }
        }
        if (endOfPrefix === 0) {
          return "";
        }
      }
      const prefix = parts.slice(0, endOfPrefix).join(sep);
      return prefix.endsWith(sep) ? prefix : `${prefix}${sep}`;
    }
    exports_57("common", common);
    return {
      setters: [
        function (separator_ts_1_1) {
          separator_ts_1 = separator_ts_1_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// This file is ported from globrex@0.1.2
// MIT License
// Copyright (c) 2018 Terkel Gjervig Nielsen
System.register(
  "https://deno.land/std@0.51.0/path/_globrex",
  [],
  function (exports_58, context_58) {
    "use strict";
    var isWin,
      SEP,
      SEP_ESC,
      SEP_RAW,
      GLOBSTAR,
      WILDCARD,
      GLOBSTAR_SEGMENT,
      WILDCARD_SEGMENT;
    var __moduleName = context_58 && context_58.id;
    /**
     * Convert any glob pattern to a JavaScript Regexp object
     * @param glob Glob pattern to convert
     * @param opts Configuration object
     * @returns Converted object with string, segments and RegExp object
     */
    function globrex(
      glob,
      {
        extended = false,
        globstar = false,
        strict = false,
        filepath = false,
        flags = "",
      } = {},
    ) {
      const sepPattern = new RegExp(`^${SEP}${strict ? "" : "+"}$`);
      let regex = "";
      let segment = "";
      let pathRegexStr = "";
      const pathSegments = [];
      // If we are doing extended matching, this boolean is true when we are inside
      // a group (eg {*.html,*.js}), and false otherwise.
      let inGroup = false;
      let inRange = false;
      // extglob stack. Keep track of scope
      const ext = [];
      // Helper function to build string and segments
      function add(str, options = { split: false, last: false, only: "" }) {
        const { split, last, only } = options;
        if (only !== "path") {
          regex += str;
        }
        if (filepath && only !== "regex") {
          pathRegexStr += str.match(sepPattern) ? SEP : str;
          if (split) {
            if (last) {
              segment += str;
            }
            if (segment !== "") {
              // change it 'includes'
              if (!flags.includes("g")) {
                segment = `^${segment}$`;
              }
              pathSegments.push(new RegExp(segment, flags));
            }
            segment = "";
          } else {
            segment += str;
          }
        }
      }
      let c, n;
      for (let i = 0; i < glob.length; i++) {
        c = glob[i];
        n = glob[i + 1];
        if (["\\", "$", "^", ".", "="].includes(c)) {
          add(`\\${c}`);
          continue;
        }
        if (c.match(sepPattern)) {
          add(SEP, { split: true });
          if (n != null && n.match(sepPattern) && !strict) {
            regex += "?";
          }
          continue;
        }
        if (c === "(") {
          if (ext.length) {
            add(`${c}?:`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ")") {
          if (ext.length) {
            add(c);
            const type = ext.pop();
            if (type === "@") {
              add("{1}");
            } else if (type === "!") {
              add(WILDCARD);
            } else {
              add(type);
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "|") {
          if (ext.length) {
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "+") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "@" && extended) {
          if (n === "(") {
            ext.push(c);
            continue;
          }
        }
        if (c === "!") {
          if (extended) {
            if (inRange) {
              add("^");
              continue;
            }
            if (n === "(") {
              ext.push(c);
              add("(?!");
              i++;
              continue;
            }
            add(`\\${c}`);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "?") {
          if (extended) {
            if (n === "(") {
              ext.push(c);
            } else {
              add(".");
            }
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "[") {
          if (inRange && n === ":") {
            i++; // skip [
            let value = "";
            while (glob[++i] !== ":") {
              value += glob[i];
            }
            if (value === "alnum") {
              add("(?:\\w|\\d)");
            } else if (value === "space") {
              add("\\s");
            } else if (value === "digit") {
              add("\\d");
            }
            i++; // skip last ]
            continue;
          }
          if (extended) {
            inRange = true;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "]") {
          if (extended) {
            inRange = false;
            add(c);
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "{") {
          if (extended) {
            inGroup = true;
            add("(?:");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "}") {
          if (extended) {
            inGroup = false;
            add(")");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === ",") {
          if (inGroup) {
            add("|");
            continue;
          }
          add(`\\${c}`);
          continue;
        }
        if (c === "*") {
          if (n === "(" && extended) {
            ext.push(c);
            continue;
          }
          // Move over all consecutive "*"'s.
          // Also store the previous and next characters
          const prevChar = glob[i - 1];
          let starCount = 1;
          while (glob[i + 1] === "*") {
            starCount++;
            i++;
          }
          const nextChar = glob[i + 1];
          if (!globstar) {
            // globstar is disabled, so treat any number of "*" as one
            add(".*");
          } else {
            // globstar is enabled, so determine if this is a globstar segment
            const isGlobstar = starCount > 1 && // multiple "*"'s
              // from the start of the segment
              [SEP_RAW, "/", undefined].includes(prevChar) &&
              // to the end of the segment
              [SEP_RAW, "/", undefined].includes(nextChar);
            if (isGlobstar) {
              // it's a globstar, so match zero or more path segments
              add(GLOBSTAR, { only: "regex" });
              add(GLOBSTAR_SEGMENT, { only: "path", last: true, split: true });
              i++; // move over the "/"
            } else {
              // it's not a globstar, so only match one path segment
              add(WILDCARD, { only: "regex" });
              add(WILDCARD_SEGMENT, { only: "path" });
            }
          }
          continue;
        }
        add(c);
      }
      // When regexp 'g' flag is specified don't
      // constrain the regular expression with ^ & $
      if (!flags.includes("g")) {
        regex = `^${regex}$`;
        segment = `^${segment}$`;
        if (filepath) {
          pathRegexStr = `^${pathRegexStr}$`;
        }
      }
      const result = { regex: new RegExp(regex, flags) };
      // Push the last segment
      if (filepath) {
        pathSegments.push(new RegExp(segment, flags));
        result.path = {
          regex: new RegExp(pathRegexStr, flags),
          segments: pathSegments,
          globstar: new RegExp(
            !flags.includes("g") ? `^${GLOBSTAR_SEGMENT}$` : GLOBSTAR_SEGMENT,
            flags,
          ),
        };
      }
      return result;
    }
    exports_58("globrex", globrex);
    return {
      setters: [],
      execute: function () {
        isWin = Deno.build.os === "windows";
        SEP = isWin ? `(?:\\\\|\\/)` : `\\/`;
        SEP_ESC = isWin ? `\\\\` : `/`;
        SEP_RAW = isWin ? `\\` : `/`;
        GLOBSTAR = `(?:(?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
        WILDCARD = `(?:[^${SEP_ESC}/]*)`;
        GLOBSTAR_SEGMENT = `((?:[^${SEP_ESC}/]*(?:${SEP_ESC}|\/|$))*)`;
        WILDCARD_SEGMENT = `(?:[^${SEP_ESC}/]*)`;
      },
    };
  },
);
System.register(
  "https://deno.land/std@0.51.0/path/glob",
  [
    "https://deno.land/std@0.51.0/path/separator",
    "https://deno.land/std@0.51.0/path/_globrex",
    "https://deno.land/std@0.51.0/path/mod",
    "https://deno.land/std@0.51.0/testing/asserts",
  ],
  function (exports_59, context_59) {
    "use strict";
    var separator_ts_2, _globrex_ts_1, mod_ts_2, asserts_ts_2;
    var __moduleName = context_59 && context_59.id;
    /**
     * Generate a regex based on glob pattern and options
     * This was meant to be using the the `fs.walk` function
     * but can be used anywhere else.
     * Examples:
     *
     *     Looking for all the `ts` files:
     *     walkSync(".", {
     *       match: [globToRegExp("*.ts")]
     *     })
     *
     *     Looking for all the `.json` files in any subfolder:
     *     walkSync(".", {
     *       match: [globToRegExp(join("a", "**", "*.json"),{
     *         flags: "g",
     *         extended: true,
     *         globstar: true
     *       })]
     *     })
     *
     * @param glob - Glob pattern to be used
     * @param options - Specific options for the glob pattern
     * @returns A RegExp for the glob pattern
     */
    function globToRegExp(glob, { extended = false, globstar = true } = {}) {
      const result = _globrex_ts_1.globrex(glob, {
        extended,
        globstar,
        strict: false,
        filepath: true,
      });
      asserts_ts_2.assert(result.path != null);
      return result.path.regex;
    }
    exports_59("globToRegExp", globToRegExp);
    /** Test whether the given string is a glob */
    function isGlob(str) {
      const chars = { "{": "}", "(": ")", "[": "]" };
      /* eslint-disable-next-line max-len */
      const regex =
        /\\(.)|(^!|\*|[\].+)]\?|\[[^\\\]]+\]|\{[^\\}]+\}|\(\?[:!=][^\\)]+\)|\([^|]+\|[^\\)]+\))/;
      if (str === "") {
        return false;
      }
      let match;
      while ((match = regex.exec(str))) {
        if (match[2]) {
          return true;
        }
        let idx = match.index + match[0].length;
        // if an open bracket/brace/paren is escaped,
        // set the index to the next closing character
        const open = match[1];
        const close = open ? chars[open] : null;
        if (open && close) {
          const n = str.indexOf(close, idx);
          if (n !== -1) {
            idx = n + 1;
          }
        }
        str = str.slice(idx);
      }
      return false;
    }
    exports_59("isGlob", isGlob);
    /** Like normalize(), but doesn't collapse "**\/.." when `globstar` is true. */
    function normalizeGlob(glob, { globstar = false } = {}) {
      if (!!glob.match(/\0/g)) {
        throw new Error(`Glob contains invalid characters: "${glob}"`);
      }
      if (!globstar) {
        return mod_ts_2.normalize(glob);
      }
      const s = separator_ts_2.SEP_PATTERN.source;
      const badParentPattern = new RegExp(
        `(?<=(${s}|^)\\*\\*${s})\\.\\.(?=${s}|$)`,
        "g",
      );
      return mod_ts_2.normalize(glob.replace(badParentPattern, "\0")).replace(
        /\0/g,
        "..",
      );
    }
    exports_59("normalizeGlob", normalizeGlob);
    /** Like join(), but doesn't collapse "**\/.." when `globstar` is true. */
    function joinGlobs(globs, { extended = false, globstar = false } = {}) {
      if (!globstar || globs.length == 0) {
        return mod_ts_2.join(...globs);
      }
      if (globs.length === 0) {
        return ".";
      }
      let joined;
      for (const glob of globs) {
        const path = glob;
        if (path.length > 0) {
          if (!joined) {
            joined = path;
          } else {
            joined += `${separator_ts_2.SEP}${path}`;
          }
        }
      }
      if (!joined) {
        return ".";
      }
      return normalizeGlob(joined, { extended, globstar });
    }
    exports_59("joinGlobs", joinGlobs);
    return {
      setters: [
        function (separator_ts_2_1) {
          separator_ts_2 = separator_ts_2_1;
        },
        function (_globrex_ts_1_1) {
          _globrex_ts_1 = _globrex_ts_1_1;
        },
        function (mod_ts_2_1) {
          mod_ts_2 = mod_ts_2_1;
        },
        function (asserts_ts_2_1) {
          asserts_ts_2 = asserts_ts_2_1;
        },
      ],
      execute: function () {
      },
    };
  },
);
// Copyright the Browserify authors. MIT License.
// Ported mostly from https://github.com/browserify/path-browserify/
System.register(
  "https://deno.land/std@0.51.0/path/mod",
  [
    "https://deno.land/std@0.51.0/path/win32",
    "https://deno.land/std@0.51.0/path/posix",
    "https://deno.land/std@0.51.0/path/common",
    "https://deno.land/std@0.51.0/path/separator",
    "https://deno.land/std@0.51.0/path/interface",
    "https://deno.land/std@0.51.0/path/glob",
  ],
  function (exports_60, context_60) {
    "use strict";
    var _win32,
      _posix,
      isWindows,
      path,
      win32,
      posix,
      basename,
      delimiter,
      dirname,
      extname,
      format,
      fromFileUrl,
      isAbsolute,
      join,
      normalize,
      parse,
      relative,
      resolve,
      sep,
      toNamespacedPath;
    var __moduleName = context_60 && context_60.id;
    var exportedNames_1 = {
      "win32": true,
      "posix": true,
      "basename": true,
      "delimiter": true,
      "dirname": true,
      "extname": true,
      "format": true,
      "fromFileUrl": true,
      "isAbsolute": true,
      "join": true,
      "normalize": true,
      "parse": true,
      "relative": true,
      "resolve": true,
      "sep": true,
      "toNamespacedPath": true,
      "SEP": true,
      "SEP_PATTERN": true,
    };
    function exportStar_3(m) {
      var exports = {};
      for (var n in m) {
        if (n !== "default" && !exportedNames_1.hasOwnProperty(n)) {
          exports[n] = m[n];
        }
      }
      exports_60(exports);
    }
    return {
      setters: [
        function (_win32_1) {
          _win32 = _win32_1;
        },
        function (_posix_1) {
          _posix = _posix_1;
        },
        function (common_ts_1_1) {
          exportStar_3(common_ts_1_1);
        },
        function (separator_ts_3_1) {
          exports_60({
            "SEP": separator_ts_3_1["SEP"],
            "SEP_PATTERN": separator_ts_3_1["SEP_PATTERN"],
          });
        },
        function (interface_ts_1_1) {
          exportStar_3(interface_ts_1_1);
        },
        function (glob_ts_1_1) {
          exportStar_3(glob_ts_1_1);
        },
      ],
      execute: function () {
        isWindows = Deno.build.os == "windows";
        path = isWindows ? _win32 : _posix;
        exports_60("win32", win32 = _win32);
        exports_60("posix", posix = _posix);
        exports_60("basename", basename = path.basename),
          exports_60("delimiter", delimiter = path.delimiter),
          exports_60("dirname", dirname = path.dirname),
          exports_60("extname", extname = path.extname),
          exports_60("format", format = path.format),
          exports_60("fromFileUrl", fromFileUrl = path.fromFileUrl),
          exports_60("isAbsolute", isAbsolute = path.isAbsolute),
          exports_60("join", join = path.join),
          exports_60("normalize", normalize = path.normalize),
          exports_60("parse", parse = path.parse),
          exports_60("relative", relative = path.relative),
          exports_60("resolve", resolve = path.resolve),
          exports_60("sep", sep = path.sep),
          exports_60(
            "toNamespacedPath",
            toNamespacedPath = path.toNamespacedPath,
          );
      },
    };
  },
);
System.register(
  "file:///home/thienbui/Dev/ddm/src/jsonParser",
  [
    "https://deno.land/std@0.51.0/fs/read_json",
    "https://deno.land/std@0.51.0/fs/write_json",
    "https://deno.land/std@0.51.0/path/mod",
  ],
  function (exports_61, context_61) {
    "use strict";
    var read_json_ts_1, write_json_ts_1, path_utils, JsonParser;
    var __moduleName = context_61 && context_61.id;
    return {
      setters: [
        function (read_json_ts_1_1) {
          read_json_ts_1 = read_json_ts_1_1;
        },
        function (write_json_ts_1_1) {
          write_json_ts_1 = write_json_ts_1_1;
        },
        function (path_utils_1) {
          path_utils = path_utils_1;
        },
      ],
      execute: function () {
        JsonParser = class JsonParser {
          readPackageJson() {
            if (!this.json) {
              this.json = read_json_ts_1.readJsonSync("package.json");
            }
            return this.json;
          }
          writePackageJson() {
            this.writeJson("package.json", this.readPackageJson());
          }
          writeJson(path, json) {
            Deno.mkdirSync(path_utils.dirname(path), { recursive: true });
            write_json_ts_1.writeJsonSync(path, json, { spaces: 4 });
          }
        };
        exports_61("default", JsonParser);
      },
    };
  },
);
System.register(
  "file:///home/thienbui/Dev/ddm/src/importMapBuilder",
  [
    "file:///home/thienbui/Dev/ddm/src/jsonParser",
    "file:///home/thienbui/Dev/ddm/src/constants",
  ],
  function (exports_62, context_62) {
    "use strict";
    var jsonParser_ts_1, constants_ts_1, ImportMapBuilder;
    var __moduleName = context_62 && context_62.id;
    return {
      setters: [
        function (jsonParser_ts_1_1) {
          jsonParser_ts_1 = jsonParser_ts_1_1;
        },
        function (constants_ts_1_1) {
          constants_ts_1 = constants_ts_1_1;
        },
      ],
      execute: function () {
        ImportMapBuilder = class ImportMapBuilder {
          constructor(parser = new jsonParser_ts_1.default()) {
            this.parser = parser;
          }
          writeImportMap() {
            this.parser.writeJson(
              constants_ts_1.DEFAULT_IMPORT_MAP,
              this.buildImportMap(),
            );
          }
          buildImportMap() {
            return { "imports": this.buildImportMapContent() };
          }
          buildImportMapContent() {
            const json = this.parser.readPackageJson();
            return Object.keys(json?.dependencies || {})
              .map((key) => ({
                "key": key,
                "value": json.dependencies[key],
              }))
              .map((kvObject) => this.processKV(kvObject))
              .reduce(this.reduceImportMapArray, {});
          }
          reduceImportMapArray(v1, v2) {
            return { ...v1, ...v2 };
          }
          processKV(keyValueObject) {
            const { key, value } = keyValueObject;
            if (value.includes("://")) {
              return { [`${key}/`]: value };
            }
            if (constants_ts_1.DENO_STD.findIndex((k) => k == key) > 0) {
              return { [`${key}/`]: this.denoStd(key, value) };
            }
            return { [`${key}/`]: this.denoX(key, value) };
          }
          denoStd(key, version) {
            return `https://deno.land/std${
              version && version !== "*" ? `@${version}` : ""
            }/${key}/`;
          }
          denoX(key, version) {
            return `https://deno.land/x/${key}${
              version && version !== "*" ? `@${version}` : ""
            }/`;
          }
        };
        exports_62("default", ImportMapBuilder);
      },
    };
  },
);
System.register(
  "file:///home/thienbui/Dev/ddm/src/scriptRunner",
  [
    "file:///home/thienbui/Dev/ddm/src/jsonParser",
    "file:///home/thienbui/Dev/ddm/src/constants",
    "file:///home/thienbui/Dev/ddm/src/importMapBuilder",
  ],
  function (exports_63, context_63) {
    "use strict";
    var jsonParser_ts_2, constants_ts_2, importMapBuilder_ts_1, ScriptRunner;
    var __moduleName = context_63 && context_63.id;
    return {
      setters: [
        function (jsonParser_ts_2_1) {
          jsonParser_ts_2 = jsonParser_ts_2_1;
        },
        function (constants_ts_2_1) {
          constants_ts_2 = constants_ts_2_1;
        },
        function (importMapBuilder_ts_1_1) {
          importMapBuilder_ts_1 = importMapBuilder_ts_1_1;
        },
      ],
      execute: function () {
        ScriptRunner = class ScriptRunner {
          constructor(
            parser = new jsonParser_ts_2.default(),
            importMapBuilder = new importMapBuilder_ts_1.default(parser),
          ) {
            this.parser = parser;
            this.importMapBuilder = importMapBuilder;
            this.DEFAULT_PARAMS = [
              "--unstable",
              `--importmap=${constants_ts_2.DEFAULT_IMPORT_MAP}`,
            ];
            this.IS_WINDOWS = Deno.build.os == "windows";
            this.OS_SHELL_ENV_NAME = this.IS_WINDOWS ? "ComSpec" : "SHELL";
            this.OS_DEFAULT_SHELL = this.IS_WINDOWS ? "cmd.exe" : "sh";
          }
          async runScript(scriptName, ...args) {
            const json = this.parser.readPackageJson();
            if (
              json?.scripts?.[scriptName] ||
              constants_ts_2.DENO_IMPORT_MAP.includes(scriptName) ||
              scriptName === "install"
            ) {
              if (!scriptName.startsWith("pre")) {
                await this.runScript("pre" + scriptName);
              }
              if (json?.scripts?.[scriptName]) {
                const cmd = json.scripts[scriptName].split(" ");
                if (
                  cmd[0] === "deno" &&
                  constants_ts_2.DENO_IMPORT_MAP.includes(cmd[1])
                ) {
                  await this.runDenoCmdWithImportMap(
                    cmd[1],
                    ...cmd.splice(2),
                    ...args,
                  );
                } else {
                  await this.denoRun({
                    cmd: [...cmd, ...args],
                  });
                }
              } else if (scriptName === "install") {
                await this.addDependency(...args);
              } else {
                await this.runDenoCmdWithImportMap(scriptName, ...args);
              }
              if (!scriptName.startsWith("post")) {
                await this.runScript("post" + scriptName);
              }
            }
          }
          async addDependency(...args) {
            const json = this.parser.readPackageJson();
            args.forEach((arg) => {
              const [pkg, version] = arg.split("@");
              json.dependencies[pkg] = version || "*";
            });
            this.parser.writePackageJson();
            this.importMapBuilder.writeImportMap();
          }
          async runDenoCmdWithImportMap(cmd, ...args) {
            await this.denoRun({
              cmd: ["deno", cmd, ...this.DEFAULT_PARAMS, ...args],
            });
          }
          async denoRun(option) {
            const cmd = option.cmd.join(" ");
            if (this.IS_WINDOWS) {
              option.cmd = [this.getShell(), "/d", "/s", "/c", cmd];
            } else {
              option.cmd = [this.getShell(), "-c", cmd];
            }
            const process = Deno.run(option);
            const status = await process.status();
            process.close();
            if (status.code !== 0) {
              throw new Error(`Command returned error code ${status.code}`);
            }
          }
          getShell() {
            try {
              const configuredShell = Deno.env.get(this.OS_SHELL_ENV_NAME);
              if (configuredShell && Deno.statSync(configuredShell).isFile) {
                return configuredShell;
              }
            } catch (ignored) {
            }
            return this.OS_DEFAULT_SHELL;
          }
        };
        exports_63("default", ScriptRunner);
      },
    };
  },
);
System.register(
  "file:///home/thienbui/Dev/ddm/src/commandBuilder",
  [
    "https://deno.land/x/cliffy@v0.6.1/command",
    "file:///home/thienbui/Dev/ddm/src/constants",
    "file:///home/thienbui/Dev/ddm/src/jsonParser",
    "file:///home/thienbui/Dev/ddm/src/scriptRunner",
  ],
  function (exports_64, context_64) {
    "use strict";
    var command_ts_2,
      constants_ts_3,
      jsonParser_ts_3,
      scriptRunner_ts_1,
      CommandBuilder;
    var __moduleName = context_64 && context_64.id;
    return {
      setters: [
        function (command_ts_2_1) {
          command_ts_2 = command_ts_2_1;
        },
        function (constants_ts_3_1) {
          constants_ts_3 = constants_ts_3_1;
        },
        function (jsonParser_ts_3_1) {
          jsonParser_ts_3 = jsonParser_ts_3_1;
        },
        function (scriptRunner_ts_1_1) {
          scriptRunner_ts_1 = scriptRunner_ts_1_1;
        },
      ],
      execute: function () {
        CommandBuilder = class CommandBuilder {
          constructor(
            parser = new jsonParser_ts_3.default(),
            scriptRunner = new scriptRunner_ts_1.default(parser),
          ) {
            this.parser = parser;
            this.scriptRunner = scriptRunner;
          }
          buildCommand() {
            const cmd = new command_ts_2.Command()
              .allowEmpty()
              .version(constants_ts_3.VERSION)
              .description("Manage you project with package.json file.");
            this.buildInstallCommand(cmd);
            this.buildDefaultCommands(cmd);
            this.buildCommandFromPackageJson(cmd);
            return cmd;
          }
          buildInstallCommand(cmd) {
            cmd.command(
              "install",
              new command_ts_2.Command()
                .arguments("[...names@version:string]")
                .example("Without version", "ddm install http")
                .example("With version", "ddm install http@v0.50.0")
                .example("Multiple package", "ddm install http log fmt")
                .description("Install one or more package")
                .useRawArgs()
                .action((flags, ...args) => {
                  this.scriptRunner.runScript("install", ...args);
                }),
            ).default("install");
          }
          buildDefaultCommands(cmd) {
            constants_ts_3.DENO_IMPORT_MAP.forEach((denoCmd) => {
              cmd.command(
                denoCmd,
                new command_ts_2.Command()
                  .arguments("[...parameters:string]")
                  .description(`Run 'deno ${denoCmd}' command`)
                  .useRawArgs()
                  .action((flags, ...args) => {
                    this.scriptRunner.runScript(denoCmd, ...args);
                  }),
              );
            });
          }
          buildCommandFromPackageJson(cmd) {
            const json = this.parser.readPackageJson();
            Object.keys(json?.scripts).forEach((script) => {
              cmd.command(
                script,
                new command_ts_2.Command()
                  .arguments("[...parameters:string]")
                  .description(`Run ${script} script defined in package.json`)
                  .useRawArgs()
                  .action((flags, ...args) => {
                    this.scriptRunner.runScript(script, ...args);
                  }),
                true,
              );
            });
          }
        };
        exports_64("default", CommandBuilder);
      },
    };
  },
);
System.register(
  "file:///home/thienbui/Dev/ddm/src/index",
  ["file:///home/thienbui/Dev/ddm/src/commandBuilder"],
  function (exports_65, context_65) {
    "use strict";
    var commandBuilder_ts_1;
    var __moduleName = context_65 && context_65.id;
    return {
      setters: [
        function (commandBuilder_ts_1_1) {
          commandBuilder_ts_1 = commandBuilder_ts_1_1;
        },
      ],
      execute: async function () {
        if (context_65.meta.main) {
          const cmdBuilder = new commandBuilder_ts_1.default();
          await cmdBuilder.buildCommand().parse(Deno.args);
        }
      },
    };
  },
);

await __instantiateAsync("file:///home/thienbui/Dev/ddm/src/index");
