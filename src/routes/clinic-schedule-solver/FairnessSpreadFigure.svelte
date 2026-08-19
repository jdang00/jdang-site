<script lang="ts">
	const N = 27;
	const rep = (n: number, v: number) => Array<number>(n).fill(v);

	type View = {
		key: string;
		tab: string;
		name: string;
		unit: string;
		/** Real per-student counts from the published Fall 2026 run. */
		counts: number[];
		verdict: string;
	};

	const views: View[] = [
		{
			key: 'CL',
			tab: 'CL',
			name: 'Contact Lens',
			unit: 'assignments',
			counts: [...rep(14, 6), ...rep(13, 7)],
			verdict: 'A gap of one is the smallest this division allows, and the schedule sits on it.'
		},
		{
			key: 'VT',
			tab: 'VT',
			name: 'Vision Therapy',
			unit: 'assignments',
			counts: [...rep(19, 4), ...rep(8, 5)],
			verdict:
				'Same story with different numbers: 116 will not split 27 ways, so eight students carry a fifth.'
		},
		{
			key: 'REP',
			tab: 'REP',
			name: 'Rural Eye Program',
			unit: 'turns',
			counts: [...rep(9, 2), ...rep(18, 3)],
			verdict:
				'A rural turn is a full day away, so REP is counted in turns rather than half-days. Seventy-two will not split 27 ways either.'
		},
		{
			key: 'BP',
			tab: 'BP',
			name: 'Boards Prep, raw',
			unit: 'assignments',
			counts: [5, 7, ...rep(17, 10), ...rep(8, 11)],
			verdict:
				'The one code that does divide evenly, and the one that misses. Both low counts belong to students with fixed TA duty, whose residual time is already spoken for.'
		},
		{
			key: 'BPTA',
			tab: 'BP + TA',
			name: 'Boards Prep counted with TA',
			unit: 'assignments',
			counts: [...rep(19, 10), ...rep(8, 11)],
			verdict:
				'Counting that TA duty as residual workload restores the floor: 278 leaves eight over, and eight students carry the extra half-day.'
		}
	];

	let view = $state(views[0]);

	const sorted = $derived([...view.counts].sort((a, b) => a - b));
	const total = $derived(sorted.reduce((a, b) => a + b, 0));
	const base = $derived(Math.floor(total / N));
	const over = $derived(total - N * base);

	const floorGap = $derived(over === 0 ? 0 : 1);
	const gap = $derived(sorted[N - 1] - sorted[0]);
	const onFloor = $derived(gap === floorGap);
</script>

<figure class="fair-figure">
	<div class="frame">
		<div class="switch" role="group" aria-label="Choose an experience to measure">
			{#each views as v (v.key)}
				<button
					type="button"
					class:active={view.key === v.key}
					aria-pressed={view.key === v.key}
					onclick={() => (view = v)}>{v.tab}</button
				>
			{/each}
			<span class="name">{view.name}</span>
		</div>

		<div class="equation">
			<span class="term"><b>{total}</b><i>{view.unit}</i></span>
			<span class="op">=</span>
			<span class="term"><b>{N}</b><i>students</i></span>
			<span class="op">×</span>
			<span class="term"><b>{base}</b><i>each</i></span>
			<span class="op">+</span>
			<span class="term rem"><b>{over}</b><i>left over</i></span>
		</div>

		<div class="students" aria-label="One box per student, showing their count">
			{#each sorted as n, i (i)}
				<span
					class="box"
					class:up={n > base}
					class:down={n < base}
					style="transition-delay: {i * 14}ms">{n}</span
				>
			{/each}
		</div>

		<p class="verdict" class:missed={!onFloor}>{view.verdict}</p>
	</div>

	<figcaption>
		One box per student. Whole assignments cannot be split, so a remainder forces some students to
		carry one more than the rest.
	</figcaption>
</figure>

<style>
	.fair-figure {
		margin: 2rem 0 0.5rem;
	}

	.frame {
		padding: 1.75rem;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		background: var(--card);
	}

	.switch {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		align-items: center;
		margin-bottom: 2rem;
	}

	.switch button {
		padding: 0.35rem 0.75rem;
		border: 1px solid var(--border);
		border-radius: 0.4rem;
		background: transparent;
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.72rem;
		cursor: pointer;
		transition:
			color 140ms ease,
			border-color 140ms ease;
	}

	.switch button:hover {
		color: var(--foreground);
	}

	.switch button.active {
		border-color: color-mix(in oklab, var(--primary) 55%, var(--border));
		color: var(--foreground);
	}

	.switch button:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	.name {
		margin-left: 0.35rem;
		color: var(--muted-foreground);
		font-size: 0.8rem;
	}

	.equation {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem 0.9rem;
		align-items: baseline;
		margin-bottom: 2rem;
	}

	.term {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		align-items: center;
	}

	.term b {
		color: var(--foreground);
		font-family: 'Geist Mono', monospace;
		font-size: clamp(1.6rem, 5vw, 2.15rem);
		font-weight: 500;
		font-variant-numeric: tabular-nums;
		letter-spacing: -0.02em;
		line-height: 1;
	}

	.term i {
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.63rem;
		font-style: normal;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.term.rem b,
	.term.rem i {
		color: var(--primary);
	}

	.op {
		color: color-mix(in oklab, var(--muted-foreground) 70%, transparent);
		font-family: 'Geist Mono', monospace;
		font-size: 1.15rem;
		transform: translateY(-0.62rem);
	}

	.students {
		display: grid;
		grid-template-columns: repeat(9, 1fr);
		gap: 0.4rem;
	}

	.box {
		display: grid;
		aspect-ratio: 1.35;
		place-items: center;
		border: 1px solid var(--border);
		border-radius: 0.4rem;
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.92rem;
		font-variant-numeric: tabular-nums;
		transition:
			background-color 240ms ease,
			border-color 240ms ease,
			color 240ms ease;
	}

	.box.up {
		border-color: color-mix(in oklab, var(--primary) 60%, var(--border));
		background: color-mix(in oklab, var(--primary) 13%, var(--card));
		color: color-mix(in oklab, var(--primary) 45%, var(--foreground));
	}

	.box.down {
		border-color: color-mix(in oklab, #c05a4b 70%, var(--border));
		background: color-mix(in oklab, #c05a4b 20%, var(--card));
		color: color-mix(in oklab, #c05a4b 55%, var(--foreground));
	}

	.verdict {
		max-width: 62ch;
		margin: 1.9rem 0 0;
		padding-top: 1.15rem;
		border-top: 1px solid var(--border);
		color: var(--muted-foreground);
		font-size: 0.83rem;
		line-height: 1.55;
	}

	figcaption {
		max-width: 640px;
		margin: 1rem auto 0;
		color: var(--muted-foreground);
		font-size: 0.85rem;
		line-height: 1.55;
		text-align: center;
	}

	@media (max-width: 640px) {
		.frame {
			padding: 1.1rem;
		}

		.equation {
			gap: 0.5rem 0.65rem;
			margin-bottom: 1.6rem;
		}

		.term i {
			font-size: 0.56rem;
			letter-spacing: 0.06em;
		}

		.op {
			font-size: 1rem;
		}

		.students {
			gap: 0.28rem;
		}

		.box {
			border-radius: 0.3rem;
			font-size: 0.78rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.box {
			transition: none;
		}
	}
</style>
