import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

const meta = {
	title: 'UI/Tabs',
	component: Tabs,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => {
		const [value, setValue] = useState('transactions');

		return (
			<div className="w-96">
				<Tabs value={value} onValueChange={setValue}>
					<TabsList>
						<TabsTrigger value="transactions">거래 내역</TabsTrigger>
						<TabsTrigger value="deposits">입출금 내역</TabsTrigger>
						<TabsTrigger value="statistics">통계</TabsTrigger>
					</TabsList>
					<TabsContent value="transactions">
						<div className="p-4 bg-bg-surface rounded-md border border-border">
							<p className="text-text-primary">
								거래 내역 내용이 여기에 표시됩니다.
							</p>
						</div>
					</TabsContent>
					<TabsContent value="deposits">
						<div className="p-4 bg-bg-surface rounded-md border border-border">
							<p className="text-text-primary">
								입출금 내역 내용이 여기에 표시됩니다.
							</p>
						</div>
					</TabsContent>
					<TabsContent value="statistics">
						<div className="p-4 bg-bg-surface rounded-md border border-border">
							<p className="text-text-primary">
								통계 내용이 여기에 표시됩니다.
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		);
	},
};

export const FilterTabs: Story = {
	render: () => {
		const [value, setValue] = useState('all');

		return (
			<div className="w-96">
				<Tabs value={value} onValueChange={setValue}>
					<TabsList>
						<TabsTrigger value="all">전체</TabsTrigger>
						<TabsTrigger value="buy">매수</TabsTrigger>
						<TabsTrigger value="sell">매도</TabsTrigger>
					</TabsList>
					<TabsContent value="all">
						<div className="p-4 bg-bg-surface rounded-md border border-border">
							<p className="text-text-primary">전체 거래 내역</p>
						</div>
					</TabsContent>
					<TabsContent value="buy">
						<div className="p-4 bg-bg-surface rounded-md border border-border">
							<p className="text-text-primary">매수 거래 내역</p>
						</div>
					</TabsContent>
					<TabsContent value="sell">
						<div className="p-4 bg-bg-surface rounded-md border border-border">
							<p className="text-text-primary">매도 거래 내역</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		);
	},
};

export const Uncontrolled: Story = {
	render: () => (
		<div className="w-96">
			<Tabs defaultValue="tab1">
				<TabsList>
					<TabsTrigger value="tab1">Tab 1</TabsTrigger>
					<TabsTrigger value="tab2">Tab 2</TabsTrigger>
					<TabsTrigger value="tab3">Tab 3</TabsTrigger>
				</TabsList>
				<TabsContent value="tab1">
					<div className="p-4 bg-bg-surface rounded-md border border-border">
						<p className="text-text-primary">Tab 1 Content</p>
					</div>
				</TabsContent>
				<TabsContent value="tab2">
					<div className="p-4 bg-bg-surface rounded-md border border-border">
						<p className="text-text-primary">Tab 2 Content</p>
					</div>
				</TabsContent>
				<TabsContent value="tab3">
					<div className="p-4 bg-bg-surface rounded-md border border-border">
						<p className="text-text-primary">Tab 3 Content</p>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	),
};
