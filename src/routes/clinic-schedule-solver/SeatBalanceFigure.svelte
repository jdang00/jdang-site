<script lang="ts">
	type Clinic = { code: string; name: string; needs: number; tone: string };

	const clinics: Clinic[] = [
		{ code: '1G', name: 'Adult Primary Care', needs: 2, tone: 'care' },
		{ code: '2G', name: 'Pediatrics', needs: 2, tone: 'peds' },
		{ code: 'GLA', name: 'Glaucoma', needs: 1, tone: 'disease' },
		{ code: 'OD', name: 'Duty Doctor', needs: 1, tone: 'duty' }
	];

	const students = ['Student 1', 'Student 2', 'Student 3', 'Student 4', 'Student 5', 'Student 6'];

	// Index of the clinic each student is currently assigned to. Starts unbalanced.
	const start = [0, 0, 0, 1, 2, 3];
	let picks = $state([...start]);

	const counts = $derived(clinics.map((_, c) => picks.filter((p) => p === c).length));
	const gap = $derived(counts.reduce((sum, n, c) => sum + Math.abs(n - clinics[c].needs), 0));
	const solved = $derived(gap === 0);
</script>

<figure class="seat-figure">
	<div class="frame">
		<div class="grid" style="--cols: {clinics.length}">
			<span class="corner"></span>
			{#each clinics as clinic (clinic.code)}
				<span class="head {clinic.tone}">
					<span class="long">{clinic.name}</span><span class="short">{clinic.code}</span>
					<small>{clinic.needs} seats</small>
				</span>
			{/each}

			{#each students as student, s (student)}
				<span class="who"
					><span class="long">{student}</span><span class="short">{s + 1}</span></span
				>
				{#each clinics as clinic, c (clinic.code)}
					<button
						type="button"
						class="cell {clinic.tone}"
						class:on={picks[s] === c}
						aria-pressed={picks[s] === c}
						aria-label="{student} to {clinic.name}"
						onclick={() => (picks[s] = c)}
					></button>
				{/each}
			{/each}

			<span class="total-label">filled</span>
			{#each clinics as clinic, c (clinic.code)}
				<span class="total" class:met={counts[c] === clinic.needs}>
					{counts[c]} / {clinic.needs}
				</span>
			{/each}
		</div>

		<div class="bar">
			<p class:solved>
				{#if solved}
					Every clinic is full.
				{:else}
					{gap} seat{gap === 1 ? '' : 's'} off.
				{/if}
			</p>
			<button type="button" class="reset" onclick={() => (picks = [...start])}>Reset</button>
		</div>
	</div>

	<figcaption>
		A scaled-down afternoon: six students, four real clinic codes. Each student takes exactly one
		code, and each clinic needs an exact number of students. Click a cell to move someone — filling
		one clinic always empties another.
	</figcaption>
</figure>

<style>
	.seat-figure {
		margin: 2rem 0 0.5rem;
	}

	.frame {
		padding: 1.75rem 1.75rem 0;
		border: 1px solid var(--border);
		border-radius: 0.9rem;
		background: var(--card);
	}

	.grid {
		display: grid;
		grid-template-columns: minmax(4.5rem, auto) repeat(var(--cols), 1fr);
		gap: 0.4rem;
		align-items: center;
	}

	.head {
		padding-bottom: 0.35rem;
		font-size: 0.82rem;
		font-weight: 600;
		line-height: 1.25;
		text-align: center;
	}

	.head small {
		display: block;
		margin-top: 0.15rem;
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.66rem;
		font-weight: 500;
	}

	.who {
		color: var(--muted-foreground);
		font-family: 'Geist Mono', monospace;
		font-size: 0.72rem;
		letter-spacing: 0.02em;
	}

	.cell {
		height: 2.1rem;
		padding: 0;
		border: 1px solid var(--border);
		border-radius: 0.4rem;
		background: transparent;
		cursor: pointer;
		transition:
			background-color 140ms ease,
			border-color 140ms ease;
	}

	.cell:hover {
		border-color: color-mix(in oklab, var(--foreground) 35%, var(--border));
	}

	.cell:focus-visible {
		outline: 2px solid var(--ring);
		outline-offset: 2px;
	}

	.cell.on {
		border-color: transparent;
	}

	.head.care {
		color: color-mix(in oklab, #2d7458 45%, var(--foreground));
	}
	.head.peds {
		color: color-mix(in oklab, #a65a20 45%, var(--foreground));
	}
	.head.disease {
		color: color-mix(in oklab, #365e9d 45%, var(--foreground));
	}
	.head.duty {
		color: color-mix(in oklab, #6d4594 45%, var(--foreground));
	}

	.cell.care.on {
		background: color-mix(in oklab, #4f8f73 55%, var(--card));
	}
	.cell.peds.on {
		background: color-mix(in oklab, #c98440 55%, var(--card));
	}
	.cell.disease.on {
		background: color-mix(in oklab, #5d78a9 55%, var(--card));
	}
	.cell.duty.on {
		background: color-mix(in oklab, #8b6da8 55%, var(--card));
	}

	.total-label,
	.total {
		padding-top: 0.55rem;
		border-top: 1px solid var(--border);
		font-family: 'Geist Mono', monospace;
		font-size: 0.72rem;
	}

	.total-label {
		color: var(--muted-foreground);
	}

	.total {
		color: #c05a4b;
		font-weight: 600;
		text-align: center;
	}

	.total.met {
		color: var(--muted-foreground);
		font-weight: 500;
	}

	.bar {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: space-between;
		margin-top: 1.5rem;
		padding: 1rem 0 1.25rem;
		border-top: 1px solid var(--border);
	}

	.bar p {
		margin: 0;
		color: #c05a4b;
		font-size: 0.82rem;
		font-weight: 550;
	}

	.bar p.solved {
		color: #3f8a68;
	}

	.reset {
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

	.short {
		display: none;
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

		.grid {
			grid-template-columns: 1.6rem repeat(var(--cols), 1fr);
			gap: 0.3rem;
		}

		.long {
			display: none;
		}

		.short {
			display: inline;
		}

		.head {
			font-size: 0.78rem;
		}

		.cell {
			height: 1.9rem;
		}

		.bar {
			margin-top: 1.1rem;
		}
	}
</style>
