"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumCollection = void 0;
class EnumCollection {
    constructor(enums = {}) {
        this.enums = {};
        this.enums = enums;
    }
    add(key, value) {
        var _a;
        ((_a = this.enums)[key] ?? (_a[key] = [])).push(value);
    }
    get(key) {
        return this.enums[key]?.sort((a, b) => a.localeCompare(b)) ?? null;
    }
    has(key) {
        return !!this.enums[key];
    }
    set(key, values) {
        this.enums[key] = values;
    }
}
exports.EnumCollection = EnumCollection;
//# sourceMappingURL=enum-collection.js.map