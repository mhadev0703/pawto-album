import { MysqlAdapter, MysqlIntrospector, PostgresAdapter, } from "kysely";
import { DataApiDriver } from "./data-api-driver.js";
import { PostgresDataApiQueryCompiler, MysqlDataApiQueryCompiler, } from "./data-api-query-compiler.js";
import { PostgresIntrospector } from "./postgres-introspector.js";
export class DataApiDialect {
    #config;
    constructor(config) {
        this.#config = config;
    }
    createAdapter() {
        if (this.#config.mode === "postgres")
            return new PostgresAdapter();
        if (this.#config.mode === "mysql")
            return new MysqlAdapter();
        throw new Error("Unknown mode " + this.#config.mode);
    }
    createDriver() {
        return new DataApiDriver(this.#config.driver);
    }
    createQueryCompiler() {
        if (this.#config.mode === "postgres")
            return new PostgresDataApiQueryCompiler();
        if (this.#config.mode === "mysql")
            return new MysqlDataApiQueryCompiler();
        throw new Error("Unknown mode " + this.#config.mode);
    }
    createIntrospector(db) {
        if (this.#config.mode === "postgres")
            return new PostgresIntrospector(db);
        if (this.#config.mode === "mysql")
            return new MysqlIntrospector(db);
        throw new Error("Unknown mode " + this.#config.mode);
    }
}
