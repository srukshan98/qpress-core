import { DecoratorException } from './decorator.exception';
export class NullMiddlewareException extends DecoratorException {
	constructor() {
		super('Middleware Class not extended Not Found');
	}
}
