import { Request, Response } from 'express';
import { MetadataConfig } from '../config/meta.config';
import { ParmTypes } from '../handlers/types/parms.type';

export function ParameterProvider(
	target: object,
	methodName: string | symbol,
	method: Function,
	path: string
): Function {
	return (request: Request, response: Response) => {
		return GetParms(target, methodName, method, path, request, response);
	};
}

function GetParms(
	target: object,
	methodName: string | symbol,
	method: Function,
	path: string,
	request: Request,
	response: Response
): any[] {
	const methodParms: string[] = GetParameters(method);
	const urlQueryParms: RegExpMatchArray | null = path.match(/(?<=:)(\w)*/g);
	const decParms: ParmTypes[] =
		Reflect.getOwnMetadata(MetadataConfig.request, target, methodName) ||
		[];
	const requestParms: any[] = [];

	for (let index = 0; index < methodParms.length; index++) {
		const parm: string = methodParms[index];

		//#region  Assigning By Annotations
		if (decParms[index] != null) {
			switch (decParms[index]) {
				case ParmTypes.Body:
					requestParms[index] = request.body;
					break;
				case ParmTypes.Query:
					requestParms[index] = request.query[parm];
					break;
				case ParmTypes.Request:
					requestParms[index] = request;
					break;
				case ParmTypes.Response:
					requestParms[index] = response;
					break;
				default:
					break;
			}
			continue;
		}
		//#endregion

		//#region Assigning Query Parameters
		const queryParmId: number = urlQueryParms
			? urlQueryParms.findIndex((qParm: string) => parm === qParm)
			: -1;
		if (queryParmId !== -1) {
			requestParms[index] = request.params[parm];
			continue;
		}
		//#endregion

		//#region Assinging Parameters
		const parmId: number = Object.keys(request.query).findIndex(
			(qParm: string) => parm === qParm
		);
		if (parmId !== -1) {
			requestParms[index] = request.query[parm];
			continue;
		}
		//#endregion

		requestParms[index] = request.body[parm];
	}

	return requestParms;
}

function GetParameters(func: Function): string[] {
	return _getParameters(func)
		.split(',')
		.filter((parm: string) => parm != '');
}
function _getParameters(func: Function) {
	const parms = new RegExp('(?:' + func.name + '\\s*|^)\\s*\\((.*?)\\)').exec(
		func.toString().replace(/\n/g, '')
	);
	if (parms == null) {
		return '';
	}
	return parms[1].replace(/\/\*.*?\*\//g, '').replace(/ /g, '');
}
