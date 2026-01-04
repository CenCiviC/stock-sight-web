// import type { Route } from './+types/transactions';

import { useMemo, useState } from 'react';
import { Layout } from '~/components/Layout';
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
							<button
								type="button"
								key={type}
								onClick={() => setFilterType(type)}
								className={`
									rounded-md px-4 py-2 text-sm font-medium transition-colors
									${
										filterType === type
											? 'bg-primary text-text-primary'
											: 'bg-bg-surface text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
									}
								`}
							>
								{type === 'ALL' ? '전체' : type === 'BUY' ? '매수' : '매도'}
							</button>
						))}
					</div>

					<input
						type="text"
						placeholder="종목명 또는 종목코드 검색..."
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="rounded-md border border-border bg-bg-surface px-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-border-focus focus:outline-none focus:ring-2 focus:ring-border-focus"
					/>
				</div>

				{/* 거래 내역 테이블 */}
				<div className="overflow-hidden rounded-lg border border-border bg-bg-surface">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border">
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
										날짜
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
										종목
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
										유형
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
										거래 수량
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
										거래대금
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
										단가
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
										잔액
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{filteredTransactions.length === 0 ? (
									<tr>
										<td
											colSpan={7}
											className="px-6 py-12 text-center text-sm text-text-secondary"
										>
											거래 내역이 없습니다.
										</td>
									</tr>
								) : (
									filteredTransactions.map((tx) => (
										<tr
											key={tx.id}
											className="transition-colors hover:bg-bg-elevated"
										>
											<td className="whitespace-nowrap px-6 py-4 text-sm text-text-primary">
												{new Date(tx.date).toLocaleDateString('ko-KR')}
											</td>
											<td className="px-6 py-4 text-sm">
												<div className="font-medium text-text-primary">
													{tx.stockName}
												</div>
												<div className="text-xs text-text-secondary">
													{tx.stockCode}
												</div>
											</td>
											<td className="whitespace-nowrap px-6 py-4">
												<span
													className={`
														inline-flex rounded-md px-2 py-1 text-xs font-medium
														${
															tx.type === 'BUY'
																? 'bg-positive/10 text-positive'
																: 'bg-negative/10 text-negative'
														}
													`}
												>
													{tx.type === 'BUY' ? '매수' : '매도'}
												</span>
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-text-primary">
												{tx.quantity.toLocaleString()}주
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-text-primary">
												{tx.amount.toLocaleString()}원
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm text-text-primary">
												{tx.price.toLocaleString()}원
											</td>
											<td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium text-text-primary">
												{tx.balance.toLocaleString()}원
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</Layout>
	);
}
