<script lang="ts">
	import Slide from './slide.svelte';
	import { BookText } from 'lucide-svelte';
	import '../../app.css';
</script>

<Slide>
	<div class="text-left">
		<span>History of the Bible in the English Language</span>
		<p class="text-gray-300 text-2xl">Part 2</p>
	</div>
</Slide>

<Slide>
	<div class="flex flex-col text-left">
		<span class="mb-12">Old Testament</span>
		<div class="flex flex-row gap-4">
			<BookText class="h-10 w-10 self-ctenter" />
			<span>Septuagint</span>
			<p class="text-gray-500 text-sm">(300–100 BC)</p>
		</div>

		<div class="flex flex-row gap-4">
			<BookText class="h-10 w-10 self-center" />
			<span>Masoretic Text</span>
			<p class="text-gray-500 text-sm">(100-1200 AD)</p>
		</div>
	</div>
</Slide>

<Slide>
	<div class="flex flex-col text-left">
		<span class="mb-12">New Testament</span>
		<div class="flex flex-row gap-4">
			<BookText class="h-10 w-10 self-ctenter" />
			<span class="text-red-400">Vulgate</span>
			<p class="text-gray-500 text-sm">(4th century AD)</p>
		</div>

		<div class="flex flex-row gap-4">
			<BookText class="h-10 w-10 self-center" />
			<span class="text-green-400">Byzantine Texts</span>
			<p class="text-gray-500 text-sm">Majority Text</p>
		</div>

		<div class="flex flex-row gap-4">
			<BookText class="h-10 w-10 self-center" />
			<span class="text-blue-400">Alexandrian Texts</span>
			<p class="text-gray-500 text-sm">Critical Text</p>
		</div>
	</div>
</Slide>

<Slide>
	<div class="flex justify-center">
		<img src="https://utfs.io/f/e33f55e0-1ee4-4de4-b474-4c51415300a5-30fu4b.png" alt="it" />
	</div>
</Slide>

<Slide>
	<span class="text-gray-300">Translation Ethos</span>
	<div class="flex flex-row gap-4">
		<span>Literal</span>
		<div class="border-b w-full my-8"></div>
		<span>Paraphrase</span>
	</div>
</Slide>

<Slide>
	<div class="flex flex-col text-left">
		<span class="ms-32">NASB</span>
		<div class="flex flex-row gap-4">
			<span>Literal</span>
			<div class="border-b w-full my-8"></div>
			<span>Paraphrase</span>
		</div>
	</div>
</Slide>

<Slide>
	<div class="flex flex-col text-right">
		<span class="me-56">MSG</span>
		<div class="flex flex-row gap-4">
			<span>Literal</span>
			<div class="border-b w-full my-8"></div>
			<span>Paraphrase</span>
		</div>
	</div>
</Slide>

<Slide>
	<span>New American Standard Version</span>
	<p class="text-gray-300">NASB (1971)</p>
	<table class="text-2xl mt-4">
		<tr>
			<th>Translation ethos:</th>
			<td>Formal equivalence</td>
		</tr>
		<tr>
			<th>Publisher:</th>
			<td>Lockman Foundation</td>
		</tr>
		<tr>
			<th>Derived from:</th>
			<td>American Standard Version</td>
		</tr>
	</table>
</Slide>

<Slide>
	<span>New Revised Standard Version</span>
	<p class="text-gray-300">NRSV (1989)</p>
	<table class="text-2xl mt-4">
		<tr>
			<th>Translation ethos:</th>
			<td>Formal equivalence</td>
		</tr>
		<tr>
			<th>Publisher:</th>
			<td>National Council of Churches</td>
		</tr>
		<tr>
			<th>Derived from:</th>
			<td>RSV</td>
		</tr>
	</table>
</Slide>

<Slide>
	<span>New International Version</span>
	<p class="text-gray-300">NIV (1978)</p>
	<table class="text-2xl mt-4">
		<tr>
			<th>Translation ethos:</th>
			<td>Dynamic equivalence</td>
		</tr>
		<tr>
			<th>Publisher:</th>
			<td>Biblica</td>
		</tr>
		<tr>
			<th>Derived from:</th>
			<td>Critical Texts</td>
		</tr>
	</table>
</Slide>

<Slide>
	<span>New Living Translation</span>
	<p class="text-gray-300">NLT (1986)</p>
	<table class="text-2xl mt-4">
		<tr>
			<th>Translation ethos:</th>
			<td>Dynamic equivalence</td>
		</tr>
		<tr>
			<th>Publisher:</th>
			<td>Tyndale House Foundation</td>
		</tr>
		<tr>
			<th>Derived from:</th>
			<td>The Living Bible</td>
		</tr>
	</table>
</Slide>

<Slide>
	<span>English Standard Version</span>
	<p class="text-gray-300">ESV (2001)</p>
	<table class="text-2xl mt-4">
		<tr>
			<th>Translation ethos:</th>
			<td>Formal equivalence</td>
		</tr>
		<tr>
			<th>Publisher:</th>
			<td>Crossway</td>
		</tr>
		<tr>
			<th>Derived from:</th>
			<td>RSV</td>
		</tr>
	</table>
</Slide>

<Slide>
	<span>Christian Standard Bible</span>
	<p class="text-gray-300">CSB (1986)</p>
	<table class="text-2xl mt-4">
		<tr>
			<th>Translation ethos:</th>
			<td>Optimal equivalence</td>
		</tr>
		<tr>
			<th>Publisher:</th>
			<td>Holman Bible Publishers</td>
		</tr>
		<tr>
			<th>Derived from:</th>
			<td>HCSB</td>
		</tr>
	</table>
</Slide>

<Slide>
	<span>Legacy Standard Bible</span>
	<p class="text-gray-300">LSB (2021)</p>
	<table class="text-2xl mt-4">
		<tr>
			<th>Translation ethos:</th>
			<td>Formal equivalence</td>
		</tr>
		<tr>
			<th>Publisher:</th>
			<td>Lockman + Masters</td>
		</tr>
		<tr>
			<th>Derived from:</th>
			<td>NASB</td>
		</tr>
	</table>
</Slide>
