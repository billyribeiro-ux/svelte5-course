/*
 * Lesson 05 — the command list, defined once.
 *
 * Plain TS data. No reactive state lives here — every consumer wraps the
 * list in their own $state for selection / filtering / ranking.
 */

export type Command = {
	id: string;
	title: string;
	keywords: string;
	run: () => void;
};

function log(label: string): () => void {
	return () => console.log(`[command palette] ${label}`);
}

export const commands: Command[] = [
	{ id: 'goto-dashboard', title: 'Go to dashboard', keywords: 'home overview', run: log('go to dashboard') },
	{ id: 'goto-settings', title: 'Open settings', keywords: 'preferences profile', run: log('open settings') },
	{ id: 'toggle-theme', title: 'Toggle theme', keywords: 'dark light appearance', run: log('toggle theme') },
	{ id: 'new-project', title: 'New project…', keywords: 'create folder workspace', run: log('new project') },
	{ id: 'new-doc', title: 'New document', keywords: 'create note md', run: log('new doc') },
	{ id: 'search-files', title: 'Search files…', keywords: 'find grep ripgrep', run: log('search files') },
	{ id: 'reload', title: 'Reload window', keywords: 'refresh', run: log('reload window') },
	{ id: 'help', title: 'Show keyboard shortcuts', keywords: 'help hotkeys', run: log('show shortcuts') },
	{ id: 'sign-out', title: 'Sign out', keywords: 'logout exit', run: log('sign out') }
];
