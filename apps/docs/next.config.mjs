import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const uiSrc = path.resolve(__dirname, '../../packages/ui/src');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  transpilePackages: ['@blind-dsai/ui'],
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: { unoptimized: true },
  // Workspace-only: resolve @blind-dsai/ui to its source tree so docs gets
  // src-level HMR. External npm consumers resolve to dist via the package's
  // exports field — see packages/ui/package.json.
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@blind-dsai/ui/icons': path.join(uiSrc, 'icons/index.js'),
      '@blind-dsai/ui/styles.css': path.join(uiSrc, 'styles.css'),
      '@blind-dsai/ui': path.join(uiSrc, 'index.js'),
    };
    return config;
  },
};

export default nextConfig;
