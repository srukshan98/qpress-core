import { HTTPStatusCode } from './../express/models/status-code.model';
export function DumpError(
	e: any,
	code: HTTPStatusCode = HTTPStatusCode.InternalServerError
): {
	[key: string]: any;
} {
	const methodReponse: { [key: string]: any } | null = {
		StatusCode: code,
	};
	if (typeof e === 'object') {
		if (e.message) {
			methodReponse.Message = e.message;
		}
		if (e.stack) {
			methodReponse.StackTrace = e.stack;
		}
	} else {
		methodReponse.Message = 'Error :: argument is not an object';
	}
	return methodReponse;
}
