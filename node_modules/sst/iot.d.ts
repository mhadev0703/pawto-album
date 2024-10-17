export declare const useIOTEndpoint: () => Promise<string>;
import { Events } from "./bus.js";
export declare const useIOT: () => Promise<{
    prefix: string;
    publish<Type extends keyof Events>(topic: string, type: Type, properties: Events[Type]): Promise<void>;
}>;
export declare const isSupported: () => boolean;
