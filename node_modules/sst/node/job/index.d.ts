export interface JobTypes {
}
export type JobRunProps<T extends keyof JobTypes> = {
    payload?: JobTypes[T];
};
export type JobType = {
    [T in keyof JobTypes]: ReturnType<typeof JobControl<T>>;
};
export declare const Job: JobType;
declare function JobControl<Name extends keyof JobTypes>(name: Name, vars: Record<string, string>): {
    run(props: JobRunProps<Name>): Promise<{
        jobId: string;
    }>;
    cancel(jobId: string): Promise<void>;
};
/**
 * Create a new job handler.
 *
 * @example
 * ```ts
 * declare module "sst/node/job" {
 *   export interface JobTypes {
 *     MyJob: {
 *       title: string;
 *     };
 *   }
 * }
 *
 * export const handler = JobHandler("MyJob", async (payload) => {
 *   console.log(payload.title);
 * })
 * ```
 */
export declare function JobHandler<C extends keyof JobTypes>(name: C, cb: (payload: JobTypes[C]) => void): (event: any) => void;
export {};
