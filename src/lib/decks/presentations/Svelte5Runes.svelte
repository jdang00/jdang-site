<script lang="ts">
	import Code from '$lib/deck/Code.svelte';
	import Notes from '$lib/deck/Notes.svelte';
	import Slide from '$lib/deck/Slide.svelte';
</script>

<!-- Slide 1: Title -->
<Slide class="place-content-center place-items-center">
	<div class="mx-auto flex h-full max-w-5xl flex-col justify-center gap-10 text-center">
		<div class="mx-auto max-w-4xl">
			<p class="text-sm uppercase tracking-[0.32em] text-orange-500">Svelte 5</p>
			<h1 class="mt-4 text-6xl text-slate-900 md:text-7xl">
				Runes, Reactivity, and the Death of the Store
			</h1>
			<p class="mt-6 text-xl text-slate-500">
				How Svelte replaced its compiler magic with explicit primitives — and why it matters for
				every component you write.
			</p>
		</div>

		<div class="flex flex-wrap justify-center gap-3">
			<span class="rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-600"
				>reactivity</span
			>
			<span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
				>signals</span
			>
			<span class="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
				>migration</span
			>
		</div>
	</div>

	<Notes>Open with: Svelte 5 shipped the biggest API change since Svelte 3.</Notes>
</Slide>

<!-- Slide 2: The Problem -->
<Slide id="problem" animate class="place-content-center place-items-center">
	<div class="mx-auto flex h-full max-w-4xl flex-col justify-center gap-4 text-center">
		<p class="text-sm uppercase tracking-[0.28em] text-slate-400">The problem</p>
		<h2 class="mt-3 text-5xl text-slate-900">Svelte 3/4 reactivity was implicit</h2>
		<p class="mx-auto mt-4 max-w-2xl text-xl text-slate-500">
			The compiler magically turned
			<code class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-base text-orange-600">let</code
			>
			into reactive state. It worked — until it didn't.
		</p>
	</div>
</Slide>

<Slide id="problem" animate class="place-content-center">
	<div class="mx-auto flex h-full max-w-6xl flex-col justify-center gap-8">
		<div class="text-center">
			<p class="text-sm uppercase tracking-[0.28em] text-red-400">The problem</p>
			<h2 class="mt-3 text-5xl text-slate-900">Svelte 3/4 reactivity was implicit</h2>
		</div>

		<div class="mt-6 grid gap-4 md:grid-cols-3">
			<div class="rounded-2xl border border-red-100 bg-red-50 p-5">
				<p class="font-mono text-sm text-red-400">01</p>
				<p class="mt-2 text-2xl font-semibold text-slate-800">
					Reactive logic trapped inside .svelte files
				</p>
			</div>
			<div class="rounded-2xl border border-red-100 bg-red-50 p-5">
				<p class="font-mono text-sm text-red-400">02</p>
				<p class="mt-2 text-2xl font-semibold text-slate-800">
					$: labels run on every dependency change
				</p>
			</div>
			<div class="rounded-2xl border border-red-100 bg-red-50 p-5">
				<p class="font-mono text-sm text-red-400">03</p>
				<p class="mt-2 text-2xl font-semibold text-slate-800">
					Stores are verbose for simple shared state
				</p>
			</div>
		</div>
	</div>

	<Notes>Let the audience feel the pain before showing the solution.</Notes>
</Slide>

<!-- Slide 3: $state code -->
<Slide class="place-content-center">
	<div class="mx-auto grid h-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1fr]">
		<div class="flex flex-col justify-center">
			<p class="text-sm uppercase tracking-[0.28em] text-orange-500">Rune 01</p>
			<h2 class="mt-3 text-5xl text-slate-900">$state</h2>
			<p class="mt-4 text-xl text-slate-500">
				Explicit, portable, works in .svelte and .svelte.ts files. Replaces implicit let reactivity.
			</p>
		</div>

		<div class="rounded-2xl bg-slate-900 p-6">
			<Code
				lang="ts"
				theme="poimandres"
				code={`
let count = $state(0);
let doubled = $derived(count * 2);

// works in .svelte.ts files too
export function createCounter() {
  let count = $state(0);
  return { get count() { return count } };
}
				`}
			/>
		</div>
	</div>
</Slide>

<!-- Slide 4: $derived and $effect -->
<Slide class="place-content-center">
	<div class="mx-auto grid h-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1fr]">
		<div class="rounded-2xl bg-slate-900 p-6">
			<Code
				lang="ts"
				theme="poimandres"
				code={`
// replaces $: label
let total = $derived(items.reduce((s, i) => s + i.price, 0));

// multi-line derivations
let summary = $derived.by(() => {
  const tax = total * 0.08;
  return { subtotal: total, tax, grand: total + tax };
});

// side effects with automatic cleanup
$effect(() => {
  document.title = 'Cart: ' + formatted;
  return () => console.log('cleanup');
});
				`}
			/>
		</div>

		<div class="flex flex-col justify-center">
			<p class="text-sm uppercase tracking-[0.28em] text-orange-500">Runes 02 and 03</p>
			<h2 class="mt-3 text-5xl text-slate-900">$derived and $effect</h2>
			<p class="mt-4 text-xl text-slate-500">
				$derived is pure computation. $effect is for side effects with automatic cleanup. No more
				guessing which $: does what.
			</p>
		</div>
	</div>

	<Notes>$derived is pure, $effect is impure. That is the entire mental model.</Notes>
</Slide>

<!-- Slide 5: $props before/after -->
<Slide class="place-content-center">
	<div class="mx-auto flex h-full max-w-6xl flex-col justify-center gap-8">
		<div class="max-w-3xl">
			<p class="text-sm uppercase tracking-[0.28em] text-orange-500">Rune 04</p>
			<h2 class="mt-3 text-5xl text-slate-900">$props</h2>
			<p class="mt-4 max-w-2xl text-xl text-slate-500">
				One destructure replaces export let. Defaults, rest props, and bindable values in one line.
			</p>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			<div class="rounded-2xl bg-slate-50 p-5">
				<p class="mb-3 font-mono text-xs uppercase tracking-wider text-red-400">svelte 4</p>
				<Code
					lang="ts"
					theme="poimandres"
					code={`
export let title: string;
export let count = 0;
export let onchange: (v: number) => void;
					`}
				/>
			</div>
			<div class="rounded-2xl bg-orange-50 p-5">
				<p class="mb-3 font-mono text-xs uppercase tracking-wider text-orange-500">svelte 5</p>
				<Code
					lang="ts"
					theme="poimandres"
					code={`
let {
  title,
  count = 0,
  onchange,
  ...rest
}: Props = $props();
					`}
				/>
			</div>
		</div>
	</div>
</Slide>

<!-- Slide 6: $bindable -->
<Slide class="place-content-center">
	<div class="mx-auto grid h-full max-w-6xl items-center gap-8 lg:grid-cols-[1fr_1fr]">
		<div class="flex flex-col justify-center">
			<p class="text-sm uppercase tracking-[0.28em] text-orange-500">Rune 05</p>
			<h2 class="mt-3 text-5xl text-slate-900">$bindable</h2>
			<p class="mt-4 text-xl text-slate-500">
				Two-way binding is opt-in now. Only props declared with $bindable can use bind: from the
				parent.
			</p>
		</div>

		<div class="rounded-2xl bg-slate-900 p-6">
			<Code
				lang="ts"
				theme="poimandres"
				code={`
// child component declares opt-in binding
let { value = $bindable('') }: Props = $props();

// parent can now two-way bind
// <Input bind:value={name} />
				`}
			/>
		</div>
	</div>
</Slide>

<!-- Slide 7: Migration cheat sheet -->
<Slide id="migration" animate class="place-content-center place-items-center">
	<div class="mx-auto flex h-full max-w-4xl flex-col justify-center gap-4 text-center">
		<p class="text-sm uppercase tracking-[0.28em] text-slate-400">Migration</p>
		<h2 class="mt-3 text-5xl text-slate-900">The cheat sheet</h2>
	</div>
</Slide>

<Slide id="migration" animate class="place-content-center">
	<div class="mx-auto flex h-full max-w-6xl flex-col justify-center gap-8">
		<div class="text-center">
			<p class="text-sm uppercase tracking-[0.28em] text-slate-400">Migration</p>
			<h2 class="mt-3 text-5xl text-slate-900">The cheat sheet</h2>
		</div>

		<div class="space-y-2">
			<div
				class="grid grid-cols-[1fr_auto_1fr_1.2fr] items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5"
			>
				<code class="font-mono text-sm text-red-400 line-through decoration-red-200">let x = 0</code
				>
				<span class="text-slate-300">→</span>
				<code class="font-mono text-sm text-orange-600">$state(0)</code>
				<span class="text-sm text-slate-400">reactive variable</span>
			</div>
			<div
				class="grid grid-cols-[1fr_auto_1fr_1.2fr] items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5"
			>
				<code class="font-mono text-sm text-red-400 line-through decoration-red-200"
					>$: doubled = x * 2</code
				>
				<span class="text-slate-300">→</span>
				<code class="font-mono text-sm text-orange-600">$derived(x * 2)</code>
				<span class="text-sm text-slate-400">computed value</span>
			</div>
			<div
				class="grid grid-cols-[1fr_auto_1fr_1.2fr] items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5"
			>
				<code class="font-mono text-sm text-red-400 line-through decoration-red-200"
					>$: sideEffect()</code
				>
				<span class="text-slate-300">→</span>
				<code class="font-mono text-sm text-orange-600">$effect(() => ...)</code>
				<span class="text-sm text-slate-400">side effect</span>
			</div>
			<div
				class="grid grid-cols-[1fr_auto_1fr_1.2fr] items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5"
			>
				<code class="font-mono text-sm text-red-400 line-through decoration-red-200"
					>export let prop</code
				>
				<span class="text-slate-300">→</span>
				<code class="font-mono text-sm text-orange-600">$props()</code>
				<span class="text-sm text-slate-400">component input</span>
			</div>
			<div
				class="grid grid-cols-[1fr_auto_1fr_1.2fr] items-center gap-3 rounded-xl bg-slate-50 px-4 py-2.5"
			>
				<code class="font-mono text-sm text-red-400 line-through decoration-red-200"
					>writable(0)</code
				>
				<span class="text-slate-300">→</span>
				<code class="font-mono text-sm text-orange-600">$state in .svelte.ts</code>
				<span class="text-sm text-slate-400">shared state</span>
			</div>
		</div>
	</div>
</Slide>

<!-- Slide 8: Closing -->
<Slide class="place-content-center">
	<div
		class="mx-auto flex h-full max-w-5xl flex-col justify-center rounded-2xl bg-linear-to-br from-orange-500 via-orange-400 to-amber-300 p-10 text-center text-white"
	>
		<p class="text-sm uppercase tracking-[0.3em] text-white/70">Takeaway</p>
		<h2 class="mt-4 text-6xl text-white">Explicit beats magic.</h2>
		<p class="mx-auto mt-6 max-w-3xl text-2xl text-white/90">
			Runes make Svelte reactivity portable, predictable, and TypeScript-native. The compiler still
			does the heavy lifting — you just tell it what is reactive now.
		</p>
		<p class="mt-8 font-mono text-base text-white/60">npx sv migrate svelte-5</p>
	</div>
</Slide>
