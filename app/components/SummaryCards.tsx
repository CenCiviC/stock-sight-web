import { Card, CardContent } from '~/components/ui';
import { useParsedData } from '~/contexts/ParsedDataContext';

export function SummaryCards() {
	const { transactions, depositWithdrawals } = useParsedData();

	const totalTransactions = transactions.length;
	const totalDeposits = depositWithdrawals
		.filter((dw) => dw.type === 'DEPOSIT')
		.reduce((sum, dw) => sum + dw.amount, 0);
	const totalWithdrawals = depositWithdrawals
		.filter((dw) => dw.type === 'WITHDRAWAL')
		.reduce((sum, dw) => sum + dw.amount, 0);

	const cards = [
		{
			title: '총 거래 건수',
			value: totalTransactions.toLocaleString(),
			unit: '건',
		},
		{
			title: '총 입금액',
			value: totalDeposits.toLocaleString(),
			unit: '원',
			color: 'text-positive',
		},
		{
			title: '총 출금액',
			value: totalWithdrawals.toLocaleString(),
			unit: '원',
			color: 'text-negative',
		},
		{
			title: '입출금 차이',
			value: (totalDeposits - totalWithdrawals).toLocaleString(),
			unit: '원',
			color:
				totalDeposits - totalWithdrawals >= 0
					? 'text-positive'
					: 'text-negative',
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{cards.map((card) => (
				<Card key={card.title} variant="elevated">
					<CardContent className="p-6">
						<p className="mb-2 text-sm text-text-secondary">{card.title}</p>
						<p
							className={`text-2xl font-semibold ${card.color ?? 'text-text-primary'}`}
						>
							{card.value}{' '}
							<span className="text-base text-text-secondary">{card.unit}</span>
						</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
}
