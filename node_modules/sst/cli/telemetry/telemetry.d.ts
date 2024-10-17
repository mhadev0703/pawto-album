type CliFailedEvent = {
    rawCommand: string;
    duration: number;
    errorName: string;
    errorMessage: string;
};
type CliSucceededEvent = {
    rawCommand: string;
    duration: number;
};
export declare function enable(): void;
export declare function disable(): void;
export declare function isEnabled(): boolean;
export declare function trackCli(command: string): Promise<any>;
export declare function trackCliFailed(event: CliFailedEvent): Promise<any>;
export declare function trackCliSucceeded(event: CliSucceededEvent): Promise<any>;
export declare function trackCliDevError(event: CliFailedEvent): Promise<any>;
export declare function trackCliDevRunning(event: CliSucceededEvent): Promise<any>;
export {};
