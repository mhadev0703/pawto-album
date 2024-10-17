import { App } from "./App.js";
export declare function provideApp(app: App): void;
export declare const createAppContext: <C>(cb: () => C) => () => C;
