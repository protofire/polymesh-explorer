export const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'ipfs.io',
    port: '',
    pathname: '/ipfs/**',
  },
  {
    protocol: 'https',
    hostname: 'api.pudgypenguins.io',
    port: '',
    pathname: '/lil/image/**',
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
    modularizeImports: {
        "@mui/material": {
          transform: "@mui/material/{{member}}",
        },
        "@mui/icons-material": {
          transform: "@mui/icons-material/{{member}}",
        },
    },
    images: {
      remotePatterns,
    },
};

export default nextConfig;
