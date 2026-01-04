import type { HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
	variant?: 'default' | 'positive' | 'negative' | 'warning' | 'info';
	size?: 'sm' | 'md';
}

export function Badge({
	className = '',
	variant = 'default',
	size = 'sm',
	children,
	...props
}: BadgeProps) {
	const baseStyles =
		'inline-flex items-center justify-center rounded-md font-medium';

	const variantStyles = {
		default: 'bg-bg-elevated text-text-primary border border-border',
		positive: 'bg-positive/10 text-positive border border-positive/20',
		negative: 'bg-negative/10 text-negative border border-negative/20',
		warning: 'bg-warning/10 text-warning border border-warning/20',
		info: 'bg-info/10 text-info border border-info/20',
	};

	const sizeStyles = {
		sm: 'px-2 py-0.5 text-xs',
		md: 'px-3 py-1 text-sm',
	};

	return (
		<span
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
			{...props}
		>
			{children}
		</span>
	);
}
