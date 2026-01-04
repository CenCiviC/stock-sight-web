import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
	stories: [
		'../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
		'../app/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
	],
	addons: [],
	framework: {
		name: '@storybook/react-vite',
		options: {
			builder: {
				// Storybook 전용 Vite 설정 파일 사용 (React Router 플러그인 제외)
				viteConfigPath: 'sb-vite.config.ts',
			},
		},
	},
};

export default config;
