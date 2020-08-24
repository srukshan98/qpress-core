import { DecoratorException } from './decorator.exception';
export class NullInjectableException extends DecoratorException {
  constructor() {
    super('Injectable Decorator Not Found');
  }
}
