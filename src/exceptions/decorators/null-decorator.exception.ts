import { DecoratorException } from './decorator.exception';
export class NullDecoratorException extends DecoratorException {
	constructor() {
		super('No Decorators were Found');
	}
}
