import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
	title: 'UI/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'secondary', 'ghost'],
		},
		size: {
			control: 'select',
			options: ['sm', 'md', 'lg'],
		},
		fullWidth: {
			control: 'boolean',
		},
		disabled: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		children: 'Button',
		variant: 'primary',
		size: 'md',
	},
};

export const Secondary: Story = {
	args: {
		children: 'Button',
		variant: 'secondary',
		size: 'md',
	},
};

export const Ghost: Story = {
	args: {
		children: 'Button',
		variant: 'ghost',
		size: 'md',
	},
};

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-4">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	),
};

export const States: Story = {
	render: () => (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<Button>Default</Button>
				<Button disabled>Disabled</Button>
			</div>
			<div className="flex items-center gap-4">
				<Button variant="secondary">Default</Button>
				<Button variant="secondary" disabled>
					Disabled
				</Button>
			</div>
		</div>
	),
};

export const FullWidth: Story = {
	render: () => (
		<div className="w-96">
			<Button fullWidth>Full Width Button</Button>
		</div>
	),
};
