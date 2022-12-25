import { execFile } from 'child_process';
import path from 'path';
import { getSecret } from './getSecret';

(async () => {
  if (process.env.NODE_ENV !== 'development') {
    if (!process.env.DB_SECRET_NAME) {
      throw new Error('DB_SECRET_NAME not specified');
    }
    // load environment variables/secrets
    const secrets = await getSecret(process.env.DB_SECRET_NAME);

    // db migrate, you should use db:migrate-dev for local development
    try {
      const exitCode = await new Promise((resolve) => {
        execFile(
          path.resolve('./node_modules/prisma/build/index.js'),
          ['migrate', 'deploy'],
          {
            env: {
              DB_URL: secrets.DB_URL,
            },
          },
          (error, stdout) => {
            console.log(stdout);
            if (error !== null) {
              console.error(`prisma migrate deploy exited with error ${error.message}`);
              resolve(error.code ?? 1);
            } else {
              resolve(0);
            }
          },
        );
      });

      if (exitCode !== 0) throw Error(`command migrate deploy failed with exit code ${exitCode}`);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
})();
