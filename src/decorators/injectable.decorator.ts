import { ClassDecorator } from './types/decorator.type';
import { Decorator } from './models/decorator.model';
import { InjectableDecorator } from './models/injectable.model';
import { ProviderModel } from './models/provider.model';
/**
 *Injectable Decorator For Providers
 *
 */
export function Injectable(model: ProviderModel): ClassDecorator {
	return function (constructor: Function): void {
		const decorator: Decorator = new InjectableDecorator(model);
		if (constructor.prototype.decorators != null) {
			constructor.prototype.decorators.push(decorator);
		} else {
			constructor.prototype.decorators = [decorator];
		}

		const r = Reflect.getMetadata('design:paramtypes', constructor);
		constructor.prototype.constructorParams = r;
	};
}
