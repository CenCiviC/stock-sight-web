// import type { Route } from './+types/transactions';

import { useMemo, useState } from 'react';
import { Layout } from '~/components/Layout';
import {
	Badge,
	Button,
	Input,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui';
import { useParsedData } from '~/contexts/ParsedDataContext';

export function meta() {
	return [
		{ title: '거래 내역 - Stock Sight' },
		{ name: 'description', content: '주식 거래 내역 조회' },
	];
}

export default function Transactions() {
	const { transactions } = useParsedData();
	const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
	const [searchTerm, setSearchTerm] = useState('');

	const filteredTransactions = useMemo(() => {
		return transactions
			.filter((tx) => {
				const matchesType = filterType === 'ALL' || tx.type === filterType;
				const matchesSearch =
					searchTerm === '' ||
					tx.stockName.includes(searchTerm) ||
					tx.stockCode.includes(searchTerm);
				return matchesType && matchesSearch;
			})
			.sort((a, b) => {
				// 날짜 순으로 정렬 (최신 날짜가 위에 오도록 내림차순)
				const dateA = new Date(a.date).getTime();
				const dateB = new Date(b.date).getTime();
				return dateB - dateA;
			});
	}, [transactions, filterType, searchTerm]);

	return (
		<Layout>
			<div className="space-y-6">
				<div>
					<h1 className="mb-2 text-3xl font-bold">거래 내역</h1>
					<p className="text-sm text-text-secondary">
						총 {transactions.length}건의 거래 내역
					</p>
				</div>

				{/* 필터 및 검색 */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex gap-2">
						{(['ALL', 'BUY', 'SELL'] as const).map((type) => (
							<Button
								key={type}
								variant={filterType === type ? 'primary' : 'secondary'}
								size="sm"
								onClick={() => setFilterType(type)}
							>
								{type === 'ALL' ? '전체' : type === 'BUY' ? '매수' : '매도'}
							</Button>
						))}
					</div>

					<div className="flex-1">
						<Input
							type="text"
							placeholder="종목명 또는 종목코드 검색..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="sm:w-64"
						/>
					</div>
				</div>

				{/* 거래 내역 테이블 */}
				<Table>
					<TableHeader>
						<TableRow hover={false}>
							<TableHead>날짜</TableHead>
							<TableHead>종목</TableHead>
							<TableHead>유형</TableHead>
							<TableHead className="text-right">거래 수량</TableHead>
							<TableHead className="text-right">거래대금</TableHead>
							<TableHead className="text-right">단가</TableHead>
							<TableHead className="text-right">잔액</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredTransactions.length === 0 ? (
							<TableRow hover={false}>
								<TableCell
									colSpan={7}
									className="px-6 py-12 text-center text-sm text-text-secondary"
								>
									거래 내역이 없습니다.
								</TableCell>
							</TableRow>
						) : (
							filteredTransactions.map((tx) => (
								<TableRow key={tx.id}>
									<TableCell className="whitespace-nowrap">
										{new Date(tx.date).toLocaleDateString('ko-KR')}
									</TableCell>
									<TableCell>
										<div className="font-medium text-text-primary">
											{tx.stockName}
										</div>
										<div className="text-xs text-text-secondary">
											{tx.stockCode}
										</div>
									</TableCell>
									<TableCell className="whitespace-nowrap">
										<Badge
											variant={tx.type === 'BUY' ? 'positive' : 'negative'}
											size="sm"
										>
											{tx.type === 'BUY' ? '매수' : '매도'}
										</Badge>
									</TableCell>
									<TableCell className="whitespace-nowrap text-right">
										{tx.quantity.toLocaleString()}주
									</TableCell>
									<TableCell className="whitespace-nowrap text-right font-medium">
										{tx.amount.toLocaleString()}원
									</TableCell>
									<TableCell className="whitespace-nowrap text-right">
										{tx.price.toLocaleString()}원
									</TableCell>
									<TableCell className="whitespace-nowrap text-right font-medium">
										{tx.balance.toLocaleString()}원
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</Layout>
	);
}
