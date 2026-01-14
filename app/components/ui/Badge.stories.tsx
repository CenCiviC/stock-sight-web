import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
	title: 'UI/Badge',
	component: Badge,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'positive', 'negative', 'warning', 'info'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md'],
		},
	},
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: 'Badge',
		variant: 'default',
	},
};

export const Positive: Story = {
	args: {
		children: 'Success',
		variant: 'positive',
	},
};

export const Negative: Story = {
	args: {
		children: 'Error',
		variant: 'negative',
	},
};

export const Warning: Story = {
	args: {
		children: 'Warning',
		variant: 'warning',
	},
};

export const Info: Story = {
	args: {
		children: 'Info',
		variant: 'info',
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Badge size="sm">Small</Badge>
			<Badge size="md">Medium</Badge>
		</div>
	),
};

export const AllVariants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-3">
			<Badge variant="default">Default</Badge>
			<Badge variant="positive">Positive</Badge>
			<Badge variant="negative">Negative</Badge>
			<Badge variant="warning">Warning</Badge>
			<Badge variant="info">Info</Badge>
		</div>
	),
};
