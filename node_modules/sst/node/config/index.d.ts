export interface ParameterResources {
}
export interface SecretResources {
}
export interface ConfigTypes {
}
export type ParameterTypes = {
    [T in keyof ParameterResources]: string;
};
export type SecretTypes = {
    [T in keyof SecretResources]: string;
};
export declare const Config: ConfigTypes & ParameterTypes & SecretTypes;
