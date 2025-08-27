import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://my-node-env.eba-f7fims4p.eu-north-1.elasticbeanstalk.com',
    },
  },
})
