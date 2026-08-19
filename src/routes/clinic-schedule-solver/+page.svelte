<script lang="ts">
	import DarkModeToggle from '../../lib/components/DarkModeToggle.svelte';
	import Link from '../../lib/components/Link.svelte';
	import ArticleNav from './ArticleNav.svelte';

	const sections = [
		{ id: 'so-how-are-we-using-ai', label: 'So how are we using AI?' },
		{ id: 'defining-the-problem-space', label: 'The problem space' },
		{ id: 'setting-it-up-why-this-problem-needs-a-solver', label: 'Why this needs a solver' },
		{ id: 'what-we-had-to-schedule', label: 'What we had to schedule' },
		{ id: 'why-schedules-often-arrive-late', label: 'Why schedules arrive late' },
		{ id: 'the-first-job-was-learning-how-the-schedule-is-built', label: 'Learning the schedule' },
		{ id: 'a-gentle-introduction-to-the-model', label: 'A gentle intro to the model' },
		{ id: 'how-the-code-is-organized', label: 'How the code is organized' },
		{ id: 'the-schedule-needed-its-own-file-format', label: 'Its own file format' },
		{ id: 'rules-the-solver-must-obey', label: 'Rules the solver must obey' },
		{ id: 'how-the-solver-ranks-valid-schedules', label: 'Ranking valid schedules' },
		{ id: 'what-fairness-means-here', label: 'What fairness means' },
		{ id: 'how-the-previous-year-helped-us-check-the-answer', label: 'Checking against last year' },
		{ id: 'checking-the-solvers-work', label: 'Checking the solver’s work' },
		{ id: 'from-candidate-to-published-schedule', label: 'Candidate to published' },
		{ id: 'how-the-schedule-reaches-students', label: 'How it reaches students' },
		{ id: 'where-the-time-savings-come-from', label: 'Where the savings come from' },
		{ id: 'what-i-would-build-next', label: 'What I would build next' }
	];
	import ScheduleWeekFigure from './ScheduleWeekFigure.svelte';
	import SolverSearchTree from './SolverSearchTree.svelte';
	import SeatBalanceFigure from './SeatBalanceFigure.svelte';
	import FairnessSpreadFigure from './FairnessSpreadFigure.svelte';
	import ObjectiveLadder from './ObjectiveLadder.svelte';
	import SpreadPanelFigure from './SpreadPanelFigure.svelte';
	import Tex from './Tex.svelte';
	import 'katex/dist/katex.min.css';
</script>

<svelte:head>
	<title>Scheduling 2,133 clinic assignments in 119 seconds — Justin A. Dang</title>
	<meta
		name="description"
		content="How NSUOCO used constraint programming, mathematical optimization, and human review to build 2,133 clinic assignments in 119 seconds."
	/>
	<link rel="canonical" href="https://justindang.dev/clinic-schedule-solver" />
	<meta property="og:title" content="Scheduling 2,133 clinic assignments in 119 seconds" />
	<meta
		property="og:description"
		content="How math, constraint programming, and human judgment helped build NSUOCO's third-year clinic schedule."
	/>
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://justindang.dev/clinic-schedule-solver" />
	<meta property="og:image" content="https://justindang.dev/clinic-schedule-solver-og.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta
		property="og:image:alt"
		content="Scheduling 2,133 clinic assignments in 119 seconds by Justin A. Dang"
	/>
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content="Scheduling 2,133 clinic assignments in 119 seconds" />
	<meta
		name="twitter:description"
		content="How math, constraint programming, and human judgment helped build NSUOCO's third-year clinic schedule."
	/>
	<meta name="twitter:image" content="https://justindang.dev/clinic-schedule-solver-og.jpg" />
	<meta
		name="twitter:image:alt"
		content="Scheduling 2,133 clinic assignments in 119 seconds by Justin A. Dang"
	/>
</svelte:head>

<div class="article-page">
	<article>
		<nav aria-label="Article navigation">
			<a href="/">← Justin Dang</a>
			<DarkModeToggle />
		</nav>

		<div class="article-copy">
			<h1 id="scheduling-2133-clinic-assignments-in-119-seconds">
				Scheduling 2,133 clinic assignments in 119 seconds
			</h1>
			<p>
				Building clinic schedules is difficult. Very difficult. Here's how NSUOCO built its
				third-year schedule with the help of math, a computer, artificial intelligence, and some
				good old-fashioned human ingenuity. The final schedule optimization run took 119.12 seconds.
				Getting there required translating a semester of clinical knowledge into explicit rules,
				checking the result against history, and carrying a candidate through faculty review and
				publication.
			</p>
			<p>
				By <Link href="https://justindang.dev">Justin A. Dang</Link> · August 17, 2026
			</p>
			<p>
				<em
					>This article was written by me without the help of large language models for ideation,
					content writing, proofreading, or final editing. Diagrams were made with the assistance of
					Codex and Claude Code.</em
				>
			</p>
			<ArticleNav {sections} />
			<p>
				When I was in a primary care clinic rotation in summer 2026, I overheard some of my
				classmates make a bet on when the fall's clinic schedule would come out. One said a week
				before clinic started. Another said a few days before. Yet another said the <em>night</em>
				before. The group chuckled and moved on. If you're at my school, you'll understand. Sometimes
				clinic schedules can come out dangerously close to when they take effect, and some even come out
				late or incomplete. I get it—it's stressful if you're a clinician trying to plan an entire semester
				of rotations and balance them with your personal life. God forbid you forget your mother's mother-in-law's
				son's wife's son's
				<Link href="https://www.justinandanna.com/">wedding</Link> (my eternal gratitude to Dr. J. Ellen).
				The earlier you get the schedule, the sooner you can see whether certain plans will work out.
				For many of us, it's not so much that we want to know when we'll be able to ditch clinic; we just
				want to see what kind of time we're in for as we continue our clinical education. As my friend
				Emma would say, we should "embrace the suck."
			</p>
			<p>
				One aspect that most students simply don't understand about clinic scheduling is that it is
				difficult. Very difficult. It is a complex puzzle that takes even faculty veterans many
				hours to solve. At NSUOCO, it's done with a spreadsheet. Rows represent clinicians and
				columns represent types of clinics. In each cell, a clinic is assigned to a clinician
				according to a complicated set of rules, exceptions, blocks, staffing capacity needs, and
				much more. Once a clinic is assigned to one student on one date, it needs to be verified to
				make sure that the assignment doesn't disrupt the delicate balance of clinic fairness (for
				example, everyone receiving the same number of each type of clinic). A few more passes are
				made to balance workload, assign TA dates, and double- or triple-check for errors. <strong
					>All in all, the average student grossly underestimates the amount of work it takes to
					build a clinic schedule</strong
				>. This doesn't even take into account the fun schedulers have wrangling faculty
				availability, changing off requests, special holidays, and more.
			</p>
			<p>
				One of the primary faculty responsible for the schedule reached out to me after seeing the <Link
					href="https://clinic.learnterms.com/">clinic website</Link
				>
				I built for my class. He asked if we might be able to use AI somehow to expedite parts of the
				assignment process. "Yes, theoretically," I replied. I was
				<Link href="https://optimization.cbe.cornell.edu/index.php?title=Job_shop_scheduling"
					>cautious</Link
				> but optimistic that we could do something about it. So we began defining the scope of the project
				shortly after the summer ended.
			</p>
			<h2 id="so-how-are-we-using-ai">So how are we using AI?</h2>
			<p>
				When folks refer to AI nowadays, they often think of a website powered by a large language
				model such as ChatGPT, Claude, Gemini, or DeepSeek. These models are a form of deep learning
				designed to generate responses from patterns learned during training. Their capabilities are
				astounding, but they're actually not the right tool for this project. You will no doubt have
				run into instances where chatbots hallucinate or are just flat-out wrong. This is partly due
				to how these models work. An LLM generates responses based on patterns it has learned. This
				makes it fairly flexible for a wide variety of tasks, but scheduling needs something
				different. Our problem is much narrower. Our goal isn't to create a plausible schedule. We
				want to build a schedule that satisfies a defined set of rules. So instead of asking an LLM
				to take its best guess at a schedule, we can encode the rules mathematically and have an
				algorithm search for a valid one. For example, a rule might say that a student cannot be
				assigned to two clinics at once. We could take our chances and let a chatbot LLM guess and
				memorize this rule. Even for a trivial schedule, our testing yielded mixed results. The
				right answer for our problem is a subset of artificial intelligence called constraint
				programming and combinatorial optimization.
			</p>
			<p>
				One of my goals for the project is not just to use technology, but the <em>right</em> technology.
				Following the hype (the aforementioned SlopGPT) or chasing whatever's new is kind of the worst
				way to approach this project. For something as mission-critical as having a hand in the fate of
				my class's clinical hours, I want to get this done right. We'll talk a bit later about the specific
				tool we need to build the schedule and why it's a good fit. But if you were worried that building
				the schedule would be as simple as typing in a prompt and having the result spit out, you'll be
				happy to hear that some real engineering went into this.
			</p>
			<h2 id="defining-the-problem-space">Defining the problem space</h2>
			<p>
				When an optometry student opens a clinic schedule, the first question is usually very
				simple: where am I supposed to be? The answer might be a primary care clinic, a specialty
				service, a VT rotation, a duty assignment, or a block of time outside clinic. Students
				experience the schedule one half-day at a time. In addition to checking your own schedule,
				you might want to see who's in the rotation with you or where some other classmate
				is—probably out of sheer curiosity. The person building that schedule has to see the whole
				semester at once. By far the most compact way to show it all at once is the spreadsheet
				schedule we've come to know and love.
			</p>
			<ScheduleWeekFigure />

			<p>
				Right off the bat, there are a variety of things we need to think about when we start
				choosing clinics for every student at every date.
			</p>
			<ul>
				<li>
					Every student needs an assignment for every open morning and afternoon. It can't conflict
					with class time (so they'd be off then) or with any special holidays.
				</li>
				<li>
					Each clinic can accept only a certain number of students. This is defined by the clinic
					schedule, which shows which clinics recur on any given day along with the faculty member
					assigned as attending. This schedule is made in a separate process, and distributing
					faculty assignments requires its own operation (for example, whether the professor has a
					class). Generally speaking, this faculty schedule takes much less time than the student
					schedule. It also defines clinic capacity (how many students are expected in that clinic),
					which forms the backbone of the student assignments themselves.
				</li>
				<li>
					Some clinical experiences must occur in a continuous block. Contact lens and vision
					therapy clinics are assigned in "mini-cohorts," meaning that students will be assigned on
					the same day for a stretch of four, five, or more weeks. This way, you'll be able to
					participate in continuity of care, see your follow-ups, and stay with the same core clinic
					group. This process ends up splitting the full cohort of 27 into front-half and back-half
					semester assignments.
				</li>
				<li>
					Some rotations use a full day. The one relevant to this semester is REP, or the rural eye
					program. This is a special consideration because of the travel distances to the clinics.
					For some REP clinics, it is not possible to make it back to or from Tahlequah by the
					assigned start of a shift, so the rotation must run all day.
				</li>
				<li>
					Holidays and special events close all or part of the system. Things like Academy or OAOP
					get their own special schedules, so you can't assign students or count clinics on those
					dates. Other holidays, such as Indigenous Peoples' Day, close Cherokee Nation clinics (REP
					and CNOHC) while NSU locations remain open. This is why our solution needs to be
					location-aware as well.
				</li>
				<li>
					Faculty coverage changes by date. Although this is less of a problem in the fall and
					spring, summer may change week in and week out.
				</li>
				<li>
					The remaining duties still have to be shared fairly. Certain students are very particular
					when it comes to clinic counts and distribution. Questions like "Why do I have four 1Gs in
					a row?" or "Why does another student have four more boards prep days than me?" arise as a
					consequence of rotation assignments. Our primary benchmark for "fairness" will be clinic
					counts, and we'll strive to make sure the allocations are as even as possible.
				</li>
			</ul>
			<p>
				All this to say that there is much to consider. A change in one place can travel through the
				rest of the schedule. Moving one student out of a Tuesday clinic creates an empty seat
				there, fills a seat somewhere else, may break a continuity block, and changes that student’s
				totals. Repairing the first cell can require several more changes. That connectedness is
				what makes clinic scheduling a real computational problem.
			</p>
			<p>
				For a human curator, scheduling is part numbers, part intuition. The numeric part is
				straightforward: each clinic has a daily capacity (Primary Care: 6, for example). The
				intuitive part kicks in once you start filling those slots—knowing, almost by feel, which
				exceptions apply ("this clinic's closed for the holiday; no one goes there"). But when you
				dig a bit deeper, you find that the problem is mathematical in nature. It just comes down to
				how you set it up.
			</p>
			<h2 id="setting-it-up-why-this-problem-needs-a-solver">
				Setting it up: Why this problem needs a solver
			</h2>
			<p>
				This kind of scheduling belongs to a family of combinatorial optimization problems.
				“Combinatorial” means the program is choosing a combination of many small decisions. Each
				individual choice looks easy. The difficulty comes from making all of the choices together
				while respecting the relationships among them.
			</p>
			<p>
				The general version of timetabling is NP-hard. In practical terms, no algorithm is known
				that can solve every possible version efficiently as the input grows. Our input of 27
				students across a semester of valid dates is actually fairly small in comparison to large
				optometry schools. But once you start adding clinic codes and exceptions, it can get out of
				hand. Adding students, dates, clinic types, and rules can make the number of possible
				schedules grow exponentially. A "brute force" method that tries every complete schedule will
				become unusable long before it reaches the size of our semester.
			</p>
			<p>
				So if we want to think about this in terms of pure possibilities, our published schedule has
				2,133 student-period cells and 19 assignment codes. If every code were available in every
				cell, a deliberately loose upper bound would be <Tex tex={String.raw`19^{2{,}133}`} />,
				which is greater than <Tex tex={String.raw`10^{2{,}700}`} /> possible complete schedules. For
				context, the number of atoms in the observable universe is <Tex
					tex={String.raw`10^{80}`}
				/>. Real eligibility rules remove most of those choices, so that number is not a claim about
				the solver’s actual search tree. It shows why brute force is the wrong mental model.
			</p>
			<p>
				What we need is a solver model that understands and uses the structure of the rules to avoid
				exploring most combinations. Google's OR-Tools CP-SAT is built for exactly this kind of
				problem. Instead of trying every possible schedule, we use what's called "constraint
				propagation" (CP). First, we convert our problem space into mathematical sets and
				representations. Second, we encode rules like "no more than six students in PC on a given
				day" or "make sure the TA has this block off." By doing this, we systematically narrow the
				space of valid schedules from the absurd upper bounds described earlier. Third, the model
				explores possibilities like branches in a tree within this reduced search space. The solver
				is smart enough to choose which options to try first and which branches to abandon because
				they violate a rule.
			</p>
			<SolverSearchTree />

			<p>
				Constraint propagation removes choices that can no longer work. Another useful technique
				here is SAT reasoning, which learns from conflicts so the search does not repeat the same
				mistake in another form. (SAT stands for satisfiability, which at its core asks: given a set
				of true/false variables and a set of logical constraints over them, does there exist an
				assignment that satisfies every constraint simultaneously? I spent the summer before
				optometry school building hypothetical Turing machines to show that this class of problem is
				NP-complete via the Cook-Levin theorem.
				<Link href="https://youtu.be/yOcpWjO0JP4?si=UkpMppjVHKqxaK_4&amp;t=3686"
					>And apparently I recorded myself doing it.</Link
				>
				Please let me nerd out on this.) On top of that, the solver uses bounds to recognize when a branch
				can't beat the best schedule already found, and multiple workers can explore useful parts of the
				search in parallel. Together, these techniques turn a huge theoretical space into a much smaller
				practical search for a structured instance like ours. In summary, CP-SAT is a constraint programming
				solver built on top of—and borrowing speed tricks from—modern SAT solvers, massively reducing
				the search space.
			</p>
			<p>
				That is why runtime and proof status both matter. Finding one legal schedule quickly is
				useful. Proving that no schedule can improve the current objective is stronger. The retained
				Fall 2026 run reached a proven optimum for its encoded objective sequence in 119.12 seconds.
				The solver did not make the underlying NP-hard family easy in general; it used the specific
				structure of this semester to solve this instance in acceptable time.
			</p>
			<h2 id="what-we-had-to-schedule">What we had to schedule</h2>
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
			<div class="table-wrap">
				<table aria-label="Student view and scheduler responsibilities">
					<thead>
						<tr>
							<th>A student sees</th>
							<th>The scheduler must manage</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>“I have VT Tuesday morning.”</td>
							<td
								>The whole VT block, its capacity, dates, and every student competing for those
								seats.</td
							>
						</tr>
						<tr>
							<td>“I am in REP on Friday.”</td>
							<td
								>The correct cohort, the linked morning and afternoon, and the repeating Friday
								rotation.</td
							>
						</tr>
						<tr>
							<td>“My schedule looks balanced.”</td>
							<td
								>Several separate definitions of fairness across clinics, duties, and residual time.</td
							>
						</tr>
					</tbody>
				</table>
			</div>
			<h2 id="why-schedules-often-arrive-late">Why schedules often arrive late</h2>
			<p>
				Before I worked on the fall schedule, I had already seen what a long manual process felt
				like from the student side. On May 12, our class received only the first two weeks of the
				summer clinic schedule, with the remainder still being finalized. A May 18 update, sent the
				day before clinic orientation, said the full third-year schedule was still delayed. The
				finalized PDF arrived on May 25, and the spreadsheet version followed on May 26.
			</p>
			<p>
				That kind of short runway is understandable in clinical scheduling. The messages did not
				assign the delay to one cause, but the broader process depends on class calendars, faculty
				coverage, clinic capacity, off-site rotations, closures, and special events becoming settled
				enough to use. The schedule still has to be assembled and reviewed after those inputs
				arrive. It is normal for the final release to come with little time to spare.
			</p>
			<p>
				The student-facing result is less abstract. Students may reach orientation with only a
				partial view, and the machine-readable workbook can lag behind the document they are
				expected to read. That makes it harder to plan appointments, travel, studying, and the rest
				of life outside clinic.
			</p>
			<p>
				This became part of the motivation for the fall project. Faculty availability and clinical
				policy remain upstream decisions. Once those inputs are stable, software can shorten the
				work of assembling thousands of assignments, checking them, revising a candidate, and
				producing consistent files. In this article, “faster” means compressing that assembly and
				review stage while keeping faculty judgment in the release process.
			</p>
			<h2 id="the-first-job-was-learning-how-the-schedule-is-built">
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
			<h2 id="a-gentle-introduction-to-the-model">A gentle introduction to the model</h2>
			<p>
				The mathematical model begins with sets. A set is simply a collection of things. I had a set
				of students, a set of open periods, and a set of assignment codes. I called them
				<Tex tex="S" />, <Tex tex="T" />, and <Tex tex="C" />:
			</p>
			<Tex
				display
				tex={String.raw`\begin{aligned}
					S &= \text{the 27 students} \\[2pt]
					T &= \text{the 79 open half-day periods} \\[2pt]
					C &= \text{the 19 assignment codes}
				\end{aligned}`}
			/>
			<p>
				The program then asks the same yes-or-no question for each legal combination: should student
				<Tex tex="s" /> receive assignment <Tex tex="c" /> during period <Tex tex="t" />? I
				represented that answer with a binary variable called <Tex tex={String.raw`x_{s,t,c}`} />.
				Binary means it can have only two values.
			</p>
			<Tex display tex={String.raw`x_{s,t,c} \in \{0,\,1\}`} />
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
			<h3 id="giving-every-student-one-assignment">Giving every student one assignment</h3>
			<p>
				For any student and open period, I add together all of that student’s possible assignment
				variables. The sum must equal one:
			</p>
			<Tex display tex={String.raw`\sum_{c \in C} x_{s,t,c} = 1`} />
			<p>
				In plain language, the program must choose exactly one code from the available set. A sum of
				zero would leave the student unassigned. A sum greater than one would double-book the
				student.
			</p>
			<h3 id="filling-the-clinic">Filling the clinic</h3>
			<p>
				The schedule also has to work from the clinic’s point of view. If a clinic has four approved
				student seats on a particular morning, exactly four students must receive that assignment. I
				called the required number <Tex tex={String.raw`r_{t,c}`} />:
			</p>
			<Tex display tex={String.raw`\sum_{s \in S} x_{s,t,c} = r_{t,c}`} />
			<p>
				The first formula looks across assignment codes for one student. This formula looks across
				students for one clinic. Together, they connect the student schedule to the clinic’s dated
				capacity.
			</p>
			<SeatBalanceFigure />

			<h3 id="keeping-multi-week-experiences-together">Keeping multi-week experiences together</h3>
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
			<Tex display tex={String.raw`13(7) + 14(6) = 175`} />
			<p>
				VT works the same way. There were 116 seats, so eight students receive five and 19 receive
				four. A one-assignment difference is the closest possible integer balance.
			</p>
			<h2 id="how-the-code-is-organized">How the code is organized</h2>
			<p>
				I separated the program into stages because each stage answers a different question. The
				configuration says what the semester requires. A preflight step checks the arithmetic before
				the solver starts. The solver builds a candidate. A separate validator checks the candidate
				from its output rows. Finally, the export code places a validated result into the familiar
				Excel workbook used for faculty review.
			</p>
			<pre><code
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
			<h2 id="the-schedule-needed-its-own-file-format">The schedule needed its own file format</h2>
			<p>
				A spreadsheet is useful for review and a PDF is useful for publication, but neither one
				naturally carries the complete story of a solver run. I wanted one portable artifact that
				could preserve the schedule, the rules that produced it, the validation report, and the
				numbers needed for later comparison. I created the <code>.nsuococlinic</code> format for that
				purpose.
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
				published <code>.nsuococlinic</code> artifact is one of the next workflow improvements.
			</p>
			<h2 id="rules-the-solver-must-obey">Rules the solver must obey</h2>
			<p>
				I divided requirements into hard constraints and softer objectives. A hard constraint
				defines a valid schedule. The program cannot break it to improve something else. A soft
				objective describes which valid schedule I would prefer.
			</p>
			<div class="table-wrap">
				<table aria-label="Hard constraints and soft solver objectives">
					<thead>
						<tr>
							<th>Type</th>
							<th>Example</th>
							<th>Why it matters</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Hard</td>
							<td>Exactly one assignment in every open period</td>
							<td>Prevents blanks and double-booking</td>
						</tr>
						<tr>
							<td>Hard</td>
							<td>Meet protected clinic capacity by date</td>
							<td>Uses the available faculty and clinic seats</td>
						</tr>
						<tr>
							<td>Hard</td>
							<td>Link REP morning and afternoon</td>
							<td>Preserves a full-day rotation</td>
						</tr>
						<tr>
							<td>Soft</td>
							<td>Reduce the widest exposure gap</td>
							<td>Distributes experience more evenly</td>
						</tr>
						<tr>
							<td>Soft</td>
							<td>Avoid awkward recurrence patterns</td>
							<td>Makes the schedule easier to follow</td>
						</tr>
					</tbody>
				</table>
			</div>
			<h2 id="how-the-solver-ranks-valid-schedules">How the solver ranks valid schedules</h2>
			<p>
				I gave the solver 15 objectives in a strict order. It first established feasibility and
				protected clinic coverage. It then improved protected-clinic fairness and continuity, placed
				REP, filled the residual schedule, balanced duties and BP, and finally cleaned up recurrence
				patterns. After each stage, the program fixed that achieved result before moving to the next
				stage. A later cosmetic improvement could not worsen a more important clinical result.
			</p>
			<ObjectiveLadder />
			<p>
				The retained run used eight workers, a 180-second time budget, and a recorded random seed.
				Other corrected seeds finished in roughly 71 to 76 seconds. The random seed matters because
				students can be interchangeable for some equally good slots; changing the seed can change
				individual placements without changing validity or aggregate quality.
			</p>
			<h2 id="what-fairness-means-here">What fairness means here</h2>
			<p>
				Fairness has to be measured one experience at a time. I first count how many times each
				student receives a code. For code <Tex tex="c" />, I call student <Tex tex="s" />’s count
				<Tex tex={String.raw`n_{s,c}`} />. I then compare the largest count with the smallest:
			</p>
			<Tex display tex={String.raw`R_c = \max_{s \in S} n_{s,c} \;-\; \min_{s \in S} n_{s,c}`} />
			<FairnessSpreadFigure />
			<p>
				If everyone receives six or seven CL assignments, the CL range is one. The same calculation
				can be made for VT, REP, duties, and other experiences. I kept those measurements separate
				because an overall score could hide a large gap in one clinically important category.
			</p>
			<SpreadPanelFigure />
			<p>
				BP required one extra piece of context. Two students held fixed TA responsibilities, so
				their raw BP counts were lower. Raw BP ranged from 5 to 11. When the fixed TA work was
				counted with BP as the intended residual workload, every student had 10 or 11. The combined
				measure described the actual division of that responsibility more accurately.
			</p>
			<h2 id="how-the-previous-year-helped-us-check-the-answer">
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
			<div class="table-wrap">
				<table aria-label="Fall 2025 and Fall 2026 assignment averages">
					<thead>
						<tr>
							<th>Experience</th>
							<th>2025 average</th>
							<th>2026 published average</th>
							<th>What the comparison showed</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>CL</td>
							<td>8.70</td>
							<td>6.48</td>
							<td>A deliberate decrease from the new block rule and current 175-seat calendar.</td>
						</tr>
						<tr>
							<td>VT</td>
							<td>4.00</td>
							<td>4.30</td>
							<td>An increase caused by 116 approved current seats, all filled.</td>
						</tr>
						<tr>
							<td>WI + WIS</td>
							<td>5.96</td>
							<td>5.89</td>
							<td>Nearly the same mean, with a tighter student distribution.</td>
						</tr>
						<tr>
							<td>DS + DSN + SF + OC</td>
							<td>8.52</td>
							<td>8.48</td>
							<td>The combined duty load stayed almost identical while its mix changed.</td>
						</tr>
						<tr>
							<td>RPA</td>
							<td>0.63</td>
							<td>0.78</td>
							<td>More current RPA opportunities were used.</td>
						</tr>
						<tr>
							<td>BP</td>
							<td>8.22</td>
							<td>10.00</td>
							<td>More residual periods remained after the current clinical schedule and duties.</td
							>
						</tr>
						<tr>
							<td>TA</td>
							<td>0.74</td>
							<td>0.30</td>
							<td
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
			<h2 id="checking-the-solvers-work">Checking the solver’s work</h2>
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
			<h3 id="checking-whether-the-totals-make-sense">Checking whether the totals make sense</h3>
			<p>
				Before reviewing individual names and dates, I check the arithmetic of the whole schedule.
				Aggregate checks are fast, understandable, and very good at exposing a misconfigured
				calendar or an unfilled clinic. They also give faculty a familiar summary at the bottom of
				the Excel workbook.
			</p>
			<div class="table-wrap">
				<table aria-label="Aggregate schedule arithmetic checks">
					<thead>
						<tr>
							<th>Question</th>
							<th>Arithmetic check</th>
							<th>Result</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>Is every open student-period filled?</td>
							<td>27 students × 79 periods</td>
							<td>2,133 assignments</td>
						</tr>
						<tr>
							<td>Do all code totals reconcile?</td>
							<td>Sum the 19 published code totals</td>
							<td>2,133</td>
						</tr>
						<tr>
							<td>Was protected capacity used?</td>
							<td>Assigned seats ÷ required seats</td>
							<td>1,599 ÷ 1,599</td>
						</tr>
						<tr>
							<td>Does CL divide correctly?</td>
							<td>13(7) + 14(6)</td>
							<td>175</td>
						</tr>
						<tr>
							<td>Does VT divide correctly?</td>
							<td>8(5) + 19(4)</td>
							<td>116</td>
						</tr>
						<tr>
							<td>Does REP match the calendar?</td>
							<td>12 Fridays × 6 students × 2 sessions</td>
							<td>144 half-days</td>
						</tr>
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
			<blockquote>
				<p>
					The solver can be perfectly consistent with its inputs while the inputs still need a human
					correction.
				</p>
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
				and faculty approval. An <code>OPTIMAL</code> status describes the mathematical model that was
				actually encoded. Faculty review and publication establish the official institutional schedule.
			</p>
			<h2 id="from-candidate-to-published-schedule">From candidate to published schedule</h2>
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
			<div class="table-wrap">
				<table aria-label="Candidate and published schedule changes">
					<thead>
						<tr>
							<th>Code</th>
							<th>Candidate</th>
							<th>Published</th>
							<th>Change</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>WI</td>
							<td>100</td>
							<td>106</td>
							<td>+6</td>
						</tr>
						<tr>
							<td>DSN</td>
							<td>55</td>
							<td>53</td>
							<td>−2</td>
						</tr>
						<tr>
							<td>SF</td>
							<td>55</td>
							<td>53</td>
							<td>−2</td>
						</tr>
						<tr>
							<td>OC</td>
							<td>48</td>
							<td>46</td>
							<td>−2</td>
						</tr>
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
			<h2 id="how-the-schedule-reaches-students">How the schedule reaches students</h2>
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
			<h2 id="where-the-time-savings-come-from">Where the time savings come from</h2>
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
			<h2 id="what-i-would-build-next">What I would build next</h2>
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
			<footer>
				<p>
					This article reports aggregate Fall 2026 third-year scheduling data. Student identities
					appear only in the consented clinic-distribution illustration; individual calendars and
					private correspondence are omitted.
				</p>
			</footer>
		</div>
	</article>
</div>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
	.article-page {
		min-height: 100vh;
		background: var(--background);
		color: var(--foreground);
	}
	article {
		width: min(100%, 760px);
		margin: 0 auto;
		padding: 3rem 1.25rem 5rem;
	}
	nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 3rem;
	}
	nav a {
		color: var(--muted-foreground);
		font-size: 0.875rem;
		text-decoration: none;
		transition: color 160ms ease;
	}
	nav a:hover {
		color: var(--foreground);
	}

	.article-copy h1 {
		max-width: 690px;
		margin: 0;
		font-size: clamp(2.45rem, 7vw, 3.75rem);
		font-weight: 750;
		letter-spacing: -0.055em;
		line-height: 0.98;
		text-wrap: balance;
	}
	.article-copy h1 + p {
		margin-top: 1.4rem;
		color: var(--muted-foreground);
		font-size: clamp(1.12rem, 2.7vw, 1.3rem);
		line-height: 1.62;
	}
	.article-copy h1 + p + p {
		margin-top: 1.35rem;
		color: var(--muted-foreground);
		font-size: 0.875rem;
	}
	.article-copy h1 + p + p + p {
		margin: 1rem 0 3.3rem;
		padding: 0.9rem 1rem;
		border-left: 2px solid color-mix(in oklab, var(--primary) 75%, var(--border));
		background: color-mix(in oklab, var(--primary) 5%, var(--background));
		color: var(--muted-foreground);
		font-size: 0.8rem;
		line-height: 1.55;
	}
	.article-copy h1 + p + p + p em {
		font-style: normal;
	}

	.article-copy h2 {
		margin: 3.75rem 0 1.25rem;
		scroll-margin-top: 2.5rem;
		font-size: clamp(1.65rem, 4vw, 2.05rem);
		font-weight: 720;
		letter-spacing: -0.035em;
		line-height: 1.15;
		text-wrap: balance;
	}
	.article-copy h3 {
		margin: 2.5rem 0 0.9rem;
		scroll-margin-top: 2.5rem;
		font-size: 1.24rem;
		font-weight: 680;
		letter-spacing: -0.02em;
		line-height: 1.25;
	}
	.article-copy p,
	.article-copy li {
		font-size: 1.07rem;
		line-height: 1.8;
	}
	.article-copy p {
		margin: 1.25rem 0 0;
	}
	.article-copy ul {
		margin: 1.25rem 0 0;
		padding-left: 1.35rem;
	}
	.article-copy li {
		padding-left: 0.35rem;
	}
	.article-copy li + li {
		margin-top: 0.75rem;
	}
	.article-copy li::marker {
		color: color-mix(in oklab, var(--primary) 78%, var(--foreground));
	}
	.article-copy strong {
		font-weight: 690;
	}

	.article-copy :global(.table-wrap) {
		margin: 1.65rem 0 0;
		overflow-x: auto;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		scrollbar-color: color-mix(in oklab, var(--muted-foreground) 45%, transparent)
			color-mix(in oklab, var(--muted) 75%, transparent);
		scrollbar-width: thin;
	}
	.article-copy :global(.table-wrap)::-webkit-scrollbar {
		height: 6px;
	}
	.article-copy :global(.table-wrap)::-webkit-scrollbar-thumb {
		border-radius: 999px;
		background: color-mix(in oklab, var(--muted-foreground) 45%, transparent);
	}
	.article-copy :global(.table-wrap)::-webkit-scrollbar-track {
		background: color-mix(in oklab, var(--muted) 75%, transparent);
	}
	.article-copy table {
		width: max(100%, 620px);
		border-spacing: 0;
		border-collapse: collapse;
		font-size: 0.91rem;
		line-height: 1.45;
	}
	.article-copy th,
	.article-copy td {
		padding: 0.8rem 0.9rem;
		border-right: 1px solid var(--border);
		border-bottom: 1px solid var(--border);
		text-align: left;
		vertical-align: top;
	}
	.article-copy th:last-child,
	.article-copy td:last-child {
		border-right: 0;
	}
	.article-copy tbody tr:last-child td {
		border-bottom: 0;
	}
	.article-copy th {
		background: color-mix(in oklab, var(--muted) 75%, var(--background));
		color: var(--muted-foreground);
		font-size: 0.76rem;
		font-weight: 650;
		letter-spacing: 0.02em;
	}

	.article-copy pre {
		margin: 1.6rem 0 0;
		padding: 1.25rem;
		overflow-x: auto;
		border: 1px solid var(--border);
		border-radius: 0.75rem;
		background: color-mix(in oklab, var(--muted) 68%, var(--background));
		font-size: 0.82rem;
		line-height: 1.8;
	}
	.article-copy code {
		font-family: 'Geist Mono', monospace;
	}
	.article-copy p code {
		padding: 0.12em 0.35em;
		border: 1px solid var(--border);
		border-radius: 0.28rem;
		background: var(--muted);
		font-size: 0.8em;
	}
	.article-copy blockquote {
		margin: 2rem 0;
		padding: 1.1rem 1.25rem 1.1rem 1.35rem;
		border-left: 3px solid color-mix(in oklab, var(--primary) 76%, var(--border));
		background: color-mix(in oklab, var(--primary) 6%, var(--background));
	}
	.article-copy blockquote p {
		margin: 0;
		font-size: 1.15rem;
		font-weight: 560;
		line-height: 1.6;
	}
	.article-copy footer {
		margin-top: 3rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--border);
		color: var(--muted-foreground);
		font-size: 0.82rem;
		line-height: 1.6;
	}
	.article-copy footer p {
		margin: 0;
		font-size: inherit;
		line-height: inherit;
	}

	@media (max-width: 640px) {
		article {
			padding-top: 2rem;
			padding-bottom: 4rem;
		}
		nav {
			margin-bottom: 2.5rem;
		}
		.article-copy h1 {
			letter-spacing: -0.045em;
		}
		.article-copy h1 + p + p + p {
			margin-bottom: 2.75rem;
		}
		.article-copy p,
		.article-copy li {
			font-size: 1rem;
			line-height: 1.75;
		}
	}
</style>
