/*
 * Lesson 01 build — reactive counter store.
 *
 * The `counter` object and the two functions below are correctly shaped.
 * What's missing: `counter` is not reactive. Wrap the object literal in
 * $state(...) to fix that.
 *
 * Remember the module-state rule (README Worked example 4): you CANNOT
 * export a $state primitive that gets reassigned across modules. Exporting
 * an object whose properties you mutate is fine — that's what we do here.
 */
export const counter = {
	count: 0
};

export function increment(): void {
	counter.count += 1;
}

export function reset(): void {
	counter.count = 0;
}
