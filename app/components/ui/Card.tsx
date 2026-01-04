import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
	variant?: 'default' | 'elevated';
}

export function Card({
	className = '',
	variant = 'default',
	children,
	...props
}: CardProps) {
	const baseStyles =
		'rounded-lg border border-border bg-bg-surface transition-all duration-150 ease-out';

	const variantStyles = {
		default: '',
		elevated: 'hover:bg-bg-elevated hover:border-border-hover',
	};

	return (
		<div
			className={`${baseStyles} ${variantStyles[variant]} ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}

export function CardHeader({
	className = '',
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={`px-6 py-4 border-b border-border ${className}`}
			{...props}
		/>
	);
}

export function CardTitle({
	className = '',
	...props
}: HTMLAttributes<HTMLHeadingElement>) {
	return (
		<h3
			className={`text-lg font-semibold text-text-primary ${className}`}
			{...props}
		/>
	);
}

export function CardDescription({
	className = '',
	...props
}: HTMLAttributes<HTMLParagraphElement>) {
	return (
		<p className={`text-sm text-text-secondary mt-1 ${className}`} {...props} />
	);
}

export function CardContent({
	className = '',
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return <div className={`px-6 py-4 ${className}`} {...props} />;
}

export function CardFooter({
	className = '',
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={`px-6 py-4 border-t border-border ${className}`}
			{...props}
		/>
	);
}
