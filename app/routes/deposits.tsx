// import type { Route } from './+types/deposits';

import { useMemo, useState } from 'react';
import { Layout } from '~/components/Layout';
import {
	Badge,
	Button,
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
						<Button
							key={type}
							variant={filterType === type ? 'primary' : 'secondary'}
							size="sm"
							onClick={() => setFilterType(type)}
						>
							{type === 'ALL' ? '전체' : type === 'DEPOSIT' ? '입금' : '출금'}
						</Button>
					))}
				</div>

				{/* 입출금 내역 테이블 */}
				<Table>
					<TableHeader>
						<TableRow hover={false}>
							<TableHead>날짜</TableHead>
							<TableHead>유형</TableHead>
							<TableHead className="text-right">금액</TableHead>
							<TableHead>설명</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredDeposits.length === 0 ? (
							<TableRow hover={false}>
								<TableCell
									colSpan={4}
									className="px-6 py-12 text-center text-sm text-text-secondary"
								>
									입출금 내역이 없습니다.
								</TableCell>
							</TableRow>
						) : (
							filteredDeposits.map((dw) => (
								<TableRow key={dw.id}>
									<TableCell className="whitespace-nowrap">
										{new Date(dw.date).toLocaleDateString('ko-KR')}
									</TableCell>
									<TableCell className="whitespace-nowrap">
										<Badge
											variant={dw.type === 'DEPOSIT' ? 'positive' : 'negative'}
											size="sm"
										>
											{dw.type === 'DEPOSIT' ? '입금' : '출금'}
										</Badge>
									</TableCell>
									<TableCell
										className={`whitespace-nowrap text-right font-medium ${
											dw.type === 'DEPOSIT' ? 'text-positive' : 'text-negative'
										}`}
									>
										{dw.type === 'DEPOSIT' ? '+' : '-'}
										{dw.amount.toLocaleString()}원
									</TableCell>
									<TableCell className="text-text-secondary">
										{dw.description || '-'}
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
