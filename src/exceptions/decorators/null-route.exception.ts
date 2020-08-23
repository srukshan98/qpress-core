import { DecoratorException } from './decorator.exception';
export class NullRouteException extends DecoratorException {
	constructor() {
		super('Route Decorator Not Found');
	}
}
