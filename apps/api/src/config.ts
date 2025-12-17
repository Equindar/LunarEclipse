import dotenv from 'dotenv';

// --- Init
dotenv.config();

const { API_NAME, APP_SECRET } = process.env;
const { AUTH_ACCESS_TOKEN_SECRET, AUTH_REFRESH_TOKEN_SECRET } = process.env;
const { LOG_LEVEL, LOG_DIRECTORY } = process.env;
const { DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME } = process.env;

if (!DATABASE_HOST || !DATABASE_USER || !DATABASE_PASSWORD || !DATABASE_NAME) {
  throw new Error('Missing enviroment variables');
}

const configuration = {
  app: {
    name: API_NAME || '',
    secret: APP_SECRET || ''
  },
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
  auth: {
    accessTokenSecret: AUTH_ACCESS_TOKEN_SECRET || '',
    refreshTokenSecret: AUTH_REFRESH_TOKEN_SECRET || '',

  }
};

export default configuration;
