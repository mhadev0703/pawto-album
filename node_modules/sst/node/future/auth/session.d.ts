import { SignerOptions } from "fast-jwt";
export interface SessionTypes {
    public: {};
}
export type SessionValue = {
    [type in keyof SessionTypes]: {
        type: type;
        properties: SessionTypes[type];
    };
}[keyof SessionTypes];
export declare function useSession<T = SessionValue>(): T;
/**
 * Creates a new session token with provided information
 *
 * @example
 * ```js
 * Session.create({
 *   type: "user",
 *   properties: {
 *     userID: "123"
 *   }
 * })
 * ```
 */
declare function create<T extends keyof SessionTypes>(input: {
    type: T;
    properties: SessionTypes[T];
    options?: Partial<SignerOptions>;
}): string;
/**
 * Verifies a session token and returns the session data
 *
 * @example
 * ```js
 * Session.verify()
 * ```
 */
declare function verify<T = SessionValue>(token: string): T | {
    type: string;
    properties: {};
};
export declare const Session: {
    create: typeof create;
    verify: typeof verify;
};
export type SessionBuilder = ReturnType<typeof createSessionBuilder>;
export declare function createSessionBuilder<SessionTypes extends Record<string, any> = {}>(): {
    create<T extends ({ [type in keyof SessionTypes]: {
        type: type;
        properties: SessionTypes[type];
    }; }[keyof SessionTypes] | {
        type: "public";
        properties: {};
    })["type"]>(type: T, properties: SessionTypes[T], options?: Partial<SignerOptions>): string;
    verify(token: string): { [type in keyof SessionTypes]: {
        type: type;
        properties: SessionTypes[type];
    }; }[keyof SessionTypes] | {
        type: "public";
        properties: {};
    };
    use(): { [type in keyof SessionTypes]: {
        type: type;
        properties: SessionTypes[type];
    }; }[keyof SessionTypes] | {
        type: "public";
        properties: {};
    };
    $type: SessionTypes;
    $typeValues: { [type in keyof SessionTypes]: {
        type: type;
        properties: SessionTypes[type];
    }; }[keyof SessionTypes] | {
        type: "public";
        properties: {};
    };
};
export {};
