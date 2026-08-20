import dotenv from 'dotenv';

type Server = {
  id: string;
  name: string;
};

// --- Init
dotenv.config();

const { DISCORD_CLIENT_ID, DISCORD_TOKEN, DISCORD_SERVER_ID } = process.env;
const { LOG_LEVEL, LOG_DIRECTORY } = process.env;
const { OPENAI_API_KEY, OPENAI_MODEL } = process.env;

const configuration = {
  app: {
    name: DISCORD_CLIENT_ID || '',
    secret: DISCORD_TOKEN || '',
  },
  servers: [DISCORD_SERVER_ID],
  logging: {
    level: LOG_LEVEL,
    directory: LOG_DIRECTORY,
  },
  integrations: {
    openai: {
      key: OPENAI_API_KEY,
      model: OPENAI_MODEL || '',
    },
  },
};

export default configuration;
