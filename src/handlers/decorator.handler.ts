import { NullMiddlewareException } from './../exceptions/decorators/null-middleware.exception';
import { AttachableDecorator } from './../decorators/models/attachable.model';
import { print } from './../providers/log.provider';
import { HTTPStatusCode } from './../express/models/status-code.model';
import { RequestType } from './../decorators/types/request.type';
import { RequestMappingDecorator } from './../decorators/models/request-mapping-decorator.model';
import { NullModuleDecoratorException } from './../exceptions/decorators/null-module-decorator.exception';
import { NullRouterException } from './../exceptions/null-router.exception';
import { Router, Request, Response, NextFunction } from 'express';
import { DecoratorType } from './../decorators/types/decorator.type';
import { ModuleDecorator } from './../decorators/models/module-decorator.model';
import { Decorator } from './../decorators/models/decorator.model';
import { NullDecoratorException } from '../exceptions/decorators/null-decorator.exception';
import { RouteDecorator } from '../decorators/models/route-decorator.model';
import { DumpError } from './error.handler';
import { NullRouteException } from '../exceptions/decorators/null-route.exception';
import { Middleware } from '../decorators';
import { NullInjectableException } from '../exceptions/decorators/null-injectable.exception';
import { InjectableDecorator } from '../decorators/models/injectable.model';
export class DecoratorHandler extends Map {
	private router: Router | undefined;

	constructor(public decorators: Decorator[], private module: Function) {
		super();
	}

	attachRouter(router?: Router): void {
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

	getMiddleware(): AttachableDecorator {
		return this.decorators.find(
			(decorator: Decorator) => decorator.type === DecoratorType.Attachable
		) as AttachableDecorator;
	}

	getInjectable(): InjectableDecorator {
		return this.decorators.find(
			(decorator: Decorator) => decorator.type === DecoratorType.Injectable
		) as InjectableDecorator;
	}

	getRequestMapping(): RequestMappingDecorator[] {
		return this.decorators.filter(
			(decorator: Decorator) => decorator.type === DecoratorType.RequestMapping
		) as RequestMappingDecorator[];
	}

	getType(): DecoratorType | null {
		if (this.getModule() != null) {
			return DecoratorType.Module;
		} else if (this.getRoute() != null) {
			return DecoratorType.Route;
		} else if (this.getMiddleware() != null) {
			return DecoratorType.Attachable;
		} else if (this.getInjectable() != null) {
			return DecoratorType.Injectable;
		}
		return null;
	}

	processDecorators(): void {
		this.checkRouter();

		const module: ModuleDecorator = this.getModule();
		const route: RouteDecorator = this.getRoute();
		const middleware: AttachableDecorator = this.getMiddleware();
		const provider: InjectableDecorator = this.getInjectable();

		if (module && route) {
			this.processModule(module, route.path);
		} else if (module) {
			this.processModule(module);
		} else if (route) {
			this.processRoute(route);
		} else if (middleware) {
			this.processMiddleware();
		} else if (provider) {
			this.processProvider();
		}
	}
	processMiddleware(): void {
		const middleware = this.module.prototype;
		let attachable: Middleware;
		try {
			attachable = new middleware.constructor();
		} catch (_) {
			attachable = new middleware();
		}

		this.router?.use((req: Request, res: Response, next: NextFunction) =>
			middleware.middleware.apply(attachable, [req, res, next])
		);
	}

	processProvider(): void {
		console.log('');
	}

	processModule(module: ModuleDecorator, path?: string): void {
		const imports: Function[] = module.module.imports ?? [];
		const controllers: Function[] = module.module.controllers ?? [];
		const middlewares: Function[] = module.module.middlewares ?? [];
		const providers: Function[] = module.module.providers ?? [];

		imports.length > 0 && print.log(imports.length, 'Imports were found');
		controllers.length > 0 &&
			print.log(controllers.length, 'Controllers were found');
		middlewares.length > 0 &&
			print.log(middlewares.length, 'Middlewares were found');
		providers.length > 0 &&
			print.log(middlewares.length, 'Providers were found');

		let router: Router | null = null;
		if (path) {
			print.log('Setting Module Route to ', path);
			router = Router();
		}

		providers.forEach((moduleClass) => {
			const decoratorHandler: DecoratorHandler = DecoratorHandler.fromModule(
				moduleClass
			);

			if (decoratorHandler.getType() !== DecoratorType.Injectable) {
				throw new NullInjectableException();
			}

			decoratorHandler.attachRouter(router ?? this.router);

			decoratorHandler.processDecorators();
		});

		middlewares.forEach((moduleClass) => {
			const decoratorHandler: DecoratorHandler = DecoratorHandler.fromModule(
				moduleClass
			);

			if (decoratorHandler.getType() !== DecoratorType.Attachable) {
				throw new NullMiddlewareException();
			}

			decoratorHandler.attachRouter(router ?? this.router);

			decoratorHandler.processDecorators();
		});

		imports.forEach((moduleClass) => {
			const decoratorHandler: DecoratorHandler = DecoratorHandler.fromModule(
				moduleClass
			);

			if (decoratorHandler.getType() !== DecoratorType.Module) {
				throw new NullModuleDecoratorException();
			}

			decoratorHandler.attachRouter(router ?? this.router);

			decoratorHandler.processDecorators();
		});
		controllers.forEach((moduleClass) => {
			const decoratorHandler: DecoratorHandler = DecoratorHandler.fromModule(
				moduleClass
			);

			if (decoratorHandler.getType() !== DecoratorType.Route) {
				throw new NullRouteException();
			}

			decoratorHandler.attachRouter(router ?? this.router);

			decoratorHandler.processDecorators();
		});

		if (path && router) {
			this.router?.use(path, router);
		}
	}

	processRoute(route: RouteDecorator): void {
		const myRouter = Router();
		print.log('Setting Route Path to ', route.path);

		const mappings = this.getRequestMapping();

		mappings.forEach((mapping) => {
			const controller = new this.module.prototype.constructor();

			const method = async (request: Request, response: Response) => {
				const parms = mapping.parmMethod(request, response);
				let methodReponse: { [key: string]: any } | null = null;
				try {
					methodReponse = await mapping.method.apply(controller, parms);
				} catch (e) {
					methodReponse = DumpError(e);
				}

				if (methodReponse == null) {
					response
						.status(HTTPStatusCode.InternalServerError)
						.send('Server has not handled errors properly');
				} else {
					response
						.status(methodReponse.StatusCode ?? HTTPStatusCode.OK)
						.send(methodReponse);
				}
			};

			switch (mapping.requestType) {
				case RequestType.DELETE:
					myRouter.delete(mapping.path, method);
					break;
				case RequestType.POST:
					myRouter.post(mapping.path, method);
					break;
				case RequestType.PUT:
					myRouter.put(mapping.path, method);
					break;
				default:
					myRouter.get(mapping.path, method);
			}
		});

		this.router?.use(route.path, myRouter);
	}

	checkRouter(): void {
		if (this.router == null) throw new NullRouterException();
	}

	static fromModule(module: Function): DecoratorHandler {
		print.info('Processing ', module.name);

		const decorators: Decorator[] = module.prototype.decorators;

		if (decorators == null) {
			throw new NullDecoratorException();
		}
		return new DecoratorHandler(decorators, module);
	}
}
