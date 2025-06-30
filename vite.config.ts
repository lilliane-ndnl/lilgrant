import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {}
  },
  build: {
    cssMinify: true,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/[name].[hash].css'
          }
          return 'assets/[name].[hash][extname]'
        },
      },
    },
  },
  css: {
    devSourcemap: true,
    modules: {
      scopeBehaviour: 'local',
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]__[hash:base64:5]'
    }
  }
})
