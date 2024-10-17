import { Driver, MysqlAdapter, PostgresAdapter, Kysely, QueryCompiler, Dialect, DatabaseIntrospector } from "kysely";
import { DataApiDriverConfig } from "./data-api-driver.js";
type DataApiDialectConfig = {
    mode: "postgres" | "mysql";
    driver: DataApiDriverConfig;
};
export declare class DataApiDialect implements Dialect {
    #private;
    constructor(config: DataApiDialectConfig);
    createAdapter(): PostgresAdapter | MysqlAdapter;
    createDriver(): Driver;
    createQueryCompiler(): QueryCompiler;
    createIntrospector(db: Kysely<unknown>): DatabaseIntrospector;
}
export {};
