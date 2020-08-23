import { Request, Response, NextFunction } from 'express';
import { Decorator } from './decorator.model';
export abstract class Middleware {
	decorators?: Decorator[];
	abstract middleware(
		request: Request,
		response: Response,
		next: NextFunction
	): void;
}
