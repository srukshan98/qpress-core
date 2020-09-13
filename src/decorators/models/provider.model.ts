export class ProviderModel {
	lifeSpan: ProviderLifeSpan = ProviderLifeSpan.Request;
}

export enum ProviderLifeSpan {
	Application,
	Request,
	Instant,
}
