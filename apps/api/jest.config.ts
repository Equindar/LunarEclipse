import type { Config } from "jest";

const config: Config = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    testPathIgnorePatterns: [
        "/node_modules/"
    ],

    // Tests liegen im "tests" Ordner
    roots: ["<rootDir>/test"],

    // Dateiendungen die Jest versteht
    moduleFileExtensions: ["ts", "js", "json"],

    // Regex für Testdateien
    testRegex: ".*\\.test\\.ts$",

    // TypeScript Pfade auflösen
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1",
    },

    // Setup-Datei laden
    setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],

    // Coverage (optional)
    collectCoverage: true,
    coverageReporters: ["json", "html", "text"],
    coverageDirectory: 'coverage',
    collectCoverageFrom: ["src/**/*.{ts,js}"],
    // coverageThreshold: {
    //     global: {
    //         branches: 100,
    //         functions: 100,
    //         lines: 100,
    //         statements: 100
    //     }
    // }
};

export default config;
