import { TanStackRouterVite } from '@tanstack/router-vite-plugin'
import react from '@vitejs/plugin-react-swc'
import autoprefixer from 'autoprefixer'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite({ routesDirectory: 'src/app/routes' })],
	resolve: {
		alias: {
			$: '/src',
		},
	},
	css: {
		postcss: {
			plugins: [autoprefixer],
		},
	},
	server: {
        host: true,
        port: 8080
    }
})
