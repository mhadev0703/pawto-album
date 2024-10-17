"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseMetadata = void 0;
const table_metadata_1 = require("./table-metadata");
class DatabaseMetadata {
    constructor(tables, enums) {
        this.enums = enums;
        this.tables = tables.map((table) => new table_metadata_1.TableMetadata(table));
    }
}
exports.DatabaseMetadata = DatabaseMetadata;
//# sourceMappingURL=database-metadata.js.map