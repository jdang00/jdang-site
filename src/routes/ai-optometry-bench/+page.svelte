<script lang="ts">
	import { fade } from 'svelte/transition';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';

	type CategoryKey =
		| 'leadingDiagnosis'
		| 'featureRecognition'
		| 'differentialReasoning'
		| 'immediateManagement'
		| 'treatmentEvidence'
		| 'shiftFactors'
		| 'safetyScope'
		| 'clarity';
	type RankKey = CategoryKey | 'total';

	type ModelScore = {
		model: string;
		short: string;
		total: number;
		leadingDiagnosis: number;
		featureRecognition: number;
		differentialReasoning: number;
		immediateManagement: number;
		treatmentEvidence: number;
		shiftFactors: number;
		safetyScope: number;
		clarity: number;
		takeaway: string;
		strength: string;
		weakness: string;
		errorFlags: string[];
	};

	const categories: { key: CategoryKey; label: string; max: number; color: string }[] = [
		{ key: 'leadingDiagnosis', label: 'Leading diagnosis', max: 20, color: '#d97706' },
		{ key: 'featureRecognition', label: 'Feature recognition', max: 15, color: '#f59e0b' },
		{ key: 'differentialReasoning', label: 'Differential reasoning', max: 15, color: '#84cc16' },
		{ key: 'immediateManagement', label: 'Immediate management', max: 15, color: '#10b981' },
		{ key: 'treatmentEvidence', label: 'Treatment evidence', max: 15, color: '#06b6d4' },
		{ key: 'shiftFactors', label: 'Shift factors', max: 10, color: '#3b82f6' },
		{ key: 'safetyScope', label: 'Safety / scope', max: 5, color: '#6366f1' },
		{ key: 'clarity', label: 'Clarity', max: 5, color: '#a855f7' }
	];

	const models: ModelScore[] = [
		{
			model: 'GPT-5.5',
			short: 'GPT',
			total: 97,
			leadingDiagnosis: 20,
			featureRecognition: 15,
			differentialReasoning: 14,
			immediateManagement: 14,
			treatmentEvidence: 15,
			shiftFactors: 9,
			safetyScope: 5,
			clarity: 5,
			takeaway:
				'Best overall. It recognized filamentous fungal keratitis, handled the urgent triage problem, and used the evidence without getting lost in trivia.',
			strength: 'Integrated mechanism, timeline, morphology, urgency, and natamycin evidence.',
			weakness:
				'Slightly more aggressive than the source deck about empiric treatment if referral is delayed.',
			errorFlags: []
		},
		{
			model: 'Gemini 3.1 Pro',
			short: 'Gemini',
			total: 92,
			leadingDiagnosis: 20,
			featureRecognition: 14,
			differentialReasoning: 13,
			immediateManagement: 13,
			treatmentEvidence: 14,
			shiftFactors: 8,
			safetyScope: 5,
			clarity: 5,
			takeaway:
				'Very strong and efficient. It saw the right pattern quickly, though it overstated how specific some signs are.',
			strength: 'Clean board-style differentiation between fungal, bacterial, Acanthamoeba, and viral causes.',
			weakness: 'Called classic fungal findings too close to pathognomonic.',
			errorFlags: ['Overconfidence']
		},
		{
			model: 'OpenEvidence',
			short: 'OpenEv',
			total: 91,
			leadingDiagnosis: 20,
			featureRecognition: 14,
			differentialReasoning: 14,
			immediateManagement: 13,
			treatmentEvidence: 13,
			shiftFactors: 9,
			safetyScope: 5,
			clarity: 3,
			takeaway:
				'Clinically strong and literature-heavy. It was accurate, but less graceful for a fast teaching case.',
			strength: 'Good evidence instinct and careful treatment of Acanthamoeba as a differential rather than the answer.',
			weakness: 'Too externally referential and not as tailored to the deck’s teaching point.',
			errorFlags: []
		},
		{
			model: 'DeepSeek v4 Pro',
			short: 'DeepSeek',
			total: 88,
			leadingDiagnosis: 20,
			featureRecognition: 14,
			differentialReasoning: 13,
			immediateManagement: 11,
			treatmentEvidence: 13,
			shiftFactors: 9,
			safetyScope: 4,
			clarity: 4,
			takeaway:
				'Factually solid. It knew the disease, but softened the triage language too much for this presentation.',
			strength: 'Strong recognition of vegetative trauma, satellites, and fungal signs.',
			weakness: 'Underemphasized same-day referral and leaned too much into systemic voriconazole logic.',
			errorFlags: ['Weak referral emphasis', 'MUTT imprecision']
		},
		{
			model: 'Grok 4.3',
			short: 'Grok',
			total: 84,
			leadingDiagnosis: 20,
			featureRecognition: 14,
			differentialReasoning: 12,
			immediateManagement: 11,
			treatmentEvidence: 12,
			shiftFactors: 8,
			safetyScope: 3,
			clarity: 4,
			takeaway:
				'Got the headline diagnosis, but had enough safety and evidence fuzziness to fall behind the top group.',
			strength: 'Good high-level recognition of fungal keratitis after tree-branch injury.',
			weakness: 'Blurred MUTT-I and MUTT-II and mentioned questionable patching.',
			errorFlags: ['Weak referral emphasis', 'MUTT imprecision', 'Safety issue']
		},
		{
			model: 'Claude Sonnet 4.6',
			short: 'Claude',
			total: 60,
			leadingDiagnosis: 5,
			featureRecognition: 9,
			differentialReasoning: 13,
			immediateManagement: 13,
			treatmentEvidence: 3,
			shiftFactors: 8,
			safetyScope: 4,
			clarity: 5,
			takeaway:
				'Knowledgeable but anchored on the wrong disease. It chose Acanthamoeba because severe pain was too tempting.',
			strength: 'Good structure, referral instinct, and general cornea safety habits.',
			weakness: 'Overweighted pain and underweighted vegetative trauma, satellites, and feathery borders.',
			errorFlags: ['Wrong diagnosis', 'Overcalled Acanthamoeba', 'MUTT imprecision', 'Overconfidence']
		},
		{
			model: 'Kimi K2.6',
			short: 'Kimi',
			total: 44,
			leadingDiagnosis: 3,
			featureRecognition: 7,
			differentialReasoning: 10,
			immediateManagement: 8,
			treatmentEvidence: 2,
			shiftFactors: 7,
			safetyScope: 3,
			clarity: 4,
			takeaway:
				'The clearest miss. It forced the whole case into an Acanthamoeba frame and became overconfident.',
			strength: 'Recognized that infectious keratitis needs specialist care.',
			weakness: 'Downplayed the strongest fungal clues and recommended the wrong empiric direction.',
			errorFlags: ['Wrong diagnosis', 'Overcalled Acanthamoeba', 'MUTT imprecision', 'Safety issue', 'Overconfidence']
		}
	];

	const errorModes = [
		'Wrong diagnosis',
		'Overcalled Acanthamoeba',
		'Weak referral emphasis',
		'MUTT imprecision',
		'Safety issue',
		'Overconfidence'
	];

	let selectedCategory = $state<RankKey>('total');
	let selectedModel = $state<ModelScore>(models[0]);
	let mounted = $state(false);

	const sortedModels = $derived.by(() => {
		const key = selectedCategory;
		return [...models].sort((a, b) => {
			const av = key === 'total' ? a.total : a[key];
			const bv = key === 'total' ? b.total : b[key];
			return bv - av;
		});
	});

	const selectedCategoryMeta = $derived(
		categories.find((category) => category.key === selectedCategory)
	);
	const chartMax = $derived(selectedCategoryMeta?.max ?? 100);
	const correctCount = $derived(models.filter((model) => model.leadingDiagnosis >= 20).length);
	const missedCount = $derived(models.length - correctCount);

	function valueFor(model: ModelScore) {
		return selectedCategory === 'total' ? model.total : model[selectedCategory];
	}

	function diagnosticX(model: ModelScore) {
		return model.leadingDiagnosis + model.featureRecognition + model.differentialReasoning;
	}

	function safetyY(model: ModelScore) {
		return model.immediateManagement + model.safetyScope;
	}

	function segmentWidth(model: ModelScore, key: CategoryKey) {
		return `${(model[key] / model.total) * 100}%`;
	}

	function scatterLeft(model: ModelScore) {
		return `${8 + (diagnosticX(model) / 50) * 84}%`;
	}

	function scatterBottom(model: ModelScore) {
		return `${10 + (safetyY(model) / 20) * 78}%`;
	}

	function hasFlag(model: ModelScore, flag: string) {
		return model.errorFlags.includes(flag);
	}

	$effect(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Optometry AI Bench</title>
	<meta
		name="description"
		content="An accessible article and interactive score report comparing AI models on an optometry infectious keratitis benchmark."
	/>
</svelte:head>

{#if mounted}
	<div class="bench-shell selection:bg-primary/30 selection:text-foreground" in:fade={{ duration: 150 }}>
		<div class="scanline"></div>
		<div class="bench-page">
			<div class="topbar">
				<a href="/" class="home-link">← Justin Dang</a>
				<DarkModeToggle />
			</div>

			<header class="hero">
				<p class="eyebrow">Optometry AI Bench / Infectious Keratitis</p>
				<h1>When AI sounds confident, what is it actually seeing?</h1>
				<p class="lede">
					I gave seven AI models the same urgent eye-care case: a painful corneal infection
					after a tree-branch injury. The best models treated the details like a clinician
					would. The weaker ones latched onto one dramatic symptom and ran the wrong way.
				</p>
				<div class="hero-grid" aria-label="Benchmark summary">
					<div>
						<span class="metric">{correctCount}/7</span>
						<span class="metric-label">picked fungal keratitis</span>
					</div>
					<div>
						<span class="metric">97</span>
						<span class="metric-label">top score</span>
					</div>
					<div>
						<span class="metric">2</span>
						<span class="metric-label">anchored on Acanthamoeba</span>
					</div>
				</div>
			</header>

			<section class="plain-section">
				<p>
					For readers outside eye care, the central question is simple: can an AI model weigh
					a messy clinical story instead of matching one famous clue? The expected answer was
					<strong>presumed filamentous fungal keratitis</strong>, a serious corneal infection
					that can follow vegetative trauma like a branch or plant injury.
				</p>
				<p>
					The trap was severe pain. Many students learn that severe pain can point toward
					Acanthamoeba keratitis. That is true enough to matter, but not strong enough to
					overrule this case’s bigger pattern: branch trauma, a slow two-month course,
					satellite lesions, fluffy feathery borders, and stromal disease that threatens
					vision.
				</p>
			</section>

			<section class="chart-section" aria-labelledby="score-heading">
				<div class="section-head">
					<div>
						<p class="eyebrow">Interactive chart 01</p>
						<h2 id="score-heading">Scoreboard</h2>
					</div>
					<label>
						<span>Rank by</span>
						<select bind:value={selectedCategory}>
							<option value="total">Total score</option>
							{#each categories as category}
								<option value={category.key}>{category.label}</option>
							{/each}
						</select>
					</label>
				</div>

				<div class="bar-list">
					{#each sortedModels as model, index}
						<button
							type="button"
							class="bar-row"
							class:active={selectedModel.model === model.model}
							onclick={() => {
								selectedModel = model;
							}}
						>
							<span class="rank">{String(index + 1).padStart(2, '0')}</span>
							<span class="bar-name">{model.model}</span>
							<span class="bar-track">
								<span
									class="bar-fill"
									style={`width: ${(valueFor(model) / chartMax) * 100}%;`}
								></span>
							</span>
							<span class="bar-value">{valueFor(model)}</span>
						</button>
					{/each}
				</div>

				<article class="model-detail">
					<p class="detail-kicker">Selected model</p>
					<h3>{selectedModel.model} — {selectedModel.total}/100</h3>
					<p>{selectedModel.takeaway}</p>
					<div class="detail-columns">
						<div>
							<strong>What worked</strong>
							<span>{selectedModel.strength}</span>
						</div>
						<div>
							<strong>What failed</strong>
							<span>{selectedModel.weakness}</span>
						</div>
					</div>
				</article>
			</section>

			<section class="plain-section">
				<h2>The actual clinical lesson</h2>
				<p>
					Good clinical reasoning is not a trivia contest. The top models did not win because
					they knew more isolated facts. They won because they integrated the mechanism,
					timeline, corneal appearance, urgency, and evidence.
				</p>
				<p>
					In the source grading report, the strongest answer needed to recognize same-day
					corneal specialist referral, avoid casual steroid use, and understand why
					<strong> natamycin 5%</strong> is the evidence-supported first-line therapy for
					filamentous fungal keratitis. MUTT-I favored topical natamycin over topical
					voriconazole; MUTT-II did not show broad benefit from adding oral voriconazole and
					added systemic risk.
				</p>
			</section>

			<section class="chart-section" aria-labelledby="composition-heading">
				<div class="section-head">
					<div>
						<p class="eyebrow">Interactive chart 02</p>
						<h2 id="composition-heading">Why the scores split</h2>
					</div>
				</div>

				<div class="stacked-list">
					{#each models as model}
						<div class="stacked-row">
							<div class="stacked-label">
								<span>{model.model}</span>
								<strong>{model.total}</strong>
							</div>
							<div class="stacked-bar" aria-label={`${model.model} category score composition`}>
								{#each categories as category}
									<span
										title={`${category.label}: ${model[category.key]}/${category.max}`}
										style={`width: ${segmentWidth(model, category.key)}; background: ${category.color};`}
									></span>
								{/each}
							</div>
						</div>
					{/each}
				</div>

				<div class="legend">
					{#each categories as category}
						<span><i style={`background: ${category.color};`}></i>{category.label}</span>
					{/each}
				</div>
			</section>

			<section class="split-section">
				<div class="plain-section compact">
					<h2>Five got the diagnosis. Two missed the frame.</h2>
					<p>
						This was not a total AI collapse. Five models correctly chose fungal keratitis.
						The important finding is more specific: two models sounded polished while making
						the wrong lead diagnosis.
					</p>
					<div class="diagnosis-meter" aria-label="Diagnostic accuracy split">
						<span style={`width: ${(correctCount / models.length) * 100}%;`}>Correct</span>
						<span style={`width: ${(missedCount / models.length) * 100}%;`}>Missed</span>
					</div>
				</div>

				<div class="plain-section compact">
					<h2>The useful benchmark is the mistake.</h2>
					<p>
						Claude and Kimi both anchored on severe pain. That is a recognizable failure mode:
						the model grabs a memorable association and then tries to make the rest of the
						case fit it.
					</p>
				</div>
			</section>

			<section class="chart-section" aria-labelledby="scatter-heading">
				<div class="section-head">
					<div>
						<p class="eyebrow">Interactive chart 03</p>
						<h2 id="scatter-heading">Safe-sounding is not the same as right</h2>
					</div>
				</div>

				<div class="scatter" aria-label="Diagnostic reasoning versus safety and triage">
					<div class="axis y">Safety / triage</div>
					<div class="axis x">Diagnostic reasoning</div>
					{#each models as model}
						<button
							type="button"
							class="point"
							class:active={selectedModel.model === model.model}
							style={`left: ${scatterLeft(model)}; bottom: ${scatterBottom(model)}; width: ${26 + model.total / 4}px; height: ${26 + model.total / 4}px;`}
							aria-label={`${model.model}: diagnostic reasoning ${diagnosticX(model)} of 50, safety and triage ${safetyY(model)} of 20`}
							onclick={() => {
								selectedModel = model;
							}}
						>
							<span>{model.short}</span>
						</button>
					{/each}
				</div>
				<p class="chart-note">
					Claude is the interesting dot: relatively safe triage language, but the wrong
					diagnostic neighborhood.
				</p>
			</section>

			<section class="chart-section" aria-labelledby="heatmap-heading">
				<div class="section-head">
					<div>
						<p class="eyebrow">Interactive chart 04</p>
						<h2 id="heatmap-heading">Error modes</h2>
					</div>
				</div>

				<div class="heatmap">
					<div class="heatmap-header"></div>
					{#each errorModes as flag}
						<div class="heatmap-head">{flag}</div>
					{/each}
					{#each models as model}
						<div class="heatmap-model">{model.model}</div>
						{#each errorModes as flag}
							<button
								type="button"
								class="heat-cell"
								class:on={hasFlag(model, flag)}
								title={`${model.model}: ${flag}`}
								onclick={() => {
									selectedModel = model;
								}}
							>
								<span>{hasFlag(model, flag) ? '1' : '0'}</span>
							</button>
						{/each}
					{/each}
				</div>
			</section>

			<section class="plain-section">
				<h2>Bottom line</h2>
				<p>
					The strongest models did not merely recognize isolated findings. They integrated
					mechanism, timeline, morphology, urgency, and evidence. GPT-5.5 was strongest
					overall because it paired the right diagnosis with the safest and most complete
					management logic.
				</p>
				<p>
					The most important failure mode was Acanthamoeba overcalling. That makes this a
					useful benchmark for clinical AI: it exposes whether a model can re-rank a
					differential when the famous clue is not the best clue.
				</p>
			</section>

			<footer>
				<a href="/">Back to home</a>
				<span>Optometry AI Bench · Justin Dang</span>
			</footer>
		</div>
	</div>
{/if}

<style>
	.bench-shell {
		position: relative;
		min-height: 100vh;
		background:
			linear-gradient(90deg, color-mix(in oklch, var(--background), var(--primary) 4%), transparent 38%),
			var(--background);
		color: var(--foreground);
	}

	.scanline {
		pointer-events: none;
		position: fixed;
		inset: 0;
		z-index: 10;
		opacity: 0.015;
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 2px,
			currentColor 2px,
			currentColor 3px
		);
	}

	.bench-page {
		margin: 0 auto;
		max-width: 980px;
		padding: 48px 24px 72px;
	}

	.topbar,
	footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		font-family: var(--font-display);
		font-size: 0.82rem;
		color: color-mix(in oklch, var(--foreground), transparent 45%);
	}

	.home-link,
	footer a {
		color: inherit;
		text-decoration: underline;
		text-decoration-color: color-mix(in oklch, var(--foreground), transparent 70%);
		text-underline-offset: 3px;
		transition: color 160ms ease, text-decoration-color 160ms ease;
	}

	.home-link:hover,
	footer a:hover {
		color: var(--foreground);
		text-decoration-color: var(--foreground);
	}

	.hero {
		padding: 72px 0 48px;
		border-bottom: 1px dashed color-mix(in oklch, var(--foreground), transparent 82%);
	}

	.eyebrow,
	.detail-kicker {
		margin: 0 0 14px;
		font-family: var(--font-display);
		font-size: 0.76rem;
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in oklch, var(--foreground), transparent 48%);
	}

	h1,
	h2,
	h3,
	p {
		text-wrap: pretty;
	}

	h1 {
		max-width: 880px;
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2.65rem, 8vw, 6.6rem);
		line-height: 0.95;
		letter-spacing: 0;
	}

	h2 {
		margin: 0 0 18px;
		font-family: var(--font-display);
		font-size: clamp(1.45rem, 3vw, 2.25rem);
		line-height: 1.08;
		letter-spacing: 0;
	}

	h3 {
		margin: 0 0 10px;
		font-family: var(--font-display);
		font-size: 1.25rem;
	}

	.lede {
		max-width: 760px;
		margin: 28px 0 0;
		font-size: clamp(1.1rem, 2.2vw, 1.45rem);
		line-height: 1.55;
		color: color-mix(in oklch, var(--foreground), transparent 24%);
	}

	.hero-grid {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 1px;
		margin-top: 42px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 84%);
		background: color-mix(in oklch, var(--foreground), transparent 88%);
	}

	.hero-grid div {
		min-height: 116px;
		padding: 18px;
		background: color-mix(in oklch, var(--background), var(--primary) 3%);
	}

	.metric {
		display: block;
		font-family: var(--font-display);
		font-size: 2.4rem;
		font-weight: 700;
		line-height: 1;
	}

	.metric-label {
		display: block;
		margin-top: 10px;
		font-family: var(--font-display);
		font-size: 0.78rem;
		color: color-mix(in oklch, var(--foreground), transparent 42%);
	}

	.plain-section,
	.chart-section {
		margin: 34px 0;
		padding: 34px 0;
		border-bottom: 1px dashed color-mix(in oklch, var(--foreground), transparent 84%);
	}

	.plain-section {
		max-width: 760px;
	}

	.plain-section p,
	.model-detail p,
	.chart-note {
		margin: 0 0 18px;
		font-size: 1.05rem;
		line-height: 1.75;
		color: color-mix(in oklch, var(--foreground), transparent 24%);
	}

	.plain-section strong {
		color: var(--foreground);
	}

	.section-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 20px;
		margin-bottom: 24px;
	}

	label {
		display: grid;
		gap: 8px;
		font-family: var(--font-display);
		font-size: 0.76rem;
		color: color-mix(in oklch, var(--foreground), transparent 40%);
	}

	select {
		min-width: 210px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 78%);
		border-radius: 6px;
		background: var(--background);
		color: var(--foreground);
		padding: 10px 12px;
		font: inherit;
	}

	.bar-list {
		display: grid;
		gap: 8px;
	}

	.bar-row {
		display: grid;
		grid-template-columns: 42px minmax(120px, 190px) minmax(120px, 1fr) 48px;
		align-items: center;
		gap: 14px;
		min-height: 48px;
		border: 1px solid transparent;
		border-radius: 8px;
		background: transparent;
		color: var(--foreground);
		padding: 6px 10px;
		text-align: left;
		cursor: pointer;
		transition: border-color 160ms ease, background 160ms ease;
	}

	.bar-row:hover,
	.bar-row.active {
		border-color: color-mix(in oklch, var(--foreground), transparent 82%);
		background: color-mix(in oklch, var(--primary), transparent 92%);
	}

	.rank,
	.bar-value,
	.bar-name {
		font-family: var(--font-display);
	}

	.rank {
		color: color-mix(in oklch, var(--foreground), transparent 58%);
	}

	.bar-track {
		position: relative;
		height: 18px;
		overflow: hidden;
		border-radius: 999px;
		background: color-mix(in oklch, var(--foreground), transparent 90%);
	}

	.bar-fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: inherit;
		background: linear-gradient(90deg, var(--primary), color-mix(in oklch, var(--primary), white 28%));
		transition: width 220ms ease;
	}

	.model-detail {
		margin-top: 28px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 84%);
		border-radius: 8px;
		padding: 22px;
		background: color-mix(in oklch, var(--background), var(--primary) 3%);
	}

	.detail-columns {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		margin-top: 22px;
		background: color-mix(in oklch, var(--foreground), transparent 86%);
	}

	.detail-columns div {
		display: grid;
		gap: 8px;
		padding: 16px;
		background: var(--background);
	}

	.detail-columns strong,
	.detail-columns span,
	.stacked-label,
	.legend,
	.heatmap {
		font-family: var(--font-display);
	}

	.detail-columns span {
		color: color-mix(in oklch, var(--foreground), transparent 30%);
		line-height: 1.55;
	}

	.stacked-list {
		display: grid;
		gap: 14px;
	}

	.stacked-row {
		display: grid;
		grid-template-columns: minmax(140px, 220px) 1fr;
		align-items: center;
		gap: 14px;
	}

	.stacked-label {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-size: 0.9rem;
	}

	.stacked-bar {
		display: flex;
		height: 26px;
		overflow: hidden;
		border-radius: 6px;
		background: color-mix(in oklch, var(--foreground), transparent 90%);
	}

	.stacked-bar span {
		min-width: 2px;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 10px 16px;
		margin-top: 22px;
		font-size: 0.72rem;
		color: color-mix(in oklch, var(--foreground), transparent 34%);
	}

	.legend span {
		display: inline-flex;
		align-items: center;
		gap: 7px;
	}

	.legend i {
		width: 10px;
		height: 10px;
		border-radius: 2px;
	}

	.split-section {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 28px;
		border-bottom: 1px dashed color-mix(in oklch, var(--foreground), transparent 84%);
	}

	.compact {
		margin: 0;
		border: 0;
	}

	.diagnosis-meter {
		display: flex;
		overflow: hidden;
		border-radius: 8px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 84%);
		font-family: var(--font-display);
		font-size: 0.8rem;
	}

	.diagnosis-meter span {
		display: grid;
		min-height: 54px;
		place-items: center;
		color: white;
	}

	.diagnosis-meter span:first-child {
		background: #16a34a;
	}

	.diagnosis-meter span:last-child {
		background: #dc2626;
	}

	.scatter {
		position: relative;
		height: 430px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 82%);
		border-radius: 8px;
		background:
			linear-gradient(color-mix(in oklch, var(--foreground), transparent 92%) 1px, transparent 1px),
			linear-gradient(90deg, color-mix(in oklch, var(--foreground), transparent 92%) 1px, transparent 1px);
		background-size: 25% 25%;
	}

	.axis {
		position: absolute;
		font-family: var(--font-display);
		font-size: 0.75rem;
		color: color-mix(in oklch, var(--foreground), transparent 42%);
	}

	.axis.y {
		left: 14px;
		top: 14px;
	}

	.axis.x {
		right: 14px;
		bottom: 14px;
	}

	.point {
		position: absolute;
		display: grid;
		place-items: center;
		transform: translate(-50%, 50%);
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 55%);
		border-radius: 999px;
		background: color-mix(in oklch, var(--primary), var(--background) 20%);
		color: var(--primary-foreground);
		box-shadow: 0 14px 35px color-mix(in oklch, black, transparent 86%);
		cursor: pointer;
		transition: transform 160ms ease, outline-color 160ms ease;
	}

	.point:hover,
	.point.active {
		outline: 3px solid color-mix(in oklch, var(--primary), transparent 62%);
		transform: translate(-50%, 50%) scale(1.05);
	}

	.point span {
		font-family: var(--font-display);
		font-size: 0.68rem;
		font-weight: 700;
	}

	.chart-note {
		margin-top: 14px;
		font-size: 0.95rem;
	}

	.heatmap {
		display: grid;
		grid-template-columns: minmax(150px, 1.1fr) repeat(6, minmax(82px, 1fr));
		overflow-x: auto;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 84%);
		border-radius: 8px;
	}

	.heatmap-head,
	.heatmap-model,
	.heat-cell {
		min-height: 54px;
		border: 0;
		border-right: 1px solid color-mix(in oklch, var(--foreground), transparent 86%);
		border-bottom: 1px solid color-mix(in oklch, var(--foreground), transparent 86%);
		background: var(--background);
		color: var(--foreground);
	}

	.heatmap-head {
		display: grid;
		place-items: center;
		padding: 8px;
		font-size: 0.68rem;
		text-align: center;
		color: color-mix(in oklch, var(--foreground), transparent 36%);
	}

	.heatmap-model {
		display: flex;
		align-items: center;
		padding: 0 12px;
		font-size: 0.82rem;
	}

	.heat-cell {
		cursor: pointer;
	}

	.heat-cell span {
		opacity: 0.45;
	}

	.heat-cell.on {
		background: color-mix(in oklch, var(--primary), var(--background) 18%);
		color: var(--primary-foreground);
	}

	.heat-cell.on span {
		opacity: 1;
	}

	footer {
		padding-top: 28px;
	}

	@media (max-width: 760px) {
		.bench-page {
			padding: 28px 18px 52px;
		}

		.hero {
			padding-top: 48px;
		}

		.hero-grid,
		.split-section,
		.detail-columns {
			grid-template-columns: 1fr;
		}

		.section-head {
			display: grid;
			align-items: start;
		}

		select {
			width: 100%;
		}

		.bar-row {
			grid-template-columns: 34px 1fr 44px;
			gap: 10px;
		}

		.bar-track {
			grid-column: 2 / -1;
			width: 100%;
		}

		.stacked-row {
			grid-template-columns: 1fr;
			gap: 8px;
		}

		.scatter {
			height: 360px;
		}

		.heatmap {
			grid-template-columns: 132px repeat(6, 88px);
		}
	}
</style>
