/** @type {import('next').NextConfig} */
const path = require('path');
const createNextIntlPlugin = require('next-intl/plugin');

// Point to your request config file
const withNextIntl = createNextIntlPlugin('./app/i18n/request.ts');

const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@shared'] = path.resolve(__dirname, 'shared');
    config.resolve.alias['@styles'] = path.resolve(__dirname, 'styles');
    config.resolve.alias['@public'] = path.resolve(__dirname, 'public');
    config.resolve.alias['@components'] = path.resolve(__dirname, 'components');
    config.resolve.alias['@utils'] = path.resolve(__dirname, 'utils');
    config.resolve.alias['@service'] = path.resolve(__dirname, 'services');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["localhost"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    // additionalData: `@import "_variables.scss"; @import "_mixins.scss";`,
      additionalData: `@use "variables" as *; @use "mixins" as *;`,

  },
};

module.exports = withNextIntl(nextConfig);
