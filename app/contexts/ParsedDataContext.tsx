import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useState,
} from 'react';
import type {
	DepositWithdrawal,
	ParsedData,
	Transaction,
} from '~/types/parsed-data';

interface ParsedDataContextType {
	data: ParsedData | null;
	setData: (data: ParsedData | null) => void;
	transactions: Transaction[];
	depositWithdrawals: DepositWithdrawal[];
	clearData: () => void;
}

const ParsedDataContext = createContext<ParsedDataContextType | undefined>(
	undefined,
);

export function ParsedDataProvider({ children }: { children: ReactNode }) {
	const [data, setData] = useState<ParsedData | null>(null);

	const clearData = useCallback(() => {
		setData(null);
	}, []);

	const value: ParsedDataContextType = {
		data,
		setData,
		transactions: data?.transactions ?? [],
		depositWithdrawals: data?.depositWithdrawals ?? [],
		clearData,
	};

	return (
		<ParsedDataContext.Provider value={value}>
			{children}
		</ParsedDataContext.Provider>
	);
}

export function useParsedData() {
	const context = useContext(ParsedDataContext);
	if (context === undefined) {
		throw new Error('useParsedData must be used within a ParsedDataProvider');
	}
	return context;
}
