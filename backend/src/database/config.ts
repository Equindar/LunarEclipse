import { configDotenv } from 'dotenv';
configDotenv({ path: `.env.${process.env.NODE_ENV}` });

const configDatabase = {
  url: process.env.DB_URL as string,
  name: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_USER_PWD,
};

export default configDatabase;
