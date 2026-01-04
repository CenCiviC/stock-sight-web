import type { HTMLAttributes, TdHTMLAttributes } from 'react';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {}

export function Table({ className = '', ...props }: TableProps) {
	return (
		<div className="w-full overflow-auto">
			<table className={`w-full border-collapse ${className}`} {...props} />
		</div>
	);
}

export interface TableHeaderProps
	extends HTMLAttributes<HTMLTableSectionElement> {}

export function TableHeader({ className = '', ...props }: TableHeaderProps) {
	return (
		<thead
			className={`bg-bg-surface border-b border-border ${className}`}
			{...props}
		/>
	);
}

export interface TableBodyProps
	extends HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({ className = '', ...props }: TableBodyProps) {
	return <tbody className={className} {...props} />;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
	hover?: boolean;
}

export function TableRow({
	className = '',
	hover = true,
	...props
}: TableRowProps) {
	return (
		<tr
			className={`border-b border-border transition-colors duration-150 ease-out ${
				hover ? 'hover:bg-bg-elevated' : ''
			} ${className}`}
			{...props}
		/>
	);
}

export interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {}

export function TableHead({
	className = '',
	children,
	...props
}: TableHeadProps) {
	return (
		<th
			className={`px-4 py-3 text-left text-xs font-semibold text-text-secondary uppercase tracking-wider ${className}`}
			{...props}
		>
			{children}
		</th>
	);
}

export interface TableCellProps
	extends TdHTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ className = '', ...props }: TableCellProps) {
	return (
		<td
			className={`px-4 py-3 text-sm text-text-primary ${className}`}
			{...props}
		/>
	);
}
