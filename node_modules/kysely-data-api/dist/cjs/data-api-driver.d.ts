import { RDSData } from "@aws-sdk/client-rds-data";
import { CompiledQuery, DatabaseConnection, Driver, QueryResult } from "kysely";
export type DataApiDriverConfig = {
    client: RDSData;
    secretArn: string;
    resourceArn: string;
    database: string;
};
export declare class DataApiDriver implements Driver {
    #private;
    constructor(config: DataApiDriverConfig);
    init(): Promise<void>;
    acquireConnection(): Promise<DatabaseConnection>;
    beginTransaction(conn: DataApiConnection): Promise<void>;
    commitTransaction(conn: DataApiConnection): Promise<void>;
    rollbackTransaction(conn: DataApiConnection): Promise<void>;
    releaseConnection(_connection: DatabaseConnection): Promise<void>;
    destroy(): Promise<void>;
}
declare class DataApiConnection implements DatabaseConnection {
    #private;
    constructor(config: DataApiDriverConfig);
    beginTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
    executeQuery<O>(compiledQuery: CompiledQuery): Promise<QueryResult<O>>;
    streamQuery<O>(_compiledQuery: CompiledQuery, _chunkSize: number): AsyncIterableIterator<QueryResult<O>>;
}
export {};
