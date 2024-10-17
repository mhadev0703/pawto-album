import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/.pnpm/tslib@2.6.2/node_modules/tslib/tslib.es6.mjs
var tslib_es6_exports = {};
__export(tslib_es6_exports, {
  __addDisposableResource: () => __addDisposableResource,
  __assign: () => __assign,
  __asyncDelegator: () => __asyncDelegator,
  __asyncGenerator: () => __asyncGenerator,
  __asyncValues: () => __asyncValues,
  __await: () => __await,
  __awaiter: () => __awaiter,
  __classPrivateFieldGet: () => __classPrivateFieldGet,
  __classPrivateFieldIn: () => __classPrivateFieldIn,
  __classPrivateFieldSet: () => __classPrivateFieldSet,
  __createBinding: () => __createBinding,
  __decorate: () => __decorate,
  __disposeResources: () => __disposeResources,
  __esDecorate: () => __esDecorate,
  __exportStar: () => __exportStar,
  __extends: () => __extends,
  __generator: () => __generator,
  __importDefault: () => __importDefault,
  __importStar: () => __importStar,
  __makeTemplateObject: () => __makeTemplateObject,
  __metadata: () => __metadata,
  __param: () => __param,
  __propKey: () => __propKey,
  __read: () => __read,
  __rest: () => __rest,
  __runInitializers: () => __runInitializers,
  __setFunctionName: () => __setFunctionName,
  __spread: () => __spread,
  __spreadArray: () => __spreadArray,
  __spreadArrays: () => __spreadArrays,
  __values: () => __values,
  default: () => tslib_es6_default
});
function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
    throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) {
    if (f !== void 0 && typeof f !== "function")
      throw new TypeError("Function expected");
    return f;
  }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
    var context = {};
    for (var p in contextIn)
      context[p] = p === "access" ? {} : contextIn[p];
    for (var p in contextIn.access)
      context.access[p] = contextIn.access[p];
    context.addInitializer = function(f) {
      if (done)
        throw new TypeError("Cannot add initializers after decoration has completed");
      extraInitializers.push(accept(f || null));
    };
    var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
    if (kind === "accessor") {
      if (result === void 0)
        continue;
      if (result === null || typeof result !== "object")
        throw new TypeError("Object expected");
      if (_ = accept(result.get))
        descriptor.get = _;
      if (_ = accept(result.set))
        descriptor.set = _;
      if (_ = accept(result.init))
        initializers.unshift(_);
    } else if (_ = accept(result)) {
      if (kind === "field")
        initializers.unshift(_);
      else
        descriptor[key] = _;
    }
  }
  if (target)
    Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
}
function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
    value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
}
function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
}
function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol")
    name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
}
function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (g && (g = 0, op[0] && (_ = 0)), _)
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __exportStar(m, o) {
  for (var p in m)
    if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
      __createBinding(o, m, p);
}
function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
}
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
    ar = ar.concat(__read(arguments[i]));
  return ar;
}
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++)
    s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
}
function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
}
function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}
function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n])
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
        __createBinding(result, mod, k);
  }
  __setModuleDefault(result, mod);
  return result;
}
function __importDefault(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || typeof receiver !== "object" && typeof receiver !== "function")
    throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}
function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function")
      throw new TypeError("Object expected.");
    var dispose;
    if (async) {
      if (!Symbol.asyncDispose)
        throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose)
        throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
    }
    if (typeof dispose !== "function")
      throw new TypeError("Object not disposable.");
    env.stack.push({ value, dispose, async });
  } else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}
function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  function next() {
    while (env.stack.length) {
      var rec = env.stack.pop();
      try {
        var result = rec.dispose && rec.dispose.call(rec.value);
        if (rec.async)
          return Promise.resolve(result).then(next, function(e) {
            fail(e);
            return next();
          });
      } catch (e) {
        fail(e);
      }
    }
    if (env.hasError)
      throw env.error;
  }
  return next();
}
var extendStatics, __assign, __createBinding, __setModuleDefault, _SuppressedError, tslib_es6_default;
var init_tslib_es6 = __esm({
  "../../node_modules/.pnpm/tslib@2.6.2/node_modules/tslib/tslib.es6.mjs"() {
    extendStatics = function(d, b) {
      extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (Object.prototype.hasOwnProperty.call(b2, p))
            d2[p] = b2[p];
      };
      return extendStatics(d, b);
    };
    __assign = function() {
      __assign = Object.assign || function __assign3(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign.apply(this, arguments);
    };
    __createBinding = Object.create ? function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    } : function(o, m, k, k2) {
      if (k2 === void 0)
        k2 = k;
      o[k2] = m[k];
    };
    __setModuleDefault = Object.create ? function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    } : function(o, v) {
      o["default"] = v;
    };
    _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    tslib_es6_default = {
      __extends,
      __assign,
      __rest,
      __decorate,
      __param,
      __metadata,
      __awaiter,
      __generator,
      __createBinding,
      __exportStar,
      __values,
      __read,
      __spread,
      __spreadArrays,
      __spreadArray,
      __await,
      __asyncGenerator,
      __asyncDelegator,
      __asyncValues,
      __makeTemplateObject,
      __importStar,
      __importDefault,
      __classPrivateFieldGet,
      __classPrivateFieldSet,
      __classPrivateFieldIn,
      __addDisposableResource,
      __disposeResources
    };
  }
});

// ../../node_modules/.pnpm/tslib@1.14.1/node_modules/tslib/tslib.es6.js
var tslib_es6_exports2 = {};
__export(tslib_es6_exports2, {
  __assign: () => __assign2,
  __asyncDelegator: () => __asyncDelegator2,
  __asyncGenerator: () => __asyncGenerator2,
  __asyncValues: () => __asyncValues2,
  __await: () => __await2,
  __awaiter: () => __awaiter2,
  __classPrivateFieldGet: () => __classPrivateFieldGet2,
  __classPrivateFieldSet: () => __classPrivateFieldSet2,
  __createBinding: () => __createBinding2,
  __decorate: () => __decorate2,
  __exportStar: () => __exportStar2,
  __extends: () => __extends2,
  __generator: () => __generator2,
  __importDefault: () => __importDefault2,
  __importStar: () => __importStar2,
  __makeTemplateObject: () => __makeTemplateObject2,
  __metadata: () => __metadata2,
  __param: () => __param2,
  __read: () => __read2,
  __rest: () => __rest2,
  __spread: () => __spread2,
  __spreadArrays: () => __spreadArrays2,
  __values: () => __values2
});
function __extends2(d, b) {
  extendStatics2(d, b);
  function __() {
    this.constructor = d;
  }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}
function __rest2(s, e) {
  var t = {};
  for (var p in s)
    if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
      if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
        t[p[i]] = s[p[i]];
    }
  return t;
}
function __decorate2(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
    r = Reflect.decorate(decorators, target, key, desc);
  else
    for (var i = decorators.length - 1; i >= 0; i--)
      if (d = decorators[i])
        r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}
function __param2(paramIndex, decorator) {
  return function(target, key) {
    decorator(target, key, paramIndex);
  };
}
function __metadata2(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
    return Reflect.metadata(metadataKey, metadataValue);
}
function __awaiter2(thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function(resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function(resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}
function __generator2(thisArg, body) {
  var _ = { label: 0, sent: function() {
    if (t[0] & 1)
      throw t[1];
    return t[1];
  }, trys: [], ops: [] }, f, y, t, g;
  return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
    return this;
  }), g;
  function verb(n) {
    return function(v) {
      return step([n, v]);
    };
  }
  function step(op) {
    if (f)
      throw new TypeError("Generator is already executing.");
    while (_)
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
          return t;
        if (y = 0, t)
          op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }
            if (t && _.label < t[2]) {
              _.label = t[2];
              _.ops.push(op);
              break;
            }
            if (t[2])
              _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    if (op[0] & 5)
      throw op[1];
    return { value: op[0] ? op[1] : void 0, done: true };
  }
}
function __createBinding2(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  o[k2] = m[k];
}
function __exportStar2(m, exports) {
  for (var p in m)
    if (p !== "default" && !exports.hasOwnProperty(p))
      exports[p] = m[p];
}
function __values2(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m)
    return m.call(o);
  if (o && typeof o.length === "number")
    return {
      next: function() {
        if (o && i >= o.length)
          o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read2(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m)
    return o;
  var i = m.call(o), r, ar = [], e;
  try {
    while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
      ar.push(r.value);
  } catch (error) {
    e = { error };
  } finally {
    try {
      if (r && !r.done && (m = i["return"]))
        m.call(i);
    } finally {
      if (e)
        throw e.error;
    }
  }
  return ar;
}
function __spread2() {
  for (var ar = [], i = 0; i < arguments.length; i++)
    ar = ar.concat(__read2(arguments[i]));
  return ar;
}
function __spreadArrays2() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++)
    s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
    for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
      r[k] = a[j];
  return r;
}
function __await2(v) {
  return this instanceof __await2 ? (this.v = v, this) : new __await2(v);
}
function __asyncGenerator2(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function verb(n) {
    if (g[n])
      i[n] = function(v) {
        return new Promise(function(a, b) {
          q.push([n, v, a, b]) > 1 || resume(n, v);
        });
      };
  }
  function resume(n, v) {
    try {
      step(g[n](v));
    } catch (e) {
      settle(q[0][3], e);
    }
  }
  function step(r) {
    r.value instanceof __await2 ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);
  }
  function fulfill(value) {
    resume("next", value);
  }
  function reject(value) {
    resume("throw", value);
  }
  function settle(f, v) {
    if (f(v), q.shift(), q.length)
      resume(q[0][0], q[0][1]);
  }
}
function __asyncDelegator2(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function(e) {
    throw e;
  }), verb("return"), i[Symbol.iterator] = function() {
    return this;
  }, i;
  function verb(n, f) {
    i[n] = o[n] ? function(v) {
      return (p = !p) ? { value: __await2(o[n](v)), done: n === "return" } : f ? f(v) : v;
    } : f;
  }
}
function __asyncValues2(o) {
  if (!Symbol.asyncIterator)
    throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values2 === "function" ? __values2(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i);
  function verb(n) {
    i[n] = o[n] && function(v) {
      return new Promise(function(resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }
  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function(v2) {
      resolve({ value: v2, done: d });
    }, reject);
  }
}
function __makeTemplateObject2(cooked, raw) {
  if (Object.defineProperty) {
    Object.defineProperty(cooked, "raw", { value: raw });
  } else {
    cooked.raw = raw;
  }
  return cooked;
}
function __importStar2(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (Object.hasOwnProperty.call(mod, k))
        result[k] = mod[k];
  }
  result.default = mod;
  return result;
}
function __importDefault2(mod) {
  return mod && mod.__esModule ? mod : { default: mod };
}
function __classPrivateFieldGet2(receiver, privateMap) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }
  return privateMap.get(receiver);
}
function __classPrivateFieldSet2(receiver, privateMap, value) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to set private field on non-instance");
  }
  privateMap.set(receiver, value);
  return value;
}
var extendStatics2, __assign2;
var init_tslib_es62 = __esm({
  "../../node_modules/.pnpm/tslib@1.14.1/node_modules/tslib/tslib.es6.js"() {
    extendStatics2 = function(d, b) {
      extendStatics2 = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
        d2.__proto__ = b2;
      } || function(d2, b2) {
        for (var p in b2)
          if (b2.hasOwnProperty(p))
            d2[p] = b2[p];
      };
      return extendStatics2(d, b);
    };
    __assign2 = function() {
      __assign2 = Object.assign || function __assign3(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p))
              t[p] = s[p];
        }
        return t;
      };
      return __assign2.apply(this, arguments);
    };
  }
});

// ../../node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-cjs/pureJs.js
var require_pureJs = __commonJS({
  "../../node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-cjs/pureJs.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toUtf8 = exports.fromUtf8 = void 0;
    var fromUtf8 = (input) => {
      const bytes = [];
      for (let i = 0, len = input.length; i < len; i++) {
        const value = input.charCodeAt(i);
        if (value < 128) {
          bytes.push(value);
        } else if (value < 2048) {
          bytes.push(value >> 6 | 192, value & 63 | 128);
        } else if (i + 1 < input.length && (value & 64512) === 55296 && (input.charCodeAt(i + 1) & 64512) === 56320) {
          const surrogatePair = 65536 + ((value & 1023) << 10) + (input.charCodeAt(++i) & 1023);
          bytes.push(surrogatePair >> 18 | 240, surrogatePair >> 12 & 63 | 128, surrogatePair >> 6 & 63 | 128, surrogatePair & 63 | 128);
        } else {
          bytes.push(value >> 12 | 224, value >> 6 & 63 | 128, value & 63 | 128);
        }
      }
      return Uint8Array.from(bytes);
    };
    exports.fromUtf8 = fromUtf8;
    var toUtf8 = (input) => {
      let decoded = "";
      for (let i = 0, len = input.length; i < len; i++) {
        const byte = input[i];
        if (byte < 128) {
          decoded += String.fromCharCode(byte);
        } else if (192 <= byte && byte < 224) {
          const nextByte = input[++i];
          decoded += String.fromCharCode((byte & 31) << 6 | nextByte & 63);
        } else if (240 <= byte && byte < 365) {
          const surrogatePair = [byte, input[++i], input[++i], input[++i]];
          const encoded = "%" + surrogatePair.map((byteValue) => byteValue.toString(16)).join("%");
          decoded += decodeURIComponent(encoded);
        } else {
          decoded += String.fromCharCode((byte & 15) << 12 | (input[++i] & 63) << 6 | input[++i] & 63);
        }
      }
      return decoded;
    };
    exports.toUtf8 = toUtf8;
  }
});

// ../../node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-cjs/whatwgEncodingApi.js
var require_whatwgEncodingApi = __commonJS({
  "../../node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-cjs/whatwgEncodingApi.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toUtf8 = exports.fromUtf8 = void 0;
    function fromUtf8(input) {
      return new TextEncoder().encode(input);
    }
    exports.fromUtf8 = fromUtf8;
    function toUtf8(input) {
      return new TextDecoder("utf-8").decode(input);
    }
    exports.toUtf8 = toUtf8;
  }
});

// ../../node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-cjs/index.js
var require_dist_cjs = __commonJS({
  "../../node_modules/.pnpm/@aws-sdk+util-utf8-browser@3.259.0/node_modules/@aws-sdk/util-utf8-browser/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toUtf8 = exports.fromUtf8 = void 0;
    var pureJs_1 = require_pureJs();
    var whatwgEncodingApi_1 = require_whatwgEncodingApi();
    var fromUtf8 = (input) => typeof TextEncoder === "function" ? (0, whatwgEncodingApi_1.fromUtf8)(input) : (0, pureJs_1.fromUtf8)(input);
    exports.fromUtf8 = fromUtf8;
    var toUtf8 = (input) => typeof TextDecoder === "function" ? (0, whatwgEncodingApi_1.toUtf8)(input) : (0, pureJs_1.toUtf8)(input);
    exports.toUtf8 = toUtf8;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/convertToBuffer.js
var require_convertToBuffer = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/convertToBuffer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertToBuffer = void 0;
    var util_utf8_browser_1 = require_dist_cjs();
    var fromUtf8 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
      return Buffer.from(input, "utf8");
    } : util_utf8_browser_1.fromUtf8;
    function convertToBuffer(data) {
      if (data instanceof Uint8Array)
        return data;
      if (typeof data === "string") {
        return fromUtf8(data);
      }
      if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      }
      return new Uint8Array(data);
    }
    exports.convertToBuffer = convertToBuffer;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/isEmptyData.js
var require_isEmptyData = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/isEmptyData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isEmptyData = void 0;
    function isEmptyData(data) {
      if (typeof data === "string") {
        return data.length === 0;
      }
      return data.byteLength === 0;
    }
    exports.isEmptyData = isEmptyData;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/numToUint8.js
var require_numToUint8 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/numToUint8.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.numToUint8 = void 0;
    function numToUint8(num) {
      return new Uint8Array([
        (num & 4278190080) >> 24,
        (num & 16711680) >> 16,
        (num & 65280) >> 8,
        num & 255
      ]);
    }
    exports.numToUint8 = numToUint8;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/uint32ArrayFrom.js
var require_uint32ArrayFrom = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/uint32ArrayFrom.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uint32ArrayFrom = void 0;
    function uint32ArrayFrom(a_lookUpTable) {
      if (!Uint32Array.from) {
        var return_array = new Uint32Array(a_lookUpTable.length);
        var a_index = 0;
        while (a_index < a_lookUpTable.length) {
          return_array[a_index] = a_lookUpTable[a_index];
          a_index += 1;
        }
        return return_array;
      }
      return Uint32Array.from(a_lookUpTable);
    }
    exports.uint32ArrayFrom = uint32ArrayFrom;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/index.js
var require_build = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+util@3.0.0/node_modules/@aws-crypto/util/build/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uint32ArrayFrom = exports.numToUint8 = exports.isEmptyData = exports.convertToBuffer = void 0;
    var convertToBuffer_1 = require_convertToBuffer();
    Object.defineProperty(exports, "convertToBuffer", { enumerable: true, get: function() {
      return convertToBuffer_1.convertToBuffer;
    } });
    var isEmptyData_1 = require_isEmptyData();
    Object.defineProperty(exports, "isEmptyData", { enumerable: true, get: function() {
      return isEmptyData_1.isEmptyData;
    } });
    var numToUint8_1 = require_numToUint8();
    Object.defineProperty(exports, "numToUint8", { enumerable: true, get: function() {
      return numToUint8_1.numToUint8;
    } });
    var uint32ArrayFrom_1 = require_uint32ArrayFrom();
    Object.defineProperty(exports, "uint32ArrayFrom", { enumerable: true, get: function() {
      return uint32ArrayFrom_1.uint32ArrayFrom;
    } });
  }
});

// ../../node_modules/.pnpm/@aws-crypto+crc32@3.0.0/node_modules/@aws-crypto/crc32/build/aws_crc32.js
var require_aws_crc32 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+crc32@3.0.0/node_modules/@aws-crypto/crc32/build/aws_crc32.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsCrc32 = void 0;
    var tslib_1 = (init_tslib_es62(), __toCommonJS(tslib_es6_exports2));
    var util_1 = require_build();
    var index_1 = require_build2();
    var AwsCrc32 = (
      /** @class */
      function() {
        function AwsCrc322() {
          this.crc32 = new index_1.Crc32();
        }
        AwsCrc322.prototype.update = function(toHash) {
          if ((0, util_1.isEmptyData)(toHash))
            return;
          this.crc32.update((0, util_1.convertToBuffer)(toHash));
        };
        AwsCrc322.prototype.digest = function() {
          return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
              return [2, (0, util_1.numToUint8)(this.crc32.digest())];
            });
          });
        };
        AwsCrc322.prototype.reset = function() {
          this.crc32 = new index_1.Crc32();
        };
        return AwsCrc322;
      }()
    );
    exports.AwsCrc32 = AwsCrc32;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+crc32@3.0.0/node_modules/@aws-crypto/crc32/build/index.js
var require_build2 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+crc32@3.0.0/node_modules/@aws-crypto/crc32/build/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AwsCrc32 = exports.Crc32 = exports.crc32 = void 0;
    var tslib_1 = (init_tslib_es62(), __toCommonJS(tslib_es6_exports2));
    var util_1 = require_build();
    function crc32(data) {
      return new Crc32().update(data).digest();
    }
    exports.crc32 = crc32;
    var Crc32 = (
      /** @class */
      function() {
        function Crc322() {
          this.checksum = 4294967295;
        }
        Crc322.prototype.update = function(data) {
          var e_1, _a;
          try {
            for (var data_1 = tslib_1.__values(data), data_1_1 = data_1.next(); !data_1_1.done; data_1_1 = data_1.next()) {
              var byte = data_1_1.value;
              this.checksum = this.checksum >>> 8 ^ lookupTable[(this.checksum ^ byte) & 255];
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (data_1_1 && !data_1_1.done && (_a = data_1.return))
                _a.call(data_1);
            } finally {
              if (e_1)
                throw e_1.error;
            }
          }
          return this;
        };
        Crc322.prototype.digest = function() {
          return (this.checksum ^ 4294967295) >>> 0;
        };
        return Crc322;
      }()
    );
    exports.Crc32 = Crc32;
    var a_lookUpTable = [
      0,
      1996959894,
      3993919788,
      2567524794,
      124634137,
      1886057615,
      3915621685,
      2657392035,
      249268274,
      2044508324,
      3772115230,
      2547177864,
      162941995,
      2125561021,
      3887607047,
      2428444049,
      498536548,
      1789927666,
      4089016648,
      2227061214,
      450548861,
      1843258603,
      4107580753,
      2211677639,
      325883990,
      1684777152,
      4251122042,
      2321926636,
      335633487,
      1661365465,
      4195302755,
      2366115317,
      997073096,
      1281953886,
      3579855332,
      2724688242,
      1006888145,
      1258607687,
      3524101629,
      2768942443,
      901097722,
      1119000684,
      3686517206,
      2898065728,
      853044451,
      1172266101,
      3705015759,
      2882616665,
      651767980,
      1373503546,
      3369554304,
      3218104598,
      565507253,
      1454621731,
      3485111705,
      3099436303,
      671266974,
      1594198024,
      3322730930,
      2970347812,
      795835527,
      1483230225,
      3244367275,
      3060149565,
      1994146192,
      31158534,
      2563907772,
      4023717930,
      1907459465,
      112637215,
      2680153253,
      3904427059,
      2013776290,
      251722036,
      2517215374,
      3775830040,
      2137656763,
      141376813,
      2439277719,
      3865271297,
      1802195444,
      476864866,
      2238001368,
      4066508878,
      1812370925,
      453092731,
      2181625025,
      4111451223,
      1706088902,
      314042704,
      2344532202,
      4240017532,
      1658658271,
      366619977,
      2362670323,
      4224994405,
      1303535960,
      984961486,
      2747007092,
      3569037538,
      1256170817,
      1037604311,
      2765210733,
      3554079995,
      1131014506,
      879679996,
      2909243462,
      3663771856,
      1141124467,
      855842277,
      2852801631,
      3708648649,
      1342533948,
      654459306,
      3188396048,
      3373015174,
      1466479909,
      544179635,
      3110523913,
      3462522015,
      1591671054,
      702138776,
      2966460450,
      3352799412,
      1504918807,
      783551873,
      3082640443,
      3233442989,
      3988292384,
      2596254646,
      62317068,
      1957810842,
      3939845945,
      2647816111,
      81470997,
      1943803523,
      3814918930,
      2489596804,
      225274430,
      2053790376,
      3826175755,
      2466906013,
      167816743,
      2097651377,
      4027552580,
      2265490386,
      503444072,
      1762050814,
      4150417245,
      2154129355,
      426522225,
      1852507879,
      4275313526,
      2312317920,
      282753626,
      1742555852,
      4189708143,
      2394877945,
      397917763,
      1622183637,
      3604390888,
      2714866558,
      953729732,
      1340076626,
      3518719985,
      2797360999,
      1068828381,
      1219638859,
      3624741850,
      2936675148,
      906185462,
      1090812512,
      3747672003,
      2825379669,
      829329135,
      1181335161,
      3412177804,
      3160834842,
      628085408,
      1382605366,
      3423369109,
      3138078467,
      570562233,
      1426400815,
      3317316542,
      2998733608,
      733239954,
      1555261956,
      3268935591,
      3050360625,
      752459403,
      1541320221,
      2607071920,
      3965973030,
      1969922972,
      40735498,
      2617837225,
      3943577151,
      1913087877,
      83908371,
      2512341634,
      3803740692,
      2075208622,
      213261112,
      2463272603,
      3855990285,
      2094854071,
      198958881,
      2262029012,
      4057260610,
      1759359992,
      534414190,
      2176718541,
      4139329115,
      1873836001,
      414664567,
      2282248934,
      4279200368,
      1711684554,
      285281116,
      2405801727,
      4167216745,
      1634467795,
      376229701,
      2685067896,
      3608007406,
      1308918612,
      956543938,
      2808555105,
      3495958263,
      1231636301,
      1047427035,
      2932959818,
      3654703836,
      1088359270,
      936918e3,
      2847714899,
      3736837829,
      1202900863,
      817233897,
      3183342108,
      3401237130,
      1404277552,
      615818150,
      3134207493,
      3453421203,
      1423857449,
      601450431,
      3009837614,
      3294710456,
      1567103746,
      711928724,
      3020668471,
      3272380065,
      1510334235,
      755167117
    ];
    var lookupTable = (0, util_1.uint32ArrayFrom)(a_lookUpTable);
    var aws_crc32_1 = require_aws_crc32();
    Object.defineProperty(exports, "AwsCrc32", { enumerable: true, get: function() {
      return aws_crc32_1.AwsCrc32;
    } });
  }
});

// ../../node_modules/.pnpm/@smithy+util-hex-encoding@2.0.0/node_modules/@smithy/util-hex-encoding/dist-cjs/index.js
var require_dist_cjs2 = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-hex-encoding@2.0.0/node_modules/@smithy/util-hex-encoding/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toHex = exports.fromHex = void 0;
    var SHORT_TO_HEX = {};
    var HEX_TO_SHORT = {};
    for (let i = 0; i < 256; i++) {
      let encodedByte = i.toString(16).toLowerCase();
      if (encodedByte.length === 1) {
        encodedByte = `0${encodedByte}`;
      }
      SHORT_TO_HEX[i] = encodedByte;
      HEX_TO_SHORT[encodedByte] = i;
    }
    function fromHex(encoded) {
      if (encoded.length % 2 !== 0) {
        throw new Error("Hex encoded strings must have an even number length");
      }
      const out = new Uint8Array(encoded.length / 2);
      for (let i = 0; i < encoded.length; i += 2) {
        const encodedByte = encoded.slice(i, i + 2).toLowerCase();
        if (encodedByte in HEX_TO_SHORT) {
          out[i / 2] = HEX_TO_SHORT[encodedByte];
        } else {
          throw new Error(`Cannot decode unrecognized sequence ${encodedByte} as hexadecimal`);
        }
      }
      return out;
    }
    exports.fromHex = fromHex;
    function toHex(bytes) {
      let out = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        out += SHORT_TO_HEX[bytes[i]];
      }
      return out;
    }
    exports.toHex = toHex;
  }
});

// ../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/Int64.js
var require_Int64 = __commonJS({
  "../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/Int64.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Int64 = void 0;
    var util_hex_encoding_1 = require_dist_cjs2();
    var Int64 = class _Int64 {
      constructor(bytes) {
        this.bytes = bytes;
        if (bytes.byteLength !== 8) {
          throw new Error("Int64 buffers must be exactly 8 bytes");
        }
      }
      static fromNumber(number) {
        if (number > 9223372036854776e3 || number < -9223372036854776e3) {
          throw new Error(`${number} is too large (or, if negative, too small) to represent as an Int64`);
        }
        const bytes = new Uint8Array(8);
        for (let i = 7, remaining = Math.abs(Math.round(number)); i > -1 && remaining > 0; i--, remaining /= 256) {
          bytes[i] = remaining;
        }
        if (number < 0) {
          negate(bytes);
        }
        return new _Int64(bytes);
      }
      valueOf() {
        const bytes = this.bytes.slice(0);
        const negative = bytes[0] & 128;
        if (negative) {
          negate(bytes);
        }
        return parseInt((0, util_hex_encoding_1.toHex)(bytes), 16) * (negative ? -1 : 1);
      }
      toString() {
        return String(this.valueOf());
      }
    };
    exports.Int64 = Int64;
    function negate(bytes) {
      for (let i = 0; i < 8; i++) {
        bytes[i] ^= 255;
      }
      for (let i = 7; i > -1; i--) {
        bytes[i]++;
        if (bytes[i] !== 0)
          break;
      }
    }
  }
});

// ../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/HeaderMarshaller.js
var require_HeaderMarshaller = __commonJS({
  "../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/HeaderMarshaller.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HeaderMarshaller = void 0;
    var util_hex_encoding_1 = require_dist_cjs2();
    var Int64_1 = require_Int64();
    var HeaderMarshaller = class {
      constructor(toUtf8, fromUtf8) {
        this.toUtf8 = toUtf8;
        this.fromUtf8 = fromUtf8;
      }
      format(headers) {
        const chunks = [];
        for (const headerName of Object.keys(headers)) {
          const bytes = this.fromUtf8(headerName);
          chunks.push(Uint8Array.from([bytes.byteLength]), bytes, this.formatHeaderValue(headers[headerName]));
        }
        const out = new Uint8Array(chunks.reduce((carry, bytes) => carry + bytes.byteLength, 0));
        let position = 0;
        for (const chunk of chunks) {
          out.set(chunk, position);
          position += chunk.byteLength;
        }
        return out;
      }
      formatHeaderValue(header) {
        switch (header.type) {
          case "boolean":
            return Uint8Array.from([header.value ? 0 : 1]);
          case "byte":
            return Uint8Array.from([2, header.value]);
          case "short":
            const shortView = new DataView(new ArrayBuffer(3));
            shortView.setUint8(0, 3);
            shortView.setInt16(1, header.value, false);
            return new Uint8Array(shortView.buffer);
          case "integer":
            const intView = new DataView(new ArrayBuffer(5));
            intView.setUint8(0, 4);
            intView.setInt32(1, header.value, false);
            return new Uint8Array(intView.buffer);
          case "long":
            const longBytes = new Uint8Array(9);
            longBytes[0] = 5;
            longBytes.set(header.value.bytes, 1);
            return longBytes;
          case "binary":
            const binView = new DataView(new ArrayBuffer(3 + header.value.byteLength));
            binView.setUint8(0, 6);
            binView.setUint16(1, header.value.byteLength, false);
            const binBytes = new Uint8Array(binView.buffer);
            binBytes.set(header.value, 3);
            return binBytes;
          case "string":
            const utf8Bytes = this.fromUtf8(header.value);
            const strView = new DataView(new ArrayBuffer(3 + utf8Bytes.byteLength));
            strView.setUint8(0, 7);
            strView.setUint16(1, utf8Bytes.byteLength, false);
            const strBytes = new Uint8Array(strView.buffer);
            strBytes.set(utf8Bytes, 3);
            return strBytes;
          case "timestamp":
            const tsBytes = new Uint8Array(9);
            tsBytes[0] = 8;
            tsBytes.set(Int64_1.Int64.fromNumber(header.value.valueOf()).bytes, 1);
            return tsBytes;
          case "uuid":
            if (!UUID_PATTERN.test(header.value)) {
              throw new Error(`Invalid UUID received: ${header.value}`);
            }
            const uuidBytes = new Uint8Array(17);
            uuidBytes[0] = 9;
            uuidBytes.set((0, util_hex_encoding_1.fromHex)(header.value.replace(/\-/g, "")), 1);
            return uuidBytes;
        }
      }
      parse(headers) {
        const out = {};
        let position = 0;
        while (position < headers.byteLength) {
          const nameLength = headers.getUint8(position++);
          const name = this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, nameLength));
          position += nameLength;
          switch (headers.getUint8(position++)) {
            case 0:
              out[name] = {
                type: BOOLEAN_TAG,
                value: true
              };
              break;
            case 1:
              out[name] = {
                type: BOOLEAN_TAG,
                value: false
              };
              break;
            case 2:
              out[name] = {
                type: BYTE_TAG,
                value: headers.getInt8(position++)
              };
              break;
            case 3:
              out[name] = {
                type: SHORT_TAG,
                value: headers.getInt16(position, false)
              };
              position += 2;
              break;
            case 4:
              out[name] = {
                type: INT_TAG,
                value: headers.getInt32(position, false)
              };
              position += 4;
              break;
            case 5:
              out[name] = {
                type: LONG_TAG,
                value: new Int64_1.Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8))
              };
              position += 8;
              break;
            case 6:
              const binaryLength = headers.getUint16(position, false);
              position += 2;
              out[name] = {
                type: BINARY_TAG,
                value: new Uint8Array(headers.buffer, headers.byteOffset + position, binaryLength)
              };
              position += binaryLength;
              break;
            case 7:
              const stringLength = headers.getUint16(position, false);
              position += 2;
              out[name] = {
                type: STRING_TAG,
                value: this.toUtf8(new Uint8Array(headers.buffer, headers.byteOffset + position, stringLength))
              };
              position += stringLength;
              break;
            case 8:
              out[name] = {
                type: TIMESTAMP_TAG,
                value: new Date(new Int64_1.Int64(new Uint8Array(headers.buffer, headers.byteOffset + position, 8)).valueOf())
              };
              position += 8;
              break;
            case 9:
              const uuidBytes = new Uint8Array(headers.buffer, headers.byteOffset + position, 16);
              position += 16;
              out[name] = {
                type: UUID_TAG,
                value: `${(0, util_hex_encoding_1.toHex)(uuidBytes.subarray(0, 4))}-${(0, util_hex_encoding_1.toHex)(uuidBytes.subarray(4, 6))}-${(0, util_hex_encoding_1.toHex)(uuidBytes.subarray(6, 8))}-${(0, util_hex_encoding_1.toHex)(uuidBytes.subarray(8, 10))}-${(0, util_hex_encoding_1.toHex)(uuidBytes.subarray(10))}`
              };
              break;
            default:
              throw new Error(`Unrecognized header type tag`);
          }
        }
        return out;
      }
    };
    exports.HeaderMarshaller = HeaderMarshaller;
    var HEADER_VALUE_TYPE;
    (function(HEADER_VALUE_TYPE2) {
      HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolTrue"] = 0] = "boolTrue";
      HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["boolFalse"] = 1] = "boolFalse";
      HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byte"] = 2] = "byte";
      HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["short"] = 3] = "short";
      HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["integer"] = 4] = "integer";
      HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["long"] = 5] = "long";
      HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["byteArray"] = 6] = "byteArray";
      HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["string"] = 7] = "string";
      HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["timestamp"] = 8] = "timestamp";
      HEADER_VALUE_TYPE2[HEADER_VALUE_TYPE2["uuid"] = 9] = "uuid";
    })(HEADER_VALUE_TYPE || (HEADER_VALUE_TYPE = {}));
    var BOOLEAN_TAG = "boolean";
    var BYTE_TAG = "byte";
    var SHORT_TAG = "short";
    var INT_TAG = "integer";
    var LONG_TAG = "long";
    var BINARY_TAG = "binary";
    var STRING_TAG = "string";
    var TIMESTAMP_TAG = "timestamp";
    var UUID_TAG = "uuid";
    var UUID_PATTERN = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
  }
});

// ../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/splitMessage.js
var require_splitMessage = __commonJS({
  "../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/splitMessage.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.splitMessage = void 0;
    var crc32_1 = require_build2();
    var PRELUDE_MEMBER_LENGTH = 4;
    var PRELUDE_LENGTH = PRELUDE_MEMBER_LENGTH * 2;
    var CHECKSUM_LENGTH = 4;
    var MINIMUM_MESSAGE_LENGTH = PRELUDE_LENGTH + CHECKSUM_LENGTH * 2;
    function splitMessage({ byteLength, byteOffset, buffer }) {
      if (byteLength < MINIMUM_MESSAGE_LENGTH) {
        throw new Error("Provided message too short to accommodate event stream message overhead");
      }
      const view = new DataView(buffer, byteOffset, byteLength);
      const messageLength = view.getUint32(0, false);
      if (byteLength !== messageLength) {
        throw new Error("Reported message length does not match received message length");
      }
      const headerLength = view.getUint32(PRELUDE_MEMBER_LENGTH, false);
      const expectedPreludeChecksum = view.getUint32(PRELUDE_LENGTH, false);
      const expectedMessageChecksum = view.getUint32(byteLength - CHECKSUM_LENGTH, false);
      const checksummer = new crc32_1.Crc32().update(new Uint8Array(buffer, byteOffset, PRELUDE_LENGTH));
      if (expectedPreludeChecksum !== checksummer.digest()) {
        throw new Error(`The prelude checksum specified in the message (${expectedPreludeChecksum}) does not match the calculated CRC32 checksum (${checksummer.digest()})`);
      }
      checksummer.update(new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH, byteLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH)));
      if (expectedMessageChecksum !== checksummer.digest()) {
        throw new Error(`The message checksum (${checksummer.digest()}) did not match the expected value of ${expectedMessageChecksum}`);
      }
      return {
        headers: new DataView(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH, headerLength),
        body: new Uint8Array(buffer, byteOffset + PRELUDE_LENGTH + CHECKSUM_LENGTH + headerLength, messageLength - headerLength - (PRELUDE_LENGTH + CHECKSUM_LENGTH + CHECKSUM_LENGTH))
      };
    }
    exports.splitMessage = splitMessage;
  }
});

// ../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/EventStreamCodec.js
var require_EventStreamCodec = __commonJS({
  "../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/EventStreamCodec.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EventStreamCodec = void 0;
    var crc32_1 = require_build2();
    var HeaderMarshaller_1 = require_HeaderMarshaller();
    var splitMessage_1 = require_splitMessage();
    var EventStreamCodec = class {
      constructor(toUtf8, fromUtf8) {
        this.headerMarshaller = new HeaderMarshaller_1.HeaderMarshaller(toUtf8, fromUtf8);
        this.messageBuffer = [];
        this.isEndOfStream = false;
      }
      feed(message) {
        this.messageBuffer.push(this.decode(message));
      }
      endOfStream() {
        this.isEndOfStream = true;
      }
      getMessage() {
        const message = this.messageBuffer.pop();
        const isEndOfStream = this.isEndOfStream;
        return {
          getMessage() {
            return message;
          },
          isEndOfStream() {
            return isEndOfStream;
          }
        };
      }
      getAvailableMessages() {
        const messages = this.messageBuffer;
        this.messageBuffer = [];
        const isEndOfStream = this.isEndOfStream;
        return {
          getMessages() {
            return messages;
          },
          isEndOfStream() {
            return isEndOfStream;
          }
        };
      }
      encode({ headers: rawHeaders, body }) {
        const headers = this.headerMarshaller.format(rawHeaders);
        const length = headers.byteLength + body.byteLength + 16;
        const out = new Uint8Array(length);
        const view = new DataView(out.buffer, out.byteOffset, out.byteLength);
        const checksum = new crc32_1.Crc32();
        view.setUint32(0, length, false);
        view.setUint32(4, headers.byteLength, false);
        view.setUint32(8, checksum.update(out.subarray(0, 8)).digest(), false);
        out.set(headers, 12);
        out.set(body, headers.byteLength + 12);
        view.setUint32(length - 4, checksum.update(out.subarray(8, length - 4)).digest(), false);
        return out;
      }
      decode(message) {
        const { headers, body } = (0, splitMessage_1.splitMessage)(message);
        return { headers: this.headerMarshaller.parse(headers), body };
      }
      formatHeaders(rawHeaders) {
        return this.headerMarshaller.format(rawHeaders);
      }
    };
    exports.EventStreamCodec = EventStreamCodec;
  }
});

// ../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/Message.js
var require_Message = __commonJS({
  "../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/Message.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/MessageDecoderStream.js
var require_MessageDecoderStream = __commonJS({
  "../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/MessageDecoderStream.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageDecoderStream = void 0;
    var MessageDecoderStream = class {
      constructor(options) {
        this.options = options;
      }
      [Symbol.asyncIterator]() {
        return this.asyncIterator();
      }
      async *asyncIterator() {
        for await (const bytes of this.options.inputStream) {
          const decoded = this.options.decoder.decode(bytes);
          yield decoded;
        }
      }
    };
    exports.MessageDecoderStream = MessageDecoderStream;
  }
});

// ../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/MessageEncoderStream.js
var require_MessageEncoderStream = __commonJS({
  "../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/MessageEncoderStream.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MessageEncoderStream = void 0;
    var MessageEncoderStream = class {
      constructor(options) {
        this.options = options;
      }
      [Symbol.asyncIterator]() {
        return this.asyncIterator();
      }
      async *asyncIterator() {
        for await (const msg of this.options.messageStream) {
          const encoded = this.options.encoder.encode(msg);
          yield encoded;
        }
        if (this.options.includeEndFrame) {
          yield new Uint8Array(0);
        }
      }
    };
    exports.MessageEncoderStream = MessageEncoderStream;
  }
});

// ../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/SmithyMessageDecoderStream.js
var require_SmithyMessageDecoderStream = __commonJS({
  "../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/SmithyMessageDecoderStream.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SmithyMessageDecoderStream = void 0;
    var SmithyMessageDecoderStream = class {
      constructor(options) {
        this.options = options;
      }
      [Symbol.asyncIterator]() {
        return this.asyncIterator();
      }
      async *asyncIterator() {
        for await (const message of this.options.messageStream) {
          const deserialized = await this.options.deserializer(message);
          if (deserialized === void 0)
            continue;
          yield deserialized;
        }
      }
    };
    exports.SmithyMessageDecoderStream = SmithyMessageDecoderStream;
  }
});

// ../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/SmithyMessageEncoderStream.js
var require_SmithyMessageEncoderStream = __commonJS({
  "../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/SmithyMessageEncoderStream.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SmithyMessageEncoderStream = void 0;
    var SmithyMessageEncoderStream = class {
      constructor(options) {
        this.options = options;
      }
      [Symbol.asyncIterator]() {
        return this.asyncIterator();
      }
      async *asyncIterator() {
        for await (const chunk of this.options.inputStream) {
          const payloadBuf = this.options.serializer(chunk);
          yield payloadBuf;
        }
      }
    };
    exports.SmithyMessageEncoderStream = SmithyMessageEncoderStream;
  }
});

// ../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/index.js
var require_dist_cjs3 = __commonJS({
  "../../node_modules/.pnpm/@smithy+eventstream-codec@2.0.14/node_modules/@smithy/eventstream-codec/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_EventStreamCodec(), exports);
    tslib_1.__exportStar(require_HeaderMarshaller(), exports);
    tslib_1.__exportStar(require_Int64(), exports);
    tslib_1.__exportStar(require_Message(), exports);
    tslib_1.__exportStar(require_MessageDecoderStream(), exports);
    tslib_1.__exportStar(require_MessageEncoderStream(), exports);
    tslib_1.__exportStar(require_SmithyMessageDecoderStream(), exports);
    tslib_1.__exportStar(require_SmithyMessageEncoderStream(), exports);
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/abort.js
var require_abort = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/abort.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/auth.js
var require_auth = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/auth.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HttpAuthLocation = void 0;
    var HttpAuthLocation;
    (function(HttpAuthLocation2) {
      HttpAuthLocation2["HEADER"] = "header";
      HttpAuthLocation2["QUERY"] = "query";
    })(HttpAuthLocation = exports.HttpAuthLocation || (exports.HttpAuthLocation = {}));
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/HttpApiKeyAuth.js
var require_HttpApiKeyAuth = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/HttpApiKeyAuth.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.HttpApiKeyAuthLocation = void 0;
    var HttpApiKeyAuthLocation;
    (function(HttpApiKeyAuthLocation2) {
      HttpApiKeyAuthLocation2["HEADER"] = "header";
      HttpApiKeyAuthLocation2["QUERY"] = "query";
    })(HttpApiKeyAuthLocation = exports.HttpApiKeyAuthLocation || (exports.HttpApiKeyAuthLocation = {}));
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/HttpAuthScheme.js
var require_HttpAuthScheme = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/HttpAuthScheme.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/HttpAuthSchemeProvider.js
var require_HttpAuthSchemeProvider = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/HttpAuthSchemeProvider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/HttpSigner.js
var require_HttpSigner = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/HttpSigner.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/IdentityProviderConfig.js
var require_IdentityProviderConfig = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/IdentityProviderConfig.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/index.js
var require_auth2 = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/auth/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_auth(), exports);
    tslib_1.__exportStar(require_HttpApiKeyAuth(), exports);
    tslib_1.__exportStar(require_HttpAuthScheme(), exports);
    tslib_1.__exportStar(require_HttpAuthSchemeProvider(), exports);
    tslib_1.__exportStar(require_HttpSigner(), exports);
    tslib_1.__exportStar(require_IdentityProviderConfig(), exports);
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/blob/blob-payload-input-types.js
var require_blob_payload_input_types = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/blob/blob-payload-input-types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/checksum.js
var require_checksum = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/checksum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/client.js
var require_client = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/client.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/command.js
var require_command = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/command.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/connection/config.js
var require_config = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/connection/config.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/connection/manager.js
var require_manager = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/connection/manager.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/connection/pool.js
var require_pool = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/connection/pool.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/connection/index.js
var require_connection = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/connection/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_config(), exports);
    tslib_1.__exportStar(require_manager(), exports);
    tslib_1.__exportStar(require_pool(), exports);
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/crypto.js
var require_crypto = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/crypto.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/encode.js
var require_encode = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/encode.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoint.js
var require_endpoint = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoint.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EndpointURLScheme = void 0;
    var EndpointURLScheme;
    (function(EndpointURLScheme2) {
      EndpointURLScheme2["HTTP"] = "http";
      EndpointURLScheme2["HTTPS"] = "https";
    })(EndpointURLScheme = exports.EndpointURLScheme || (exports.EndpointURLScheme = {}));
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/EndpointRuleObject.js
var require_EndpointRuleObject = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/EndpointRuleObject.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/ErrorRuleObject.js
var require_ErrorRuleObject = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/ErrorRuleObject.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/RuleSetObject.js
var require_RuleSetObject = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/RuleSetObject.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/shared.js
var require_shared = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/shared.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/TreeRuleObject.js
var require_TreeRuleObject = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/TreeRuleObject.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/index.js
var require_endpoints = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/endpoints/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_EndpointRuleObject(), exports);
    tslib_1.__exportStar(require_ErrorRuleObject(), exports);
    tslib_1.__exportStar(require_RuleSetObject(), exports);
    tslib_1.__exportStar(require_shared(), exports);
    tslib_1.__exportStar(require_TreeRuleObject(), exports);
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/eventStream.js
var require_eventStream = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/eventStream.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/extensions/checksum.js
var require_checksum2 = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/extensions/checksum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveChecksumRuntimeConfig = exports.getChecksumConfiguration = exports.AlgorithmId = void 0;
    var AlgorithmId;
    (function(AlgorithmId2) {
      AlgorithmId2["MD5"] = "md5";
      AlgorithmId2["CRC32"] = "crc32";
      AlgorithmId2["CRC32C"] = "crc32c";
      AlgorithmId2["SHA1"] = "sha1";
      AlgorithmId2["SHA256"] = "sha256";
    })(AlgorithmId = exports.AlgorithmId || (exports.AlgorithmId = {}));
    var getChecksumConfiguration = (runtimeConfig) => {
      const checksumAlgorithms = [];
      if (runtimeConfig.sha256 !== void 0) {
        checksumAlgorithms.push({
          algorithmId: () => AlgorithmId.SHA256,
          checksumConstructor: () => runtimeConfig.sha256
        });
      }
      if (runtimeConfig.md5 != void 0) {
        checksumAlgorithms.push({
          algorithmId: () => AlgorithmId.MD5,
          checksumConstructor: () => runtimeConfig.md5
        });
      }
      return {
        _checksumAlgorithms: checksumAlgorithms,
        addChecksumAlgorithm(algo) {
          this._checksumAlgorithms.push(algo);
        },
        checksumAlgorithms() {
          return this._checksumAlgorithms;
        }
      };
    };
    exports.getChecksumConfiguration = getChecksumConfiguration;
    var resolveChecksumRuntimeConfig = (clientConfig) => {
      const runtimeConfig = {};
      clientConfig.checksumAlgorithms().forEach((checksumAlgorithm) => {
        runtimeConfig[checksumAlgorithm.algorithmId()] = checksumAlgorithm.checksumConstructor();
      });
      return runtimeConfig;
    };
    exports.resolveChecksumRuntimeConfig = resolveChecksumRuntimeConfig;
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/extensions/defaultClientConfiguration.js
var require_defaultClientConfiguration = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/extensions/defaultClientConfiguration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveDefaultRuntimeConfig = exports.getDefaultClientConfiguration = void 0;
    var checksum_1 = require_checksum2();
    var getDefaultClientConfiguration = (runtimeConfig) => {
      return {
        ...(0, checksum_1.getChecksumConfiguration)(runtimeConfig)
      };
    };
    exports.getDefaultClientConfiguration = getDefaultClientConfiguration;
    var resolveDefaultRuntimeConfig = (config) => {
      return {
        ...(0, checksum_1.resolveChecksumRuntimeConfig)(config)
      };
    };
    exports.resolveDefaultRuntimeConfig = resolveDefaultRuntimeConfig;
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/extensions/defaultExtensionConfiguration.js
var require_defaultExtensionConfiguration = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/extensions/defaultExtensionConfiguration.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/extensions/index.js
var require_extensions = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/extensions/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AlgorithmId = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_defaultClientConfiguration(), exports);
    tslib_1.__exportStar(require_defaultExtensionConfiguration(), exports);
    var checksum_1 = require_checksum2();
    Object.defineProperty(exports, "AlgorithmId", { enumerable: true, get: function() {
      return checksum_1.AlgorithmId;
    } });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/http.js
var require_http = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/http.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FieldPosition = void 0;
    var FieldPosition;
    (function(FieldPosition2) {
      FieldPosition2[FieldPosition2["HEADER"] = 0] = "HEADER";
      FieldPosition2[FieldPosition2["TRAILER"] = 1] = "TRAILER";
    })(FieldPosition = exports.FieldPosition || (exports.FieldPosition = {}));
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/identity/apiKeyIdentity.js
var require_apiKeyIdentity = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/identity/apiKeyIdentity.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/identity/awsCredentialIdentity.js
var require_awsCredentialIdentity = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/identity/awsCredentialIdentity.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/identity/identity.js
var require_identity = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/identity/identity.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/identity/tokenIdentity.js
var require_tokenIdentity = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/identity/tokenIdentity.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/identity/index.js
var require_identity2 = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/identity/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_apiKeyIdentity(), exports);
    tslib_1.__exportStar(require_awsCredentialIdentity(), exports);
    tslib_1.__exportStar(require_identity(), exports);
    tslib_1.__exportStar(require_tokenIdentity(), exports);
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/logger.js
var require_logger = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/logger.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/middleware.js
var require_middleware = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/middleware.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SMITHY_CONTEXT_KEY = void 0;
    exports.SMITHY_CONTEXT_KEY = "__smithy_context";
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/pagination.js
var require_pagination = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/pagination.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/profile.js
var require_profile = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/profile.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IniSectionType = void 0;
    var IniSectionType;
    (function(IniSectionType2) {
      IniSectionType2["PROFILE"] = "profile";
      IniSectionType2["SSO_SESSION"] = "sso-session";
      IniSectionType2["SERVICES"] = "services";
    })(IniSectionType = exports.IniSectionType || (exports.IniSectionType = {}));
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/response.js
var require_response = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/response.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/retry.js
var require_retry = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/retry.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/serde.js
var require_serde = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/serde.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/shapes.js
var require_shapes = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/shapes.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/signature.js
var require_signature = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/signature.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/stream.js
var require_stream = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/stream.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/streaming-payload/streaming-blob-common-types.js
var require_streaming_blob_common_types = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/streaming-payload/streaming-blob-common-types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/streaming-payload/streaming-blob-payload-input-types.js
var require_streaming_blob_payload_input_types = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/streaming-payload/streaming-blob-payload-input-types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/streaming-payload/streaming-blob-payload-output-types.js
var require_streaming_blob_payload_output_types = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/streaming-payload/streaming-blob-payload-output-types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/transfer.js
var require_transfer = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/transfer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RequestHandlerProtocol = void 0;
    var RequestHandlerProtocol;
    (function(RequestHandlerProtocol2) {
      RequestHandlerProtocol2["HTTP_0_9"] = "http/0.9";
      RequestHandlerProtocol2["HTTP_1_0"] = "http/1.0";
      RequestHandlerProtocol2["TDS_8_0"] = "tds/8.0";
    })(RequestHandlerProtocol = exports.RequestHandlerProtocol || (exports.RequestHandlerProtocol = {}));
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/transform/client-payload-blob-type-narrow.js
var require_client_payload_blob_type_narrow = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/transform/client-payload-blob-type-narrow.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/transform/no-undefined.js
var require_no_undefined = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/transform/no-undefined.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/transform/type-transform.js
var require_type_transform = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/transform/type-transform.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/uri.js
var require_uri = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/util.js
var require_util = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/waiter.js
var require_waiter = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/waiter.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
  }
});

// ../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/index.js
var require_dist_cjs4 = __commonJS({
  "../../node_modules/.pnpm/@smithy+types@2.6.0/node_modules/@smithy/types/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_abort(), exports);
    tslib_1.__exportStar(require_auth2(), exports);
    tslib_1.__exportStar(require_blob_payload_input_types(), exports);
    tslib_1.__exportStar(require_checksum(), exports);
    tslib_1.__exportStar(require_client(), exports);
    tslib_1.__exportStar(require_command(), exports);
    tslib_1.__exportStar(require_connection(), exports);
    tslib_1.__exportStar(require_crypto(), exports);
    tslib_1.__exportStar(require_encode(), exports);
    tslib_1.__exportStar(require_endpoint(), exports);
    tslib_1.__exportStar(require_endpoints(), exports);
    tslib_1.__exportStar(require_eventStream(), exports);
    tslib_1.__exportStar(require_extensions(), exports);
    tslib_1.__exportStar(require_http(), exports);
    tslib_1.__exportStar(require_identity2(), exports);
    tslib_1.__exportStar(require_logger(), exports);
    tslib_1.__exportStar(require_middleware(), exports);
    tslib_1.__exportStar(require_pagination(), exports);
    tslib_1.__exportStar(require_profile(), exports);
    tslib_1.__exportStar(require_response(), exports);
    tslib_1.__exportStar(require_retry(), exports);
    tslib_1.__exportStar(require_serde(), exports);
    tslib_1.__exportStar(require_shapes(), exports);
    tslib_1.__exportStar(require_signature(), exports);
    tslib_1.__exportStar(require_stream(), exports);
    tslib_1.__exportStar(require_streaming_blob_common_types(), exports);
    tslib_1.__exportStar(require_streaming_blob_payload_input_types(), exports);
    tslib_1.__exportStar(require_streaming_blob_payload_output_types(), exports);
    tslib_1.__exportStar(require_transfer(), exports);
    tslib_1.__exportStar(require_client_payload_blob_type_narrow(), exports);
    tslib_1.__exportStar(require_no_undefined(), exports);
    tslib_1.__exportStar(require_type_transform(), exports);
    tslib_1.__exportStar(require_uri(), exports);
    tslib_1.__exportStar(require_util(), exports);
    tslib_1.__exportStar(require_waiter(), exports);
  }
});

// ../../node_modules/.pnpm/@smithy+util-middleware@2.0.7/node_modules/@smithy/util-middleware/dist-cjs/getSmithyContext.js
var require_getSmithyContext = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-middleware@2.0.7/node_modules/@smithy/util-middleware/dist-cjs/getSmithyContext.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSmithyContext = void 0;
    var types_1 = require_dist_cjs4();
    var getSmithyContext = (context) => context[types_1.SMITHY_CONTEXT_KEY] || (context[types_1.SMITHY_CONTEXT_KEY] = {});
    exports.getSmithyContext = getSmithyContext;
  }
});

// ../../node_modules/.pnpm/@smithy+util-middleware@2.0.7/node_modules/@smithy/util-middleware/dist-cjs/normalizeProvider.js
var require_normalizeProvider = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-middleware@2.0.7/node_modules/@smithy/util-middleware/dist-cjs/normalizeProvider.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.normalizeProvider = void 0;
    var normalizeProvider = (input) => {
      if (typeof input === "function")
        return input;
      const promisified = Promise.resolve(input);
      return () => promisified;
    };
    exports.normalizeProvider = normalizeProvider;
  }
});

// ../../node_modules/.pnpm/@smithy+util-middleware@2.0.7/node_modules/@smithy/util-middleware/dist-cjs/index.js
var require_dist_cjs5 = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-middleware@2.0.7/node_modules/@smithy/util-middleware/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_getSmithyContext(), exports);
    tslib_1.__exportStar(require_normalizeProvider(), exports);
  }
});

// ../../node_modules/.pnpm/@smithy+is-array-buffer@2.0.0/node_modules/@smithy/is-array-buffer/dist-cjs/index.js
var require_dist_cjs6 = __commonJS({
  "../../node_modules/.pnpm/@smithy+is-array-buffer@2.0.0/node_modules/@smithy/is-array-buffer/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isArrayBuffer = void 0;
    var isArrayBuffer = (arg) => typeof ArrayBuffer === "function" && arg instanceof ArrayBuffer || Object.prototype.toString.call(arg) === "[object ArrayBuffer]";
    exports.isArrayBuffer = isArrayBuffer;
  }
});

// ../../node_modules/.pnpm/@smithy+util-buffer-from@2.0.0/node_modules/@smithy/util-buffer-from/dist-cjs/index.js
var require_dist_cjs7 = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-buffer-from@2.0.0/node_modules/@smithy/util-buffer-from/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromString = exports.fromArrayBuffer = void 0;
    var is_array_buffer_1 = require_dist_cjs6();
    var buffer_1 = __require("buffer");
    var fromArrayBuffer = (input, offset = 0, length = input.byteLength - offset) => {
      if (!(0, is_array_buffer_1.isArrayBuffer)(input)) {
        throw new TypeError(`The "input" argument must be ArrayBuffer. Received type ${typeof input} (${input})`);
      }
      return buffer_1.Buffer.from(input, offset, length);
    };
    exports.fromArrayBuffer = fromArrayBuffer;
    var fromString = (input, encoding) => {
      if (typeof input !== "string") {
        throw new TypeError(`The "input" argument must be of type string. Received type ${typeof input} (${input})`);
      }
      return encoding ? buffer_1.Buffer.from(input, encoding) : buffer_1.Buffer.from(input);
    };
    exports.fromString = fromString;
  }
});

// ../../node_modules/.pnpm/@smithy+util-utf8@2.0.2/node_modules/@smithy/util-utf8/dist-cjs/fromUtf8.js
var require_fromUtf8 = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-utf8@2.0.2/node_modules/@smithy/util-utf8/dist-cjs/fromUtf8.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.fromUtf8 = void 0;
    var util_buffer_from_1 = require_dist_cjs7();
    var fromUtf8 = (input) => {
      const buf = (0, util_buffer_from_1.fromString)(input, "utf8");
      return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength / Uint8Array.BYTES_PER_ELEMENT);
    };
    exports.fromUtf8 = fromUtf8;
  }
});

// ../../node_modules/.pnpm/@smithy+util-utf8@2.0.2/node_modules/@smithy/util-utf8/dist-cjs/toUint8Array.js
var require_toUint8Array = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-utf8@2.0.2/node_modules/@smithy/util-utf8/dist-cjs/toUint8Array.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toUint8Array = void 0;
    var fromUtf8_1 = require_fromUtf8();
    var toUint8Array = (data) => {
      if (typeof data === "string") {
        return (0, fromUtf8_1.fromUtf8)(data);
      }
      if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      }
      return new Uint8Array(data);
    };
    exports.toUint8Array = toUint8Array;
  }
});

// ../../node_modules/.pnpm/@smithy+util-utf8@2.0.2/node_modules/@smithy/util-utf8/dist-cjs/toUtf8.js
var require_toUtf8 = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-utf8@2.0.2/node_modules/@smithy/util-utf8/dist-cjs/toUtf8.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toUtf8 = void 0;
    var util_buffer_from_1 = require_dist_cjs7();
    var toUtf8 = (input) => (0, util_buffer_from_1.fromArrayBuffer)(input.buffer, input.byteOffset, input.byteLength).toString("utf8");
    exports.toUtf8 = toUtf8;
  }
});

// ../../node_modules/.pnpm/@smithy+util-utf8@2.0.2/node_modules/@smithy/util-utf8/dist-cjs/index.js
var require_dist_cjs8 = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-utf8@2.0.2/node_modules/@smithy/util-utf8/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_fromUtf8(), exports);
    tslib_1.__exportStar(require_toUint8Array(), exports);
    tslib_1.__exportStar(require_toUtf8(), exports);
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/constants.js
var require_constants = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MAX_PRESIGNED_TTL = exports.KEY_TYPE_IDENTIFIER = exports.MAX_CACHE_SIZE = exports.UNSIGNED_PAYLOAD = exports.EVENT_ALGORITHM_IDENTIFIER = exports.ALGORITHM_IDENTIFIER_V4A = exports.ALGORITHM_IDENTIFIER = exports.UNSIGNABLE_PATTERNS = exports.SEC_HEADER_PATTERN = exports.PROXY_HEADER_PATTERN = exports.ALWAYS_UNSIGNABLE_HEADERS = exports.HOST_HEADER = exports.TOKEN_HEADER = exports.SHA256_HEADER = exports.SIGNATURE_HEADER = exports.GENERATED_HEADERS = exports.DATE_HEADER = exports.AMZ_DATE_HEADER = exports.AUTH_HEADER = exports.REGION_SET_PARAM = exports.TOKEN_QUERY_PARAM = exports.SIGNATURE_QUERY_PARAM = exports.EXPIRES_QUERY_PARAM = exports.SIGNED_HEADERS_QUERY_PARAM = exports.AMZ_DATE_QUERY_PARAM = exports.CREDENTIAL_QUERY_PARAM = exports.ALGORITHM_QUERY_PARAM = void 0;
    exports.ALGORITHM_QUERY_PARAM = "X-Amz-Algorithm";
    exports.CREDENTIAL_QUERY_PARAM = "X-Amz-Credential";
    exports.AMZ_DATE_QUERY_PARAM = "X-Amz-Date";
    exports.SIGNED_HEADERS_QUERY_PARAM = "X-Amz-SignedHeaders";
    exports.EXPIRES_QUERY_PARAM = "X-Amz-Expires";
    exports.SIGNATURE_QUERY_PARAM = "X-Amz-Signature";
    exports.TOKEN_QUERY_PARAM = "X-Amz-Security-Token";
    exports.REGION_SET_PARAM = "X-Amz-Region-Set";
    exports.AUTH_HEADER = "authorization";
    exports.AMZ_DATE_HEADER = exports.AMZ_DATE_QUERY_PARAM.toLowerCase();
    exports.DATE_HEADER = "date";
    exports.GENERATED_HEADERS = [exports.AUTH_HEADER, exports.AMZ_DATE_HEADER, exports.DATE_HEADER];
    exports.SIGNATURE_HEADER = exports.SIGNATURE_QUERY_PARAM.toLowerCase();
    exports.SHA256_HEADER = "x-amz-content-sha256";
    exports.TOKEN_HEADER = exports.TOKEN_QUERY_PARAM.toLowerCase();
    exports.HOST_HEADER = "host";
    exports.ALWAYS_UNSIGNABLE_HEADERS = {
      authorization: true,
      "cache-control": true,
      connection: true,
      expect: true,
      from: true,
      "keep-alive": true,
      "max-forwards": true,
      pragma: true,
      referer: true,
      te: true,
      trailer: true,
      "transfer-encoding": true,
      upgrade: true,
      "user-agent": true,
      "x-amzn-trace-id": true
    };
    exports.PROXY_HEADER_PATTERN = /^proxy-/;
    exports.SEC_HEADER_PATTERN = /^sec-/;
    exports.UNSIGNABLE_PATTERNS = [/^proxy-/i, /^sec-/i];
    exports.ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256";
    exports.ALGORITHM_IDENTIFIER_V4A = "AWS4-ECDSA-P256-SHA256";
    exports.EVENT_ALGORITHM_IDENTIFIER = "AWS4-HMAC-SHA256-PAYLOAD";
    exports.UNSIGNED_PAYLOAD = "UNSIGNED-PAYLOAD";
    exports.MAX_CACHE_SIZE = 50;
    exports.KEY_TYPE_IDENTIFIER = "aws4_request";
    exports.MAX_PRESIGNED_TTL = 60 * 60 * 24 * 7;
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/credentialDerivation.js
var require_credentialDerivation = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/credentialDerivation.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.clearCredentialCache = exports.getSigningKey = exports.createScope = void 0;
    var util_hex_encoding_1 = require_dist_cjs2();
    var util_utf8_1 = require_dist_cjs8();
    var constants_1 = require_constants();
    var signingKeyCache = {};
    var cacheQueue = [];
    var createScope = (shortDate, region, service) => `${shortDate}/${region}/${service}/${constants_1.KEY_TYPE_IDENTIFIER}`;
    exports.createScope = createScope;
    var getSigningKey = async (sha256Constructor, credentials, shortDate, region, service) => {
      const credsHash = await hmac(sha256Constructor, credentials.secretAccessKey, credentials.accessKeyId);
      const cacheKey = `${shortDate}:${region}:${service}:${(0, util_hex_encoding_1.toHex)(credsHash)}:${credentials.sessionToken}`;
      if (cacheKey in signingKeyCache) {
        return signingKeyCache[cacheKey];
      }
      cacheQueue.push(cacheKey);
      while (cacheQueue.length > constants_1.MAX_CACHE_SIZE) {
        delete signingKeyCache[cacheQueue.shift()];
      }
      let key = `AWS4${credentials.secretAccessKey}`;
      for (const signable of [shortDate, region, service, constants_1.KEY_TYPE_IDENTIFIER]) {
        key = await hmac(sha256Constructor, key, signable);
      }
      return signingKeyCache[cacheKey] = key;
    };
    exports.getSigningKey = getSigningKey;
    var clearCredentialCache = () => {
      cacheQueue.length = 0;
      Object.keys(signingKeyCache).forEach((cacheKey) => {
        delete signingKeyCache[cacheKey];
      });
    };
    exports.clearCredentialCache = clearCredentialCache;
    var hmac = (ctor, secret, data) => {
      const hash = new ctor(secret);
      hash.update((0, util_utf8_1.toUint8Array)(data));
      return hash.digest();
    };
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/getCanonicalHeaders.js
var require_getCanonicalHeaders = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/getCanonicalHeaders.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCanonicalHeaders = void 0;
    var constants_1 = require_constants();
    var getCanonicalHeaders = ({ headers }, unsignableHeaders, signableHeaders) => {
      const canonical = {};
      for (const headerName of Object.keys(headers).sort()) {
        if (headers[headerName] == void 0) {
          continue;
        }
        const canonicalHeaderName = headerName.toLowerCase();
        if (canonicalHeaderName in constants_1.ALWAYS_UNSIGNABLE_HEADERS || (unsignableHeaders === null || unsignableHeaders === void 0 ? void 0 : unsignableHeaders.has(canonicalHeaderName)) || constants_1.PROXY_HEADER_PATTERN.test(canonicalHeaderName) || constants_1.SEC_HEADER_PATTERN.test(canonicalHeaderName)) {
          if (!signableHeaders || signableHeaders && !signableHeaders.has(canonicalHeaderName)) {
            continue;
          }
        }
        canonical[canonicalHeaderName] = headers[headerName].trim().replace(/\s+/g, " ");
      }
      return canonical;
    };
    exports.getCanonicalHeaders = getCanonicalHeaders;
  }
});

// ../../node_modules/.pnpm/@smithy+util-uri-escape@2.0.0/node_modules/@smithy/util-uri-escape/dist-cjs/escape-uri.js
var require_escape_uri = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-uri-escape@2.0.0/node_modules/@smithy/util-uri-escape/dist-cjs/escape-uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeUri = void 0;
    var escapeUri = (uri) => encodeURIComponent(uri).replace(/[!'()*]/g, hexEncode);
    exports.escapeUri = escapeUri;
    var hexEncode = (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`;
  }
});

// ../../node_modules/.pnpm/@smithy+util-uri-escape@2.0.0/node_modules/@smithy/util-uri-escape/dist-cjs/escape-uri-path.js
var require_escape_uri_path = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-uri-escape@2.0.0/node_modules/@smithy/util-uri-escape/dist-cjs/escape-uri-path.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.escapeUriPath = void 0;
    var escape_uri_1 = require_escape_uri();
    var escapeUriPath = (uri) => uri.split("/").map(escape_uri_1.escapeUri).join("/");
    exports.escapeUriPath = escapeUriPath;
  }
});

// ../../node_modules/.pnpm/@smithy+util-uri-escape@2.0.0/node_modules/@smithy/util-uri-escape/dist-cjs/index.js
var require_dist_cjs9 = __commonJS({
  "../../node_modules/.pnpm/@smithy+util-uri-escape@2.0.0/node_modules/@smithy/util-uri-escape/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_escape_uri(), exports);
    tslib_1.__exportStar(require_escape_uri_path(), exports);
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/getCanonicalQuery.js
var require_getCanonicalQuery = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/getCanonicalQuery.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getCanonicalQuery = void 0;
    var util_uri_escape_1 = require_dist_cjs9();
    var constants_1 = require_constants();
    var getCanonicalQuery = ({ query = {} }) => {
      const keys = [];
      const serialized = {};
      for (const key of Object.keys(query).sort()) {
        if (key.toLowerCase() === constants_1.SIGNATURE_HEADER) {
          continue;
        }
        keys.push(key);
        const value = query[key];
        if (typeof value === "string") {
          serialized[key] = `${(0, util_uri_escape_1.escapeUri)(key)}=${(0, util_uri_escape_1.escapeUri)(value)}`;
        } else if (Array.isArray(value)) {
          serialized[key] = value.slice(0).reduce((encoded, value2) => encoded.concat([`${(0, util_uri_escape_1.escapeUri)(key)}=${(0, util_uri_escape_1.escapeUri)(value2)}`]), []).sort().join("&");
        }
      }
      return keys.map((key) => serialized[key]).filter((serialized2) => serialized2).join("&");
    };
    exports.getCanonicalQuery = getCanonicalQuery;
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/getPayloadHash.js
var require_getPayloadHash = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/getPayloadHash.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPayloadHash = void 0;
    var is_array_buffer_1 = require_dist_cjs6();
    var util_hex_encoding_1 = require_dist_cjs2();
    var util_utf8_1 = require_dist_cjs8();
    var constants_1 = require_constants();
    var getPayloadHash = async ({ headers, body }, hashConstructor) => {
      for (const headerName of Object.keys(headers)) {
        if (headerName.toLowerCase() === constants_1.SHA256_HEADER) {
          return headers[headerName];
        }
      }
      if (body == void 0) {
        return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";
      } else if (typeof body === "string" || ArrayBuffer.isView(body) || (0, is_array_buffer_1.isArrayBuffer)(body)) {
        const hashCtor = new hashConstructor();
        hashCtor.update((0, util_utf8_1.toUint8Array)(body));
        return (0, util_hex_encoding_1.toHex)(await hashCtor.digest());
      }
      return constants_1.UNSIGNED_PAYLOAD;
    };
    exports.getPayloadHash = getPayloadHash;
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/headerUtil.js
var require_headerUtil = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/headerUtil.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deleteHeader = exports.getHeaderValue = exports.hasHeader = void 0;
    var hasHeader = (soughtHeader, headers) => {
      soughtHeader = soughtHeader.toLowerCase();
      for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
          return true;
        }
      }
      return false;
    };
    exports.hasHeader = hasHeader;
    var getHeaderValue = (soughtHeader, headers) => {
      soughtHeader = soughtHeader.toLowerCase();
      for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
          return headers[headerName];
        }
      }
      return void 0;
    };
    exports.getHeaderValue = getHeaderValue;
    var deleteHeader = (soughtHeader, headers) => {
      soughtHeader = soughtHeader.toLowerCase();
      for (const headerName of Object.keys(headers)) {
        if (soughtHeader === headerName.toLowerCase()) {
          delete headers[headerName];
        }
      }
    };
    exports.deleteHeader = deleteHeader;
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/cloneRequest.js
var require_cloneRequest = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/cloneRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.cloneQuery = exports.cloneRequest = void 0;
    var cloneRequest = ({ headers, query, ...rest }) => ({
      ...rest,
      headers: { ...headers },
      query: query ? (0, exports.cloneQuery)(query) : void 0
    });
    exports.cloneRequest = cloneRequest;
    var cloneQuery = (query) => Object.keys(query).reduce((carry, paramName) => {
      const param = query[paramName];
      return {
        ...carry,
        [paramName]: Array.isArray(param) ? [...param] : param
      };
    }, {});
    exports.cloneQuery = cloneQuery;
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/moveHeadersToQuery.js
var require_moveHeadersToQuery = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/moveHeadersToQuery.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.moveHeadersToQuery = void 0;
    var cloneRequest_1 = require_cloneRequest();
    var moveHeadersToQuery = (request, options = {}) => {
      var _a;
      const { headers, query = {} } = typeof request.clone === "function" ? request.clone() : (0, cloneRequest_1.cloneRequest)(request);
      for (const name of Object.keys(headers)) {
        const lname = name.toLowerCase();
        if (lname.slice(0, 6) === "x-amz-" && !((_a = options.unhoistableHeaders) === null || _a === void 0 ? void 0 : _a.has(lname))) {
          query[name] = headers[name];
          delete headers[name];
        }
      }
      return {
        ...request,
        headers,
        query
      };
    };
    exports.moveHeadersToQuery = moveHeadersToQuery;
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/prepareRequest.js
var require_prepareRequest = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/prepareRequest.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareRequest = void 0;
    var cloneRequest_1 = require_cloneRequest();
    var constants_1 = require_constants();
    var prepareRequest = (request) => {
      request = typeof request.clone === "function" ? request.clone() : (0, cloneRequest_1.cloneRequest)(request);
      for (const headerName of Object.keys(request.headers)) {
        if (constants_1.GENERATED_HEADERS.indexOf(headerName.toLowerCase()) > -1) {
          delete request.headers[headerName];
        }
      }
      return request;
    };
    exports.prepareRequest = prepareRequest;
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/utilDate.js
var require_utilDate = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/utilDate.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.toDate = exports.iso8601 = void 0;
    var iso8601 = (time) => (0, exports.toDate)(time).toISOString().replace(/\.\d{3}Z$/, "Z");
    exports.iso8601 = iso8601;
    var toDate = (time) => {
      if (typeof time === "number") {
        return new Date(time * 1e3);
      }
      if (typeof time === "string") {
        if (Number(time)) {
          return new Date(Number(time) * 1e3);
        }
        return new Date(time);
      }
      return time;
    };
    exports.toDate = toDate;
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/SignatureV4.js
var require_SignatureV4 = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/SignatureV4.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SignatureV4 = void 0;
    var eventstream_codec_1 = require_dist_cjs3();
    var util_hex_encoding_1 = require_dist_cjs2();
    var util_middleware_1 = require_dist_cjs5();
    var util_utf8_1 = require_dist_cjs8();
    var constants_1 = require_constants();
    var credentialDerivation_1 = require_credentialDerivation();
    var getCanonicalHeaders_1 = require_getCanonicalHeaders();
    var getCanonicalQuery_1 = require_getCanonicalQuery();
    var getPayloadHash_1 = require_getPayloadHash();
    var headerUtil_1 = require_headerUtil();
    var moveHeadersToQuery_1 = require_moveHeadersToQuery();
    var prepareRequest_1 = require_prepareRequest();
    var utilDate_1 = require_utilDate();
    var SignatureV42 = class {
      constructor({ applyChecksum, credentials, region, service, sha256, uriEscapePath = true }) {
        this.headerMarshaller = new eventstream_codec_1.HeaderMarshaller(util_utf8_1.toUtf8, util_utf8_1.fromUtf8);
        this.service = service;
        this.sha256 = sha256;
        this.uriEscapePath = uriEscapePath;
        this.applyChecksum = typeof applyChecksum === "boolean" ? applyChecksum : true;
        this.regionProvider = (0, util_middleware_1.normalizeProvider)(region);
        this.credentialProvider = (0, util_middleware_1.normalizeProvider)(credentials);
      }
      async presign(originalRequest, options = {}) {
        const { signingDate = /* @__PURE__ */ new Date(), expiresIn = 3600, unsignableHeaders, unhoistableHeaders, signableHeaders, signingRegion, signingService } = options;
        const credentials = await this.credentialProvider();
        this.validateResolvedCredentials(credentials);
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : await this.regionProvider();
        const { longDate, shortDate } = formatDate(signingDate);
        if (expiresIn > constants_1.MAX_PRESIGNED_TTL) {
          return Promise.reject("Signature version 4 presigned URLs must have an expiration date less than one week in the future");
        }
        const scope = (0, credentialDerivation_1.createScope)(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        const request = (0, moveHeadersToQuery_1.moveHeadersToQuery)((0, prepareRequest_1.prepareRequest)(originalRequest), { unhoistableHeaders });
        if (credentials.sessionToken) {
          request.query[constants_1.TOKEN_QUERY_PARAM] = credentials.sessionToken;
        }
        request.query[constants_1.ALGORITHM_QUERY_PARAM] = constants_1.ALGORITHM_IDENTIFIER;
        request.query[constants_1.CREDENTIAL_QUERY_PARAM] = `${credentials.accessKeyId}/${scope}`;
        request.query[constants_1.AMZ_DATE_QUERY_PARAM] = longDate;
        request.query[constants_1.EXPIRES_QUERY_PARAM] = expiresIn.toString(10);
        const canonicalHeaders = (0, getCanonicalHeaders_1.getCanonicalHeaders)(request, unsignableHeaders, signableHeaders);
        request.query[constants_1.SIGNED_HEADERS_QUERY_PARAM] = getCanonicalHeaderList(canonicalHeaders);
        request.query[constants_1.SIGNATURE_QUERY_PARAM] = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, await (0, getPayloadHash_1.getPayloadHash)(originalRequest, this.sha256)));
        return request;
      }
      async sign(toSign, options) {
        if (typeof toSign === "string") {
          return this.signString(toSign, options);
        } else if (toSign.headers && toSign.payload) {
          return this.signEvent(toSign, options);
        } else if (toSign.message) {
          return this.signMessage(toSign, options);
        } else {
          return this.signRequest(toSign, options);
        }
      }
      async signEvent({ headers, payload }, { signingDate = /* @__PURE__ */ new Date(), priorSignature, signingRegion, signingService }) {
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : await this.regionProvider();
        const { shortDate, longDate } = formatDate(signingDate);
        const scope = (0, credentialDerivation_1.createScope)(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        const hashedPayload = await (0, getPayloadHash_1.getPayloadHash)({ headers: {}, body: payload }, this.sha256);
        const hash = new this.sha256();
        hash.update(headers);
        const hashedHeaders = (0, util_hex_encoding_1.toHex)(await hash.digest());
        const stringToSign = [
          constants_1.EVENT_ALGORITHM_IDENTIFIER,
          longDate,
          scope,
          priorSignature,
          hashedHeaders,
          hashedPayload
        ].join("\n");
        return this.signString(stringToSign, { signingDate, signingRegion: region, signingService });
      }
      async signMessage(signableMessage, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService }) {
        const promise = this.signEvent({
          headers: this.headerMarshaller.format(signableMessage.message.headers),
          payload: signableMessage.message.body
        }, {
          signingDate,
          signingRegion,
          signingService,
          priorSignature: signableMessage.priorSignature
        });
        return promise.then((signature) => {
          return { message: signableMessage.message, signature };
        });
      }
      async signString(stringToSign, { signingDate = /* @__PURE__ */ new Date(), signingRegion, signingService } = {}) {
        const credentials = await this.credentialProvider();
        this.validateResolvedCredentials(credentials);
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : await this.regionProvider();
        const { shortDate } = formatDate(signingDate);
        const hash = new this.sha256(await this.getSigningKey(credentials, region, shortDate, signingService));
        hash.update((0, util_utf8_1.toUint8Array)(stringToSign));
        return (0, util_hex_encoding_1.toHex)(await hash.digest());
      }
      async signRequest(requestToSign, { signingDate = /* @__PURE__ */ new Date(), signableHeaders, unsignableHeaders, signingRegion, signingService } = {}) {
        const credentials = await this.credentialProvider();
        this.validateResolvedCredentials(credentials);
        const region = signingRegion !== null && signingRegion !== void 0 ? signingRegion : await this.regionProvider();
        const request = (0, prepareRequest_1.prepareRequest)(requestToSign);
        const { longDate, shortDate } = formatDate(signingDate);
        const scope = (0, credentialDerivation_1.createScope)(shortDate, region, signingService !== null && signingService !== void 0 ? signingService : this.service);
        request.headers[constants_1.AMZ_DATE_HEADER] = longDate;
        if (credentials.sessionToken) {
          request.headers[constants_1.TOKEN_HEADER] = credentials.sessionToken;
        }
        const payloadHash = await (0, getPayloadHash_1.getPayloadHash)(request, this.sha256);
        if (!(0, headerUtil_1.hasHeader)(constants_1.SHA256_HEADER, request.headers) && this.applyChecksum) {
          request.headers[constants_1.SHA256_HEADER] = payloadHash;
        }
        const canonicalHeaders = (0, getCanonicalHeaders_1.getCanonicalHeaders)(request, unsignableHeaders, signableHeaders);
        const signature = await this.getSignature(longDate, scope, this.getSigningKey(credentials, region, shortDate, signingService), this.createCanonicalRequest(request, canonicalHeaders, payloadHash));
        request.headers[constants_1.AUTH_HEADER] = `${constants_1.ALGORITHM_IDENTIFIER} Credential=${credentials.accessKeyId}/${scope}, SignedHeaders=${getCanonicalHeaderList(canonicalHeaders)}, Signature=${signature}`;
        return request;
      }
      createCanonicalRequest(request, canonicalHeaders, payloadHash) {
        const sortedHeaders = Object.keys(canonicalHeaders).sort();
        return `${request.method}
${this.getCanonicalPath(request)}
${(0, getCanonicalQuery_1.getCanonicalQuery)(request)}
${sortedHeaders.map((name) => `${name}:${canonicalHeaders[name]}`).join("\n")}

${sortedHeaders.join(";")}
${payloadHash}`;
      }
      async createStringToSign(longDate, credentialScope, canonicalRequest) {
        const hash = new this.sha256();
        hash.update((0, util_utf8_1.toUint8Array)(canonicalRequest));
        const hashedRequest = await hash.digest();
        return `${constants_1.ALGORITHM_IDENTIFIER}
${longDate}
${credentialScope}
${(0, util_hex_encoding_1.toHex)(hashedRequest)}`;
      }
      getCanonicalPath({ path }) {
        if (this.uriEscapePath) {
          const normalizedPathSegments = [];
          for (const pathSegment of path.split("/")) {
            if ((pathSegment === null || pathSegment === void 0 ? void 0 : pathSegment.length) === 0)
              continue;
            if (pathSegment === ".")
              continue;
            if (pathSegment === "..") {
              normalizedPathSegments.pop();
            } else {
              normalizedPathSegments.push(pathSegment);
            }
          }
          const normalizedPath = `${(path === null || path === void 0 ? void 0 : path.startsWith("/")) ? "/" : ""}${normalizedPathSegments.join("/")}${normalizedPathSegments.length > 0 && (path === null || path === void 0 ? void 0 : path.endsWith("/")) ? "/" : ""}`;
          const doubleEncoded = encodeURIComponent(normalizedPath);
          return doubleEncoded.replace(/%2F/g, "/");
        }
        return path;
      }
      async getSignature(longDate, credentialScope, keyPromise, canonicalRequest) {
        const stringToSign = await this.createStringToSign(longDate, credentialScope, canonicalRequest);
        const hash = new this.sha256(await keyPromise);
        hash.update((0, util_utf8_1.toUint8Array)(stringToSign));
        return (0, util_hex_encoding_1.toHex)(await hash.digest());
      }
      getSigningKey(credentials, region, shortDate, service) {
        return (0, credentialDerivation_1.getSigningKey)(this.sha256, credentials, shortDate, region, service || this.service);
      }
      validateResolvedCredentials(credentials) {
        if (typeof credentials !== "object" || typeof credentials.accessKeyId !== "string" || typeof credentials.secretAccessKey !== "string") {
          throw new Error("Resolved credential object is not valid");
        }
      }
    };
    exports.SignatureV4 = SignatureV42;
    var formatDate = (now) => {
      const longDate = (0, utilDate_1.iso8601)(now).replace(/[\-:]/g, "");
      return {
        longDate,
        shortDate: longDate.slice(0, 8)
      };
    };
    var getCanonicalHeaderList = (headers) => Object.keys(headers).sort().join(";");
  }
});

// ../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/index.js
var require_dist_cjs10 = __commonJS({
  "../../node_modules/.pnpm/@smithy+signature-v4@2.0.16/node_modules/@smithy/signature-v4/dist-cjs/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.prepareRequest = exports.moveHeadersToQuery = exports.getPayloadHash = exports.getCanonicalQuery = exports.getCanonicalHeaders = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_SignatureV4(), exports);
    var getCanonicalHeaders_1 = require_getCanonicalHeaders();
    Object.defineProperty(exports, "getCanonicalHeaders", { enumerable: true, get: function() {
      return getCanonicalHeaders_1.getCanonicalHeaders;
    } });
    var getCanonicalQuery_1 = require_getCanonicalQuery();
    Object.defineProperty(exports, "getCanonicalQuery", { enumerable: true, get: function() {
      return getCanonicalQuery_1.getCanonicalQuery;
    } });
    var getPayloadHash_1 = require_getPayloadHash();
    Object.defineProperty(exports, "getPayloadHash", { enumerable: true, get: function() {
      return getPayloadHash_1.getPayloadHash;
    } });
    var moveHeadersToQuery_1 = require_moveHeadersToQuery();
    Object.defineProperty(exports, "moveHeadersToQuery", { enumerable: true, get: function() {
      return moveHeadersToQuery_1.moveHeadersToQuery;
    } });
    var prepareRequest_1 = require_prepareRequest();
    Object.defineProperty(exports, "prepareRequest", { enumerable: true, get: function() {
      return prepareRequest_1.prepareRequest;
    } });
    tslib_1.__exportStar(require_credentialDerivation(), exports);
  }
});

// ../../node_modules/.pnpm/@aws-crypto+sha256-js@5.2.0/node_modules/@aws-crypto/sha256-js/build/main/constants.js
var require_constants2 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+sha256-js@5.2.0/node_modules/@aws-crypto/sha256-js/build/main/constants.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MAX_HASHABLE_LENGTH = exports.INIT = exports.KEY = exports.DIGEST_LENGTH = exports.BLOCK_SIZE = void 0;
    exports.BLOCK_SIZE = 64;
    exports.DIGEST_LENGTH = 32;
    exports.KEY = new Uint32Array([
      1116352408,
      1899447441,
      3049323471,
      3921009573,
      961987163,
      1508970993,
      2453635748,
      2870763221,
      3624381080,
      310598401,
      607225278,
      1426881987,
      1925078388,
      2162078206,
      2614888103,
      3248222580,
      3835390401,
      4022224774,
      264347078,
      604807628,
      770255983,
      1249150122,
      1555081692,
      1996064986,
      2554220882,
      2821834349,
      2952996808,
      3210313671,
      3336571891,
      3584528711,
      113926993,
      338241895,
      666307205,
      773529912,
      1294757372,
      1396182291,
      1695183700,
      1986661051,
      2177026350,
      2456956037,
      2730485921,
      2820302411,
      3259730800,
      3345764771,
      3516065817,
      3600352804,
      4094571909,
      275423344,
      430227734,
      506948616,
      659060556,
      883997877,
      958139571,
      1322822218,
      1537002063,
      1747873779,
      1955562222,
      2024104815,
      2227730452,
      2361852424,
      2428436474,
      2756734187,
      3204031479,
      3329325298
    ]);
    exports.INIT = [
      1779033703,
      3144134277,
      1013904242,
      2773480762,
      1359893119,
      2600822924,
      528734635,
      1541459225
    ];
    exports.MAX_HASHABLE_LENGTH = Math.pow(2, 53) - 1;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+sha256-js@5.2.0/node_modules/@aws-crypto/sha256-js/build/main/RawSha256.js
var require_RawSha256 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+sha256-js@5.2.0/node_modules/@aws-crypto/sha256-js/build/main/RawSha256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RawSha256 = void 0;
    var constants_1 = require_constants2();
    var RawSha256 = (
      /** @class */
      function() {
        function RawSha2562() {
          this.state = Int32Array.from(constants_1.INIT);
          this.temp = new Int32Array(64);
          this.buffer = new Uint8Array(64);
          this.bufferLength = 0;
          this.bytesHashed = 0;
          this.finished = false;
        }
        RawSha2562.prototype.update = function(data) {
          if (this.finished) {
            throw new Error("Attempted to update an already finished hash.");
          }
          var position = 0;
          var byteLength = data.byteLength;
          this.bytesHashed += byteLength;
          if (this.bytesHashed * 8 > constants_1.MAX_HASHABLE_LENGTH) {
            throw new Error("Cannot hash more than 2^53 - 1 bits");
          }
          while (byteLength > 0) {
            this.buffer[this.bufferLength++] = data[position++];
            byteLength--;
            if (this.bufferLength === constants_1.BLOCK_SIZE) {
              this.hashBuffer();
              this.bufferLength = 0;
            }
          }
        };
        RawSha2562.prototype.digest = function() {
          if (!this.finished) {
            var bitsHashed = this.bytesHashed * 8;
            var bufferView = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
            var undecoratedLength = this.bufferLength;
            bufferView.setUint8(this.bufferLength++, 128);
            if (undecoratedLength % constants_1.BLOCK_SIZE >= constants_1.BLOCK_SIZE - 8) {
              for (var i = this.bufferLength; i < constants_1.BLOCK_SIZE; i++) {
                bufferView.setUint8(i, 0);
              }
              this.hashBuffer();
              this.bufferLength = 0;
            }
            for (var i = this.bufferLength; i < constants_1.BLOCK_SIZE - 8; i++) {
              bufferView.setUint8(i, 0);
            }
            bufferView.setUint32(constants_1.BLOCK_SIZE - 8, Math.floor(bitsHashed / 4294967296), true);
            bufferView.setUint32(constants_1.BLOCK_SIZE - 4, bitsHashed);
            this.hashBuffer();
            this.finished = true;
          }
          var out = new Uint8Array(constants_1.DIGEST_LENGTH);
          for (var i = 0; i < 8; i++) {
            out[i * 4] = this.state[i] >>> 24 & 255;
            out[i * 4 + 1] = this.state[i] >>> 16 & 255;
            out[i * 4 + 2] = this.state[i] >>> 8 & 255;
            out[i * 4 + 3] = this.state[i] >>> 0 & 255;
          }
          return out;
        };
        RawSha2562.prototype.hashBuffer = function() {
          var _a = this, buffer = _a.buffer, state = _a.state;
          var state0 = state[0], state1 = state[1], state2 = state[2], state3 = state[3], state4 = state[4], state5 = state[5], state6 = state[6], state7 = state[7];
          for (var i = 0; i < constants_1.BLOCK_SIZE; i++) {
            if (i < 16) {
              this.temp[i] = (buffer[i * 4] & 255) << 24 | (buffer[i * 4 + 1] & 255) << 16 | (buffer[i * 4 + 2] & 255) << 8 | buffer[i * 4 + 3] & 255;
            } else {
              var u = this.temp[i - 2];
              var t1_1 = (u >>> 17 | u << 15) ^ (u >>> 19 | u << 13) ^ u >>> 10;
              u = this.temp[i - 15];
              var t2_1 = (u >>> 7 | u << 25) ^ (u >>> 18 | u << 14) ^ u >>> 3;
              this.temp[i] = (t1_1 + this.temp[i - 7] | 0) + (t2_1 + this.temp[i - 16] | 0);
            }
            var t1 = (((state4 >>> 6 | state4 << 26) ^ (state4 >>> 11 | state4 << 21) ^ (state4 >>> 25 | state4 << 7)) + (state4 & state5 ^ ~state4 & state6) | 0) + (state7 + (constants_1.KEY[i] + this.temp[i] | 0) | 0) | 0;
            var t2 = ((state0 >>> 2 | state0 << 30) ^ (state0 >>> 13 | state0 << 19) ^ (state0 >>> 22 | state0 << 10)) + (state0 & state1 ^ state0 & state2 ^ state1 & state2) | 0;
            state7 = state6;
            state6 = state5;
            state5 = state4;
            state4 = state3 + t1 | 0;
            state3 = state2;
            state2 = state1;
            state1 = state0;
            state0 = t1 + t2 | 0;
          }
          state[0] += state0;
          state[1] += state1;
          state[2] += state2;
          state[3] += state3;
          state[4] += state4;
          state[5] += state5;
          state[6] += state6;
          state[7] += state7;
        };
        return RawSha2562;
      }()
    );
    exports.RawSha256 = RawSha256;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/main/convertToBuffer.js
var require_convertToBuffer2 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/main/convertToBuffer.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.convertToBuffer = void 0;
    var util_utf8_1 = require_dist_cjs8();
    var fromUtf8 = typeof Buffer !== "undefined" && Buffer.from ? function(input) {
      return Buffer.from(input, "utf8");
    } : util_utf8_1.fromUtf8;
    function convertToBuffer(data) {
      if (data instanceof Uint8Array)
        return data;
      if (typeof data === "string") {
        return fromUtf8(data);
      }
      if (ArrayBuffer.isView(data)) {
        return new Uint8Array(data.buffer, data.byteOffset, data.byteLength / Uint8Array.BYTES_PER_ELEMENT);
      }
      return new Uint8Array(data);
    }
    exports.convertToBuffer = convertToBuffer;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/main/isEmptyData.js
var require_isEmptyData2 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/main/isEmptyData.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.isEmptyData = void 0;
    function isEmptyData(data) {
      if (typeof data === "string") {
        return data.length === 0;
      }
      return data.byteLength === 0;
    }
    exports.isEmptyData = isEmptyData;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/main/numToUint8.js
var require_numToUint82 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/main/numToUint8.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.numToUint8 = void 0;
    function numToUint8(num) {
      return new Uint8Array([
        (num & 4278190080) >> 24,
        (num & 16711680) >> 16,
        (num & 65280) >> 8,
        num & 255
      ]);
    }
    exports.numToUint8 = numToUint8;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/main/uint32ArrayFrom.js
var require_uint32ArrayFrom2 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/main/uint32ArrayFrom.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uint32ArrayFrom = void 0;
    function uint32ArrayFrom(a_lookUpTable) {
      if (!Uint32Array.from) {
        var return_array = new Uint32Array(a_lookUpTable.length);
        var a_index = 0;
        while (a_index < a_lookUpTable.length) {
          return_array[a_index] = a_lookUpTable[a_index];
          a_index += 1;
        }
        return return_array;
      }
      return Uint32Array.from(a_lookUpTable);
    }
    exports.uint32ArrayFrom = uint32ArrayFrom;
  }
});

// ../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/main/index.js
var require_main = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+util@5.2.0/node_modules/@aws-crypto/util/build/main/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.uint32ArrayFrom = exports.numToUint8 = exports.isEmptyData = exports.convertToBuffer = void 0;
    var convertToBuffer_1 = require_convertToBuffer2();
    Object.defineProperty(exports, "convertToBuffer", { enumerable: true, get: function() {
      return convertToBuffer_1.convertToBuffer;
    } });
    var isEmptyData_1 = require_isEmptyData2();
    Object.defineProperty(exports, "isEmptyData", { enumerable: true, get: function() {
      return isEmptyData_1.isEmptyData;
    } });
    var numToUint8_1 = require_numToUint82();
    Object.defineProperty(exports, "numToUint8", { enumerable: true, get: function() {
      return numToUint8_1.numToUint8;
    } });
    var uint32ArrayFrom_1 = require_uint32ArrayFrom2();
    Object.defineProperty(exports, "uint32ArrayFrom", { enumerable: true, get: function() {
      return uint32ArrayFrom_1.uint32ArrayFrom;
    } });
  }
});

// ../../node_modules/.pnpm/@aws-crypto+sha256-js@5.2.0/node_modules/@aws-crypto/sha256-js/build/main/jsSha256.js
var require_jsSha256 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+sha256-js@5.2.0/node_modules/@aws-crypto/sha256-js/build/main/jsSha256.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Sha256 = void 0;
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    var constants_1 = require_constants2();
    var RawSha256_1 = require_RawSha256();
    var util_1 = require_main();
    var Sha2562 = (
      /** @class */
      function() {
        function Sha2563(secret) {
          this.secret = secret;
          this.hash = new RawSha256_1.RawSha256();
          this.reset();
        }
        Sha2563.prototype.update = function(toHash) {
          if ((0, util_1.isEmptyData)(toHash) || this.error) {
            return;
          }
          try {
            this.hash.update((0, util_1.convertToBuffer)(toHash));
          } catch (e) {
            this.error = e;
          }
        };
        Sha2563.prototype.digestSync = function() {
          if (this.error) {
            throw this.error;
          }
          if (this.outer) {
            if (!this.outer.finished) {
              this.outer.update(this.hash.digest());
            }
            return this.outer.digest();
          }
          return this.hash.digest();
        };
        Sha2563.prototype.digest = function() {
          return tslib_1.__awaiter(this, void 0, void 0, function() {
            return tslib_1.__generator(this, function(_a) {
              return [2, this.digestSync()];
            });
          });
        };
        Sha2563.prototype.reset = function() {
          this.hash = new RawSha256_1.RawSha256();
          if (this.secret) {
            this.outer = new RawSha256_1.RawSha256();
            var inner = bufferFromSecret(this.secret);
            var outer = new Uint8Array(constants_1.BLOCK_SIZE);
            outer.set(inner);
            for (var i = 0; i < constants_1.BLOCK_SIZE; i++) {
              inner[i] ^= 54;
              outer[i] ^= 92;
            }
            this.hash.update(inner);
            this.outer.update(outer);
            for (var i = 0; i < inner.byteLength; i++) {
              inner[i] = 0;
            }
          }
        };
        return Sha2563;
      }()
    );
    exports.Sha256 = Sha2562;
    function bufferFromSecret(secret) {
      var input = (0, util_1.convertToBuffer)(secret);
      if (input.byteLength > constants_1.BLOCK_SIZE) {
        var bufferHash = new RawSha256_1.RawSha256();
        bufferHash.update(input);
        input = bufferHash.digest();
      }
      var buffer = new Uint8Array(constants_1.BLOCK_SIZE);
      buffer.set(input);
      return buffer;
    }
  }
});

// ../../node_modules/.pnpm/@aws-crypto+sha256-js@5.2.0/node_modules/@aws-crypto/sha256-js/build/main/index.js
var require_main2 = __commonJS({
  "../../node_modules/.pnpm/@aws-crypto+sha256-js@5.2.0/node_modules/@aws-crypto/sha256-js/build/main/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var tslib_1 = (init_tslib_es6(), __toCommonJS(tslib_es6_exports));
    tslib_1.__exportStar(require_jsSha256(), exports);
  }
});

// support/signing-function/helpers/getSigV4.ts
var import_signature_v4 = __toESM(require_dist_cjs10(), 1);
var import_sha256_js = __toESM(require_main2(), 1);
var getSigV4 = (region) => {
  if (process.env.AWS_ACCESS_KEY_ID === void 0)
    throw new Error("AWS_ACCESS_KEY_ID missing");
  if (process.env.AWS_SECRET_ACCESS_KEY === void 0)
    throw new Error("AWS_SECRET_ACCESS_KEY missing");
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;
  return new import_signature_v4.SignatureV4({
    service: "lambda",
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
      sessionToken
    },
    sha256: import_sha256_js.Sha256,
    applyChecksum: false
  });
};

// support/signing-function/helpers/headerBagToCloudFrontHeaders.ts
var headerBagToCloudFrontHeaders = (headerBag) => {
  const cloudFrontHeaders = {};
  for (const [header, value] of Object.entries(headerBag)) {
    cloudFrontHeaders[header] = [{ key: header, value }];
  }
  return cloudFrontHeaders;
};

// support/signing-function/helpers/cloudFrontHeadersToHeaderBag.ts
var cloudFrontHeadersToHeaderBag = (cloudFrontHeaders) => {
  const headerBag = {};
  for (const [lowerCaseHeader, values] of Object.entries(cloudFrontHeaders)) {
    headerBag[lowerCaseHeader] = values.map(({ value }) => value).join(",");
  }
  return headerBag;
};

// support/signing-function/helpers/queryStringToQueryParameterBag.ts
var queryStringToQueryParameterBag = (queryString) => {
  const query = {};
  const kvPairs = queryString.split("&").filter((v) => v);
  for (const kvPair of kvPairs) {
    const split = kvPair.split("=");
    const key = split[0];
    const value = split[1];
    if (query[key] === void 0 || query[key] === null) {
      query[key] = value ? decodeURIComponent(value) : null;
      continue;
    }
    if (value === void 0 || value === "") {
      continue;
    }
    if (Array.isArray(query[key])) {
      query[key].push(decodeURIComponent(value));
      continue;
    }
    query[key] = [query[key], decodeURIComponent(value)];
  }
  return query;
};

// support/signing-function/helpers/getRegionFromCustomDomainName.ts
var getRegionFromCustomDomainName = (domainName) => {
  const functionUrlRegExp = /^[a-z0-9]+\.lambda-url\.([a-z0-9-]+)\.on\.aws$/;
  const m = domainName.match(functionUrlRegExp);
  if (m !== null) {
    return m[1];
  }
};

// support/signing-function/index.ts
var handler = async (event) => {
  const request = event.Records[0].cf.request;
  if (request.origin === void 0) {
    throw new Error("origin must be defined");
  }
  if ("s3" in request.origin) {
    return request;
  }
  const domainName = request.origin.custom.domainName;
  const region = getRegionFromCustomDomainName(domainName);
  if (region === void 0) {
    return request;
  }
  const query = queryStringToQueryParameterBag(request.querystring);
  const sigv4 = getSigV4(region);
  const signed = await sigv4.sign(
    {
      method: request.method,
      hostname: domainName,
      headers: cloudFrontHeadersToHeaderBag(request.headers),
      path: request.uri,
      query,
      protocol: "https",
      body: request.body?.data ? Buffer.from(request.body.data, "base64") : void 0
    },
    { unsignableHeaders: /* @__PURE__ */ new Set(["x-forwarded-for"]) }
  );
  request.headers = headerBagToCloudFrontHeaders(signed.headers);
  return request;
};
export {
  handler
};
/*! Bundled license information:

tslib/tslib.es6.js:
  (*! *****************************************************************************
  Copyright (c) Microsoft Corporation.
  
  Permission to use, copy, modify, and/or distribute this software for any
  purpose with or without fee is hereby granted.
  
  THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
  REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
  AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
  INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
  LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
  OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
  PERFORMANCE OF THIS SOFTWARE.
  ***************************************************************************** *)
*/
