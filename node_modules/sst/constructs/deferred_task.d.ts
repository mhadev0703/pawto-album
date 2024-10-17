type Task = () => Promise<void>;
export declare const useDeferredTasks: () => {
    add(task: Task): void;
    run(): Promise<unknown>;
};
export {};
