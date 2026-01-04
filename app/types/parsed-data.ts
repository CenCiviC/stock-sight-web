// PDF 파싱 결과 타입 정의

export type TransactionType = 'BUY' | 'SELL';

export interface Transaction {
	id: string;
	date: Date; // 거래일자
	type: TransactionType;
	stockName: string; // 종목명
	stockCode: string; // 종목코드(pdf에서는 자체 코드로 저장)
	exchangeRate: number; // 환율
	quantity: number; // 거래수량
	amount: number; // 거래대금
	price: number; // 단가
	commission: number; // 수수료
	tax: number; // 제세금
	holdings: number; // 잔고(주식)
	balance: number; // 잔액(현재 내 통장)
}

export type DepositWithdrawalType = 'DEPOSIT' | 'WITHDRAWAL';

export interface DepositWithdrawal {
	id: string;
	date: Date;
	type: DepositWithdrawalType;
	exchangeRate: number; // 환율
	amount: number;
	balance: number;
	description?: string;
}

export interface ParsedData {
	transactions: Transaction[];
	depositWithdrawals: DepositWithdrawal[];
	parsedAt: Date;
}

export interface ParseResult {
	success: boolean;
	data?: ParsedData;
	error?: string;
}
