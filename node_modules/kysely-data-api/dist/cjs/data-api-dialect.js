"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataApiDialect = void 0;
const kysely_1 = require("kysely");
const data_api_driver_js_1 = require("./data-api-driver.js");
const data_api_query_compiler_js_1 = require("./data-api-query-compiler.js");
const postgres_introspector_js_1 = require("./postgres-introspector.js");
class DataApiDialect {
    #config;
    constructor(config) {
        this.#config = config;
    }
    createAdapter() {
        if (this.#config.mode === "postgres")
            return new kysely_1.PostgresAdapter();
        if (this.#config.mode === "mysql")
            return new kysely_1.MysqlAdapter();
        throw new Error("Unknown mode " + this.#config.mode);
    }
    createDriver() {
        return new data_api_driver_js_1.DataApiDriver(this.#config.driver);
    }
    createQueryCompiler() {
        if (this.#config.mode === "postgres")
            return new data_api_query_compiler_js_1.PostgresDataApiQueryCompiler();
        if (this.#config.mode === "mysql")
            return new data_api_query_compiler_js_1.MysqlDataApiQueryCompiler();
        throw new Error("Unknown mode " + this.#config.mode);
    }
    createIntrospector(db) {
        if (this.#config.mode === "postgres")
            return new postgres_introspector_js_1.PostgresIntrospector(db);
        if (this.#config.mode === "mysql")
            return new kysely_1.MysqlIntrospector(db);
        throw new Error("Unknown mode " + this.#config.mode);
    }
}
exports.DataApiDialect = DataApiDialect;
