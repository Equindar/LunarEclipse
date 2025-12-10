import dotenv from 'dotenv';

type Server = {
  id: string;
  name: string;
}

// --- Init
dotenv.config();

const { DISCORD_CLIENT_ID, DISCORD_TOKEN } = process.env;
const { LOG_LEVEL, LOG_DIRECTORY } = process.env;
const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
  throw new Error('Missing enviroment variables');
}

const configuration = {
  app: {
    name: DISCORD_CLIENT_ID || '',
    secret: DISCORD_TOKEN || '',
  },
  servers: [],
  database: {
    host: DATABASE_HOST,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
  },
  logging: {
    level: LOG_LEVEL,
    dir: LOG_DIRECTORY,
  },
};

export default configuration;
