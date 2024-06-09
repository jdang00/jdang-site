<script lang="ts">
	import Slide from './slide.svelte';
	import { BookText } from 'lucide-svelte';
	import '../../app.css';
</script>

<Slide>
	<div class="text-left">
		<span>History of the Bible in the English Language</span>
		<p class="text-gray-300 text-2xl">Part 1</p>
	</div>
</Slide>

<Slide>
	<img
		src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg/1280px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg"
		alt="The Tower of Babel"
	/>
</Slide>

<Slide>
	<p>Imago Dei</p>
	<p class="text-gray-300 text-2xl">"The Image of God"</p>

	<p class="text-gray-300 text-lg">Genesis 1:27</p>
</Slide>

<Slide>
	<span class="text-gray-300">Language is a powerful characteristic of the imago Dei.</span>
</Slide>

<Slide>
	<div class="flex flex-row justify-between">
		<div class="flex flex-col gap-4">
			<span>Old Testament</span>
			<ul>
				<li>Hebrew</li>
				<li>Aramaic</li>
			</ul>
		</div>
		<ul class="relative border-s border-gray-200 min-h-xl"></ul>
		<div class="flex flex-col gap-4">
			<span>New Testament</span>
			<ul>
				<li>Greek</li>
			</ul>
		</div>
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
	<p class="mb-16 text-left">Vulgate Based English Translations</p>
	<div class="flex flex-row gap-6">
		<div class="p-12 bg-red-400 rounded-lg flex flex-col">
			<span>Wycliffe Bible</span><span class="text-sm">c.1380</span>
			<img
				src="https://utfs.io/f/04f52526-95ec-46be-a725-d572fae61a17-jg601o.webp"
				alt="jw"
				class="rounded-lg"
			/>
		</div>
		<div class="p-12 bg-red-400 rounded-lg flex flex-col">
			<span>Tyndale Bible</span><span class="text-sm">c.1525</span>
			<img
				src="https://utfs.io/f/b0e958ef-e415-492b-bfc6-68ccbcbf8748-e50v9d.webp"
				alt="WT"
				class="rounded-lg"
			/>
		</div>

		<div class="p-12 bg-red-400 rounded-lg flex flex-col">
			<span>The Great Bible</span><span class="text-sm">c.1539</span>
			<img
				src="https://utfs.io/f/6a4fd142-1b95-4698-929f-9c147a33a9bd-1n1frs.webp"
				alt="WT"
				class="rounded-lg"
			/>
		</div>
	</div>
</Slide>

<Slide>
	<div class="h-[700px] flex justify-center">
		<img
			src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Portret_van_Desiderius_Erasmus%2C_RP-P-OB-7388.jpg/800px-Portret_van_Desiderius_Erasmus%2C_RP-P-OB-7388.jpg"
			alt="TR"
			class="object-fill"
		/>
	</div>
</Slide>

<Slide>
	<p class="mb-16 text-left">Textus Receptus Based English Translations</p>
	<div class="flex flex-row gap-6">
		<div class="p-12 bg-green-400 rounded-lg flex flex-col">
			<span>Geneva Bible</span><span class="text-sm">c.1560</span>
			<img
				src="https://utfs.io/f/e7b801a4-7168-4221-b314-4e7282f5e7a4-mmbypf.webp"
				alt="jw"
				class="rounded-lg"
			/>
		</div>
		<div class="p-12 bg-green-400 rounded-lg flex flex-col">
			<span>Bishop's Bible</span><span class="text-sm">c.1568</span>
			<img
				src="https://utfs.io/f/b50f65c0-c695-442c-8f76-00a52c590943-1zobf.webp"
				alt="WT"
				class="rounded-lg object-fill"
			/>
		</div>

		<div class="p-12 bg-green-400 rounded-lg flex flex-col">
			<span>King James Version</span><span class="text-sm">c.1611</span>
			<img
				src="https://utfs.io/f/0bde225e-8708-4201-ba49-8b418801c214-264rg.webp"
				alt="WT"
				class="rounded-lg object-fill"
			/>
		</div>
	</div>
</Slide>

<Slide>
	<p class="mb-16 text-left">Critical Text Based English Translations</p>
	<div class="flex flex-row gap-6 justify-center">
		<div class="p-12 bg-blue-400 rounded-lg flex flex-col">
			<span> English Revised Version</span><span class="text-sm">c.1885</span>
			<img
				src="https://utfs.io/f/f5f028aa-c0dd-438b-9ad6-960788963f30-210.webp"
				alt="WT"
				class="rounded-lg object-fill"
			/>
		</div>
		<div class="p-12 bg-blue-400 rounded-lg flex flex-col">
			<span>American Standard Version</span><span class="text-sm">c.1901</span>
			<img
				src="https://utfs.io/f/13ddab41-dc1f-4c77-a8e5-6486225288bc-1e90.webp"
				alt="WT"
				class="rounded-lg object-fill"
			/>
		</div>

		<div class="p-12 bg-blue-400 rounded-lg flex flex-col">
			<span>Revised Standard Version</span><span class="text-sm">c.1952</span>
			<img
				src="https://utfs.io/f/71abfa8e-03ab-46b3-9a11-9d034bd84326-1qut.webp"
				alt="WT"
				class="rounded-lg object-fill"
			/>
		</div>
	</div>
</Slide>

<Slide>
	<div class="flex justify-center">
		<img src="https://utfs.io/f/d60f8f25-c29e-4962-91bb-b0c27992f65d-30fu4b.png" alt="it" />
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
