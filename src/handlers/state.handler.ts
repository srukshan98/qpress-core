export function doInitialize(classObj: any, args: any[] = []): any {
	const obj: any = new classObj(...args);
	if (obj.init) {
		obj.init();
	}

	return obj;
}

export function doDestroy(obj: any): void {
	if (obj.destroy) {
		obj.destroy();
	}
}
