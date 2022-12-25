// import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';

const cachedSecrets: Record<string, Record<string, string>> = {};

export const getSecret = async <T extends string = string>(secretName: string): Promise<Record<T, string>> => {
  if (process.env.NODE_ENV === 'development') {
    return process.env as Record<T, string>;
  }

  // TODO: you may choose to get env from aws secrete manager
  // if (cachedSecrets[secretName]) {
  //   return cachedSecrets[secretName];
  // }

  // const client = new SecretsManagerClient({
  //   region: process.env.AWS_REGION,
  // });

  // const command = new GetSecretValueCommand({ SecretId: secretName });
  // const response = await client.send(command);
  // cachedSecrets[secretName] = JSON.parse(response.SecretString ?? '{}');

  return cachedSecrets[secretName];
};
