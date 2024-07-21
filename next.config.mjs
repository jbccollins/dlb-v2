/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['jotai-devtools'],
    experimental: {
        swcPlugins: [
          ['@swc-jotai/debug-label', { atomNames: ['customAtom'] }],
          ['@swc-jotai/react-refresh', { atomNames: ['customAtom'] }],
        ],
    },
};

export default nextConfig;
