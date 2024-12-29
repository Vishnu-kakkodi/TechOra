import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 5000, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
});



// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   resolve: {
//     dedupe: ['react', 'react-dom']  // Add this to prevent duplicate React loading
//   },
//   optimizeDeps: {
//     include: ['react', 'react-dom']  // Pre-bundle React dependencies
//   },
//   build: {
//     chunkSizeWarningLimit: 5000,
//     rollupOptions: {
//       output: {
//         manualChunks(id) {
//           if (id.includes('node_modules')) {
//             return id.toString().split('node_modules/')[1].split('/')[0].toString();
//           }
//         },
//       },
//     },
//   },
//   esbuild: {
//     jsxInject: `import React from 'react'`  // Add this to ensure React is available
//   }
// })
