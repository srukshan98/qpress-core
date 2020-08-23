import { LogLevelType } from './../types/log-level.type';
import { OptionsJson } from 'body-parser';

export interface AppConfig {
	JsonParser: boolean;
	ParserConfig?: OptionsJson;
	LogLevel?: LogLevelType;
}
