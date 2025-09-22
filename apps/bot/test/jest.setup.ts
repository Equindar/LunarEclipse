// tests/jest.setup.ts
import dotenv from "dotenv";

// .env laden, damit process.env.* in Tests verfügbar ist
dotenv.config({ path: [".env.test", ".env.test.local"] });