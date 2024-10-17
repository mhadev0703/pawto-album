"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnType = void 0;
const generic_expression_node_1 = require("./generic-expression-node");
class ColumnType extends generic_expression_node_1.GenericExpressionNode {
    constructor(selectType, insertType = selectType, updateType = insertType) {
        super('ColumnType', [selectType, insertType, updateType]);
    }
}
exports.ColumnType = ColumnType;
//# sourceMappingURL=column-type-node.js.map