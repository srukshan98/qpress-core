export class ProviderException extends Error {
	name = 'ProviderException';

	constructor(public message: string) {
		super(message);
	}
}
