<script lang="ts">
	import { page } from '$app/state';
	import {
		demandDays,
		demandLabel,
		demandMethod,
		demandSources,
		demandTimes,
		parkingDemand,
		type ParkingDemandPoint
	} from '$lib/parking-demand';

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

	type PressureView = 'chart' | 'heatmap';

	let hoveredId = $state<string | null>(null);
	let pinnedId = $state<string | null>(null);
	let activeDemand = $state<ParkingDemandPoint | null>(null);
	let view = $state<ViewMode>('current');
	let pressureView = $state<PressureView>('chart');
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
	const peakDemand = $derived.by(() =>
		parkingDemand.reduce((peak, point) => (point.totalMax > peak.totalMax ? point : peak), parkingDemand[0])
	);
	const demandBySlot = $derived.by(() => {
		const slots = new Map<string, ParkingDemandPoint>();
		for (const point of parkingDemand) {
			slots.set(`${point.day}-${point.time}`, point);
		}
		return slots;
	});
	const currentStudentSpaces = $derived(totals.current.Students);
	const proposedStudentSpaces = $derived(totals.proposed.Students);
	const selectedDemand = $derived(activeDemand ?? peakDemand);
	const chartMax = $derived(
		Math.max(120, Math.ceil(peakDemand.totalMax / 30) * 30 + 20)
	);
	const currentPct = $derived((currentStudentSpaces / chartMax) * 100);
	const proposedPct = $derived((proposedStudentSpaces / chartMax) * 100);
	const yTicks = $derived.by(() => {
		const step = chartMax / 4;
		return [0, 1, 2, 3, 4].map((i) => Math.round(i * step));
	});
	const weekTotalDemand = $derived(
		parkingDemand.reduce((sum, p) => sum + p.totalMax, 0)
	);
	const currentCoverage = $derived(
		parkingDemand.reduce((sum, p) => sum + Math.min(p.totalMax, currentStudentSpaces), 0)
	);
	const proposedCoverage = $derived(
		parkingDemand.reduce((sum, p) => sum + Math.min(p.totalMax, proposedStudentSpaces), 0)
	);
	const rescuedCoverage = $derived(proposedCoverage - currentCoverage);
	const unallocatedDemand = $derived(weekTotalDemand - proposedCoverage);
	const overCurrentCount = $derived(
		parkingDemand.filter((p) => p.totalMax > currentStudentSpaces).length
	);
	const overProposedCount = $derived(
		parkingDemand.filter((p) => p.totalMax > proposedStudentSpaces).length
	);
	const rescuedCount = $derived(overCurrentCount - overProposedCount);
	const currentCoveragePct = $derived(
		Math.round((currentCoverage / weekTotalDemand) * 100)
	);
	const rescuedPct = $derived(
		Math.round((rescuedCoverage / weekTotalDemand) * 100)
	);
	const unallocatedPct = $derived(
		Math.max(0, 100 - currentCoveragePct - rescuedPct)
	);
	const headroomTotal = $derived(
		parkingDemand.reduce(
			(sum, p) => sum + Math.max(0, proposedStudentSpaces - p.totalMax),
			0
		)
	);
	const currentFaculty = $derived(totals.current['Faculty/staff']);
	const proposedFaculty = $derived(totals.proposed['Faculty/staff']);
	const facultyDelta = $derived(proposedFaculty - currentFaculty);
	const facultyDeltaPct = $derived(
		Math.round((Math.abs(facultyDelta) / currentFaculty) * 100)
	);

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

	function demandFor(day: string, time: string) {
		return demandBySlot.get(`${day}-${time}`);
	}

	function demandIntensity(point: ParkingDemandPoint) {
		return Math.max(0.08, point.totalMax / peakDemand.totalMax);
	}

	function demandClass(point: ParkingDemandPoint) {
		if (point.totalMax > proposedStudentSpaces) return 'over-proposed';
		if (point.totalMax > currentStudentSpaces) return 'over-current';
		if (point.totalMax >= currentStudentSpaces) return 'at-current';
		return 'within';
	}

	function pressureSegments(point: ParkingDemandPoint) {
		const v = point.totalMax;
		const green = Math.min(v, currentStudentSpaces);
		const amber = Math.max(0, Math.min(v, proposedStudentSpaces) - currentStudentSpaces);
		const red = Math.max(0, v - proposedStudentSpaces);
		return { green, amber, red, total: v };
	}

	function compactTime(time: string) {
		return time.replace(' AM', 'a').replace(' PM', 'p');
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

	{#if !isEmbed}
		<section class="demand-panel" aria-labelledby="demand-title">
			<div class="demand-copy">
				<p class="eyebrow">
					<span class="dot"></span>
					Session-weighted estimate
				</p>
				<h2 id="demand-title">Weekly Parking Pressure</h2>
				<p>
					The highest pressure windows recur when multiple academic cohorts overlap with
					NSU-based clinical activity. Peak estimated demand is
					<strong>{demandLabel(peakDemand)} students</strong> on {peakDemand.day}
					{peakDemand.time}, compared with {currentStudentSpaces} current student spaces and
					{proposedStudentSpaces} proposed student spaces.
				</p>
			</div>

			<div class="demand-summary" aria-label="Demand thresholds">
				<div>
					<span>{currentStudentSpaces}</span>
					<small>current student spaces</small>
				</div>
				<div>
					<span>{proposedStudentSpaces}</span>
					<small>proposed student spaces</small>
				</div>
				<div>
					<span>{demandLabel(peakDemand)}</span>
					<small>estimated peak</small>
				</div>
			</div>

			<section class="coverage-banner" aria-labelledby="impact-title">
				<header class="coverage-head">
					<p class="eyebrow">
						<span class="dot"></span>
						Proposal impact
					</p>
					<h3 id="impact-title">
						<span class="impact-num">+{proposedStudentSpaces - currentStudentSpaces}</span>
						student spaces resolves <span class="impact-num">{rescuedCount}</span> of
						<span class="impact-num">{overCurrentCount}</span> over-capacity windows this week.
					</h3>
				</header>

				<div class="coverage-bar" role="img" aria-label={`Coverage breakdown: ${currentCoveragePct}% served by current cap, ${rescuedPct}% rescued by proposal, ${unallocatedPct}% still unallocated`}>
					<span class="coverage-seg green" style:flex-grow={currentCoverage}>
						<span class="seg-label">{currentCoveragePct}%</span>
					</span>
					<span class="coverage-seg amber" style:flex-grow={rescuedCoverage}>
						{#if rescuedPct >= 4}
							<span class="seg-label">+{rescuedPct}%</span>
						{/if}
					</span>
					<span class="coverage-seg red" style:flex-grow={Math.max(unallocatedDemand, 1)}>
						{#if unallocatedPct >= 4}
							<span class="seg-label">{unallocatedPct}%</span>
						{/if}
					</span>
				</div>

				<dl class="coverage-stats">
					<div class="stat current">
						<dt>
							<i></i>
							Served by current cap
						</dt>
						<dd>
							<b>{currentCoverage.toLocaleString()}</b>
							<small>student-hours · {currentCoveragePct}% of weekly demand</small>
						</dd>
					</div>
					<div class="stat rescued">
						<dt>
							<i></i>
							Rescued by proposal
						</dt>
						<dd>
							<b>+{rescuedCoverage.toLocaleString()}</b>
							<small>student-hours newly accommodated · {rescuedCount} windows brought within cap</small>
						</dd>
					</div>
					<div class="stat overflow">
						<dt>
							<i></i>
							Still unallocated
						</dt>
						<dd>
							<b>{unallocatedDemand.toLocaleString()}</b>
							<small>student-hours over proposed cap · {overProposedCount} peak windows remain</small>
						</dd>
					</div>
					<div class="stat headroom">
						<dt>
							<i></i>
							Headroom under cap
						</dt>
						<dd>
							<b>{headroomTotal.toLocaleString()}</b>
							<small>student-hours of unused capacity below proposed cap</small>
						</dd>
					</div>
				</dl>
			</section>

			<div class="pressure-toolbar">
				<span class="toolbar-label">Visualization</span>
				<div class="pressure-switch" role="tablist" aria-label="Pressure visualization">
					<button
						type="button"
						role="tab"
						class:active={pressureView === 'chart'}
						aria-selected={pressureView === 'chart'}
						onclick={() => (pressureView = 'chart')}
					>
						<span class="switch-glyph" aria-hidden="true">▮▮</span>
						Bars
					</button>
					<button
						type="button"
						role="tab"
						class:active={pressureView === 'heatmap'}
						aria-selected={pressureView === 'heatmap'}
						onclick={() => (pressureView = 'heatmap')}
					>
						<span class="switch-glyph" aria-hidden="true">▦</span>
						Heatmap
					</button>
				</div>
			</div>

			{#if pressureView === 'chart'}
			<figure class="pressure-chart" aria-label="Weekly student parking demand vs capacity">
				<figcaption class="chart-caption">
					<span class="caption-axis">Students parked</span>
					<span class="caption-rule"></span>
				</figcaption>
				<div class="chart-frame">
					<div class="y-axis" aria-hidden="true">
						{#each yTicks as tick}
							<span class="y-tick" style:bottom={`${(tick / chartMax) * 100}%`}>{tick}</span>
						{/each}
					</div>
					<div class="chart-scroll">
						<div class="chart-plot">
							{#each yTicks as tick}
								<span
									class="gridline"
									class:axis={tick === 0}
									style:bottom={`${(tick / chartMax) * 100}%`}
								></span>
							{/each}

							<span class="threshold-line proposed" style:bottom={`${proposedPct}%`}></span>
							<span class="threshold-line current" style:bottom={`${currentPct}%`}></span>
							<span class="threshold-tag proposed" style:bottom={`${proposedPct}%`}>
								<i></i>Proposed cap · {proposedStudentSpaces}
							</span>
							<span class="threshold-tag current" style:bottom={`${currentPct}%`}>
								<i></i>Current cap · {currentStudentSpaces}
							</span>

							{#each demandDays as day, dayIndex}
								<div class="day-group" class:alt={dayIndex % 2 === 1}>
									{#each demandTimes as time}
										{@const point = demandFor(day, time)}
										{#if point}
											{@const seg = pressureSegments(point)}
											{@const overflow = seg.red > 0 || seg.amber > 0}
											<button
												type="button"
												class="bar-cell"
												class:active={activeDemand === point}
												class:overflow
												aria-label={`${day} ${time}: estimated demand ${demandLabel(point)} students`}
												onclick={() => {
													activeDemand = activeDemand === point ? null : point;
												}}
												onmouseenter={() => {
													activeDemand = point;
												}}
												onfocus={() => {
													activeDemand = point;
												}}
											>
												<span class="bar-track">
													<span
														class="bar-fill"
														style:height={`${(seg.total / chartMax) * 100}%`}
													>
														{#if seg.red > 0}
															<span class="seg red" style:flex-grow={seg.red}></span>
														{/if}
														{#if seg.amber > 0}
															<span class="seg amber" style:flex-grow={seg.amber}></span>
														{/if}
														{#if seg.green > 0}
															<span class="seg green" style:flex-grow={seg.green}></span>
														{/if}
													</span>
													<span class="bar-value" class:show={overflow}>
														{demandLabel(point)}
													</span>
												</span>
												<span class="bar-tick">{compactTime(time)}</span>
											</button>
										{/if}
									{/each}
								</div>
							{/each}
						</div>
						<div class="x-axis" aria-hidden="true">
							{#each demandDays as day}
								<span class="x-day">
									<em>{day.slice(0, 3)}</em>
									<span class="x-rule"></span>
								</span>
							{/each}
						</div>
					</div>
				</div>

				<div class="chart-legend" aria-hidden="true">
					<span class="legend-pill"><i class="swatch green"></i>Served by current cap</span>
					<span class="legend-pill emphasis"><i class="swatch amber"></i>Rescued by proposed cap</span>
					<span class="legend-pill"><i class="swatch red"></i>Unallocated overflow</span>
				</div>
			</figure>
			{:else}
			<div class="heatmap-wrap">
				<div class="heatmap" role="table" aria-label="Estimated weekly student parking demand">
					<div class="heatmap-corner" role="columnheader">Time</div>
					{#each demandDays as day}
						<div class="heatmap-day" role="columnheader">{day.slice(0, 3)}</div>
					{/each}
					{#each demandTimes as time}
						<div class="heatmap-time" role="rowheader">{time}</div>
						{#each demandDays as day}
							{@const point = demandFor(day, time)}
							{#if point}
								<button
									type="button"
									class="heat-cell"
									class:active={activeDemand === point}
									class:over-proposed={demandClass(point) === 'over-proposed'}
									class:over-current={demandClass(point) === 'over-current'}
									class:at-current={demandClass(point) === 'at-current'}
									style={`--pressure:${demandIntensity(point)}`}
									aria-label={`${day} ${time}: estimated demand ${demandLabel(point)} students`}
									onclick={() => {
										activeDemand = activeDemand === point ? null : point;
									}}
									onmouseenter={() => {
										activeDemand = point;
									}}
									onfocus={() => {
										activeDemand = point;
									}}
								>
									<span>{demandLabel(point)}</span>
								</button>
							{/if}
						{/each}
					{/each}
				</div>

				<div class="heatmap-key" aria-hidden="true">
					<span>Lower</span>
					<i></i>
					<span>Peak</span>
				</div>
			</div>
			{/if}

			<div class="demand-detail" aria-live="polite">
				<div class="detail-total">
					<span>{demandLabel(selectedDemand)}</span>
					<small>{selectedDemand.day} · {selectedDemand.time}</small>
				</div>
				<div class="detail-body">
					<p>
						<b>Academic:</b> {selectedDemand.academicSources} ({selectedDemand.academicEstimate})
					</p>
					<p><b>NSU clinic:</b> {selectedDemand.clinicSources} ({selectedDemand.clinicEstimate})</p>
				</div>
			</div>

			<div class="references">
				<div>
					<h3>Method</h3>
					<p>{demandMethod}</p>
				</div>
				<div>
					<h3>References</h3>
					<ul>
						{#each demandSources as source}
							<li><b>{source.label}:</b> {source.note}</li>
						{/each}
					</ul>
				</div>
			</div>
		</section>

		<details class="faculty-outlook" aria-labelledby="outlook-title">
			<summary class="outlook-summary">
				<div class="summary-text">
					<p class="eyebrow">
						<span class="dot"></span>
						Faculty / staff outlook
					</p>
					<h2 id="outlook-title">Should faculty &amp; staff worry about finding a spot?</h2>
					<p class="summary-tease">
						{currentFaculty} → {proposedFaculty} stalls ({facultyDelta},
						{facultyDeltaPct}%). Preliminary read says no —
						<span class="tease-cta">expand for the analysis</span>.
					</p>
				</div>
				<div class="summary-side">
					<div class="verdict low" role="status">
						<span class="verdict-glyph" aria-hidden="true"></span>
						<span class="verdict-stack">
							<em>Preliminary verdict</em>
							<b>Low concern</b>
						</span>
					</div>
					<span class="disclosure-chevron" aria-hidden="true">
						<span class="chev-when-closed">Open analysis</span>
						<span class="chev-when-open">Collapse</span>
						<span class="chev-arrow">⌄</span>
					</span>
				</div>
			</summary>

			<div class="outlook-content">
				<p class="outlook-lead">
					The proposal trims faculty &amp; staff stalls from
					<b>{currentFaculty}</b> to <b>{proposedFaculty}</b>
					<span class="lead-delta">({facultyDelta}, {facultyDeltaPct}% reduction)</span>
					to absorb the documented student peak. Walking through the math, the answer
					is <b>no</b> — under typical staffing patterns this trade is comfortable.
					This is a first-pass read; deeper analysis is pending.
				</p>

				<div class="outlook-numbers" aria-label="Faculty / staff allocation change">
					<div class="num-cell">
						<span class="num-value">{currentFaculty}</span>
						<span class="num-label">stalls today</span>
					</div>
					<span class="num-arrow" aria-hidden="true">→</span>
					<div class="num-cell">
						<span class="num-value">{proposedFaculty}</span>
						<span class="num-label">stalls proposed</span>
					</div>
					<div class="num-cell delta">
						<span class="num-value">{facultyDelta}</span>
						<span class="num-label">net change · {facultyDeltaPct}%</span>
					</div>
					<div class="num-cell context">
						<span class="num-value">{rescuedCount}</span>
						<span class="num-label">student windows<br />resolved by the trade</span>
					</div>
				</div>

				<div class="outlook-body">
					<div class="outlook-points">
						<h3>Why low concern</h3>
						<ul>
							<li>
								<b>The trade is calibrated, not arbitrary.</b>
								The 8-stall reassignment matches the gap between current student
								capacity ({currentStudentSpaces}) and the proposed cap
								({proposedStudentSpaces}). It's the smallest move that resolves
								{rescuedCount} of {overCurrentCount} over-capacity student
								windows — the rest stay over because no realistic reshuffle could
								absorb a 100-student peak.
							</li>
							<li>
								<b>Faculty / staff arrivals are staggered.</b>
								Unlike students, who flood the lot at the start of a class block,
								faculty and staff teach, run clinic, and meet on offset schedules.
								Thirty stalls rarely need to absorb thirty simultaneous arrivals.
							</li>
							<li>
								<b>The east-middle island is unchanged.</b>
								Faculty / staff keep the 16-stall east-middle cluster in both
								plans, which is the closest grouping to the building entrance — the
								spots faculty &amp; staff actually compete for.
							</li>
							<li>
								<b>Overflow exists in both plans.</b>
								{totals.proposed['ADA / unallocated']} ADA / unallocated stalls
								remain, and off-site lots (CNOHC, neighbouring) absorb edge cases
								today and after the change.
							</li>
						</ul>
					</div>

					<div class="outlook-points caveats">
						<h3>Where to keep an eye</h3>
						<ul>
							<li>
								<b>This dataset only counts students.</b>
								Faculty / staff headcount per time slot isn't captured. The
								verdict assumes typical optometry-school staffing (well under 30
								simultaneously present). If the {currentFaculty}-stall
								faculty / staff section is regularly &gt;75% full, the buffer
								shrinks meaningfully.
							</li>
							<li>
								<b>Tuesday and Wednesday mid-mornings</b> coincide with the
								heaviest faculty / staff teaching load. Worth observing the first
								two weeks after a change.
							</li>
							<li>
								<b>Visitor and patient parking</b> isn't separated from
								faculty / staff in either plan. A clinic surge competes for the
								same {proposedFaculty} stalls.
							</li>
						</ul>
					</div>
				</div>

				<p class="outlook-recommendation">
					<span class="rec-tag">Recommendation</span>
					Adopt the proposal and monitor faculty / staff utilization for two to
					three weeks. If average occupancy of the {proposedFaculty}
					faculty / staff stalls stays under ~80% even at peak, the change is
					comfortably absorbed. If it crests 90%, revisit the
					{totals.proposed['ADA / unallocated']} ADA / unallocated stalls as flex
					inventory before adjusting the student allocation.
				</p>

				<p class="outlook-followup">
					<span class="followup-tag">Pending</span>
					A deeper analysis — faculty / staff headcount sampling, observed
					occupancy by hour, and visitor / patient overlap — will land in this
					section as the data comes in.
				</p>
			</div>
		</details>
	{/if}

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

	.demand-panel {
		max-width: 1220px;
		margin: 24px auto 0;
		border: 1px solid rgba(23, 32, 24, 0.2);
		border-radius: 6px;
		padding: clamp(16px, 3vw, 24px);
		background: rgba(255, 253, 247, 0.82);
		box-shadow: 0 14px 38px rgba(38, 48, 38, 0.1);
	}

	.demand-copy {
		display: grid;
		grid-template-columns: minmax(220px, 0.55fr) minmax(280px, 1fr);
		gap: 18px;
		align-items: end;
		padding-bottom: 18px;
		border-bottom: 1px dashed rgba(23, 32, 24, 0.2);
	}

	.demand-copy .eyebrow {
		grid-column: 1 / -1;
		margin-bottom: -4px;
	}

	.demand-copy h2 {
		margin: 0;
		font-size: clamp(1.7rem, 3vw, 2.7rem);
		line-height: 0.95;
		letter-spacing: -0.02em;
	}

	.demand-copy p {
		margin: 0;
		color: #455141;
		font-size: 0.94rem;
		line-height: 1.5;
	}

	.demand-copy strong {
		color: #172018;
	}

	.demand-summary {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 10px;
		margin: 16px 0;
	}

	.demand-summary div {
		border: 1px solid rgba(23, 32, 24, 0.18);
		border-radius: 5px;
		padding: 12px;
		background: rgba(245, 241, 232, 0.62);
	}

	.demand-summary span,
	.detail-total span {
		display: block;
		font: 800 1.75rem/1 'Geist Mono', monospace;
		color: #172018;
	}

	.demand-summary small,
	.detail-total small {
		display: block;
		margin-top: 5px;
		font: 700 0.62rem/1.2 'Geist Mono', monospace;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #66705f;
	}

	.coverage-banner {
		margin: 18px 0 6px;
		padding: 18px;
		border: 1px solid rgba(23, 32, 24, 0.2);
		border-radius: 6px;
		background:
			linear-gradient(135deg, rgba(203, 255, 91, 0.06), transparent 45%),
			rgba(255, 253, 247, 0.78);
		box-shadow: 0 8px 22px rgba(38, 48, 38, 0.06);
	}

	.coverage-head {
		display: grid;
		gap: 8px;
		margin-bottom: 14px;
	}

	.coverage-head .eyebrow {
		margin: 0;
	}

	.coverage-head h3 {
		margin: 0;
		font-size: clamp(1.1rem, 2vw, 1.4rem);
		line-height: 1.25;
		letter-spacing: -0.01em;
		font-weight: 700;
		color: #172018;
		max-width: 64ch;
	}

	.impact-num {
		display: inline-block;
		padding: 0 6px;
		margin: 0 1px;
		border-radius: 4px;
		background: #172018;
		color: #cbff5b;
		font: 800 0.95em/1.1 'Geist Mono', monospace;
		letter-spacing: -0.02em;
	}

	.coverage-bar {
		display: flex;
		align-items: stretch;
		height: 38px;
		border-radius: 5px;
		overflow: hidden;
		border: 1px solid rgba(23, 32, 24, 0.28);
		background: rgba(245, 241, 232, 0.5);
		margin-bottom: 14px;
	}

	.coverage-seg {
		display: flex;
		align-items: center;
		justify-content: center;
		min-width: 0;
		font: 800 0.72rem/1 'Geist Mono', monospace;
		letter-spacing: 0.04em;
		color: #172018;
		position: relative;
		transition: filter 140ms ease;
	}

	.coverage-seg.green {
		background: linear-gradient(180deg, #d6ff6e, #a5d83a);
		color: #1c4d11;
	}

	.coverage-seg.amber {
		background: linear-gradient(180deg, #ffce6e, #f4a732);
		color: #5a3808;
		box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.4), inset -1px 0 0 rgba(0, 0, 0, 0.08);
	}

	.coverage-seg.red {
		background: linear-gradient(180deg, #e0573b, #b83d24);
		color: #fff5f0;
	}

	.coverage-seg .seg-label {
		padding: 0 6px;
		white-space: nowrap;
	}

	.coverage-stats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 10px;
		margin: 0;
	}

	.coverage-stats .stat {
		display: grid;
		gap: 6px;
		padding: 10px 12px;
		border: 1px solid rgba(23, 32, 24, 0.16);
		border-radius: 5px;
		background: rgba(255, 253, 247, 0.6);
	}

	.coverage-stats .stat.headroom {
		border-style: dashed;
	}

	.coverage-stats dt {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font: 700 0.62rem/1.1 'Geist Mono', monospace;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #455141;
	}

	.coverage-stats dt i {
		display: inline-block;
		width: 9px;
		height: 9px;
		border-radius: 2px;
	}

	.coverage-stats .current dt i {
		background: linear-gradient(180deg, #d6ff6e, #a5d83a);
		box-shadow: inset 0 0 0 1px rgba(23, 32, 24, 0.2);
	}

	.coverage-stats .rescued dt i {
		background: linear-gradient(180deg, #ffce6e, #f4a732);
		box-shadow: inset 0 0 0 1px rgba(135, 86, 15, 0.3);
	}

	.coverage-stats .overflow dt i {
		background: linear-gradient(180deg, #e0573b, #b83d24);
		box-shadow: inset 0 0 0 1px rgba(120, 30, 12, 0.3);
	}

	.coverage-stats .headroom dt i {
		background:
			repeating-linear-gradient(
				45deg,
				#d8d2c4 0 3px,
				#f3efe4 3px 6px
			);
		box-shadow: inset 0 0 0 1px rgba(23, 32, 24, 0.25);
	}

	.coverage-stats dd {
		margin: 0;
		display: grid;
		gap: 3px;
	}

	.coverage-stats dd b {
		font: 800 1.4rem/1 'Geist Mono', monospace;
		color: #172018;
		letter-spacing: -0.02em;
	}

	.coverage-stats .rescued dd b {
		color: #87560f;
	}

	.coverage-stats .overflow dd b {
		color: #8e2e1a;
	}

	.coverage-stats dd small {
		font-size: 0.74rem;
		line-height: 1.35;
		color: #66705f;
	}

	.legend-pill.emphasis {
		color: #87560f;
		font-weight: 800;
	}

	.pressure-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		flex-wrap: wrap;
		margin: 4px 0 14px;
		padding-bottom: 12px;
		border-bottom: 1px dashed rgba(23, 32, 24, 0.18);
	}

	.toolbar-label {
		font: 700 0.62rem/1 'Geist Mono', monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #596653;
	}

	.pressure-switch {
		display: inline-grid;
		grid-template-columns: repeat(2, minmax(78px, auto));
		border: 1px solid rgba(23, 32, 24, 0.28);
		border-radius: 6px;
		padding: 3px;
		background: rgba(255, 255, 255, 0.78);
		box-shadow: 0 4px 14px rgba(32, 43, 32, 0.06);
	}

	.pressure-switch button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		min-height: 30px;
		border: 0;
		border-radius: 4px;
		background: transparent;
		padding: 0 12px;
		color: #404e3e;
		font: 700 0.72rem/1 'Geist Mono', monospace;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background 120ms ease, color 120ms ease;
	}

	.pressure-switch button:hover {
		color: #172018;
	}

	.pressure-switch button.active {
		background: #172018;
		color: #fffdf7;
	}

	.pressure-switch .switch-glyph {
		font-size: 0.68rem;
		opacity: 0.75;
		letter-spacing: 0;
	}

	.pressure-chart {
		margin: 4px 0 0;
	}

	.heatmap-wrap {
		overflow-x: auto;
		padding-bottom: 4px;
	}

	.heatmap {
		--cell-min: 92px;
		min-width: 680px;
		display: grid;
		grid-template-columns: 72px repeat(5, minmax(var(--cell-min), 1fr));
		gap: 5px;
	}

	.heatmap-corner,
	.heatmap-day,
	.heatmap-time {
		display: flex;
		align-items: center;
		min-height: 34px;
		color: #596653;
		font: 800 0.68rem/1 'Geist Mono', monospace;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.heatmap-day {
		justify-content: center;
		border-bottom: 1px solid rgba(23, 32, 24, 0.18);
	}

	.heatmap-time {
		justify-content: flex-start;
	}

	.heat-cell {
		position: relative;
		min-height: 54px;
		border: 1px solid rgba(23, 32, 24, 0.18);
		border-radius: 5px;
		background:
			linear-gradient(
				180deg,
				rgba(255, 253, 247, calc(0.72 - (var(--pressure) * 0.28))),
				rgba(255, 253, 247, calc(0.52 - (var(--pressure) * 0.2)))
			),
			color-mix(in srgb, #d5df82 calc(var(--pressure) * 100%), #f3f1e8);
		color: #172018;
		font: 800 0.95rem/1 'Geist Mono', monospace;
		cursor: pointer;
		transition:
			transform 120ms ease,
			border-color 120ms ease,
			box-shadow 120ms ease;
	}

	.heat-cell::after {
		content: '';
		position: absolute;
		inset: auto 7px 7px 7px;
		height: 4px;
		border-radius: 99px;
		background: rgba(23, 32, 24, 0.18);
	}

	.heat-cell.over-current::after,
	.heat-cell.at-current::after {
		background: #c87a13;
	}

	.heat-cell.over-proposed::after {
		background: #b83d24;
	}

	.heat-cell:hover,
	.heat-cell:focus-visible,
	.heat-cell.active {
		z-index: 1;
		transform: translateY(-1px);
		border-color: rgba(23, 32, 24, 0.58);
		box-shadow: 0 8px 18px rgba(38, 48, 38, 0.16);
		outline: none;
	}

	.heat-cell span {
		position: relative;
		z-index: 1;
	}

	.heatmap-key {
		display: grid;
		grid-template-columns: auto minmax(140px, 220px) auto;
		align-items: center;
		gap: 10px;
		margin-top: 10px;
		color: #66705f;
		font: 700 0.62rem/1 'Geist Mono', monospace;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.heatmap-key i {
		height: 8px;
		border-radius: 99px;
		background: linear-gradient(90deg, #f3f1e8, #d5df82, #e29b3a, #b83d24);
		box-shadow: inset 0 0 0 1px rgba(23, 32, 24, 0.12);
	}

	.chart-caption {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 10px;
		color: #596653;
	}

	.caption-axis {
		font: 700 0.62rem/1 'Geist Mono', monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
	}

	.caption-rule {
		flex: 1;
		height: 1px;
		background: repeating-linear-gradient(
			90deg,
			rgba(23, 32, 24, 0.22) 0 4px,
			transparent 4px 8px
		);
	}

	.chart-frame {
		display: grid;
		grid-template-columns: 56px minmax(0, 1fr);
		gap: 10px;
	}

	.y-axis {
		position: relative;
		height: 280px;
	}

	.y-tick {
		position: absolute;
		right: 0;
		transform: translateY(50%);
		padding-right: 8px;
		font: 700 0.66rem/1 'Geist Mono', monospace;
		color: #8a9285;
		letter-spacing: 0.04em;
	}

	.y-tick::after {
		content: '';
		position: absolute;
		right: 0;
		top: 50%;
		width: 4px;
		height: 1px;
		background: rgba(23, 32, 24, 0.4);
	}

	.chart-scroll {
		overflow-x: auto;
		padding-bottom: 4px;
	}

	.chart-plot {
		position: relative;
		min-width: 680px;
		height: 280px;
		display: flex;
		align-items: stretch;
		gap: 14px;
		padding: 0;
	}

	.gridline {
		position: absolute;
		left: 0;
		right: 0;
		height: 1px;
		background: rgba(23, 32, 24, 0.08);
		pointer-events: none;
	}

	.gridline.axis {
		background: rgba(23, 32, 24, 0.45);
	}

	.threshold-line {
		position: absolute;
		left: 0;
		right: 0;
		height: 0;
		border-top: 1.5px dashed transparent;
		pointer-events: none;
		z-index: 2;
	}

	.threshold-line.proposed {
		border-top-color: rgba(244, 167, 50, 0.85);
	}

	.threshold-line.current {
		border-top-color: rgba(72, 168, 55, 0.85);
	}

	.threshold-tag {
		position: absolute;
		transform: translateY(50%);
		display: inline-flex;
		align-items: center;
		gap: 7px;
		padding: 4px 9px 4px 7px;
		border-radius: 3px;
		font: 700 0.6rem/1 'Geist Mono', monospace;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		white-space: nowrap;
		z-index: 3;
		pointer-events: none;
		box-shadow: 0 2px 6px rgba(38, 48, 38, 0.08);
	}

	.threshold-tag i {
		display: inline-block;
		width: 8px;
		height: 8px;
		border-radius: 2px;
	}

	.threshold-tag.proposed {
		right: 8px;
		background: #fff5e0;
		color: #87560f;
		border: 1px solid rgba(244, 167, 50, 0.7);
	}

	.threshold-tag.proposed i {
		background: #f4a732;
	}

	.threshold-tag.current {
		left: 8px;
		background: #ecffcf;
		color: #245e1d;
		border: 1px solid rgba(72, 168, 55, 0.7);
	}

	.threshold-tag.current i {
		background: #cbff5b;
		box-shadow: inset 0 0 0 1.5px #48a837;
	}

	.day-group {
		flex: 1;
		display: flex;
		align-items: stretch;
		gap: 4px;
		padding: 0 6px;
		border-radius: 4px;
		background: rgba(255, 253, 247, 0.35);
		transition: background 140ms ease;
	}

	.day-group.alt {
		background: rgba(245, 241, 232, 0.45);
	}

	.day-group:hover {
		background: rgba(255, 253, 247, 0.85);
	}

	.bar-cell {
		flex: 1;
		min-width: 14px;
		display: flex;
		flex-direction: column;
		align-items: stretch;
		gap: 6px;
		border: 0;
		background: transparent;
		padding: 0 0 4px;
		cursor: pointer;
		font-family: inherit;
		color: inherit;
		position: relative;
	}

	.bar-track {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		align-items: stretch;
	}

	.bar-fill {
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
		min-height: 2px;
		border-radius: 2px 2px 0 0;
		overflow: hidden;
		box-shadow: inset 0 0 0 1px rgba(23, 32, 24, 0.34);
		transition:
			transform 140ms cubic-bezier(0.2, 0.8, 0.2, 1),
			filter 140ms ease,
			box-shadow 140ms ease;
		z-index: 1;
	}

	.seg {
		display: block;
		min-height: 1px;
	}

	.seg.green {
		background: linear-gradient(180deg, #d6ff6e 0%, #b9ec4f 60%, #a5d83a 100%);
	}

	.seg.amber {
		background: linear-gradient(180deg, #ffce6e 0%, #f4a732 100%);
		box-shadow: inset 0 -1px 0 rgba(135, 86, 15, 0.2);
	}

	.seg.red {
		background: linear-gradient(180deg, #e0573b 0%, #b83d24 100%);
		box-shadow: inset 0 -1px 0 rgba(120, 30, 12, 0.3);
	}

	.bar-cell:hover .bar-fill,
	.bar-cell:focus-visible .bar-fill,
	.bar-cell.active .bar-fill {
		transform: translateY(-2px);
		filter: brightness(1.04) saturate(1.05);
		box-shadow:
			inset 0 0 0 1px rgba(23, 32, 24, 0.6),
			0 8px 18px rgba(38, 48, 38, 0.18);
	}

	.bar-cell:focus-visible {
		outline: none;
	}

	.bar-cell:focus-visible .bar-fill {
		box-shadow:
			inset 0 0 0 1.5px #172018,
			0 8px 18px rgba(38, 48, 38, 0.22);
	}

	.bar-value {
		position: absolute;
		left: 50%;
		transform: translate(-50%, -100%);
		top: 0;
		margin-top: -4px;
		padding: 2px 5px;
		border-radius: 3px;
		background: #172018;
		color: #fffdf7;
		font: 800 0.6rem/1 'Geist Mono', monospace;
		letter-spacing: 0.04em;
		opacity: 0;
		pointer-events: none;
		transition: opacity 140ms ease;
		z-index: 4;
		white-space: nowrap;
	}

	.bar-value.show {
		opacity: 1;
		background: rgba(23, 32, 24, 0.86);
	}

	.bar-cell:hover .bar-value,
	.bar-cell:focus-visible .bar-value,
	.bar-cell.active .bar-value {
		opacity: 1;
	}

	.bar-tick {
		display: block;
		text-align: center;
		font: 700 0.55rem/1 'Geist Mono', monospace;
		letter-spacing: 0.02em;
		color: #8a9285;
	}

	.bar-cell:hover .bar-tick,
	.bar-cell.active .bar-tick {
		color: #172018;
	}

	.x-axis {
		display: flex;
		gap: 14px;
		margin-top: 10px;
	}

	.x-day {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}

	.x-day em {
		font: 800 0.74rem/1 'Geist Mono', monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #2a3729;
		font-style: normal;
	}

	.x-rule {
		flex: 1;
		height: 1px;
		background: rgba(23, 32, 24, 0.18);
	}

	.chart-legend {
		display: flex;
		flex-wrap: wrap;
		gap: 8px 14px;
		margin-top: 18px;
		padding-top: 14px;
		border-top: 1px dashed rgba(23, 32, 24, 0.2);
	}

	.legend-pill {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font: 700 0.66rem/1 'Geist Mono', monospace;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #455141;
	}

	.legend-pill .swatch {
		display: inline-block;
		width: 16px;
		height: 10px;
		border-radius: 2px;
		box-shadow: inset 0 0 0 1px rgba(23, 32, 24, 0.3);
	}

	.legend-pill .swatch.green {
		background: linear-gradient(180deg, #d6ff6e, #a5d83a);
	}

	.legend-pill .swatch.amber {
		background: linear-gradient(180deg, #ffce6e, #f4a732);
	}

	.legend-pill .swatch.red {
		background: linear-gradient(180deg, #e0573b, #b83d24);
	}

	.demand-detail {
		display: grid;
		grid-template-columns: 110px 1fr;
		gap: 14px;
		align-items: start;
		margin-top: 16px;
		border: 1px solid rgba(23, 32, 24, 0.18);
		border-radius: 5px;
		padding: 14px;
		background: rgba(255, 255, 255, 0.68);
	}

	.detail-body {
		display: grid;
		gap: 7px;
		color: #3d483a;
		font-size: 0.86rem;
		line-height: 1.35;
	}

	.detail-body p {
		margin: 0;
	}

	.detail-body b {
		color: #172018;
	}

	.references {
		display: grid;
		grid-template-columns: minmax(0, 1fr) minmax(260px, 0.8fr);
		gap: 18px;
		margin-top: 16px;
		padding-top: 16px;
		border-top: 1px dashed rgba(23, 32, 24, 0.2);
		color: #4d5a4b;
		font-size: 0.82rem;
		line-height: 1.45;
	}

	.references h3 {
		margin: 0 0 8px;
		font: 800 0.66rem/1 'Geist Mono', monospace;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: #172018;
	}

	.references p,
	.references ul {
		margin: 0;
	}

	.references ul {
		padding-left: 18px;
	}

	.references li + li {
		margin-top: 6px;
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

		.demand-copy,
		.references {
			grid-template-columns: 1fr;
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

		.demand-summary,
		.demand-detail {
			grid-template-columns: 1fr;
		}

		.coverage-stats {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 920px) {
		.coverage-stats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	.faculty-outlook {
		max-width: 1220px;
		margin: 24px auto 0;
		border: 1px solid rgba(23, 32, 24, 0.2);
		border-radius: 6px;
		background:
			linear-gradient(180deg, rgba(255, 253, 247, 0.92), rgba(255, 253, 247, 0.78));
		box-shadow: 0 14px 38px rgba(38, 48, 38, 0.1);
		overflow: hidden;
	}

	.faculty-outlook[open] {
		box-shadow: 0 18px 42px rgba(38, 48, 38, 0.14);
	}

	.outlook-summary {
		list-style: none;
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		gap: 24px;
		align-items: center;
		padding: clamp(18px, 2.6vw, 26px) clamp(20px, 3vw, 32px);
		cursor: pointer;
		transition: background 140ms ease;
	}

	.outlook-summary::-webkit-details-marker {
		display: none;
	}

	.outlook-summary:hover {
		background: rgba(255, 253, 247, 0.6);
	}

	.outlook-summary:focus-visible {
		outline: 2px solid #172018;
		outline-offset: -2px;
	}

	.faculty-outlook[open] .outlook-summary {
		border-bottom: 1px dashed rgba(23, 32, 24, 0.2);
	}

	.summary-text h2 {
		margin: 4px 0 8px;
		font-size: clamp(1.45rem, 2.6vw, 2rem);
		line-height: 1.05;
		letter-spacing: -0.02em;
		font-weight: 700;
	}

	.summary-tease {
		margin: 0;
		max-width: 60ch;
		font-size: 0.88rem;
		line-height: 1.45;
		color: #455141;
	}

	.tease-cta {
		font: 700 0.78rem/1 'Geist Mono', monospace;
		letter-spacing: 0.06em;
		color: #172018;
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1.5px;
	}

	.summary-side {
		display: grid;
		gap: 10px;
		justify-items: end;
	}

	.disclosure-chevron {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 10px 6px 12px;
		border: 1px solid rgba(23, 32, 24, 0.32);
		border-radius: 4px;
		background: #fffdf7;
		font: 700 0.66rem/1 'Geist Mono', monospace;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #172018;
	}

	.chev-arrow {
		display: inline-block;
		transition: transform 200ms ease;
		font-size: 0.95rem;
		line-height: 0.7;
	}

	.faculty-outlook[open] .chev-arrow {
		transform: rotate(180deg);
	}

	.chev-when-open {
		display: none;
	}

	.faculty-outlook[open] .chev-when-open {
		display: inline;
	}

	.faculty-outlook[open] .chev-when-closed {
		display: none;
	}

	.outlook-content {
		padding: clamp(20px, 3vw, 32px);
	}

	.outlook-lead {
		margin: 0 0 18px;
		max-width: 62ch;
		color: #455141;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.outlook-lead b {
		color: #172018;
	}

	.lead-delta {
		font: 700 0.78rem/1.2 'Geist Mono', monospace;
		color: #87560f;
		letter-spacing: 0.02em;
	}

	.verdict {
		display: inline-flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px 12px 14px;
		border-radius: 6px;
		border: 1px solid rgba(72, 168, 55, 0.55);
		background: linear-gradient(135deg, #ecffcf, #d6f5a3);
		color: #1c4d11;
		box-shadow: 0 6px 18px rgba(72, 168, 55, 0.18);
		flex-shrink: 0;
	}

	.verdict-glyph {
		width: 12px;
		height: 12px;
		border-radius: 99px;
		background: #48a837;
		box-shadow:
			0 0 0 4px rgba(72, 168, 55, 0.18),
			inset 0 0 0 2px #cbff5b;
	}

	.verdict-stack {
		display: grid;
		gap: 3px;
		line-height: 1;
	}

	.verdict-stack em {
		font: 700 0.6rem/1 'Geist Mono', monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(28, 77, 17, 0.7);
		font-style: normal;
	}

	.verdict-stack b {
		font: 800 1.05rem/1 'Geist', sans-serif;
		letter-spacing: -0.01em;
	}

	.outlook-numbers {
		display: grid;
		grid-template-columns: 1fr auto 1fr 1fr 1fr;
		align-items: center;
		gap: 10px;
		margin: 18px 0 22px;
	}

	.num-cell {
		display: grid;
		gap: 5px;
		padding: 14px 16px;
		border: 1px solid rgba(23, 32, 24, 0.18);
		border-radius: 5px;
		background: rgba(245, 241, 232, 0.5);
	}

	.num-cell.delta {
		border-style: dashed;
		border-color: rgba(135, 86, 15, 0.45);
		background: rgba(255, 245, 224, 0.6);
	}

	.num-cell.context {
		border-color: rgba(72, 168, 55, 0.45);
		background: rgba(213, 240, 174, 0.45);
	}

	.num-value {
		font: 800 2rem/1 'Geist Mono', monospace;
		color: #172018;
		letter-spacing: -0.02em;
	}

	.num-cell.delta .num-value {
		color: #87560f;
	}

	.num-cell.context .num-value {
		color: #1c4d11;
	}

	.num-label {
		font: 700 0.62rem/1.25 'Geist Mono', monospace;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: #66705f;
	}

	.num-arrow {
		text-align: center;
		font: 700 1.4rem/1 'Geist Mono', monospace;
		color: rgba(23, 32, 24, 0.45);
	}

	.outlook-body {
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
		gap: 22px;
		padding-top: 4px;
	}

	.outlook-points h3 {
		margin: 0 0 10px;
		font: 800 0.72rem/1 'Geist Mono', monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #172018;
		padding-bottom: 8px;
		border-bottom: 1px dashed rgba(23, 32, 24, 0.2);
	}

	.outlook-points.caveats h3 {
		color: #87560f;
		border-bottom-color: rgba(135, 86, 15, 0.3);
	}

	.outlook-points ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 12px;
	}

	.outlook-points li {
		position: relative;
		padding: 10px 12px 10px 26px;
		border-radius: 4px;
		font-size: 0.88rem;
		line-height: 1.45;
		color: #3d483a;
		background: rgba(255, 253, 247, 0.5);
	}

	.outlook-points li::before {
		content: '';
		position: absolute;
		left: 12px;
		top: 18px;
		width: 6px;
		height: 6px;
		border-radius: 99px;
		background: #48a837;
		box-shadow: 0 0 0 2px rgba(72, 168, 55, 0.18);
	}

	.outlook-points.caveats li::before {
		background: #f4a732;
		box-shadow: 0 0 0 2px rgba(244, 167, 50, 0.2);
	}

	.outlook-points li b {
		color: #172018;
	}

	.outlook-recommendation {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 14px;
		align-items: start;
		margin: 20px 0 0;
		padding: 14px 16px;
		border-radius: 5px;
		border: 1px solid rgba(23, 32, 24, 0.28);
		background: #172018;
		color: #f5f1e8;
		font-size: 0.9rem;
		line-height: 1.5;
	}

	.rec-tag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 4px 9px;
		border-radius: 3px;
		background: #cbff5b;
		color: #1c4d11;
		font: 800 0.62rem/1 'Geist Mono', monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.outlook-followup {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 14px;
		align-items: start;
		margin: 12px 0 0;
		padding: 12px 14px;
		border: 1px dashed rgba(23, 32, 24, 0.32);
		border-radius: 5px;
		background: rgba(245, 241, 232, 0.55);
		font-size: 0.82rem;
		line-height: 1.5;
		color: #4d5a4b;
	}

	.followup-tag {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 4px 9px;
		border-radius: 3px;
		border: 1px solid rgba(23, 32, 24, 0.34);
		background: #fffdf7;
		color: #172018;
		font: 800 0.6rem/1 'Geist Mono', monospace;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		white-space: nowrap;
	}

	@media (max-width: 920px) {
		.outlook-summary {
			grid-template-columns: 1fr;
		}

		.summary-side {
			justify-items: start;
			grid-template-columns: 1fr auto;
			grid-auto-flow: column;
			align-items: center;
			width: 100%;
		}

		.outlook-numbers {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.num-arrow {
			display: none;
		}

		.outlook-body {
			grid-template-columns: 1fr;
		}

		.outlook-recommendation,
		.outlook-followup {
			grid-template-columns: 1fr;
		}
	}
</style>
