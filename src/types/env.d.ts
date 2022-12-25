// TODO: add more env var here
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      DB_SECRET_NAME?: string;
      NODE_ENV?: string;
    }
  }
}
