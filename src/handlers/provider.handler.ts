import { ProviderTypeNotFoundException } from './../exceptions/provider.exception';
import { Request, Response } from 'express';
import { ProviderLifeSpan } from '../decorators/models/provider.model';
import { doDestroy, doInitialize } from './state.handler';

export class ProviderHandler {
	providerList: { [key: string]: { type: ProviderLifeSpan; obj: object } } = {};
	providerStore: {
		[key: string]: { type: ProviderLifeSpan; obj: Function };
	} = {};

	constructor(private parentHandler?: ProviderHandler) {}

	initializeOnRequest(req: Request, res: Response): void {
		this.destroyRequestProviders();

		Object.keys(this.providerStore).forEach((key: string) => {
			if (this.providerStore[key].type === ProviderLifeSpan.Request) {
				let obj: any;
				if (this.parentHandler && this.parentHandler.providerList[key]) {
					obj = this.parentHandler.providerList[key].obj;
				}
				if (obj == null) {
					obj = this.initializeWithProviderInjection(
						this.providerStore[key].obj
					);
					obj.Request = req;
					obj.Response = res;
				}
				this.providerList[key] = {
					...this.providerStore[key],
					obj: obj,
				};
			}
		});
	}

	destroyRequestProviders(): void {
		Object.keys(this.providerList).forEach((key: string) => {
			if (this.providerList[key].type != ProviderLifeSpan.Application) {
				doDestroy(this.providerList[key].obj);
				delete this.providerList[key];
			}
		});
	}

	initializeOnInstant(): void {
		this.destroyInstantProviders();

		Object.keys(this.providerStore).forEach((key: string) => {
			if (this.providerStore[key].type === ProviderLifeSpan.Instant) {
				this.providerList[key] = {
					...this.providerStore[key],
					obj: doInitialize(this.providerStore[key].obj.prototype.constructor),
				};
			}
		});
	}

	private destroyInstantProviders() {
		Object.keys(this.providerList).forEach((key: string) => {
			if (this.providerList[key].type == ProviderLifeSpan.Instant) {
				doDestroy(this.providerList[key].obj);
				delete this.providerList[key];
			}
		});
	}

	addProvider({
		type,
		module,
	}: {
		type: ProviderLifeSpan;
		module: Function;
	}): void {
		this.providerStore[module.name] = {
			type: type,
			obj: module,
		};

		if (type == ProviderLifeSpan.Application) {
			let obj: any;
			if (this.parentHandler && this.parentHandler.providerList[module.name]) {
				obj = this.parentHandler.providerList[module.name].obj;
			}
			if (obj == null) {
				obj = this.initializeWithProviderInjection(
					this.providerStore[module.name].obj
				);
			}
			this.providerList[module.name] = {
				type: type,
				obj: obj,
			};
		}
	}

	initializeWithProviderInjection<T>(module: Function): T {
		this.initializeOnInstant();

		const paramTupleTypes: object[][] =
			module.prototype.constructorParams ?? [];

		const params: Object[] = paramTupleTypes.map(
			(paramType: any): Object => {
				const obj = Object.values(this.providerList).find(
					(v: { type: ProviderLifeSpan; obj: object }) =>
						v.obj instanceof paramType
				)?.obj;
				if (obj) {
					return obj;
				}
				throw new ProviderTypeNotFoundException(module.name);
			}
		);

		return doInitialize(module.prototype.constructor, params);
	}
}
