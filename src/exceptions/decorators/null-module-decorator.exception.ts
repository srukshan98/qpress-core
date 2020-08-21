import { DecoratorException } from './decorator.exception';
export class NullModuleDecoratorException extends DecoratorException {
    constructor() {
        super('Module Decorator Not Found');
    }
}
