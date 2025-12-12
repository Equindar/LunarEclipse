export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  database: string;
}

export interface LoggingConfig {
  level?: string | null;
  dir?: string | null;
}

export interface AppConfig {
  id: string;
  token: string;
}

type Server = {
  id: string;
  name: string;
}

export interface IConfigurationSchema {
  app: AppConfig;
  servers: Server[];
  database: DatabaseConfig;
  logging: LoggingConfig;

  // Platz für Erweiterungen
  [key: string]: unknown;
}
