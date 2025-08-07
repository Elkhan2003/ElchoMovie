<script lang="ts">
	import ModalCounter from '../../../../components/dev/ModalCounter.svelte';

	let isOpenModalCounter = $state<boolean>(false);
</script>

<section class="Counter">
	<div class="container">
		<div class="content">
			<h1>Counter</h1>
			<input type="text" />
			<button onclick={() => (isOpenModalCounter = true)}>open</button>
			<ModalCounter
				isOpen={isOpenModalCounter}
				onClose={() => (isOpenModalCounter = false)}
			/>
		</div>
	</div>
</section>

<style lang="scss">
	.Counter {
		.content {
		}
	}
</style>
