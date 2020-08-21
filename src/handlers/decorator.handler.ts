import { NullRouterException } from './../exceptions/null-router.exception';
import { Router } from 'express';
import { DecoratorType } from './../decorators/types/decorator.type';
import { ModuleDecorator } from './../decorators/models/module-decorator.model';
import { Decorator } from './../decorators/models/decorator.model';
import { NullDecoratorException } from '../exceptions/decorators/null-decorator.exception';
import { RouteDecorator } from '../decorators/models/route-decorator.model';
export class DecoratorHandler {
    private router: Router | undefined;
    constructor(public decorators: Decorator[]) {}

    attachRouter(router: Router): void {
        this.router = router;
    }

    getModule(): ModuleDecorator {
        return this.decorators.find(
            (decorator: Decorator) => decorator.type === DecoratorType.Module
        ) as ModuleDecorator;
    }

    getRoute(): RouteDecorator {
        return this.decorators.find(
            (decorator: Decorator) => decorator.type === DecoratorType.Route
        ) as RouteDecorator;
    }

    getType(): DecoratorType | null {
        if (this.getModule() != null) {
            return DecoratorType.Module;
        } else if (this.getRoute() != null) {
            return DecoratorType.Route;
        }
        return null;
    }

    processDecorators(): void {
        this.checkRouter();
    }
    checkRouter(): void {
        if (this.router == null) throw new NullRouterException();
    }

    static fromModule(module: Function): DecoratorHandler {
        const decorators: Decorator[] = module.prototype.decorators;

        if (decorators == null) {
            throw new NullDecoratorException();
        }
        return new DecoratorHandler(decorators);
    }
}
