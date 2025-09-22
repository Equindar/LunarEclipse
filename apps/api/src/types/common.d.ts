declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: "development" | "production" | "test";
    }
}

export type apiVersion = string['1.0' | '2.0'];