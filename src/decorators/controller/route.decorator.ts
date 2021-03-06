import { ClassDecorator } from './../types/decorator.type';
import { Decorator } from '../models/decorator.model';
import { RouteDecorator } from '../models/route-decorator.model';

/**
 *Route Decorator For Controllers
 *
 * @param {string} path The Controller Route Path
 */
export function Route(path: string): ClassDecorator {
	return function (constructor: Function): void {
		const newPath: string = path.substr(0, 1) === '/' ? path : '/' + path;

		const decorator: Decorator = new RouteDecorator(newPath);
		if (constructor.prototype.decorators != null) {
			constructor.prototype.decorators.push(decorator);
		} else {
			constructor.prototype.decorators = [decorator];
		}

		const r = Reflect.getMetadata('design:paramtypes', constructor);
		constructor.prototype.constructorParams = r;
	};
}
