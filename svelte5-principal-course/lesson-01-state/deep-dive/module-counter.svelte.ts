/*
 * Lesson 01 deep-dive — sharing $state across files.
 *
 * The compiler transforms `$state` reads/writes file-by-file. So if you
 * export a $state PRIMITIVE and another file imports it, the importing
 * file sees the underlying value — not a reactive getter.
 *
 * Two safe patterns:
 *
 * Pattern A — "export an object, mutate its properties."
 *   The export is the same object reference forever; nothing gets
 *   reassigned. Reactivity rides on property reads/writes through
 *   the proxy. Simplest. Used by the lesson's /04-module route.
 *
 * Pattern B — "export getter/setter functions."
 *   Keep the $state variable file-private and expose narrow access.
 *   Slightly more boilerplate, but the API is explicit and the value
 *   can be a primitive.
 */

// ===== Pattern A — object-with-mutations =====
export const counterA = $state({ count: 0 });

export function incrementA(): void {
	counterA.count += 1;
}

// ===== Pattern B — getter/setter functions =====
let _count = $state(0);

export function getCountB(): number {
	return _count;
}

export function incrementB(): void {
	_count += 1;
}

export function resetB(): void {
	_count = 0;
}
