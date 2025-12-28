import { Welcome } from '../welcome/welcome';
import type { Route } from './+types/home';

export function meta(_: Route.MetaArgs) {
	return [
		{ title: 'Stock Sight Web' },
		{ name: 'description', content: 'Stock Sight Web' },
	];
}

export default function Home() {
	return <Welcome />;
}
