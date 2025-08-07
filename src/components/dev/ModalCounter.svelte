<script lang="ts">
	import Portal from 'svelte-portal';
	import { counterStore, increment, decrement } from '../../stores/counter';

	interface IModalCounterProps {
		isOpen: boolean;
		onClose: () => void;
	}

	const { isOpen, onClose }: IModalCounterProps = $props();
	let count = $state(0);

	$effect(() => {
		return counterStore.subscribe((state) => {
			count = state.currentVal.count;
		});
	});
</script>

<Portal target="body">
	<div class="ModalCounter" class:active={isOpen}>
		<div class="content">
			<button onclick={onClose}>close</button>
			<h2>Entity successfully updated!</h2>
			<h1>Count: {count}</h1>
			<button onclick={increment}>increment</button>
			<button onclick={decrement}>decrement</button>
		</div>
	</div>
</Portal>

<style lang="scss">
	.ModalCounter {
		position: fixed;
		left: 0;
		top: 0;
		z-index: 99999;
		width: 100%;
		height: 100dvh;
		backdrop-filter: blur(4px);
		visibility: hidden;
		opacity: 0;
		transition: 0.4s;
		&.active {
			visibility: visible;
			opacity: 1;
		}
		.content {
		}
	}
</style>
