export class Todo {
	text = $state('');
	done = $state(false);

	constructor(text: string) {
		this.text = text;
	}

	toggle = (): void => {
		this.done = !this.done;
	};
}
