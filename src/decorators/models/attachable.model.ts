import { Decorator } from './decorator.model';
import { DecoratorType } from '../types/decorator.type';
export class AttachableDecorator extends Decorator {
	constructor() {
		super(DecoratorType.Attachable);
	}
}
