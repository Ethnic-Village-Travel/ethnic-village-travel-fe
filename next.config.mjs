import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    dirs: ['src'],
  },
};

const withNextIntl = createNextIntlPlugin('./src/libs/i18n.ts');
export default withNextIntl(nextConfig);
