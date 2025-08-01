<script lang="ts">
	import Footer from '../../components/layout/Footer.svelte';
	import Header from '../../components/layout/Header.svelte';

	let { children } = $props();
</script>

<div class="layout">
	<Header />
	<main>
		{@render children()}
	</main>
	<Footer />
</div>

<style lang="scss">
	.layout {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		min-height: 100vh;
		footer {
			margin-top: auto;
		}
	}
</style>
