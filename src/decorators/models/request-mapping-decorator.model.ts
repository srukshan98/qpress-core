import { RequestType } from './../types/request.type';
import { Decorator } from './decorator.model';
import { DecoratorType } from '../types/decorator.type';

export class RequestMappingDecorator extends Decorator {
	constructor(
		public path: string,
		public requestType: RequestType,
		public parmMethod: Function,
		public method: Function
	) {
		super(DecoratorType.RequestMapping);
	}
}
