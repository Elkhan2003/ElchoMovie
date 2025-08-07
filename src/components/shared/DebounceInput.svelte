<script lang="ts">
	interface Props {
		value?: string;
		delay?: number;
		placeholder?: string;
		disabled?: boolean;
		type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel';
		name?: string;
		id?: string;
		className?: string;
		shouldFocus?: boolean;
		oninput?: (value: string) => void;
		onkeydown?: (event: KeyboardEvent) => void;
		onfocus?: (event: FocusEvent) => void;
		onblur?: (event: FocusEvent) => void;
	}

	let {
		value = $bindable(''),
		delay = 750,
		placeholder = '',
		disabled = false,
		type = 'text',
		name = '',
		id = '',
		className = '',
		shouldFocus = false,
		oninput,
		onkeydown,
		onfocus,
		onblur
	}: Props = $props();

	let inputElement: HTMLInputElement;
	let timer: ReturnType<typeof setTimeout> | undefined = $state();

	$effect(() => {
		if (shouldFocus && inputElement) {
			setTimeout(() => {
				inputElement.focus();
			}, 150);
		}
	});

	const handleInput = (event: Event): void => {
		const target = event.target as HTMLInputElement;
		const newValue = target.value;
		clearTimeout(timer);
		timer = setTimeout(() => {
			value = newValue;
			oninput?.(newValue);
		}, delay);
	};
</script>

<input
	bind:this={inputElement}
	{value}
	oninput={handleInput}
	{onkeydown}
	{onfocus}
	{onblur}
	{placeholder}
	{disabled}
	{type}
	{name}
	{id}
	class={className}
/>
