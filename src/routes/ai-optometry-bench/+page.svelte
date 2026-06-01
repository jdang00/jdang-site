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
		dxCalled: string;
		takeaway: string;
		strength: string;
		weakness: string;
		errorFlags: string[];
	};

	const categories: { key: CategoryKey; label: string; short: string; max: number; color: string }[] = [
		{ key: 'leadingDiagnosis', label: 'Leading diagnosis', short: 'Dx', max: 20, color: '#b45309' },
		{ key: 'featureRecognition', label: 'Feature recognition', short: 'Feat', max: 15, color: '#d97706' },
		{ key: 'differentialReasoning', label: 'Differential reasoning', short: 'Diff', max: 15, color: '#ca8a04' },
		{ key: 'immediateManagement', label: 'Immediate management', short: 'Mgmt', max: 15, color: '#65a30d' },
		{ key: 'treatmentEvidence', label: 'Treatment evidence', short: 'Tx', max: 15, color: '#0d9488' },
		{ key: 'shiftFactors', label: 'Shift factors', short: 'Shift', max: 10, color: '#0369a1' },
		{ key: 'safetyScope', label: 'Safety / scope', short: 'Safe', max: 5, color: '#4338ca' },
		{ key: 'clarity', label: 'Clarity', short: 'Clr', max: 5, color: '#7c3aed' }
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
			dxCalled: 'Filamentous fungal keratitis',
			takeaway:
				'Best overall. Correctly weighted vegetative trauma, satellite lesions, and the two-month indolent course. Recognized natamycin 5% as first-line and cited MUTT-I correctly.',
			strength:
				'Integrated mechanism (branch trauma), time course (~8 weeks), morphology (satellites, feathery borders), and evidence (MUTT-I natamycin > topical voriconazole) into one coherent triage answer.',
			weakness:
				'Slightly more aggressive on empiric topical therapy at the primary-care visit than the deck supports when same-day corneal referral is available.',
			errorFlags: []
		},
		{
			model: 'Gemini 3.1 Pro',
			short: 'Gem',
			total: 92,
			leadingDiagnosis: 20,
			featureRecognition: 14,
			differentialReasoning: 13,
			immediateManagement: 13,
			treatmentEvidence: 14,
			shiftFactors: 8,
			safetyScope: 5,
			clarity: 5,
			dxCalled: 'Filamentous fungal keratitis',
			takeaway:
				'Concise and clinically clean. Built the differential against bacterial, HSV, and Acanthamoeba with the right weights. Knew natamycin and MUTT-I.',
			strength:
				'Efficient board-style differentiation. Correctly placed Acanthamoeba in the differential without elevating it to lead.',
			weakness:
				'Called satellite lesions and feathery margins "pathognomonic." They are highly suggestive, not pathognomonic — small but real overstatement.',
			errorFlags: ['Overconfidence']
		},
		{
			model: 'OpenEvidence',
			short: 'OE',
			total: 91,
			leadingDiagnosis: 20,
			featureRecognition: 14,
			differentialReasoning: 14,
			immediateManagement: 13,
			treatmentEvidence: 13,
			shiftFactors: 9,
			safetyScope: 5,
			clarity: 3,
			dxCalled: 'Filamentous fungal keratitis',
			takeaway:
				'Citation-heavy and accurate. Strong on MUTT-I supporting natamycin over topical voriconazole, particularly for Fusarium. Less tailored to a teaching case than the top two.',
			strength:
				'Best evidence retrieval in the set. Acknowledged Acanthamoeba honestly without anchoring on it.',
			weakness:
				'Asked clarifying questions instead of committing. Included peripheral details (e.g., fluorescein/NAAT) that distract from the high-yield primary-care action.',
			errorFlags: []
		},
		{
			model: 'DeepSeek v4 Pro',
			short: 'DS',
			total: 88,
			leadingDiagnosis: 20,
			featureRecognition: 14,
			differentialReasoning: 13,
			immediateManagement: 11,
			treatmentEvidence: 13,
			shiftFactors: 9,
			safetyScope: 4,
			clarity: 4,
			dxCalled: 'Filamentous fungal keratitis',
			takeaway:
				'Solid disease knowledge — KOH, calcofluor, culture, natamycin — but reads more like a comprehensive keratitis note than a primary-care triage answer.',
			strength:
				'Broad differential and good biology. Captured stromal-versus-epithelial pattern and the case for confirmatory microbiology.',
			weakness:
				'Said "close follow-up within 24–48h" instead of same-day cornea referral. Leaned on oral voriconazole more than MUTT-II results support.',
			errorFlags: ['Weak referral emphasis', 'MUTT imprecision']
		},
		{
			model: 'Grok 4.3',
			short: 'Gk',
			total: 84,
			leadingDiagnosis: 20,
			featureRecognition: 14,
			differentialReasoning: 12,
			immediateManagement: 11,
			treatmentEvidence: 12,
			shiftFactors: 8,
			safetyScope: 3,
			clarity: 4,
			dxCalled: 'Filamentous fungal keratitis',
			takeaway:
				'Right headline diagnosis with audible evidence imprecision. Conflated MUTT-I and MUTT-II and slipped in one questionable management item.',
			strength:
				'Recognized tree-branch injury as classic for filamentous fungal disease and correctly de-escalated Acanthamoeba in the absence of contact-lens / water exposure.',
			weakness:
				'Said "MUTT-I & II showed natamycin superior to voriconazole." MUTT-I: topical natamycin vs. topical voriconazole. MUTT-II: oral voriconazole add-on, no broad benefit. Also suggested light patching, which is not appropriate in suspected infectious keratitis.',
			errorFlags: ['Weak referral emphasis', 'MUTT imprecision', 'Safety issue']
		},
		{
			model: 'Claude Sonnet 4.6',
			short: 'Cl',
			total: 60,
			leadingDiagnosis: 5,
			featureRecognition: 9,
			differentialReasoning: 13,
			immediateManagement: 13,
			treatmentEvidence: 3,
			shiftFactors: 8,
			safetyScope: 4,
			clarity: 5,
			dxCalled: 'Acanthamoeba keratitis',
			takeaway:
				'Anchored on "pain out of proportion" and built an Acanthamoeba plan. Safety habits and triage language were fine; the underlying diagnosis was wrong.',
			strength:
				'Well-structured response. Avoided steroids. Knew confocal microscopy and same-day referral matter for AK.',
			weakness:
				'Re-interpreted satellite lesions and irregular borders as AK features. Built a treatment plan around PHMB/chlorhexidine instead of natamycin, which collapses the Treatment & Evidence score.',
			errorFlags: ['Wrong diagnosis', 'Overcalled Acanthamoeba', 'MUTT imprecision', 'Overconfidence']
		},
		{
			model: 'Kimi K2.6',
			short: 'Km',
			total: 44,
			leadingDiagnosis: 3,
			featureRecognition: 7,
			differentialReasoning: 10,
			immediateManagement: 8,
			treatmentEvidence: 2,
			shiftFactors: 7,
			safetyScope: 3,
			clarity: 4,
			dxCalled: 'Acanthamoeba keratitis',
			takeaway:
				'Same anchor as Claude, but more overconfident. Inferred features that were not in the prompt (ring infiltrate, radial keratoneuritis) to support the AK frame.',
			strength:
				'Recognized that infectious keratitis needs specialist care and avoided steroid recommendations.',
			weakness:
				'Called pain "pathognomonic." Recommended empiric anti-Acanthamoeba therapy as if the diagnosis were established. Downweighted vegetative trauma despite its high prior in this case.',
			errorFlags: ['Wrong diagnosis', 'Overcalled Acanthamoeba', 'MUTT imprecision', 'Safety issue', 'Overconfidence']
		}
	];

	const errorModes: { key: string; label: string; detail: string }[] = [
		{ key: 'Wrong diagnosis', label: 'Wrong lead Dx', detail: 'Named a leading diagnosis other than filamentous fungal keratitis.' },
		{ key: 'Overcalled Acanthamoeba', label: 'AK overcall', detail: 'Promoted Acanthamoeba above fungal despite weak contact-lens / water history.' },
		{ key: 'Weak referral emphasis', label: 'Soft referral', detail: 'Used "24–48h follow-up" instead of same-day corneal specialist referral.' },
		{ key: 'MUTT imprecision', label: 'MUTT slip', detail: 'Misstated MUTT-I (topical) or MUTT-II (oral voriconazole add-on) findings.' },
		{ key: 'Safety issue', label: 'Safety slip', detail: 'Suggested patching, casual steroid use, or other unsafe management detail.' },
		{ key: 'Overconfidence', label: 'Overconfidence', detail: 'Called classic-but-non-specific findings "pathognomonic" or inferred unstated signs.' }
	];

	let selectedCategory = $state<RankKey>('total');
	let selectedModel = $state<ModelScore>(models[0]);
	let normalizeStacked = $state(true);
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
	const averageTotal = $derived(
		Math.round(models.reduce((sum, m) => sum + m.total, 0) / models.length)
	);

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
		if (normalizeStacked) {
			const cat = categories.find((c) => c.key === key)!;
			return `${(model[key] / cat.max) * (100 / categories.length)}%`;
		}
		return `${(model[key] / model.total) * 100}%`;
	}

	function scatterLeft(model: ModelScore) {
		return `${10 + (diagnosticX(model) / 50) * 82}%`;
	}

	function scatterBottom(model: ModelScore) {
		return `${12 + (safetyY(model) / 20) * 74}%`;
	}

	function hasFlag(model: ModelScore, flag: string) {
		return model.errorFlags.includes(flag);
	}

	function errorCount(model: ModelScore) {
		return model.errorFlags.length;
	}

	$effect(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Optometry AI Bench · Filamentous fungal keratitis</title>
	<meta
		name="description"
		content="Seven LLMs graded on a single optometry case: presumed filamentous fungal keratitis after vegetative trauma. Score breakdowns, MUTT evidence, and a recurring AI failure mode."
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
				<p class="eyebrow">Optometry AI Bench · Infectious keratitis · n = 7 models</p>
				<p class="byline">By <strong>Justin A. Dang</strong> · Summer Grand Rounds 2026, NSUOCO</p>
				<h1>Seven models, one cornea, one wrong heuristic.</h1>
				<p class="lede">
					I scored seven LLMs on a single optometry case from a Summer Grand Rounds deck:
					a painful corneal infection two months after a tree-branch injury. The ground-truth
					answer is presumed filamentous fungal keratitis, with same-day corneal referral and
					natamycin 5% as first-line therapy. Five models got there. Two got stuck on
					"severe pain → Acanthamoeba" and never re-ranked the differential.
				</p>
				<div class="hero-grid" aria-label="Benchmark summary">
					<div>
						<span class="metric">{correctCount}/7</span>
						<span class="metric-label">Identified filamentous fungal keratitis as lead Dx</span>
					</div>
					<div>
						<span class="metric">{averageTotal}<small>/100</small></span>
						<span class="metric-label">Mean total across all seven models</span>
					</div>
					<div>
						<span class="metric">53<small> pts</small></span>
						<span class="metric-label">Spread between top (GPT-5.5, 97) and bottom (Kimi, 44)</span>
					</div>
				</div>
			</header>

			<section class="plain-section">
				<p>
					<strong>The case in one paragraph.</strong> A patient presents with a unilateral
					painful red eye two months after being struck by a tree branch on a hunting trip.
					VA is 20/70 OD, 20/25 OS. Slit-lamp shows 2+ diffuse injection and a stromal
					infiltrate covering roughly two-thirds of the corneal surface with multiple satellite
					lesions, fluffy ill-defined borders, and only trace SPK — minimal epithelial
					disruption relative to the depth of the stromal disease. Anterior chamber reaction
					is present. The deck's working diagnosis is
					<strong>mycotic corneal ulcer OD (ICD-10 H16.061)</strong>, presumed filamentous —
					not Acanthamoeba, not bacterial, not HSV.
				</p>
				<p>
					<strong>Why this is a useful AI benchmark.</strong> The case has a well-known
					distractor. "Pain out of proportion to findings" is taught alongside Acanthamoeba
					keratitis, which biases pattern-matching toward AK whenever a model sees both severe
					pain and an indolent course. Here, the more specific evidence runs the other way:
					vegetative trauma is the classic mechanism for filamentous fungal infection
					(<em>Fusarium</em>, <em>Aspergillus</em>); satellite lesions with feathery borders
					are highly suggestive of fungal disease; and stromal involvement with a relatively
					intact epithelium is consistent with hyphal invasion through Bowman's layer rather
					than an epithelial-driven amoebic process. The case rewards models that re-rank a
					differential after seeing case-specific evidence, and penalizes models that anchor
					on a memorable board association.
				</p>
				<p>
					<strong>How the rubric is built.</strong> 100 points across eight categories —
					leading diagnosis (20), feature recognition (15), differential reasoning (15),
					immediate management (15), treatment & evidence (15), shift factors (10), safety /
					scope (5), clarity (5). The four 15-point categories are where the ranking is
					decided. Safety, shift factors, and clarity break ties between models that are
					already on the right path.
				</p>
			</section>

			<section class="chart-section" aria-labelledby="score-heading">
				<div class="section-head">
					<div>
						<p class="eyebrow">01 · Scoreboard</p>
						<h2 id="score-heading">Total and per-category ranking</h2>
						<p class="section-sub">
							Switch the dimension to see how a category's max changes the ranking. Smaller
							categories (Safety, Clarity) frequently tie at ceiling.
						</p>
					</div>
					<label>
						<span>Rank by</span>
						<select bind:value={selectedCategory}>
							<option value="total">Total score (/100)</option>
							{#each categories as category}
								<option value={category.key}>{category.label} (/{category.max})</option>
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
							<span class="bar-name">
								<span>{model.model}</span>
								<span class="bar-sub">{model.dxCalled}</span>
							</span>
							<span class="bar-track" aria-hidden="true">
								<span
									class="bar-fill"
									style={`width: ${(valueFor(model) / chartMax) * 100}%;`}
								></span>
								<span class="bar-tick" style="left: 50%;"></span>
								<span class="bar-tick" style="left: 75%;"></span>
							</span>
							<span class="bar-value">
								{valueFor(model)}<small>/{chartMax}</small>
							</span>
						</button>
					{/each}
				</div>

				<article class="model-detail">
					<p class="detail-kicker">Selected · {selectedModel.dxCalled}</p>
					<h3>{selectedModel.model} <span class="score-pill">{selectedModel.total}/100</span></h3>
					<p>{selectedModel.takeaway}</p>
					<div class="detail-columns">
						<div>
							<strong>What worked</strong>
							<span>{selectedModel.strength}</span>
						</div>
						<div>
							<strong>What slipped</strong>
							<span>{selectedModel.weakness}</span>
						</div>
					</div>
					<div class="detail-cats">
						{#each categories as category}
							<div class="cat-pill">
								<span class="cat-pill-label">{category.short}</span>
								<span class="cat-pill-value">
									{selectedModel[category.key]}<small>/{category.max}</small>
								</span>
								<span class="cat-pill-bar">
									<span style={`width: ${(selectedModel[category.key] / category.max) * 100}%; background: ${category.color};`}></span>
								</span>
							</div>
						{/each}
					</div>
				</article>
			</section>

			<section class="plain-section">
				<h2>What separates the top five from the bottom two</h2>
				<p>
					<strong>The top five integrated features.</strong> GPT-5.5, Gemini, OpenEvidence,
					DeepSeek, and Grok all named filamentous fungal keratitis as the leading diagnosis
					and converged on the same anchor pattern: mechanism (vegetative trauma), time course
					(indolent, multi-week), morphology (satellite lesions, feathery / ill-defined
					borders), depth (stromal disease with relatively intact epithelium), and evidence
					(MUTT-I supports topical natamycin over topical voriconazole, particularly for
					<em>Fusarium</em>).
				</p>
				<p>
					<strong>The bottom two fixated on one symptom.</strong> Claude and Kimi locked onto
					severe pain and built an Acanthamoeba answer. Both then re-interpreted satellite
					lesions and irregular borders as AK features, recommended PHMB / chlorhexidine
					rather than natamycin, and lost most of the Treatment & Evidence points. Kimi went
					further and hallucinated unstated findings — a ring infiltrate and radial
					keratoneuritis — to reinforce the wrong frame.
				</p>
				<p>
					<strong>Why the deck answer is "refer, don't empirically treat."</strong>
					When same-day corneal specialist access is available, the right primary-care action
					is urgent referral with no topical antibiotic, no steroid, and no patching. The
					weaker top-five models (DeepSeek, Grok) softened this to "follow up in 24–48h," which
					is too slow for an active stromal infection that already has a two-month head start.
				</p>
			</section>

			<section class="chart-section" aria-labelledby="composition-heading">
				<div class="section-head">
					<div>
						<p class="eyebrow">02 · Score composition</p>
						<h2 id="composition-heading">Where each model earned and lost points</h2>
						<p class="section-sub">
							Normalized view shows each category as a fraction of its own maximum, so a
							perfect 5/5 on Clarity is visually equal to a perfect 20/20 on Diagnosis.
							Switch off normalization to see absolute point contributions to the total.
						</p>
					</div>
					<label class="toggle">
						<input type="checkbox" bind:checked={normalizeStacked} />
						<span>Normalize by category max</span>
					</label>
				</div>

				<div class="stacked-list">
					{#each models as model}
						<div class="stacked-row">
							<div class="stacked-label">
								<span>{model.model}</span>
								<strong>{model.total}<small>/100</small></strong>
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
						<span><i style={`background: ${category.color};`}></i>{category.label} <em>/{category.max}</em></span>
					{/each}
				</div>
			</section>

			<section class="plain-section">
				<h2>The evidence layer — what the rubric actually rewards</h2>
				<p>
					<strong>Drug class quick reference.</strong> Natamycin 5% is a polyene that binds
					ergosterol in the fungal cell membrane; it is first-line for filamentous keratitis
					(<em>Fusarium</em>, <em>Aspergillus</em>) but has poor stromal penetration and
					causes surface toxicity and punctate epitheliopathy. Voriconazole 1% is a triazole
					with excellent intraocular penetration, reserved for refractory or deep stromal
					disease and strong yeast coverage; oral voriconazole adds hepatotoxicity and
					photosensitivity. Amphotericin B 0.15% (compounded) is first-line for <em>Candida</em>
					and other yeasts, with significant surface toxicity and refrigeration requirements.
				</p>
				<p>
					<strong>MUTT-I.</strong> The Mycotic Ulcer Treatment Trial I compared topical
					natamycin 5% to topical voriconazole 1% in filamentous fungal keratitis. Natamycin
					produced better visual outcomes and fewer perforations, with the effect most
					pronounced in <em>Fusarium</em>. A model that says "natamycin first-line" gets the
					headline right; a model that explains <em>why</em> earns the full
					treatment-evidence points.
				</p>
				<p>
					<strong>MUTT-II.</strong> Tested whether oral voriconazole added to topical
					natamycin broadly helps in severe filamentous fungal ulcers. It did not provide a
					general therapeutic benefit and increased systemic risk. Recommending oral
					voriconazole as routine adjunctive therapy was marked down (DeepSeek, Grok).
					Conflating MUTT-I and MUTT-II — claiming both showed natamycin superiority — is the
					most common evidence slip in the set.
				</p>
				<p>
					<strong>Why steroids and patches show up in the safety column.</strong> Topical
					steroids in active, unconfirmed fungal keratitis can accelerate stromal melt and
					are "almost always contraindicated" in the acute phase. Pressure patches over an
					infected cornea create a warm, moist environment for organisms to multiply and
					obscure the eye from re-examination. Either suggestion costs a model on Safety /
					scope even if the rest of the answer is fine.
				</p>
				<p>
					<strong>Scale of the disease, scale of the consequences.</strong> Fungal keratitis
					affects roughly 1–1.5 million people globally each year, weighted toward agricultural
					and tropical regions. Roughly 20–44% of cases require therapeutic penetrating
					keratoplasty (TPK); infection-control rates after TPK are good, but visual outcomes
					remain limited. That is why same-day corneal specialist referral, rather than
					comfortable-feeling empiric treatment at the primary-care visit, is the deck's
					correct first move when a specialist is reachable.
				</p>
			</section>

			<section class="split-section">
				<div class="plain-section compact">
					<h2>Lead-diagnosis split</h2>
					<p>
						Five of seven models named filamentous fungal keratitis. Two named Acanthamoeba.
						No model named bacterial or HSV as the lead diagnosis — the differential discipline
						was generally fine; the anchoring was not.
					</p>
					<div class="diagnosis-meter" aria-label="Diagnostic accuracy split">
						<span class="meter-correct" style={`flex: ${correctCount};`}>
							<strong>{correctCount}</strong>
							<small>Fungal (correct)</small>
						</span>
						<span class="meter-missed" style={`flex: ${missedCount};`}>
							<strong>{missedCount}</strong>
							<small>Acanthamoeba</small>
						</span>
					</div>
					<ul class="dx-list">
						{#each models as model}
							<li>
								<span class="dx-dot" class:correct={model.leadingDiagnosis >= 20}></span>
								<span class="dx-name">{model.model}</span>
								<span class="dx-call">{model.dxCalled}</span>
							</li>
						{/each}
					</ul>
				</div>

				<div class="plain-section compact">
					<h2>The recurring failure mode</h2>
					<p>
						Anchoring on a single dramatic feature is not random noise — it's a recognizable
						pattern. In this case it was severe pain pulling toward Acanthamoeba. In other
						cases it can be "young patient + headache" pulling toward migraine when it's
						temporal arteritis, or "diabetic + sudden vision loss" pulling toward retinopathy
						when it's optic neuropathy.
					</p>
					<p>
						The mitigation, both for trainees and for models, is the same: after the first
						hypothesis, force a deliberate re-ranking pass against the rest of the case
						features before committing to a treatment plan.
					</p>
				</div>
			</section>

			<section class="chart-section" aria-labelledby="scatter-heading">
				<div class="section-head">
					<div>
						<p class="eyebrow">03 · Two-axis view</p>
						<h2 id="scatter-heading">Diagnostic reasoning vs. safe triage</h2>
						<p class="section-sub">
							X-axis is Dx + Features + Differential (out of 50). Y-axis is Management + Safety
							(out of 20). Bubble size scales with total score. The upper-right quadrant is
							"right diagnosis, safe plan"; the upper-left is the dangerous zone — safe-sounding
							language attached to the wrong disease.
						</p>
					</div>
				</div>

				<div class="scatter" aria-label="Diagnostic reasoning versus safety and triage">
					<div class="axis-label y">Safe triage →</div>
					<div class="axis-label x">Diagnostic reasoning →</div>
					<div class="quadrant tl">Safe but wrong</div>
					<div class="quadrant tr">Right and safe</div>
					<div class="quadrant bl">Wrong and unsafe</div>
					<div class="quadrant br">Right but loose triage</div>
					<div class="midline vert"></div>
					<div class="midline horz"></div>
					{#each models as model}
						<button
							type="button"
							class="point"
							class:active={selectedModel.model === model.model}
							class:correct={model.leadingDiagnosis >= 20}
							style={`left: ${scatterLeft(model)}; bottom: ${scatterBottom(model)}; width: ${30 + model.total / 5}px; height: ${30 + model.total / 5}px;`}
							aria-label={`${model.model}: diagnostic reasoning ${diagnosticX(model)} of 50, safety ${safetyY(model)} of 20`}
							onclick={() => {
								selectedModel = model;
							}}
						>
							<span class="point-label">{model.short}</span>
							<span class="point-tip">
								{model.model} · Dx {diagnosticX(model)}/50 · Safe {safetyY(model)}/20
							</span>
						</button>
					{/each}
				</div>
				<p class="chart-note">
					Claude sits high on the Y-axis (its triage language is safe — referral, no steroids)
					but far left on the X-axis (the lead diagnosis is wrong). That combination is exactly
					what worries clinicians about polished LLM output: it sounds careful while pointing
					the wrong way.
				</p>
			</section>

			<section class="chart-section" aria-labelledby="heatmap-heading">
				<div class="section-head">
					<div>
						<p class="eyebrow">04 · Failure mode matrix</p>
						<h2 id="heatmap-heading">Where each model went off</h2>
						<p class="section-sub">
							Six discrete failure modes from the grading report. Hover a column header to see
							its definition; hover a row to see the model's total error count.
						</p>
					</div>
				</div>

				<div class="errormap">
					<div class="errormap-table" role="table">
						<div class="emap-row emap-header" role="row">
							<div class="emap-cell emap-corner" role="columnheader">Model</div>
							{#each errorModes as mode}
								<div class="emap-cell emap-headcell" role="columnheader" title={mode.detail}>
									<span>{mode.label}</span>
									<small>{mode.detail}</small>
								</div>
							{/each}
							<div class="emap-cell emap-headcell emap-total" role="columnheader">
								<span>Σ</span>
								<small>flags</small>
							</div>
						</div>
						{#each models as model}
							<div class="emap-row" role="row" class:clean={model.errorFlags.length === 0}>
								<div class="emap-cell emap-modelcell" role="rowheader">
									<span>{model.model}</span>
									<small>{model.dxCalled}</small>
								</div>
								{#each errorModes as mode}
									<button
										type="button"
										class="emap-cell emap-flagcell"
										class:on={hasFlag(model, mode.key)}
										title={`${model.model} — ${mode.label}: ${hasFlag(model, mode.key) ? mode.detail : 'no flag'}`}
										onclick={() => {
											selectedModel = model;
										}}
										aria-label={`${model.model} ${mode.label}: ${hasFlag(model, mode.key) ? 'flagged' : 'clear'}`}
									>
										{hasFlag(model, mode.key) ? '●' : '·'}
									</button>
								{/each}
								<div class="emap-cell emap-totalcell">
									{errorCount(model)}
								</div>
							</div>
						{/each}
					</div>
				</div>

				<div class="errormode-legend">
					{#each errorModes as mode}
						<div>
							<strong>{mode.label}.</strong>
							<span>{mode.detail}</span>
						</div>
					{/each}
				</div>
			</section>

			<section class="plain-section">
				<h2>Bottom line</h2>
				<p>
					The top of this leaderboard isn't about raw factual coverage; all seven models knew
					about fungal keratitis, Acanthamoeba, natamycin, and MUTT in some form. The
					separator was <em>feature integration under urgency</em>. GPT-5.5 was first because
					it combined mechanism, timeline, morphology, urgency, and evidence into a single
					primary-care action — refer same-day, don't treat empirically here, and know why
					natamycin is the right drug if treatment is initiated.
				</p>
				<p>
					The two-model miss is the part worth keeping. "Severe pain → Acanthamoeba" is a
					genuine board association that becomes a hazard when it's allowed to override
					stronger case-specific evidence. The job of an AI co-pilot in eye care isn't to know
					more facts than the clinician. It's to avoid the moments where one famous fact eats
					the rest of the case.
				</p>
			</section>

			<footer>
				<a href="/">← Back to home</a>
				<span>© Justin A. Dang · Optometry AI Bench · Summer Grand Rounds 2026, NSUOCO</span>
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
		max-width: 1020px;
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

	.byline {
		margin: 0 0 22px;
		font-family: var(--font-display);
		font-size: 0.82rem;
		color: color-mix(in oklch, var(--foreground), transparent 38%);
	}

	.byline strong {
		color: var(--foreground);
		font-weight: 600;
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
		max-width: 920px;
		margin: 0;
		font-family: var(--font-display);
		font-size: clamp(2.4rem, 7vw, 5.8rem);
		line-height: 0.98;
		letter-spacing: -0.01em;
	}

	h2 {
		margin: 0 0 18px;
		font-family: var(--font-display);
		font-size: clamp(1.4rem, 3vw, 2.1rem);
		line-height: 1.1;
	}

	h3 {
		display: flex;
		align-items: baseline;
		gap: 12px;
		margin: 0 0 10px;
		font-family: var(--font-display);
		font-size: 1.25rem;
	}

	.score-pill {
		display: inline-flex;
		align-items: center;
		padding: 2px 10px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 78%);
		border-radius: 999px;
		font-size: 0.78rem;
		color: color-mix(in oklch, var(--foreground), transparent 25%);
		background: color-mix(in oklch, var(--background), var(--primary) 4%);
	}

	.lede {
		max-width: 820px;
		margin: 28px 0 0;
		font-size: clamp(1.05rem, 2vw, 1.32rem);
		line-height: 1.6;
		color: color-mix(in oklch, var(--foreground), transparent 22%);
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
		min-height: 132px;
		padding: 20px;
		background: color-mix(in oklch, var(--background), var(--primary) 3%);
	}

	.metric {
		display: block;
		font-family: var(--font-display);
		font-size: 2.6rem;
		font-weight: 700;
		line-height: 1;
	}

	.metric small {
		font-size: 0.55em;
		font-weight: 500;
		color: color-mix(in oklch, var(--foreground), transparent 50%);
	}

	.metric-label {
		display: block;
		margin-top: 12px;
		font-family: var(--font-display);
		font-size: 0.78rem;
		line-height: 1.4;
		color: color-mix(in oklch, var(--foreground), transparent 38%);
	}

	.plain-section,
	.chart-section {
		margin: 34px 0;
		padding: 34px 0;
		border-bottom: 1px dashed color-mix(in oklch, var(--foreground), transparent 84%);
	}

	.plain-section {
		max-width: 820px;
	}

	.plain-section p,
	.model-detail > p,
	.chart-note {
		margin: 0 0 18px;
		font-size: 1.02rem;
		line-height: 1.75;
		color: color-mix(in oklch, var(--foreground), transparent 22%);
	}

	.plain-section strong,
	.model-detail strong {
		color: var(--foreground);
	}

	.section-head {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 24px;
		margin-bottom: 28px;
	}

	.section-head > div:first-child {
		max-width: 680px;
	}

	.section-sub {
		margin: 14px 0 0;
		font-size: 0.95rem;
		line-height: 1.6;
		color: color-mix(in oklch, var(--foreground), transparent 36%);
	}

	label {
		display: grid;
		gap: 8px;
		font-family: var(--font-display);
		font-size: 0.76rem;
		color: color-mix(in oklch, var(--foreground), transparent 40%);
	}

	.toggle {
		grid-auto-flow: column;
		grid-template-columns: auto auto;
		align-items: center;
		gap: 10px;
		padding: 10px 14px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 80%);
		border-radius: 6px;
		cursor: pointer;
		user-select: none;
	}

	.toggle input {
		accent-color: var(--primary);
	}

	select {
		min-width: 240px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 78%);
		border-radius: 6px;
		background: var(--background);
		color: var(--foreground);
		padding: 10px 12px;
		font: inherit;
	}

	.bar-list {
		display: grid;
		gap: 6px;
	}

	.bar-row {
		display: grid;
		grid-template-columns: 42px minmax(140px, 220px) minmax(140px, 1fr) 78px;
		align-items: center;
		gap: 16px;
		min-height: 56px;
		border: 1px solid transparent;
		border-radius: 8px;
		background: transparent;
		color: var(--foreground);
		padding: 8px 12px;
		text-align: left;
		cursor: pointer;
		transition: border-color 160ms ease, background 160ms ease;
	}

	.bar-row:hover,
	.bar-row.active {
		border-color: color-mix(in oklch, var(--foreground), transparent 82%);
		background: color-mix(in oklch, var(--primary), transparent 92%);
	}

	.bar-name {
		display: grid;
		gap: 4px;
		font-family: var(--font-display);
	}

	.bar-sub {
		font-size: 0.7rem;
		font-weight: 400;
		color: color-mix(in oklch, var(--foreground), transparent 48%);
	}

	.rank,
	.bar-value {
		font-family: var(--font-display);
	}

	.rank {
		color: color-mix(in oklch, var(--foreground), transparent 58%);
	}

	.bar-value {
		text-align: right;
		font-variant-numeric: tabular-nums;
	}

	.bar-value small {
		color: color-mix(in oklch, var(--foreground), transparent 55%);
		font-size: 0.7em;
	}

	.bar-track {
		position: relative;
		height: 20px;
		overflow: hidden;
		border-radius: 4px;
		background: color-mix(in oklch, var(--foreground), transparent 92%);
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 88%);
	}

	.bar-fill {
		position: absolute;
		inset: 0 auto 0 0;
		background: linear-gradient(90deg, var(--primary), color-mix(in oklch, var(--primary), white 22%));
		transition: width 320ms cubic-bezier(0.2, 0.8, 0.2, 1);
	}

	.bar-tick {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 1px;
		background: color-mix(in oklch, var(--foreground), transparent 80%);
	}

	.model-detail {
		margin-top: 28px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 84%);
		border-radius: 10px;
		padding: 24px;
		background: color-mix(in oklch, var(--background), var(--primary) 3%);
	}

	.detail-columns {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1px;
		margin-top: 20px;
		background: color-mix(in oklch, var(--foreground), transparent 86%);
		border-radius: 6px;
		overflow: hidden;
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
	.cat-pill {
		font-family: var(--font-display);
	}

	.detail-columns span {
		color: color-mix(in oklch, var(--foreground), transparent 28%);
		line-height: 1.55;
		font-size: 0.94rem;
	}

	.detail-cats {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 8px;
		margin-top: 20px;
	}

	.cat-pill {
		display: grid;
		gap: 5px;
		padding: 10px 12px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 86%);
		border-radius: 6px;
		font-size: 0.72rem;
	}

	.cat-pill-label {
		color: color-mix(in oklch, var(--foreground), transparent 42%);
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.cat-pill-value {
		font-size: 0.95rem;
		font-weight: 700;
		font-variant-numeric: tabular-nums;
	}

	.cat-pill-value small {
		font-weight: 500;
		font-size: 0.7em;
		color: color-mix(in oklch, var(--foreground), transparent 50%);
	}

	.cat-pill-bar {
		display: block;
		height: 4px;
		border-radius: 999px;
		background: color-mix(in oklch, var(--foreground), transparent 90%);
		overflow: hidden;
	}

	.cat-pill-bar span {
		display: block;
		height: 100%;
		transition: width 320ms ease;
	}

	.stacked-list {
		display: grid;
		gap: 12px;
	}

	.stacked-row {
		display: grid;
		grid-template-columns: minmax(160px, 220px) 1fr;
		align-items: center;
		gap: 16px;
	}

	.stacked-label {
		display: flex;
		justify-content: space-between;
		gap: 12px;
		font-size: 0.92rem;
	}

	.stacked-label small {
		font-size: 0.72em;
		font-weight: 500;
		color: color-mix(in oklch, var(--foreground), transparent 52%);
	}

	.stacked-bar {
		display: flex;
		height: 28px;
		overflow: hidden;
		border-radius: 5px;
		background: color-mix(in oklch, var(--foreground), transparent 92%);
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 88%);
	}

	.stacked-bar span {
		min-width: 2px;
		transition: width 320ms ease;
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: 10px 18px;
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

	.legend em {
		font-style: normal;
		color: color-mix(in oklch, var(--foreground), transparent 55%);
	}

	.split-section {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 36px;
		margin: 34px 0;
		padding: 34px 0;
		border-bottom: 1px dashed color-mix(in oklch, var(--foreground), transparent 84%);
	}

	.compact {
		margin: 0;
		padding: 0;
		border: 0;
		max-width: none;
	}

	.diagnosis-meter {
		display: flex;
		overflow: hidden;
		border-radius: 8px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 84%);
		font-family: var(--font-display);
		font-size: 0.78rem;
		margin: 8px 0 18px;
	}

	.diagnosis-meter span {
		display: grid;
		gap: 4px;
		justify-items: center;
		align-content: center;
		min-height: 68px;
		color: white;
		padding: 8px;
	}

	.diagnosis-meter strong {
		font-size: 1.4rem;
	}

	.diagnosis-meter small {
		font-size: 0.7rem;
		opacity: 0.85;
	}

	.meter-correct {
		background: #15803d;
	}

	.meter-missed {
		background: #b91c1c;
	}

	.dx-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 6px;
		font-family: var(--font-display);
		font-size: 0.85rem;
	}

	.dx-list li {
		display: grid;
		grid-template-columns: 12px minmax(120px, 1fr) 2fr;
		align-items: center;
		gap: 10px;
		padding: 6px 10px;
		border-bottom: 1px dashed color-mix(in oklch, var(--foreground), transparent 88%);
	}

	.dx-dot {
		width: 9px;
		height: 9px;
		border-radius: 999px;
		background: #b91c1c;
	}

	.dx-dot.correct {
		background: #15803d;
	}

	.dx-call {
		color: color-mix(in oklch, var(--foreground), transparent 38%);
	}

	.scatter {
		position: relative;
		height: 460px;
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 82%);
		border-radius: 10px;
		background:
			linear-gradient(color-mix(in oklch, var(--foreground), transparent 94%) 1px, transparent 1px),
			linear-gradient(90deg, color-mix(in oklch, var(--foreground), transparent 94%) 1px, transparent 1px);
		background-size: 12.5% 12.5%;
		overflow: hidden;
	}

	.midline {
		position: absolute;
		background: color-mix(in oklch, var(--foreground), transparent 80%);
	}

	.midline.vert {
		top: 8%;
		bottom: 8%;
		left: 50%;
		width: 1px;
	}

	.midline.horz {
		left: 8%;
		right: 8%;
		top: 50%;
		height: 1px;
	}

	.quadrant {
		position: absolute;
		font-family: var(--font-display);
		font-size: 0.65rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: color-mix(in oklch, var(--foreground), transparent 60%);
		padding: 8px 10px;
	}

	.quadrant.tl { top: 8px; left: 12px; }
	.quadrant.tr { top: 8px; right: 12px; }
	.quadrant.bl { bottom: 8px; left: 12px; }
	.quadrant.br { bottom: 8px; right: 12px; }

	.axis-label {
		position: absolute;
		font-family: var(--font-display);
		font-size: 0.7rem;
		color: color-mix(in oklch, var(--foreground), transparent 42%);
		letter-spacing: 0.06em;
	}

	.axis-label.y {
		top: 50%;
		left: 14px;
		transform: rotate(-90deg) translateX(50%);
		transform-origin: left top;
	}

	.axis-label.x {
		right: 14px;
		bottom: 12px;
	}

	.point {
		position: absolute;
		display: grid;
		place-items: center;
		transform: translate(-50%, 50%);
		border: 1.5px solid color-mix(in oklch, var(--foreground), transparent 50%);
		border-radius: 999px;
		background: color-mix(in oklch, var(--background), #b91c1c 24%);
		color: var(--foreground);
		box-shadow: 0 14px 35px color-mix(in oklch, black, transparent 86%);
		cursor: pointer;
		transition: transform 160ms ease, outline-color 160ms ease;
		padding: 0;
	}

	.point.correct {
		background: color-mix(in oklch, var(--background), var(--primary) 28%);
	}

	.point:hover,
	.point.active {
		outline: 3px solid color-mix(in oklch, var(--primary), transparent 62%);
		transform: translate(-50%, 50%) scale(1.06);
		z-index: 3;
	}

	.point-label {
		font-family: var(--font-display);
		font-size: 0.68rem;
		font-weight: 700;
	}

	.point-tip {
		position: absolute;
		top: -38px;
		left: 50%;
		transform: translateX(-50%);
		white-space: nowrap;
		font-family: var(--font-display);
		font-size: 0.7rem;
		padding: 5px 8px;
		border-radius: 5px;
		background: var(--foreground);
		color: var(--background);
		opacity: 0;
		pointer-events: none;
		transition: opacity 160ms ease;
	}

	.point:hover .point-tip,
	.point.active .point-tip {
		opacity: 1;
	}

	.chart-note {
		margin-top: 16px;
		font-size: 0.95rem;
		max-width: 760px;
	}

	.errormap {
		border: 1px solid color-mix(in oklch, var(--foreground), transparent 84%);
		border-radius: 10px;
		overflow: hidden;
		background: var(--background);
	}

	.errormap-table {
		display: grid;
	}

	.emap-row {
		display: grid;
		grid-template-columns: minmax(180px, 1.4fr) repeat(6, minmax(78px, 1fr)) 64px;
	}

	.emap-row + .emap-row {
		border-top: 1px solid color-mix(in oklch, var(--foreground), transparent 88%);
	}

	.emap-row.clean .emap-modelcell::after {
		content: '✓ clean';
		display: inline-block;
		margin-left: 10px;
		padding: 2px 8px;
		font-size: 0.65rem;
		letter-spacing: 0.04em;
		border-radius: 999px;
		color: #15803d;
		background: color-mix(in oklch, #15803d, transparent 88%);
	}

	.emap-cell {
		min-height: 64px;
		padding: 10px;
		font-family: var(--font-display);
		display: grid;
		align-content: center;
		gap: 3px;
		border-right: 1px solid color-mix(in oklch, var(--foreground), transparent 90%);
	}

	.emap-cell:last-child {
		border-right: 0;
	}

	.emap-header .emap-cell {
		background: color-mix(in oklch, var(--background), var(--foreground) 4%);
		border-bottom: 1px solid color-mix(in oklch, var(--foreground), transparent 84%);
	}

	.emap-corner {
		font-size: 0.78rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: color-mix(in oklch, var(--foreground), transparent 42%);
	}

	.emap-headcell {
		font-size: 0.7rem;
		text-align: center;
		justify-items: center;
	}

	.emap-headcell span {
		font-weight: 700;
		font-size: 0.76rem;
		letter-spacing: 0.04em;
	}

	.emap-headcell small {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		font-size: 0.62rem;
		line-height: 1.3;
		color: color-mix(in oklch, var(--foreground), transparent 48%);
	}

	.emap-total {
		background: color-mix(in oklch, var(--background), var(--foreground) 6%) !important;
	}

	.emap-modelcell {
		font-size: 0.88rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 2px;
		background: color-mix(in oklch, var(--background), var(--primary) 2%);
	}

	.emap-modelcell small {
		font-size: 0.66rem;
		color: color-mix(in oklch, var(--foreground), transparent 46%);
	}

	.emap-flagcell {
		display: grid;
		place-items: center;
		font-size: 1.15rem;
		background: transparent;
		color: color-mix(in oklch, var(--foreground), transparent 78%);
		cursor: pointer;
		border-top: 0;
		border-bottom: 0;
		border-left: 0;
		transition: background 160ms ease, color 160ms ease;
	}

	.emap-flagcell:hover {
		background: color-mix(in oklch, var(--foreground), transparent 92%);
	}

	.emap-flagcell.on {
		background: color-mix(in oklch, #b91c1c, transparent 72%);
		color: #b91c1c;
		font-weight: 700;
	}

	:global(.dark) .emap-flagcell.on {
		background: color-mix(in oklch, #fca5a5, transparent 80%);
		color: #fca5a5;
	}

	.emap-totalcell {
		justify-content: center;
		text-align: center;
		font-size: 1.05rem;
		font-weight: 700;
		background: color-mix(in oklch, var(--background), var(--foreground) 4%);
		font-variant-numeric: tabular-nums;
	}

	.errormode-legend {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 10px 24px;
		margin-top: 20px;
		font-family: var(--font-display);
		font-size: 0.78rem;
		line-height: 1.5;
		color: color-mix(in oklch, var(--foreground), transparent 28%);
	}

	.errormode-legend strong {
		color: var(--foreground);
	}

	footer {
		padding-top: 28px;
	}

	@media (max-width: 820px) {
		.bench-page {
			padding: 28px 18px 52px;
		}

		.hero {
			padding-top: 48px;
		}

		.hero-grid,
		.split-section,
		.detail-columns,
		.errormode-legend {
			grid-template-columns: 1fr;
		}

		.section-head {
			display: grid;
			align-items: start;
		}

		select,
		.toggle {
			width: 100%;
		}

		.bar-row {
			grid-template-columns: 30px 1fr 64px;
			gap: 10px;
		}

		.bar-row .bar-track {
			grid-column: 1 / -1;
		}

		.bar-name {
			grid-column: 2 / 3;
		}

		.detail-cats {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.stacked-row {
			grid-template-columns: 1fr;
			gap: 6px;
		}

		.scatter {
			height: 380px;
		}

		.emap-row {
			grid-template-columns: 130px repeat(6, 70px) 52px;
		}

		.errormap {
			overflow-x: auto;
		}
	}
</style>
