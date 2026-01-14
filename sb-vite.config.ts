import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Storybook 전용 Vite 설정 (React Router 플러그인 제외)
export default defineConfig({
	plugins: [tailwindcss(), tsconfigPaths()],
	optimizeDeps: {
		exclude: ['pdfjs-dist'],
	},
	worker: {
		format: 'es',
	},
});
