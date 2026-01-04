import type { ButtonHTMLAttributes, Ref } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'secondary' | 'ghost';
	size?: 'sm' | 'md' | 'lg';
	fullWidth?: boolean;
	ref?: Ref<HTMLButtonElement>;
}

export function Button({
	className = '',
	variant = 'primary',
	size = 'md',
	fullWidth = false,
	children,
	ref,
	...props
}: ButtonProps) {
	const baseStyles =
		'inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-main disabled:opacity-50 disabled:cursor-not-allowed';

	const variantStyles = {
		primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary',
		secondary:
			'bg-transparent border border-border text-text-primary hover:bg-bg-elevated hover:border-border-hover focus:ring-primary',
		ghost:
			'bg-transparent text-text-primary hover:bg-bg-elevated focus:ring-primary',
	};

	const sizeStyles = {
		sm: 'h-8 px-3 text-sm',
		md: 'h-10 px-4 text-sm',
		lg: 'h-12 px-6 text-base',
	};

	const widthStyle = fullWidth ? 'w-full' : '';

	return (
		<button
			ref={ref}
			className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}
