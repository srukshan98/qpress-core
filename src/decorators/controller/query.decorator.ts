import { ParmTypes } from '../../handlers/types/parms.type';
import { MetadataConfig } from '../../config/meta.config';

/**
 *Query Annotation - Bind Named Query of Request
 *
 * @remarks
 * Cany Only Be used inside RequestMapping Annotated Methods.
 *
 * @param {Object} target
 * @param {(string | symbol)} propertyKey
 * @param {number} parameterIndex
 */
export function Query(
	target: Object,
	propertyKey: string | symbol,
	parameterIndex: number
): void {
	const existingRequiredParameters: ParmTypes[] =
		Reflect.getOwnMetadata(MetadataConfig.request, target, propertyKey) || [];
	existingRequiredParameters[parameterIndex] = ParmTypes.Query;
	Reflect.defineMetadata(
		MetadataConfig.request,
		existingRequiredParameters,
		target,
		propertyKey
	);
}
