export enum DecoratorType {
	Module,
	Route,
	RequestMapping,
	Injectable,
	Attachable,
}

export type ClassDecorator = (constructor: Function) => void;

export type MethodDecorator = (
	target: Object,
	key: string | symbol,
	descriptor: PropertyDescriptor
) => PropertyDescriptor;
