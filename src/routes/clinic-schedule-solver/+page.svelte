<script lang="ts">
	import { fade } from 'svelte/transition';
	import DarkModeToggle from '$lib/components/DarkModeToggle.svelte';

	const scale = [
		{ value: '27', label: 'third-year students' },
		{ value: '170', label: 'AM/PM periods in the term' },
		{ value: '79', label: 'schedulable periods per student' },
		{ value: '19', label: 'assignment codes' },
		{ value: '2,133', label: 'published assignments' },
		{ value: '1,599', label: 'protected clinic seats' }
	];

	const milestones = [
		{
			date: 'July 21',
			title: 'Source handoff',
			body: 'I received the current clinic allocations, a rough calendar, a blank workbook, and the prior-year schedule.'
		},
		{
			date: 'July 23–24',
			title: 'Rules became explicit',
			body: 'Written follow-up and a 14-minute requirements conversation clarified continuity blocks, REP groups, duties, and review priorities.'
		},
		{
			date: 'August 1–4',
			title: 'Candidates and correction',
			body: 'Faculty reviewed successive Excel candidates. An Orientation closure caught on August 4 changed the model and removed 27 invalid assignments.'
		},
		{
			date: 'August 6',
			title: 'Faculty publication',
			body: 'The approved schedules were distributed together, eleven days before clinic began.'
		},
		{
			date: 'August 17',
			title: 'Operational delivery',
			body: 'ClinicHub held all 2,133 published student-period assignments with source provenance.'
		}
	];

	const ruleExamples = [
		{
			kind: 'Hard',
			example: 'Exactly one assignment in every open student-period',
			failure: 'A student is double-booked or left blank'
		},
		{
			kind: 'Hard',
			example: 'Meet the dated capacity for protected clinics',
			failure: 'A staffed clinic seat goes uncovered'
		},
		{
			kind: 'Hard',
			example: 'Keep CL and VT in approved continuity blocks',
			failure: 'Experience becomes fragmented across the semester'
		},
		{
			kind: 'Hard',
			example: 'Link ordinary REP mornings and afternoons',
			failure: 'A full-day rotation is split incorrectly'
		},
		{
			kind: 'Soft',
			example: 'Minimize the spread in protected exposure',
			failure: 'The schedule is legal but needlessly uneven'
		},
		{
			kind: 'Soft',
			example: 'Reduce recurrence and awkward isolated assignments',
			failure: 'The schedule is harder to learn and review'
		}
	];

	const comparison = [
		{ code: 'WI', candidate: 100, published: 106, delta: '+6' },
		{ code: 'DSN', candidate: 55, published: 53, delta: '−2' },
		{ code: 'SF', candidate: 55, published: 53, delta: '−2' },
		{ code: 'OC', candidate: 48, published: 46, delta: '−2' }
	];

	let mounted = $state(false);

	$effect(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Scheduling 2,133 clinic assignments in 119 seconds — Justin Dang</title>
	<meta
		name="description"
		content="A technical case study of translating an optometry clinic semester into a CP-SAT constraint model, validating it independently, and comparing the candidate with the faculty-published schedule."
	/>
	<link rel="canonical" href="https://justindang.dev/clinic-schedule-solver" />
	<meta property="og:title" content="Scheduling 2,133 clinic assignments in 119 seconds" />
	<meta
		property="og:description"
		content="How I modeled an optometry clinic semester with set theory, CP-SAT, independent validation, and faculty review."
	/>
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://justindang.dev/clinic-schedule-solver" />
</svelte:head>

{#if mounted}
	<div class="case-study" in:fade={{ duration: 180 }}>
		<div class="grid-paper" aria-hidden="true"></div>

		<header class="site-bar">
			<a class="back-link" href="/" aria-label="Back to Justin Dang's home page">← justindang.dev</a>
			<DarkModeToggle />
		</header>

		<main>
			<header class="hero">
				<div class="hero-kicker">
					<span>Case study 01</span>
					<span>Fall 2026</span>
					<span>Optometry × operations research</span>
				</div>

				<h1>Scheduling 2,133 clinic assignments in 119 seconds</h1>
				<p class="dek">
					I translated a semester of clinic rules into a constrained optimization model, then built
					the review and validation path that carried a candidate into the faculty-published
					schedule.
				</p>

				<div class="hero-metrics" aria-label="Project highlights">
					<div>
						<strong>119.12 s</strong>
						<span>canonical solve</span>
					</div>
					<div>
						<strong>0</strong>
						<span>validation errors</span>
					</div>
					<div>
						<strong>99.34%</strong>
						<span>candidate cells retained</span>
					</div>
					<div>
						<strong>11 days</strong>
						<span>before clinic began</span>
					</div>
				</div>

				<p class="byline">By Justin Dang · August 17, 2026 · 14 minute read</p>
			</header>

			<div class="article-layout">
				<aside class="rail" aria-label="Article contents">
					<p>Contents</p>
					<a href="#felt-problem">01 / The felt problem</a>
					<a href="#requirements">02 / Requirements</a>
					<a href="#model">03 / The model</a>
					<a href="#optimization">04 / Optimization</a>
					<a href="#validation">05 / Validation</a>
					<a href="#comparison">06 / Published result</a>
					<a href="#delivery">07 / Delivery</a>
					<a href="#next">08 / Next iteration</a>
				</aside>

				<article>
					<section class="opening" id="felt-problem">
						<p class="lead">
							Every optometry student feels the clinic schedule as a personal object: where to be on
							Tuesday morning, which service comes next, whether a Friday is REP, and how much time
							remains for everything outside clinic. Producing that one row requires a semester-wide
							decision for every student at the same time.
						</p>

						<p>
							For Fall 2026, I worked on the third-year schedule for 27 students. The calendar held
							85 weekdays and 170 morning or afternoon periods. Closures left 79 schedulable periods
							per student, so the finished schedule contained exactly
							<mark>27 × 79 = 2,133 assignments</mark>.
						</p>

						<div class="stat-grid">
							{#each scale as item}
								<div class="stat-cell">
									<strong>{item.value}</strong>
									<span>{item.label}</span>
								</div>
							{/each}
						</div>

						<p>
							A naïve view gives each open student-period 19 possible codes. That upper bound is 19<sup
								>2,133</sup
							>, greater than 10<sup>2,700</sup> possible schedules. Most of those combinations are illegal.
							The task is to describe the legal region precisely enough for a solver to search it efficiently
							and for a human to trust the result.
						</p>
					</section>

					<section id="requirements">
						<div class="section-label"><span>02</span> Requirements before algorithms</div>
						<h2>The first input was a stack of imperfect evidence</h2>
						<p>
							On July 21, I received four different source files: current allocation notes, a rough
							calendar document, a blank Fall 2026 workbook, and the prior-year workbook. They
							served different purposes. One described desired capacity, one showed the shape of the
							term, one was the expected review artifact, and one preserved history.
						</p>
						<p>
							The files also carried the usual operational debris: stale years, special-event tabs,
							three broken spreadsheet formulas, ambiguous abbreviations, and historical patterns
							that did not automatically represent current policy. Direct faculty clarifications on
							July 23 and a recorded requirements conversation on July 24 resolved many of the
							important rules.
						</p>

						<div class="timeline" aria-label="Project timeline">
							{#each milestones as item, index}
								<div class="timeline-row">
									<div class="timeline-index">{String(index + 1).padStart(2, '0')}</div>
									<div class="timeline-date">{item.date}</div>
									<div>
										<h3>{item.title}</h3>
										<p>{item.body}</p>
									</div>
								</div>
							{/each}
						</div>

						<h3 class="subhead">The source-to-schedule pipeline</h3>
						<div
							class="pipeline"
							role="img"
							aria-label="Source documents become normalized rules, a solver candidate, independent validation, faculty review, a published PDF, and ClinicHub data"
						>
							<div>
								<span>01</span><strong>Documents + conversation</strong><small
									>facts and tacit rules</small
								>
							</div>
							<i>→</i>
							<div>
								<span>02</span><strong>Normalized configuration</strong><small
									>dated, typed, hashed</small
								>
							</div>
							<i>→</i>
							<div>
								<span>03</span><strong>CP-SAT candidate</strong><small
									>constraints + objectives</small
								>
							</div>
							<i>→</i>
							<div>
								<span>04</span><strong>Independent validator</strong><small
									>recompute every claim</small
								>
							</div>
							<i>→</i>
							<div><span>05</span><strong>Faculty review</strong><small>Excel + totals</small></div>
							<i>→</i>
							<div>
								<span>06</span><strong>PDF + ClinicHub</strong><small>published truth</small>
							</div>
						</div>

						<p>
							I kept authority explicit throughout that path. Newer, direct faculty guidance
							outranked old workbook patterns. Solver output remained a candidate until faculty
							approved and published it. File hashes and source references made each run
							reproducible.
						</p>
					</section>

					<section id="model">
						<div class="section-label"><span>03</span> Mathematical model</div>
						<h2>A Boolean tensor with clinical meaning</h2>
						<p>I represented the schedule with three finite sets:</p>

						<div class="set-cards">
							<div><code>S</code><strong>Students</strong><span>|S| = 27</span></div>
							<div>
								<code>T</code><strong>Open periods</strong><span>|T| = 79 per student</span>
							</div>
							<div><code>C</code><strong>Assignment codes</strong><span>|C| = 19</span></div>
						</div>

						<p>
							For each legal triple <em>(s, t, c)</em> in <em>S × T × C</em>, the solver can create
							a Boolean decision variable. The full tensor has 27 × 79 × 19 = 40,527 possible cells
							before eligibility pruning.
						</p>

						<div class="formula-card">
							<span class="formula-name">Decision variable</span>
							<div class="formula">x<sub>s,t,c</sub> ∈ &#123;0, 1&#125;</div>
							<p>
								x equals one when student <em>s</em> receives code <em>c</em> during period
								<em>t</em>.
							</p>
						</div>

						<div class="formula-grid">
							<div class="formula-card">
								<span class="formula-name">Exactly one</span>
								<div class="formula">∑<sub>c∈C</sub> x<sub>s,t,c</sub> = 1</div>
								<p>Every open student-period receives one explicit assignment.</p>
							</div>
							<div class="formula-card">
								<span class="formula-name">Dated coverage</span>
								<div class="formula">∑<sub>s∈S</sub> x<sub>s,t,c</sub> = r<sub>t,c</sub></div>
								<p>Protected clinics receive the required number of students.</p>
							</div>
							<div class="formula-card">
								<span class="formula-name">Eligibility</span>
								<div class="formula">x<sub>s,t,c</sub> ≤ e<sub>s,t,c</sub></div>
								<p>A variable cannot turn on when the assignment is unavailable.</p>
							</div>
							<div class="formula-card">
								<span class="formula-name">Linked REP day</span>
								<div class="formula">x<sub>s,fAM,REP</sub> = x<sub>s,fPM,REP</sub></div>
								<p>Ordinary REP turns preserve the same student for both sessions.</p>
							</div>
						</div>

						<p>
							Some constraints are global arithmetic. CL required 175 student-occurrences, so 13
							students receive seven and 14 receive six:
							<mark>13(7) + 14(6) = 175</mark>. VT required 116, which becomes eight students with
							five and 19 with four: <mark>8(5) + 19(4) = 116</mark>. Those one-assignment
							differences are the fairest integer solutions available.
						</p>

						<div class="formula-card wide-formula">
							<span class="formula-name">Exposure bands</span>
							<div class="formula formula-pair">
								<span>6 ≤ ∑<sub>t∈T</sub> x<sub>s,t,CL</sub> ≤ 7</span>
								<span>4 ≤ ∑<sub>t∈T</sub> x<sub>s,t,VT</sub> ≤ 5</span>
							</div>
							<p>
								The model guarantees the band for every student, then decides who receives the extra
								seat.
							</p>
						</div>

						<div class="table-wrap">
							<table>
								<thead><tr><th>Class</th><th>Example</th><th>What a violation means</th></tr></thead
								>
								<tbody>
									{#each ruleExamples as rule}
										<tr>
											<td
												><span class:soft={rule.kind === 'Soft'} class="rule-pill">{rule.kind}</span
												></td
											>
											<td>{rule.example}</td>
											<td>{rule.failure}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					</section>

					<section id="optimization">
						<div class="section-label"><span>04</span> Optimization</div>
						<h2>Fairness has several definitions</h2>
						<p>
							A schedule can satisfy every hard rule and still distribute experience poorly. I
							measured fairness separately for protected clinics, duties, REP turns, residual BP,
							and families such as WI + WIS. A single blended score would make those tradeoffs
							harder to inspect.
						</p>

						<div class="formula-grid">
							<div class="formula-card">
								<span class="formula-name">Student count</span>
								<div class="formula">n<sub>s,c</sub> = ∑<sub>t∈T</sub> x<sub>s,t,c</sub></div>
								<p>Total assignments of code <em>c</em> received by student <em>s</em>.</p>
							</div>
							<div class="formula-card">
								<span class="formula-name">Range</span>
								<div class="formula">
									R<sub>c</sub> = max<sub>s</sub> n<sub>s,c</sub> − min<sub>s</sub> n<sub>s,c</sub>
								</div>
								<p>A transparent measure of the widest student-to-student gap.</p>
							</div>
						</div>

						<p>
							The objective was lexicographic: 15 ordered stages, each solved and pinned before the
							next began. If stage <em>i</em> reached optimum v<sup>*</sup><sub>i</sub>, the next
							stage ran with f<sub>i</sub>(x) = v<sup>*</sup><sub>i</sub> added as a constraint. Later
							cleanup could not trade away protected coverage or a higher-priority fairness result.
						</p>

						<div class="objective-stack" aria-label="Lexicographic objective order">
							<div style="--w: 100%"><span>01</span> Feasibility and protected coverage</div>
							<div style="--w: 88%">
								<span>02–05</span> Protected-clinic fairness and continuity
							</div>
							<div style="--w: 73%"><span>06–08</span> REP placement and residual fill</div>
							<div style="--w: 58%"><span>09–13</span> Duties, RPA, and BP fairness</div>
							<div style="--w: 43%"><span>14–15</span> Recurrence cleanup</div>
						</div>

						<p>
							This also explains one counterintuitive result. Raw BP ranged from 5 to 11, because
							two students held fixed TA responsibilities. The operational residual was
							<mark>q<sub>s</sub> = n<sub>s,BP</sub> + n<sub>s,TA</sub></mark>, and that combined
							load ranged only from 10 to 11. Reporting the raw BP spread alone would misdescribe
							the workload.
						</p>
					</section>

					<section id="validation">
						<div class="section-label"><span>05</span> Runtime and proof</div>
						<h2>The solve took two minutes. Trust took more engineering.</h2>
						<div class="run-card">
							<div class="run-head">
								<span>canonical-run / 2026-08-17</span><strong>OPTIMAL</strong>
							</div>
							<div class="run-grid">
								<div><span>wall time</span><strong>119.12 s</strong></div>
								<div><span>workers</span><strong>8</strong></div>
								<div><span>seed</span><strong>20260817</strong></div>
								<div><span>time budget</span><strong>180 s</strong></div>
								<div><span>errors</span><strong>0</strong></div>
								<div><span>warnings</span><strong>7</strong></div>
							</div>
						</div>

						<p>
							I wrote a separate validator that reconstructs the result from assignment rows. It
							checks uniqueness, dated coverage, closures, CL/VT continuity, REP linkage, TA, duty
							capacity, and aggregate counts without trusting the solver’s own telemetry. The
							retained run passed with zero errors and seven explainable warnings: one OC soft
							target, four CL bridge seats on October 13, and eight VT supplement seats across five
							dates.
						</p>
						<p>
							Additional corrected seeds solved in 71–76 seconds. Different seeds can choose
							different students for interchangeable slots while preserving the same hard rules and
							aggregate quality. Reproducibility therefore includes the configuration hash, seed,
							objective results, validation report, and exported artifact.
						</p>

						<aside class="incident-note">
							<span>Input incident · August 4</span>
							<h3>The model initially solved an open period that was actually Orientation.</h3>
							<p>
								The early candidate contained 2,160 assignments, or 80 per student. Faculty caught
								that August 17 PM was closed. I changed the calendar source, reran the model, and
								the correct total became 2,133. The optimizer had been consistent with its input.
								The input did not yet represent the operational calendar.
							</p>
							<p>
								That correction shaped the architecture: preflight checks, explicit closures,
								independent validation, and human review all remain first-class stages.
							</p>
						</aside>
					</section>

					<section id="comparison">
						<div class="section-label"><span>06</span> Candidate → published</div>
						<h2>Faculty retained 2,119 of 2,133 assignments</h2>
						<p>
							I compared the corrected solver candidate against the immutable August 6 PDF and
							ClinicHub’s normalized import, using one key per student, date, and AM/PM session. The
							published schedule matched 99.34% of candidate cells. Fourteen PM assignments changed;
							every AM cell and every Friday cell matched.
						</p>

						<div
							class="match-figure"
							role="img"
							aria-label="Of 2,133 assignments, 2,119 were retained and 14 were changed in the faculty-published schedule"
						>
							<div class="match-labels">
								<strong>2,119 retained</strong><span>14 adjusted</span>
							</div>
							<div class="match-bar"><span></span><i></i></div>
							<div class="match-axis">
								<span>candidate</span><b>99.34% exact cell match</b><span>published</span>
							</div>
						</div>

						<div class="table-wrap compact-table">
							<table>
								<thead><tr><th>Code</th><th>Candidate</th><th>Published</th><th>Δ</th></tr></thead>
								<tbody>
									{#each comparison as row}
										<tr
											><td><code>{row.code}</code></td><td>{row.candidate}</td><td
												>{row.published}</td
											><td class:positive={row.delta === '+6'}>{row.delta}</td></tr
										>
									{/each}
								</tbody>
							</table>
						</div>

						<p>
							All other clinic totals matched exactly, including CL 175, VT 116, BP 270, and REP 144
							half-days (72 linked full-day turns). The changes appeared in four of the 17 weeks.
							The net result added six WI assignments and removed two each from DSN, SF, and OC. The
							WI + WIS distribution tightened from one student at four, seven at five, and 19 at six
							to three students at five and 24 at six. I read that as a clear faculty preference for
							stronger Walk-In exposure.
						</p>

						<p>
							The comparison is useful because it measures more than agreement. It shows where human
							judgment entered after mathematical generation. The solver carried almost the entire
							structure; faculty made a small, interpretable clinical adjustment and owned the final
							publication.
						</p>
					</section>

					<section id="delivery">
						<div class="section-label"><span>07</span> What students receive</div>
						<h2>The output became operational data</h2>
						<p>
							The familiar Excel grid remained valuable for faculty review because it preserved
							their workflow and bottom-of-sheet totals. Publication used the faculty-approved PDF.
							I then normalized that PDF into ClinicHub with a pinned source hash, 27-student and
							2,133-row invariants, page-level provenance, and exactly 79 assignments per student.
						</p>

						<div class="delivery-grid">
							<div>
								<span>Review</span><strong>Excel workbook</strong>
								<p>Familiar grid, visible totals, quick comments.</p>
							</div>
							<div>
								<span>Authority</span><strong>Published PDF</strong>
								<p>Faculty approval and immutable release evidence.</p>
							</div>
							<div>
								<span>Use</span><strong>ClinicHub</strong>
								<p>Personal views, search, coordination, and validated swap workflows.</p>
							</div>
						</div>

						<p>
							In the one historical comparison available to me, the Fall 2024 third-year schedule
							was released seven days before clinic began, after the other schedules had already
							been finalized. In 2026, all four schedules were distributed together on August 6,
							eleven days before the August 17 start. That is one cycle of evidence: four more days
							of lead time and a more coordinated release.
						</p>

						<h3 class="subhead">Where the value came from</h3>
						<ul class="value-list">
							<li>
								<strong>Requirements became institutional memory.</strong> A later scheduler can inspect
								the rule, its source, and its priority.
							</li>
							<li>
								<strong>Changes became localized reruns.</strong> A closure or capacity update can enter
								a new version without rebuilding the workbook by hand.
							</li>
							<li>
								<strong>Fairness became inspectable.</strong> Students and reviewers can see the spread
								for each kind of experience.
							</li>
							<li>
								<strong>Errors became testable.</strong> The validator checks the result independently,
								and warnings name the remaining exceptions.
							</li>
							<li>
								<strong>Review stayed familiar.</strong> The technical system produces an Excel artifact
								that fits the existing faculty process.
							</li>
							<li>
								<strong>Publication gained provenance.</strong> The final PDF and ClinicHub import preserve
								a verifiable source boundary.
							</li>
						</ul>
					</section>

					<section id="next">
						<div class="section-label"><span>08</span> Next iteration</div>
						<h2>The remaining work is mostly workflow</h2>
						<p>
							The current system generates and validates a strong candidate. The next maturity step
							is a formal lifecycle—candidate, reviewed, approved, published, amended, and
							superseded—with a direct signed handoff from the solver artifact into ClinicHub.
							Today, the final import is still specific to a PDF.
						</p>
						<p>
							I also want explicit locks for faculty edits, partial re-optimization around those
							locks, one authoritative calendar editor, and models that coordinate third-year,
							fourth-year, faculty, rooms, and sites. Those extensions will increase the model’s
							scope and make governance even more important.
						</p>

						<div class="closing">
							<p>
								The 119-second solve is the easiest number to remember. The larger contribution is
								the chain around it: source reconciliation, explicit mathematics, staged objectives,
								independent checks, faculty review, and traceable delivery. That chain helps
								students receive a schedule sooner and gives the people building it a system they
								can reason about.
							</p>
						</div>
					</section>

					<footer class="article-footer">
						<p>
							Scope note: this case study reports aggregate Fall 2026 third-year scheduling data.
							Student identities and private correspondence are omitted. “OPTIMAL” refers to the
							encoded CP-SAT model; faculty approval and the August 6 publication established the
							official schedule.
						</p>
						<a href="/">← Back to justindang.dev</a>
					</footer>
				</article>
			</div>
		</main>
	</div>
{/if}

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
	.case-study {
		--ink: #17201d;
		--muted: #5b6762;
		--paper: #f4f1e8;
		--panel: rgba(255, 255, 255, 0.58);
		--line: #c9c9bc;
		--green: #08775d;
		--green-soft: #cae5dc;
		--orange: #b84f2a;
		--yellow: #ead791;
		position: relative;
		min-height: 100vh;
		background: var(--paper);
		color: var(--ink);
		font-family: var(--font-sans), system-ui, sans-serif;
	}
	:global(.dark) .case-study {
		--ink: #e8ece9;
		--muted: #a8b1ad;
		--paper: #111614;
		--panel: rgba(29, 37, 33, 0.74);
		--line: #3a4540;
		--green: #71d0b2;
		--green-soft: #193f34;
		--orange: #ee8a63;
		--yellow: #5a512f;
	}
	.grid-paper {
		position: fixed;
		inset: 0;
		pointer-events: none;
		opacity: 0.42;
		background-image:
			linear-gradient(
				to right,
				color-mix(in srgb, var(--line) 35%, transparent) 1px,
				transparent 1px
			),
			linear-gradient(
				to bottom,
				color-mix(in srgb, var(--line) 35%, transparent) 1px,
				transparent 1px
			);
		background-size: 32px 32px;
		mask-image: linear-gradient(to bottom, black, transparent 82%);
	}
	.site-bar {
		position: relative;
		z-index: 2;
		display: flex;
		max-width: 1180px;
		margin: 0 auto;
		padding: 28px 30px;
		align-items: center;
		justify-content: space-between;
	}
	.back-link {
		color: var(--muted);
		font:
			600 0.76rem/1 var(--font-mono),
			monospace;
		letter-spacing: 0.08em;
		text-decoration: none;
		text-transform: uppercase;
	}
	.back-link:hover {
		color: var(--green);
	}
	main {
		position: relative;
		z-index: 1;
	}
	.hero {
		max-width: 1180px;
		margin: 40px auto 0;
		padding: 0 30px 70px;
		border-bottom: 1px solid var(--line);
	}
	.hero-kicker {
		display: flex;
		flex-wrap: wrap;
		gap: 10px 26px;
		color: var(--green);
		font:
			650 0.72rem/1.4 var(--font-mono),
			monospace;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	h1 {
		max-width: 1040px;
		margin: 28px 0 22px;
		font-size: clamp(3.2rem, 8.5vw, 7.9rem);
		font-weight: 680;
		line-height: 0.91;
		letter-spacing: -0.075em;
		text-wrap: balance;
	}
	.dek {
		max-width: 780px;
		margin: 0;
		color: var(--muted);
		font-size: clamp(1.25rem, 2.3vw, 1.75rem);
		line-height: 1.48;
		letter-spacing: -0.025em;
	}
	.hero-metrics {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		margin-top: 55px;
		border-block: 1px solid var(--line);
	}
	.hero-metrics > div {
		padding: 20px 18px 18px 0;
		border-right: 1px solid var(--line);
	}
	.hero-metrics > div:not(:first-child) {
		padding-left: 18px;
	}
	.hero-metrics > div:last-child {
		border-right: 0;
	}
	.hero-metrics strong {
		display: block;
		color: var(--green);
		font:
			650 clamp(1.7rem, 3vw, 2.6rem)/1 var(--font-mono),
			monospace;
		letter-spacing: -0.06em;
	}
	.hero-metrics span {
		display: block;
		margin-top: 8px;
		color: var(--muted);
		font-size: 0.72rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.byline {
		margin: 22px 0 0;
		color: var(--muted);
		font:
			500 0.72rem/1.5 var(--font-mono),
			monospace;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
	.article-layout {
		display: grid;
		grid-template-columns: 180px minmax(0, 760px);
		gap: 80px;
		max-width: 1100px;
		margin: 0 auto;
		padding: 80px 30px 120px;
	}
	.rail {
		position: sticky;
		top: 30px;
		align-self: start;
		display: grid;
		gap: 12px;
	}
	.rail p {
		margin: 0 0 10px;
		color: var(--ink);
		font:
			650 0.7rem/1 var(--font-mono),
			monospace;
		letter-spacing: 0.09em;
		text-transform: uppercase;
	}
	.rail a {
		color: var(--muted);
		font:
			500 0.72rem/1.35 var(--font-mono),
			monospace;
		text-decoration: none;
	}
	.rail a:hover {
		color: var(--green);
	}
	article {
		min-width: 0;
	}
	article section {
		scroll-margin-top: 30px;
		padding: 72px 0;
		border-bottom: 1px solid var(--line);
	}
	article section:first-child {
		padding-top: 0;
	}
	article p,
	.value-list {
		color: var(--ink);
		font-size: 1.08rem;
		line-height: 1.78;
		letter-spacing: -0.01em;
	}
	article p + p {
		margin-top: 1.45rem;
	}
	.lead {
		font-size: clamp(1.3rem, 2.2vw, 1.6rem);
		line-height: 1.6;
		letter-spacing: -0.025em;
	}
	.section-label {
		display: flex;
		gap: 12px;
		margin-bottom: 18px;
		color: var(--green);
		font:
			650 0.7rem/1 var(--font-mono),
			monospace;
		letter-spacing: 0.11em;
		text-transform: uppercase;
	}
	.section-label span {
		color: var(--orange);
	}
	h2 {
		max-width: 700px;
		margin: 0 0 28px;
		font-size: clamp(2.2rem, 5vw, 4.2rem);
		font-weight: 650;
		line-height: 1;
		letter-spacing: -0.06em;
		text-wrap: balance;
	}
	.subhead {
		margin: 44px 0 18px;
		font-size: 1.35rem;
		letter-spacing: -0.03em;
	}
	mark {
		padding: 0.05em 0.22em;
		background: var(--yellow);
		color: var(--ink);
	}
	.stat-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin: 38px 0;
		border: 1px solid var(--line);
		background: var(--panel);
	}
	.stat-cell {
		min-height: 120px;
		padding: 22px;
		border-right: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
	}
	.stat-cell:nth-child(3n) {
		border-right: 0;
	}
	.stat-cell:nth-child(n + 4) {
		border-bottom: 0;
	}
	.stat-cell strong {
		display: block;
		color: var(--green);
		font:
			650 2rem/1 var(--font-mono),
			monospace;
	}
	.stat-cell span {
		display: block;
		margin-top: 12px;
		color: var(--muted);
		font-size: 0.82rem;
		line-height: 1.35;
	}
	.timeline {
		margin: 38px 0 10px;
		border-top: 1px solid var(--line);
	}
	.timeline-row {
		display: grid;
		grid-template-columns: 34px 105px 1fr;
		gap: 16px;
		padding: 20px 0;
		border-bottom: 1px solid var(--line);
	}
	.timeline-index,
	.timeline-date {
		color: var(--orange);
		font:
			650 0.7rem/1.5 var(--font-mono),
			monospace;
		text-transform: uppercase;
	}
	.timeline-date {
		color: var(--muted);
	}
	.timeline h3 {
		margin: 0;
		font-size: 1rem;
	}
	.timeline p {
		margin: 5px 0 0;
		color: var(--muted);
		font-size: 0.9rem;
		line-height: 1.55;
	}
	.pipeline {
		display: grid;
		grid-template-columns: repeat(11, auto);
		align-items: stretch;
		gap: 7px;
		margin: 22px calc((760px - min(94vw, 1040px)) / 2) 34px;
		min-width: min(94vw, 1040px);
	}
	.pipeline div {
		display: flex;
		flex: 1;
		min-width: 125px;
		padding: 15px 13px;
		flex-direction: column;
		border: 1px solid var(--line);
		background: var(--panel);
	}
	.pipeline div span {
		color: var(--orange);
		font:
			650 0.65rem/1 var(--font-mono),
			monospace;
	}
	.pipeline div strong {
		margin-top: 18px;
		font-size: 0.8rem;
		line-height: 1.25;
	}
	.pipeline div small {
		margin-top: 5px;
		color: var(--muted);
		font-size: 0.67rem;
		line-height: 1.3;
	}
	.pipeline i {
		align-self: center;
		color: var(--green);
		font-style: normal;
	}
	.set-cards {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 10px;
		margin: 30px 0;
	}
	.set-cards > div {
		display: grid;
		min-height: 160px;
		padding: 18px;
		align-content: space-between;
		border: 1px solid var(--line);
		background: var(--panel);
	}
	.set-cards code {
		color: var(--orange);
		font:
			650 2.5rem/1 var(--font-mono),
			monospace;
	}
	.set-cards strong {
		align-self: end;
		font-size: 1rem;
	}
	.set-cards span {
		color: var(--muted);
		font:
			500 0.7rem/1.3 var(--font-mono),
			monospace;
	}
	.formula-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		margin: 28px 0;
	}
	.formula-card {
		margin: 28px 0;
		padding: 22px;
		border-left: 3px solid var(--green);
		background: var(--panel);
		box-shadow: inset 0 0 0 1px var(--line);
	}
	.formula-grid .formula-card {
		margin: 0;
	}
	.formula-name {
		color: var(--muted);
		font:
			650 0.66rem/1 var(--font-mono),
			monospace;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.formula {
		margin-top: 24px;
		overflow-x: auto;
		color: var(--green);
		font:
			530 clamp(1.25rem, 2.5vw, 1.75rem)/1.3 var(--font-mono),
			monospace;
		white-space: nowrap;
	}
	.formula-card p {
		margin: 18px 0 0;
		color: var(--muted);
		font-size: 0.86rem;
		line-height: 1.5;
	}
	.formula-pair {
		display: flex;
		gap: 30px;
		flex-wrap: wrap;
	}
	.table-wrap {
		margin: 38px 0;
		overflow-x: auto;
		border: 1px solid var(--line);
	}
	table {
		width: 100%;
		border-collapse: collapse;
		background: var(--panel);
		font-size: 0.84rem;
		line-height: 1.4;
	}
	th,
	td {
		padding: 15px 16px;
		border-bottom: 1px solid var(--line);
		text-align: left;
		vertical-align: top;
	}
	th {
		color: var(--muted);
		font:
			650 0.66rem/1.2 var(--font-mono),
			monospace;
		letter-spacing: 0.07em;
		text-transform: uppercase;
	}
	tbody tr:last-child td {
		border-bottom: 0;
	}
	.rule-pill {
		display: inline-block;
		min-width: 48px;
		padding: 4px 7px;
		background: var(--green);
		color: var(--paper);
		font:
			650 0.64rem/1 var(--font-mono),
			monospace;
		text-align: center;
		text-transform: uppercase;
	}
	.rule-pill.soft {
		background: var(--orange);
	}
	.objective-stack {
		display: grid;
		gap: 7px;
		margin: 34px 0;
	}
	.objective-stack div {
		width: var(--w);
		padding: 13px 16px;
		border-left: 3px solid var(--green);
		background: color-mix(in srgb, var(--green-soft) 64%, transparent);
		font:
			600 0.8rem/1.3 var(--font-mono),
			monospace;
	}
	.objective-stack span {
		display: inline-block;
		width: 60px;
		color: var(--orange);
	}
	.run-card {
		margin: 34px 0;
		border: 1px solid var(--line);
		background: #101815;
		color: #e8f1ed;
		font-family: var(--font-mono), monospace;
	}
	.run-head {
		display: flex;
		padding: 14px 16px;
		justify-content: space-between;
		border-bottom: 1px solid #34463e;
		color: #91a49c;
		font-size: 0.67rem;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}
	.run-head strong {
		color: #76d8b9;
	}
	.run-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
	}
	.run-grid div {
		padding: 20px 16px;
		border-right: 1px solid #34463e;
		border-bottom: 1px solid #34463e;
	}
	.run-grid div:nth-child(3n) {
		border-right: 0;
	}
	.run-grid div:nth-child(n + 4) {
		border-bottom: 0;
	}
	.run-grid span {
		display: block;
		color: #91a49c;
		font-size: 0.65rem;
		text-transform: uppercase;
	}
	.run-grid strong {
		display: block;
		margin-top: 8px;
		color: #eef6f2;
		font-size: 1.15rem;
	}
	.incident-note {
		margin-top: 42px;
		padding: 28px;
		border: 1px solid var(--orange);
		background: color-mix(in srgb, var(--orange) 8%, var(--panel));
	}
	.incident-note > span {
		color: var(--orange);
		font:
			650 0.68rem/1 var(--font-mono),
			monospace;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.incident-note h3 {
		margin: 15px 0 12px;
		font-size: 1.5rem;
		line-height: 1.2;
		letter-spacing: -0.035em;
	}
	.incident-note p {
		font-size: 0.96rem;
	}
	.match-figure {
		margin: 38px 0;
		padding: 24px;
		border: 1px solid var(--line);
		background: var(--panel);
	}
	.match-labels,
	.match-axis {
		display: flex;
		align-items: center;
		justify-content: space-between;
		font:
			600 0.72rem/1 var(--font-mono),
			monospace;
	}
	.match-labels strong {
		color: var(--green);
	}
	.match-labels span {
		color: var(--orange);
	}
	.match-bar {
		display: flex;
		height: 28px;
		margin: 16px 0 14px;
		overflow: hidden;
		background: var(--line);
	}
	.match-bar span {
		width: 99.34%;
		background: var(--green);
	}
	.match-bar i {
		min-width: 6px;
		flex: 1;
		background: var(--orange);
	}
	.match-axis {
		color: var(--muted);
		font-size: 0.63rem;
		text-transform: uppercase;
	}
	.match-axis b {
		color: var(--ink);
		font-weight: 650;
	}
	.compact-table {
		max-width: 510px;
	}
	.compact-table td:last-child {
		color: var(--orange);
		font-family: var(--font-mono), monospace;
	}
	.compact-table td.positive {
		color: var(--green);
	}
	.delivery-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		margin: 36px 0;
		border: 1px solid var(--line);
		background: var(--panel);
	}
	.delivery-grid > div {
		padding: 22px;
		border-right: 1px solid var(--line);
	}
	.delivery-grid > div:last-child {
		border-right: 0;
	}
	.delivery-grid span {
		color: var(--orange);
		font:
			650 0.65rem/1 var(--font-mono),
			monospace;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
	.delivery-grid strong {
		display: block;
		margin-top: 22px;
		font-size: 1rem;
	}
	.delivery-grid p {
		margin: 8px 0 0;
		color: var(--muted);
		font-size: 0.82rem;
		line-height: 1.5;
	}
	.value-list {
		margin: 0;
		padding: 0;
		list-style: none;
	}
	.value-list li {
		position: relative;
		padding: 18px 0 18px 30px;
		border-bottom: 1px solid var(--line);
	}
	.value-list li::before {
		content: '↳';
		position: absolute;
		left: 0;
		color: var(--green);
		font-family: var(--font-mono), monospace;
	}
	.value-list strong {
		color: var(--green);
	}
	.closing {
		margin-top: 40px;
		padding: 34px;
		background: var(--green);
		color: var(--paper);
	}
	.closing p {
		margin: 0;
		color: inherit;
		font-size: 1.2rem;
		line-height: 1.65;
	}
	.article-footer {
		padding-top: 32px;
	}
	.article-footer p {
		color: var(--muted);
		font-size: 0.78rem;
		line-height: 1.6;
	}
	.article-footer a {
		display: inline-block;
		margin-top: 22px;
		color: var(--green);
		font:
			650 0.72rem/1 var(--font-mono),
			monospace;
		text-transform: uppercase;
	}

	@media (max-width: 900px) {
		.article-layout {
			grid-template-columns: 1fr;
			gap: 0;
		}
		.rail {
			display: none;
		}
		.pipeline {
			grid-template-columns: 1fr;
			margin-inline: 0;
			min-width: 0;
		}
		.pipeline i {
			transform: rotate(90deg);
		}
		.pipeline div {
			min-width: 0;
		}
	}
	@media (max-width: 650px) {
		.site-bar {
			padding: 20px;
		}
		.hero {
			margin-top: 24px;
			padding: 0 20px 50px;
		}
		h1 {
			margin-top: 22px;
			font-size: clamp(3rem, 15vw, 5rem);
		}
		.hero-metrics {
			grid-template-columns: 1fr 1fr;
		}
		.hero-metrics > div:nth-child(2) {
			border-right: 0;
		}
		.hero-metrics > div:nth-child(n + 3) {
			border-top: 1px solid var(--line);
		}
		.hero-metrics > div:nth-child(3) {
			padding-left: 0;
		}
		.article-layout {
			padding: 55px 20px 90px;
		}
		article section {
			padding: 55px 0;
		}
		.stat-grid,
		.set-cards,
		.formula-grid,
		.delivery-grid {
			grid-template-columns: 1fr;
		}
		.stat-cell,
		.stat-cell:nth-child(3n),
		.stat-cell:nth-child(n + 4),
		.delivery-grid > div {
			border-right: 0;
			border-bottom: 1px solid var(--line);
		}
		.stat-cell:last-child,
		.delivery-grid > div:last-child {
			border-bottom: 0;
		}
		.timeline-row {
			grid-template-columns: 28px 82px 1fr;
			gap: 10px;
		}
		.formula-pair {
			gap: 18px;
		}
		.run-grid {
			grid-template-columns: 1fr 1fr;
		}
		.run-grid div:nth-child(3n) {
			border-right: 1px solid #34463e;
		}
		.run-grid div:nth-child(2n) {
			border-right: 0;
		}
		.run-grid div:nth-child(n + 5) {
			border-bottom: 0;
		}
		.objective-stack div {
			width: 100%;
		}
		.match-axis b {
			display: none;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		:global(html) {
			scroll-behavior: auto;
		}
	}
</style>
