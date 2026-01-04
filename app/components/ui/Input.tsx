import type { InputHTMLAttributes, Ref } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	helperText?: string;
	ref?: Ref<HTMLInputElement>;
}

export function Input({
	className = '',
	label,
	error,
	helperText,
	id,
	ref,
	...props
}: InputProps) {
	const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={inputId}
					className="block text-sm font-medium text-text-primary mb-1.5"
				>
					{label}
				</label>
			)}
			<input
				ref={ref}
				id={inputId}
				className={`w-full h-10 px-3 bg-bg-surface border border-border rounded-md text-text-primary placeholder:text-text-tertiary transition-all duration-100 ease-out focus:outline-none focus:ring-2 focus:ring-border-focus focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${error ? 'border-negative focus:ring-negative' : ''} ${className}`}
				{...props}
			/>
			{error && <p className="mt-1.5 text-xs text-negative">{error}</p>}
			{helperText && !error && (
				<p className="mt-1.5 text-xs text-text-secondary">{helperText}</p>
			)}
		</div>
	);
}
