<script lang="ts">
	import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
	import "../app.scss";
	let { children } = $props();

	const queryClient = new QueryClient();
</script>

<svelte:head>
	<!-- Основные теги -->
	<title>KinoDev - Смотреть фильмы онлайн</title>
	<meta
		name="description"
		content="Смотрите лучшие фильмы и сериалы онлайн в HD качестве на KinoDev. Большая коллекция новинок кино, популярных фильмов и сериалов."
	/>
	<meta
		name="keywords"
		content="фильмы онлайн, сериалы онлайн, смотреть фильмы, кино онлайн, KinoDev"
	/>
	<meta name="robots" content="index, follow" />

	<!-- Open Graph теги -->
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content="KinoDev" />
	<meta property="og:title" content="KinoDev - Кино и сериалы онлайн" />
	<meta
		property="og:description"
		content="Смотрите лучшие фильмы и сериалы онлайн в HD качестве на KinoDev. Большая коллекция новинок кино, популярных фильмов и сериалов."
	/>
	<meta property="og:image" content="/og-bg.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />

	<!-- Twitter теги -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="KinoDev - Фильмы и сериалы онлайн" />
	<meta
		name="twitter:description"
		content="Смотрите лучшие фильмы и сериалы в HD качестве"
	/>
	<meta name="twitter:image" content="/og-bg.png" />
</svelte:head>

<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
