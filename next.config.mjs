import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint:     { ignoreDuringBuilds: true },
  env: {
    // Absolute path to public/data — survives any CWD mismatch in the preview tool
    DATA_DIR: join(__dirname, 'public', 'data'),
  },
}
export default nextConfig
