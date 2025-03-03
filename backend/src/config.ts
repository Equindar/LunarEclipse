import { configDotenv } from 'dotenv';
configDotenv({ path: `.env.${process.env.NODE_ENV}` });

// Mapper for environment variables
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT || 3001;
export const timezone = process.env.TZ;

export const corsUrl = process.env.CORS_URL;

export const logDirectory = process.env.LOG_DIR;