/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 빌드 시 ESLint 오류를 무시 (개발 중에만 경고 표시)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // 빌드 시 TypeScript 오류를 무시 (개발 중에만 경고 표시)  
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 