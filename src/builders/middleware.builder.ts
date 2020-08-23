import { AttachableDecorator } from './../decorators/models/attachable.model';
import { Request, Response, NextFunction } from 'express';
import { Middleware } from '../decorators';

type MiddlewareFunction = (
	request: Request,
	response: Response,
	next: NextFunction
) => void;

export class MiddlewareBuilder implements Middleware {
	decorators = [new AttachableDecorator()];
	private constructor(public middleware: MiddlewareFunction) {}

	static build(middlewareFunction: MiddlewareFunction): Function {
		function CustomMiddleware() {}
		CustomMiddleware.prototype = new MiddlewareBuilder(middlewareFunction);
		CustomMiddleware.prototype.decorators = [new AttachableDecorator()];
		CustomMiddleware.prototype.middleware = middlewareFunction;
		return CustomMiddleware;
	}
}
