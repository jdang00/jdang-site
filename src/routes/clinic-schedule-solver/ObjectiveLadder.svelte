<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Play, RotateCcw } from 'lucide-svelte';

	// The stage ladder as the solver runs it, with the stage that settles each
	// family of assignments for good.
	const stages = [
		['Feasibility', 'Find a schedule that breaks no rule and fills every approved seat.'],
		['Worst exposure deficit', 'Help whoever is furthest behind on clinical exposure first.'],
		['Total deviation and spread', 'Pull every student’s clinic counts toward the target.'],
		['Aggregate load fairness', 'Even out the total protected clinic load.'],
		['Continuity repair', 'Keep the contact lens and vision therapy blocks whole.'],
		['REP repairs', 'Change as few rural rotations as possible.'],
		['REP repair distance', 'If a rural turn must move, move it the shortest distance.'],
		['Residual fill', 'Fill the leftover duty seats.'],
		['DS fairness', 'Share the CNOHC dispensary evenly.'],
		['DSN and SF fairness', 'Share the NSU dispensary and spectacle fabrication evenly.'],
		['OC fairness', 'Share on-call evenly.'],
		['RPA fairness', 'Give every student zero or one RPA.'],
		['Boards Prep fairness', 'Even out the remaining boards prep time.'],
		['Recurrence cleanup', 'Tidy repeating weekday patterns, if time is left.']
	].map(([name, gloss], i) => ({ name, gloss, n: i + 1 }));

	const TOTAL_STAGES = stages.length;

	// Real published counts: code, cells, colour family, stage that settles it.
	const groups: [string, number, string, number][] = [
		['TA', 8, 'ta', 1],
		['1G', 568, 'clinic', 4],
		['2G', 164, 'clinic', 4],
		['PC', 42, 'clinic', 4],
		['GLA', 45, 'clinic', 4],
		['DRY', 36, 'clinic', 4],
		['WI', 100, 'clinic', 4],
		['WIS', 53, 'clinic', 4],
		['DD', 77, 'duty', 4],
		['OD', 79, 'duty', 4],
		['CL', 175, 'block', 5],
		['VT', 116, 'block', 5],
		['REP', 144, 'block', 7],
		['DS', 77, 'duty', 9],
		['DSN', 55, 'duty', 10],
		['SF', 55, 'duty', 10],
		['OC', 48, 'duty', 11],
		['RPA', 21, 'duty', 12],
		['BP', 270, 'prep', 13]
	];

	// The grid is a scaled stand-in for the real 27 x 79 schedule: same code mix,
	// same settling order, a readable number of cells.
	const ROWS = 18;
	const COLS = 46;
	const REAL_TOTAL = groups.reduce((sum, [, n]) => sum + n, 0);

	function mulberry32(a: number) {
		return () => {
			a |= 0;
			a = (a + 0x6d2b79f5) | 0;
			let t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	// Scatter the codes the way a real schedule looks, with a fixed seed so the
	// picture never changes between visits.
	const cells = (() => {
		const target = ROWS * COLS;
		const scaled = groups.map(([, count, family, lock]) => ({
			family,
			lock,
			n: Math.max(1, Math.round((count * target) / REAL_TOTAL))
		}));
		let drift = scaled.reduce((sum, g) => sum + g.n, 0) - target;
		while (drift !== 0) {
			const biggest = scaled.reduce((a, b) => (a.n >= b.n ? a : b));
			biggest.n -= Math.sign(drift);
			drift -= Math.sign(drift);
		}

		const list: { family: string; lock: number; delay: string }[] = [];
		for (const g of scaled) {
			for (let i = 0; i < g.n; i++) list.push({ family: g.family, lock: g.lock, delay: '' });
		}
		const rand = mulberry32(20260817);
		for (let i = list.length - 1; i > 0; i--) {
			const j = Math.floor(rand() * (i + 1));
			[list[i], list[j]] = [list[j], list[i]];
		}
		for (const cell of list) cell.delay = `${(rand() * 0.24).toFixed(3)}s`;
		return list;
	})();

	// The counter reports the real schedule, not the scaled grid.
	const lockedBy = (s: number) =>
		groups.reduce((sum, [, count, , lock]) => sum + (lock <= s ? count : 0), 0);

	let stage = $state(TOTAL_STAGES);
	let running = $state(false);
	let timer: ReturnType<typeof setTimeout>;

	const settled = $derived(stage === 0 ? 0 : lockedBy(stage));
	const free = $derived(REAL_TOTAL - settled);
	const current = $derived(stages[Math.min(stage, TOTAL_STAGES) - 1]);

	function step() {
		if (stage >= TOTAL_STAGES) {
			running = false;
			return;
		}
		stage += 1;
		timer = setTimeout(step, stage === 1 ? 900 : 620);
	}

	function run() {
		clearTimeout(timer);
		stage = 0;
		running = true;
		timer = setTimeout(step, 420);
	}

	onDestroy(() => clearTimeout(timer));
</script>

<figure class="ladder-figure">
	<div class="frame">
		<div class="head">
			<div class="readout">
				<b>{settled.toLocaleString()}</b>
				<span
					>of {REAL_TOTAL.toLocaleString()} settled · <em>{free.toLocaleString()}</em> can still move</span
				>
			</div>
			<button type="button" class="play" onclick={run} disabled={running}>
				{#if running}
					<RotateCcw size={14} class="spin" />
					<span>Solving…</span>
				{:else}
					<Play size={14} fill="currentColor" />
					<span>{stage === TOTAL_STAGES ? 'Replay the stages' : 'Run the stages'}</span>
				{/if}
			</button>
		</div>

		<div
			class="grid"
			class:empty={stage === 0}
			style="--stage: {stage}; --cols: {COLS}"
			role="img"
			aria-label="A scaled stand-in for the schedule grid. Cells lock as each solver stage completes."
		>
			{#each cells as cell, i (i)}
				<span class="cell {cell.family}" style="--lock: {cell.lock}; transition-delay: {cell.delay}"
				></span>
			{/each}
		</div>

		<div class="status">
			{#if stage === 0}
				<span class="dot pending"></span>
				<p>Nothing decided yet.</p>
			{:else}
				<span class="dot" class:live={running}></span>
				<p><b>{String(stage).padStart(2, '0')} · {current.name}</b> {current.gloss}</p>
			{/if}
		</div>

		<ol>
			{#each stages as s (s.name)}
				<li class:locked={s.n <= stage} class:active={s.n === stage && running}>
					<span class="rank">{String(s.n).padStart(2, '0')}</span>
					<span class="name">{s.name}</span>
				</li>
			{/each}
		</ol>

		<div class="legend">
			<span><i class="clinic"></i>clinic exposure</span>
			<span><i class="block"></i>CL, VT, REP blocks</span>
			<span><i class="duty"></i>duties</span>
			<span><i class="prep"></i>boards prep</span>
			<span><i class="ta"></i>TA</span>
		</div>
	</div>

	<figcaption>
		The solver settles one objective at a time and freezes the result before starting the next, so
		the pool of assignments still free to move only ever shrinks. Cleanup at the end can still slide
		a settled cell to a tidier weekday; it can never change what a student receives.
	</figcaption>
</figure>

<style>
	.ladder-figure {
		margin: 2rem 0 0.5rem;
	}

	.frame {
		padding: 1.75rem;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		background: var(--card);
	}

	.head {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem 1rem;
		align-items: baseline;
		justify-content: space-between;
		margin-bottom: 1.25rem;
	}

	.readout {
		display: flex;
		gap: 0.5rem;
		align-items: baseline;
	}

	.readout b {
		color: var(--foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 1.5rem;
		font-variant-numeric: tabular-nums;
		line-height: 1;
	}

	.readout span {
		color: var(--muted-foreground);
		font-size: 0.82rem;
	}

	.readout em {
		color: var(--primary);
		font-family: 'Geist Mono', monospace;
		font-style: normal;
		font-variant-numeric: tabular-nums;
	}

	.play {
		display: inline-flex;
		flex: none;
		gap: 0.5rem;
		align-items: center;
		padding: 0.55rem 1.05rem;
		border: 1px solid var(--primary);
		border-radius: 0.45rem;
		background: var(--primary);
		color: var(--primary-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.76rem;
		font-weight: 500;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition:
			filter 140ms ease,
			transform 140ms ease;
	}

	.play:hover:not(:disabled) {
		filter: brightness(1.08);
		transform: translateY(-1px);
	}

	.play:active:not(:disabled) {
		transform: translateY(0);
	}

	.play:disabled {
		border-color: var(--border);
		background: transparent;
		color: var(--muted-foreground);
		cursor: default;
	}

	.play:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 3px;
	}

	.play :global(.spin) {
		animation: spin 1.1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(-360deg);
		}
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: 2px;
	}

	.cell {
		aspect-ratio: 1;
		border-radius: 1.5px;
		opacity: clamp(0.22, calc((var(--stage) - var(--lock) + 1) * 100), 1);
		transition: opacity 380ms ease;
	}

	.grid.empty .cell {
		opacity: 0;
		transition-delay: 0s !important;
	}

	.clinic {
		background: #4f8f73;
	}
	.block {
		background: #5d78a9;
	}
	.duty {
		background: #8b6da8;
	}
	.prep {
		background: color-mix(in oklab, var(--muted-foreground) 70%, transparent);
	}
	.ta {
		background: #c98440;
	}

	.status {
		display: flex;
		gap: 0.6rem;
		align-items: baseline;
		min-height: 2.6rem;
		margin-top: 1.35rem;
		padding-top: 1.1rem;
		border-top: 1px solid var(--border);
	}

	.status p {
		margin: 0;
		color: var(--muted-foreground);
		font-size: 0.83rem;
		line-height: 1.55;
	}

	.status b {
		color: var(--foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.78rem;
		font-weight: 600;
	}

	.dot {
		flex: none;
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 999px;
		background: #3f8a68;
		transform: translateY(-0.1rem);
	}

	.dot.pending {
		background: var(--muted-foreground);
	}

	.dot.live {
		background: var(--primary);
		animation: pulse 1s ease-in-out infinite;
	}

	@keyframes pulse {
		50% {
			opacity: 0.3;
		}
	}

	ol {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
		gap: 0.2rem 1.25rem;
		margin: 1.35rem 0 0;
		padding: 1.1rem 0 0;
		border-top: 1px solid var(--border);
		list-style: none;
	}

	li {
		display: flex;
		gap: 0.55rem;
		align-items: baseline;
		padding: 0.14rem 0;
		color: var(--muted-foreground);
		font-size: 0.78rem;
		opacity: 0.45;
		transition: opacity 240ms ease;
	}

	li.locked {
		color: var(--foreground);
		opacity: 1;
	}

	li.active {
		color: var(--primary);
	}

	.rank {
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.66rem;
		font-variant-numeric: tabular-nums;
	}

	li.active .rank {
		color: var(--primary);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem 1.2rem;
		margin-top: 1.25rem;
		padding-top: 1rem;
		border-top: 1px solid var(--border);
		color: var(--muted-foreground);
		font-size: 0.74rem;
	}

	.legend span {
		display: inline-flex;
		gap: 0.45rem;
		align-items: center;
	}

	.legend i {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 0.12rem;
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
			padding: 1.1rem;
		}

		.grid {
			gap: 1px;
		}

		.readout b {
			font-size: 1.25rem;
		}

		.status {
			min-height: 3.6rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.cell,
		li {
			transition: none;
		}

		.dot.live,
		.play :global(.spin) {
			animation: none;
		}
	}
</style>
