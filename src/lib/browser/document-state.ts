import { browser } from '$app/environment';

const drawerBodyProps = [
	'overflow',
	'pointer-events',
	'position',
	'top',
	'left',
	'right',
	'height',
	'width',
	'touch-action'
] as const;

const revealBodyProps = [
	'overflow',
	'position',
	'top',
	'left',
	'right',
	'height',
	'width',
	'zoom',
	'transform',
	'transform-origin',
	'transition'
] as const;

const revealBodyCustomProps = [
	'--slide-width',
	'--slide-height',
	'--slide-scale',
	'--viewport-width',
	'--viewport-height'
] as const;

function clearInlineProps(element: HTMLElement, props: readonly string[]) {
	for (const prop of props) {
		element.style.removeProperty(prop);
	}
}

export function resetDrawerBodyLock() {
	if (!browser) {
		return;
	}

	const wasFixed = document.body.style.position === 'fixed';
	const offsetTop = Number.parseInt(document.body.style.top || '0', 10);
	const offsetLeft = Number.parseInt(document.body.style.left || '0', 10);

	clearInlineProps(document.body, drawerBodyProps);
	document.documentElement.style.removeProperty('scroll-behavior');

	if (wasFixed) {
		window.scrollTo({
			top: Number.isNaN(offsetTop) ? window.scrollY : -offsetTop,
			left: Number.isNaN(offsetLeft) ? window.scrollX : -offsetLeft,
			behavior: 'auto'
		});
	}
}

export function resetRevealDocumentState() {
	if (!browser) {
		return;
	}

	document.documentElement.classList.remove('reveal-full-page', 'zoomed');
	document.body.classList.remove('reveal-viewport', 'reveal-scroll');
	document.documentElement.style.removeProperty('--vh');

	clearInlineProps(document.body, revealBodyProps);
	clearInlineProps(document.body, revealBodyCustomProps);
}

export async function exitFullscreenIfActive() {
	if (!browser || !document.fullscreenElement || typeof document.exitFullscreen !== 'function') {
		return;
	}

	try {
		await document.exitFullscreen();
	} catch {
		// Ignore browser-level fullscreen failures and continue with document cleanup.
	}
}
