import { Store } from '@tanstack/svelte-store';

const counterStore = new Store({
	count: 0
});

const increment = () => {
	const current = counterStore.state.count;
	counterStore.setState({ count: current + 1 });
};

const decrement = () => {
	const current = counterStore.state.count;
	counterStore.setState({ count: current - 1 });
};

const reset = () => {
	counterStore.setState({ count: 0 });
};

export { counterStore, increment, decrement, reset };
