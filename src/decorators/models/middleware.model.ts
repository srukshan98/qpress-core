import { Request, Response, NextFunction } from 'express';
import { Decorator } from './decorator.model';
export interface Middleware {
	decorators?: Decorator[];
	middleware(request: Request, response: Response, next: NextFunction): void;
}
