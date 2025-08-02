<script lang="ts">
	import { page } from '$app/state';
	import Footer from '../../components/layout/Footer.svelte';
	import Header from '../../components/layout/Header.svelte';

	let { children } = $props();
</script>

<div class="layout">
	<Header />
	<main class="main" class:active={page.url.pathname === '/'}>
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
		.main {
			&.active {
				position: relative;
				top: -80px;
			}
		}
	}
</style>
