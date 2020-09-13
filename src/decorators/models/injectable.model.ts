import { Decorator } from './decorator.model';
import { DecoratorType } from '../types/decorator.type';
import { ProviderModel } from './provider.model';
export class InjectableDecorator extends Decorator {
	constructor(public model: ProviderModel) {
		super(DecoratorType.Injectable);
	}
}
