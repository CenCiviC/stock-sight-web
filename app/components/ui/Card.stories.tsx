import type { Meta, StoryObj } from '@storybook/react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from './Card';
import { Button } from './Button';

const meta = {
	title: 'UI/Card',
	component: Card,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'elevated'],
		},
	},
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader>
				<CardTitle>Card Title</CardTitle>
				<CardDescription>This is a card description</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-text-primary">
					This is the card content. You can put any content here.
				</p>
			</CardContent>
		</Card>
	),
};

export const WithFooter: Story = {
	render: () => (
		<Card className="w-96">
			<CardHeader>
				<CardTitle>Card with Footer</CardTitle>
				<CardDescription>Card description goes here</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-text-primary">
					This card has a footer with action buttons.
				</p>
			</CardContent>
			<CardFooter className="flex justify-end gap-2">
				<Button variant="ghost" size="sm">
					Cancel
				</Button>
				<Button size="sm">Save</Button>
			</CardFooter>
		</Card>
	),
};

export const Elevated: Story = {
	render: () => (
		<Card variant="elevated" className="w-96">
			<CardHeader>
				<CardTitle>Elevated Card</CardTitle>
				<CardDescription>
					This card has hover effects enabled
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-text-primary">
					Hover over this card to see the elevated effect.
				</p>
			</CardContent>
		</Card>
	),
};

export const Simple: Story = {
	render: () => (
		<Card className="w-96">
			<CardContent className="pt-6">
				<p className="text-text-primary">
					A simple card without header or footer.
				</p>
			</CardContent>
		</Card>
	),
};

