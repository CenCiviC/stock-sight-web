import {
	createContext,
	type HTMLAttributes,
	useContext,
	useState,
} from 'react';

interface TabsContextValue {
	value: string;
	onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
	const context = useContext(TabsContext);
	if (!context) {
		throw new Error('Tabs components must be used within Tabs');
	}
	return context;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
	value?: string;
	onValueChange?: (value: string) => void;
	defaultValue?: string;
}

export function Tabs({
	value,
	onValueChange,
	defaultValue = '',
	className = '',
	children,
	...props
}: TabsProps) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const currentValue = value !== undefined ? value : internalValue;
	const handleValueChange =
		onValueChange || ((newValue: string) => setInternalValue(newValue));

	return (
		<TabsContext.Provider
			value={{ value: currentValue, onValueChange: handleValueChange }}
		>
			<div className={className} {...props}>
				{children}
			</div>
		</TabsContext.Provider>
	);
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

export function TabsList({
	className = '',
	children,
	...props
}: TabsListProps) {
	return (
		<div
			className={`inline-flex items-center gap-1 border-b border-border ${className}`}
			{...props}
		>
			{children}
		</div>
	);
}

export interface TabsTriggerProps
	extends Omit<HTMLAttributes<HTMLButtonElement>, 'onClick'> {
	value: string;
}

export function TabsTrigger({
	value,
	className = '',
	children,
	...props
}: TabsTriggerProps) {
	const { value: selectedValue, onValueChange } = useTabsContext();
	const isSelected = selectedValue === value;

	return (
		<button
			type="button"
			onClick={() => onValueChange(value)}
			className={`px-4 py-2 text-sm font-medium transition-all duration-150 ease-out border-b-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-main focus:ring-primary ${
				isSelected
					? 'text-primary border-primary'
					: 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
			} ${className}`}
			{...props}
		>
			{children}
		</button>
	);
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
	value: string;
}

export function TabsContent({
	value,
	className = '',
	children,
	...props
}: TabsContentProps) {
	const { value: selectedValue } = useTabsContext();
	if (selectedValue !== value) return null;

	return (
		<div className={`mt-4 ${className}`} {...props}>
			{children}
		</div>
	);
}
