import { index, type RouteConfig, route } from '@react-router/dev/routes';

export default [
	index('routes/home.tsx'),
	route('transactions', 'routes/transactions.tsx'),
	route('deposits', 'routes/deposits.tsx'),
] satisfies RouteConfig;
