import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './Table';

const meta = {
	title: 'UI/Table',
	component: Table,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleData = [
	{
		date: '2024-01-15',
		stock: 'Apple Inc.',
		type: 'BUY',
		quantity: 10,
		amount: 15000,
		price: 1500,
	},
	{
		date: '2024-01-16',
		stock: 'Microsoft Corp.',
		type: 'SELL',
		quantity: 5,
		amount: 12000,
		price: 2400,
	},
	{
		date: '2024-01-17',
		stock: 'Tesla Inc.',
		type: 'BUY',
		quantity: 20,
		amount: 40000,
		price: 2000,
	},
];

export const Default: Story = {
	render: () => (
		<div className="w-full max-w-4xl">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>날짜</TableHead>
						<TableHead>종목</TableHead>
						<TableHead>유형</TableHead>
						<TableHead>수량</TableHead>
						<TableHead>거래대금</TableHead>
						<TableHead>단가</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{sampleData.map((row) => (
						<TableRow key={`${row.date}-${row.stock}-${row.type}`}>
							<TableCell>{row.date}</TableCell>
							<TableCell>{row.stock}</TableCell>
							<TableCell>
								<Badge
									variant={row.type === 'BUY' ? 'positive' : 'negative'}
									size="sm"
								>
									{row.type === 'BUY' ? '매수' : '매도'}
								</Badge>
							</TableCell>
							<TableCell>{row.quantity}</TableCell>
							<TableCell>{row.amount.toLocaleString()}원</TableCell>
							<TableCell>{row.price.toLocaleString()}원</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	),
};

export const WithoutHover: Story = {
	render: () => (
		<div className="w-full max-w-4xl">
			<Table>
				<TableHeader>
					<TableRow hover={false}>
						<TableHead>항목</TableHead>
						<TableHead>값</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow hover={false}>
						<TableCell>총 거래 건수</TableCell>
						<TableCell>150건</TableCell>
					</TableRow>
					<TableRow hover={false}>
						<TableCell>총 입금액</TableCell>
						<TableCell>5,000,000원</TableCell>
					</TableRow>
					<TableRow hover={false}>
						<TableCell>총 출금액</TableCell>
						<TableCell>2,000,000원</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	),
};

export const Empty: Story = {
	render: () => (
		<div className="w-full max-w-4xl">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>날짜</TableHead>
						<TableHead>종목</TableHead>
						<TableHead>유형</TableHead>
						<TableHead>수량</TableHead>
						<TableHead>거래대금</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell
							colSpan={5}
							className="text-center text-text-secondary py-8"
						>
							데이터가 없습니다
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</div>
	),
};
