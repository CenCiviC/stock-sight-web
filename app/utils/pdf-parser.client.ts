import type { PDFDocumentProxy } from 'pdfjs-dist';
import * as pdfjsLib from 'pdfjs-dist';

// PDF.js 워커 설정 - Vite 친화적인 로컬 worker 사용
// pdf.js v5는 ESM worker (.mjs)를 사용합니다
if (typeof window !== 'undefined') {
	pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
		'pdfjs-dist/build/pdf.worker.min.mjs',
		import.meta.url,
	).toString();
}

import type {
	DepositWithdrawal,
	ParsedData,
	Transaction,
} from '~/types/parsed-data';

/**
 * PDF 파일을 읽어서 텍스트로 변환
 * 테이블 구조를 보존하기 위해 위치 정보를 활용
 */
export async function extractTextFromPDF(file: File): Promise<string> {
	const arrayBuffer = await file.arrayBuffer();

	// PDF 문서 로드 (워커 사용)
	const pdf: PDFDocumentProxy = await pdfjsLib.getDocument({
		data: arrayBuffer,
	}).promise;

	let fullText = '';

	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i);
		const textContent = await page.getTextContent();

		// 텍스트 아이템을 y 좌표로 그룹화하여 행 단위로 처리
		const lines: Array<Array<{ str: string; x: number; y: number }>> = [];
		const yTolerance = 3; // 같은 행으로 간주할 y 좌표 차이

		for (const item of textContent.items) {
			if ('str' in item && item.str.trim()) {
				const transform = item.transform || [1, 0, 0, 1, 0, 0];
				const x = transform[4];
				const y = transform[5];

				// 기존 행 중 y 좌표가 비슷한 행 찾기
				let foundLine = false;
				for (const line of lines) {
					if (line.length > 0) {
						const lineY = line[0].y;
						if (Math.abs(y - lineY) < yTolerance) {
							line.push({ str: item.str, x, y });
							foundLine = true;
							break;
						}
					}
				}

				// 새로운 행 추가
				if (!foundLine) {
					lines.push([{ str: item.str, x, y }]);
				}
			}
		}

		// 각 행을 y 좌표 역순으로 정렬 (위에서 아래로), 그 다음 x 좌표 순으로 정렬
		lines.sort((a, b) => {
			if (a.length === 0 || b.length === 0) return 0;
			return b[0].y - a[0].y; // y 좌표 역순 (PDF는 아래에서 위로)
		});

		// 각 행을 x 좌표 순으로 정렬하고 텍스트로 변환
		for (const line of lines) {
			line.sort((a, b) => a.x - b.x);
			const lineText = line.map((item) => item.str).join(' ');
			fullText += `${lineText}\n`;
		}
	}

	return fullText;
}

/**
 * 숫자 문자열을 숫자로 변환 (쉼표 제거)
 */
function parseNumber(str: string): number {
	return Number(str.replace(/,/g, '').trim()) || 0;
}

/**
 * 날짜 문자열을 Date 객체로 변환 (YYYY.MM.DD 형식)
 */
function parseDate(dateStr: string): Date {
	const [year, month, day] = dateStr.split('.').map(Number);
	return new Date(year, month - 1, day);
}

/**
 * 종목명과 종목코드 추출 (예: "넥스트랙커(US65290E1010)" -> { name: "넥스트랙커", code: "US65290E1010" })
 */
function parseStockInfo(stockStr: string): { name: string; code: string } {
	const match = stockStr.match(/^(.+?)\(([^)]+)\)$/);
	if (match) {
		return { name: match[1].trim(), code: match[2].trim() };
	}
	return { name: stockStr.trim(), code: '' };
}

/**
 * 거래일지 파싱 로직
 * 토스증권 거래내역서 형식 파싱
 */
function parseTransactions(text: string): Transaction[] {
	const transactions: Transaction[] = [];
	const lines = text.split('\n');

	// 테이블 헤더 찾기
	let headerIndex = -1;
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('거래일자')) {
			headerIndex = i;
			break;
		}
	}

	if (headerIndex === -1) {
		return transactions;
	}

	// 헤더 다음 줄부터 파싱 시작
	for (let i = headerIndex + 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line || line.includes('---') || line.includes('발급일자')) {
			continue;
		}

		// 날짜 패턴으로 시작하는지 확인 (YYYY.MM.DD)
		const dateMatch = line.match(/^(\d{4}\.\d{2}\.\d{2})/);
		if (!dateMatch) {
			continue;
		}

		// 구매 또는 판매 거래만 추출
		if (!line.includes('구매') && !line.includes('판매')) {
			continue;
		}

		// 공백으로 분리 (단일 공백 기준)
		// 컬럼 순서: 거래일자, 거래구분, 종목명, 환율, 거래수량, 거래대금, 단가, 수수료, 제세금, 변제/연체합, 잔고
		// 예: "2026.01.01 구매 트윌리오(US90138F1021) 1,434.90 3 624,181 208,060 617 0 0 3 5,325,358"
		// 종목명에 공백이 있을 수 있음: "퀀텀 Si(US74765K1051)" -> ["퀀텀", "Si(US74765K1051)"]
		const parts = line.split(/\s+/).filter((p) => p.trim());

		// 최소 필요한 컬럼 수 체크 (거래일자, 거래구분, 종목명(최소1개), 환율, 수량, 거래대금, 단가, 수수료, 제세금, 변제/연체합, 잔고, 잔액)
		// 최소 12개는 필요 (종목명이 1개인 경우 기준)
		if (parts.length < 12) {
			console.warn(
				`거래 내역 파싱 실패 - 컬럼 부족 (line ${i}, parts: ${parts.length}):`,
				line,
			);
			console.warn('Parts:', parts);
			continue;
		}

		try {
			const dateStr = parts[0]?.trim(); // 거래일자
			const transactionType = parts[1]?.trim(); // 거래구분

			// 종목명과 종목코드 찾기 (괄호가 닫힐 때까지 합치기)
			// 종목코드는 항상 괄호 안에 있으므로, 괄호가 포함된 부분을 찾아서 그 앞까지를 종목명으로 합침
			let stockInfoEndIndex = 2; // 종목명이 끝나는 인덱스
			let stockInfo = parts[2]?.trim() || '';

			// parts[2]부터 시작해서 괄호가 포함된 부분을 찾기
			for (let j = 2; j < parts.length; j++) {
				if (parts[j]?.includes('(') && parts[j]?.includes(')')) {
					// 괄호가 포함된 부분을 찾음 (종목코드)
					// 이전 부분들을 모두 종목명으로 합침
					if (j > 2) {
						stockInfo = parts.slice(2, j + 1).join(' ');
					} else {
						stockInfo = parts[j] || '';
					}
					stockInfoEndIndex = j;
					break;
				}
			}

			// 종목코드를 찾지 못한 경우 기본값 사용
			if (stockInfoEndIndex === 2 && !stockInfo.includes('(')) {
				stockInfo = parts[2]?.trim() || '';
			}

			// 환율부터 시작하는 인덱스 (종목명 다음)
			const startIndex = stockInfoEndIndex + 1;
			const exchangeRateStr = parts[startIndex]?.trim() || '0'; // 환율
			const quantityStr = parts[startIndex + 1]?.trim() || '0'; // 거래수량
			const amountStr = parts[startIndex + 2]?.trim() || '0'; // 거래대금
			const priceStr = parts[startIndex + 3]?.trim() || '0'; // 단가
			const commissionStr = parts[startIndex + 4]?.trim() || '0'; // 수수료
			const taxStr = parts[startIndex + 5]?.trim() || '0'; // 제세금
			// parts[startIndex + 6]는 변제/연체합 (사용하지 않음)
			const holdingsStr = parts[startIndex + 7]?.trim() || '0'; // 잔고(주식)
			const balanceStr = parts[startIndex + 8]?.trim() || '0'; // 잔액(통장)

			// 환율 파싱 (소수점 포함 가능)
			const exchangeRate = parseFloat(exchangeRateStr.replace(/,/g, '')) || 0;

			// 거래대금에서 원화 금액만 추출 (달러 금액이 함께 있는 경우)
			const amountMatch = amountStr.match(/^([\d,]+)/);
			const amount = amountMatch
				? parseNumber(amountMatch[1])
				: parseNumber(amountStr);

			// 단가에서 원화 금액만 추출
			const priceMatch = priceStr.match(/^([\d,]+)/);
			const price = priceMatch
				? parseNumber(priceMatch[1])
				: parseNumber(priceStr);

			// 수수료에서 원화 금액만 추출
			const commissionMatch = commissionStr.match(/^([\d,]+)/);
			const commission = commissionMatch
				? parseNumber(commissionMatch[1])
				: parseNumber(commissionStr);

			// 거래세에서 원화 금액만 추출
			const taxMatch = taxStr.match(/^([\d,]+)/);
			const tax = taxMatch ? parseNumber(taxMatch[1]) : parseNumber(taxStr);

			if (!dateStr || !transactionType || !stockInfo) {
				console.warn(`거래 내역 파싱 실패 - 필수 필드 누락 (line ${i}):`, {
					dateStr,
					transactionType,
					stockInfo,
				});
				continue;
			}

			const { name: stockName, code: stockCode } = parseStockInfo(stockInfo);
			const quantity = parseNumber(quantityStr);
			const holdings = parseNumber(holdingsStr); // 잔고(주식)

			// 잔액(통장)에서 원화 금액만 추출
			const balanceMatch = balanceStr.match(/^([\d,]+)/);
			const balance = balanceMatch
				? parseNumber(balanceMatch[1])
				: parseNumber(balanceStr);

			if (transactionType === '구매' || transactionType === '판매') {
				const transaction: Transaction = {
					id: `${dateStr}-${stockCode}-${transactionType}-${i}`,
					date: parseDate(dateStr),
					type: transactionType === '구매' ? 'BUY' : 'SELL',
					stockName,
					stockCode,
					exchangeRate,
					quantity,
					amount,
					price,
					commission,
					tax,
					holdings,
					balance,
				};

				transactions.push(transaction);
				// console.log('transaction', transaction);
			}
		} catch (error) {
			// 파싱 실패한 행은 건너뛰기
			console.warn(`거래 내역 파싱 실패 (line ${i}):`, line, error);
		}
	}

	return transactions;
}

/**
 * 입출금 내역 파싱 로직
 * 토스증권 거래내역서 형식 파싱
 */
function parseDepositWithdrawals(text: string): DepositWithdrawal[] {
	const depositWithdrawals: DepositWithdrawal[] = [];
	const lines = text.split('\n');

	// 테이블 헤더 찾기
	let headerIndex = -1;
	for (let i = 0; i < lines.length; i++) {
		if (
			lines[i].includes('거래일자') &&
			lines[i].includes('거래구분') &&
			lines[i].includes('거래대금')
		) {
			headerIndex = i;
			break;
		}
	}

	if (headerIndex === -1) {
		return depositWithdrawals;
	}

	// 헤더 다음 줄부터 파싱 시작
	for (let i = headerIndex + 1; i < lines.length; i++) {
		const line = lines[i].trim();
		if (!line || line.includes('---') || line.includes('발급일자')) {
			continue;
		}

		// 날짜 패턴으로 시작하는지 확인 (YYYY.MM.DD)
		const dateMatch = line.match(/^(\d{4}\.\d{2}\.\d{2})/);
		if (!dateMatch) {
			continue;
		}

		// 구매/판매 거래는 제외
		if (line.includes('구매') || line.includes('판매')) {
			continue;
		}

		// 거래구분에 "입금" 또는 "출금"이 포함되어 있는지 확인
		const transactionType = line.split(/\s+/)[1]?.trim() || '';
		const isDeposit = transactionType.includes('입금');
		const isWithdrawal = transactionType.includes('출금');

		if (!isDeposit && !isWithdrawal) {
			continue;
		}

		// 공백으로 분리 (단일 공백 기준)
		// 형식: YYYY.MM.DD 거래구분 ... 거래대금 ... 잔액
		const parts = line.split(/\s+/).filter((p) => p.trim());

		if (parts.length < 3) {
			console.warn(
				`입출금 내역 파싱 실패 - 컬럼 부족 (line ${i}, parts: ${parts.length}):`,
				line,
			);
			console.warn('Parts:', parts);
			continue;
		}

		try {
			const dateStr = parts[0]?.trim();

			// 디버깅: parts 배열 확인
			console.log(`[입출금 Line ${i}] Original:`, line);
			console.log(`[입출금 Line ${i}] Parts:`, parts);

			// 거래대금(amount)과 잔액(balance) 찾기
			// 숫자 패턴으로 거래대금과 잔액 찾기 (큰 숫자들, 1000 이상)
			const largeNumbers: Array<{ value: number; index: number }> = [];
			for (let j = 2; j < parts.length; j++) {
				const numStr = parts[j]?.replace(/,/g, '').trim();
				const num = parseFloat(numStr);
				if (!Number.isNaN(num) && num >= 1000) {
					largeNumbers.push({ value: num, index: j });
				}
			}

			// 거래대금은 보통 중간에 있고, 잔액은 마지막에 있음
			let amount = 0;
			let balance = 0;

			if (largeNumbers.length >= 2) {
				// 마지막 큰 숫자가 잔액
				balance = Math.round(largeNumbers[largeNumbers.length - 1].value);
				// 그 앞의 큰 숫자가 거래대금
				amount = Math.round(largeNumbers[largeNumbers.length - 2].value);
			} else if (largeNumbers.length === 1) {
				// 큰 숫자가 하나만 있으면 그것이 거래대금이고, 잔액은 마지막 컬럼에서 찾기
				amount = Math.round(largeNumbers[0].value);
				// 마지막 컬럼이 잔액일 가능성
				const lastPart = parts[parts.length - 1]?.replace(/,/g, '').trim();
				const lastNum = parseFloat(lastPart);
				if (!Number.isNaN(lastNum) && lastNum >= 1000) {
					balance = Math.round(lastNum);
				}
			}

			// 환율 찾기 (소수점이 포함된 작은 숫자, 보통 1000~2000 사이)
			let exchangeRate = 0;
			for (let j = 2; j < parts.length; j++) {
				const numStr = parts[j]?.replace(/,/g, '').trim();
				const num = parseFloat(numStr);
				if (
					!Number.isNaN(num) &&
					num > 100 &&
					num < 10000 &&
					numStr.includes('.')
				) {
					exchangeRate = num;
					break;
				}
			}

			console.log(`[입출금 Line ${i}] Parsed:`, {
				dateStr,
				transactionType,
				amount,
				balance,
				exchangeRate,
				largeNumbers,
			});

			if (!dateStr || !transactionType) {
				console.warn(`입출금 내역 파싱 실패 - 필수 필드 누락 (line ${i}):`, {
					dateStr,
					transactionType,
					amount,
					balance,
				});
				continue;
			}

			const depositWithdrawal: DepositWithdrawal = {
				id: `${dateStr}-${transactionType}-${i}`,
				type: isDeposit ? 'DEPOSIT' : 'WITHDRAWAL',
				exchangeRate,
				amount,
				balance,
				date: parseDate(dateStr),
				description: transactionType,
			};

			depositWithdrawals.push(depositWithdrawal);
		} catch (error) {
			// 파싱 실패한 행은 건너뛰기
			console.warn(`입출금 내역 파싱 실패 (line ${i}):`, line, error);
		}
	}

	return depositWithdrawals;
}

/**
 * PDF 파일을 파싱하여 거래 내역과 입출금 내역 추출
 */
export async function parsePDF(file: File): Promise<ParsedData> {
	try {
		const text = await extractTextFromPDF(file);

		// 파싱된 텍스트 일부를 로그로 출력 (디버깅용)
		console.log('=== PDF 파싱 시작 ===');
		console.log('파일명:', file.name);
		console.log('파일 크기:', file.size, 'bytes');
		console.log('추출된 텍스트 길이:', text.length);
		console.log('추출된 텍스트 (처음 500자):', text.substring(0, 500));
		console.log(
			'추출된 텍스트 (마지막 500자):',
			text.substring(text.length - 500),
		);

		const transactions = parseTransactions(text);
		const depositWithdrawals = parseDepositWithdrawals(text);

		const result = {
			transactions,
			depositWithdrawals,
			parsedAt: new Date(),
		};

		// 파싱 결과 로그 출력
		console.log('=== PDF 파싱 결과 ===');
		console.log('거래 내역 개수:', transactions.length);
		console.log('입출금 내역 개수:', depositWithdrawals.length);
		console.log('거래 내역:', transactions);
		console.log('입출금 내역:', depositWithdrawals);
		console.log('전체 파싱 결과:', result);

		return result;
	} catch (error) {
		console.error('PDF 파싱 에러:', error);
		throw new Error(
			`PDF 파싱 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
		);
	}
}
