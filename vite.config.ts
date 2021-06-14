import { defineConfig } from 'vite'
import {resolve} from "path";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    port: 4000,
    cors: true,
    // 设置代理
    proxy: {
      
    }
  }
})
