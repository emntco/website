import { withPayload } from '@payloadcms/next/withPayload';
import { withSentryConfig } from '@sentry/nextjs';
import redirects from './redirects.js';

const serverUrl =
  process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000';

const remotePatterns = serverUrl
  ? (() => {
    const { hostname, protocol } = new URL(serverUrl);
    return [
      {
        hostname,
        protocol: protocol.replace(':', ''),
      },
    ];
  })()
  : [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns,
  },
  reactStrictMode: true,
  redirects,
};

const configWithPayload = withPayload(nextConfig);

export default withSentryConfig(configWithPayload, {
  org: 'emnt',
  project: 'emnt',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  reactComponentAnnotation: {
    enabled: true,
  },
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
