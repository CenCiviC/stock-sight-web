// import type { Route } from './+types/deposits';

import { useMemo, useState } from 'react';
import { Layout } from '~/components/Layout';
import { useParsedData } from '~/contexts/ParsedDataContext';

export function meta() {
	return [
		{ title: '입출금 내역 - Stock Sight' },
		{ name: 'description', content: '입출금 내역 조회' },
	];
}

export default function Deposits() {
	const { depositWithdrawals } = useParsedData();
	const [filterType, setFilterType] = useState<
		'ALL' | 'DEPOSIT' | 'WITHDRAWAL'
	>('ALL');

	const filteredDeposits = useMemo(() => {
		return depositWithdrawals
			.filter((dw) => {
				return filterType === 'ALL' || dw.type === filterType;
			})
			.sort((a, b) => {
				// 날짜 순으로 정렬 (최신 날짜가 위에 오도록 내림차순)
				const dateA = new Date(a.date).getTime();
				const dateB = new Date(b.date).getTime();
				return dateB - dateA;
			});
	}, [depositWithdrawals, filterType]);

	return (
		<Layout>
			<div className="space-y-6">
				<div>
					<h1 className="mb-2 text-3xl font-bold">입출금 내역</h1>
					<p className="text-sm text-text-secondary">
						총 {depositWithdrawals.length}건의 입출금 내역
					</p>
				</div>

				{/* 필터 */}
				<div className="flex gap-2">
					{(['ALL', 'DEPOSIT', 'WITHDRAWAL'] as const).map((type) => (
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
							{type === 'ALL' ? '전체' : type === 'DEPOSIT' ? '입금' : '출금'}
						</button>
					))}
				</div>

				{/* 입출금 내역 테이블 */}
				<div className="overflow-hidden rounded-lg border border-border bg-bg-surface">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead>
								<tr className="border-b border-border">
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
										날짜
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
										유형
									</th>
									<th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-secondary">
										금액
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-secondary">
										설명
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border">
								{filteredDeposits.length === 0 ? (
									<tr>
										<td
											colSpan={4}
											className="px-6 py-12 text-center text-sm text-text-secondary"
										>
											입출금 내역이 없습니다.
										</td>
									</tr>
								) : (
									filteredDeposits.map((dw) => (
										<tr
											key={dw.id}
											className="transition-colors hover:bg-bg-elevated"
										>
											<td className="whitespace-nowrap px-6 py-4 text-sm text-text-primary">
												{new Date(dw.date).toLocaleDateString('ko-KR')}
											</td>
											<td className="whitespace-nowrap px-6 py-4">
												<span
													className={`
														inline-flex rounded-md px-2 py-1 text-xs font-medium
														${
															dw.type === 'DEPOSIT'
																? 'bg-positive/10 text-positive'
																: 'bg-negative/10 text-negative'
														}
													`}
												>
													{dw.type === 'DEPOSIT' ? '입금' : '출금'}
												</span>
											</td>
											<td
												className={`whitespace-nowrap px-6 py-4 text-right text-sm font-medium ${
													dw.type === 'DEPOSIT'
														? 'text-positive'
														: 'text-negative'
												}`}
											>
												{dw.type === 'DEPOSIT' ? '+' : '-'}
												{dw.amount.toLocaleString()}원
											</td>
											<td className="px-6 py-4 text-sm text-text-secondary">
												{dw.description || '-'}
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
