import { Link } from 'react-router';
import { useParsedData } from '~/contexts/ParsedDataContext';

export function Layout({ children }: { children: React.ReactNode }) {
	const { data } = useParsedData();

	return (
		<div className="min-h-screen bg-bg-main text-text-primary">
			{/* 헤더 */}
			<header className="border-b border-border bg-bg-surface">
				<div className="mx-auto max-w-7xl px-6">
					<div className="flex h-16 items-center justify-between">
						<Link to="/" className="text-xl font-semibold">
							Stock Sight
						</Link>
						<nav className="flex items-center gap-6">
							<Link
								to="/"
								className="text-sm text-text-secondary transition-colors hover:text-text-primary"
							>
								대시보드
							</Link>
							{data && (
								<>
									<Link
										to="/transactions"
										className="text-sm text-text-secondary transition-colors hover:text-text-primary"
									>
										거래 내역
									</Link>
									<Link
										to="/deposits"
										className="text-sm text-text-secondary transition-colors hover:text-text-primary"
									>
										입출금 내역
									</Link>
								</>
							)}
						</nav>
					</div>
				</div>
			</header>

			{/* 메인 컨텐츠 */}
			<main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
		</div>
	);
}
