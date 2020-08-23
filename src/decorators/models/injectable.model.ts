import { Decorator } from './decorator.model';
import { DecoratorType } from '../types/decorator.type';
export class InjectableDecorator extends Decorator {
	constructor() {
		super(DecoratorType.Injectable);
	}
}
