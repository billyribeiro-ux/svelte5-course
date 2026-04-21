export const counter = $state({
	count: 0
});

export function increment(): void {
	counter.count += 1;
}

export function reset(): void {
	counter.count = 0;
}
