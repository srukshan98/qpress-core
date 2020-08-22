import { RequestMappingDecorator } from './models/request-mapping-decorator.model';
import { Decorator } from './models/decorator.model';
import { RequestType } from './types/request.type';
import { ParameterProvider } from '../providers/parameter-provider';
/**
 *Request Mapping Decorator to map Requests
 *
 * @remarks
 * Can only be used inside Classes with Route Decorator
 *
 * @param {RequestType} [type=RequestType.GET]
 * @param {string} [path='/']
 */
export function RequestMapping(
    type: RequestType = RequestType.GET,
    path = '/'
): (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
) => PropertyDescriptor {
    return function (
        target: Object,
        key: string | symbol,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        const method: Function = ParameterProvider(
            target,
            key,
            descriptor.value,
            path
        );

        const decorator: Decorator = new RequestMappingDecorator(
            path,
            type,
            method,
            descriptor.value
        );
        if (target.constructor.prototype.decorators != null) {
            target.constructor.prototype.decorators.push(decorator);
        } else {
            target.constructor.prototype.decorators = [decorator];
        }

        return descriptor;
    };
}
