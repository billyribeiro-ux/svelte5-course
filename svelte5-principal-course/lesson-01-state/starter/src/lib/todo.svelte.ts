/*
 * Lesson 01 build — make this class reactive.
 *
 * As written, `text` and `done` are plain class fields. Assignments to them
 * won't update the UI. Turn them into reactive state by replacing each
 * declaration with `$state(...)`.
 *
 * Then add an arrow-function method `toggle` that flips `done`.
 *
 * Why arrow functions: passing `todo.toggle` to an event handler rebinds
 * `this` to the DOM element that fired. Arrow fields capture the instance's
 * `this` once, at construction, and keep it bound forever.
 *
 * Removing a Todo from a list does NOT belong on this class — it would force
 * Todo to know about its container, which is the kind of coupling that ages
 * poorly. Handle remove in the /03-class route component instead.
 *
 * The /03-class route imports this class. Go there once the class is reactive.
 */
export class Todo {
	text: string;
	done: boolean = false;

	constructor(text: string) {
		this.text = text;
	}
}
