import { DecoratorType } from '../types/decorator.type';
import { Decorator } from './decorator.model';
export class RouteDecorator extends Decorator {
	constructor(public path: string) {
		super(DecoratorType.Route);
	}
}
