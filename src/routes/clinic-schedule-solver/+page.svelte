<svelte:head>
	<title>Building Our Clinic Schedule — Justin Dang</title>
	<meta
		name="description"
		content="How I translated an optometry clinic semester into explicit rules, a constraint model, a faculty-reviewed schedule, and usable data in ClinicHub."
	/>
	<link rel="canonical" href="https://justindang.dev/clinic-schedule-solver" />
	<meta property="og:title" content="Building Our Clinic Schedule" />
	<meta
		property="og:description"
		content="A first-person account of the clinical knowledge, mathematics, code, validation, and faculty review behind an optometry clinic schedule."
	/>
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://justindang.dev/clinic-schedule-solver" />
</svelte:head>

<div class="min-h-screen bg-white text-zinc-900">
	<article class="mx-auto flex max-w-[720px] flex-col px-5 py-12 sm:py-16">
		<div class="mb-12">
			<a href="/" class="text-sm text-zinc-500 transition-colors hover:text-zinc-900">
				← Justin Dang
			</a>
		</div>

		<header class="mb-12">
			<h1 class="text-4xl leading-tight font-bold tracking-tight text-balance sm:text-[2.9rem]">
				Building Our Clinic Schedule
			</h1>
			<p class="mt-5 text-xl leading-relaxed text-zinc-600">
				How I turned a semester of clinical requirements into a schedule that faculty could review,
				publish, and deliver to students.
			</p>
			<p class="mt-5 text-sm text-zinc-500">August 17, 2026</p>
		</header>

		<div class="flex flex-col gap-7 text-lg leading-relaxed">
			<p>
				When an optometry student opens a clinic schedule, the first question is usually very
				simple: where am I supposed to be? The answer might be a primary care clinic, a specialty
				service, a hospital rotation, a duty assignment, or a block of time outside clinic. Students
				experience the schedule one half-day at a time.
			</p>

			<p>
				The person building that schedule has to see the whole semester at once. Every student needs
				an assignment for every open morning and afternoon. Each clinic can accept only a certain
				number of students. Some experiences must occur in a continuous block. Some rotations use a
				full day. Holidays and special events close all or part of the system. Faculty coverage
				changes by date. The remaining duties still have to be shared fairly.
			</p>

			<p>
				A change in one place can travel through the rest of the schedule. Moving one student out of
				a Tuesday clinic creates an empty seat there, fills a seat somewhere else, may break a
				continuity block, and changes that student’s totals. Repairing the first cell can require
				several more changes. That connectedness is what makes clinic scheduling a real
				computational problem.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">Why this problem needs a solver</h2>

			<p>
				This kind of scheduling belongs to a family of combinatorial optimization problems.
				“Combinatorial” means the program is choosing a combination of many small decisions. Each
				individual choice looks easy. The difficulty comes from making all of the choices together
				while respecting the relationships among them.
			</p>

			<p>
				The general version of timetabling is NP-hard. In practical terms, no algorithm is known
				that can solve every possible version efficiently as the input grows. Adding students,
				dates, clinic types, and rules can make the number of possible schedules grow exponentially.
				A method that tries every complete schedule will become unusable long before it reaches the
				size of our semester.
			</p>

			<p>
				Our published schedule has 2,133 student-period cells and 19 assignment codes. If every code
				were available in every cell, a deliberately loose upper bound would be 19<sup>2,133</sup>,
				which is greater than 10<sup>2,700</sup> possible complete schedules. Real eligibility rules remove
				most of those choices, so that number is not a claim about the solver’s actual search tree. It
				shows why brute force is the wrong mental model.
			</p>

			<p>
				A CP-SAT solver uses the structure of the rules to avoid exploring most combinations.
				Constraint propagation removes choices that can no longer work. SAT reasoning learns from
				conflicts so the search does not repeat the same mistake in another form. Bounds show when a
				branch cannot beat the best schedule already found. Multiple workers can explore useful
				parts of the search in parallel. These techniques turn a huge theoretical space into a much
				smaller practical search for a structured instance like ours.
			</p>

			<p>
				That is why runtime and proof status both matter. Finding one legal schedule quickly is
				useful. Proving that no schedule can improve the current objective is stronger. The retained
				Fall 2026 run reached a proven optimum for its encoded objective sequence in 119.12 seconds.
				The solver did not make the underlying NP-hard family easy in general; it used the specific
				structure of this semester to solve this instance in acceptable time.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">What we had to schedule</h2>

			<p>
				I worked on the Fall 2026 third-year schedule for 27 students. The semester covered 85
				weekdays, with a morning and afternoon period on each day. That produced 170 calendar
				periods. Classes, closures, and other events meant that each student ultimately had 79
				periods that needed an explicit clinic or duty assignment.
			</p>

			<p>
				The published schedule therefore contains 27 × 79, or 2,133 individual assignments. Those
				assignments use 19 codes. Some codes represent ordinary clinics, some represent specialty
				experiences, and others represent duties or fixed responsibilities. The program also had to
				place 1,599 protected clinic seats: dated positions that needed to be filled because the
				clinic and faculty coverage were available.
			</p>

			<div class="overflow-x-auto rounded-lg border border-zinc-200">
				<table class="w-full min-w-[560px] border-collapse text-left text-base">
					<thead class="bg-zinc-50 text-sm text-zinc-600">
						<tr>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">A student sees</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium"
								>The scheduler must manage</th
							>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3">“I have VT Tuesday morning.”</td>
							<td class="border-b border-zinc-200 px-4 py-3"
								>The whole VT block, its capacity, dates, and every student competing for those
								seats.</td
							>
						</tr>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3">“I am in REP on Friday.”</td>
							<td class="border-b border-zinc-200 px-4 py-3"
								>The correct cohort, the linked morning and afternoon, and the repeating Friday
								rotation.</td
							>
						</tr>
						<tr>
							<td class="px-4 py-3">“My schedule looks balanced.”</td>
							<td class="px-4 py-3"
								>Several separate definitions of fairness across clinics, duties, and residual time.</td
							>
						</tr>
					</tbody>
				</table>
			</div>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">Why schedules could arrive late</h2>

			<p>
				Before I worked on the fall schedule, I had already seen what a long manual process felt
				like from the student side. On May 12, Dr. Fenska sent our class only the first two weeks of
				the summer clinic schedule and said the rest would be finalized as soon as possible. On May
				18, the day before clinic orientation, he wrote again that the full third-year schedule was
				still delayed. The finalized PDF arrived on May 25, and the spreadsheet version followed on
				May 26.
			</p>

			<p>
				Those emails identify the delay but do not name one specific cause. They document the
				practical result of a workflow that takes time to assemble and review: students can begin a
				term with only a partial view, and the machine-readable workbook can lag behind the document
				they are expected to read. That makes it harder to plan appointments, travel, studying, and
				the rest of life outside clinic.
			</p>

			<p>
				This became part of the motivation for the fall project. Faculty availability and clinical
				policy remain upstream decisions. Once those inputs are stable, software can shorten the
				work of assembling thousands of assignments, checking them, revising a candidate, and
				producing consistent files. In this article, “faster” means compressing that assembly and
				review stage while keeping faculty judgment in the release process.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">
				The first job was learning how the schedule is built
			</h2>

			<p>
				On July 21, I received the starting materials: current clinic allocations, a rough calendar
				document, a blank Fall 2026 workbook, and the prior-year workbook. That was enough to begin
				asking questions, but it was not a complete specification. The files mixed current
				instructions, historical examples, blank cells, old special-event tabs, and a few broken
				spreadsheet formulas.
			</p>

			<p>
				Much of the important knowledge lived with the people who had built these schedules before.
				They knew which clinics should be protected first, which experiences needed continuity, how
				REP groups should rotate, how Grand Rounds fit into Wednesday clinic, and which duties could
				absorb the remaining openings. Those rules made sense in practice, even when they had never
				been written as a formal algorithm.
			</p>

			<p>
				Written clarification on July 23 and a requirements conversation on July 24 helped me turn
				that experience into explicit statements. For example, CL should stay in a seven-week
				same-day block. VT should stay in a four-week block. REP should use groups of nine, return
				every third Friday, and keep each scheduled student in the same location for the full day.
				Wednesday WIS and DD students attend Grand Rounds and then continue to clinic.
			</p>

			<p>
				I stored each current rule in a typed, versioned configuration rather than leaving it only
				in a conversation or spreadsheet. Dates became machine-readable dates. Clinic capacities
				became dated numbers. Closures became explicit calendar entries. Each run carried a
				configuration identity so I could tell which set of assumptions had produced which schedule.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">A gentle introduction to the model</h2>

			<p>
				The mathematical model begins with sets. A set is simply a collection of things. I had a set
				of students, a set of open periods, and a set of assignment codes. I called them
				<em>S</em>, <em>T</em>, and <em>C</em>:
			</p>

			<div
				class="rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-4 font-mono text-base leading-loose text-zinc-800"
			>
				<div><span class="font-semibold">S</span> = the 27 students</div>
				<div><span class="font-semibold">T</span> = the 79 open half-day periods</div>
				<div><span class="font-semibold">C</span> = the 19 assignment codes</div>
			</div>

			<p>
				The program then asks the same yes-or-no question for each legal combination: should student <em
					>s</em
				>
				receive assignment <em>c</em> during period <em>t</em>? I represented that answer with a
				binary variable called x<sub>s,t,c</sub>. Binary means it can have only two values.
			</p>

			<div
				class="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-5 text-center font-mono text-xl text-zinc-900"
			>
				x<sub>s,t,c</sub> ∈ &#123;0, 1&#125;
			</div>

			<p>
				A value of 1 means “yes, make this assignment.” A value of 0 means “do not make this
				assignment.” If student 12 is assigned VT on Tuesday morning, the variable for that exact
				student-period-code combination is 1. The other assignment choices for that same student and
				period must be 0.
			</p>

			<p>
				Before removing impossible choices, the model could contain as many as 27 × 79 × 19, or
				40,527 binary variables. The real program creates only variables that are legal for a
				particular student and period. That pruning gives the solver less meaningless work to
				consider.
			</p>

			<h3 class="mt-3 text-xl font-bold tracking-tight">Giving every student one assignment</h3>

			<p>
				For any student and open period, I add together all of that student’s possible assignment
				variables. The sum must equal one:
			</p>

			<div
				class="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-5 text-center font-mono text-xl text-zinc-900"
			>
				∑<sub>c∈C</sub> x<sub>s,t,c</sub> = 1
			</div>

			<p>
				In plain language, the program must choose exactly one code from the available set. A sum of
				zero would leave the student unassigned. A sum greater than one would double-book the
				student.
			</p>

			<h3 class="mt-3 text-xl font-bold tracking-tight">Filling the clinic</h3>

			<p>
				The schedule also has to work from the clinic’s point of view. If a clinic has four approved
				student seats on a particular morning, exactly four students must receive that assignment. I
				called the required number r<sub>t,c</sub>:
			</p>

			<div
				class="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-5 text-center font-mono text-xl text-zinc-900"
			>
				∑<sub>s∈S</sub> x<sub>s,t,c</sub> = r<sub>t,c</sub>
			</div>

			<p>
				The first formula looks across assignment codes for one student. This formula looks across
				students for one clinic. Together, they connect the student schedule to the clinic’s dated
				capacity.
			</p>

			<h3 class="mt-3 text-xl font-bold tracking-tight">Keeping multi-week experiences together</h3>

			<p>
				Some assignments are valuable because they repeat. A CL or VT block allows a student to
				return on the same weekday, learn the service’s workflow, and build continuity over time.
				The code creates candidate blocks, then links the dates inside a chosen block. A student
				cannot receive only the convenient pieces of a four-week VT block.
			</p>

			<p>
				The semester’s arithmetic also determines the fairest possible totals. CL had 175 available
				student seats. Dividing 175 evenly among 27 people does not produce a whole number, so 13
				students receive seven CL assignments and 14 receive six:
			</p>

			<div
				class="rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-5 text-center font-mono text-lg text-zinc-900"
			>
				13(7) + 14(6) = 175
			</div>

			<p>
				VT works the same way. There were 116 seats, so eight students receive five and 19 receive
				four. A one-assignment difference is the closest possible integer balance.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">How the code is organized</h2>

			<p>
				I separated the program into stages because each stage answers a different question. The
				configuration says what the semester requires. A preflight step checks the arithmetic before
				the solver starts. The solver builds a candidate. A separate validator checks the candidate
				from its output rows. Finally, the export code places a validated result into the familiar
				Excel workbook used for faculty review.
			</p>

			<pre
				class="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 p-5 text-sm leading-relaxed text-zinc-800"><code
					>source documents and faculty guidance
    ↓
versioned calendar, capacity, and rule configuration
    ↓
preflight checks → CP-SAT solver → independent validator
    ↓
Excel review → faculty publication → ClinicHub</code
				></pre>

			<p>
				Language models helped me inspect source material, organize questions, and compare
				documents. The assignments came from CP-SAT. Its decisions were checked again by
				deterministic validation code. This separation kept interpretation, mathematical search,
				validation, and approval in their proper roles.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">
				The schedule needed its own file format
			</h2>

			<p>
				A spreadsheet is useful for review and a PDF is useful for publication, but neither one
				naturally carries the complete story of a solver run. I wanted one portable artifact that
				could preserve the schedule, the rules that produced it, the validation report, and the
				numbers needed for later comparison. I created the
				<code class="rounded bg-zinc-100 px-1.5 py-0.5 text-base">.nsuococlinic</code>
				format for that purpose.
			</p>

			<p>
				The file is versioned JSON with a custom extension. It contains the semester calendar,
				anonymous student identifiers, every assignment, the configuration ID and hash, solver
				status, random seed, worker count, runtime, software versions, active rules, assumptions,
				warnings, and the complete independent validation result. It also stores the display state
				for each period, so a future reader does not need the current application to know which
				dates were closed or special.
			</p>

			<p>
				A SHA-256 integrity value covers the semester, aggregates, and solver result. A reader
				recomputes that value before displaying the file. If the payload has changed, the integrity
				check fails. This gives the schedule the same kind of basic tamper evidence I would expect
				from any other important data artifact.
			</p>

			<p>
				The format also carries precomputed aggregates and their definitions: totals by clinic,
				weekday, session, week, role, and location; student distributions; coverage status;
				continuity metrics; and assignment-load statistics. Zero-count students stay in those
				distributions, which matters when two semesters are compared. Otherwise a clinic that missed
				several students could look artificially balanced because the zeroes disappeared.
			</p>

			<p>
				A file can be internally valid while it is still a candidate. The artifact records its
				technical state; faculty publication records institutional approval. The current final
				ClinicHub import still begins with the approved PDF. A direct, signed handoff from a
				published <code class="rounded bg-zinc-100 px-1.5 py-0.5 text-base">.nsuococlinic</code>
				artifact is one of the next workflow improvements.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">Rules the solver must obey</h2>

			<p>
				I divided requirements into hard constraints and softer objectives. A hard constraint
				defines a valid schedule. The program cannot break it to improve something else. A soft
				objective describes which valid schedule I would prefer.
			</p>

			<div class="overflow-x-auto rounded-lg border border-zinc-200">
				<table class="w-full min-w-[600px] border-collapse text-left text-base">
					<thead class="bg-zinc-50 text-sm text-zinc-600">
						<tr>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Type</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Example</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Why it matters</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3 font-medium">Hard</td>
							<td class="border-b border-zinc-200 px-4 py-3"
								>Exactly one assignment in every open period</td
							>
							<td class="border-b border-zinc-200 px-4 py-3">Prevents blanks and double-booking</td>
						</tr>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3 font-medium">Hard</td>
							<td class="border-b border-zinc-200 px-4 py-3"
								>Meet protected clinic capacity by date</td
							>
							<td class="border-b border-zinc-200 px-4 py-3"
								>Uses the available faculty and clinic seats</td
							>
						</tr>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3 font-medium">Hard</td>
							<td class="border-b border-zinc-200 px-4 py-3">Link REP morning and afternoon</td>
							<td class="border-b border-zinc-200 px-4 py-3">Preserves a full-day rotation</td>
						</tr>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3 font-medium">Soft</td>
							<td class="border-b border-zinc-200 px-4 py-3">Reduce the widest exposure gap</td>
							<td class="border-b border-zinc-200 px-4 py-3">Distributes experience more evenly</td>
						</tr>
						<tr>
							<td class="px-4 py-3 font-medium">Soft</td>
							<td class="px-4 py-3">Avoid awkward recurrence patterns</td>
							<td class="px-4 py-3">Makes the schedule easier to follow</td>
						</tr>
					</tbody>
				</table>
			</div>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">How the solver ranks valid schedules</h2>

			<p>
				I gave the solver 15 objectives in a strict order. It first established feasibility and
				protected clinic coverage. It then improved protected-clinic fairness and continuity, placed
				REP, filled the residual schedule, balanced duties and BP, and finally cleaned up recurrence
				patterns. After each stage, the program fixed that achieved result before moving to the next
				stage. A later cosmetic improvement could not worsen a more important clinical result.
			</p>

			<p>
				The retained run used eight workers, a 180-second time budget, and a recorded random seed.
				Other corrected seeds finished in roughly 71 to 76 seconds. The random seed matters because
				students can be interchangeable for some equally good slots; changing the seed can change
				individual placements without changing validity or aggregate quality.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">What fairness means here</h2>

			<p>
				Fairness has to be measured one experience at a time. I first count how many times each
				student receives a code. For code <em>c</em>, I call student <em>s</em>’s count n<sub
					>s,c</sub
				>. I then compare the largest count with the smallest:
			</p>

			<div
				class="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 px-5 py-5 text-center font-mono text-lg text-zinc-900"
			>
				R<sub>c</sub> = max<sub>s</sub> n<sub>s,c</sub> − min<sub>s</sub> n<sub>s,c</sub>
			</div>

			<p>
				If everyone receives six or seven CL assignments, the CL range is one. The same calculation
				can be made for VT, REP, duties, and other experiences. I kept those measurements separate
				because an overall score could hide a large gap in one clinically important category.
			</p>

			<p>
				BP required one extra piece of context. Two students held fixed TA responsibilities, so
				their raw BP counts were lower. Raw BP ranged from 5 to 11. When the fixed TA work was
				counted with BP as the intended residual workload, every student had 10 or 11. The combined
				measure described the actual division of that responsibility more accurately.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">
				How the previous year helped us check the answer
			</h2>

			<p>
				The Fall 2025 schedule was valuable because it showed what a real semester had looked like.
				I used it as a benchmark for plausibility and code meaning. Current Fall 2026 faculty rules
				controlled capacity and requirements. This distinction kept an old pattern from silently
				becoming a new rule.
			</p>

			<p>
				For each comparable code, I added the historical assignments and divided by 27 students. I
				then compared that average with the published Fall 2026 average. The direction of a change
				often pointed to a useful question: did the clinic allocation change, did the calendar lose
				dates, did a new rule replace an old practice, or did the solver fail to use available
				capacity?
			</p>

			<div class="overflow-x-auto rounded-lg border border-zinc-200">
				<table class="w-full min-w-[620px] border-collapse text-left text-base">
					<thead class="bg-zinc-50 text-sm text-zinc-600">
						<tr>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Experience</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">2025 average</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">2026 published average</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium"
								>What the comparison showed</th
							>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3 font-medium">CL</td>
							<td class="border-b border-zinc-200 px-4 py-3">8.70</td>
							<td class="border-b border-zinc-200 px-4 py-3">6.48</td>
							<td class="border-b border-zinc-200 px-4 py-3"
								>A deliberate decrease from the new block rule and current 175-seat calendar.</td
							>
						</tr>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3 font-medium">VT</td>
							<td class="border-b border-zinc-200 px-4 py-3">4.00</td>
							<td class="border-b border-zinc-200 px-4 py-3">4.30</td>
							<td class="border-b border-zinc-200 px-4 py-3"
								>An increase caused by 116 approved current seats, all filled.</td
							>
						</tr>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3 font-medium">WI + WIS</td>
							<td class="border-b border-zinc-200 px-4 py-3">5.96</td>
							<td class="border-b border-zinc-200 px-4 py-3">5.89</td>
							<td class="border-b border-zinc-200 px-4 py-3"
								>Nearly the same mean, with a tighter student distribution.</td
							>
						</tr>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3 font-medium">DS + DSN + SF + OC</td>
							<td class="border-b border-zinc-200 px-4 py-3">8.52</td>
							<td class="border-b border-zinc-200 px-4 py-3">8.48</td>
							<td class="border-b border-zinc-200 px-4 py-3"
								>The combined duty load stayed almost identical while its mix changed.</td
							>
						</tr>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3 font-medium">RPA</td>
							<td class="border-b border-zinc-200 px-4 py-3">0.63</td>
							<td class="border-b border-zinc-200 px-4 py-3">0.78</td>
							<td class="border-b border-zinc-200 px-4 py-3"
								>More current RPA opportunities were used.</td
							>
						</tr>
						<tr>
							<td class="border-b border-zinc-200 px-4 py-3 font-medium">BP</td>
							<td class="border-b border-zinc-200 px-4 py-3">8.22</td>
							<td class="border-b border-zinc-200 px-4 py-3">10.00</td>
							<td class="border-b border-zinc-200 px-4 py-3"
								>More residual periods remained after the current clinical schedule and duties.</td
							>
						</tr>
						<tr>
							<td class="px-4 py-3 font-medium">TA</td>
							<td class="px-4 py-3">0.74</td>
							<td class="px-4 py-3">0.30</td>
							<td class="px-4 py-3"
								>The current policy used eight fixed TA assignments instead of the historical 20.</td
							>
						</tr>
					</tbody>
				</table>
			</div>

			<p>
				The codes that decreased did not all signal a loss. CL fell because the approved model
				changed. DSN, SF, OC, 1G, 2G, DD, and OD each moved down modestly with the current calendar
				and mix. DRY and PC matched their historical totals exactly, while GLA, DS, VT, REP, and RPA
				increased. The pattern looked like a changed semester rather than a randomly distorted one.
			</p>

			<p>
				Averages alone can also conceal an uneven distribution. Historical WI + WIS ranged from four
				to seven assignments per student. The published 2026 schedule ranged from five to six, even
				though its cohort-wide total was two assignments lower. That is a good example of aggregate
				comparison doing two jobs: the mean checks overall scale, and the range checks how the total
				is shared.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">Checking the solver’s work</h2>

			<p>
				A solver can report that it succeeded, but I did not want the solver to grade its own paper.
				I built an independent validator that reads the finished assignment rows and recomputes the
				important claims. It checks for duplicate or missing assignments, clinic coverage by date,
				closures, continuity, REP linkage, TA placement, duty capacity, and per-student totals.
			</p>

			<p>
				The retained candidate passed with zero validation errors and seven warnings. The warnings
				identified visible exceptions rather than hiding them: one OC soft-target warning, four CL
				bridge assignments on October 13, and eight VT supplements across five dates. A warning gave
				reviewers a specific fact to inspect.
			</p>

			<h3 class="mt-3 text-xl font-bold tracking-tight">Checking whether the totals make sense</h3>

			<p>
				Before reviewing individual names and dates, I check the arithmetic of the whole schedule.
				Aggregate checks are fast, understandable, and very good at exposing a misconfigured
				calendar or an unfilled clinic. They also give faculty a familiar summary at the bottom of
				the Excel workbook.
			</p>

			<div class="overflow-x-auto rounded-lg border border-zinc-200">
				<table class="w-full min-w-[600px] border-collapse text-left text-base">
					<thead class="bg-zinc-50 text-sm text-zinc-600">
						<tr>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Question</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Arithmetic check</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Result</th>
						</tr>
					</thead>
					<tbody>
						<tr
							><td class="border-b border-zinc-200 px-4 py-3"
								>Is every open student-period filled?</td
							><td class="border-b border-zinc-200 px-4 py-3">27 students × 79 periods</td><td
								class="border-b border-zinc-200 px-4 py-3">2,133 assignments</td
							></tr
						>
						<tr
							><td class="border-b border-zinc-200 px-4 py-3">Do all code totals reconcile?</td><td
								class="border-b border-zinc-200 px-4 py-3">Sum the 19 published code totals</td
							><td class="border-b border-zinc-200 px-4 py-3">2,133</td></tr
						>
						<tr
							><td class="border-b border-zinc-200 px-4 py-3">Was protected capacity used?</td><td
								class="border-b border-zinc-200 px-4 py-3">Assigned seats ÷ required seats</td
							><td class="border-b border-zinc-200 px-4 py-3">1,599 ÷ 1,599</td></tr
						>
						<tr
							><td class="border-b border-zinc-200 px-4 py-3">Does CL divide correctly?</td><td
								class="border-b border-zinc-200 px-4 py-3">13(7) + 14(6)</td
							><td class="border-b border-zinc-200 px-4 py-3">175</td></tr
						>
						<tr
							><td class="border-b border-zinc-200 px-4 py-3">Does VT divide correctly?</td><td
								class="border-b border-zinc-200 px-4 py-3">8(5) + 19(4)</td
							><td class="border-b border-zinc-200 px-4 py-3">116</td></tr
						>
						<tr
							><td class="px-4 py-3">Does REP match the calendar?</td><td class="px-4 py-3"
								>12 Fridays × 6 students × 2 sessions</td
							><td class="px-4 py-3">144 half-days</td></tr
						>
					</tbody>
				</table>
			</div>

			<p>
				These equalities do not prove that every student is in the right place. They establish that
				the large pieces reconcile. The cell-level validator then checks who received each
				assignment, whether the date was legal, and whether linked and continuous experiences were
				preserved. The historical comparison adds a third view by asking whether the finished shape
				is plausible.
			</p>

			<blockquote
				class="my-2 border-l-4 border-zinc-300 pl-5 text-xl leading-relaxed text-zinc-700"
			>
				The solver can be perfectly consistent with its inputs while the inputs still need a human
				correction.
			</blockquote>

			<p>
				That happened during this project. An early candidate treated the afternoon of August 17 as
				open clinic time. Its arithmetic looked correct and it assigned all 27 students. On August
				4, faculty caught that the period was Orientation and clinic was closed. I corrected the
				calendar, reran the model, and revalidated the export. The total changed from 2,160
				assignments to the correct 2,133.
			</p>

			<p>
				That correction reinforced the need for several layers of control: original-source review,
				preflight arithmetic, explicit closures, independent validation, a familiar Excel review,
				and faculty approval. An
				<code class="rounded bg-zinc-100 px-1.5 py-0.5 text-base">OPTIMAL</code> status describes the
				mathematical model that was actually encoded. Faculty review and publication establish the official
				institutional schedule.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">From candidate to published schedule</h2>

			<p>
				I sent a first serious candidate for review on August 1. Faculty described it as very close
				on August 2, and we continued revising it through the Orientation correction. The final
				schedules were published together on August 6, eleven days before clinic began on August 17.
			</p>

			<p>
				I compared the corrected candidate with the final PDF and ClinicHub’s normalized copy using
				one key for each student, date, and morning or afternoon session. Faculty retained 2,119 of
				the candidate’s 2,133 assignments, an exact cell match of 99.34%. Fourteen afternoon
				assignments changed. Every morning cell and every Friday cell matched.
			</p>

			<div class="overflow-x-auto rounded-lg border border-zinc-200">
				<table class="w-full min-w-[480px] border-collapse text-left text-base">
					<thead class="bg-zinc-50 text-sm text-zinc-600">
						<tr>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Code</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Candidate</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Published</th>
							<th class="border-b border-zinc-200 px-4 py-3 font-medium">Change</th>
						</tr>
					</thead>
					<tbody>
						<tr
							><td class="border-b border-zinc-200 px-4 py-3">WI</td><td
								class="border-b border-zinc-200 px-4 py-3">100</td
							><td class="border-b border-zinc-200 px-4 py-3">106</td><td
								class="border-b border-zinc-200 px-4 py-3">+6</td
							></tr
						>
						<tr
							><td class="border-b border-zinc-200 px-4 py-3">DSN</td><td
								class="border-b border-zinc-200 px-4 py-3">55</td
							><td class="border-b border-zinc-200 px-4 py-3">53</td><td
								class="border-b border-zinc-200 px-4 py-3">−2</td
							></tr
						>
						<tr
							><td class="border-b border-zinc-200 px-4 py-3">SF</td><td
								class="border-b border-zinc-200 px-4 py-3">55</td
							><td class="border-b border-zinc-200 px-4 py-3">53</td><td
								class="border-b border-zinc-200 px-4 py-3">−2</td
							></tr
						>
						<tr
							><td class="px-4 py-3">OC</td><td class="px-4 py-3">48</td><td class="px-4 py-3"
								>46</td
							><td class="px-4 py-3">−2</td></tr
						>
					</tbody>
				</table>
			</div>

			<p>
				All other aggregate totals matched, including CL at 175, VT at 116, BP at 270, and REP at
				144 half-days, which represents 72 linked full-day turns. The published changes increased WI
				exposure and made the combined WI and WIS distribution tighter. That small and interpretable
				difference shows how the mathematical candidate supported faculty judgment without trying to
				replace it.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">How the schedule reaches students</h2>

			<p>
				The Excel workbook remained the best review surface because faculty already knew how to read
				it and could inspect the totals at the bottom. The faculty-approved PDF became the
				publication record. I then imported that final PDF into ClinicHub with a pinned source hash,
				page-level provenance, and checks for 27 students, 19 assignment codes, 2,133 unique rows,
				and exactly 79 assignments per student.
			</p>

			<p>
				For students, ClinicHub turns the wide institutional schedule into a personal view that can
				be searched and used for coordination. The same normalized data can support safer swap
				planning because the application can reason about an exact date, session, student, and
				clinic rather than asking students to interpret a large PDF manually.
			</p>

			<p>
				In the one comparable historical cycle I found, the Fall 2024 third-year schedule was
				released seven days before clinic began, after the other schedules had already been
				finalized. In 2026, all four schedules were released together eleven days before the start.
				One comparison cannot establish a long-term trend, but it represents four more days of lead
				time for students and a more coordinated publication.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">Where the time savings come from</h2>

			<p>
				The two-minute solve is only one part of the process. The larger time savings come from
				making the workflow repeatable. Once a rule has been confirmed and encoded, the next
				candidate can reuse it. A changed closure or clinic capacity becomes a configuration change
				followed by preflight, solve, validation, and comparison. The scheduler can spend more time
				reviewing clinical judgment and less time repairing chains of cells.
			</p>

			<p>
				This first Fall 2026 cycle ran from the July 21 source handoff to the August 6 publication
				and included building much of the system itself. I therefore treat the 119-second runtime as
				a measured machine result and the end-to-end labor savings as something the next cycles
				should measure. Useful measures will include elapsed days, active scheduling hours,
				correction count, rerun time, warning count, and faculty review time.
			</p>

			<h2 class="mt-5 text-2xl font-bold tracking-tight">What I would build next</h2>

			<p>
				The next version should let faculty lock an assignment, make a change, and re-optimize only
				the affected part of the semester. It should also use one authoritative calendar source and
				record a formal lifecycle for each artifact: candidate, reviewed, approved, published,
				amended, or superseded.
			</p>

			<p>
				A larger model could eventually coordinate third-year students, fourth-year students,
				faculty, rooms, and rotation sites together. That would create more variables and more
				constraints, but the same design principles would apply: write down the clinical rules,
				separate hard requirements from preferences, validate independently, preserve provenance,
				and keep approval with the people responsible for the program.
			</p>

			<p>
				The schedule students receive is a short list of places and times. Building it requires
				clinical knowledge, calendar work, requirements engineering, discrete mathematics, software,
				validation, and careful review. Making those parts explicit is what allows the process to
				move faster while remaining understandable.
			</p>

			<footer class="mt-8 border-t border-zinc-200 pt-6 text-sm leading-relaxed text-zinc-500">
				<p>
					This article reports aggregate Fall 2026 third-year scheduling data. Student identities
					and private correspondence are omitted.
				</p>
			</footer>
		</div>
	</article>
</div>
