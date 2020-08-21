import { Express } from 'express';
import { DecoratorHandler } from '../handlers/decorator.handler';
import { DecoratorType } from '../decorators/types/decorator.type';
import { NullModuleDecoratorException } from '../exceptions/decorators/null-module-decorator.exception';
export class QExpress {
    constructor(public express: Express) {}

    attachModule(module: Function): void {
        const decoratorHandler: DecoratorHandler = DecoratorHandler.fromModule(
            module
        );

        if (decoratorHandler.getType() !== DecoratorType.Module) {
            throw new NullModuleDecoratorException();
        }

        decoratorHandler.attachRouter(this.express);

        decoratorHandler.processDecorators();
    }

    runApp(port = process.env.PORT || 3000): void {
        this.express.listen(port, () => {
            console.info(
                `Quick Express Server is running in http://localhost:${port}`
            );
        });
    }
}
