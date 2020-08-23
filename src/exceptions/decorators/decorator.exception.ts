export class DecoratorException extends Error {
	name = 'DecoratorException';

	constructor(public message: string) {
		super(message);
	}
}
