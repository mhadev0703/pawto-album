import { MysqlQueryCompiler, PostgresQueryCompiler } from "kysely";
export declare class PostgresDataApiQueryCompiler extends PostgresQueryCompiler {
    protected appendValue(value: unknown): void;
    protected getCurrentParameterPlaceholder(): string;
}
export declare class MysqlDataApiQueryCompiler extends MysqlQueryCompiler {
    protected appendValue(value: unknown): void;
    protected getCurrentParameterPlaceholder(): string;
}
