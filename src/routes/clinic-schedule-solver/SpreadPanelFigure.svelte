<script lang="ts">
	import { onDestroy } from 'svelte';
	import {
		clinicDistributionStudents,
		type ClinicDistributionCode
	} from './clinic-distribution-students';

	type Code = {
		code: ClinicDistributionCode;
		name: string;
		counts: number[];
		/** Smallest gap this code's arithmetic permits. */
		floor: number;
	};

	const codeDefinitions: readonly Omit<Code, 'counts'>[] = [
		{ code: 'BP', name: 'Boards Prep', floor: 0 },
		{ code: 'REP', name: 'Rural Eye Program', floor: 2 },
		{ code: '1G', name: 'Adult Primary Care', floor: 1 },
		{ code: '2G', name: 'Pediatrics', floor: 1 },
		{ code: 'CL', name: 'Contact Lens', floor: 1 },
		{ code: 'VT', name: 'Vision Therapy', floor: 1 },
		{ code: 'PC', name: 'Primary Care', floor: 1 },
		{ code: 'GLA', name: 'Glaucoma', floor: 1 },
		{ code: 'DRY', name: 'Dry Eye', floor: 1 },
		{ code: 'WI', name: 'Walk-In', floor: 1 },
		{ code: 'WIS', name: 'Walk-In Short', floor: 1 },
		{ code: 'DD', name: 'Duty Doctor, CNOHC', floor: 1 },
		{ code: 'OD', name: 'Duty Doctor, NSU', floor: 1 },
		{ code: 'DS', name: 'Dispensary, CNOHC', floor: 1 },
		{ code: 'DSN', name: 'Dispensary, NSU', floor: 1 },
		{ code: 'SF', name: 'Spectacle Fabrication', floor: 1 },
		{ code: 'OC', name: 'On Call', floor: 1 },
		{ code: 'RPA', name: 'RPA', floor: 1 }
	];

	// Every count comes from the final Fall 2026 ClinicHub schedule. Keeping the
	// roster and count vectors together makes each portrait follow the same person
	// as the selected experience changes.
	const codes: Code[] = codeDefinitions.map((definition) => ({
		...definition,
		counts: clinicDistributionStudents.map((student) => student.counts[definition.code])
	}));

	const summary = codes.map((c) => {
		const hi = Math.max(...c.counts);
		const lo = Math.min(...c.counts);
		return { ...c, lo, hi, gap: hi - lo, onFloor: hi - lo === c.floor };
	});

	const atFloor = summary.filter((c) => c.onFloor).length;
	const N = clinicDistributionStudents.length;

	let selected = $state(summary.find((c) => c.code === 'CL')!);
	let previewed = $state<(typeof summary)[number] | null>(null);
	const active = $derived(previewed ?? selected);

	// A brief settle, so brushing past an entry on the way to another one does
	// not restart every transition.
	let hoverTimer: ReturnType<typeof setTimeout>;
	function preview(c: (typeof summary)[number]) {
		clearTimeout(hoverTimer);
		hoverTimer = setTimeout(() => (previewed = c), 260);
	}
	function clearPreview() {
		clearTimeout(hoverTimer);
		previewed = null;
	}
	function pick(c: (typeof summary)[number]) {
		clearTimeout(hoverTimer);
		selected = c;
		previewed = null;
	}
	onDestroy(() => clearTimeout(hoverTimer));

	// Measured so every position can be driven by transform alone; animating
	// `left` would relayout 27 elements on every frame of the transition.
	let width = $state(0);

	// The most blocks any code splits into, so a portrait is sized once and never
	// resizes mid-transition.
	const MOST_GROUPS = Math.max(...codes.map((c) => new Set(c.counts).size));

	const GAP = 6;

	// Blocks grow sideways, never taller, so the plot height is constant and
	// nothing below it ever shifts while you move through the list.
	const rows = $derived(width > 0 && width < 640 ? 9 : 7);
	const maxCols = $derived(Math.ceil(N / rows));

	const size = $derived(
		width === 0 ? 0 : Math.max(18, Math.min(54, width / MOST_GROUPS / maxCols - 9))
	);
	const pitch = $derived(size + GAP);
	const plotHeight = $derived((rows - 1) * pitch + size);

	// Each distinct count becomes a block of students, filled column by column so
	// every block reaches the same height and only its width reports the tally.
	const chart = $derived.by(() => {
		const buckets = new Map<number, number[]>();
		active.counts.forEach((v, s) => {
			if (!buckets.has(v)) buckets.set(v, []);
			buckets.get(v)!.push(s);
		});
		const values = [...buckets.keys()].sort((a, b) => a - b);
		const cell = width / values.length;

		const seats = new Array<{ s: number; x: number; y: number }>(N);
		const groups: { v: number; n: number; cx: number }[] = [];

		values.forEach((v, i) => {
			const members = buckets.get(v)!;
			const cols = Math.ceil(members.length / rows);
			const cx = (i + 0.5) * cell;
			members.forEach((s, j) => {
				const col = Math.floor(j / rows);
				seats[s] = {
					s,
					x: cx + (col - (cols - 1) / 2) * pitch - size / 2,
					y: -(j % rows) * pitch
				};
			});
			groups.push({ v, n: members.length, cx });
		});

		return { seats, groups };
	});
</script>

<figure class="panel-figure">
	<div class="frame">
		<div class="top">
			<p class="headline">
				<b>{atFloor} of {summary.length}</b> experiences in the final published schedule landed on the
				smallest gap their arithmetic allows.
			</p>
			<div class="now">
				<span class="who">{active.name}<em>{active.code}</em></span>
				<span class="reading" class:missed={!active.onFloor}>
					{active.lo}–{active.hi} · gap {active.gap}
				</span>
			</div>
		</div>

		<div class="stage" bind:clientWidth={width}>
			<div class="columns" class:ready={width > 0} style="--size: {size}px; height: {plotHeight}px">
				{#each chart.seats as seat (seat.s)}
					<span
						class="who-dot"
						style="transform: translate({seat.x}px, {seat.y}px); transition-delay: {seat.s * 4}ms"
						title="{clinicDistributionStudents[seat.s].name}: {active.counts[
							seat.s
						]} {active.code} assignments"
						aria-label="{clinicDistributionStudents[seat.s].name}: {active.counts[
							seat.s
						]} {active.name} assignments"
					>
						<img src={clinicDistributionStudents[seat.s].image} alt="" loading="lazy" />
					</span>
				{/each}
			</div>

			<div class="axis">
				{#each chart.groups as col, i (i)}
					<span class="val" style="transform: translateX({col.cx}px)">
						<b>{col.v}</b>
						<em>{col.n}</em>
					</span>
				{/each}
			</div>
		</div>

		<div
			class="picker"
			role="group"
			aria-label="Choose an experience; hover previews and click selects"
			onmouseleave={clearPreview}
		>
			{#each summary as c (c.code)}
				<button
					type="button"
					class:on={selected.code === c.code}
					class:preview={previewed?.code === c.code}
					class:missed={!c.onFloor}
					aria-pressed={selected.code === c.code}
					onmouseenter={() => preview(c)}
					onmousemove={() => preview(c)}
					onclick={() => pick(c)}
				>
					<span>{c.name}</span>
					<b>{c.gap}</b>
				</button>
			{/each}
		</div>
	</div>

	<figcaption>
		All 27 consenting students, matched to their final Fall 2026 ClinicHub assignments. Each block
		gathers the people who received the same number, so its size shows how many landed there. Hover
		to preview an experience; click or tap to keep it selected. The published schedule includes
		faculty adjustments after the solver candidate, so several ranges are wider than the arithmetic
		floor.
	</figcaption>
</figure>

<style>
	.panel-figure {
		width: min(1060px, calc(100vw - 2.5rem));
		margin: 2.25rem 50% 0.5rem;
		transform: translateX(-50%);
	}

	.frame {
		padding: 1.5rem 1.75rem 1.3rem;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		background: var(--card);
	}

	.top {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 2rem;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1.4rem;
	}

	.headline {
		max-width: 46ch;
		margin: 0;
		color: var(--muted-foreground);
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.headline b {
		color: var(--foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 1.15rem;
		font-weight: 500;
	}

	.now {
		display: flex;
		gap: 0.75rem;
		align-items: baseline;
	}

	.who {
		display: flex;
		gap: 0.45rem;
		align-items: baseline;
		color: var(--foreground);
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: -0.01em;
	}

	.who em {
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.68rem;
		font-style: normal;
		font-weight: 400;
		letter-spacing: 0.05em;
	}

	.reading {
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.74rem;
		font-variant-numeric: tabular-nums;
	}

	.reading.missed {
		color: #c05a4b;
	}

	.stage {
		position: relative;
	}

	.columns {
		position: relative;
	}

	.who-dot {
		position: absolute;
		bottom: 0;
		left: 0;
		display: grid;
		width: var(--size);
		height: var(--size);
		overflow: hidden;
		place-items: center;
		border: 1px solid color-mix(in oklab, var(--foreground) 18%, transparent);
		border-radius: 999px;
		background: color-mix(in oklab, var(--foreground) 8%, var(--card));
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: calc(var(--size) * 0.34);
		font-variant-numeric: tabular-nums;
		transition: transform 460ms cubic-bezier(0.25, 0.9, 0.3, 1);
		will-change: transform;
	}

	.who-dot img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.who-dot:hover {
		z-index: 2;
		border-color: color-mix(in oklab, var(--primary) 60%, var(--border));
		box-shadow: 0 0 0 2px var(--card);
	}

	.columns:not(.ready) .who-dot {
		opacity: 0;
		transition: none;
	}

	.axis {
		position: relative;
		height: 2.6rem;
		margin-top: 0.85rem;
		border-top: 1px solid var(--border);
	}

	.val {
		position: absolute;
		top: 0;
		left: 0;
		margin-top: 0.6rem;
		text-align: center;
		transition: transform 460ms cubic-bezier(0.25, 0.9, 0.3, 1);
		translate: -50% 0;
	}

	.val b {
		display: block;
		color: var(--foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 1.05rem;
		font-weight: 500;
		line-height: 1;
	}

	.val em {
		display: block;
		margin-top: 0.22rem;
		color: color-mix(in oklab, var(--muted-foreground) 75%, transparent);
		font-family: 'Geist Mono', monospace;
		font-size: 0.66rem;
		font-style: normal;
	}

	.picker {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(10.5rem, 1fr));
		gap: 0.05rem 0.6rem;
		margin-top: 1.2rem;
		padding-top: 0.95rem;
		border-top: 1px solid var(--border);
	}

	.picker button {
		display: flex;
		gap: 0.6rem;
		align-items: baseline;
		justify-content: space-between;
		padding: 0.26rem 0.45rem;
		border: 0;
		border-radius: 0.3rem;
		background: transparent;
		color: var(--muted-foreground);
		font-family: inherit;
		font-size: 0.77rem;
		text-align: left;
		cursor: pointer;
		transition:
			background-color 160ms ease,
			color 160ms ease;
	}

	.picker button b {
		color: color-mix(in oklab, var(--muted-foreground) 70%, transparent);
		font-family: 'Geist Mono', monospace;
		font-size: 0.7rem;
		font-weight: 500;
		font-variant-numeric: tabular-nums;
	}

	.picker button:hover,
	.picker button.preview {
		background: color-mix(in oklab, var(--foreground) 6%, transparent);
		color: var(--foreground);
	}

	.picker button.on {
		background: color-mix(in oklab, var(--foreground) 8%, transparent);
		color: var(--foreground);
	}

	.picker button.on b {
		color: var(--foreground);
	}

	.picker button.missed b {
		color: #c05a4b;
	}

	.picker button:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 1px;
	}

	figcaption {
		max-width: 640px;
		margin: 1rem auto 0;
		color: var(--muted-foreground);
		font-size: 0.85rem;
		line-height: 1.55;
		text-align: center;
	}

	@media (max-width: 900px) {
		.panel-figure {
			width: 100vw;
		}

		.frame {
			border-right: 0;
			border-left: 0;
			border-radius: 0;
		}

		figcaption {
			padding: 0 1.25rem;
		}
	}

	@media (max-width: 640px) {
		.frame {
			padding: 1.1rem 1.1rem 1rem;
		}

		.headline {
			font-size: 0.88rem;
		}

		.picker {
			grid-template-columns: repeat(2, 1fr);
			gap: 0 0.35rem;
		}

		.picker button {
			padding: 0.24rem 0.3rem;
			font-size: 0.72rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.who-dot,
		.val {
			transition: none;
		}
	}
</style>
