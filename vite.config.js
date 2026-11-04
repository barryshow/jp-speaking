import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 正式站点挂在自定义域名（https://jlpt.barryshow.net/）根路径下，所以 base = '/'。
// 如果哪天又要用 GitHub Pages 的项目子路径（https://<user>.github.io/<repo>/），
// 用环境变量覆盖即可：BASE_PATH=/jlpt-speaking/ npm run build
export default defineConfig(({ command }) => ({
  base: command === 'build' ? (process.env.BASE_PATH || '/') : '/',
  plugins: [react()],
}))
