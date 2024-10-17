export interface Events {
}
export type EventTypes = keyof Events;
export type EventPayload<Type extends EventTypes = EventTypes> = {
    type: Type;
    sourceID: string;
    properties: Events[Type];
};
type Subscription = {
    type: EventTypes;
    cb: (payload: any) => void;
};
export declare const useBus: () => {
    sourceID: string;
    publish<Type extends keyof Events>(type: Type, properties: Events[Type]): void;
    unsubscribe(sub: Subscription): void;
    subscribe<Type_1 extends keyof Events>(type: Type_1, cb: (payload: EventPayload<Type_1>) => void): Subscription;
    forward<T extends (keyof Events)[]>(..._types: T): <Type_2 extends T[number]>(type: Type_2, cb: (payload: EventPayload<Type_2>) => void) => Subscription;
};
export {};
