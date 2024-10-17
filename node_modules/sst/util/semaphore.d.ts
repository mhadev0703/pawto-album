export declare class Semaphore {
    private queue;
    private locked;
    private maxLocks;
    constructor(maxLocks?: number);
    lock(): Promise<() => void>;
}
