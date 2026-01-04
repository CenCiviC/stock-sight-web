import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
	title: 'UI/Input',
	component: Input,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		type: {
			control: 'select',
			options: ['text', 'email', 'password', 'number'],
		},
		disabled: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		placeholder: 'Enter text...',
	},
};

export const WithLabel: Story = {
	args: {
		label: 'Email',
		placeholder: 'example@email.com',
		type: 'email',
	},
};

export const WithHelperText: Story = {
	args: {
		label: 'Password',
		type: 'password',
		placeholder: 'Enter password',
		helperText: 'Must be at least 8 characters',
	},
};

export const WithError: Story = {
	args: {
		label: 'Email',
		type: 'email',
		placeholder: 'example@email.com',
		error: 'Please enter a valid email address',
		defaultValue: 'invalid-email',
	},
};

export const Disabled: Story = {
	args: {
		label: 'Disabled Input',
		placeholder: 'Cannot edit',
		disabled: true,
		defaultValue: 'Disabled value',
	},
};

export const AllStates: Story = {
	render: () => (
		<div className="w-96 space-y-6">
			<Input label="Default" placeholder="Enter text..." />
			<Input
				label="With Helper Text"
				placeholder="Enter text..."
				helperText="This is helpful information"
			/>
			<Input
				label="With Error"
				placeholder="Enter text..."
				error="This field is required"
			/>
			<Input
				label="Disabled"
				placeholder="Cannot edit"
				disabled
				defaultValue="Disabled value"
			/>
		</div>
	),
};

