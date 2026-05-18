export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path) =>
  path.startsWith('/') ? `${basePath}${path}` : path;
