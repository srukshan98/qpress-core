import { AttachableDecorator } from './models/attachable.model';
import { ClassDecorator } from './types/decorator.type';
import { NullMiddlewareException } from '../exceptions/decorators/null-middleware.exception';
import { Decorator } from './models/decorator.model';

/**
 *Attachable Decorator For Middleware
 *
 */
export function Attachable(): ClassDecorator {
	return function (constructor: Function): void {
		if (!constructor.prototype.middleware) {
			throw new NullMiddlewareException();
		}

		const decorator: Decorator = new AttachableDecorator();
		if (constructor.prototype.decorators != null) {
			constructor.prototype.decorators.push(decorator);
		} else {
			constructor.prototype.decorators = [decorator];
		}
	};
}
