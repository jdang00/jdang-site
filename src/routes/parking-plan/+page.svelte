<script lang="ts">
	import { page } from '$app/state';

	type Assignment = 'Students' | 'Faculty/staff' | 'ADA / unallocated';
	type AllocationMode = 'current' | 'proposed';
	type ViewMode = AllocationMode | 'compare';

	type ParkingRegion = {
		id: string;
		label: string;
		spaces: number;
		current: Assignment;
		proposed: Assignment;
		x: number;
		y: number;
		points: string;
	};

	const regions: ParkingRegion[] = [
		{
			id: 'west-north-row',
			label: 'West lot — north row by building',
			spaces: 14,
			current: 'Students',
			proposed: 'Faculty/staff',
			x: 656,
			y: 258,
			points: '656,258 1102,260 1100,332 656,330'
		},
		{
			id: 'west-middle-section',
			label: 'West lot — middle double-loaded section',
			spaces: 22,
			current: 'Faculty/staff',
			proposed: 'Students',
			x: 628,
			y: 422,
			points: '628,422 986,422 986,578 628,578'
		},
		{
			id: 'west-south-row',
			label: 'West lot — south bottom row',
			spaces: 18,
			current: 'Students',
			proposed: 'Students',
			x: 518,
			y: 626,
			points: '518,626 1092,627 1090,732 520,732'
		},
		{
			id: 'west-left-side',
			label: 'West lot — far left column',
			spaces: 9,
			current: 'Students',
			proposed: 'Students',
			x: 430,
			y: 348,
			points: '430,348 505,353 503,614 428,612'
		},
		{
			id: 'east-upper-ada',
			label: 'East lot — upper ADA section',
			spaces: 7,
			current: 'ADA / unallocated',
			proposed: 'ADA / unallocated',
			x: 1394,
			y: 276,
			points: '1394,276 1714,276 1714,368 1395,368'
		},
		{
			id: 'east-middle-island',
			label: 'East lot — middle island cluster',
			spaces: 16,
			current: 'Faculty/staff',
			proposed: 'Faculty/staff',
			x: 1400,
			y: 446,
			points: '1400,446 1706,450 1704,604 1400,602'
		},
		{
			id: 'east-bottom-row',
			label: 'East lot — bottom row',
			spaces: 15,
			current: 'Students',
			proposed: 'Students',
			x: 1304,
			y: 622,
			points: '1304,622 1782,624 1780,742 1306,740'
		}
	];

	const allocationColors: Record<Assignment, { fill: string; stroke: string; text: string }> = {
		Students: { fill: '#cbff5b', stroke: '#48a837', text: '#245e1d' },
		'Faculty/staff': { fill: '#d9edff', stroke: '#0678ff', text: '#075ebf' },
		'ADA / unallocated': { fill: '#f2f4f3', stroke: '#68736c', text: '#4e5b53' }
	};

	const modes: { id: ViewMode; label: string }[] = [
		{ id: 'current', label: 'Current' },
		{ id: 'proposed', label: 'Proposed' },
		{ id: 'compare', label: 'Compare' }
	];

	const isEmbed = $derived(page.url.searchParams.get('embed') === '1');

	let hoveredId = $state<string | null>(null);
	let pinnedId = $state<string | null>(null);
	let view = $state<ViewMode>('current');
	let copied = $state(false);
	const activeId = $derived(hoveredId ?? pinnedId);
	const embedCode = $derived(
		`<iframe src="https://justindang.dev/parking-plan?embed=1&mode=${view}" title="Parking plan" style="width:100%;aspect-ratio:1800/847;border:0;"></iframe>`
	);

	$effect(() => {
		const param = page.url.searchParams.get('mode');
		if (param === 'proposed' || param === 'compare') {
			view = param;
		}
	});

	const activeRegion = $derived(regions.find((region) => region.id === activeId));
	const activeChanged = $derived(
		activeRegion ? activeRegion.current !== activeRegion.proposed : false
	);
	const activeCurrentColors = $derived(
		activeRegion ? allocationColors[activeRegion.current] : undefined
	);
	const activeProposedColors = $derived(
		activeRegion ? allocationColors[activeRegion.proposed] : undefined
	);
	const totals = $derived.by(() => ({
		current: countAssignments('current'),
		proposed: countAssignments('proposed')
	}));

	function hover(id: string) {
		hoveredId = id;
	}

	function unhover(id: string) {
		if (hoveredId === id) hoveredId = null;
	}

	function togglePin(id: string) {
		pinnedId = pinnedId === id ? null : id;
	}

	function clearAll() {
		hoveredId = null;
		pinnedId = null;
	}

	function effectiveMode(viewMode: ViewMode): AllocationMode {
		return viewMode === 'compare' ? 'current' : viewMode;
	}

	function regionColor(region: ParkingRegion, mode: AllocationMode) {
		return allocationColors[region[mode]];
	}

	function countAssignments(allocationMode: AllocationMode) {
		return regions.reduce(
			(total, region) => {
				total[region[allocationMode]] += region.spaces;
				return total;
			},
			{
				Students: 0,
				'Faculty/staff': 0,
				'ADA / unallocated': 0
			} as Record<Assignment, number>
		);
	}

	async function copyEmbed() {
		await navigator.clipboard.writeText(embedCode);
		copied = true;
		window.setTimeout(() => {
			copied = false;
		}, 1600);
	}

	let exporting = $state(false);

	function drawRegions(ctx: CanvasRenderingContext2D, ox: number, oy: number, mode: AllocationMode) {
		for (const region of regions) {
			const c = allocationColors[region[mode]];
			const changed = region.current !== region.proposed;
			const pts = region.points
				.split(' ')
				.map((p) => p.split(',').map(Number) as [number, number]);
			ctx.beginPath();
			ctx.moveTo(ox + pts[0][0], oy + pts[0][1]);
			for (let i = 1; i < pts.length; i++) ctx.lineTo(ox + pts[i][0], oy + pts[i][1]);
			ctx.closePath();
			ctx.globalAlpha = changed ? 0.28 : 0.1;
			ctx.fillStyle = c.fill;
			ctx.fill();
			ctx.globalAlpha = 1;
			ctx.strokeStyle = c.stroke;
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			ctx.lineWidth = changed ? 6 : 4;
			ctx.stroke();
		}
	}

	async function exportCompare() {
		if (exporting) return;
		exporting = true;
		try {
			const W = 1800;
			const H = 847;
			const PAD = 36;
			const GAP = 36;
			const HEADER_H = 96;
			const FOOTER_H = 110;
			const canvas = document.createElement('canvas');
			canvas.width = W * 2 + GAP + PAD * 2;
			canvas.height = HEADER_H + H + FOOTER_H + PAD * 2;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			ctx.fillStyle = '#f5f1e8';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.strokeStyle = 'rgba(42, 57, 45, 0.07)';
			ctx.lineWidth = 1;
			for (let x = 0; x < canvas.width; x += 28) {
				ctx.beginPath();
				ctx.moveTo(x + 0.5, 0);
				ctx.lineTo(x + 0.5, canvas.height);
				ctx.stroke();
			}
			for (let y = 0; y < canvas.height; y += 28) {
				ctx.beginPath();
				ctx.moveTo(0, y + 0.5);
				ctx.lineTo(canvas.width, y + 0.5);
				ctx.stroke();
			}

			ctx.fillStyle = '#172018';
			ctx.font = '700 36px "Geist", system-ui, sans-serif';
			ctx.textBaseline = 'top';
			ctx.fillText('Parking Allocation — Current vs. Proposed', PAD, PAD);
			ctx.fillStyle = '#596653';
			ctx.font = '600 18px "Geist Mono", ui-monospace, monospace';
			ctx.fillText('NSUOCO / SOUTH LOT', PAD, PAD + 50);

			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.src = '/parking-plan/south-parking-clean.webp';
			await new Promise<void>((resolve, reject) => {
				img.onload = () => resolve();
				img.onerror = () => reject(new Error('image load failed'));
			});

			const mapY = PAD + HEADER_H;
			const leftX = PAD;
			const rightX = PAD + W + GAP;

			ctx.drawImage(img, leftX, mapY, W, H);
			ctx.drawImage(img, rightX, mapY, W, H);

			drawRegions(ctx, leftX, mapY, 'current');
			drawRegions(ctx, rightX, mapY, 'proposed');

			ctx.lineWidth = 2;
			ctx.strokeStyle = 'rgba(35, 47, 35, 0.35)';
			ctx.strokeRect(leftX, mapY, W, H);
			ctx.strokeRect(rightX, mapY, W, H);

			ctx.fillStyle = '#172018';
			ctx.fillRect(leftX, mapY - 44, 180, 36);
			ctx.fillRect(rightX, mapY - 44, 180, 36);
			ctx.fillStyle = '#fffdf7';
			ctx.font = '700 18px "Geist Mono", ui-monospace, monospace';
			ctx.fillText('01  CURRENT', leftX + 14, mapY - 36);
			ctx.fillText('02  PROPOSED', rightX + 14, mapY - 36);

			const legendY = mapY + H + 28;
			ctx.font = '700 16px "Geist Mono", ui-monospace, monospace';
			ctx.fillStyle = '#172018';
			let lx = leftX;
			const entries: { label: string; fill: string; stroke: string }[] = [
				{ label: 'Students', fill: allocationColors.Students.fill, stroke: allocationColors.Students.stroke },
				{ label: 'Faculty/staff', fill: allocationColors['Faculty/staff'].fill, stroke: allocationColors['Faculty/staff'].stroke },
				{ label: 'ADA / unallocated', fill: allocationColors['ADA / unallocated'].fill, stroke: allocationColors['ADA / unallocated'].stroke }
			];
			for (const e of entries) {
				ctx.fillStyle = e.fill;
				ctx.fillRect(lx, legendY, 28, 18);
				ctx.lineWidth = 3;
				ctx.strokeStyle = e.stroke;
				ctx.strokeRect(lx, legendY, 28, 18);
				ctx.fillStyle = '#172018';
				ctx.fillText(e.label.toUpperCase(), lx + 40, legendY + 1);
				lx += ctx.measureText(e.label.toUpperCase()).width + 96;
			}

			const totalsLine = `STUDENTS ${totals.current.Students} → ${totals.proposed.Students}    FACULTY ${totals.current['Faculty/staff']} → ${totals.proposed['Faculty/staff']}    ADA ${totals.current['ADA / unallocated']} → ${totals.proposed['ADA / unallocated']}`;
			ctx.fillStyle = '#3b4539';
			ctx.font = '600 15px "Geist Mono", ui-monospace, monospace';
			ctx.fillText(totalsLine, leftX, legendY + 44);

			canvas.toBlob((blob) => {
				if (!blob) return;
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = 'parking-compare.png';
				document.body.appendChild(a);
				a.click();
				a.remove();
				setTimeout(() => URL.revokeObjectURL(url), 1000);
			}, 'image/png');
		} finally {
			exporting = false;
		}
	}
</script>

<svelte:head>
	<title>Parking Plan</title>
	<meta
		name="description"
		content="Interactive parking plan with hoverable and highlightable parking regions."
	/>
</svelte:head>

{#snippet mapView(mode: AllocationMode, label: string | null)}
	<figure class="map-frame" class:tall={view !== 'compare'}>
		{#if label}
			<figcaption class="map-caption">
				<span class="caption-mark">{mode === 'current' ? '01' : '02'}</span>
				<span class="caption-label">{label}</span>
			</figcaption>
		{/if}
		<div class="map-wrap">
			<img
				src="/parking-plan/south-parking-clean.webp"
				alt="Aerial parking map with marked student, faculty, and reserved parking areas."
				width="1800"
				height="847"
				loading="eager"
				draggable="false"
			/>
			<svg class="parking-overlay" viewBox="0 0 1800 847" aria-label="Parking regions">
				{#each regions as region}
					{@const colors = regionColor(region, mode)}
					{@const changed = region.current !== region.proposed}
					<polygon
						class="parking-region"
						class:active={activeId === region.id}
						class:pinned={pinnedId === region.id}
						class:changed
						class:unchanged={!changed}
						points={region.points}
						fill={colors.fill}
						stroke={colors.stroke}
						role="button"
						tabindex="0"
						aria-label={`${region.label}: ${region.spaces} spaces. Current ${region.current}. Proposed ${region.proposed}.`}
						aria-pressed={pinnedId === region.id}
						onmouseenter={() => hover(region.id)}
						onmouseleave={() => unhover(region.id)}
						onfocus={() => hover(region.id)}
						onblur={() => unhover(region.id)}
						onclick={() => togglePin(region.id)}
						onkeydown={(event) => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								togglePin(region.id);
							}
							if (event.key === 'Escape') {
								clearAll();
							}
						}}
					>
						<title>{region.label}</title>
					</polygon>
				{/each}
			</svg>
		</div>
	</figure>
{/snippet}

<div class:embed-shell={isEmbed} class:page-shell={!isEmbed}>
	{#if !isEmbed}
		<header class="parking-header">
			<div class="title-block">
				<p class="eyebrow">
					<span class="dot"></span>
					NSUOCO / South Lot
				</p>
				<h1>Parking Allocation</h1>
				<p class="subtitle">
					Interactive lot map. Hover any region to inspect its proposed reassignment.
				</p>
			</div>
			<div class="header-tools">
				<div class="mode-control" aria-label="Allocation view">
					{#each modes as option}
						<button
							class:active={view === option.id}
							type="button"
							aria-pressed={view === option.id}
							onclick={() => {
								view = option.id;
							}}
						>
							{option.label}
						</button>
					{/each}
				</div>
				{#if view === 'compare'}
					<button
						class="embed-button ghost"
						type="button"
						onclick={exportCompare}
						disabled={exporting}
					>
						<span class="key-glyph">↓</span>
						{exporting ? 'Rendering…' : 'Export PNG'}
					</button>
				{/if}
				<button class="embed-button" type="button" onclick={copyEmbed}>
					<span class="key-glyph">{'</>'}</span>
					{copied ? 'Copied' : 'Copy embed'}
				</button>
			</div>
		</header>
	{/if}

	{#if isEmbed}
		<div class="mode-control floating" aria-label="Allocation view">
			{#each modes as option}
				<button
					class:active={view === option.id}
					type="button"
					aria-pressed={view === option.id}
					onclick={() => {
						view = option.id;
					}}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}

	<section class="parking-stage" class:compare={view === 'compare'} aria-label="Interactive parking plan">
		<div class="stage-main">
			{#if view === 'compare'}
				<div class="compare-grid">
					{@render mapView('current', 'Current')}
					{@render mapView('proposed', 'Proposed')}
				</div>
			{:else}
				{@render mapView(effectiveMode(view), null)}
			{/if}

			{#if activeRegion && activeCurrentColors && activeProposedColors}
				<div class="region-info" class:is-pinned={pinnedId === activeRegion.id} role="status" aria-live="polite">
					<div class="info-meta">
						<span class="info-spaces">{activeRegion.spaces}</span>
						<span class="info-spaces-label">spaces</span>
					</div>
					<div class="info-body">
						<strong>
							{activeRegion.label}
							{#if pinnedId === activeRegion.id}
								<button
									type="button"
									class="unpin-btn"
									aria-label="Unpin region"
									onclick={() => togglePin(activeRegion.id)}
								>
									<span class="pin-dot"></span>
									pinned
									<span class="x">×</span>
								</button>
							{/if}
						</strong>
						{#if activeChanged}
							<div class="comparison">
								<div
									class="chip"
									style={`--chip-fill:${activeCurrentColors.fill};--chip-stroke:${activeCurrentColors.stroke};`}
								>
									<small>Current</small>
									<b>{activeRegion.current}</b>
								</div>
								<i aria-hidden="true">→</i>
								<div
									class="chip"
									style={`--chip-fill:${activeProposedColors.fill};--chip-stroke:${activeProposedColors.stroke};`}
								>
									<small>Proposed</small>
									<b>{activeRegion.proposed}</b>
								</div>
							</div>
						{:else}
							<div class="single-state">
								<div
									class="chip"
									style={`--chip-fill:${activeCurrentColors.fill};--chip-stroke:${activeCurrentColors.stroke};`}
								>
									<small>Assignment</small>
									<b>{activeRegion.current}</b>
								</div>
								<span class="no-change">no change</span>
							</div>
						{/if}
					</div>
					{#if activeChanged}
						<em class="info-flag">REASSIGNS</em>
					{/if}
				</div>
			{/if}
		</div>

		{#if !isEmbed}
			<aside class="legend" aria-label="Parking legend">
				<div class="summary">
					<p>Totals · current → proposed</p>
					<dl>
						<div class="row">
							<dt><span class="dot students"></span>Students</dt>
							<dd>
								<span class="num">{totals.current.Students}</span>
								<span class="arrow">→</span>
								<span class="num to">{totals.proposed.Students}</span>
							</dd>
						</div>
						<div class="row">
							<dt><span class="dot faculty"></span>Faculty/staff</dt>
							<dd>
								<span class="num">{totals.current['Faculty/staff']}</span>
								<span class="arrow">→</span>
								<span class="num to">{totals.proposed['Faculty/staff']}</span>
							</dd>
						</div>
						<div class="row">
							<dt><span class="dot ada"></span>ADA / unallocated</dt>
							<dd>
								<span class="num">{totals.current['ADA / unallocated']}</span>
								<span class="arrow">→</span>
								<span class="num to">{totals.proposed['ADA / unallocated']}</span>
							</dd>
						</div>
					</dl>
				</div>

				<ul class="region-list">
					{#each regions as region}
						{@const colors = regionColor(region, effectiveMode(view))}
						{@const changed = region.current !== region.proposed}
						<li>
							<button
								class="legend-item"
								class:active={activeId === region.id}
								class:pinned={pinnedId === region.id}
								class:changed
								type="button"
								aria-pressed={pinnedId === region.id}
								onclick={() => togglePin(region.id)}
								onmouseenter={() => hover(region.id)}
								onmouseleave={() => unhover(region.id)}
								onfocus={() => hover(region.id)}
								onblur={() => unhover(region.id)}
							>
								<span
									class="key"
									style={`--key-fill:${colors.fill};--key-stroke:${colors.stroke}`}
								></span>
								<span class="legend-text">
									<strong>{region.label}</strong>
									<small>
										<span class="mono">{region.spaces}</span> spaces ·
										{region.current} → {region.proposed}
									</small>
								</span>
								{#if changed}
									<span class="legend-flag">·</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</aside>
		{/if}
	</section>

</div>

<style>
	.page-shell {
		min-height: 100vh;
		padding: clamp(18px, 3vw, 42px);
		background:
			linear-gradient(90deg, rgba(42, 57, 45, 0.07) 1px, transparent 1px),
			linear-gradient(0deg, rgba(42, 57, 45, 0.06) 1px, transparent 1px),
			#f5f1e8;
		background-size: 28px 28px;
		color: #172018;
		font-family: 'Geist', system-ui, sans-serif;
	}

	.embed-shell {
		margin: 0;
		padding: 0;
		background: transparent;
		position: relative;
	}

	.parking-header {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 28px;
		flex-wrap: wrap;
		margin: 0 auto 22px;
		max-width: 1220px;
		padding-bottom: 18px;
		border-bottom: 1px dashed rgba(23, 32, 24, 0.22);
	}

	.title-block {
		min-width: 280px;
	}

	.header-tools {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
	}

	.eyebrow {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		margin: 0 0 10px;
		font: 600 0.72rem/1 'Geist Mono', monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #596653;
	}

	.eyebrow .dot {
		display: inline-block;
		width: 7px;
		height: 7px;
		border-radius: 999px;
		background: #48a837;
		box-shadow: 0 0 0 3px rgba(72, 168, 55, 0.18);
	}

	h1 {
		margin: 0;
		font-size: clamp(2rem, 5vw, 4rem);
		line-height: 0.92;
		letter-spacing: -0.02em;
		font-weight: 700;
	}

	.subtitle {
		margin: 12px 0 0;
		max-width: 42ch;
		font-size: 0.92rem;
		line-height: 1.4;
		color: #4d5a4b;
	}

	.embed-button {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		min-height: 38px;
		border: 1px solid rgba(23, 32, 24, 0.32);
		border-radius: 6px;
		padding: 0 14px;
		background: #172018;
		color: #fffdf7;
		font: 700 0.82rem/1 'Geist', sans-serif;
		cursor: pointer;
		transition: transform 120ms ease, background 120ms ease;
	}

	.embed-button:hover {
		background: #2a3729;
		transform: translateY(-1px);
	}

	.embed-button:disabled {
		opacity: 0.6;
		cursor: progress;
		transform: none;
	}

	.embed-button.ghost {
		background: rgba(255, 255, 255, 0.6);
		color: #172018;
	}

	.embed-button.ghost:hover {
		background: rgba(255, 255, 255, 0.95);
	}

	.embed-button .key-glyph {
		font-family: 'Geist Mono', monospace;
		font-size: 0.78rem;
		opacity: 0.7;
	}

	.mode-control {
		display: inline-grid;
		grid-template-columns: repeat(3, minmax(72px, auto));
		gap: 0;
		border: 1px solid rgba(23, 32, 24, 0.28);
		border-radius: 7px;
		padding: 3px;
		background: rgba(255, 255, 255, 0.78);
		backdrop-filter: blur(12px);
		box-shadow: 0 6px 22px rgba(32, 43, 32, 0.08);
	}

	.mode-control.floating {
		position: absolute;
		top: 12px;
		right: 12px;
		z-index: 5;
	}

	.mode-control button {
		min-height: 32px;
		border: 0;
		border-radius: 4px;
		background: transparent;
		padding: 0 14px;
		color: #404e3e;
		font: 700 0.78rem/1 'Geist Mono', monospace;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background 120ms ease, color 120ms ease;
	}

	.mode-control button:hover {
		color: #172018;
	}

	.mode-control button.active {
		background: #172018;
		color: #fffdf7;
		box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.06);
	}

	.parking-stage {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 280px;
		align-items: start;
		gap: 20px;
		max-width: 1220px;
		margin: 0 auto;
	}

	.parking-stage.compare {
		grid-template-columns: minmax(0, 1fr);
	}

	.embed-shell .parking-stage {
		display: block;
		max-width: none;
		margin: 0;
	}

	.stage-main {
		position: relative;
		min-width: 0;
	}

	.compare-grid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 14px;
	}

	.map-frame {
		margin: 0;
		display: block;
	}

	.map-caption {
		display: flex;
		align-items: center;
		gap: 10px;
		padding: 0 0 8px;
		font: 700 0.72rem/1 'Geist Mono', monospace;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #2a3729;
	}

	.caption-mark {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 26px;
		height: 22px;
		padding: 0 6px;
		border: 1px solid rgba(23, 32, 24, 0.34);
		border-radius: 4px;
		background: #fffdf7;
		font-size: 0.7rem;
	}

	.caption-label {
		flex: 1;
	}

	.map-wrap {
		position: relative;
		overflow: hidden;
		border: 1px solid rgba(35, 47, 35, 0.24);
		border-radius: 6px;
		background: #d8d2c4;
		box-shadow: 0 14px 38px rgba(38, 48, 38, 0.14);
	}

	.embed-shell .map-wrap {
		border: 0;
		border-radius: 0;
		box-shadow: none;
	}

	img {
		display: block;
		width: 100%;
		height: auto;
		user-select: none;
	}

	.parking-overlay {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.parking-region {
		fill-opacity: 0.14;
		stroke-opacity: 0.55;
		stroke-width: 4;
		stroke-linejoin: round;
		stroke-linecap: round;
		cursor: pointer;
		filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.18));
		outline: none;
		transition:
			fill-opacity 140ms ease,
			stroke-opacity 140ms ease,
			stroke-width 140ms ease,
			filter 140ms ease;
	}

	.parking-region.changed {
		fill-opacity: 0.22;
		stroke-opacity: 0.85;
		stroke-width: 5;
		stroke-dasharray: 0;
	}

	.parking-region.unchanged {
		fill-opacity: 0.06;
		stroke-opacity: 0.32;
		stroke-width: 3;
	}

	.parking-region:hover,
	.parking-region.active {
		fill-opacity: 0.4;
		stroke-opacity: 1;
		stroke-width: 6;
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.28));
	}

	.parking-region.pinned {
		stroke-dasharray: 8 4;
		stroke-width: 6;
		fill-opacity: 0.36;
		stroke-opacity: 1;
	}

	.parking-region:focus-visible {
		stroke-opacity: 1;
		stroke-width: 7;
	}

	.region-info {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 16px;
		margin-top: 14px;
		border: 1px solid rgba(23, 32, 24, 0.22);
		border-radius: 6px;
		padding: 14px 16px;
		background: rgba(255, 255, 255, 0.86);
		box-shadow: 0 8px 24px rgba(32, 43, 32, 0.07);
	}

	.info-meta {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-width: 60px;
		padding-right: 16px;
		border-right: 1px dashed rgba(23, 32, 24, 0.2);
	}

	.info-spaces {
		font: 700 1.85rem/1 'Geist Mono', monospace;
		color: #172018;
	}

	.info-spaces-label {
		margin-top: 4px;
		font: 700 0.6rem/1 'Geist Mono', monospace;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #66705f;
	}

	.info-body {
		min-width: 0;
	}

	.info-body strong {
		display: flex;
		align-items: center;
		gap: 10px;
		flex-wrap: wrap;
		margin-bottom: 8px;
		font-size: 0.95rem;
		line-height: 1.2;
		font-weight: 700;
	}

	.unpin-btn {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		padding: 3px 8px;
		border: 1px solid rgba(23, 32, 24, 0.3);
		border-radius: 999px;
		background: #172018;
		color: #fffdf7;
		font: 700 0.6rem/1 'Geist Mono', monospace;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background 120ms ease;
	}

	.unpin-btn:hover {
		background: #2a3729;
	}

	.unpin-btn .pin-dot {
		width: 6px;
		height: 6px;
		border-radius: 999px;
		background: #cbff5b;
		box-shadow: 0 0 0 2px rgba(203, 255, 91, 0.25);
	}

	.unpin-btn .x {
		font-size: 0.85rem;
		line-height: 0;
		opacity: 0.7;
	}

	.region-info.is-pinned {
		border-color: rgba(23, 32, 24, 0.45);
		box-shadow: 0 8px 24px rgba(32, 43, 32, 0.12), inset 3px 0 0 0 #172018;
	}

	.comparison {
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: stretch;
		gap: 8px;
		max-width: 460px;
	}

	.comparison .chip {
		border: 1.5px solid var(--chip-stroke);
		border-radius: 5px;
		background: color-mix(in srgb, var(--chip-fill) 50%, white);
		padding: 6px 9px;
		color: #172018;
	}

	.comparison small,
	.comparison b {
		display: block;
	}

	.comparison small {
		margin-bottom: 2px;
		font: 700 0.58rem/1 'Geist Mono', monospace;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(23, 32, 24, 0.6);
	}

	.comparison b {
		font-size: 0.78rem;
		line-height: 1.15;
		font-weight: 700;
	}

	.comparison i {
		align-self: center;
		color: rgba(23, 32, 24, 0.5);
		font: 700 1rem/1 'Geist Mono', monospace;
		font-style: normal;
	}

	.single-state {
		display: flex;
		align-items: center;
		gap: 12px;
		flex-wrap: wrap;
		max-width: 460px;
	}

	.single-state .chip {
		border: 1.5px solid var(--chip-stroke);
		border-radius: 5px;
		background: color-mix(in srgb, var(--chip-fill) 50%, white);
		padding: 6px 9px;
		color: #172018;
		min-width: 0;
	}

	.single-state .chip small {
		display: block;
		margin-bottom: 2px;
		font: 700 0.58rem/1 'Geist Mono', monospace;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: rgba(23, 32, 24, 0.6);
	}

	.single-state .chip b {
		display: block;
		font-size: 0.78rem;
		line-height: 1.15;
		font-weight: 700;
	}

	.no-change {
		font: 700 0.66rem/1 'Geist Mono', monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #66705f;
	}

	.no-change::before {
		content: '·  ';
		color: rgba(23, 32, 24, 0.4);
	}

	.info-flag {
		align-self: start;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 5px 9px;
		border: 1px solid rgba(244, 167, 50, 0.7);
		border-radius: 4px;
		background: rgba(255, 215, 93, 0.18);
		color: #87560f;
		font: 800 0.62rem/1 'Geist Mono', monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		font-style: normal;
	}

	.legend {
		display: grid;
		align-content: start;
		gap: 12px;
	}

	.summary {
		border: 1px solid rgba(23, 32, 24, 0.22);
		border-radius: 6px;
		padding: 14px;
		background: rgba(255, 255, 255, 0.78);
		backdrop-filter: blur(12px);
		box-shadow: 0 8px 24px rgba(32, 43, 32, 0.07);
	}

	.summary p {
		margin: 0 0 10px;
		padding-bottom: 8px;
		border-bottom: 1px dashed rgba(23, 32, 24, 0.2);
		font: 700 0.66rem/1 'Geist Mono', monospace;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #596653;
	}

	.summary dl {
		margin: 0;
		display: grid;
		gap: 8px;
	}

	.summary .row {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 8px;
	}

	.summary dt {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 0.82rem;
		color: #2a3729;
	}

	.summary dt .dot {
		width: 9px;
		height: 9px;
		border-radius: 2px;
	}

	.summary dt .dot.students {
		background: #cbff5b;
		box-shadow: inset 0 0 0 1.5px #48a837;
	}

	.summary dt .dot.faculty {
		background: #d9edff;
		box-shadow: inset 0 0 0 1.5px #0678ff;
	}

	.summary dt .dot.ada {
		background: #f2f4f3;
		box-shadow: inset 0 0 0 1.5px #68736c;
	}

	.summary dd {
		margin: 0;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font: 700 0.85rem/1 'Geist Mono', monospace;
	}

	.summary dd .num {
		min-width: 22px;
		text-align: right;
		color: #172018;
	}

	.summary dd .num.to {
		color: #1d4f12;
	}

	.summary dd .arrow {
		color: rgba(23, 32, 24, 0.4);
		font-size: 0.82rem;
	}

	.region-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 6px;
	}

	.legend-item {
		position: relative;
		display: grid;
		grid-template-columns: 32px 1fr auto;
		align-items: center;
		gap: 10px;
		width: 100%;
		border: 1px solid rgba(23, 32, 24, 0.18);
		border-radius: 6px;
		padding: 9px 10px;
		background: rgba(255, 255, 255, 0.6);
		text-align: left;
		cursor: pointer;
		font-family: inherit;
		color: inherit;
		transition:
			transform 120ms ease,
			border-color 120ms ease,
			background 120ms ease;
	}

	.legend-item:hover,
	.legend-item.active {
		transform: translateX(-2px);
		border-color: rgba(23, 32, 24, 0.55);
		background: rgba(255, 255, 255, 0.96);
	}

	.legend-item.active {
		box-shadow: -3px 0 0 0 #172018;
	}

	.key {
		display: block;
		width: 28px;
		height: 18px;
		border: 2.5px solid var(--key-stroke);
		border-radius: 3px;
		background: color-mix(in srgb, var(--key-fill) 60%, transparent);
	}

	.legend-text {
		min-width: 0;
		display: block;
	}

	.legend-text strong,
	.legend-text small {
		display: block;
	}

	.legend-text strong {
		font-size: 0.82rem;
		line-height: 1.15;
	}

	.legend-text small {
		margin-top: 2px;
		color: #66705f;
		font-size: 0.7rem;
	}

	.legend-text small .mono {
		font: 700 0.7rem/1 'Geist Mono', monospace;
		color: #2a3729;
	}

	.legend-flag {
		font: 900 1rem/1 'Geist Mono', monospace;
		color: #c87a13;
	}

	@media (max-width: 920px) {
		.parking-header {
			align-items: start;
			flex-direction: column;
		}

		.header-tools {
			width: 100%;
		}

		.parking-stage {
			grid-template-columns: 1fr;
		}

		.compare-grid {
			grid-template-columns: 1fr;
		}

		.region-info {
			grid-template-columns: 1fr;
		}

		.info-meta {
			flex-direction: row;
			gap: 8px;
			padding-right: 0;
			padding-bottom: 10px;
			border-right: 0;
			border-bottom: 1px dashed rgba(23, 32, 24, 0.2);
			justify-content: flex-start;
		}
	}

	@media (max-width: 560px) {
		.page-shell {
			padding: 12px;
		}

		.mode-control {
			width: 100%;
		}

		.mode-control button {
			padding: 0 10px;
		}
	}
</style>
