export class ProviderTypeNotFoundException extends Error {
	name = 'ProviderTypeNotFoundException';

	constructor(moduleName: string) {
		super(
			`Dependency Injection Failed in ${moduleName}. Provider was not found`
		);
	}
}
