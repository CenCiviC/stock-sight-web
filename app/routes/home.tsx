import { useEffect, useState } from 'react';
import { Layout } from '~/components/Layout';
import { SummaryCards } from '~/components/SummaryCards';
import { Card, CardContent } from '~/components/ui';
import { useParsedData } from '~/contexts/ParsedDataContext';
import { parsePDF } from '~/utils/pdf-parser.client';
import type { Route } from './+types/home';

export function meta(_: Route.MetaArgs) {
	return [
		{ title: 'Stock Sight - 주식매매일지 기록' },
		{
			name: 'description',
			content: '증권사 거래일지 PDF를 파싱하여 주식매매 통계 및 분석 제공',
		},
	];
}

export default function Home() {
	const { data, setData } = useParsedData();
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const loadExamplePDF = async () => {
			setIsLoading(true);
			setError(null);

			try {
				// public 폴더의 example.pdf를 fetch로 가져오기
				const response = await fetch('/example.pdf');
				if (!response.ok) {
					throw new Error('예제 PDF 파일을 찾을 수 없습니다.');
				}
				const blob = await response.blob();
				const file = new File([blob], 'example.pdf', {
					type: 'application/pdf',
				});
				const parsedData = await parsePDF(file);
				setData(parsedData);
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: 'PDF 파싱 중 오류가 발생했습니다.',
				);
			} finally {
				setIsLoading(false);
			}
		};

		// 데이터가 없을 때만 자동 로드
		if (!data) {
			loadExamplePDF();
		} else {
			setIsLoading(false);
		}
	}, [data, setData]);

	return (
		<Layout>
			<div className="space-y-8">
				<div>
					<h1 className="mb-2 text-3xl font-bold">Stock Sight</h1>
					<p className="text-sm text-text-secondary">
						증권사 거래일지 PDF 분석 결과
					</p>
				</div>

				{isLoading ? (
					<Card>
						<CardContent className="flex flex-col items-center justify-center p-12">
							<div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary" />
							<p className="text-sm text-text-secondary">PDF 파싱 중...</p>
						</CardContent>
					</Card>
				) : error ? (
					<Card className="border-negative bg-bg-elevated">
						<CardContent className="p-4">
							<p className="text-sm text-negative">{error}</p>
						</CardContent>
					</Card>
				) : data ? (
					<SummaryCards />
				) : null}
			</div>
		</Layout>
	);
}
