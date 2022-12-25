/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

export const permissionCheck = async (operation: string, user: string): Promise<boolean> => {
  // TODO: implement here as long as permission definition is finalized.
  if (process.env.NODE_ENV === 'development') {
    console.log(operation, user);
  }
  return true;
};

const auth = async (resolve: any, root: any, args: any, context: any, info: any) => {
  const {
    request: { header },
  } = context;
  let isPermitted = false;
  const operation = `${info.path.typename} ${info.path.key}`;
  isPermitted = await permissionCheck(operation, header['x-user']);
  if (!isPermitted) {
    throw new Error('Permission denied');
  }
  const result = await resolve(root, args, context, info);
  return result;
};

export default auth;
