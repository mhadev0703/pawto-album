"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mangleLikeCloudFormation = exports.deepEqual = void 0;
__exportStar(require("./diff-template"), exports);
__exportStar(require("./format"), exports);
__exportStar(require("./format-table"), exports);
var util_1 = require("./diff/util");
Object.defineProperty(exports, "deepEqual", { enumerable: true, get: function () { return util_1.deepEqual; } });
Object.defineProperty(exports, "mangleLikeCloudFormation", { enumerable: true, get: function () { return util_1.mangleLikeCloudFormation; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLGtEQUFnQztBQUNoQywyQ0FBeUI7QUFDekIsaURBQStCO0FBQy9CLG9DQUFrRTtBQUF6RCxpR0FBQSxTQUFTLE9BQUE7QUFBRSxnSEFBQSx3QkFBd0IsT0FBQSIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCAqIGZyb20gJy4vZGlmZi10ZW1wbGF0ZSc7XG5leHBvcnQgKiBmcm9tICcuL2Zvcm1hdCc7XG5leHBvcnQgKiBmcm9tICcuL2Zvcm1hdC10YWJsZSc7XG5leHBvcnQgeyBkZWVwRXF1YWwsIG1hbmdsZUxpa2VDbG91ZEZvcm1hdGlvbiB9IGZyb20gJy4vZGlmZi91dGlsJztcbiJdfQ==