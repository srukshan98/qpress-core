import { ModuleDecorator } from './models/module-decorator.model';
import { Decorator } from './models/decorator.model';
import { ModuleModel } from './models/module.model';

/**
 * Module Decorator
 *  ●  Import Modules or Controllers
 *
 * @param {string} path The Controller Route Path
 */
export function Module(module: ModuleModel): (constructor: Function) => void {
    return function (constructor: Function) {
        const decorator: Decorator = new ModuleDecorator(module);
        if (constructor.prototype.decorators != null) {
            constructor.prototype.decorators.push(decorator);
        } else {
            constructor.prototype.decorators = [decorator];
        }
    };
}
