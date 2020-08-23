import { DecoratorType } from '../types/decorator.type';
import { Decorator } from './decorator.model';
import { ModuleModel } from './module.model';
export class ModuleDecorator extends Decorator {
	constructor(public module: ModuleModel) {
		super(DecoratorType.Module);
	}
}
