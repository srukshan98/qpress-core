export class NullRouterException extends Error {
	name = 'NullRouterException';
	message = 'Router Is Not Found';

	constructor() {
		super('Router Is Not Found');
	}
}
