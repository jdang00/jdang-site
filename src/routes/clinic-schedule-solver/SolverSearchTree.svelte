<script lang="ts">
	// A full binary tree of depth 6 stands in for the space of possible schedules.
	// A handful of nodes are cut; everything under a cut is a branch never explored.
	const DEPTH = 6;
	const CUTS = new Set(['0000', '001', '010', '10', '1100', '11110']);
	const SOLUTION = '111011';

	const W = 700;
	const H = 364;
	const X0 = 24;
	const DX = 109.3;
	const Y0 = 18;
	const DY = 5.2;

	type Node = {
		id: string;
		x: number;
		y: number;
		depth: number;
		ghost: boolean;
		cut: boolean;
		kept: boolean;
	};

	function underCut(id: string) {
		for (let i = 1; i < id.length; i++) {
			if (CUTS.has(id.slice(0, i))) return true;
		}
		return false;
	}

	const nodes = new Map<string, Node>();
	let leafIndex = 0;

	function build(id: string): Node {
		const depth = id.length;
		const y = depth === DEPTH ? Y0 + leafIndex++ * DY : (build(id + '0').y + build(id + '1').y) / 2;
		const node: Node = {
			id,
			x: X0 + depth * DX,
			y,
			depth,
			ghost: underCut(id),
			cut: CUTS.has(id),
			kept: SOLUTION.startsWith(id)
		};
		nodes.set(id, node);
		return node;
	}
	build('');

	const all = [...nodes.values()];

	function edge(child: Node) {
		const p = nodes.get(child.id.slice(0, -1))!;
		const mx = (p.x + child.x) / 2;
		return `M${p.x} ${p.y} C${mx} ${p.y} ${mx} ${child.y} ${child.x} ${child.y}`;
	}

	const links = all.filter((n) => n.depth > 0).map((n) => ({ id: n.id, d: edge(n), node: n }));
	const ghostLinks = links.filter((l) => l.node.ghost);
	const openLinks = links.filter((l) => !l.node.ghost && !l.node.kept);
	const keptLinks = links.filter((l) => l.node.kept);

	const root = nodes.get('')!;
	const win = nodes.get(SOLUTION)!;
	const cutNodes = all.filter((n) => n.cut);
	const dotNodes = all.filter((n) => !n.ghost && !n.cut && n.depth > 0 && n.id !== SOLUTION);
	const targets = [root, ...dotNodes, ...cutNodes, win];

	// Plausible decisions, so a branch reads as a real scheduling choice.
	const CODES = ['1G', '2G', 'PC', 'GLA', 'VT', 'CL', 'REP', 'WI', 'OD', 'BP'];
	const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

	const CUT_REASONS = [
		'1G is already at its eight approved seats',
		'this student already has an assignment that period',
		'it breaks a four-week VT block',
		'the Cherokee Nation clinics are closed that day',
		'it would leave an approved seat unfilled',
		'it can’t beat the best schedule so far'
	];

	function hash(id: string) {
		let h = 17;
		for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
		return h;
	}

	const cutReason = new Map(cutNodes.map((n, i) => [n.id, CUT_REASONS[i % CUT_REASONS.length]]));

	function label(node: Node) {
		if (node.depth === 0) return { head: 'Start', body: 'Every legal assignment is still open.' };
		if (node.id === SOLUTION)
			return { head: 'Kept', body: 'A complete schedule that breaks no rule.' };
		const h = hash(node.id);
		const pick = `${DAYS[h % 5]} ${(h >>> 3) % 2 ? 'PM' : 'AM'} · Student ${1 + ((h >>> 5) % 27)} → ${CODES[(h >>> 9) % CODES.length]}`;
		if (node.cut) return { head: 'Dropped', body: `${pick}, but ${cutReason.get(node.id)}.` };
		return { head: `Choice ${node.depth}`, body: pick };
	}

	let hovered = $state<Node | null>(null);
	const trail = $derived(hovered ? links.filter((l) => hovered!.id.startsWith(l.id)) : []);
	const tip = $derived(hovered ? label(hovered) : null);
	const tipX = $derived(hovered ? Math.min(Math.max((hovered.x / W) * 100, 17), 83) : 0);
	const tipY = $derived(hovered ? (hovered.y / H) * 100 : 0);
	const tipBelow = $derived(hovered ? hovered.y < 70 : false);
</script>

<figure class="tree-figure">
	<div class="frame">
		<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
		<div class="tree-scroll" role="region" aria-label="Solver search tree diagram" tabindex="0">
			<div class="plot">
				<svg viewBox="0 0 {W} {H}" role="img" aria-labelledby="tree-title tree-desc">
					<title id="tree-title">A search tree of possible schedules</title>
					<desc id="tree-desc">
						A branching tree of possible schedules. The solver follows a small number of branches,
						drops the ones that break a rule or cannot beat the best schedule so far, and never has
						to look at the large faded regions underneath them.
					</desc>

					<g class="ghost" aria-hidden="true">
						{#each ghostLinks as link (link.id)}
							<path d={link.d} />
						{/each}
					</g>

					<g class="open" aria-hidden="true">
						{#each openLinks as link (link.id)}
							<path d={link.d} />
						{/each}
					</g>

					<g class="kept" aria-hidden="true">
						{#each keptLinks as link (link.id)}
							<path d={link.d} />
						{/each}
					</g>

					<g class="trail" aria-hidden="true">
						{#each trail as link (link.id)}
							<path d={link.d} />
						{/each}
					</g>

					<g aria-hidden="true">
						{#each dotNodes as node (node.id)}
							<circle class="dot" cx={node.x} cy={node.y} r="2.4" />
						{/each}
						{#each cutNodes as node (node.id)}
							<circle class="cut-halo" cx={node.x} cy={node.y} r="6.8" />
							<path
								class="cut-mark"
								d="M{node.x - 3.2} {node.y - 3.2} l6.4 6.4 M{node.x + 3.2} {node.y - 3.2} l-6.4 6.4"
							/>
						{/each}
					</g>

					<rect class="root" x={root.x - 5} y={root.y - 5} width="10" height="10" rx="2.5" />
					<circle class="win" cx={win.x} cy={win.y} r="5.5" />

					{#if hovered}
						<circle class="focus-ring" cx={hovered.x} cy={hovered.y} r="8" />
					{/if}

					<g class="hits">
						{#each targets as node (node.id)}
							<circle
								cx={node.x}
								cy={node.y}
								r="9"
								role="presentation"
								onmouseenter={() => (hovered = node)}
								onmouseleave={() => (hovered = null)}
							/>
						{/each}
					</g>
				</svg>

				{#if tip}
					<div
						class="tip"
						class:below={tipBelow}
						style="left: {tipX}%; top: {tipY}%"
						aria-hidden="true"
					>
						<b>{tip.head}</b>
						<span>{tip.body}</span>
					</div>
				{/if}
			</div>
		</div>

		<div class="legend">
			<span><i class="key start"></i>start</span>
			<span><i class="key path"></i>branch tried</span>
			<span><i class="key cut"></i>branch dropped</span>
			<span><i class="key skip"></i>never explored</span>
			<span><i class="key win"></i>schedule kept</span>
			<span class="hint">hover any point</span>
		</div>
	</div>

	<figcaption>
		Every path through the tree is a different schedule. Hover a point to see the kind of decision
		it stands for. A branch is dropped the moment it breaks a rule or can’t beat the best schedule
		already found, and nothing below it is ever looked at.
	</figcaption>
</figure>

<style>
	.tree-figure {
		margin: 2rem 0 0.5rem;
	}

	.frame {
		padding: 1.75rem 1.75rem 0;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		background: var(--card);
	}

	.tree-scroll {
		overflow-x: auto;
		scrollbar-color: color-mix(in oklab, var(--muted-foreground) 45%, transparent)
			color-mix(in oklab, var(--muted) 75%, transparent);
		scrollbar-width: thin;
	}

	.tree-scroll:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 4px;
	}

	.tree-scroll::-webkit-scrollbar {
		height: 5px;
	}

	.tree-scroll::-webkit-scrollbar-thumb {
		border-radius: 999px;
		background: color-mix(in oklab, var(--muted-foreground) 45%, transparent);
	}

	.plot {
		position: relative;
		min-width: 520px;
	}

	svg {
		display: block;
		width: 100%;
		height: auto;
	}

	path,
	circle,
	rect {
		vector-effect: non-scaling-stroke;
	}

	.ghost path {
		fill: none;
		stroke: color-mix(in oklab, var(--muted-foreground) 22%, transparent);
		stroke-width: 0.9;
	}

	.open path {
		fill: none;
		stroke: color-mix(in oklab, var(--foreground) 45%, transparent);
		stroke-width: 1.25;
	}

	.kept path {
		fill: none;
		stroke: #3f8a68;
		stroke-width: 2.2;
	}

	.trail path {
		fill: none;
		stroke: var(--primary);
		stroke-width: 2.4;
	}

	.dot {
		fill: color-mix(in oklab, var(--foreground) 62%, var(--card));
	}

	.cut-halo {
		fill: color-mix(in oklab, #c05a4b 12%, var(--card));
		stroke: color-mix(in oklab, #c05a4b 45%, transparent);
		stroke-width: 1;
	}

	.cut-mark {
		fill: none;
		stroke: #c05a4b;
		stroke-linecap: round;
		stroke-width: 1.8;
	}

	.root {
		fill: var(--foreground);
	}

	.win {
		fill: #3f8a68;
		stroke: var(--card);
		stroke-width: 2;
	}

	.focus-ring {
		fill: none;
		stroke: var(--primary);
		stroke-width: 1.5;
	}

	.hits circle {
		fill: transparent;
		cursor: crosshair;
	}

	.tip {
		position: absolute;
		z-index: 2;
		width: max-content;
		max-width: 15rem;
		padding: 0.5rem 0.65rem;
		transform: translate(-50%, calc(-100% - 0.85rem));
		border: 1px solid color-mix(in oklab, var(--primary) 35%, var(--border));
		border-radius: 0.45rem;
		background: var(--card);
		pointer-events: none;
	}

	.tip.below {
		transform: translate(-50%, 0.85rem);
	}

	.tip b {
		display: block;
		color: var(--primary);
		font-family: 'Geist Mono', monospace;
		font-size: 0.63rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.tip span {
		display: block;
		margin-top: 0.2rem;
		color: var(--foreground);
		font-size: 0.78rem;
		line-height: 1.4;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem 1.25rem;
		margin-top: 1.5rem;
		padding: 1rem 0 1.25rem;
		border-top: 1px solid var(--border);
		color: var(--muted-foreground);
		font-size: 0.78rem;
	}

	.legend span {
		display: inline-flex;
		gap: 0.5rem;
		align-items: center;
	}

	.hint {
		display: none;
		margin-left: auto;
		color: color-mix(in oklab, var(--muted-foreground) 80%, transparent);
		font-family: 'Geist Mono', monospace;
		font-size: 0.66rem;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}

	.hint::before {
		margin-right: 0.4rem;
		content: '⌖';
		font-size: 0.8rem;
	}

	@media (hover: hover) {
		.hint {
			display: inline-flex;
		}
	}

	.key {
		width: 0.75rem;
		height: 0.5rem;
		border-radius: 999px;
	}

	.key.start {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 0.12rem;
		background: var(--foreground);
	}

	.key.path {
		height: 0.14rem;
		background: color-mix(in oklab, var(--foreground) 55%, transparent);
	}

	.key.skip {
		height: 0.14rem;
		background: color-mix(in oklab, var(--muted-foreground) 30%, transparent);
	}

	.key.cut {
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 999px;
		background: color-mix(in oklab, #c05a4b 65%, transparent);
	}

	.key.win {
		width: 0.5rem;
		height: 0.5rem;
		background: #3f8a68;
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

		.legend {
			margin-top: 1.1rem;
			gap: 0.4rem 1rem;
			font-size: 0.74rem;
		}
	}
</style>
