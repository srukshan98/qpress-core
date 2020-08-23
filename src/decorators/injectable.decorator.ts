import { ClassDecorator } from './types/decorator.type';
import { Decorator } from './models/decorator.model';
import { InjectableDecorator } from './models/injectable.model';
/**
 *Injectable Decorator For Providers
 *
 */
export function Injectable(): ClassDecorator {
	return function (constructor: Function): void {
		const decorator: Decorator = new InjectableDecorator();
		if (constructor.prototype.decorators != null) {
			constructor.prototype.decorators.push(decorator);
		} else {
			constructor.prototype.decorators = [decorator];
		}
	};
}
