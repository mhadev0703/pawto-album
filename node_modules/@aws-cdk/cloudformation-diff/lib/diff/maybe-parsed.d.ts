/**
 * A value that may or may not be parseable
 */
export type MaybeParsed<A> = Parsed<A> | UnparseableCfn;
export interface Parsed<A> {
    readonly type: 'parsed';
    readonly value: A;
}
export interface UnparseableCfn {
    readonly type: 'unparseable';
    readonly repr: string;
}
export declare function mkParsed<A>(value: A): Parsed<A>;
export declare function mkUnparseable(value: any): UnparseableCfn;
