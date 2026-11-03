import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 项目站点的地址形如 https://<user>.github.io/<repo>/
// 因此生产构建需要 base = '/<repo>/'。本地 dev 用 '/'。
// 换仓库名时用环境变量覆盖：BASE_PATH=/new-repo/ npm run build
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.BASE_PATH || '/jlpt-speaking/') : '/',
  plugins: [react()],
}))
