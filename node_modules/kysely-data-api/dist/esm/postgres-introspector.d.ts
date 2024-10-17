import { DatabaseIntrospector, DatabaseMetadata, DatabaseMetadataOptions, SchemaMetadata, TableMetadata } from "kysely";
import { Kysely } from "kysely";
export declare class PostgresIntrospector implements DatabaseIntrospector {
    #private;
    constructor(db: Kysely<any>);
    getSchemas(): Promise<SchemaMetadata[]>;
    getTables(options?: DatabaseMetadataOptions): Promise<TableMetadata[]>;
    getMetadata(options?: DatabaseMetadataOptions): Promise<DatabaseMetadata>;
}
