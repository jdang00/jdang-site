<script lang="ts">
	import { Transition } from '@animotion/core';

	import Notes from '$lib/deck/Notes.svelte';
	import Slide from '$lib/deck/Slide.svelte';

	const riskFactors = [
		'Birth before 30 weeks gestation',
		'Birth weight below 1500 to 2000 grams',
		'Oxygen treatment or ventilator support after delivery'
	];

	const phaseOne = [
		'Premature birth interrupts delivery of IGF-1 and omega-3 PUFAs',
		'Supplemental oxygen suppresses VEGF and EPO',
		'ROS damage immature retinal vessels, halting normal growth'
	];

	const phaseTwo = [
		'Incompletely vascularized retina becomes hypoxic',
		'VEGF rises without IGF-1 guidance — disorganized growth',
		'Fragile neovascular tissue leaks and forms adhesions'
	];

	const stages = [
		{ stage: '1', label: 'Line', desc: 'Demarcation line separates vascularized from avascular retina' },
		{ stage: '2', label: 'Ridge', desc: 'Line elevates into a thickened ridge' },
		{ stage: '3', label: 'Intravitreal Neo', desc: 'Abnormal vessels extend into the vitreous' },
		{ stage: '4', label: 'Partial RD', desc: 'Traction pulls retina from RPE' },
		{ stage: '5', label: 'Total RD', desc: 'Circumferential retinal detachment' }
	];

	const screeningSteps = [
		'Serial dilated retinal exams with weekly follow-up',
		'Maximal dilation with cyclopentolate, phenylephrine, or Cyclomydril',
		'Lid speculum, scleral depression, and fundus photography'
	];

	const treatmentTriggers = [
		'Any stage in Zone I with plus disease',
		'Stage 3 in Zone I without plus disease',
		'Stage 2 or 3 in Zone II with plus disease'
	];

	const treatments = [
		{ window: 'Early', name: 'Intravitreal bevacizumab', detail: 'Anti-VEGF to slow neovascularization' },
		{ window: 'Middle', name: 'Pan-retinal photocoagulation', detail: 'Reduces peripheral O₂ demand' },
		{ window: 'Late', name: 'Vitrectomy', detail: 'For significant traction and detachment risk' }
	];
</script>

<style>
	:global(.rop-surface) {
		position: relative;
	}
	:global(.rop-surface::before) {
		content: '';
		position: absolute;
		inset: 0;
		opacity: 0.025;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-size: 200px 200px;
		pointer-events: none;
	}
	:global(.rop-rule) {
		width: 3rem;
		height: 3px;
		background: linear-gradient(90deg, #dc2626, #ea580c, #d97706);
		border: none;
		border-radius: 2px;
	}
</style>

<!-- 1 · Title -->
<Slide class="rop-surface grid grid-rows-[auto_1fr_auto]">
	<Transition visible>
		<p class="relative z-10 text-[1.5rem] text-red-400">
			OPT 5233 &ndash; Pediatrics
			<span class="ml-8">NSU Oklahoma College of Optometry</span>
		</p>
	</Transition>
	<Transition class="self-end relative z-10">
		<h1 class="text-[4.5rem] leading-[1.05] tracking-tight text-slate-900">Retinopathy of Prematurity</h1>
		<p class="mt-4 text-[2.2rem] text-red-600/70">An Overview</p>
	</Transition>
	<Transition>
		<p class="relative z-10 mt-10 text-[1.5rem] text-slate-400">
			Brayden S. Dyer
			<span class="mx-3">&bull;</span>
			Justin A. Dang
			<span class="mx-3">&bull;</span>
			James C. McClure
		</p>
	</Transition>
	<Notes>Brayden opener: define retinopathy broadly, then narrow to premature-birth-related disease.</Notes>
</Slide>

<!-- 2 · What is ROP -->
<Slide class="rop-surface">
	<div class="relative z-10">
		<Transition visible>
			<p class="text-[1.1rem] uppercase tracking-[0.25em] text-red-600">Definition</p>
			<hr class="rop-rule mt-4" />
			<h2 class="mt-6 text-[3.2rem] leading-[1.1] tracking-tight text-slate-900">
				An abnormal retinal vascular response to premature birth
			</h2>
		</Transition>
		<Transition>
			<p class="mt-6 text-[1.8rem] leading-relaxed text-slate-500">
				Incomplete vascular coverage leaves the retina vulnerable to hypoxia,
				neovascularization, hemorrhage, and retinal detachment.
			</p>
		</Transition>
		<Transition>
			<div class="mt-10">
				<p class="text-[1.1rem] uppercase tracking-[0.25em] text-orange-600">Highest-risk cohorts</p>
				<ul class="mt-5 list-disc pl-[1.2em] space-y-[0.7em] text-[1.8rem] leading-relaxed text-slate-600">
					{#each riskFactors as factor}
						<li>{factor}</li>
					{/each}
				</ul>
			</div>
		</Transition>
	</div>
	<Notes>Brayden: emphasize low birth weight, low gestational age, and incomplete vascularization.</Notes>
</Slide>

<!-- 3 · Pathophysiology intro -->
<Slide class="rop-surface grid content-center">
	<div class="relative z-10">
		<Transition visible>
			<p class="text-[1.1rem] uppercase tracking-[0.25em] text-red-600">Pathophysiology</p>
			<hr class="rop-rule mt-4" />
		</Transition>
		<Transition>
			<h2 class="mt-6 text-[3.2rem] leading-[1.1] tracking-tight text-slate-900">
				Why premature birth disrupts normal retinal development
			</h2>
		</Transition>
		<Transition>
			<p class="mt-6 text-[1.8rem] leading-relaxed text-slate-500">
				Retinal vascularization depends on third-trimester growth support — especially
				IGF-1 and placental mediators. Premature delivery interrupts that environment.
			</p>
		</Transition>
	</div>
	<Notes>Brayden: retinal vascularization is normally complete around 32 weeks.</Notes>
</Slide>

<!-- 4 · Two-phase pathophysiology -->
<Slide class="rop-surface">
	<div class="relative z-10 grid h-full grid-cols-2 gap-14">
		<Transition visible>
			<div>
				<p class="text-[1.1rem] uppercase tracking-[0.25em] text-red-600">Phase I</p>
				<hr class="rop-rule mt-4" />
				<h3 class="mt-5 text-[2.6rem] leading-tight tracking-tight text-slate-900">
					Cessation of normal vascularization
				</h3>
				<ul class="mt-8 list-disc pl-[1.2em] space-y-[0.7em] text-[1.6rem] leading-relaxed text-slate-600">
					{#each phaseOne as item}
						<li>{item}</li>
					{/each}
				</ul>
				<p class="mt-8 rounded-lg bg-red-50 px-5 py-4 text-[1.4rem] text-red-800">
					In utero O&#8322; ~50 mmHg &rarr; postnatal can reach ~160 mmHg
				</p>
			</div>
		</Transition>
		<Transition>
			<div>
				<p class="text-[1.1rem] uppercase tracking-[0.25em] text-orange-600">Phase II</p>
				<hr class="rop-rule mt-4" />
				<h3 class="mt-5 text-[2.6rem] leading-tight tracking-tight text-slate-900">
					Hypoxia-induced neovascularization
				</h3>
				<ul class="mt-8 list-disc pl-[1.2em] space-y-[0.7em] text-[1.6rem] leading-relaxed text-slate-600">
					{#each phaseTwo as item}
						<li>{item}</li>
					{/each}
				</ul>
			</div>
		</Transition>
	</div>
	<Notes>Brayden: hyperoxia first, then maladaptive VEGF-driven recovery once oxygen is reduced.</Notes>
</Slide>

<!-- 5 · Staging -->
<Slide class="rop-surface">
	<div class="relative z-10">
		<Transition visible>
			<p class="text-[1.1rem] uppercase tracking-[0.25em] text-red-600">Diagnostic criteria</p>
			<hr class="rop-rule mt-4" />
			<h2 class="mt-6 text-[3rem] leading-tight tracking-tight text-slate-900">
				Stage the disease by what the retina is doing
			</h2>
		</Transition>
		<div class="mt-10 grid grid-cols-5 gap-6">
			{#each stages as item, i}
				<Transition order={i + 1}>
					<div class="border-t-[3px] pt-5" style="border-color: {
						item.stage === '1' ? '#fbbf24' :
						item.stage === '2' ? '#f59e0b' :
						item.stage === '3' ? '#ea580c' :
						item.stage === '4' ? '#dc2626' :
						'#991b1b'
					}">
						<p class="text-[1rem] uppercase tracking-[0.2em] text-slate-400">Stage {item.stage}</p>
						<p class="mt-2 text-[1.8rem] tracking-tight text-slate-900">{item.label}</p>
						<p class="mt-2 text-[1.2rem] leading-snug text-slate-500">{item.desc}</p>
					</div>
				</Transition>
			{/each}
		</div>
	</div>
	<Notes>Cam: stage 3 is where vitreous extension and traction risk become clinically important.</Notes>
</Slide>

<!-- 6 · Plus disease and zones -->
<Slide class="rop-surface">
	<div class="relative z-10 grid h-full grid-cols-2 gap-14">
		<div>
			<Transition visible>
				<p class="text-[1.1rem] uppercase tracking-[0.25em] text-red-600">Plus disease</p>
				<hr class="rop-rule mt-4" />
				<h2 class="mt-6 text-[3rem] leading-tight tracking-tight text-slate-900">
					Vessel dilation and tortuosity signal severity
				</h2>
			</Transition>
			<Transition>
				<p class="mt-6 text-[1.7rem] leading-relaxed text-slate-500">
					Plus disease can occur at any stage and usually means the disease is more aggressive.
				</p>
			</Transition>
			<Transition>
				<div class="mt-10">
					<p class="text-[1.1rem] uppercase tracking-[0.25em] text-orange-600">Zones</p>
					<p class="mt-4 text-[1.7rem] leading-relaxed text-slate-500">
						Pathology closer to the posterior pole carries worse prognosis.
					</p>
				</div>
			</Transition>
		</div>
		<Transition>
			<div class="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-[1.2rem] text-slate-300">
				figure placeholder
			</div>
		</Transition>
	</div>
	<Notes>Cam: pair with cited zone and plus-disease figures.</Notes>
</Slide>

<!-- 7 · Screening -->
<Slide class="rop-surface">
	<div class="relative z-10">
		<Transition visible>
			<p class="text-[1.1rem] uppercase tracking-[0.25em] text-red-600">Screening &amp; exam</p>
			<hr class="rop-rule mt-4" />
			<h2 class="mt-6 text-[3.2rem] leading-[1.1] tracking-tight text-slate-900">
				Screen early, then follow serially
			</h2>
		</Transition>
		<div class="mt-10 grid grid-cols-2 gap-14">
			<Transition>
				<ul class="list-disc pl-[1.2em] space-y-[0.7em] text-[1.7rem] leading-relaxed text-slate-600">
					{#each screeningSteps as step}
						<li>{step}</li>
					{/each}
				</ul>
			</Transition>
			<Transition>
				<div class="rounded-lg bg-amber-50 px-6 py-5 text-[1.7rem] leading-relaxed text-amber-900">
					First eye exam around <strong>31 weeks PMA</strong> &mdash; ROP signs
					commonly appear at 30&ndash;32 weeks postmenstrual age.
				</div>
			</Transition>
		</div>
	</div>
	<Notes>Justin: emphasize the 31-week PMA exam timing.</Notes>
</Slide>

<!-- 8 · Prevention -->
<Slide class="rop-surface">
	<div class="relative z-10">
		<Transition visible>
			<p class="text-[1.1rem] uppercase tracking-[0.25em] text-orange-600">Prevention</p>
			<hr class="rop-rule mt-4" />
			<h2 class="mt-6 text-[3.2rem] leading-[1.1] tracking-tight text-slate-900">
				Support physiologic growth and avoid oxygen extremes
			</h2>
		</Transition>
		<div class="mt-10 grid grid-cols-3 gap-10">
			<Transition>
				<div class="border-t-[3px] border-amber-400 pt-5">
					<p class="text-[1.1rem] uppercase tracking-[0.2em] text-orange-600">IGF-1</p>
					<p class="mt-4 text-[1.6rem] leading-relaxed text-slate-600">
						Helps microvascular development. Without it, nutrition alone worsens hyperglycemia and endothelial stress.
					</p>
				</div>
			</Transition>
			<Transition>
				<div class="border-t-[3px] border-orange-400 pt-5">
					<p class="text-[1.1rem] uppercase tracking-[0.2em] text-orange-600">PUFAs</p>
					<p class="mt-4 text-[1.6rem] leading-relaxed text-slate-600">
						Omega-3 supplementation supports healthier, less inflammatory vessel development.
					</p>
				</div>
			</Transition>
			<Transition>
				<div class="border-t-[3px] border-red-500 pt-5">
					<p class="text-[1.1rem] uppercase tracking-[0.2em] text-orange-600">Oxygen</p>
					<p class="mt-4 text-[1.6rem] leading-relaxed text-slate-600">
						Careful control of oxygen tension during therapy reduces hyperoxic vascular damage.
					</p>
				</div>
			</Transition>
		</div>
	</div>
	<Notes>Justin: without IGF-1, nutritional support alone may push toward hyperglycemia.</Notes>
</Slide>

<!-- 9 · Treatment -->
<Slide class="rop-surface">
	<div class="relative z-10">
		<Transition visible>
			<p class="text-[1.1rem] uppercase tracking-[0.25em] text-red-600">Treatment</p>
			<hr class="rop-rule mt-4" />
			<h2 class="mt-6 text-[3rem] leading-tight tracking-tight text-slate-900">
				Treat when severity, zone, and plus disease cross the threshold
			</h2>
		</Transition>
		<div class="mt-10 grid grid-cols-2 gap-14">
			<Transition>
				<div>
					<p class="text-[1.1rem] uppercase tracking-[0.2em] text-orange-600">Treatment triggers</p>
					<ul class="mt-5 list-disc pl-[1.2em] space-y-[0.7em] text-[1.7rem] leading-relaxed text-slate-600">
						{#each treatmentTriggers as trigger}
							<li>{trigger}</li>
						{/each}
					</ul>
				</div>
			</Transition>
			<div class="space-y-6">
				{#each treatments as tx, i}
					<Transition order={i + 1}>
						<div class="border-l-[3px] border-orange-400 pl-6">
							<p class="text-[1rem] uppercase tracking-[0.2em] text-slate-400">{tx.window}</p>
							<p class="mt-1 text-[1.8rem] tracking-tight text-slate-900">{tx.name}</p>
							<p class="mt-1 text-[1.3rem] text-slate-500">{tx.detail}</p>
						</div>
					</Transition>
				{/each}
			</div>
		</div>
	</div>
	<Notes>Justin: bevacizumab, PRP, and vitrectomy as stage-appropriate responses.</Notes>
</Slide>

<!-- 10 · Takeaway -->
<Slide class="rop-surface grid content-center">
	<div class="relative z-10">
		<Transition visible>
			<hr class="rop-rule" />
			<h2 class="mt-8 text-[3.5rem] leading-[1.1] tracking-tight text-slate-900">
				ROP is a disease of interrupted development and maladaptive recovery
			</h2>
		</Transition>
		<Transition>
			<p class="mt-8 text-[1.8rem] leading-relaxed text-slate-500">
				Understand the oxygen shift, stage the retina precisely, screen at the right time,
				and treat early high-risk disease before traction wins.
			</p>
		</Transition>
		<Transition>
			<p class="mt-12 text-[1.3rem] text-slate-400">
				Hellström 2013 &middot; Hartnett &amp; Penn 2012 &middot; Fierson 2013
			</p>
		</Transition>
	</div>
	<Notes>Close: interrupted vascularization first, maladaptive neovascularization second.</Notes>
</Slide>
