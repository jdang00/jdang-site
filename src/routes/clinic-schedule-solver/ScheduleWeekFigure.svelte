<script lang="ts">
	import { onDestroy } from 'svelte';

	type Code = { id: string; long: string; short: string; tone: string };

	// Real Fall 2026 assignment codes.
	const codes: Code[] = [
		{ id: '1G', long: 'Adult Primary Care', short: '1G', tone: 'care' },
		{ id: '2G', long: 'Pediatrics', short: '2G', tone: 'peds' },
		{ id: 'VT', long: 'Vision Therapy', short: 'VT', tone: 'vt' },
		{ id: 'OD', long: 'Duty Doctor', short: 'OD', tone: 'duty' },
		{ id: 'BP', long: 'Boards Prep', short: 'BP', tone: 'prep' }
	];

	const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
	const halves = ['AM', 'PM'];

	// [AM row, PM row] as indices into `codes`.
	const start = [
		[0, 0, 1, 4, 0],
		[2, 2, 1, 4, 3]
	];

	let week = $state(start.map((row) => [...row]));
	let bumped = $state('');
	let touched = $state<string[]>([]);
	let slotTimer: ReturnType<typeof setTimeout>;
	let countTimer: ReturnType<typeof setTimeout>;

	function cycle(r: number, c: number, step: 1 | -1) {
		const from = codes[week[r][c]].id;
		week[r][c] = (week[r][c] + step + codes.length) % codes.length;
		const to = codes[week[r][c]].id;

		bumped = `${r}-${c}`;
		touched = [from, to];
		clearTimeout(slotTimer);
		clearTimeout(countTimer);
		slotTimer = setTimeout(() => (bumped = ''), 320);
		countTimer = setTimeout(() => (touched = []), 900);
	}

	function reset() {
		week = start.map((row) => [...row]);
		touched = [];
	}

	const tally = $derived.by(() => {
		const n = new Map<string, number>();
		for (const row of week) for (const c of row) n.set(codes[c].id, (n.get(codes[c].id) ?? 0) + 1);
		return codes.map((code) => ({ code, n: n.get(code.id) ?? 0 }));
	});

	onDestroy(() => {
		clearTimeout(slotTimer);
		clearTimeout(countTimer);
	});
</script>

<figure class="schedule-figure">
	<div class="frame">
		<table>
			<thead>
				<tr>
					<th scope="col"><span class="sr-only">Session</span></th>
					{#each days as day (day)}
						<th scope="col">{day}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each halves as half, r (half)}
					<tr>
						<th scope="row">{half}</th>
						{#each days as day, c (day)}
							<td>
								<button
									type="button"
									class="slot {codes[week[r][c]].tone}"
									class:bumped={bumped === `${r}-${c}`}
									aria-label="{day} {half}: {codes[week[r][c]].long}. Change clinic."
									onclick={(e) => cycle(r, c, e.shiftKey ? -1 : 1)}
								>
									<span class="code">{codes[week[r][c]].short}</span>
									<span class="long">{codes[week[r][c]].long}</span>
								</button>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>

		<div class="counts" aria-live="polite">
			{#each tally as t (t.code.id)}
				<div
					class="count {t.code.tone}"
					class:zero={t.n === 0}
					class:hit={touched.includes(t.code.id)}
				>
					<span class="n">{t.n}</span>
					<span class="who">{t.code.short}</span>
				</div>
			{/each}
		</div>

		<div class="bar">
			<button type="button" class="reset" onclick={reset}>Reset</button>
		</div>
	</div>

	<figcaption>
		One student’s week, using the real Fall 2026 codes. Ten sessions, each assigned separately, and
		every one of them lands in somebody’s count. Click a session to swap its clinic: the tallies
		underneath move immediately, and those tallies are what students actually compare with each
		other at the end of a semester. A scheduler is doing this 2,133 times, for 27 people at once,
		while keeping all 27 sets of tallies even.
	</figcaption>
</figure>

<style>
	.schedule-figure {
		margin: 2rem 0 0.5rem;
	}

	.frame {
		padding: 1.75rem 1.75rem 0;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		background: var(--card);
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
		white-space: nowrap;
	}

	table {
		width: 100%;
		border-collapse: separate;
		border-spacing: 0.4rem;
		table-layout: fixed;
	}

	thead th {
		padding-bottom: 0.15rem;
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.72rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-align: center;
	}

	thead th:first-child,
	tbody th {
		width: 3.1rem;
	}

	tbody th {
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-align: left;
	}

	td {
		padding: 0;
	}

	.slot {
		display: grid;
		gap: 0.2rem;
		width: 100%;
		height: 4.4rem;
		padding: 0.5rem 0.35rem;
		place-content: center;
		border: 1px solid transparent;
		border-radius: 0.45rem;
		font-family: inherit;
		text-align: center;
		cursor: pointer;
		transition:
			background-color 200ms ease,
			color 200ms ease,
			border-color 160ms ease,
			transform 180ms cubic-bezier(0.3, 1.4, 0.5, 1);
	}

	.slot .code {
		font-family: 'Geist Mono', monospace;
		font-size: 0.86rem;
		font-weight: 600;
		letter-spacing: 0.03em;
	}

	.slot .long {
		font-size: 0.68rem;
		line-height: 1.25;
		opacity: 0.78;
	}

	.slot:hover {
		border-color: color-mix(in oklab, var(--foreground) 22%, transparent);
	}

	.slot:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	.slot.bumped {
		transform: scale(1.045);
	}

	.slot.care {
		background: color-mix(in oklab, #4f8f73 15%, var(--card));
		color: color-mix(in oklab, #2d7458 45%, var(--foreground));
	}

	.slot.peds {
		background: color-mix(in oklab, #c98440 16%, var(--card));
		color: color-mix(in oklab, #a65a20 45%, var(--foreground));
	}

	.slot.vt {
		background: color-mix(in oklab, #5d78a9 16%, var(--card));
		color: color-mix(in oklab, #365e9d 45%, var(--foreground));
	}

	.slot.duty {
		background: color-mix(in oklab, #8b6da8 16%, var(--card));
		color: color-mix(in oklab, #6d4594 45%, var(--foreground));
	}

	.slot.prep {
		border-color: var(--border);
		border-style: dashed;
		color: var(--muted-foreground);
	}

	.counts {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 0.4rem;
		margin-top: 1.5rem;
	}

	.count {
		display: grid;
		gap: 0.1rem;
		padding: 0.7rem 0.5rem;
		border: 1px solid var(--border);
		border-radius: 0.45rem;
		text-align: center;
		transition:
			border-color 260ms ease,
			background-color 260ms ease,
			opacity 260ms ease;
	}

	.count .n {
		display: block;
		color: var(--foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 1.35rem;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.count .who {
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.66rem;
		letter-spacing: 0.08em;
	}

	.count.zero {
		opacity: 0.45;
	}

	.count.care {
		border-color: color-mix(in oklab, #4f8f73 45%, var(--border));
	}
	.count.peds {
		border-color: color-mix(in oklab, #c98440 45%, var(--border));
	}
	.count.vt {
		border-color: color-mix(in oklab, #5d78a9 45%, var(--border));
	}
	.count.duty {
		border-color: color-mix(in oklab, #8b6da8 45%, var(--border));
	}
	.count.prep {
		border-color: var(--border);
		border-style: dashed;
	}

	.count.hit.care {
		border-color: #4f8f73;
		background: color-mix(in oklab, #4f8f73 24%, var(--card));
	}
	.count.hit.peds {
		border-color: #c98440;
		background: color-mix(in oklab, #c98440 26%, var(--card));
	}
	.count.hit.vt {
		border-color: #5d78a9;
		background: color-mix(in oklab, #5d78a9 26%, var(--card));
	}
	.count.hit.duty {
		border-color: #8b6da8;
		background: color-mix(in oklab, #8b6da8 26%, var(--card));
	}
	.count.hit.prep {
		border-color: var(--muted-foreground);
		border-style: solid;
		background: color-mix(in oklab, var(--muted-foreground) 20%, var(--card));
	}

	.count.hit .n {
		animation: pop 320ms cubic-bezier(0.3, 1.4, 0.5, 1);
	}

	@keyframes pop {
		0% {
			transform: scale(1);
		}
		45% {
			transform: scale(1.16);
		}
		100% {
			transform: scale(1);
		}
	}

	.bar {
		display: flex;
		justify-content: flex-end;
		margin-top: 1.3rem;
		padding: 1rem 0 1.25rem;
		border-top: 1px solid var(--border);
	}

	.reset {
		flex: none;
		padding: 0.35rem 0.8rem;
		border: 1px solid var(--border);
		border-radius: 0.4rem;
		background: transparent;
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.7rem;
		cursor: pointer;
		transition: color 140ms ease;
	}

	.reset:hover {
		color: var(--foreground);
	}

	.reset:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	figcaption {
		max-width: 620px;
		margin: 1rem auto 0;
		color: var(--muted-foreground);
		font-size: 0.85rem;
		line-height: 1.55;
		text-align: center;
	}

	@media (max-width: 640px) {
		.frame {
			padding: 1.1rem 1.1rem 0;
		}

		table {
			border-spacing: 0.28rem;
		}

		thead th:first-child,
		tbody th {
			width: 2rem;
		}

		.slot {
			height: 3.4rem;
		}

		.slot .long {
			display: none;
		}

		.counts {
			gap: 0.3rem;
		}

		.count {
			padding: 0.55rem 0.25rem;
		}

		.count .n {
			font-size: 1.15rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.slot,
		.count {
			transition: none;
		}

		.count.hit .n {
			animation: none;
		}

		.slot.bumped {
			transform: none;
		}
	}
</style>
