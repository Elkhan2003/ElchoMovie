<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Типы
	type ApiRequestData = {
		[key: string]: any;
	};

	type ApiResponse = {
		[key: string]: any;
	};

	type RequestResult = {
		index: number;
		status: number;
		statusText: string;
		data: ApiRequestData;
		response: ApiResponse | string | null;
		error: string | null;
		timestamp: string;
	};

	// Состояние компонента
	let apiUrl: string = '';
	let bearerToken: string = '';
	let jsonData: string = '';
	let parsedData: ApiRequestData[] = [];
	let isRunning: boolean = false;
	let results: RequestResult[] = [];
	let currentIndex: number = 0;
	let delay: number = 500; // задержка между запросами в мс

	// Загрузка токена из localStorage при монтировании
	onMount((): void => {
		if (browser) {
			const savedToken: string | null = localStorage.getItem('bearerToken');
			const savedApiUrl: string | null = localStorage.getItem('apiUrl');
			if (savedToken) bearerToken = savedToken;
			if (savedApiUrl) apiUrl = savedApiUrl;
		}
	});

	// Сохранение токена в localStorage
	function saveToken(): void {
		if (browser) {
			localStorage.setItem('bearerToken', bearerToken);
			localStorage.setItem('apiUrl', apiUrl);
		}
	}

	// Парсинг JSON данных
	function parseJsonData(): void {
		try {
			const parsed: unknown = JSON.parse(jsonData);

			if (!Array.isArray(parsed)) {
				throw new Error('Данные должны быть массивом объектов');
			}

			// Проверяем, что все элементы массива - объекты
			if (
				!parsed.every(
					(item: unknown): item is ApiRequestData =>
						typeof item === 'object' && item !== null
				)
			) {
				throw new Error('Все элементы массива должны быть объектами');
			}

			parsedData = parsed;
			results = [];
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Неизвестная ошибка';
			alert('Ошибка парсинга JSON: ' + errorMessage);
		}
	}

	// Отправка одного запроса
	async function sendRequest(
		data: ApiRequestData,
		index: number
	): Promise<RequestResult> {
		try {
			const response: Response = await fetch(apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${bearerToken}`
				},
				body: JSON.stringify(data)
			});

			const result: RequestResult = {
				index: index + 1,
				status: response.status,
				statusText: response.statusText,
				data: data,
				response: null,
				error: null,
				timestamp: new Date().toLocaleTimeString()
			};

			if (response.ok) {
				try {
					result.response = (await response.json()) as ApiResponse;
				} catch {
					result.response = await response.text();
				}
			} else {
				result.error = `HTTP ${response.status}: ${response.statusText}`;
			}

			return result;
		} catch (error: unknown) {
			const errorMessage =
				error instanceof Error ? error.message : 'Неизвестная ошибка';

			return {
				index: index + 1,
				status: 0,
				statusText: 'Network Error',
				data: data,
				response: null,
				error: errorMessage,
				timestamp: new Date().toLocaleTimeString()
			};
		}
	}

	// Запуск массовой отправки
	async function runBulkSend(): Promise<void> {
		if (!apiUrl || !bearerToken || parsedData.length === 0) {
			alert('Заполните все поля и добавьте данные');
			return;
		}

		isRunning = true;
		results = [];
		currentIndex = 0;
		saveToken();

		for (let i = 0; i < parsedData.length; i++) {
			currentIndex = i;

			const result: RequestResult = await sendRequest(parsedData[i], i);
			results = [...results, result];

			// Задержка между запросами
			if (i < parsedData.length - 1 && delay > 0) {
				await new Promise<void>((resolve) => setTimeout(resolve, delay));
			}
		}

		isRunning = false;
		currentIndex = 0;
	}

	// Очистка результатов
	function clearResults(): void {
		results = [];
	}

	// Пример данных
	function loadExampleData(): void {
		const exampleData: ApiRequestData[] = [
			{
				firstName: 'Иван',
				lastName: 'Иванов',
				email: 'ivan@example.com',
				age: 25
			},
			{
				firstName: 'Мария',
				lastName: 'Петрова',
				email: 'maria@example.com',
				age: 30
			},
			{
				firstName: 'Алексей',
				lastName: 'Сидоров',
				email: 'alex@example.com',
				age: 28
			}
		];

		jsonData = JSON.stringify(exampleData, null, 2);
		parseJsonData();
	}

	// Реактивные переменные с типизацией
	$: successCount = results.filter(
		(r: RequestResult): boolean => r.status >= 200 && r.status < 300
	).length;
	$: errorCount = results.filter(
		(r: RequestResult): boolean => r.status < 200 || r.status >= 300
	).length;
</script>

<svelte:head>
	<title>API Bulk Sender</title>
</svelte:head>

<div class="container">
	<header>
		<h1>🚀 API Bulk Sender</h1>
		<p>Массовая отправка POST запросов с данными</p>
	</header>

	<div class="config-section">
		<h2>⚙️ Настройки API</h2>

		<div class="form-group">
			<label for="apiUrl">API URL:</label>
			<input
				id="apiUrl"
				type="url"
				bind:value={apiUrl}
				placeholder="https://api.example.com/endpoint"
				disabled={isRunning}
			/>
		</div>

		<div class="form-group">
			<label for="bearerToken">Bearer Token:</label>
			<input
				id="bearerToken"
				type="password"
				bind:value={bearerToken}
				placeholder="your-api-token-here"
				disabled={isRunning}
			/>
		</div>

		<div class="form-group">
			<label for="delay">Задержка между запросами (мс):</label>
			<input
				id="delay"
				type="number"
				bind:value={delay}
				min="0"
				max="5000"
				step="100"
				disabled={isRunning}
			/>
		</div>
	</div>

	<div class="data-section">
		<h2>📄 Данные для отправки</h2>

		<div class="form-group">
			<label for="jsonData">JSON массив объектов:</label>
			<textarea
				id="jsonData"
				bind:value={jsonData}
				placeholder="[&#123;&#125;, &#123;&#125;, &#123;&#125;]"
				rows="10"
				disabled={isRunning}
			></textarea>
		</div>

		<div class="button-group">
			<button on:click={parseJsonData} disabled={isRunning}>
				📝 Парсить данные
			</button>
			<button on:click={loadExampleData} disabled={isRunning}>
				💡 Загрузить пример
			</button>
		</div>

		{#if parsedData.length > 0}
			<div class="data-preview">
				<p>
					<strong>✅ Готово к отправке:</strong>
					{parsedData.length} объектов
				</p>
			</div>
		{/if}
	</div>

	<div class="control-section">
		<h2>🎮 Управление</h2>

		<div class="button-group">
			<button
				class="run-button"
				on:click={runBulkSend}
				disabled={isRunning ||
					!apiUrl ||
					!bearerToken ||
					parsedData.length === 0}
			>
				{#if isRunning}
					⏳ Выполняется... ({currentIndex + 1}/{parsedData.length})
				{:else}
					🚀 Запустить отправку
				{/if}
			</button>

			{#if results.length > 0}
				<button on:click={clearResults} disabled={isRunning}>
					🗑️ Очистить результаты
				</button>
			{/if}
		</div>
	</div>

	{#if results.length > 0}
		<div class="results-section">
			<h2>📊 Результаты</h2>

			<div class="stats">
				<div class="stat success">
					<span class="stat-value">{successCount}</span>
					<span class="stat-label">Успешно</span>
				</div>
				<div class="stat error">
					<span class="stat-value">{errorCount}</span>
					<span class="stat-label">Ошибок</span>
				</div>
				<div class="stat total">
					<span class="stat-value">{results.length}</span>
					<span class="stat-label">Всего</span>
				</div>
			</div>

			<div class="results-list">
				{#each results as result}
					<div
						class="result-item"
						class:success={result.status >= 200 && result.status < 300}
						class:error={result.status < 200 || result.status >= 300}
					>
						<div class="result-header">
							<span class="result-index">#{result.index}</span>
							<span
								class="result-status"
								class:success={result.status >= 200 && result.status < 300}
								class:error={result.status < 200 || result.status >= 300}
							>
								{result.status}
								{result.statusText}
							</span>
							<span class="result-time">{result.timestamp}</span>
						</div>

						<details>
							<summary>Детали запроса</summary>
							<div class="result-details">
								<div class="result-data">
									<h4>📤 Отправленные данные:</h4>
									<pre>{JSON.stringify(result.data, null, 2)}</pre>
								</div>

								{#if result.response}
									<div class="result-response">
										<h4>📥 Ответ сервера:</h4>
										<pre>{typeof result.response === 'string'
												? result.response
												: JSON.stringify(result.response, null, 2)}</pre>
									</div>
								{/if}

								{#if result.error}
									<div class="result-error">
										<h4>❌ Ошибка:</h4>
										<pre>{result.error}</pre>
									</div>
								{/if}
							</div>
						</details>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			sans-serif;
	}

	header {
		text-align: center;
		margin-bottom: 3rem;
	}

	header h1 {
		color: #2563eb;
		margin-bottom: 0.5rem;
	}

	header p {
		color: #6b7280;
		font-size: 1.1rem;
	}

	.config-section,
	.data-section,
	.control-section,
	.results-section {
		background: white;
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 2rem;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
	}

	h2 {
		color: #1f2937;
		margin-bottom: 1.5rem;
		font-size: 1.5rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #374151;
	}

	input,
	textarea {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	input:focus,
	textarea:focus {
		outline: none;
		border-color: #2563eb;
	}

	input:disabled,
	textarea:disabled {
		background-color: #f9fafb;
		cursor: not-allowed;
	}

	textarea {
		font-family: 'Monaco', 'Menlo', monospace;
		resize: vertical;
	}

	.button-group {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
	}

	button {
		padding: 0.75rem 1.5rem;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	button:not(.run-button) {
		background-color: #f3f4f6;
		color: #374151;
	}

	button:not(.run-button):hover:not(:disabled) {
		background-color: #e5e7eb;
	}

	.run-button {
		background-color: #2563eb;
		color: white;
		font-size: 1.1rem;
		padding: 1rem 2rem;
	}

	.run-button:hover:not(:disabled) {
		background-color: #1d4ed8;
	}

	button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.data-preview {
		padding: 1rem;
		background-color: #ecfdf5;
		border: 2px solid #10b981;
		border-radius: 8px;
		color: #065f46;
	}

	.stats {
		display: flex;
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.stat {
		flex: 1;
		text-align: center;
		padding: 1.5rem;
		border-radius: 8px;
	}

	.stat.success {
		background-color: #ecfdf5;
		color: #065f46;
	}

	.stat.error {
		background-color: #fef2f2;
		color: #991b1b;
	}

	.stat.total {
		background-color: #f0f9ff;
		color: #0c4a6e;
	}

	.stat-value {
		display: block;
		font-size: 2rem;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.results-list {
		max-height: 600px;
		overflow-y: auto;
	}

	.result-item {
		border: 2px solid #e5e7eb;
		border-radius: 8px;
		margin-bottom: 1rem;
		overflow: hidden;
	}

	.result-item.success {
		border-color: #10b981;
	}

	.result-item.error {
		border-color: #ef4444;
	}

	.result-header {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem;
		background-color: #f9fafb;
	}

	.result-item.success .result-header {
		background-color: #ecfdf5;
	}

	.result-item.error .result-header {
		background-color: #fef2f2;
	}

	.result-index {
		font-weight: bold;
		color: #6b7280;
	}

	.result-status {
		font-weight: 600;
	}

	.result-status.success {
		color: #059669;
	}

	.result-status.error {
		color: #dc2626;
	}

	.result-time {
		margin-left: auto;
		color: #6b7280;
		font-size: 0.9rem;
	}

	.result-details {
		padding: 1rem;
	}

	.result-details h4 {
		margin: 1rem 0 0.5rem 0;
		color: #374151;
	}

	pre {
		background-color: #f8fafc;
		padding: 1rem;
		border-radius: 6px;
		overflow-x: auto;
		font-size: 0.9rem;
		max-height: 200px;
		overflow-y: auto;
	}

	details summary {
		cursor: pointer;
		padding: 1rem;
		background-color: #f9fafb;
		border-top: 1px solid #e5e7eb;
		font-weight: 600;
	}

	details[open] summary {
		border-bottom: 1px solid #e5e7eb;
	}

	@media (max-width: 768px) {
		.container {
			padding: 1rem;
		}

		.stats {
			flex-direction: column;
		}

		.button-group {
			flex-direction: column;
		}

		button {
			width: 100%;
		}
	}
</style>
