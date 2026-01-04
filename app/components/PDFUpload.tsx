import { useRef, useState } from 'react';
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '~/components/ui';
import { useParsedData } from '~/contexts/ParsedDataContext';
import { parsePDF } from '~/utils/pdf-parser.client';

export function PDFUpload() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isParsing, setIsParsing] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { data, setData } = useParsedData();

	const handleFile = async (file: File) => {
		if (file.type !== 'application/pdf') {
			setError('PDF 파일만 업로드 가능합니다.');
			return;
		}

		setIsParsing(true);
		setError(null);

		try {
			console.log('파일 업로드 시작:', file.name);
			const parsedData = await parsePDF(file);
			console.log('파싱 완료, 데이터 설정:', parsedData);
			setData(parsedData);
			console.log('데이터가 Context에 설정되었습니다.');
		} catch (err) {
			console.error('파싱 에러:', err);
			setError(
				err instanceof Error ? err.message : 'PDF 파싱 중 오류가 발생했습니다.',
			);
		} finally {
			setIsParsing(false);
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);

		const file = e.dataTransfer.files[0];
		if (file) {
			handleFile(file);
		}
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => {
		setIsDragging(false);
	};

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			fileInputRef.current?.click();
		}
	};

	const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			handleFile(file);
		}
	};

	const loadExamplePDF = async () => {
		setIsParsing(true);
		setError(null);

		try {
			console.log('예제 PDF 로드 시작');
			// public 폴더의 example.pdf를 fetch로 가져오기
			const response = await fetch('/example.pdf');
			if (!response.ok) {
				throw new Error('예제 PDF 파일을 찾을 수 없습니다.');
			}
			const blob = await response.blob();
			const file = new File([blob], 'example.pdf', { type: 'application/pdf' });
			console.log('예제 PDF 파일 생성 완료:', file.name, file.size);
			const parsedData = await parsePDF(file);
			console.log('예제 PDF 파싱 완료, 데이터 설정:', parsedData);
			setData(parsedData);
			console.log('데이터가 Context에 설정되었습니다.');
		} catch (err) {
			console.error('예제 PDF 로드 에러:', err);
			setError(
				err instanceof Error
					? err.message
					: '예제 PDF 로드 중 오류가 발생했습니다.',
			);
		} finally {
			setIsParsing(false);
		}
	};

	return (
		<div className="w-full">
			<button
				type="button"
				onDrop={handleDrop}
				onDragOver={handleDragOver}
				onDragLeave={handleDragLeave}
				onKeyDown={handleKeyDown}
				disabled={isParsing}
				className={`
					relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors
					${isDragging ? 'border-primary bg-bg-elevated' : 'border-border bg-bg-surface'}
					${isParsing ? 'pointer-events-none opacity-50' : 'hover:border-border-hover hover:bg-bg-elevated'}
					disabled:cursor-not-allowed
				`}
				onClick={() => fileInputRef.current?.click()}
			>
				<input
					ref={fileInputRef}
					type="file"
					accept=".pdf"
					onChange={handleFileInput}
					className="hidden"
				/>

				{isParsing ? (
					<>
						<div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-border border-t-primary" />
						<p className="text-sm text-text-secondary">PDF 파싱 중...</p>
					</>
				) : (
					<>
						<svg
							className="mb-4 h-12 w-12 text-text-secondary"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
						>
							<title>PDF 업로드 아이콘</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
							/>
						</svg>
						<p className="mb-2 text-sm font-medium text-text-primary">
							PDF 파일을 드래그하거나 클릭하여 업로드
						</p>
						<p className="text-xs text-text-secondary">
							증권사 거래일지 PDF 파일을 업로드하세요
						</p>
					</>
				)}
			</button>

			{error && (
				<Card className="mt-4 border-negative bg-bg-elevated">
					<CardContent className="p-4">
						<p className="text-sm text-negative">{error}</p>
					</CardContent>
				</Card>
			)}

			{/* 예제 PDF 로드 버튼 */}
			<div className="mt-4 flex justify-center">
				<Button
					type="button"
					variant="secondary"
					onClick={loadExamplePDF}
					disabled={isParsing}
				>
					{isParsing ? '로딩 중...' : '예제 PDF 사용 (example.pdf)'}
				</Button>
			</div>

			{/* 파싱 결과 디버깅 정보 */}
			{data && (
				<Card className="mt-6">
					<CardHeader>
						<CardTitle className="text-sm">파싱 결과 (디버깅)</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-2 text-xs text-text-secondary">
							<div>
								<span className="font-medium">거래 내역:</span>{' '}
								{data.transactions.length}건
							</div>
							<div>
								<span className="font-medium">입출금 내역:</span>{' '}
								{data.depositWithdrawals.length}건
							</div>
							<div>
								<span className="font-medium">파싱 시간:</span>{' '}
								{data.parsedAt.toLocaleString('ko-KR')}
							</div>
							{data.transactions.length > 0 && (
								<div className="mt-3">
									<div className="mb-2 font-medium">
										거래 내역 샘플 (최대 3개):
									</div>
									<div className="max-h-48 space-y-1 overflow-y-auto rounded border border-border bg-bg-elevated p-2">
										{data.transactions.slice(0, 3).map((tx) => (
											<div key={tx.id} className="text-xs">
												{tx.date.toLocaleDateString('ko-KR')} | {tx.type} |{' '}
												{tx.stockName} ({tx.stockCode}) | {tx.quantity}주 |{' '}
												{tx.price.toLocaleString()}원 |{' '}
												{tx.balance.toLocaleString()}원
											</div>
										))}
									</div>
								</div>
							)}
							{data.depositWithdrawals.length > 0 && (
								<div className="mt-3">
									<div className="mb-2 font-medium">
										입출금 내역 샘플 (최대 3개):
									</div>
									<div className="max-h-48 space-y-1 overflow-y-auto rounded border border-border bg-bg-elevated p-2">
										{data.depositWithdrawals.slice(0, 3).map((dw) => (
											<div key={dw.id} className="text-xs">
												{dw.date.toLocaleDateString('ko-KR')} | {dw.type} |{' '}
												{dw.amount.toLocaleString()}원 | {dw.description}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
